"use client";

/**
 * Journey to the Summit — Studio Ghibli scroll-parallax.
 *
 * Pinned 100vh viewport scroll-driven across a 500vh container. Inside:
 *   1. Four AI-generated hand-painted seasonal mountain backgrounds (Spring,
 *      Summer, Autumn, Winter). They crossfade as scroll progresses.
 *   2. SVG climbing path (matched to mountain art) drawn brighter behind the
 *      character to show progress.
 *   3. Animated hiker character that walks up the path as you scroll.
 *   4. HTML checkpoint cards anchored to path % positions, pop in as character
 *      passes.
 *   5. HUD overlay — title, year ticker (2016 → 2026), season label.
 */

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  CHECKPOINTS,
  PATH_D,
  pathPointAt,
  progressToYear,
  progressToSeason,
  type Season,
} from "@/data/journey-checkpoints";

// Sprite sheet: 6 frames horizontal, each 236x400, total 1416x400.
// Rendered at scaled size, frames cycle via CSS steps().
const SPRITE_FRAMES = 6;
const SPRITE_WIDTH = 60; // displayed frame width in px
const SPRITE_HEIGHT = 102; // displayed frame height in px (preserves 236:400 aspect)

const BASE_PATH = "/tanmay-portfolio/images/journey";

const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];
const SEASON_LABELS: Record<Season, string> = {
  spring: "🌸 Spring",
  summer: "☀️ Summer",
  autumn: "🍂 Autumn",
  winter: "❄️ Winter",
};

/**
 * Returns crossfade opacities (0..1) for each season layer given path progress.
 * Spring: dominant 0.00-0.25, fading 0.25-0.40
 * Summer: dominant 0.30-0.50, fading 0.20-0.30 + 0.50-0.65
 * Autumn: dominant 0.55-0.75, fading 0.45-0.55 + 0.75-0.85
 * Winter: dominant 0.80-1.00, fading 0.65-0.80
 */
function seasonOpacity(season: Season, p: number): number {
  // Trapezoidal fade profile per season
  const profile: Record<Season, [number, number, number, number]> = {
    spring: [0.0, 0.0, 0.22, 0.4],
    summer: [0.2, 0.32, 0.5, 0.62],
    autumn: [0.5, 0.6, 0.78, 0.85],
    winter: [0.78, 0.88, 1.0, 1.0],
  };
  const [a, b, c, d] = profile[season];
  if (p < a || p > d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p < c) return 1;
  return (d - p) / (d - c);
}

export function MountainJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  // Sprite frame advances with distance traveled along path — locks walk
  // cycle to scroll, not wall clock.
  const [spriteFrame, setSpriteFrame] = useState(0);
  // Stationary detector — freezes sprite on idle frame when scroll velocity
  // drops to ~0 (user stopped scrolling).
  const [isMoving, setIsMoving] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

  // Tight lerp + distance-driven frame stepping in single RAF.
  // Pure scroll-driven — no wall-clock animation.
  useEffect(() => {
    let raf = 0;
    let smoothed = scrollYProgress.get();
    let lastPathPt = pathPointAt(smoothed);
    let distAccum = 0;
    let stillCounter = 0;
    const FRAME_DIST = 22; // path-px per sprite frame step

    setProgress(smoothed);

    const tick = () => {
      const target = scrollYProgress.get();
      const delta = target - smoothed;
      // Tight follow — 0.35 factor (was 0.12, too laggy)
      smoothed += delta * 0.35;
      setProgress(smoothed);

      // Distance traveled along path since last tick
      const cur = pathPointAt(smoothed);
      const dx = cur.x - lastPathPt.x;
      const dy = cur.y - lastPathPt.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      distAccum += d;
      lastPathPt = cur;

      // Step sprite frame when enough distance accumulated
      if (distAccum >= FRAME_DIST) {
        const steps = Math.floor(distAccum / FRAME_DIST);
        distAccum -= steps * FRAME_DIST;
        setSpriteFrame((f) => (f + steps) % SPRITE_FRAMES);
        stillCounter = 0;
        setIsMoving(true);
      } else if (Math.abs(delta) < 0.0002) {
        // Scroll essentially stopped — count frames
        stillCounter++;
        if (stillCounter > 8) setIsMoving(false);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  const year = Math.round(progressToYear(progress));
  const currentSeason = progressToSeason(progress);

  // Step-by-step character movement — piecewise ease-in-out through checkpoint t values.
  // Effect: character lingers near each checkpoint (low velocity at ends of each segment)
  // and walks briskly between them.
  const sortedT = [0, ...CHECKPOINTS.map((c) => c.t), 1];
  let charT = progress;
  for (let i = 0; i < sortedT.length - 1; i++) {
    const a = sortedT[i];
    const b = sortedT[i + 1];
    if (progress >= a && progress <= b) {
      const localP = (progress - a) / (b - a);
      const eased =
        localP < 0.5
          ? 2 * localP * localP
          : 1 - Math.pow(-2 * localP + 2, 2) / 2;
      charT = a + eased * (b - a);
      break;
    }
  }

  const pathPt = pathPointAt(charT);
  // Convert to viewport % for absolute positioning over the image layer
  const charX = (pathPt.x / 1920) * 100;
  const charY = (pathPt.y / 1080) * 100;

  // Pause sprite walk when at checkpoint OR scroll halted
  const nearCheckpoint = CHECKPOINTS.some((cp) => Math.abs(charT - cp.t) < 0.018);
  const idle = nearCheckpoint || !isMoving;
  // Idle pose = frame 0 (standing). Walking = current frame index.
  const displayFrame = idle ? 0 : spriteFrame;

  // Path stroke progress (% drawn behind character)
  const pathProgress = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div
        className="sticky top-0 overflow-hidden bg-slate-900"
        style={{ height: "100vh" }}
      >
        {/* ═══ LAYER 1: Season backgrounds (crossfade) ═══ */}
        <div className="absolute inset-0">
          {SEASONS.map((s) => (
            <div
              key={s}
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: seasonOpacity(s, progress) }}
            >
              <Image
                src={`${BASE_PATH}/${s}.jpg`}
                alt={`${s} mountain landscape`}
                fill
                priority={s === "spring"}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* ═══ LAYER 2: SVG path overlay ═══ */}
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          {/* Ghost path — full route, faint */}
          <path
            d={PATH_D}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="6 10"
          />
          {/* Climbed portion — bright, animated */}
          <path
            d={PATH_D}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${pathProgress} 100`}
            style={{
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
            }}
          />
        </svg>

        {/* ═══ LAYER 3: Watercolor sprite-sheet hiker — scroll-locked frame stepping ═══ */}
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${charX}%`,
            top: `${charY}%`,
            transform: "translate(-50%, -90%)",
            width: SPRITE_WIDTH,
            height: SPRITE_HEIGHT,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))",
          }}
        >
          <div
            style={{
              width: SPRITE_WIDTH,
              height: SPRITE_HEIGHT,
              backgroundImage: `url(/tanmay-portfolio/images/journey/hiker-sprite.png)`,
              backgroundSize: `${SPRITE_WIDTH * SPRITE_FRAMES}px ${SPRITE_HEIGHT}px`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${-displayFrame * SPRITE_WIDTH}px 0px`,
              imageRendering: "auto",
            }}
          />
        </div>

        {/* ═══ LAYER 4: Checkpoint anchor dots in world-space ═══ */}
        <div className="absolute inset-0 pointer-events-none">
          {CHECKPOINTS.map((cp) => {
            const cpPt = pathPointAt(cp.t);
            const cpX = (cpPt.x / 1920) * 100;
            const cpY = (cpPt.y / 1080) * 100;
            const visible = progress >= cp.t - 0.03;
            const passed = progress > cp.t + 0.08;
            const isActive = visible && !passed;

            return (
              <div
                key={cp.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
                style={{
                  left: `${cpX}%`,
                  top: `${cpY}%`,
                  width: isActive ? 18 : 12,
                  height: isActive ? 18 : 12,
                  borderRadius: "50%",
                  background: visible ? cp.color : "rgba(255,255,255,0.25)",
                  border: `2px solid ${cp.color}`,
                  boxShadow: isActive
                    ? `0 0 18px ${cp.color}, 0 0 32px ${cp.color}80`
                    : visible
                      ? `0 0 8px ${cp.color}80`
                      : "none",
                  opacity: passed ? 0.5 : 1,
                }}
              />
            );
          })}
        </div>

        {/* ═══ LAYER 5: ACTIVE checkpoint card — single, bottom-left, swaps as scroll progresses ═══ */}
        <div className="absolute bottom-6 left-6 md:left-8 z-30 pointer-events-none max-w-[280px]">
          <AnimatePresence mode="wait">
            {(() => {
              // Find the most recent unpassed checkpoint
              const active = [...CHECKPOINTS]
                .reverse()
                .find((cp) => progress >= cp.t - 0.03);
              if (!active) return null;
              return (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  className="rounded-2xl border backdrop-blur-md px-4 py-3.5"
                  style={{
                    borderColor: `${active.color}66`,
                    background: active.current
                      ? `linear-gradient(135deg, ${active.color}26, rgba(2,6,16,0.85))`
                      : "rgba(2,6,16,0.85)",
                    boxShadow: active.current
                      ? `0 0 36px ${active.color}55, 0 12px 44px rgba(0,0,0,0.65)`
                      : "0 12px 44px rgba(0,0,0,0.65)",
                  }}
                >
                  <div
                    className="text-[10px] font-mono uppercase tracking-widest mb-2 leading-snug"
                    style={{ color: active.color }}
                  >
                    {active.label} · {active.year}
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-[22px] leading-none mt-0.5">{active.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white leading-snug">{active.title}</div>
                      <div className="text-[11px] text-white/65 mt-0.5">{active.org}</div>
                      <div className="text-[10px] text-white/45 mt-0.5">{active.period}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/80 mt-2.5 leading-relaxed">{active.note}</p>
                  {active.current && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      <span className="text-[9px] font-mono text-sky-400 uppercase tracking-widest">
                        Active role
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* ═══ LAYER 6: Summit marker — only visible when nearly there ═══ */}
        <AnimatePresence>
          {progress > 0.88 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.95, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute pointer-events-none z-20"
              style={{
                left: `${(1080 / 1920) * 100}%`,
                top: `${(250 / 1080) * 100}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                  ⛰ Summit
                </div>
                <div className="text-[11px] text-white/70 italic" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                  yet to climb…
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ HUD overlay ═══ */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Heading */}
          <div className="absolute top-8 left-0 right-0 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase mb-2 text-white/80" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
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
              {progress < 0.04 && (
                <motion.div
                  className="mt-4"
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-white/75 text-sm tracking-wide" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    scroll to climb
                  </p>
                  <div className="flex justify-center mt-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10l6 6 6-6"
                        stroke="rgba(255,255,255,0.7)"
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

          {/* Year + Season — top right */}
          <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              year
            </span>
            <span
              className="text-2xl md:text-3xl font-bold text-white tabular-nums"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
            >
              {year}
            </span>
            <span
              className="text-[11px] font-mono text-white/85 uppercase tracking-widest mt-2"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
            >
              {SEASON_LABELS[currentSeason]}
            </span>
            <div className="relative w-px h-20 bg-white/25 rounded-full overflow-hidden mt-1">
              <div
                className="absolute bottom-0 left-0 w-full rounded-full"
                style={{
                  height: `${progress * 100}%`,
                  background: "linear-gradient(to top, #38bdf8, #c084fc)",
                  transition: "height 0.18s linear",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
