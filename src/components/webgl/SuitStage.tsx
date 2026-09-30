"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SUIT_HEIGHT, createMarbleMaterial } from "./SuitModel";
import { isLowPower } from "@/lib/motion";

/**
 * Scena za 3D mermerno odelo iz GLB fajla (npr. Meshy / Tripo image-to-3D):
 *  - model se automatski centrira i skalira na SUIT_HEIGHT
 *  - svi materijali se menjaju mermerom (createMarbleMaterial, opciono sa teksturom)
 *  - stalna spora "turntable" rotacija; `progress` (0..1 iz skrola) podiže model i dodaje okret
 */
export type StageState = { progress: number; pointerX: number; pointerY: number };

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.35;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function useMarble(textureUrl?: string) {
  const [tex, setTex] = useState<THREE.Texture | undefined>();
  useEffect(() => {
    if (!textureUrl) return;
    let alive = true;
    new THREE.TextureLoader().load(textureUrl, (t) => {
      if (!alive) return;
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      setTex(t);
    });
    return () => {
      alive = false;
    };
  }, [textureUrl]);
  const mat = useMemo(() => createMarbleMaterial(tex), [tex]);
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

/** Učitava GLB, normalizuje veličinu/poziciju i stavlja mermer na sve mesheve. */
function GlbModel({ url, material }: { url: string; material: THREE.Material }) {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    let alive = true;
    new GLTFLoader().load(url, (gltf) => {
      if (!alive) return;
      const root = gltf.scene;
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const s = SUIT_HEIGHT / size.y;
      root.scale.setScalar(s);
      root.position.set(-center.x * s, -box.min.y * s, -center.z * s);
      root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (!mesh.geometry.attributes.normal) mesh.geometry.computeVertexNormals();
        mesh.castShadow = mesh.receiveShadow = true;
      });
      setObj(root);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  useEffect(() => {
    obj?.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.material = material;
    });
  }, [obj, material]);

  return obj ? <primitive object={obj} /> : null;
}

function Rig({ state, url, texture }: { state: React.RefObject<StageState>; url: string; texture?: string }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const material = useMarble(texture);
  const { camera, size } = useThree();

  useFrame((_, dt) => {
    const g = group.current;
    const s = state.current;
    if (!g || !s) return;
    const d = Math.min(dt, 0.05);
    spin.current += d * 0.22; // idle turntable
    const p = s.progress;
    // model ulazi odozdo (samo vrat/ramena vire) i penje se dok se ne vidi porub
    const targetY = THREE.MathUtils.lerp(-SUIT_HEIGHT * 0.32, SUIT_HEIGHT * 0.42, p);
    g.position.y += (targetY - g.position.y) * Math.min(1, d * 5);
    const rotTarget = spin.current + p * Math.PI * 1.1 + s.pointerX * 0.25;
    g.rotation.y += (rotTarget - g.rotation.y) * Math.min(1, d * 4);
    g.rotation.x += (s.pointerY * 0.04 - g.rotation.x) * Math.min(1, d * 3);
    const cam = camera as THREE.PerspectiveCamera;
    const dist = size.width < 768 ? 6.2 : 4.5;
    cam.position.set(0, SUIT_HEIGHT * 0.78, dist);
    cam.lookAt(0, SUIT_HEIGHT * 0.78, 0);
  });

  return (
    <group ref={group} position={[0, -SUIT_HEIGHT * 0.32, 0]}>
      <GlbModel url={url} material={material} />
    </group>
  );
}

export function SuitStage({
  state,
  url = "/models/suit.glb",
  texture = "/media/marble-tex.webp",
  className = "",
}: {
  state: React.RefObject<StageState>;
  url?: string;
  texture?: string;
  className?: string;
}) {
  const low = typeof window !== "undefined" && isLowPower();
  return (
    <div className={className}>
      <Canvas
        dpr={low ? 1 : [1, 1.75]}
        camera={{ fov: 26, near: 0.1, far: 50, position: [0, 2.5, 5.6] }}
        gl={{
          alpha: true,
          antialias: !low,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.78,
        }}
        shadows={!low}
        style={{ width: "100%", height: "100%" }}
      >
        <Env />
        <hemisphereLight args={["#ffffff", "#cbbfb4", 0.35]} />
        <directionalLight position={[-4, 5.5, 3.2]} intensity={2.6} castShadow={!low} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
        <directionalLight position={[4.5, 3, -3.5]} intensity={1.3} color="#fff1e4" />
        <directionalLight position={[2.5, 1, 6]} intensity={0.18} />
        <Rig state={state} url={url} texture={texture} />
      </Canvas>
    </div>
  );
}
