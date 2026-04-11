import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Append a tagged brand asset entry to ASSETS.jsonl. Safe for parallel writes from multiple sub-agents.',
  args: {
    title: tool.schema.string().describe('Concise descriptive title (2-5 words)'),
    type: tool.schema.enum([
      'logo', 'wordmark', 'icon', 'favicon',
      'hero-image', 'product-image', 'illustration',
      'photograph', 'pattern', 'infographic',
      'team-photo', 'screenshot', 'other',
    ]).describe('The type of brand asset'),
    tags: tool.schema.array(tool.schema.string()).describe('3-8 relevant tags for searchability'),
    description: tool.schema.string().describe('2-3 sentences describing the asset and its potential use'),
    originalSrc: tool.schema.string().describe('The original source URL of the image on the website'),
    s3Url: tool.schema.string().nullable().describe('The S3 URL after upload, or null if upload was skipped'),
    width: tool.schema.number().describe('Image width in pixels'),
    height: tool.schema.number().describe('Image height in pixels'),
    context: tool.schema.string().describe('Where the image appeared on the page (e.g. img:logo, img:hero, bg:div)'),
    isLogo: tool.schema.boolean().describe('Whether this was detected as a logo'),
  },
  async execute(args, context) {
    const { appendFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')

    const entry = {
      title: args.title,
      type: args.type,
      tags: args.tags,
      description: args.description,
      originalSrc: args.originalSrc,
      s3Url: args.s3Url ?? null,
      width: args.width,
      height: args.height,
      context: args.context,
      isLogo: args.isLogo,
      taggedAt: new Date().toISOString(),
    }

    const filePath = resolve(context.worktree, 'ASSETS.jsonl')
    appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8')

    return `Asset appended to ${filePath}: ${args.title} (${args.type})`
  },
})