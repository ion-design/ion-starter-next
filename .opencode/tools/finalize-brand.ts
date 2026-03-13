import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Write a BRAND.json file at the project root with the extracted brand data. Only available to the brand-extractor agent.',
  args: {
    company: tool.schema.object({
      name: tool.schema.string(),
      tagline: tool.schema.string().describe('A punchy 1-liner tagline (max 8 words). If the site has one, use it. Otherwise create one.'),
      description: tool.schema.string(),
      industry: tool.schema.string(),
      businessModel: tool.schema.enum(['B2B', 'B2C', 'hybrid']),
      stage: tool.schema.string(),
    }),
    colors: tool.schema.object({
      primary: tool.schema.array(tool.schema.object({
        hex: tool.schema.string(),
        usage: tool.schema.string(),
      })),
      accent: tool.schema.array(tool.schema.object({
        hex: tool.schema.string(),
        usage: tool.schema.string(),
      })),
      neutral: tool.schema.array(tool.schema.object({
        hex: tool.schema.string(),
        usage: tool.schema.string(),
      })),
      observations: tool.schema.string().describe('Freeform analysis of the color palette, its mood, and how colors interact'),
    }),
    typography: tool.schema.object({
      fonts: tool.schema.array(tool.schema.object({
        family: tool.schema.string(),
        weight: tool.schema.string(),
        usage: tool.schema.string(),
      })),
      observations: tool.schema.string().describe('Freeform analysis of the typographic system and its relationship to the brand'),
    }),
    designLanguage: tool.schema.object({
      principles: tool.schema.array(tool.schema.string()).describe('Core design principles observed'),
      visualStyle: tool.schema.string().describe('Overall visual style description'),
      intangibles: tool.schema.string().describe('Freeform observations about the brand feel, personality, and emotional qualities that are hard to quantify'),
    }),
    imagery: tool.schema.object({
      style: tool.schema.string(),
      mood: tool.schema.string(),
      subjects: tool.schema.array(tool.schema.string()),
      observations: tool.schema.string().describe('Freeform notes about imagery choices and their effect'),
    }),
    siteDiscovery: tool.schema.object({
      sitemapPages: tool.schema.array(tool.schema.string()),
      hasLlmsTxt: tool.schema.boolean(),
      llmsTxtContent: tool.schema.string().nullable(),
      pageCount: tool.schema.number(),
    }),
    logoUrl: tool.schema.string().nullable().describe('The URL of the best logo image from the provided image list. Pick the clearest company logo. null if none found.'),
    extractedFromUrl: tool.schema.string(),
  },
  async execute(args, context) {
    const { writeFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')

    const output = {
      company: args.company,
      colors: args.colors,
      typography: args.typography,
      designLanguage: args.designLanguage,
      imagery: args.imagery,
      siteDiscovery: args.siteDiscovery,
      logoUrl: args.logoUrl ?? null,
      extractedAt: new Date().toISOString(),
      extractedFromUrl: String(args.extractedFromUrl ?? '').trim(),
    }

    const filePath = resolve(context.worktree, 'BRAND.json')
    writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf-8')

    return `BRAND.json written to ${filePath}`
  },
})