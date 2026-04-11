import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Reject a brand asset as not relevant. Call this instead of append-asset when the image is not a real brand asset (social icons, generic UI, stock photos, tiny decorative elements, etc.).',
  args: {
    originalSrc: tool.schema.string().describe('The source URL of the rejected image'),
    reason: tool.schema.string().describe('Brief reason for rejection (e.g. "social media icon", "generic UI arrow", "too small")'),
  },
  async execute(args) {
    return `Rejected: ${args.originalSrc} — ${args.reason}`
  },
})