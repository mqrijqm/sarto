You previously wrote `src/components/webgl/SuitModel.tsx` (read it from C:\Users\marija\Projects\radovi\trecira\src\components\webgl\SuitModel.tsx — same API must stay: `SuitModel({material, ...groupProps})`, `SUIT_HEIGHT`, `createMarbleMaterial()`; three@0.186, @react-three/fiber@9, no drei).

The attached screenshots show how it renders now (image 1: bust entering, image 2: mid-scroll back view). Art director's verdict: it reads as a soft inflated TOY / blob, not a sculpted marble suit. Attached image 3 is the mood reference: classical white Carrara marble sculpture with crisp carved edges.

Rewrite the model (v2) so it reads as an elegant museum marble sculpture of a men's suit on a headless dress-form:
1. SILHOUETTE: clearly separated arms — visible air gap between sleeves and torso along the whole arm length; sleeves slightly bent at the elbow and angled forward. Distinct shoulder line with square tailored shoulders (sharp shoulder seam ridge), NOT a rounded bottle neck. Neck stump narrower (radius ~0.15) with a crisp flat cut top and a visible shirt collar ring around it.
2. JACKET FRONT: real opening — the two front panels of the jacket overlap at the button and then OPEN below it into a V showing the trousers/waistband; hem with curved "quarters" (front corners cut away). Peak lapels must be CRISP raised planes (thickness 0.035–0.05) with sharp edges (use extruded shapes with small bevel), a clear gorge seam and a notch/peak, rolling from collar to button. Shirt front + bow tie visible in the V between lapels. Pocket flaps as crisp thin boxes with bevel. Back: center vent (a slit) and a seam line down the spine.
3. TROUSERS: two clearly separate legs with a gap between them from the crotch down, sharp front crease ridge, gentle break folds above the shoes, a waistband visible under the open jacket.
4. SHOES: proper oxford last shape (toe box, heel, sole edge as a slightly protruding thin slab).
5. DETAIL / CARVING: sharper features overall — use higher-frequency but small-amplitude drapery folds (diagonal pulls from the button, creases at elbows and back of knees), and a flat-ish planar faceting on the lapels. Avoid everything being the same soft rounded lathe.
6. MATERIAL `createMarbleMaterial()`: MeshPhysicalMaterial, color #eceae6, roughness 0.32, clearcoat 0.35, clearcoatRoughness 0.25; keep your onBeforeCompile noise veining but make veins visible: thin, soft grey (#a9a6a2) meandering veins with ~0.25 opacity, plus very subtle large-scale warm/cool mottling, and a tiny bit of fake subsurface (brighten grazing angles slightly). Also accept an OPTIONAL argument `createMarbleMaterial(tex?: THREE.Texture)` — when given, use it as a TRIPLANAR marble albedo (object-space, scale ~0.9 units per tile, blend by normal^4) multiplied onto the base color instead of the procedural veins.
7. Performance: < 150k triangles total, geometries built once in useMemo, disposed on unmount. Compile under TS strict (avoid `-x ** 2`, write `-(x ** 2)`).

OUTPUT: Do NOT write files. Reply with ONLY the complete new file between
===BEGIN SuitModel.tsx===
and
===END SuitModel.tsx===
