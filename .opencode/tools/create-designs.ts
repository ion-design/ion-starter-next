import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Trigger design work by submitting variant briefs. The server intercepts this tool call from the stream and kicks off design generation — the return value is irrelevant. Only available to the canvas-agent.',
  args: {
    variants: tool.schema
      .array(
        tool.schema.object({
          variantId: tool.schema.string().describe('Unique variant identifier (e.g. "v1", "v2").'),
          direction: tool.schema.string().describe('Short creative direction label (e.g. "Clean & Minimal").'),
          differentiator: tool.schema.string().describe('What makes this variant distinct from the others.'),
          creativeBrief: tool.schema.string().describe('Full design brief for this variant — layout, tone, content, visual direction.'),
        })
      )
      .describe('1-5 design variant briefs, each with a differentiated creative direction.'),
    pageType: tool.schema.string().describe('Type of page being designed (e.g. "pricing", "landing", "about").'),
    userIntent: tool.schema.string().describe('One-line summary of what the user asked for.'),
  },
  async execute(args) {
    return JSON.stringify({
      status: 'triggered',
      count: args.variants.length,
    })
  },
})
