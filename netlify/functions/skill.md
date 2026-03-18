# AntiGravity UI/UX Design Framework

AI-Powered Design Intelligence for Gorgeous, Modern UIs

> Purpose: This framework provides a comprehensive template for prompting AI agents to create beautiful, functional, and high-performing user interfaces. Based on the UI/UX Pro Max methodology with 67+ design styles, 95+ color palettes, and proven interaction patterns.

---

## The Complete Design Prompt Template

Structure your prompt using these **5 Core Dimensions**:

1. **PATTERN & LAYOUT** (The Skeleton)
2. **STYLE & AESTHETIC** (The Skin)
3. **COLOR & THEME** (The Palette)
4. **TYPOGRAPHY** (The Voice)
5. **ANIMATIONS & INTERACTIONS** (The Soul)

---

## DIMENSION 1: Pattern & Layout

**Don't just say**: "Create a landing page"

**Instead, specify the functional pattern based on your product type:**

### SaaS (General)
```
Pattern: Hero + Features + Social Proof + CTA
Focus: Value proposition first, feature showcase second
Layout: Full-width hero, 3-column features, testimonial carousel, sticky CTA
```

### Micro SaaS
```
Pattern: Minimal & Direct + Live Demo
Focus: Get straight to product utility, show don't tell
Layout: Centered hero with embedded demo, minimal navigation, single CTA
```

### E-commerce (Luxury)
```
Pattern: Feature-Rich Showcase + Immersive Gallery
Focus: Large imagery, high-end feel, storytelling
Layout: Full-screen hero slider, grid gallery, product details with zoom
```

### Fintech/Crypto
```
Pattern: Conversion-Optimized + Trust Signals
Focus: Clear data visualization, security badges, transparent pricing
Layout: Split hero (visual + form), live stats dashboard, trust indicators
```

### Analytics Dashboard
```
Pattern: Bento Grid + Actionable Insights
Focus: Data density with clarity, scannable metrics
Layout: Modular card system, hierarchical information, quick filters
```

### Portfolio/Agency
```
Pattern: Storytelling + Case Studies
Focus: Visual impact, project showcases, personality
Layout: Full-screen sections, horizontal scroll galleries, immersive transitions
```

---

## DIMENSION 2: Style & Aesthetic

### Glassmorphism
```
Keywords: Frosted glass, transparent layers, blurred background, depth, vibrant backdrop
Technical: backdrop-filter: blur(10px), rgba backgrounds, layered cards
Use When: Modern apps, dashboards, overlays, modals
Avoid: Low-contrast backgrounds, accessibility issues
```

### Aurora UI
```
Keywords: Vibrant gradients, smooth blend, Northern Lights effect, mesh gradient, luminous
Technical: Multi-stop gradients, animated hue rotation, glow effects
Use When: Landing pages, hero sections, creative portfolios
Avoid: Text-heavy interfaces, professional/corporate contexts
```

### Soft UI Evolution (Neumorphism 2.0)
```
Keywords: Soft shadows, subtle gradients, rounded corners (12-16px), monochromatic, tactile
Technical: box-shadow: inset + outset, same-color palette, minimal contrast
Use When: Mobile apps, minimalist interfaces, wellness/health apps
Avoid: Complex data displays, accessibility-critical applications
```

### Linear/Vercel Aesthetic
```
Keywords: Dark mode, subtle borders (1px), high contrast, minimalist, developer-centric
Technical: #0A0A0A background, #1A1A1A cards, #333 borders, white text
Use When: Developer tools, SaaS platforms, technical products
Avoid: Consumer-facing, playful brands
```

### Bento Grid
```
Keywords: Modular, clean, organized, information-dense, modern, structured
Technical: CSS Grid, varying card sizes, consistent gaps (16-24px)
Use When: Dashboards, feature showcases, content-heavy pages
Avoid: Simple single-purpose pages
```

### Liquid Glass
```
Keywords: Fluid shapes, blurred transparency, organic movement, glossy, dynamic
Technical: SVG blobs, backdrop-filter, animated transforms
Use When: Creative agencies, modern SaaS, interactive experiences
Avoid: Traditional industries, conservative audiences
```

### Additional Styles
- **Brutalism**: Raw, bold, unconventional, high-contrast, geometric
- **Y2K Revival**: Metallic, chrome effects, bold colors, retro-futuristic
- **Claymorphism**: 3D inflated, soft shadows, playful, tactile
- **Gradient Mesh**: Complex multi-color gradients, organic flow
- **Minimalist Luxury**: Maximum white space, serif typography, subtle gold accents
- **Cyberpunk**: Neon colors, glitch effects, tech-noir, high energy
- **Organic/Biomorphic**: Nature-inspired shapes, earth tones, flowing forms

---

## DIMENSION 3: Color & Theme

### Trust & Professionalism (Finance, Healthcare, Enterprise)
```css
--primary: #0F172A;     /* Navy */
--cta: #0369A1;         /* Blue */
--background: #F8FAFC;  /* Light Grey */
--text: #1E293B;        /* Slate */
--accent: #3B82F6;      /* Bright Blue */
/* Mood: Reliable, secure, established */
```

### Vibrant & Modern (Tech Startups, Creative Tools)
```css
--primary: #6366F1;     /* Indigo */
--cta: #10B981;         /* Emerald */
--background: #FFFFFF;  /* Pure White */
--text: #1E293B;        /* Slate */
--accent: #F59E0B;      /* Amber */
/* Mood: Innovative, energetic, forward-thinking */
```

### Luxury & Premium (High-end Products, Fashion)
```css
--primary: #1C1917;     /* Stone Dark */
--cta: #CA8A04;         /* Gold */
--background: #FAFAF9;  /* Cream */
--text: #292524;        /* Warm Black */
--accent: #78716C;      /* Taupe */
/* Mood: Sophisticated, exclusive, timeless */
```

### Healthcare/Wellness
```css
--primary: #0891B2;     /* Cyan */
--cta: #059669;         /* Health Green */
--background: #FFFFFF;  /* Clean White */
--text: #0F172A;        /* Deep Blue */
--accent: #06B6D4;      /* Bright Cyan */
/* Mood: Calm, trustworthy, clean */
```

### Creative/Playful (Consumer Apps, Entertainment)
```css
--primary: #EC4899;     /* Pink */
--cta: #8B5CF6;         /* Purple */
--background: #FEF3C7;  /* Warm Cream */
--text: #1F2937;        /* Charcoal */
--accent: #F59E0B;      /* Orange */
/* Mood: Fun, approachable, energetic */
```

### Dark Mode Excellence
```css
--background: #0A0A0A;      /* True Black */
--surface: #1A1A1A;         /* Card Background */
--border: #333333;          /* Subtle Borders */
--text: #FFFFFF;            /* Pure White */
--text-secondary: #A3A3A3;  /* Grey */
--accent: #3B82F6;          /* Blue or #10B981 Green */
/* Ensure 15:1 contrast ratio for text */
```

### Color System Rules
```
✅ DO:
- Use 60-30-10 rule (60% dominant, 30% secondary, 10% accent)
- Ensure WCAG AA compliance (4.5:1 for text)
- Create semantic color tokens (--color-success, --color-error)
- Test in both light and dark modes

❌ DON'T:
- Use more than 3 primary colors
- Use pure black (#000) on pure white (#FFF) - too harsh
- Rely on color alone for information (accessibility)
- Use low-contrast grey text (#CCC on #FFF)
```

---

## DIMENSION 4: Typography

### Modern/Tech (SaaS, Developer Tools)
```
Headings: Inter (Variable Font)
Body: Roboto or System UI
Mono: JetBrains Mono (for code)
Personality: Clean, scalable, professional
Weights: 400, 600, 700
```

### Elegant/Luxury (Fashion, Premium Services)
```
Headings: Playfair Display
Body: Montserrat
Accents: Cormorant Garamond
Personality: Sophisticated, high-contrast, editorial
Weights: 300, 400, 700
```

### Friendly/Consumer (Apps, E-commerce)
```
Headings: Poppins
Body: Open Sans
Alternative: Nunito + Lato
Personality: Approachable, balanced, warm
Weights: 400, 600, 800
```

### Brutalist/Bold (Creative Agencies, Art)
```
Headings: Space Grotesk
Body: JetBrains Mono or IBM Plex Sans
Alternative: Archivo Black + Work Sans
Personality: Raw, technical, unconventional
Weights: 400, 700
```

### Editorial/Content-Heavy (Blogs, News)
```
Headings: Merriweather
Body: Source Sans Pro
Alternative: Lora + Raleway
Personality: Readable, trustworthy, classic
Weights: 300, 400, 700, 900
```

---

## DIMENSION 5: Animations & Interactions

### Button Interactions
```css
/* Hover Effects */
- Scale up: transform: scale(1.02)
- Lift: box-shadow elevation + translateY(-2px)
- Ripple: Radial gradient animation from click point
- Glow: Outer glow on hover (box-shadow with color)
- Border beam: Animated gradient border (Linear-style)

/* Timing */
- Duration: 150-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Input Focus States
```css
- Ring: 2-4px outline with brand color at 50% opacity
- Glow: Soft box-shadow with brand color
- Border shift: Border color change + subtle scale
- Label float: Animated label moving up on focus
- Always visible focus indicators (min 3px, 3:1 contrast)
```

### Card Hover Effects
```css
- Lift + Shadow: translateY(-4px) + shadow increase
- Tilt: 3D perspective tilt on hover (2-3deg max)
- Glow border: Animated gradient border reveal
- Content reveal: Hidden content slides in on hover
- Image zoom: Scale image 1.05x inside container
```

### Scroll Animations
```jsx
// Staggered Entrance
- Fade up: opacity 0→1 + translateY(20px→0)
- Stagger delay: 100ms between elements
- Trigger: When element is 20% in viewport
- Duration: 600ms, ease-out

// Parallax
- Hero background: Scroll speed 0.5x
- Foreground elements: Scroll speed 1.2x
- Max movement: 20-30px
- Use transform, not position
```

### Page Transitions
```css
- Fade: opacity transition 200ms
- Slide: translateX(-100%→0) 300ms
- Modal backdrop: opacity 0→1 (200ms)
- Modal content: scale(0.95→1) + opacity 0→1 (300ms)
```

### Loading States
```css
/* Skeleton Loaders */
- Shimmer: Linear gradient animation
- Shape matching: Match final content layout
- Color: #E5E7EB on white
- Animation: 1.5s infinite ease-in-out
```

### Advanced Effects
```css
/* Border Beams (Linear/Vercel Style) */
background: linear-gradient(90deg, transparent, #3B82F6, transparent);
animation: beam 2s infinite;

/* Glassmorphism */
backdrop-filter: blur(10px) saturate(180%);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Animation Performance Rules
```
✅ DO:
- Use transform and opacity (GPU accelerated)
- Set will-change for animated elements
- Use requestAnimationFrame for JS animations
- Prefer CSS animations over JS
- Test on low-end devices
- Always include prefers-reduced-motion

❌ DON'T:
- Animate width, height, or position
- Use interactions longer than 500ms
- Animate during user input
- Use too many simultaneous animations
```

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Anti-Patterns: What to AVOID

### Design Anti-Patterns
```
❌ No animations that block user action
❌ No transitions longer than 300ms for interactions
❌ No auto-playing videos with sound
❌ No light grey (#CCC) on white backgrounds
❌ No more than 3 primary colors or 2 font families
❌ Icons must have labels or tooltips
❌ No hamburger menus on desktop
❌ Minimum tap targets 44x44px
❌ No unoptimized images (use WebP, lazy loading)
❌ No layout shifts (CLS > 0.1)
```

### UX Anti-Patterns
```
❌ No labels inside inputs (accessibility)
❌ No validation only on submit
❌ No walls of text without hierarchy
❌ No auto-playing carousels
❌ No "click here" links (not descriptive)
❌ No keyboard navigation traps
❌ No missing alt text on images
❌ No color-only information conveyance
```
