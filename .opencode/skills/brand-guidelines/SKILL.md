---
name: brand-guidelines
description: Applies SkyLink's official brand colors, typography, and design language to any artifact that may benefit from SkyLink's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: Complete terms in LICENSE.txt
---

# SkyLink Brand Guidelines

Apply these guidelines whenever building interfaces, documents, presentations, or any visual artifact for SkyLink. This is the single source of truth for SkyLink's brand identity.

## Brand Overview

**SkyLink** - "2 Clicks. 0 Wait."

SkyLink is an AI-powered corporate travel agent that automates flight booking for businesses. It serves everyone from executives to entry-level employees, integrating with messaging platforms like Slack to enable rapid travel booking with minimal friction. The platform handles flight search, selection, and confirmation in a conversational interface.

- **Website**: www.tryskylink.com
- **Industry**: Corporate Travel / AI
- **Market**: B2B

---

## Color Palette

### Primary Colors

| Name         | Hex       | RGB              | Usage                                                                |
| ------------ | --------- | ---------------- | -------------------------------------------------------------------- |
| SkyLink Blue | `#0083fa` | rgb(0, 131, 250) | Primary brand color. Buttons, links, key UI elements, primary accent |
| Black        | `#000000` | rgb(0, 0, 0)     | Primary text, dark backgrounds                                       |
| Deep Navy    | `#00091f` | rgb(0, 9, 31)    | Dark backgrounds, hero sections, deep contrast areas                 |

### Accent Colors

| Name   | Hex       | RGB              | Usage                                                           |
| ------ | --------- | ---------------- | --------------------------------------------------------------- |
| Green  | `#048116` | rgb(4, 129, 22)  | Success states, confirmations, positive indicators              |
| Blue   | `#0a12ff` | rgb(10, 18, 255) | Secondary accent, links, interactive highlights                 |
| Purple | `#b700ff` | rgb(183, 0, 255) | Tertiary accent, used sparingly for emphasis or differentiation |

### Neutral Colors

| Name        | Hex       | RGB                | Usage                                                    |
| ----------- | --------- | ------------------ | -------------------------------------------------------- |
| White       | `#ffffff` | rgb(255, 255, 255) | Primary backgrounds, cards, content areas                |
| Warm Gray   | `#f3f1ef` | rgb(243, 241, 239) | Subtle backgrounds, section dividers, secondary surfaces |
| Silver Blue | `#d2dde3` | rgb(210, 221, 227) | Borders, dividers, muted UI elements                     |
| Dark Gray   | `#444444` | rgb(68, 68, 68)    | Secondary text, captions, subdued content                |

### Color Usage Rules

- **SkyLink Blue (`#0083fa`)** is the dominant brand color - use it for primary CTAs, active states, and key visual anchors.
- **Deep Navy (`#00091f`)** for hero sections and dark-mode backgrounds. Pair with white or Warm Gray text.
- Neutral tones (`#f3f1ef`, `#d2dde3`) create warmth and softness - use for backgrounds and subtle separations rather than harsh white/gray.
- Accent colors (Green, Blue, Purple) should be used sparingly and purposefully - never as dominant surface colors.
- Avoid harsh contrasts. Prefer soft gradients transitioning from cool silver-blue to warm beige.

---

## Typography

### Font Stack

| Role                  | Font               | Fallback                             | Weights                                                 | Usage                                                                                     |
| --------------------- | ------------------ | ------------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Primary / UI          | **Inter**          | system-ui, -apple-system, sans-serif | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | Navigation, body text, buttons, labels, all general interface elements                    |
| Editorial / Headlines | **IBM Plex Serif** | Georgia, serif                       | 400 (Regular), 500 (Medium)                             | Section headers, editorial moments, case study titles, hero text where gravitas is needed |

### Typography Rules

- **Inter** is the workhorse - use it for everything by default (body copy, UI elements, navigation, buttons, form inputs).
- **IBM Plex Serif** is reserved for moments of editorial weight: hero headlines, section titles, testimonial quotes, and anywhere you want to signal authority and credibility.
- Never mix more than these two typefaces in a single artifact.
- Prefer **Inter 500 (Medium)** for UI labels and **Inter 600 (SemiBold)** for emphasis within body text.
- Use **Inter 700 (Bold)** sparingly - primarily for key stats, pricing, or critical callouts.
- **IBM Plex Serif 400** for body-length editorial content; **IBM Plex Serif 500** for headlines.

### Loading Fonts (Web)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### CSS Variables

```css
:root {
  /* Typography */
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-editorial: 'IBM Plex Serif', Georgia, serif;

  /* Primary Colors */
  --color-brand: #0083fa;
  --color-black: #000000;
  --color-deep-navy: #00091f;

  /* Accent Colors */
  --color-accent-green: #048116;
  --color-accent-blue: #0a12ff;
  --color-accent-purple: #b700ff;

  /* Neutral Colors */
  --color-white: #ffffff;
  --color-warm-gray: #f3f1ef;
  --color-silver-blue: #d2dde3;
  --color-dark-gray: #444444;

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

---

## Design Language

### Visual Style

Clean, minimal enterprise SaaS with a warm atmospheric quality. Key characteristics:

- **Generous whitespace** - let content breathe; don't crowd elements
- **Soft gradients** - transitions from cool silver-blue to warm beige create depth without heaviness
- **Rounded corners** - use 8px-16px border-radius throughout (buttons, cards, inputs, containers)
- **Realistic device frames** - product screenshots in device mockups with subtle multi-layered box shadows
- **Layered shadows** - depth without heaviness; prefer multiple soft shadows over single hard ones

The overall aesthetic sits at the intersection of **"premium travel brand"** and **"modern AI startup."**

### Design Principles

1. **Product-as-proof**: Show the actual product interface prominently. Build immediate credibility with enterprise buyers by letting the UI speak for itself rather than relying on abstract illustrations.

2. **Radical simplicity in messaging**: Distill complex AI automation into dead-simple value props. "2 clicks, 0 wait" is the gold standard - every piece of copy should aspire to this clarity.

3. **Corporate warmth**: Balance enterprise professionalism with approachable, human-feeling design. Achieve this through warm neutral backgrounds (`#f3f1ef`), rounded corners, soft gradients, and conversational tone.

4. **Conversational UI as hero**: The chat-based interaction model is the product's strongest differentiator. Feature Slack-like chat interfaces prominently rather than hiding them behind marketing abstractions.

### Brand Intangibles

SkyLink's brand carries a duality: it feels both **effortless and enterprise-grade**. Key qualities:

- **Quiet confidence** - the design doesn't oversell with flashy animations or bold color gradients. It lets the product do the talking.
- **VIP positioning, practical grounding** - borrows aspirational language of luxury concierge services, but product UI screenshots keep it grounded in real functionality.
- **Credibility through association** - enterprise trust signals (case studies, client logos, integration badges) are used prominently but not aggressively.
- **Tool-first mentality** - the brand feels like "the AI tool that serious companies actually use," not "another AI demo."

---

## Imagery Guidelines

### Style

Product screenshots in clean device mockups with realistic shadows, complemented by client logos and team headshots. Never use stock photography or generic AI-generated illustrations.

### Mood

Professional, trustworthy, and operationally focused - more "tool in action" than aspirational lifestyle.

### Subject Matter

- Product UI showing Slack-based flight booking conversations
- Flight itinerary cards with airline details and pricing
- Client/partner logos in a trust bar
- Team member or advisor headshots
- Integration and workflow diagrams

### Image Treatment

- Screenshots should be presented in realistic device frames (laptop, phone)
- Apply multi-layered, soft box shadows for depth
- Maintain generous padding around image elements
- Use warm gray (`#f3f1ef`) or soft gradient backgrounds behind screenshots - never pure white

---

## Component Patterns

### Buttons

- **Primary**: SkyLink Blue (`#0083fa`) background, white text, 8px-12px border-radius, Inter 600
- **Secondary**: White or transparent background, SkyLink Blue text/border, same radius
- **Hover states**: Slight darkening of background (not opacity reduction)

### Cards

- White background (`#ffffff`) or Warm Gray (`#f3f1ef`)
- Border-radius: 12px-16px
- Shadow: multi-layered, soft (e.g., `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)`)
- Generous internal padding (24px-32px)

### Hero Sections

- Deep Navy (`#00091f`) or soft gradient backgrounds (silver-blue to warm beige)
- IBM Plex Serif for hero headlines
- Product screenshots as the visual anchor
- "2 Clicks. 0 Wait." tagline prominently featured

### Trust Bars

- Client/partner logos in muted grayscale or Dark Gray (`#444444`)
- Horizontal arrangement with generous spacing
- Warm Gray background strip

---

## Brand Voice (for copy within interfaces)

- **Concise**: Strip every unnecessary word. "2 clicks, 0 wait" not "Our platform enables you to book in just two clicks with zero waiting time."
- **Confident, not boastful**: State capabilities as facts, not superlatives.
- **Enterprise-appropriate**: Professional but not stiff. Conversational but not casual.
- **Action-oriented**: Lead with what the user can do, not what the product is.

---

## Strategy Context

### Value Propositions

- 2 clicks, zero waiting
- Automatic policy enforcement
- Centralized travel visibility and control

### Target Personas

| Persona                  | Role                                                                               | Primary Need                                |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| Corporate Travel Manager | Oversees company-wide travel programs, vendor relationships, and policy compliance | Centralized control and compliance          |
| Executive Assistant      | Books complex travel for C-suite executives requiring precision and VIP treatment  | Speed and accuracy for high-stakes bookings |
| Finance Controller       | Monitors travel spend, enforces budgets, and manages expense reporting workflows   | Cost visibility and budget enforcement      |

### Marketing Objectives

- Showcase VIP service democratization - every employee gets executive-level booking
- Build confidence in AI accuracy - the system gets it right
- Demonstrate the 2-click speed advantage - show, don't tell
