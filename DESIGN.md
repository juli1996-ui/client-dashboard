# Design System — Lead Gen Jay Client Dashboard

## Product Context
- **What this is:** Client-facing campaign performance dashboard for Lead Gen Jay's cold email outreach service
- **Who it's for:** Non-technical business owners checking their campaign results (e.g., Brian Rechtman)
- **Space/industry:** B2B lead generation, marketing agency reporting
- **Project type:** Read-only reporting dashboard

## Aesthetic Direction
- **Direction:** Calm Premium with Data Density — warm, confident, Bloomberg-meets-luxury
- **Decoration level:** Minimal — typography, whitespace, and data do the work
- **Mood:** Opening a well-designed financial report. Premium, trustworthy, data-rich but never overwhelming. The warmth says "we care about your results," the density says "we have nothing to hide."
- **Reference:** Direction C — dense 2-column layout, warm paper background, terracotta accent

## Typography
- **Display/Hero:** Fraunces (weight 700-900) — warm serif with personality, signals authority without being cold
- **Body:** Plus Jakarta Sans (weight 400-600) — clean geometric sans, high readability at small sizes
- **UI/Labels:** Plus Jakarta Sans (weight 600-700, uppercase, letter-spacing 1-2px)
- **Data/Tables:** Plus Jakarta Sans (font-variant-numeric: tabular-nums) — aligned numbers in tables and KPIs
- **Loading:** Bunny Fonts CDN `https://fonts.bunny.net/css?family=fraunces:400,500,600,700,900|plus-jakarta-sans:400,500,600,700`
- **Scale:**
  - Hero number: 96px / Fraunces 900
  - Section KPI: 28-32px / Fraunces 900
  - Card title: 16px / Fraunces 700
  - Body: 14-15px / Plus Jakarta Sans 400
  - Label: 11px / Plus Jakarta Sans 700 uppercase
  - Table data: 13px / Plus Jakarta Sans 500
  - Small/badge: 11-12px / Plus Jakarta Sans 600

## Color
- **Approach:** Restrained — warm neutrals, one accent, semantic colors only when needed
- **Background:** #F7F5F0 (warm paper)
- **Surface:** #FFFFFF (cards)
- **Surface warm:** #FAF8F5 (zebra stripes, subtle tints)
- **Primary text:** #2D2A26 (deep warm charcoal)
- **Muted text:** #8A8580
- **Faint text:** #B5B0AA (labels, placeholders)
- **Accent (terracotta):** #C2653C — warmth, confidence, zero tech-bro energy
- **Accent light:** rgba(194,101,60,0.08)
- **Success:** #4A7C59 (muted forest green)
- **Success light:** rgba(74,124,89,0.08)
- **Warning:** #B8860B (dark gold)
- **Warning light:** rgba(184,134,11,0.08)
- **Error/Negative:** #B85450 (muted red, distinct from terracotta accent)
- **Border:** #E8E4DE
- **Border light:** #F0ECE6
- **Shadow sm:** 0 1px 3px rgba(45,42,38,0.04)
- **Shadow md:** 0 8px 24px rgba(45,42,38,0.06)

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable-dense (dense layout but not cramped)
- **Scale:** 4(2xs) 8(xs) 12 16(sm) 20 24(md) 32(lg) 40 48(xl) 64(2xl)
- **Card padding:** 20-24px
- **Grid gaps:** 16-20px between cards
- **Section gaps:** 32-40px between major sections

## Layout
- **Approach:** Dense 2-column grid with full-width sections
- **Grid:** 2 columns (1fr 1fr or 1.2fr 0.8fr) on desktop, single column on mobile (< 768px)
- **Max content width:** 1100px centered
- **Sticky header:** backdrop-blur 16px, semi-transparent background
- **Section hierarchy:**
  1. Sticky header (brand + client name + status)
  2. Summary + KPIs (60/40 split — narrative left, mini KPIs right)
  3. Campaign highlights strip (full-width, 5 metrics horizontal)
  4. Monthly chart + Response breakdown (2-column)
  5. Campaign funnel (full-width)
  6. Cumulative growth + Forecast (2-column)
  7. Monthly breakdown table (full-width)
  8. Pipeline health + Growth metrics (2-column)
  9. Footer
- **Border radius:** sm: 8px (inputs), md: 12px (inner cards, charts), lg: 16px (main cards), full: 999px (badges)

## Motion
- **Approach:** Minimal-functional — no scroll fade-ins (data-dense dashboard, not a storytelling page)
- **Hover:** Cards lift 2px + shadow-md transition 0.2s ease
- **Loading:** Subtle opacity fade 0.3s on data load
- **Duration:** micro(100ms) short(200ms) medium(300ms)
- **Easing:** ease-out for enters, ease-in for exits

## Component Patterns
- **Cards:** White surface, 1px border, 16px radius, shadow-sm, hover shadow-md
- **Section labels:** 11px uppercase, letter-spacing 2px, faint color, left-aligned
- **KPI display:** Number in Fraunces 28-32px bold, label in 13px muted, trend badge as pill
- **Trend badges:** Pill shape (999px radius), colored background-light, 12px font, semantic color
- **Tables:** 13px body, 11px uppercase headers, zebra striping with surface-warm, current month highlighted with terracotta left border
- **Progress indicators:** Horizontal bar gauges for pipeline health with benchmark labels
- **Charts:** Warm gray bars for past months, terracotta for current month, rounded top corners on bars

## Light Theme Only
This dashboard is light-theme only. No dark mode. The warm paper background (#F7F5F0) and the target audience (non-technical business owners checking results during business hours) make light the right default. Dark mode adds complexity without serving the user.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-01 | Direction C (Calm Dense) chosen | Dense 2-column Bloomberg layout with warm premium aesthetic. Client gets all data organized clearly without endless scrolling |
| 2026-04-01 | Light theme only | Target users are non-technical business owners, not power users. Light = readability + trust |
| 2026-04-01 | Fraunces + Plus Jakarta Sans | Warm serif for display signals authority. Geometric sans for data signals precision. Nobody in lead gen space uses this combo |
| 2026-04-01 | Terracotta #C2653C accent | Warm, confident, distinctive. Every competitor uses blue. This stands out |
| 2026-04-01 | 2-column layout | Shows all data without 10-section vertical scroll. Client sees everything important on first 1-2 screens |
