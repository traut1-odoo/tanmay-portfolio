"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

// Floating monitor with "code"
function Monitor() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Monitor body */}
      <RoundedBox args={[2.4, 1.5, 0.08]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.2, 1.3]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#0EBBFF" emissiveIntensity={0.25} />
      </mesh>
      {/* Screen code lines — brighter, emissive */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-0.8 + (i % 3) * 0.2, 0.45 - i * 0.11, 0.06]}>
          <planeGeometry args={[0.3 + Math.random() * 0.5, 0.04]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#0EBBFF" : i % 3 === 1 ? "#a855f7" : "#22c55e"}
            transparent
            opacity={0.55 + Math.random() * 0.4}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Stand */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
      <mesh position={[0, -1.05, 0.1]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Floating geometric shapes — more variety + drama
function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-2.6, 1.4, -1] as [number, number, number], color: "#0EBBFF", speed: 1.5, type: "icosa" },
      { pos: [2.9, 0.9, -0.5] as [number, number, number], color: "#a855f7", speed: 2, type: "torus" },
      { pos: [-1.7, -0.9, 1] as [number, number, number], color: "#ec4899", speed: 1.8, type: "octa" },
      { pos: [2.0, -0.6, 1.5] as [number, number, number], color: "#22c55e", speed: 2.2, type: "icosa" },
      { pos: [0.5, 2.2, -1.5] as [number, number, number], color: "#f59e0b", speed: 1.3, type: "torus" },
      // Added for drama
      { pos: [-3.2, 0.2, 0.5] as [number, number, number], color: "#0EBBFF", speed: 1.7, type: "knot" },
      { pos: [3.0, 1.8, 0.8] as [number, number, number], color: "#a855f7", speed: 1.9, type: "dodeca" },
    ],
    [],
  );

  return (
    <>
      {shapes.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={1.2} floatIntensity={0.9}>
          <mesh position={s.pos} scale={0.28 + i * 0.05}>
            {s.type === "icosa" ? (
              <icosahedronGeometry args={[1, 0]} />
            ) : s.type === "torus" ? (
              <torusGeometry args={[1, 0.4, 8, 16]} />
            ) : s.type === "knot" ? (
              <torusKnotGeometry args={[0.85, 0.28, 64, 8]} />
            ) : s.type === "dodeca" ? (
              <dodecahedronGeometry args={[1, 0]} />
            ) : (
              <octahedronGeometry args={[1, 0]} />
            )}
            <MeshDistortMaterial
              color={s.color}
              wireframe
              distort={0.25}
              speed={1.8}
              transparent
              opacity={0.7}
              emissive={s.color}
              emissiveIntensity={0.35}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Data stream particles — denser, multi-colored, brighter
function DataStream() {
  const ref = useRef<THREE.Points>(null);
  const count = 600;

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#0EBBFF"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#22c55e"),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      vel[i] = 0.004 + Math.random() * 0.012;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, velocities: vel, colors: col };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] -= velocities[i];
      if (posArr[i * 3 + 1] < -3.5) posArr[i * 3 + 1] = 3.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// Glowing grid floor backdrop — adds depth + perspective
function GridFloor() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
      <gridHelper args={[20, 30, "#0EBBFF", "#1a1a3a"]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

// Camera that slowly auto-orbits
function AutoOrbitCamera() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15;
    const radius = 5;
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = 1.5 + Math.sin(t * 0.5) * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-90">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting — brighter point lights */}
          <ambientLight intensity={0.2} />
          <pointLight position={[3, 3, 3]} intensity={0.9} color="#0EBBFF" />
          <pointLight position={[-3, 2, -2]} intensity={0.6} color="#a855f7" />
          <pointLight position={[0, -2, 3]} intensity={0.5} color="#ec4899" />
          <spotLight position={[0, 5, 0]} intensity={0.4} angle={0.5} penumbra={1} color="#ffffff" />

          {/* Scene */}
          <GridFloor />
          <Monitor />
          <FloatingShapes />
          <DataStream />
          <AutoOrbitCamera />

          {/* Postprocessing — Bloom + ChromaticAberration for cinematic neon */}
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.0}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.0008, 0.0008]}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
