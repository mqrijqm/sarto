"use client";

import { useEffect, useMemo, type JSX } from "react";
import * as THREE from "three";

export const SUIT_HEIGHT = 3.2;

type ProfilePoint = {
  y: number;
  rx: number;
  rz: number;
  cx?: number;
  cz?: number;
};

type Fold = (y: number, angle: number) => number;

const torsoProfile: ProfilePoint[] = [
  { y: 1.53, rx: 0.49, rz: 0.29 },
  { y: 1.72, rx: 0.51, rz: 0.31 },
  { y: 2.02, rx: 0.45, rz: 0.30 },
  { y: 2.34, rx: 0.49, rz: 0.34 },
  { y: 2.63, rx: 0.57, rz: 0.34 },
  { y: 2.77, rx: 0.60, rz: 0.30 },
  { y: 2.83, rx: 0.55, rz: 0.27 },
  { y: 2.90, rx: 0.24, rz: 0.20 },
];

function sampleProfile(profile: ProfilePoint[], y: number): ProfilePoint {
  let i = 0;
  while (i < profile.length - 2 && y > profile[i + 1].y) i++;

  const a = profile[i];
  const b = profile[i + 1];
  const t = THREE.MathUtils.clamp((y - a.y) / (b.y - a.y), 0, 1);
  const mix = (key: "rx" | "rz" | "cx" | "cz") =>
    THREE.MathUtils.lerp(a[key] ?? 0, b[key] ?? 0, t);

  return { y, rx: mix("rx"), rz: mix("rz"), cx: mix("cx"), cz: mix("cz") };
}

function signedPower(value: number, power: number): number {
  return Math.sign(value) * Math.abs(value) ** power;
}

function frontDepth(x: number, y: number): number {
  const p = sampleProfile(
    torsoProfile,
    THREE.MathUtils.clamp(y, 1.53, 2.9),
  );
  const ratio = THREE.MathUtils.clamp(x / p.rx, -0.999, 0.999);
  return (p.cz ?? 0) + p.rz * (1 - Math.abs(ratio) ** 3.4) ** (1 / 3.4);
}

function makeLoft(
  profile: ProfilePoint[],
  radialSegments: number,
  heightSegments: number,
  fold: Fold = () => 0,
  exponent = 2.5,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const bottom = profile[0].y;
  const top = profile[profile.length - 1].y;

  for (let row = 0; row <= heightSegments; row++) {
    const y = THREE.MathUtils.lerp(bottom, top, row / heightSegments);
    const p = sampleProfile(profile, y);

    for (let j = 0; j < radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const displacement = fold(y, angle);
      const s = signedPower(Math.sin(angle), 2 / exponent);
      const c = signedPower(Math.cos(angle), 2 / exponent);
      positions.push(
        (p.cx ?? 0) + (p.rx + displacement) * s,
        y,
        (p.cz ?? 0) + (p.rz + displacement) * c,
      );
    }
  }

  for (let row = 0; row < heightSegments; row++) {
    for (let j = 0; j < radialSegments; j++) {
      const next = (j + 1) % radialSegments;
      const a = row * radialSegments + j;
      const b = row * radialSegments + next;
      const c = (row + 1) * radialSegments + j;
      const d = (row + 1) * radialSegments + next;
      indices.push(a, b, c, b, d, c);
    }
  }

  const bottomCenter = positions.length / 3;
  positions.push(profile[0].cx ?? 0, bottom, profile[0].cz ?? 0);
  const topCenter = positions.length / 3;
  positions.push(
    profile[profile.length - 1].cx ?? 0,
    top,
    profile[profile.length - 1].cz ?? 0,
  );

  const lastRow = heightSegments * radialSegments;
  for (let j = 0; j < radialSegments; j++) {
    const next = (j + 1) % radialSegments;
    indices.push(bottomCenter, next, j);
    indices.push(topCenter, lastRow + j, lastRow + next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// The jacket shell leaves a real opening at the front. Its two cut edges
// remain visible beneath the separately carved front panels.
function makeOpenTorso(): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const rows = 70;
  const columns = 72;

  for (let row = 0; row <= rows; row++) {
    const y = THREE.MathUtils.lerp(1.53, 2.9, row / rows);
    const p = sampleProfile(torsoProfile, y);
    const opening =
      y < 1.94
        ? THREE.MathUtils.lerp(0.72, 0.10, (y - 1.53) / 0.41)
        : y < 2.22
          ? THREE.MathUtils.lerp(0.10, 0.25, (y - 1.94) / 0.28)
          : THREE.MathUtils.lerp(0.25, 0.85, (y - 2.22) / 0.68);

    for (let column = 0; column <= columns; column++) {
      const angle =
        opening + ((Math.PI * 2 - 2 * opening) * column) / columns;
      const s = signedPower(Math.sin(angle), 2 / 3.3);
      const c = signedPower(Math.cos(angle), 2 / 3.3);
      const backFold =
        0.005 *
        Math.sin(34 * y + 4 * angle) *
        Math.exp(-(((y - 2.02) / 0.28) ** 2)) *
        Math.max(0, -Math.cos(angle));
      positions.push(
        p.rx * s,
        y,
        (p.cz ?? 0) + (p.rz + backFold) * c,
      );
    }
  }

  const stride = columns + 1;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * stride + column;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function warpedExtrusion(
  outline: Array<[number, number]>,
  depth: number,
  lift: number,
  bevel = 0.003,
  followTorso = true,
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  outline.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    curveSegments: 1,
    steps: 1,
  });

  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    positions.setZ(
      i,
      z + lift + (followTorso ? frontDepth(x, y) : 0),
    );
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function line(
  points: Array<[number, number, number]>,
  radius = 0.004,
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  );
  return new THREE.TubeGeometry(curve, Math.max(12, points.length * 6), radius, 5);
}

function ellipsoid(
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  widthSegments = 24,
  heightSegments = 14,
): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(
    1,
    widthSegments,
    heightSegments,
  );
  geometry.scale(rx, ry, rz);
  geometry.translate(x, y, z);
  return geometry;
}

function box(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  geometry.translate(x, y, z);
  return geometry;
}

function frontPanel(side: -1 | 1): THREE.BufferGeometry {
  const points: Array<[number, number]> = [
    [0.40, 1.55],
    [0.31, 1.57],
    [0.24, 1.64],
    [0.20, 1.74],
    [0.16, 1.84],
    [0.075, 1.955],
    [0.11, 2.13],
    [0.18, 2.34],
    [0.23, 2.55],
    [0.19, 2.76],
    [0.25, 2.88],
    [0.53, 2.83],
    [0.59, 2.76],
    [0.55, 2.57],
    [0.49, 2.31],
    [0.46, 2.04],
    [0.48, 1.75],
  ];
  return warpedExtrusion(
    points.map(([x, y]) => [x * side, y]),
    0.026,
    0.012,
    0.003,
  );
}

function lapel(side: -1 | 1): THREE.BufferGeometry {
  // A peaked outer tip, a cut gorge, and a narrow roll into the button.
  const points: Array<[number, number]> = [
    [0.068, 1.975],
    [0.15, 2.19],
    [0.25, 2.45],
    [0.39, 2.66],
    [0.53, 2.75],
    [0.35, 2.725],
    [0.41, 2.79],
    [0.27, 2.87],
    [0.15, 2.91],
    [0.17, 2.76],
    [0.16, 2.58],
    [0.09, 2.29],
  ];
  return warpedExtrusion(
    points.map(([x, y]) => [x * side, y]),
    0.043,
    0.050,
    0.0035,
  );
}

function shoeSole(cx: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.165, 0.20);
  shape.lineTo(-0.19, 0.10);
  shape.lineTo(-0.18, -0.24);
  shape.quadraticCurveTo(-0.16, -0.29, -0.105, -0.30);
  shape.lineTo(0.105, -0.30);
  shape.quadraticCurveTo(0.16, -0.29, 0.18, -0.24);
  shape.lineTo(0.19, 0.10);
  shape.quadraticCurveTo(0.17, 0.35, 0, 0.38);
  shape.quadraticCurveTo(-0.17, 0.35, -0.165, 0.20);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.038,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.006,
    bevelSegments: 1,
    curveSegments: 6,
  });

  // The outline was drawn in x/z. Extrusion becomes the sole's y thickness.
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(cx, 0.025, 0);
  return geometry;
}

function buildSuit(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];

  parts.push(makeOpenTorso());

  // A squared shoulder bridge gives the jacket a tailored top line.
  parts.push(
    warpedExtrusion(
      [
        [-0.57, 2.765],
        [-0.51, 2.83],
        [-0.25, 2.89],
        [0.25, 2.89],
        [0.51, 2.83],
        [0.57, 2.765],
        [0.25, 2.79],
        [-0.25, 2.79],
      ],
      0.024,
      0.002,
      0.002,
    ),
  );

  // Narrow neck stump with a flat, cut top.
  parts.push(
    makeLoft(
      [
        { y: 2.85, rx: 0.153, rz: 0.15 },
        { y: 2.95, rx: 0.151, rz: 0.149 },
        { y: 3.17, rx: 0.149, rz: 0.147 },
        { y: SUIT_HEIGHT, rx: 0.149, rz: 0.147 },
      ],
      40,
      18,
      undefined,
      2,
    ),
  );
  parts.push(
    makeLoft(
      [
        { y: 2.91, rx: 0.185, rz: 0.171 },
        { y: 2.935, rx: 0.186, rz: 0.172 },
        { y: 2.96, rx: 0.173, rz: 0.162 },
      ],
      40,
      5,
      undefined,
      2,
    ),
  );

  for (const side of [-1, 1] as const) {
    // The sleeve meets the shoulder only at its head. The inner sleeve edge
    // stays clear of the waist and torso all the way to the cuff.
    parts.push(
      makeLoft(
        [
          { y: 1.43, rx: 0.145, rz: 0.142, cx: side * 0.84, cz: 0.15 },
          { y: 1.48, rx: 0.154, rz: 0.147, cx: side * 0.84, cz: 0.15 },
          { y: 1.73, rx: 0.159, rz: 0.149, cx: side * 0.83, cz: 0.14 },
          { y: 2.02, rx: 0.169, rz: 0.157, cx: side * 0.79, cz: 0.12 },
          { y: 2.28, rx: 0.179, rz: 0.169, cx: side * 0.76, cz: 0.06 },
          { y: 2.54, rx: 0.185, rz: 0.176, cx: side * 0.73, cz: 0.005 },
          { y: 2.75, rx: 0.19, rz: 0.176, cx: side * 0.68, cz: -0.005 },
          { y: 2.82, rx: 0.155, rz: 0.15, cx: side * 0.65, cz: -0.005 },
        ],
        40,
        72,
        (y, angle) => {
          const elbow = Math.exp(-(((y - 2.02) / 0.15) ** 2));
          const cuff = Math.exp(-(((y - 1.51) / 0.105) ** 2));
          return (
            0.006 * elbow * Math.sin(39 * y + 2.7 * angle) +
            0.004 * cuff * Math.sin(44 * y - 1.5 * angle)
          );
        },
        2.7,
      ),
    );

    parts.push(
      line(
        [
          [side * 0.58, 2.755, 0.17],
          [side * 0.69, 2.775, 0.165],
          [side * 0.79, 2.735, 0.12],
          [side * 0.84, 2.66, 0.08],
        ],
        0.006,
      ),
    );
    parts.push(
      line(
        [
          [side * 0.69, 1.50, 0.26],
          [side * 0.78, 1.493, 0.30],
          [side * 0.88, 1.495, 0.28],
          [side * 0.96, 1.505, 0.20],
        ],
        0.004,
      ),
    );

    const cx = side * 0.245;
    parts.push(
      makeLoft(
        [
          { y: 0.11, rx: 0.169, rz: 0.166, cx },
          { y: 0.18, rx: 0.177, rz: 0.174, cx },
          { y: 0.32, rx: 0.171, rz: 0.18, cx },
          { y: 0.72, rx: 0.182, rz: 0.186, cx },
          { y: 1.08, rx: 0.197, rz: 0.199, cx },
          { y: 1.46, rx: 0.213, rz: 0.207, cx },
          { y: 1.66, rx: 0.213, rz: 0.205, cx },
        ],
        44,
        76,
        (y, angle) => {
          const front = Math.max(0, Math.cos(angle));
          const crease =
            0.018 *
            front *
            Math.exp(-(Math.sin(angle) ** 2) / 0.007);
          const knee = Math.exp(-(((y - 0.69) / 0.17) ** 2));
          const breakFold = Math.exp(-(((y - 0.24) / 0.11) ** 2));
          return (
            crease +
            0.004 * knee * Math.sin(36 * y + 2 * angle) +
            0.009 * breakFold * Math.sin(45 * y + 2.3 * angle)
          );
        },
        2.8,
      ),
    );

    parts.push(shoeSole(cx));
    parts.push(ellipsoid(cx, 0.122, 0.085, 0.177, 0.093, 0.29));
    parts.push(ellipsoid(cx, 0.115, -0.17, 0.16, 0.074, 0.12));
    parts.push(box(cx, 0.075, -0.205, 0.30, 0.075, 0.14));
    parts.push(
      line(
        [
          [cx - 0.15, 0.126, 0.205],
          [cx - 0.12, 0.18, 0.21],
          [cx, 0.205, 0.215],
          [cx + 0.12, 0.18, 0.21],
          [cx + 0.15, 0.126, 0.205],
        ],
        0.0035,
      ),
    );

    // Jacket fronts meet at one button, then separate into cutaway quarters.
    parts.push(frontPanel(side));
    parts.push(lapel(side));

    // Shirt collar points sit inside the lapel opening.
    parts.push(
      warpedExtrusion(
        [
          [side * 0.11, 2.91],
          [side * 0.20, 2.91],
          [side * 0.29, 2.78],
          [side * 0.16, 2.66],
        ],
        0.025,
        0.077,
        0.0025,
      ),
    );

    // Thin, straight pocket flaps have a definite lower edge.
    const pocketX = side * 0.36;
    parts.push(
      warpedExtrusion(
        [
          [pocketX - 0.135, 1.82],
          [pocketX + 0.135, 1.82],
          [pocketX + 0.124, 1.765],
          [pocketX - 0.124, 1.765],
        ],
        0.018,
        0.038,
        0.002,
      ),
    );
    parts.push(
      warpedExtrusion(
        [
          [pocketX - 0.126, 1.835],
          [pocketX + 0.126, 1.835],
          [pocketX + 0.126, 1.818],
          [pocketX - 0.126, 1.818],
        ],
        0.017,
        0.049,
        0.0015,
      ),
    );

    // Small diagonal carving lines pull the cloth toward the button.
    parts.push(
      line(
        [
          [side * 0.095, 1.94, frontDepth(side * 0.095, 1.94) + 0.046],
          [side * 0.25, 1.88, frontDepth(side * 0.25, 1.88) + 0.044],
          [side * 0.40, 1.80, frontDepth(side * 0.40, 1.80) + 0.038],
        ],
        0.003,
      ),
    );
  }

  // Visible waistband and shirt occupy the jacket's actual opening.
  parts.push(box(0, 1.64, 0.205, 0.78, 0.095, 0.24));
  parts.push(
    warpedExtrusion(
      [
        [-0.15, 2.76],
        [0.15, 2.76],
        [0.095, 2.43],
        [0.035, 2.02],
        [-0.035, 2.02],
        [-0.095, 2.43],
      ],
      0.016,
      0.012,
      0.002,
    ),
  );

  // Two separate bow wings and a small central knot.
  parts.push(
    warpedExtrusion(
      [
        [-0.035, 2.744],
        [-0.165, 2.786],
        [-0.16, 2.691],
        [-0.035, 2.723],
      ],
      0.033,
      0.086,
      0.002,
    ),
  );
  parts.push(
    warpedExtrusion(
      [
        [0.035, 2.744],
        [0.165, 2.786],
        [0.16, 2.691],
        [0.035, 2.723],
      ],
      0.033,
      0.086,
      0.002,
    ),
  );
  parts.push(
    ellipsoid(0, 2.735, frontDepth(0, 2.735) + 0.118, 0.041, 0.045, 0.025),
  );

  // One button anchors the overlapping panels.
  parts.push(
    ellipsoid(
      0,
      1.96,
      frontDepth(0, 1.96) + 0.072,
      0.032,
      0.032,
      0.013,
      16,
      10,
    ),
  );

  // The back vent is suggested by two separated edges and a spine seam.
  parts.push(
    line(
      [
        [0, 2.79, -0.292],
        [0, 2.42, -0.329],
        [0, 2.05, -0.293],
        [0, 1.82, -0.301],
      ],
      0.0035,
    ),
  );
  parts.push(
    line(
      [
        [-0.017, 1.82, -0.302],
        [-0.02, 1.69, -0.312],
        [-0.026, 1.55, -0.295],
      ],
      0.003,
    ),
  );
  parts.push(
    line(
      [
        [0.017, 1.82, -0.302],
        [0.024, 1.69, -0.312],
        [0.031, 1.55, -0.295],
      ],
      0.003,
    ),
  );

  return parts;
}

export function createMarbleMaterial(
  tex?: THREE.Texture,
): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    color: "#eceae6",
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25,
  });

  material.onBeforeCompile = (shader) => {
    if (tex) shader.uniforms.uMarbleTexture = { value: tex };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vMarblePosition;
varying vec3 vMarbleNormal;
varying vec3 vMarbleViewNormal;
varying vec3 vMarbleViewDirection;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vMarblePosition = position;
vMarbleNormal = normal;
vMarbleViewNormal = normalize(normalMatrix * normal);
vMarbleViewDirection = -(modelViewMatrix * vec4(position, 1.0)).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vMarblePosition;
varying vec3 vMarbleNormal;
varying vec3 vMarbleViewNormal;
varying vec3 vMarbleViewDirection;
${tex ? "uniform sampler2D uMarbleTexture;" : ""}

float marbleHash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float marbleNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(marbleHash(i), marbleHash(i + vec3(1.,0.,0.)), f.x),
        mix(marbleHash(i + vec3(0.,1.,0.)), marbleHash(i + vec3(1.,1.,0.)), f.x), f.y),
    mix(mix(marbleHash(i + vec3(0.,0.,1.)), marbleHash(i + vec3(1.,0.,1.)), f.x),
        mix(marbleHash(i + vec3(0.,1.,1.)), marbleHash(i + vec3(1.,1.,1.)), f.x), f.y),
    f.z
  );
}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
vec3 marbleP = vMarblePosition;
float warmCloud = marbleNoise(marbleP * 1.35 + vec3(2.7, 0.4, 1.1));
float coolCloud = marbleNoise(marbleP * 1.8 + vec3(7.2, 3.6, 4.1));
diffuseColor.rgb *= vec3(
  1.0 + (warmCloud - 0.5) * 0.035,
  1.0 + (warmCloud - coolCloud) * 0.012,
  1.0 + (coolCloud - 0.5) * 0.035
);
${
  tex
    ? `vec3 weights = pow(abs(normalize(vMarbleNormal)), vec3(4.0));
weights /= max(weights.x + weights.y + weights.z, 0.0001);
vec3 albedo =
  texture2D(uMarbleTexture, marbleP.yz / 0.9).rgb * weights.x +
  texture2D(uMarbleTexture, marbleP.xz / 0.9).rgb * weights.y +
  texture2D(uMarbleTexture, marbleP.xy / 0.9).rgb * weights.z;
diffuseColor.rgb *= albedo;`
    : `float warp = marbleNoise(marbleP * 2.8 + vec3(4.2, 8.1, 1.7));
float fineWarp = marbleNoise(marbleP * 8.5 + vec3(1.4, 2.6, 5.9));
float phase = marbleP.x * 18.0 + marbleP.y * 5.0 +
              marbleP.z * 11.0 + warp * 6.0 + fineWarp * 1.5;
float vein = pow(1.0 - abs(sin(phase)), 28.0);
vein *= smoothstep(0.32, 0.74,
  marbleNoise(marbleP * 3.7 + vec3(6.0, 2.0, 3.0)));
diffuseColor.rgb = mix(
  diffuseColor.rgb,
  vec3(0.397, 0.376, 0.361),
  vein * 0.25
);`
}
float facing = abs(dot(
  normalize(vMarbleViewNormal),
  normalize(vMarbleViewDirection)
));
diffuseColor.rgb += vec3(0.035) * pow(1.0 - facing, 3.0);`,
      );
  };

  material.customProgramCacheKey = () =>
    tex ? "suit-carrara-v2-triplanar" : "suit-carrara-v2-procedural";

  return material;
}

export function SuitModel(
  props: JSX.IntrinsicElements["group"] & { material: THREE.Material },
): JSX.Element {
  const { material, ...groupProps } = props;
  const parts = useMemo(buildSuit, []);

  useEffect(
    () => () => {
      for (const geometry of parts) geometry.dispose();
    },
    [parts],
  );

  return (
    <group {...groupProps}>
      {parts.map((geometry, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={material}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
