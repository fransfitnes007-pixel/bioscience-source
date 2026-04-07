

## Plan: Framer-Style Hero Animation with Branded Vial + Full Site Polish

### What We're Building

Replace the current particle-based hero background animation with a cinematic, Framer-inspired animation centered on the Resurrected Labz branded vial image. The vial will be the visual anchor of the hero, floating with a subtle 3D parallax effect, surrounded by particle trails and a glowing aura --- creating a premium, high-end feel that rivals top peptide websites.

### Animation Concept

The vial image fades in from below and gently floats in 3D space. Molecular particles orbit around it in slow arcs. A soft white glow pulses behind the vial. Mouse movement creates a parallax tilt effect on the vial (Framer signature). The full Resurrected Labz logo sits above.

### Technical Approach

**1. Copy the vial image asset**
- Copy `user-uploads://Untitled_design_5.png` to `src/assets/hero-vial.png`
- Process with Python to remove the light grey background, making it fully transparent

**2. Rewrite `MolecularAnimation.tsx`**
- Keep the particle network but make it subtler (fewer particles, lower opacity)
- Add the vial as a centered, floating element with:
  - CSS `float` animation (gentle up/down bobbing)
  - Mouse-driven parallax via CSS `transform: perspective(1000px) rotateX() rotateY()` --- classic Framer 3D tilt
  - A radial gradient glow behind the vial that pulses
  - Orbiting small glowing dots around the vial (CSS animation on circular paths)
- Smooth scroll-linked fade-out as user scrolls down

**3. Update `HeroSection.tsx`**
- Keep the massive logo + tagline + CTA buttons exactly as they are
- The vial animation becomes part of the background/mid-layer, sitting behind the logo text but above the particle field
- Add staggered entrance animations: logo fades up first, then tagline, then buttons (Framer-style sequential reveal with `animation-delay`)

**4. Add Tailwind keyframes** (in `tailwind.config.ts`)
- `vial-float`: gentle Y-axis bob
- `orbit`: circular rotation for orbiting particles
- `glow-pulse`: radial glow intensity pulse
- `reveal-up`: staggered content reveal with spring-like easing

**5. Product cards & pricing (from the earlier request)**
- Set all prices to `0` in `products-data.ts` (or display as "Contact for Pricing")
- Remove product images from `ProductCard.tsx` --- replace with a minimal molecule/flask icon or the vial image
- Keep all product info, descriptions, and scientific data intact

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/assets/hero-vial.png` | Create (processed transparent vial) |
| `src/components/home/MolecularAnimation.tsx` | Rewrite with vial + parallax + orbiting particles |
| `src/components/home/HeroSection.tsx` | Add staggered Framer-style entrance animations |
| `tailwind.config.ts` | Add new keyframes and animations |
| `src/lib/products-data.ts` | Zero out all prices |
| `src/components/products/ProductCard.tsx` | Remove product images, show icon placeholder |
| `src/index.css` | Add any utility classes for parallax/3D transforms |

