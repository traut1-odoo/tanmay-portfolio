"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { fbm, ridge } from "./noise";

/**
 * Procedural mountain terrain.
 *
 * Built from a plane geometry whose vertex z-coords are displaced by a
 * combination of:
 *   1. Radial peak — a tall central spire that tapers to flat ground at the
 *      edges (exponential falloff). This is what makes a "mountain" rather
 *      than "rolling hills".
 *   2. Ridge noise — sharp creases and ridges across the surface for that
 *      glaciated Himalayan look.
 *   3. Fine fbm — small surface detail (boulders, scree).
 *
 * Vertex colors are assigned by elevation + slope:
 *   - snow      (white)        — peaks above 70% max height
 *   - exposed rock (mid gray)  — steep faces between snow and treeline
 *   - alpine forest (deep green-gray) — treeline band
 *   - lowland (warm brown)     — flat base
 */

const SIZE = 400; // world-units across
const SEGMENTS = 256; // vertex resolution per side
const PEAK_HEIGHT = 90; // world-units of summit
const PEAK_SIGMA = 60; // radius of the central peak falloff

function elevation(x: number, y: number): number {
  const r = Math.sqrt(x * x + y * y);
  const radial = PEAK_HEIGHT * Math.exp(-(r * r) / (2 * PEAK_SIGMA * PEAK_SIGMA));
  const r1 = ridge(x * 0.018, y * 0.018, 5) * 18;
  const r2 = fbm(x * 0.04, y * 0.04, 4) * 6;
  // Detail tapers off in the far distance (avoid noisy horizon)
  const distanceFade = Math.max(0, 1 - r / 220);
  return radial + (r1 + r2) * distanceFade;
}

interface TerrainProps {
  /** Color of the snow caps */
  snowColor?: string;
  /** Color of exposed rock face */
  rockColor?: string;
  /** Color of alpine treeline band */
  treelineColor?: string;
  /** Color of the lowland base */
  baseColor?: string;
}

export function Terrain({
  snowColor = "#f8fafc",
  rockColor = "#5a5d68",
  treelineColor = "#3a4a3a",
  baseColor = "#5c4a3a",
}: TerrainProps) {
  const geom = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geometry.rotateX(-Math.PI / 2); // make horizontal (y = up)

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const colorArr = new Float32Array(pos.count * 3);
    const colorAttr = new THREE.BufferAttribute(colorArr, 3);

    const cSnow = new THREE.Color(snowColor);
    const cRock = new THREE.Color(rockColor);
    const cTree = new THREE.Color(treelineColor);
    const cBase = new THREE.Color(baseColor);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = elevation(x, z);
      pos.setY(i, h);

      // Normalize height for color mixing
      const t = THREE.MathUtils.clamp(h / PEAK_HEIGHT, 0, 1);
      let c: THREE.Color;
      if (t > 0.55) {
        // snow band
        const k = THREE.MathUtils.clamp((t - 0.55) / 0.25, 0, 1);
        c = cRock.clone().lerp(cSnow, k);
      } else if (t > 0.22) {
        // rock band
        const k = (t - 0.22) / 0.33;
        c = cTree.clone().lerp(cRock, k);
      } else {
        // base / treeline blend
        const k = t / 0.22;
        c = cBase.clone().lerp(cTree, k);
      }
      colorAttr.setXYZ(i, c.r, c.g, c.b);
    }

    geometry.setAttribute("color", colorAttr);
    geometry.computeVertexNormals();
    return geometry;
  }, [snowColor, rockColor, treelineColor, baseColor]);

  return (
    <mesh geometry={geom} receiveShadow castShadow={false}>
      <meshStandardMaterial
        vertexColors
        roughness={0.92}
        metalness={0.02}
        flatShading={false}
      />
    </mesh>
  );
}

/**
 * Returns the world-space (x, y, z) of a point at distance `r` along
 * the climbing path from base→peak. Path spirals up the south face.
 */
export function pathPoint(t: number): THREE.Vector3 {
  // t goes 0..1. Spiral inward + up.
  const r = (1 - t) * 110 + 8;
  const theta = t * Math.PI * 1.6 + Math.PI; // start at south side
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;
  const y = elevation(x, z) + 1.2; // hover slightly above terrain
  return new THREE.Vector3(x, y, z);
}

export { SIZE as TERRAIN_SIZE, PEAK_HEIGHT };
