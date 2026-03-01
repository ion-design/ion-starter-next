import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'fs';

export function register(server: McpServer) {
  server.registerTool(
    'screenshot_dev_server',
    {
      title: 'Screenshot Dev Server',
      description:
        'Take a screenshot of the local dev server. Constructs the URL from port and route parameters. Returns the screenshot for visual analysis.',
      inputSchema: {
        port: z.number().default(3000).describe('Dev server port'),
        route: z.string().default('/').describe('Route path to screenshot (e.g. "/" or "/pricing")'),
        width: z.number().default(1280).describe('Viewport width'),
        height: z.number().default(900).describe('Viewport height'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ port, route, width, height }) => {
      const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
      const url = `http://localhost:${port}${normalizedRoute}`;

      try {
        const { execSync } = await import('child_process');
        const tmpFile = `/tmp/dev-screenshot-${Date.now()}.png`;

        execSync(
          `bunx playwright screenshot --viewport-size="${width},${height}" --wait-for-timeout=2000 "${url}" "${tmpFile}"`,
          { timeout: 45000 }
        );

        const base64 = fs.readFileSync(tmpFile).toString('base64');
        fs.unlinkSync(tmpFile);

        return {
          content: [
            { type: 'image' as const, data: base64, mimeType: 'image/png' },
            {
              type: 'text' as const,
              text: `Dev server screenshot: ${url} (${width}x${height})`,
            },
          ],
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const isConnectionError =
          errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ERR_CONNECTION_REFUSED');

        return {
          content: [
            {
              type: 'text' as const,
              text: isConnectionError
                ? `Dev server not running on port ${port}. Start it with "bun run dev" first.`
                : `Screenshot failed for ${url}: ${errorMsg}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
