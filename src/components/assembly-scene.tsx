"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MathUtils, PCFShadowMap, type Group } from "three";
import type { MotionValue } from "framer-motion";

type CostedPartId = "base" | "upright" | "bracket" | "bolts";

type SceneProps = {
  progress: MotionValue<number>;
  explode: number | null;
  rotation: number;
  finish: "graphite" | "silver";
  reduced: boolean;
  focusedParts?: readonly string[];
  onSelectPart?: (partId: CostedPartId) => void;
};

function Assembly({ progress, explode, rotation, finish, reduced, focusedParts, onSelectPart }: SceneProps) {
  const root = useRef<Group>(null);
  const base = useRef<Group>(null);
  const upright = useRef<Group>(null);
  const bracket = useRef<Group>(null);
  const screen = useRef<Group>(null);
  const bolts = useRef<Group>(null);
  const amount = useRef(0);
  const { invalidate } = useThree();
  const metal = finish === "silver" ? "#b8c1c9" : "#343d42";
  const highlightedMetal = finish === "silver" ? "#dce8cd" : "#83a779";

  function partMaterial(partId: CostedPartId, normalColor = metal) {
    const focused = focusedParts?.includes(partId) ?? false;
    return {
      color: focused ? highlightedMetal : normalColor,
      emissive: focused ? "#326444" : "#000000",
      emissiveIntensity: focused ? 0.24 : 0,
    };
  }

  function selectPart(partId: CostedPartId, event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.delta <= 4) onSelectPart?.(partId);
  }

  useEffect(() => progress.on("change", () => invalidate()), [progress, invalidate]);
  useEffect(() => { invalidate(); }, [explode, rotation, finish, reduced, focusedParts, invalidate]);

  useFrame((_, delta) => {
    if (!root.current || !base.current || !upright.current || !bracket.current || !screen.current || !bolts.current) return;
    const p = progress.get();
    const target = explode ?? (reduced ? 0 : MathUtils.clamp((p - 0.12) / 0.58, 0, 1));
    amount.current = reduced ? target : MathUtils.damp(amount.current, target, 9, Math.min(delta, 0.05));
    const e = amount.current;
    const yaw = -0.46 + rotation * Math.PI / 180 + (reduced ? 0 : p * 0.48);
    root.current.rotation.y = reduced ? yaw : MathUtils.damp(root.current.rotation.y, yaw, 9, Math.min(delta, 0.05));
    base.current.position.set(0, -e * 0.28, 0);
    upright.current.position.set(-e * 0.75, e * 0.12, -e * 0.1);
    bracket.current.position.set(e * 1.4, e * 0.55, -e * 0.5);
    screen.current.position.set(-e * 0.55, e * 1.4, e * 0.55);
    bolts.current.position.set(e * 1.4, e * 0.55, e * 1.0);
    if (Math.abs(e - target) > 0.0005 || Math.abs(root.current.rotation.y - yaw) > 0.0005) invalidate();
  });

  return (
    <group ref={root} position={[0, -0.15, 0]} rotation={[0, -0.46, 0]}>
      <group ref={base} onClick={event => selectPart("base", event)}>
        <RoundedBox args={[2.15, 0.11, 1.65]} radius={0.065} smoothness={4} position={[0, -1.11, 0.15]} castShadow receiveShadow>
          <meshStandardMaterial {...partMaterial("base")} roughness={0.3} metalness={0.72} />
        </RoundedBox>
        {[-0.77, 0.77].flatMap(x => [-0.43, 0.72].map(z => <mesh key={`${x}-${z}`} position={[x, -1.185, z]}><cylinderGeometry args={[0.09, 0.09, 0.05, 16]} /><meshStandardMaterial color="#1a2023" roughness={0.8} /></mesh>))}
      </group>
      <group ref={upright} onClick={event => selectPart("upright", event)}>
        <RoundedBox args={[0.53, 1.68, 0.12]} radius={0.04} smoothness={4} position={[0, -0.28, -0.03]} rotation={[-0.27, 0, 0]} castShadow>
          <meshStandardMaterial {...partMaterial("upright")} roughness={0.32} metalness={0.75} />
        </RoundedBox>
        <RoundedBox args={[0.82, 0.1, 0.65]} radius={0.035} smoothness={4} position={[0, -1.01, 0.17]} castShadow>
          <meshStandardMaterial {...partMaterial("upright")} roughness={0.32} metalness={0.75} />
        </RoundedBox>
      </group>
      <group ref={bracket} onClick={event => selectPart("bracket", event)}>
        <RoundedBox args={[1.16, 0.77, 0.12]} radius={0.065} smoothness={4} position={[0, 0.55, -0.26]} rotation={[-0.12, 0, 0]} castShadow>
          <meshStandardMaterial {...partMaterial("bracket")} roughness={0.3} metalness={0.72} />
        </RoundedBox>
      </group>
      {/* The customer-supplied device is neutral and blocks picks through it. */}
      <group ref={screen} onClick={event => event.stopPropagation()}>
        <group position={[0, 0.72, -0.07]} rotation={[-0.12, 0, 0]}>
          <RoundedBox args={[2.42, 1.65, 0.13]} radius={0.09} smoothness={5} castShadow><meshStandardMaterial color="#171d21" metalness={0.55} roughness={0.25} /></RoundedBox>
          <RoundedBox args={[2.25, 1.47, 0.018]} radius={0.055} smoothness={4} position={[0, 0, 0.077]}><meshStandardMaterial color="#b4d5c3" roughness={0.22} metalness={0.1} /></RoundedBox>
          <mesh position={[-0.88, 0.52, 0.091]}><planeGeometry args={[0.23, 0.035]} /><meshBasicMaterial color="#27483b" /></mesh>
          {[-0.36, 0, 0.36].map((y, i) => <group key={y} position={[0, y, 0.095]}>
            <mesh position={[-0.77, 0, 0]}><planeGeometry args={[0.35, 0.26]} /><meshBasicMaterial color={i === 1 ? "#789b82" : "#96b8a3"} /></mesh>
            <mesh position={[0.18, 0.055, 0]}><planeGeometry args={[1.18, 0.025]} /><meshBasicMaterial color="#476a56" /></mesh>
            <mesh position={[-0.05, -0.04, 0]}><planeGeometry args={[0.72, 0.018]} /><meshBasicMaterial color="#698d77" /></mesh>
          </group>)}
        </group>
      </group>
      <group ref={bolts} onClick={event => selectPart("bolts", event)}>
        {[-0.43, 0.43].flatMap(x => [0.31, 0.79].map(y => <group key={`${x}-${y}`} position={[x, y, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow><cylinderGeometry args={[0.045, 0.045, 0.16, 12]} /><meshStandardMaterial {...partMaterial("bolts", "#9aa5aa")} metalness={0.9} roughness={0.3} /></mesh>
          <mesh position={[0, -0.085, 0]}><cylinderGeometry args={[0.075, 0.075, 0.035, 6]} /><meshStandardMaterial {...partMaterial("bolts", "#c0c9cd")} metalness={0.85} roughness={0.25} /></mesh>
        </group>))}
      </group>
    </group>
  );
}

function ContextLossHandler({ onUnavailable }: { onUnavailable: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onUnavailable);
    return () => canvas.removeEventListener("webglcontextlost", onUnavailable);
  }, [gl, onUnavailable]);
  return null;
}

export default function AssemblyScene({ onUnavailable, fallback, ...props }: SceneProps & { onUnavailable: () => void; fallback: ReactNode }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} shadows={{ type: PCFShadowMap }} camera={{ position: [4.8, 3.7, 8.6], fov: 36 }} gl={{ antialias: true, alpha: true }} fallback={fallback}>
      <ContextLossHandler onUnavailable={onUnavailable} />
      <ambientLight intensity={1.4} />
      <hemisphereLight args={["#ffffff", "#a9b9af", 2.2]} />
      <directionalLight position={[3, 7, 5]} intensity={4.5} castShadow shadow-mapSize={[1024, 1024]} shadow-normalBias={0.025} />
      <directionalLight position={[-4, 2, 3]} intensity={2.5} color="#d9ebef" />
      <directionalLight position={[1, 3, -5]} intensity={4} color="#fff2d7" />
      <Assembly {...props} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.65, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.13} /></mesh>
    </Canvas>
  );
}
