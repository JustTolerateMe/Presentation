"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── 1. DYNAMIC FLUID RIBBON ───────────────────────────────────────────────
function FireRibbon({ active, scroll }: { active: boolean, scroll: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // uDarkness: 0 (Light Mode / Ink) -> 1 (Dark Mode / Ember)
  const uDarkness = Math.max(0, Math.min(1, (scroll - 0.15) * 8));

  const shader = useMemo(() => ({
    uniforms: {
      uTime:     { value: 0 },
      uPlunge:   { value: 0 },
      uDarkness: { value: 0 },
    },
    vertexShader: `
      varying vec2  vUv;
      varying float vDisp;
      uniform float uTime;
      uniform float uPlunge;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float x = pos.x;
        float y = pos.y;
        float t = uTime;

        float n  = sin(x * 0.4 + t * 0.5) * 1.5;
              n += cos(x * 1.0 + y * 0.6 + t * 0.8) * 0.8;
              n += sin(x * 2.5 + t * 1.5) * 0.3;
              n += sin(y * 3.0 + t * 0.6) * 0.4;
              n += sin(x * 6.0 + t * 4.0) * uPlunge * 2.0;

        pos.z   += n;
        vDisp    = n;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2  vUv;
      varying float vDisp;
      uniform float uPlunge;
      uniform float uDarkness;

      void main() {
        float h = clamp((vDisp + 3.0) / 6.0, 0.0, 1.0);
        
        // INTERPOLATED PALETTE
        // Light Palette (Ink)
        vec3 L0 = vec3(1.0, 0.95, 0.9);
        vec3 L1 = vec3(0.1, 0.05, 0.02);
        vec3 L2 = vec3(0.85, 0.42, 0.17);
        
        // Dark Palette (Ember)
        vec3 D0 = vec3(0.05, 0.0, 0.0);
        vec3 D1 = vec3(0.9, 0.2, 0.0);
        vec3 D2 = vec3(1.0, 0.8, 0.4);

        vec3 c0 = mix(L0, D0, uDarkness);
        vec3 c1 = mix(L1, D1, uDarkness);
        vec3 c2 = mix(L2, D2, uDarkness);

        vec3 col = mix(c0, c1, smoothstep(0.0, 0.4, h));
             col = mix(col, c2, smoothstep(0.4, 0.9, h));

        float eu = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
        float ev = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        
        float alpha = eu * ev * pow(h, 1.3) * (1.2 + uPlunge * 0.8);
        
        // Adjust alpha for additive feel in dark mode
        float brightness = mix(1.0, 2.5, uDarkness);
        gl_FragColor = vec4(col * brightness, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;

    // Finale Burst: Hyper-luminate as we hit the Thank You section
    const finaleBurst = Math.max(0, Math.min(1, (scroll - 0.94) * 20));

    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uPlunge.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uPlunge.value, (scroll / 0.4) + (finaleBurst * 5.0), 0.1
    );
    matRef.current.uniforms.uDarkness.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uDarkness.value, Math.max(uDarkness, finaleBurst), 0.1
    );
    
    // Toggle blending based on darkness
    matRef.current.blending = uDarkness > 0.5 ? THREE.AdditiveBlending : THREE.NormalBlending;
    
    // Whiten at the very end
    if (finaleBurst > 0.1) {
        matRef.current.uniforms.uDarkness.value = THREE.MathUtils.lerp(matRef.current.uniforms.uDarkness.value, 1.2, 0.1);
    }
  });

  if (!active) return null;

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[35, 6, 150, 60]} />
      <shaderMaterial
        ref={matRef}
        {...shader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── 2. INK/VOXEL FIELD ───────────────────────────────────────────────────
function VoxelField({ scroll }: { scroll: number }) {
  const ref = useRef<THREE.Points>(null);
  const uDarkness = Math.max(0, Math.min(1, (scroll - 0.15) * 8));

  const geo = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 80;
      pos[i3 + 1] = (Math.random() - 0.5) * 60;
      pos[i3 + 2] = -Math.random() * 200 - 5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    const visibility = Math.max(0, (scroll - 0.2) * 5);
    mat.opacity = Math.min(visibility, 0.7);
    
    // Lerp particle color
    const inkColor = new THREE.Color("#001219");
    const emberColor = new THREE.Color("#D96C2C");
    mat.color.lerpColors(inkColor, emberColor, uDarkness);
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.15} color="#001219" transparent opacity={0} sizeAttenuation />
    </points>
  );
}

// ─── 3. CAMERA RIG ──────────────────────────────────────────────────────────
function CameraRig({ scroll }: { scroll: number }) {
  const { camera, scene } = useThree();
  const smoothPos  = useRef(new THREE.Vector3(0, 0, 12));
  const smoothLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // 1. Dynamic Atmosphere Lerp
    const uDarkness = Math.max(0, Math.min(1, (scroll - 0.15) * 8));
    const bgColor = new THREE.Color("#ffffff").lerp(new THREE.Color("#000000"), uDarkness);
    scene.background = bgColor;
    if (scene.fog) {
       (scene.fog as THREE.Fog).color.copy(bgColor);
    }

    // 2. Camera movement
    const t = scroll;
    const s = Math.pow(t, 1.2);
    const px = Math.sin(t * Math.PI) * 1.5;
    const py = -t * 8;
    const pz = 12 - s * 250;
    
    const lx = 0;
    const ly = py - 4;
    const lz = pz - 30;

    smoothPos.current.lerp(new THREE.Vector3(px, py, pz), 0.1);
    smoothLook.current.lerp(new THREE.Vector3(lx, ly, lz), 0.1);
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLook.current);
  });

  return null;
}

export default function WovenBackground() {
  const [scroll, setScroll] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 65 }} dpr={[1, 2]}>
        <FireRibbon active={true} scroll={scroll} />
        <VoxelField scroll={scroll} />
        <CameraRig scroll={scroll} />
        <fog attach="fog" args={["#ffffff", 30, 200]} />
      </Canvas>
    </div>
  );
}
