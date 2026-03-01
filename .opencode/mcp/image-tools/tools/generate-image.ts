import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { uploadToS3 } from '../utils/s3-upload.js';

export function register(server: McpServer) {
  server.registerTool(
    'generate_brand_image',
    {
      title: 'Generate Brand Image',
      description:
        'Generate an image using Gemini. Accepts a detailed narrative prompt and optional reference image URLs for style guidance. Returns the image for visual review and its S3 URL.',
      inputSchema: {
        prompt: z.string().describe('Detailed narrative prompt describing the image to generate'),
        referenceImageUrls: z
          .array(z.string().url())
          .optional()
          .describe('URLs of reference images for style guidance'),
        aspectRatio: z
          .enum(['1:1', '16:9', '9:16', '3:4', '4:3', '5:4'])
          .default('1:1')
          .describe('Aspect ratio for the generated image'),
        resolution: z
          .enum(['1K', '2K', '4K'])
          .default('2K')
          .describe('Image resolution'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
      },
    },
    async ({ prompt, referenceImageUrls, aspectRatio, resolution }) => {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return {
          content: [{ type: 'text' as const, text: 'GOOGLE_GENERATIVE_AI_API_KEY not configured' }],
          isError: true,
        };
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

        // Build content parts: prompt text + optional reference images
        const contents: Array<
          { text: string } | { inlineData: { mimeType: string; data: string } }
        > = [{ text: prompt }];

        if (referenceImageUrls?.length) {
          for (const imageUrl of referenceImageUrls) {
            try {
              const response = await fetch(imageUrl);
              if (!response.ok) continue;
              const buffer = await response.arrayBuffer();
              const base64 = Buffer.from(buffer).toString('base64');
              const mimeType = response.headers.get('content-type') || 'image/png';
              contents.push({ inlineData: { mimeType, data: base64 } });
            } catch {
              // Skip failed reference fetches
            }
          }
        }

        // Include aspect ratio and resolution guidance in the prompt
        if (aspectRatio !== '1:1' || resolution !== '2K') {
          contents[0] = {
            text: `${prompt}\n\n[Image parameters: aspect ratio ${aspectRatio}, resolution ${resolution}]`,
          };
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });

        // Extract image and text from response
        let imageBase64: string | undefined;
        let imageMimeType = 'image/png';
        let textResponse = '';

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.text) {
              textResponse += part.text;
            } else if (part.inlineData?.data) {
              imageBase64 = part.inlineData.data;
              if (part.inlineData.mimeType) {
                imageMimeType = part.inlineData.mimeType;
              }
            }
          }
        }

        if (!imageBase64) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No image generated. ${textResponse || 'Try a different prompt.'}`,
              },
            ],
            isError: true,
          };
        }

        // Upload to S3
        const extension = imageMimeType === 'image/jpeg' ? 'jpg' : 'png';
        const key = `brand-assets/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        let s3Url: string | undefined;
        try {
          s3Url = await uploadToS3(imageBuffer, key, imageMimeType);
        } catch (err) {
          console.error('S3 upload failed:', err);
        }

        const content: Array<
          | { type: 'image'; data: string; mimeType: string }
          | { type: 'text'; text: string }
        > = [
          { type: 'image' as const, data: imageBase64, mimeType: imageMimeType },
        ];

        if (s3Url) {
          content.push({
            type: 'text' as const,
            text: `Image generated and uploaded.\nURL: ${s3Url}${textResponse ? `\n${textResponse}` : ''}`,
          });
        } else {
          content.push({
            type: 'text' as const,
            text: `Image generated but S3 upload failed.${textResponse ? `\n${textResponse}` : ''}`,
          });
        }

        return { content };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Image generation failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
