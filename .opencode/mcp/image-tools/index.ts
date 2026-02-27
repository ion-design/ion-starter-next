import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const server = new McpServer({
  name: 'screenshot-tool',
  version: '1.0.0',
});

server.registerTool(
  'view_image',
  {
    title: 'View Image',
    description: 'Read an image file and return it so the model can visually analyze it.',
    inputSchema: {
      filePath: z.string().describe('Absolute or relative path to the image file'),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
    },
  },
  async ({ filePath }) => {
    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) {
      return {
        content: [{ type: 'text' as const, text: `File not found: ${resolved}` }],
        isError: true,
      };
    }

    const ext = path.extname(resolved).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const mimeType = mimeMap[ext];
    if (!mimeType) {
      return {
        content: [{ type: 'text' as const, text: `Unsupported image format: ${ext}` }],
        isError: true,
      };
    }

    const base64 = fs.readFileSync(resolved).toString('base64');

    return {
      content: [
        {
          type: 'image' as const,
          data: base64,
          mimeType,
        },
        {
          type: 'text' as const,
          text: `Image loaded: ${path.basename(resolved)} (${mimeType})`,
        },
      ],
    };
  }
);

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
          {
            type: 'image' as const,
            data: base64,
            mimeType,
          },
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

      execSync(`bunx playwright screenshot --viewport-size="${width},${height}" "${url}" "${tmpFile}"`, {
        timeout: 30000,
      });

      const base64 = fs.readFileSync(tmpFile).toString('base64');
      fs.unlinkSync(tmpFile);

      return {
        content: [
          {
            type: 'image' as const,
            data: base64,
            mimeType: 'image/png',
          },
          {
            type: 'text' as const,
            text: `Screenshot of ${url} at ${width}x${height}`,
          },
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
