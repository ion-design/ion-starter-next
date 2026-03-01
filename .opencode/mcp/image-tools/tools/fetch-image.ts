import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function register(server: McpServer) {
  server.registerTool(
    'fetch_image',
    {
      title: 'Fetch Image',
      description: 'Download an image from a URL and return it for visual analysis.',
      inputSchema: {
        url: z.string().url().describe('URL of the image to fetch'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ url }) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Failed to fetch: ${response.status} ${response.statusText}`,
              },
            ],
            isError: true,
          };
        }

        const contentType = response.headers.get('content-type') || 'image/png';
        const mimeType = contentType.split(';')[0]!.trim();
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        return {
          content: [
            { type: 'image' as const, data: base64, mimeType },
            {
              type: 'text' as const,
              text: `Fetched image from ${url} (${mimeType}, ${Math.round(buffer.byteLength / 1024)}KB)`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching image: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
