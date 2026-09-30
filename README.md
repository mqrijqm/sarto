# SARTO — skulptura vašeg vjenčanog odijela

Multipage luksuzni e-commerce / brand sajt (use-case šablon) za izmišljeni studio koji vjenčana odijela pretvara u mramorne skulpture. UX i layout su rađeni po uzoru na nagrađivani editorijalni sajt, a sav sadržaj, brend i vizuali su originalni.

**Stranice:** Početna, O nama, Proces, Galerija (filter + lightbox), Naruči (PDP + korpa), Narudžba (forma), Lista želja, Česta pitanja, Krojači, Uslovi, Privatnost, Pristupačnost.

## Šta je unutra

- **Splash** — 3D novčić (Three.js) se vrti u vazduhu, procenat prati stvarno učitavanje stranice
- **360° mramorno odijelo** — pravi 3D model (GLB) sa proceduralnim mramornim materijalom, turntable + skrol
- **Scrollytelling** — pinovani horizontalni stepper, sticky grid, push-galerija, kinetički citat sa 3D novčićem
- **Dvojezičnost** — bosanski (default) + engleski, prekidač u headeru (kolačić `lang`)
- **Performanse** — WebGL se ne renderuje van ekrana, 640px sličice za gridove, `prefers-reduced-motion`

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Three.js / React Three Fiber · pnpm

## Pokretanje

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # produkcijski build
```

## Vizuali

Sve fotografije i teksture generisane su AI generatorom slika (Codex / gpt-6-sol) — promptovi su u `_gen/`.
3D model odijela: `public/models/suit.glb`, generisan iz AI slike skulpture pomoću Tencent Hunyuan3D-2 (Tencent Hunyuan 3D Community License).
Fontovi (self-hosted, OFL): Marcellus, Cormorant, DM Sans.
