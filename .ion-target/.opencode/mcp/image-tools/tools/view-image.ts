import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export function register(server: McpServer) {
  server.registerTool(
    'view_image',
    {
      title: 'View Image',
      description:
        'Read an image file and return it so the model can visually analyze it.',
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
          { type: 'image' as const, data: base64, mimeType },
          { type: 'text' as const, text: `Image loaded: ${path.basename(resolved)} (${mimeType})` },
        ],
      };
    }
  );
}
