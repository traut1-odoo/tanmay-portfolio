"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pathPoint, PEAK_HEIGHT } from "./terrain";

interface CameraRigProps {
  scrollRef: MutableRefObject<number>;
}

/**
 * Drives the camera up the mountain as the user scrolls.
 *
 * Reads scrollRef.current (0..1) every frame, lerps a smoothed value, and
 * positions the camera along a cubic curve from `start` (far back, low
 * altitude, looking up at the mountain) to `summit` (orbiting the peak
 * looking down).
 *
 * Uses an exponential lerp so camera motion is buttery regardless of frame
 * rate — same pattern as the original 2D version's `smoothRef`.
 */
export function CameraRig({ scrollRef }: CameraRigProps) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const tmpLook = useRef(new THREE.Vector3());
  const tmpPos = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    // Frame-rate independent lerp; ~12% per 16ms
    const target = scrollRef.current;
    const k = 1 - Math.pow(1 - 0.12, (dt * 60) || 1);
    smoothed.current += (target - smoothed.current) * k;
    const t = THREE.MathUtils.clamp(smoothed.current, 0, 1);

    // Two-segment camera arc:
    //   t 0.00 → 0.55  base camp approach: far back, low altitude, mountain centered
    //   t 0.55 → 1.00  ridge climb: follow the climbing path itself, rising fast
    let pos: THREE.Vector3;
    let look: THREE.Vector3;

    if (t < 0.55) {
      const k1 = t / 0.55;
      // Approach: orbit slowly to the south face while drifting closer + higher
      const orbit = -Math.PI / 2 + k1 * 0.4;
      const r = 240 - k1 * 80;
      const yPos = 18 + k1 * 22;
      pos = new THREE.Vector3(Math.cos(orbit) * r, yPos, Math.sin(orbit) * r);
      // Look at the peak (origin, y = PEAK_HEIGHT * 0.85)
      look = new THREE.Vector3(0, PEAK_HEIGHT * 0.55, 0);
    } else {
      const k2 = (t - 0.55) / 0.45;
      // Climb the path itself with offset so we see the trail ahead
      const ahead = Math.min(1, k2 + 0.06);
      const here = pathPoint(k2);
      const there = pathPoint(ahead);
      // Camera floats above + behind the current path point
      const tangent = new THREE.Vector3().subVectors(there, here).normalize();
      const offset = tangent.clone().multiplyScalar(-14);
      offset.y += 8;
      pos = new THREE.Vector3().addVectors(here, offset);
      look = there.clone();
      look.y += 1.5;
    }

    tmpPos.current.copy(pos);
    tmpLook.current.copy(look);
    camera.position.lerp(tmpPos.current, 0.18);
    camera.lookAt(tmpLook.current);
    // Mild FOV breathing toward summit for drama
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = t < 0.55 ? 55 : 55 + (t - 0.55) * 14;
      camera.fov += (targetFov - camera.fov) * 0.06;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
