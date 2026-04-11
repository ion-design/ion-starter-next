import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { uploadToS3 } from '../utils/s3-upload.js';

export function register(server: McpServer) {
  server.registerTool(
    'remove_background',
    {
      title: 'Remove Background',
      description:
        'Remove the background from an image using remove.bg. Returns a transparent PNG for visual review and its S3 URL.',
      inputSchema: {
        imageUrl: z.string().url().describe('URL of the image to remove background from'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
      },
    },
    async ({ imageUrl }) => {
      if (!process.env.REMOVE_BG_API_KEY) {
        return {
          content: [{ type: 'text' as const, text: 'REMOVE_BG_API_KEY not configured' }],
          isError: true,
        };
      }

      try {
        const formData = new FormData();
        formData.append('image_url', imageUrl);
        formData.append('size', 'auto');
        formData.append('format', 'png');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
          body: formData,
        });

        if (!response.ok) {
          const body = await response.text().catch(() => '');
          return {
            content: [
              {
                type: 'text' as const,
                text: `remove.bg failed: ${response.status} ${response.statusText}${body ? ` - ${body.slice(0, 300)}` : ''}`,
              },
            ],
            isError: true,
          };
        }

        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        const base64 = imageBuffer.toString('base64');

        // Upload to S3
        const key = `brand-assets/${Date.now()}-${Math.random().toString(36).slice(2)}-nobg.png`;

        let s3Url: string | undefined;
        try {
          s3Url = await uploadToS3(imageBuffer, key, 'image/png');
        } catch (err) {
          console.error('S3 upload failed:', err);
        }

        const content: Array<
          | { type: 'image'; data: string; mimeType: string }
          | { type: 'text'; text: string }
        > = [
          { type: 'image' as const, data: base64, mimeType: 'image/png' },
        ];

        if (s3Url) {
          content.push({
            type: 'text' as const,
            text: `Background removed.\nURL: ${s3Url}`,
          });
        } else {
          content.push({
            type: 'text' as const,
            text: 'Background removed but S3 upload failed.',
          });
        }

        return { content };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Background removal failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
