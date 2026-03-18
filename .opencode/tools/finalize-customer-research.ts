import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Write a CUSTOMER-RESEARCH.json file at the project root with the company research profile. Only available to the customer-research-agent.',
  args: {
    company: tool.schema.object({
      name: tool.schema.string(),
      tagline: tool.schema.string().describe('The company\'s own tagline if they have one, otherwise a punchy 1-liner (max 10 words).'),
      description: tool.schema.string().describe('2-3 sentence company description covering what they do and why it matters.'),
      industry: tool.schema.string(),
      businessModel: tool.schema.enum(['B2B', 'B2C', 'hybrid']),
      stage: tool.schema.string().describe('Company stage, e.g. "Seed", "Series C", "Public", "Bootstrapped"'),
      foundedYear: tool.schema.number().nullable().describe('Year the company was founded, null if unknown'),
      headquarters: tool.schema.string().nullable().describe('HQ location, e.g. "San Francisco, CA"'),
      teamSize: tool.schema.string().nullable().describe('Team size range, e.g. "80-130 employees"'),
      website: tool.schema.string().describe('Primary website URL'),
    }),
    product: tool.schema.object({
      valueProposition: tool.schema.string().describe('Core value proposition in 1-2 sentences'),
      keyFeatures: tool.schema.array(tool.schema.object({
        name: tool.schema.string(),
        description: tool.schema.string(),
      })).describe('Top product features/capabilities'),
      targetAudience: tool.schema.string().describe('Who the product is built for'),
      pricingModel: tool.schema.string().nullable().describe('Pricing model, e.g. "freemium", "enterprise", "usage-based", "per-seat". null if unknown'),
    }),
    funding: tool.schema.object({
      rounds: tool.schema.array(tool.schema.object({
        round: tool.schema.string().describe('Round name, e.g. "Seed", "Series A", "Series C"'),
        date: tool.schema.string().describe('Date or approximate date, e.g. "June 2025", "Nov 2019"'),
        amount: tool.schema.string().describe('Amount raised, e.g. "$82M"'),
        leadInvestor: tool.schema.string().nullable().describe('Lead investor for this round, null if unknown'),
      })),
      totalFunding: tool.schema.string().nullable().describe('Total funding raised, e.g. "$134.2M"'),
      valuation: tool.schema.string().nullable().describe('Latest known valuation, e.g. "$1.25B"'),
      notableInvestors: tool.schema.array(tool.schema.string()).describe('Notable investor names (firms and angels)'),
      profitable: tool.schema.boolean().nullable().describe('Whether the company is profitable, null if unknown'),
      revenueInfo: tool.schema.string().nullable().describe('Any known revenue metrics, e.g. "$27.5M ARR, 280% YoY growth"'),
    }),
    marketPosition: tool.schema.object({
      differentiators: tool.schema.array(tool.schema.string()).describe('What makes this company unique vs competitors'),
      competitors: tool.schema.array(tool.schema.object({
        name: tool.schema.string(),
        comparison: tool.schema.string().nullable().describe('Brief comparison note, e.g. "Heavier enterprise focus, slower UX"'),
      })),
      notableCustomers: tool.schema.array(tool.schema.string()).describe('Named customers or logos'),
      customerCount: tool.schema.string().nullable().describe('Total customer count if known, e.g. "25,000+"'),
      marketInsights: tool.schema.string().describe('Freeform analysis of competitive position, market trends, and strategic outlook'),
    }),
    leadership: tool.schema.object({
      founders: tool.schema.array(tool.schema.object({
        name: tool.schema.string(),
        title: tool.schema.string().describe('Current title, e.g. "Co-Founder & CEO"'),
        background: tool.schema.string().describe('2-3 sentence professional background narrative'),
        priorRoles: tool.schema.array(tool.schema.object({
          company: tool.schema.string(),
          role: tool.schema.string(),
        })).describe('Key prior roles before this company'),
        education: tool.schema.string().nullable().describe('Education background, null if unknown'),
        linkedinUrl: tool.schema.string().nullable(),
        twitterUrl: tool.schema.string().nullable(),
        headshotUrl: tool.schema.string().nullable().describe('URL to a headshot or profile photo. Check LinkedIn profiles, company about/team pages, press kits, and speaker bios. null if none found.'),
        quote: tool.schema.string().nullable().describe('A notable quote from this person, null if none found'),
        highlights: tool.schema.string().describe('What makes this person notable — specific accomplishments, not generic praise'),
      })),
      keyTeam: tool.schema.array(tool.schema.object({
        name: tool.schema.string(),
        role: tool.schema.string(),
        background: tool.schema.string().describe('Brief background, e.g. "Ex-Stripe, joined 2021"'),
        headshotUrl: tool.schema.string().nullable().describe('URL to a headshot or profile photo. null if none found.'),
        joinedYear: tool.schema.number().nullable(),
      })).describe('Non-founder key team members (C-suite, VPs, notable hires)'),
    }),
    foundingStory: tool.schema.string().describe('The founding narrative — how and why the company was started. 3-5 sentences.'),
    recentDevelopments: tool.schema.array(tool.schema.object({
      date: tool.schema.string().describe('Date or month, e.g. "Mar 2026", "Q4 2025"'),
      description: tool.schema.string().describe('What happened, 1-2 sentences'),
    })).describe('Recent news, launches, milestones — most recent first'),
    narrative: tool.schema.string().describe('The full research output as raw markdown. This is the comprehensive narrative that covers everything above in readable form, plus any additional context that does not fit neatly into structured fields.'),
    researchedCompany: tool.schema.string().describe('The company name or query that was researched'),
  },
  async execute(args, context) {
    const { writeFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')

    const output = {
      company: args.company,
      product: args.product,
      funding: args.funding,
      marketPosition: args.marketPosition,
      leadership: args.leadership,
      foundingStory: args.foundingStory,
      recentDevelopments: args.recentDevelopments,
      narrative: args.narrative,
      researchedAt: new Date().toISOString(),
      researchedCompany: String(args.researchedCompany ?? '').trim(),
    }

    const filePath = resolve(context.worktree, 'CUSTOMER-RESEARCH.json')
    writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf-8')

    return `CUSTOMER-RESEARCH.json written to ${filePath}`
  },
})
