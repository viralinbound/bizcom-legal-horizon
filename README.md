# Bizcom Legal — "Horizon" (OVA-inspired direction)

Static site. Edit `build.mjs` (pages + copy), `styles.css`, `script.js`, then run `node build.mjs`.
Preview: `python -m http.server 3088` → http://localhost:3088

- Reference: ova-investment.com (horizon sky, curved card ring, full-bleed panels, word swap, rising dome, dusk contact).
- Palette stays on-brand: graphite greys + white, logo red as the horizon line. Fonts: Geist + Geist Mono.
- No WebGL. Lenis (jsdelivr) for smooth scroll; everything falls back to native scroll and respects reduced motion.
- Photos = the approved illustrative set copied from bizcom-legal-luxe (no team photos).
- Form posts to FormSubmit (same endpoint as the live site).
