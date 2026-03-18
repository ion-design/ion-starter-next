import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Write a WEBSITE-RESEARCH.json file at the project root with the site audit and page recommendations. Only available to the website-research-agent.',
  args: {
    website: tool.schema.string().describe('The base URL that was researched, e.g. "https://linear.app"'),
    existingPages: tool.schema.array(tool.schema.object({
      path: tool.schema.string().describe('URL path, e.g. "/", "/about", "/pricing", "/case-studies/company-name"'),
      title: tool.schema.string().describe('Page title as found in the <title> tag or heading'),
      description: tool.schema.string().describe('1 sentence describing what this page contains and its purpose'),
      pageType: tool.schema.string().describe('Page type, e.g. "landing", "about", "pricing", "blog-post", "case-study", "docs", "legal", "careers", "contact", "product", "changelog"'),
    })).describe('All discovered pages on the current marketing site'),
    recommendedPages: tool.schema.array(tool.schema.object({
      path: tool.schema.string().describe('Suggested URL path, e.g. "/about", "/team", "/vs/competitor"'),
      title: tool.schema.string().describe('Suggested page title'),
      rationale: tool.schema.string().describe('Why this page should exist — 1-2 sentences on the business value'),
      priority: tool.schema.enum(['high', 'medium', 'low']),
      category: tool.schema.enum([
        'trust',
        'seo',
        'conversion',
        'features',
        'comparison',
        'content',
        'social-proof',
      ]).describe('Primary purpose category for this page'),
      easyWin: tool.schema.boolean().describe('True if this page can be auto-generated from existing CUSTOMER-RESEARCH.json data (e.g. /about, /team). False if it requires net-new content or research.'),
    })).describe('3-10 recommended new pages the customer should add'),
    siteStructure: tool.schema.object({
      hasAboutPage: tool.schema.boolean(),
      hasTeamPage: tool.schema.boolean(),
      hasBlog: tool.schema.boolean(),
      hasPricing: tool.schema.boolean(),
      hasCaseStudies: tool.schema.boolean(),
      hasChangelog: tool.schema.boolean(),
      hasDocs: tool.schema.boolean(),
      totalPageCount: tool.schema.number(),
      observations: tool.schema.string().describe('Freeform analysis of site structure — what is strong, what is missing, overall maturity of the marketing site'),
    }),
    narrative: tool.schema.string().describe('The full site audit as raw markdown. Includes the page inventory, gap analysis, and recommendations with rationale.'),
    researchedWebsite: tool.schema.string().describe('The website URL that was researched'),
  },
  async execute(args, context) {
    const { writeFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')

    const output = {
      website: String(args.website ?? '').trim(),
      existingPages: args.existingPages,
      recommendedPages: args.recommendedPages,
      siteStructure: args.siteStructure,
      narrative: args.narrative,
      researchedAt: new Date().toISOString(),
      researchedWebsite: String(args.researchedWebsite ?? '').trim(),
    }

    const filePath = resolve(context.worktree, 'WEBSITE-RESEARCH.json')
    writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf-8')

    return `WEBSITE-RESEARCH.json written to ${filePath}`
  },
})
