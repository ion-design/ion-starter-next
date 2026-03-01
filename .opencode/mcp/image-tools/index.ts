import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { register as registerViewImage } from './tools/view-image.js';
import { register as registerFetchImage } from './tools/fetch-image.js';
import { register as registerCaptureScreenshot } from './tools/capture-screenshot.js';
import { register as registerGenerateImage } from './tools/generate-image.js';
import { register as registerRemoveBackground } from './tools/remove-background.js';

// Load .env from project root into process.env (without adding a dotenv dependency)
try {
  const envPath = resolve(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  // .env file not found or unreadable — continue with existing env
}

const server = new McpServer({
  name: 'image-tools',
  version: '1.0.0',
});

registerViewImage(server);
registerFetchImage(server);
registerCaptureScreenshot(server);
registerGenerateImage(server);
registerRemoveBackground(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
