import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Write a SUMMARY.json file at the project root with the design results. Only available to the design-command agent.',
  args: {
    summary: tool.schema.string().describe('Summary of what was designed and implemented.'),
    route: tool.schema.string().describe('The route path to navigate to in order to view the new designs (e.g. "/" or "/pricing").'),
  },
  async execute(args, context) {
    const { writeFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')

    const output = {
      summary: String(args.summary ?? '').trim(),
      route: String(args.route ?? '').trim(),
      finishedAt: new Date().toISOString(),
    }

    const filePath = resolve(context.worktree, 'SUMMARY.json')
    writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf-8')

    return `SUMMARY.json written to ${filePath}`
  },
})