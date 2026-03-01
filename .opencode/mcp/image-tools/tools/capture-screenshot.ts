import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'fs';

export function register(server: McpServer) {
  server.registerTool(
    'capture_screenshot',
    {
      title: 'Capture Screenshot',
      description:
        'Take a screenshot of a URL using a headless browser and return it for visual analysis.',
      inputSchema: {
        url: z.string().url().describe('URL to screenshot'),
        width: z.number().default(1280).describe('Viewport width'),
        height: z.number().default(720).describe('Viewport height'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ url, width, height }) => {
      try {
        const { execSync } = await import('child_process');
        const tmpFile = `/tmp/screenshot-${Date.now()}.png`;

        execSync(
          `bunx playwright screenshot --viewport-size="${width},${height}" "${url}" "${tmpFile}"`,
          { timeout: 30000 }
        );

        const base64 = fs.readFileSync(tmpFile).toString('base64');
        fs.unlinkSync(tmpFile);

        return {
          content: [
            { type: 'image' as const, data: base64, mimeType: 'image/png' },
            { type: 'text' as const, text: `Screenshot of ${url} at ${width}x${height}` },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Screenshot failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
