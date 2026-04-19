

## Framer-Style Premium Redesign Plan

You want the Framer aesthetic: clean, ultra-professional, but with subtle high-end motion that makes the site feel alive and unique — not flashy or distracting. Think slow reveals, smooth parallax, magnetic hover states, and a few signature "wow" moments rather than animation everywhere.

### The Direction

**Restraint over spectacle.** Framer's best sites use motion as punctuation: a hero that breathes, sections that reveal as you scroll, hover states that feel weighted, and one or two signature visual moments (like your spinning logo). Everything else stays still and lets the content speak.

### What I'd Build

**1. Hero — Cinematic Anchor**
- Keep the spinning 3D Resurrected Labz logo as the centerpiece
- Add a slow-drifting molecular/particle field behind it (very subtle, low opacity)
- Soft radial glow that pulses with the logo
- Headline + tagline + CTAs reveal in staggered sequence (Framer signature: 80ms delays, spring easing)
- Scroll indicator at the bottom with a subtle bounce

**2. Product Showcase — The "Wow" Moment**
- When you upload your peptide vial photos, build a horizontal scroll gallery where vials float past with parallax depth (foreground vials move faster than background)
- Each vial card has a magnetic hover (cursor pulls the card slightly toward it)
- Click reveals the product detail with a smooth shared-element transition

**3. Scroll-Triggered Reveals (site-wide)**
- Section headings fade up with a slight blur-to-sharp effect as they enter view
- Numbers/stats count up when visible
- Images mask in from below with a clip-path reveal
- All using IntersectionObserver — no heavy library

**4. Interactive Polish**
- Magnetic buttons (the cursor subtly pulls them)
- Custom cursor that grows on interactive elements (optional, can toggle)
- Smooth scroll with momentum
- Page transitions that fade between routes

**5. Signature Visual Touches**
- Hairline grid that fades in on hover over hero (architectural feel)
- Section numbers (01 / 06) that scroll-track on the side
- A subtle film grain overlay site-wide (already partially in place)
- Section dividers that draw themselves in as you scroll

### Image Strategy (For Your Uploads)

When you upload your logo + peptide images, I'll:
- Process each to ensure clean transparent backgrounds
- Build a centralized image asset module so swaps are one-line edits
- Create reusable product card / gallery / hero image components that handle the parallax + reveal animations consistently
- Optimize for retina + lazy-load below the fold

### Technical Approach

- **Animations**: CSS keyframes + Tailwind for simple stuff, IntersectionObserver for scroll triggers, Framer Motion only where physics matter (magnetic hover, page transitions). Keeps bundle small.
- **No new heavy dependencies** — Framer Motion is the only addition (~30kb gzipped)
- **Performance**: All animations GPU-accelerated (transform + opacity only), reduced-motion respected, mobile gets simplified versions

### Recommended Build Order

1. **First**: Upload your logo + peptide images so I have real assets to design around
2. **Phase 1**: Hero polish + scroll-reveal system + magnetic buttons (foundation)
3. **Phase 2**: Product gallery with parallax + hover states (the showcase)
4. **Phase 3**: Page transitions + section numbers + signature touches (the finish)

Doing it in phases lets you react to each layer before we go further — so if a particular animation doesn't feel right, we adjust before building on top of it.

### What I Need From You

- Upload the peptide product photos (vials, packaging, anything you want featured)
- Confirm: keep the current 3D spinning logo system, or refresh it?
- Any specific Framer sites you've seen that nail the feel you want? (helps me calibrate restraint vs. expressiveness)

