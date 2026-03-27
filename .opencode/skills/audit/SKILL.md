---
name: audit
description: Run quality checks across brand adherence, design quality, copy, layout, and technical execution. Generates a scored report with P0-P3 severity ratings and actionable plan. Use when the user wants a brand check, design audit, or quality review.
user-invocable: true
argument-hint: "[area (feature, page, component...)]"
---

## MANDATORY PREPARATION

Invoke /frontend-design — it contains design principles, anti-patterns, and brand context guidance. Load the brand-guidelines skill if brand context is available in company-docs/brand-guidelines.md.

---

Run systematic **quality** checks and generate a comprehensive report. Don't fix issues — document them for other commands to address.

This is a holistic audit covering brand adherence, design quality, copy, layout, and technical execution.

## Diagnostic Scan

Run comprehensive checks across 5 dimensions. Score each dimension 0-4 using the criteria below.

### 1. Brand Adherence
**Check for**:
- **Color alignment**: Do colors match brand-guidelines.md palette? Are brand colors used for primary elements?
- **Typography match**: Are specified brand fonts used? Do font weights and sizes follow brand guidelines?
- **Tone & voice**: Does the copy tone match the brand personality described in guidelines?
- **Imagery & style**: Do images, icons, and visual treatments align with brand aesthetic?
- **Component patterns**: Are brand-specified component styles followed (button styles, card treatments, etc.)?

**Score 0-4**: 0=No brand alignment (generic defaults), 1=Minimal effort (wrong colors/fonts), 2=Partial (some elements match, inconsistent), 3=Good (mostly on-brand, minor deviations), 4=Excellent (perfect brand execution, feels like the company made it)

### 2. Design Quality (Anti-AI-Slop)
**Check for**:
- **AI slop tells**: Inter/Roboto font, purple gradients, glassmorphism, nested cards, hero metrics layout, gradient text, bounce easing
- **Intentional aesthetic**: Does the design have a clear point of view and direction?
- **Distinctive choices**: Would someone immediately say "AI made this"?
- **Visual sophistication**: Typography hierarchy, color usage, spatial composition
- **Attention to detail**: Micro-interactions, hover states, transitions

**Score 0-4**: 0=AI slop gallery (5+ tells), 1=Heavy AI aesthetic (3-4 tells), 2=Some tells (1-2 noticeable), 3=Mostly clean (subtle issues only), 4=No AI tells (distinctive, intentional design)

### 3. Copy & CTA Quality
**Check for**:
- **Headline impact**: Are headlines compelling, specific, and benefit-focused?
- **CTA clarity**: Are calls-to-action clear, action-oriented, and visually prominent?
- **Value proposition**: Is it immediately clear what the product does and why it matters?
- **UX writing**: Are labels, buttons, and microcopy helpful and specific?
- **Content hierarchy**: Does the copy flow guide users toward conversion?

**Score 0-4**: 0=Placeholder/lorem ipsum copy, 1=Generic marketing speak, 2=Decent but forgettable, 3=Clear and compelling, 4=Conversion-ready, specific, memorable

### 4. Layout & Composition
**Check for**:
- **Visual hierarchy**: Is it clear what's most important? Does the eye flow naturally?
- **Spatial rhythm**: Is spacing varied and intentional (not same-padding-everywhere)?
- **Responsive design**: Does it work on mobile, tablet, desktop?
- **Section composition**: Are sections distinct with clear purpose?
- **Balance**: Does the page feel composed, not randomly assembled?

**Score 0-4**: 0=Broken/unreadable layout, 1=Basic but monotonous (card grid, even spacing), 2=Functional but uninspired, 3=Well-composed with clear hierarchy, 4=Dynamic, memorable composition

### 5. Technical Execution
**Check for**:
- **Rendering**: Does the page render without errors?
- **Performance**: No layout thrashing, images optimized, efficient animations
- **Accessibility**: Proper contrast, semantic HTML, keyboard navigation, ARIA labels
- **Interactive states**: Hover, focus, active, disabled states on interactive elements
- **Code quality**: Clean, maintainable, no console errors

**Score 0-4**: 0=Broken/doesn't render, 1=Major issues (missing states, poor contrast), 2=Functional but rough, 3=Solid (minor gaps), 4=Production-ready

## Generate Report

### Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Brand Adherence | ? | [most critical brand issue or "--"] |
| 2 | Design Quality | ? | |
| 3 | Copy & CTA Quality | ? | |
| 4 | Layout & Composition | ? | |
| 5 | Technical Execution | ? | |
| **Total** | | **??/20** | **[Rating band]** |

**Rating bands**: 18-20 Ship it (minor polish only), 14-17 Good (address weak dimensions), 10-13 Needs work (significant improvements needed), 6-9 Poor (major overhaul), 0-5 Start over

### Anti-Patterns Verdict
**Start here.** Pass/fail: Does this look AI-generated? List specific tells. Be brutally honest.

### Executive Summary
- Audit Health Score: **??/20** ([rating band])
- Total issues found (count by severity: P0/P1/P2/P3)
- Top 3-5 critical issues
- Recommended next steps

### Detailed Findings by Severity

Tag every issue with **P0-P3 severity**:
- **P0 Blocking**: Prevents task completion — fix immediately
- **P1 Major**: Significant difficulty or WCAG AA violation — fix before release
- **P2 Minor**: Annoyance, workaround exists — fix in next pass
- **P3 Polish**: Nice-to-fix, no real user impact — fix if time permits

For each issue, document:
- **[P?] Issue name**
- **Location**: Component, file, line
- **Category**: Brand Adherence / Design Quality / Copy & CTA / Layout & Composition / Technical Execution
- **Impact**: How it affects users
- **WCAG/Standard**: Which standard it violates (if applicable)
- **Recommendation**: How to fix it
- **Suggested command**: Which command to use (prefer: /animate, /quieter, /bolder, /adapt, /clarify, /distill, /overdrive, /normalize, /polish, /extract, /typeset, /colorize, /arrange)

### Patterns & Systemic Issues

Identify recurring problems that indicate systemic gaps rather than one-off mistakes:
- "Hard-coded colors appear in 15+ components, should use design tokens"
- "Touch targets consistently too small (<44px) throughout mobile experience"

### Positive Findings

Note what's working well — good practices to maintain and replicate.

## Recommended Actions

List recommended commands in priority order (P0 first, then P1, then P2):

1. **[P?] `/command-name`** — Brief description (specific context from audit findings)
2. **[P?] `/command-name`** — Brief description (specific context)

**Rules**: Only recommend commands from: /animate, /quieter, /bolder, /adapt, /clarify, /distill, /overdrive, /normalize, /polish, /extract, /typeset, /colorize, /arrange. Map findings to the most appropriate command. End with `/polish` as the final step if any fixes were recommended.

After presenting the summary, tell the user:

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `/audit` after fixes to see your score improve.

**IMPORTANT**: Be thorough but actionable. Too many P3 issues creates noise. Focus on what actually matters.

**NEVER**:
- Report issues without explaining impact (why does this matter?)
- Provide generic recommendations (be specific and actionable)
- Skip positive findings (celebrate what works)
- Forget to prioritize (everything can't be P0)
- Report false positives without verification

Remember: You're a technical quality auditor. Document systematically, prioritize ruthlessly, cite specific code locations, and provide clear paths to improvement.
