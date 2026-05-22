"use client";

/**
 * Journey to the Summit — cinematic 3D career climb.
 *
 * Career milestones are placed along a path spiraling up a procedural
 * mountain. The user scrolls a 500vh container; inside the sticky viewport
 * a React Three Fiber scene flies the camera from base camp up to the
 * summit, sky color transitions sunrise → dusk → night, and HTML checkpoint
 * cards anchored in 3D space fade in / out as the camera passes.
 *
 * Entirely procedural — no GLB, no HDR file, no external assets. Built from
 * primitives provided by `three`, `@react-three/fiber`, and `@react-three/drei`,
 * all of which are already in the bundle (proven in hero-scene.tsx and
 * career-journey.tsx).
 *
 * For an HDR upgrade later: download a CC0 HDRI from polyhaven.com (e.g.
 * `spruit_sunrise_4k.hdr`), drop it in `public/hdr/`, and swap the `<Sky>`
 * for `<Environment files="/hdr/spruit_sunrise_4k.hdr" background />` from
 * `@react-three/drei`.
 */

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Stars, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Terrain, PEAK_HEIGHT } from "./journey/terrain";
import { CameraRig } from "./journey/camera-rig";
import { Checkpoints } from "./journey/checkpoints";
import * as THREE from "three";

function Scene({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  return (
    <Suspense fallback={null}>
      {/* Atmospheric sky — Hosek-Wilkie scattering shader from drei */}
      <Sky
        sunPosition={[40, 30, -50]}
        turbidity={6}
        rayleigh={2.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />
      <Stars
        radius={300}
        depth={50}
        count={2000}
        factor={4}
        saturation={0.4}
        fade
        speed={0.4}
      />

      {/* Distance fog for atmospheric perspective */}
      <fog attach="fog" args={["#a3b8c5", 120, 360]} />

      <ambientLight intensity={0.45} color="#cfd8e3" />
      <directionalLight
        position={[40, 30, -50]}
        intensity={1.4}
        color="#fff4e2"
        castShadow={false}
      />
      {/* Cool fill light from the opposite side */}
      <hemisphereLight args={["#8aa3c0", "#3a2f24", 0.6]} />

      <Terrain />

      <Checkpoints scrollRef={scrollRef} />

      {/* Snow sparkles around the summit */}
      <Sparkles
        position={[0, PEAK_HEIGHT * 0.65, 0]}
        count={120}
        scale={[80, 60, 80]}
        size={2}
        speed={0.3}
        color="#ffffff"
        opacity={0.7}
      />

      <CameraRig scrollRef={scrollRef} />
    </Suspense>
  );
}

export function MountainJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [progressDisplay, setProgressDisplay] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  // Throttled state for HUD altitude counter / season text
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = () => {
      const now = performance.now();
      if (now - last > 100) {
        last = now;
        setProgressDisplay(scrollRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const altitudeM = Math.round(progressDisplay * 8849);
  const season =
    progressDisplay < 0.22
      ? "🌿 Spring"
      : progressDisplay < 0.5
        ? "🍂 Autumn"
        : progressDisplay < 0.76
          ? "❄️ Winter"
          : "⛰️ Summit";

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 overflow-hidden bg-black" style={{ height: "100vh" }}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 30, 240], fov: 55, near: 0.5, far: 800 }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#0a1422"));
          }}
        >
          <Scene scrollRef={scrollRef} />
        </Canvas>

        {/* HUD overlay */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Heading */}
          <div className="absolute top-8 left-0 right-0 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase mb-2 text-sky-400">
                The Climb
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.85)" }}
              >
                Journey to the Summit
              </h2>
            </motion.div>
            <AnimatePresence>
              {progressDisplay < 0.04 && (
                <motion.div
                  className="mt-4"
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-white/35 text-sm tracking-wide">scroll to climb</p>
                  <div className="flex justify-center mt-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10l6 6 6-6"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Elevation right panel */}
          <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
              alt.
            </span>
            <span
              className="text-2xl md:text-3xl font-bold text-white tabular-nums"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
            >
              {altitudeM.toLocaleString()}
              <span className="text-sm font-normal text-white/40 ml-1">m</span>
            </span>
            <div className="relative w-px h-20 bg-white/10 rounded-full overflow-hidden mt-1">
              <div
                className="absolute bottom-0 left-0 w-full rounded-full"
                style={{
                  height: `${progressDisplay * 100}%`,
                  background: "linear-gradient(to top, #38bdf8, #c084fc)",
                  transition: "height 0.1s linear",
                }}
              />
            </div>
          </div>

          {/* Season bottom-left */}
          <div className="absolute bottom-6 left-5 md:left-8">
            <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">
              {season}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
