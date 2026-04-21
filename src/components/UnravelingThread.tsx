"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function UnravelingThread({ isDark, scroll }: { isDark: boolean, scroll: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // The 'Track' the thread will follow throughout the site
  const curve = useMemo(() => {
    const points = [];
    const height = 50; // Total vertical distance
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        points.push(new THREE.Vector3(
            Math.sin(t * 10) * 2, // Winding x
            -t * height,         // Traveling down y
            Math.cos(t * 12) * 1  // Subtle z depth
        ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Compute the visible segment of the path based on scroll
  const visibleCurve = useMemo(() => {
    // This is a placeholder, in useFrame we will update the geometry
    return curve;
  }, [curve]);

  const uniforms = useMemo(() => ({
    uScroll: { value: 0 },
    uColor: { value: new THREE.Color("#EBE9E5") },
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
        uniforms.uScroll.value = scroll;
        uniforms.uTime.value = state.clock.getElapsedTime();
        
        const targetColor = new THREE.Color(isDark ? "#4F46E5" : "#EBE9E5");
        uniforms.uColor.value.lerp(targetColor, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1, -1]}>
      <tubeGeometry args={[curve, 400, 0.15, 8, false]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
            varying float vUv;
            void main() {
                vUv = uv.x;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `}
        fragmentShader={`
            varying float vUv;
            uniform float uScroll;
            uniform vec3 uColor;
            uniform float uTime;
            void main() {
                // Only show part of the thread based on scroll
                if (vUv > uScroll) discard;
                
                // Subtle shimmer based on time
                float shimmer = sin(vUv * 50.0 - uTime * 2.0) * 0.1 + 0.9;
                gl_FragColor = vec4(uColor * shimmer, 1.0);
            }
        `}
      />
    </mesh>
  );
}
