"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useInView } from "@/lib/useInView";

/**
 * Srebrni novčić-pečat: cilindar, lice/naličje = Codex slike (ujedno i bump mapa za reljef),
 * metalni PBR materijal + RoomEnvironment za refleksije. Rotacija ide iz `spin` ref-a (scroll).
 */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function useFaceTexture(src: string, flip = false, onLoad?: () => void) {
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load(src, () => onLoad?.());
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    // novčić na slici zauzima ~92% kadra — uvećaj da ivica pogodi ivicu cilindra
    t.center.set(0.5, 0.5);
    t.repeat.set(0.9, 0.9);
    if (flip) t.rotation = Math.PI;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, flip]);
  return tex;
}

function Coin({ spin, front, back }: { spin: React.RefObject<number>; front: string; back: string }) {
  const g = useRef<THREE.Group>(null);
  // novčić se prikazuje tek kad su obe strane učitane (inače blesne crn)
  const loaded = useRef(0);
  const invalidate = useThree((st) => st.invalidate);
  const onLoad = () => {
    loaded.current++;
    if (g.current && loaded.current >= 2) {
      g.current.visible = true;
      invalidate(); // iscrtaj odmah (i u "demand" režimu) => teksture odu na GPU pre skrola
    }
  };
  const fTex = useFaceTexture(front, false, onLoad);
  const bTex = useFaceTexture(back, true, onLoad);

  const mats = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: "#b9b6b2", metalness: 1, roughness: 0.38 });
    const mk = (t: THREE.Texture) =>
      new THREE.MeshStandardMaterial({
        map: t,
        bumpMap: t,
        bumpScale: 2.2,
        metalness: 0.85,
        roughness: 0.42,
        color: "#e7e4e0",
      });
    // CylinderGeometry grupe: 0 = omotač, 1 = gornja baza, 2 = donja baza
    return [edge, mk(fTex), mk(bTex)];
  }, [fTex, bTex]);

  useFrame((_, dt) => {
    const grp = g.current;
    if (!grp) return;
    const target = spin.current ?? 0;
    grp.rotation.y += (target - grp.rotation.y) * Math.min(1, dt * 6);
    grp.rotation.z = Math.sin(grp.rotation.y * 0.5) * 0.08;
  });

  return (
    <group ref={g} visible={false}>
      {/* baza cilindra gleda ka +Y — okrećemo je ka kameri */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={mats}>
        <cylinderGeometry args={[1, 1, 0.13, 96, 1]} />
      </mesh>
    </group>
  );
}

export function Coin3D({
  spin,
  front = "/media/coin-front.webp",
  back = "/media/coin-back.webp",
  className = "",
}: {
  spin: React.RefObject<number>;
  front?: string;
  back?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);
  return (
    <div ref={wrap} className={className}>
      {/* van ekrana: "demand" = samo prvi kadar (shaderi/teksture se pripreme odmah, ne tokom skrola) */}
      <Canvas frameloop={inView ? "always" : "demand"} dpr={[1, 1.75]} camera={{ position: [0, 0, 3.4], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <Env />
        <ambientLight intensity={0.25} />
        <directionalLight position={[-2, 3, 4]} intensity={1.6} />
        <Coin spin={spin} front={front} back={back} />
      </Canvas>
    </div>
  );
}
