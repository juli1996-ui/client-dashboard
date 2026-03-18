# AntiGravity UI/UX Design Framework

Apply the AntiGravity UI/UX Design Framework when creating or modifying UI components.

Read the full framework from `netlify/functions/skill.md` and use it as your design system reference.

## How to Apply

When building UI, follow these **5 Core Dimensions**:

1. **PATTERN & LAYOUT** — Choose the right layout pattern for the product type (SaaS, E-commerce, Fintech, Dashboard, Portfolio)
2. **STYLE & AESTHETIC** — Apply the appropriate visual style (Glassmorphism, Aurora UI, Neumorphism, Linear/Vercel dark, Bento Grid, Liquid Glass, etc.)
3. **COLOR & THEME** — Use the correct color palette based on industry/mood. Follow the 60-30-10 rule and WCAG AA compliance
4. **TYPOGRAPHY** — Select font pairings that match the product personality (Modern/Tech, Elegant/Luxury, Friendly/Consumer, Brutalist, Editorial)
5. **ANIMATIONS & INTERACTIONS** — Add polished micro-interactions: button hovers, input focus states, card effects, scroll animations. Always respect `prefers-reduced-motion`

## Rules
- Always use `transform` and `opacity` for animations (GPU accelerated)
- Transitions: 150-300ms for interactions, never longer than 500ms
- Minimum tap targets: 44x44px
- No color-only information conveyance
- No hamburger menus on desktop
- No labels inside inputs
- Ensure 4.5:1 contrast ratio for text (WCAG AA)

## User Request
$ARGUMENTS
