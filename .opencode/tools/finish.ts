export default {
  description: 'Mark a task complete with a structured summary payload.',
  parameters: {
    type: 'object',
    properties: {
      summary: {
        type: 'string',
        description: 'Short summary of what was completed.',
      },
      status: {
        type: 'string',
        enum: ['success', 'needs_input'],
        description: 'Completion status for the task.',
      },
      next_steps: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional next actions if additional work is needed.',
      },
    },
    required: ['summary', 'status'],
    additionalProperties: false,
  },
  async execute(args: { summary: string; status: 'success' | 'needs_input'; next_steps?: string[] }) {
    return {
      ok: true,
      tool: 'finish',
      finishedAt: new Date().toISOString(),
      summary: args.summary.trim(),
      status: args.status,
      next_steps: Array.isArray(args.next_steps)
        ? args.next_steps.map((step) => step.trim()).filter((step) => step.length > 0)
        : [],
    };
  },
};
