"use client";

import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type MutableRefObject } from "react";
import { pathPoint } from "./terrain";

/** Career checkpoint along the climb. `t` is path-progress 0..1. */
export interface Checkpoint {
  id: string;
  label: string;
  title: string;
  org: string;
  period: string;
  note: string;
  t: number;
  color: string;
  icon: string;
  current?: boolean;
  future?: boolean;
}

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "manipal",
    label: "Base Camp · 0m",
    title: "B.E. Mechanical Engineering",
    org: "Manipal Institute of Technology",
    period: "2016 – 2019",
    note: "Where it all began.",
    t: 0.03,
    color: "#f59e0b",
    icon: "🎓",
  },
  {
    id: "vats",
    label: "Camp I · 2,500m",
    title: "Production Supervisor",
    org: "Vats & Vessels Ltd, Mumbai",
    period: "2020 – 2022",
    note: "30+ team. ASME VIII pressure-vessel fabrication.",
    t: 0.22,
    color: "#f87171",
    icon: "🏭",
  },
  {
    id: "asu",
    label: "Camp II · 4,800m",
    title: "M.S. Information Technology",
    org: "Arizona State University",
    period: "2022 – 2024",
    note: "New continent. New stack.",
    t: 0.44,
    color: "#60a5fa",
    icon: "🎓",
  },
  {
    id: "united",
    label: "Camp III · 6,200m",
    title: "Manufacturing Engineer",
    org: "United Foods, Phoenix",
    period: "Jul – Oct 2023",
    note: "Lean manufacturing, line balancing.",
    t: 0.62,
    color: "#4ade80",
    icon: "🌾",
  },
  {
    id: "heckler",
    label: "Camp IV · 7,500m — YOU ARE HERE",
    title: "ERP Systems Engineer II",
    org: "Heckler Design Inc",
    period: "Oct 2023 – Present",
    note: "Sole ERP owner. 8+ departments. AI × ERP.",
    t: 0.8,
    color: "#38bdf8",
    icon: "🏔️",
    current: true,
  },
  {
    id: "summit",
    label: "Summit · 8,849m",
    title: "The Next Peak",
    org: "What's next?",
    period: "???",
    note: "The climb continues…",
    t: 0.97,
    color: "#c084fc",
    icon: "⛰️",
    future: true,
  },
];

interface CheckpointsProps {
  scrollRef: MutableRefObject<number>;
}

/**
 * Renders each checkpoint as an HTML card anchored at its world-space point
 * on the climbing path. Card fades in once scroll progress reaches its `t`,
 * fades out as the camera moves past.
 */
export function Checkpoints({ scrollRef }: CheckpointsProps) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const lastUpdate = useRef(0);

  useFrame(({ clock }) => {
    // Throttle React state updates to ~12fps — checkpoint visibility doesn't
    // need every frame.
    if (clock.elapsedTime - lastUpdate.current < 0.08) return;
    lastUpdate.current = clock.elapsedTime;

    const t = scrollRef.current;
    const next = new Set<string>();
    for (const cp of CHECKPOINTS) {
      // Show card while camera is within ±0.18 of the checkpoint's path position
      if (t >= cp.t - 0.04 && t <= cp.t + 0.18) {
        next.add(cp.id);
      }
    }
    setVisible((prev) => {
      if (prev.size === next.size && [...prev].every((id) => next.has(id))) {
        return prev;
      }
      return next;
    });
  });

  return (
    <>
      {CHECKPOINTS.map((cp) => {
        const p = pathPoint(cp.t);
        // Offset card a little above + to the side of the actual path point
        const isVisible = visible.has(cp.id);
        return (
          <group key={cp.id} position={[p.x, p.y + 4, p.z]}>
            {/* Anchor dot */}
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial
                color={cp.color}
                emissive={cp.color}
                emissiveIntensity={cp.current ? 0.8 : 0.4}
                roughness={0.3}
              />
            </mesh>
            <Html
              center
              distanceFactor={50}
              position={[0, 6, 0]}
              style={{ pointerEvents: "none" }}
              zIndexRange={[100, 0]}
            >
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                    className="rounded-2xl border backdrop-blur-xl px-3.5 py-3"
                    style={{
                      width: 210,
                      borderColor: cp.color + "55",
                      background: cp.current
                        ? "rgba(14, 187, 255, 0.12)"
                        : "rgba(2, 6, 16, 0.78)",
                      boxShadow: cp.current
                        ? `0 0 36px rgba(14, 187, 255, 0.25), 0 8px 40px rgba(0, 0, 0, 0.55)`
                        : `0 8px 40px rgba(0, 0, 0, 0.55)`,
                    }}
                  >
                    <div
                      className="text-[9px] font-mono uppercase tracking-widest mb-2 leading-snug"
                      style={{ color: cp.color }}
                    >
                      {cp.label}
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-[18px] leading-none mt-0.5">{cp.icon}</span>
                      <div>
                        <div className="text-[12px] font-bold text-white leading-snug">
                          {cp.title}
                        </div>
                        <div className="text-[10px] text-white/40 mt-0.5">{cp.org}</div>
                        <div className="text-[10px] text-white/35">{cp.period}</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/55 mt-2 leading-relaxed">{cp.note}</p>
                    {cp.current && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-[9px] font-mono text-sky-400">ACTIVE</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Html>
          </group>
        );
      })}
    </>
  );
}
