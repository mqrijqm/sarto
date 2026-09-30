"use client";

import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isLowPower } from "@/lib/motion";

/**
 * "2.5D rotacija": fotografija skulpture + mapa dubine (belo = bliže).
 * Shader pomera piksele proporcionalno dubini (parallax), sabija sliku po X
 * i pomera svetlo — oko to čita kao da se objekat okreće.
 *
 * Svi parametri žive u `state` ref-u (ne React state) da scroll ne re-renderuje React.
 */
export type SculptState = {
  angle: number; // -1..1  => okretanje
  zoom: number; // visina slike u visinama ekrana
  y: number; // vertikalni pomeraj centra slike (u visinama ekrana, + = dole)
  fade: number; // 0..1 koliko se donji deo utapa u pozadinu
  pointerX: number; // -1..1 (miš)
  pointerY: number;
  opacity: number;
};

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform sampler2D uDepth;
uniform float uHasDepth;
uniform float uImgAspect;
uniform float uViewAspect;
uniform float uAngle;
uniform float uZoom;
uniform float uY;
uniform float uFade;
uniform vec2 uPointer;
uniform vec3 uBg;
uniform vec3 uImgBg;
uniform float uOpacity;

float depthAt(vec2 uv){ return uHasDepth > 0.5 ? texture2D(uDepth, uv).r : 0.5; }

void main(){
  // --- ekran -> koordinate slike (slika centrirana, visina = uZoom ekrana)
  float imgH = uZoom;
  float imgW = imgH * uImgAspect / uViewAspect;
  vec2 p = vUv - 0.5;
  p.y += uY;                        // + pomera sliku nadole
  vec2 uv = vec2(p.x / imgW, p.y / imgH) + 0.5;

  // okretanje: blago sabijanje po X (kosinus) — ivice "beže" od kamere
  float turn = uAngle + uPointer.x * 0.18;
  uv.x = (uv.x - 0.5) / (1.0 - abs(turn) * 0.07) + 0.5;

  // --- parallax (4 koraka) — bliži delovi se pomeraju više
  vec2 shift = vec2(turn * 0.045, uPointer.y * 0.012);
  vec2 cur = uv;
  for (int i = 0; i < 4; i++) {
    float d = depthAt(cur);
    cur = uv - shift * (d - 0.35);
  }
  uv = cur;

  // teksturu čitamo UVEK (bez if-a) — D3D/ANGLE daje crno za mipmap čitanje u grani
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  vec3 col = mix(uImgBg, texture2D(uTex, clamp(uv, 0.0, 1.0)).rgb, inside);

  // --- svetlo koje prati rotaciju (normala iz gradijenta dubine)
  if (uHasDepth > 0.5) {
    float e = 0.004;
    float dx = depthAt(uv + vec2(e, 0.0)) - depthAt(uv - vec2(e, 0.0));
    float dy = depthAt(uv + vec2(0.0, e)) - depthAt(uv - vec2(0.0, e));
    vec3 n = normalize(vec3(-dx * 6.0, -dy * 6.0, 1.0));
    vec3 L = normalize(vec3(-turn * 1.1 - 0.35, 0.45, 0.8));
    float shade = dot(n, L) - dot(vec3(0.0, 0.0, 1.0), L);
    float mask = smoothstep(0.3, 0.55, depthAt(uv)) * inside; // samo unutrašnjost — bez tamnog oboda
    col *= 1.0 + clamp(shade, -0.25, 0.25) * 0.4 * mask;
  }

  // pozadina slike -> tačna boja stranice (bez vidljivog "pravougaonika")
  // maska: sa mapom dubine (crna pozadina) je precizna; bez nje — poređenje boje
  float isBg;
  if (uHasDepth > 0.5) isBg = 1.0 - smoothstep(0.012, 0.05, depthAt(clamp(uv, 0.0, 1.0))) * inside; // blago proširena maska
  else isBg = 1.0 - smoothstep(0.015, 0.06, distance(col, uImgBg));
  col = mix(col, uBg, isBg);
  col += (uBg - uImgBg) * (1.0 - isBg) * 0.6;

  // donji deo se utapa u pozadinu
  float fadeZone = smoothstep(1.0 - uFade * 0.2, 0.985, 1.0 - uv.y);
  col = mix(col, uBg, fadeZone * step(0.001, uFade));
  col = mix(uBg, col, inside);

  gl_FragColor = vec4(col, uOpacity);
}
`;

function Plane({
  src,
  depth,
  state,
  bg,
  imgBg,
}: {
  src: string;
  depth?: string;
  state: React.RefObject<SculptState>;
  bg: string;
  imgBg: string;
}) {
  const { size, invalidate } = useThree();

  const uniforms = useMemo(
    () => ({
      uTex: { value: null as THREE.Texture | null },
      uDepth: { value: null as THREE.Texture | null },
      uHasDepth: { value: 0 },
      uImgAspect: { value: 2 / 3 },
      uViewAspect: { value: 1 },
      uAngle: { value: 0 },
      uZoom: { value: 1 },
      uY: { value: 0 },
      uFade: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uBg: { value: hex(bg) },
      uImgBg: { value: hex(imgBg) },
      uOpacity: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // materijal pravimo ručno da bi uniforms bio ISTI objekat koji menjamo
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let alive = true;
    loader.load(src, (t) => {
      if (!alive) return;
      t.colorSpace = THREE.NoColorSpace; // sirove sRGB vrednosti (Canvas je "linear")
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.anisotropy = 4;
      uniforms.uTex.value = t;
      uniforms.uImgAspect.value = t.image.width / t.image.height;
      invalidate();
    });
    if (depth)
      loader.load(depth, (t) => {
        if (!alive) return;
        t.colorSpace = THREE.NoColorSpace;
        t.minFilter = THREE.LinearFilter; // bez mipmapa — čita se u petlji
        t.generateMipmaps = false;
        uniforms.uDepth.value = t;
        uniforms.uHasDepth.value = 1;
        invalidate();
      });
    return () => {
      alive = false;
    };
  }, [src, depth, uniforms, invalidate]);

  useEffect(() => {
    uniforms.uBg.value.copy(hex(bg));
    uniforms.uImgBg.value.copy(hex(imgBg));
  }, [bg, imgBg, uniforms]);

  useFrame(() => {
    const s = state.current;
    if (!s) return;
    uniforms.uViewAspect.value = size.width / size.height;
    const u = uniforms;
    // blago "peglanje" da i skokovi skrola izgledaju glatko
    u.uAngle.value += (s.angle - u.uAngle.value) * 0.12;
    u.uZoom.value += (s.zoom - u.uZoom.value) * 0.12;
    u.uY.value += (s.y - u.uY.value) * 0.12;
    u.uFade.value = s.fade;
    u.uOpacity.value = s.opacity;
    u.uPointer.value.x += (s.pointerX - u.uPointer.value.x) * 0.06;
    u.uPointer.value.y += (s.pointerY - u.uPointer.value.y) * 0.06;
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export function DepthSculpture({
  src,
  depth,
  state,
  bg = "#f3f0ed",
  imgBg = "#efedea",
  className = "",
}: {
  src: string;
  depth?: string;
  state: React.RefObject<SculptState>;
  bg?: string;
  imgBg?: string;
  className?: string;
}) {
  const low = typeof window !== "undefined" && isLowPower();
  return (
    <div className={className}>
      <Canvas
        dpr={low ? 1 : [1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        flat
        linear
        style={{ width: "100%", height: "100%" }}
      >
        <Plane src={src} depth={depth} state={state} bg={bg} imgBg={imgBg} />
      </Canvas>
    </div>
  );
}

// hex -> sirove sRGB vrednosti 0..1 (bez konverzije u linearni prostor)
function hex(h: string) {
  const n = parseInt(h.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
