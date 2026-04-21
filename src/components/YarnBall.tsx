"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export default function YarnBall({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);

  // Generate many wrapping threads to form the "Ball"
  const threads = useMemo(() => {
    const threadCount = 40;
    const paths = [];
    for (let i = 0; i < threadCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / threadCount);
        const theta = Math.sqrt(threadCount * Math.PI) * phi;
        
        // Create a circular path that wraps around
        const points = [];
        for(let j = 0; j <= 50; j++) {
            const angle = (j / 50) * Math.PI * 2;
            const r = 1 + Math.sin(j * 0.1) * 0.05; // Slightly irregular
            const x = r * Math.sin(phi) * Math.cos(theta + angle);
            const y = r * Math.sin(phi) * Math.sin(theta + angle);
            const z = r * Math.cos(phi);
            points.push(new THREE.Vector3(x, y, z));
        }
        paths.push(new THREE.CatmullRomCurve3(points));
    }
    return paths;
  }, []);

  useEffect(() => {
    if (groupRef.current) {
        // Falling & Bouncing Intro
        gsap.fromTo(groupRef.current.position, 
            { y: 15, z: -5 }, 
            { 
                y: 0, 
                z: -2, 
                duration: 2.5, 
                ease: "bounce.out",
                delay: 0.5 
            }
        );
        
        // Squash and stretch bounce
        gsap.to(groupRef.current.scale, {
            y: 0.8,
            x: 1.1,
            duration: 0.2,
            repeat: 1,
            yoyo: true,
            ease: "power2.inOut",
            delay: 1.5 // Rough timing for the first impact
        });
    }
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
        // Gently rotate the ball
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {threads.map((path, i) => (
        <mesh key={i}>
          <tubeGeometry args={[path, 50, 0.05, 6, true]} />
          <meshPhysicalMaterial 
            color={isDark ? "#4F46E5" : "#EBE9E5"} 
            roughness={0.9} 
            sheen={1}
            sheenColor="#FFFFFF"
          />
        </mesh>
      ))}
      {/* Inner core to hide gaps */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshPhysicalMaterial color={isDark ? "#1E1B4B" : "#F3F4F6"} roughness={1} />
      </mesh>
    </group>
  );
}
