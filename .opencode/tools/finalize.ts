import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default {
  description:
    'Write a SUMMARY.json file at the project root with the design results. Only available to the design-command agent.',
  parameters: {
    type: 'object',
    properties: {
      summary: {
        type: 'string',
        description: 'Summary of what was designed and implemented.',
      },
      route: {
        type: 'string',
        description:
          'The route path to navigate to in order to view the new designs (e.g. "/" or "/pricing").',
      },
    },
    required: ['summary', 'route'],
    additionalProperties: false,
  },
  async execute(args: { summary: string; route: string }) {
    const output = {
      summary: args.summary.trim(),
      route: args.route.trim(),
      finishedAt: new Date().toISOString(),
    };

    const filePath = resolve(process.cwd(), 'SUMMARY.json');
    writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf-8');

    return {
      ok: true,
      tool: 'finalize',
      path: filePath,
      ...output,
    };
  },
};
