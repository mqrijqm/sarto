You are a senior WebGL / Three.js engineer. Write ONE TypeScript React file: `SuitModel.tsx` for a Next.js 16 + React 19 project using `three@0.186` and `@react-three/fiber@9` (NO drei, no other deps; you may import from `three/examples/jsm/...`, e.g. `BufferGeometryUtils`).

GOAL
A procedural, fully-3D sculpture of a men's wedding suit carved in white marble / plaster, displayed on a luxury website where it slowly rotates (turntable) — the equivalent of a scanned 3D wedding dress on a mannequin. It must look like an elegant museum sculpture, NOT low-poly, NOT a toy. Think: headless tailor's mannequin wearing a sculpted suit.

ANATOMY (model units: total height ≈ 3.2, standing on y=0, centered on x/z = 0, facing +Z)
- Neck stump: short cylinder-ish, top cut flat with a slightly rounded edge (like a dress form), y ≈ 3.0–3.2.
- Shirt collar + bow tie OR tie knot at the throat.
- Jacket torso: broad shoulders (width ≈ 1.25), chest tapering to a waist (width ≈ 0.95), slight flare over hips, hem at y ≈ 1.55. Built from a lofted/lathed profile with an ELLIPTICAL cross-section (deeper chest front, flatter back), not a plain cylinder.
- Peak lapels: two separate raised panels on the chest forming a V down to the button point (y ≈ 1.95), with thickness (extruded ~0.03) and a notch/peak near the collarbone. A single button at the V. A pocket square bump on the left chest; welt pocket flaps at hips.
- Shoulders with a soft roped sleeve head; sleeves hang down slightly angled away from the body, ending at a cuff at y ≈ 1.45 (no hands — clean cut ends, like a sculpture).
- Trousers: two legs from the hem down to y≈0.12, slight taper, a crisp front crease (sharp ridge) on each leg, subtle break at the ankle.
- Shoes: simple elegant oxford-shaped blobs (toe pointing +Z).
- FABRIC FOLDS: add believable drapery using smooth low-frequency noise / sine displacement along normals (a few folds at elbows, at the back of the knees, where the jacket pulls from the button, and a few horizontal breaks above shoes). Keep it subtle and sculptural.
- Enough segments for smooth silhouettes (e.g. 64–96 radial, 60–120 vertical for main parts), then `mergeVertices` + `computeVertexNormals` for smooth shading. Target < 120k triangles total.

API
```tsx
export function SuitModel(props: JSX.IntrinsicElements["group"] & { material: THREE.Material }): JSX.Element
```
- Builds all geometries ONCE with useMemo, disposes them on unmount.
- All meshes use the passed `material`, castShadow/receiveShadow true.
- Export also `export const SUIT_HEIGHT = <number>`.
- No animation inside (the parent rotates it).
- Also export `export function createMarbleMaterial(): THREE.MeshPhysicalMaterial` — a convincing white Carrara marble: base color #f2efea, roughness ~0.38, clearcoat ~0.25, sheen, and a subtle procedural grey veining + micro variation injected via `onBeforeCompile` (3D noise in world/object space, so no UVs needed). Keep it tasteful — mostly white, faint veins.

QUALITY BAR
Readable at 1440x900 as an elegant marble suit. Clean, well-commented code (short comments). Must compile under TypeScript strict. Use `import * as THREE from "three"`.

OUTPUT FORMAT
Do NOT write files. Reply with ONLY the complete file content between the lines
===BEGIN SuitModel.tsx===
and
===END SuitModel.tsx===
