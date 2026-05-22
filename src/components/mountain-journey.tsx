"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";

// ─── Checkpoint data ──────────────────────────────────────────────────────────
interface Checkpoint {
  id: string;
  label: string;
  title: string;
  org: string;
  period: string;
  note: string;
  t: number;      // 0–1 along path
  side: "left" | "right";
  color: string;
  icon: string;
  current?: boolean;
  future?: boolean;
}

const CPS: Checkpoint[] = [
  { id: "manipal", label: "Base Camp • 0m",              title: "B.Tech Aeronautical Engineering", org: "Manipal Institute of Technology", period: "2016 – 2019", note: "Where it all began.",                           t: 0.03, side: "right", color: "#f59e0b", icon: "🎓" },
  { id: "vats",    label: "Camp I • 2,500m",             title: "Production Supervisor",           org: "Vats & Vessels Ltd, Mumbai",       period: "2020 – 2022", note: "30+ team. ASME VIII fabrication.",             t: 0.25, side: "left",  color: "#f87171", icon: "🏭" },
  { id: "asu",     label: "Camp II • 4,800m",            title: "MS Mechanical Engineering",       org: "Arizona State University",         period: "2022 – 2024", note: "New continent. GPA 3.8.",                     t: 0.46, side: "right", color: "#60a5fa", icon: "🎓" },
  { id: "united",  label: "Camp III • 6,200m",           title: "Manufacturing Engineer",          org: "United Foods, Phoenix",            period: "Jul – Oct 2023", note: "Lean manufacturing, line balancing.",        t: 0.64, side: "left",  color: "#4ade80", icon: "🌾" },
  { id: "heckler", label: "Camp IV • 7,500m — YOU ARE HERE", title: "ERP Systems Engineer II",   org: "Heckler Design Inc",               period: "Oct 2023 – Present", note: "Sole ERP owner. 8+ depts. AI-to-ERP.", t: 0.81, side: "right", color: "#38bdf8", icon: "🏔️", current: true },
  { id: "summit",  label: "Summit • 8,849m",             title: "The Next Peak",                  org: "What's next?",                     period: "???",            note: "The climb continues…",                     t: 0.97, side: "left",  color: "#c084fc", icon: "⛰️", future: true },
];

// ─── Sky palettes ─────────────────────────────────────────────────────────────
interface SkyPalette { top: string; mid: string; bot: string; sunColor: string; }

function getSky(p: number): SkyPalette {
  if (p < 0.18)
    return { top: "#060e1c", mid: "#112240", bot: "#1a6b9a", sunColor: "#ffd97d" };
  if (p < 0.42)
    return { top: "#0a0804", mid: "#2d1408", bot: "#7a3515", sunColor: "#ff9f43" };
  if (p < 0.68)
    return { top: "#020508", mid: "#08142a", bot: "#0f2848", sunColor: "#a8d8ff" };
  return { top: "#010204", mid: "#040810", bot: "#0a0f1e", sunColor: "#8090c0" };
}

function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ra = (pa >> 16) & 0xff, ga = (pa >> 8) & 0xff, ba = pa & 0xff;
  const rb = (pb >> 16) & 0xff, gb = (pb >> 8) & 0xff, bb = pb & 0xff;
  const r = Math.round(ra + (rb - ra) * t);
  const g = Math.round(ga + (gb - ga) * t);
  const bv = Math.round(ba + (bb - ba) * t);
  return `rgb(${r},${g},${bv})`;
}

function blendSky(p: number): SkyPalette {
  const zones = [0, 0.18, 0.42, 0.68, 1.0];
  for (let i = 0; i < zones.length - 1; i++) {
    if (p <= zones[i + 1]) {
      const t = (p - zones[i]) / (zones[i + 1] - zones[i]);
      const a = getSky(zones[i] + 0.001);
      const b = getSky(zones[i + 1] - 0.001);
      return {
        top: lerpColor(a.top, b.top, t),
        mid: lerpColor(a.mid, b.mid, t),
        bot: lerpColor(a.bot, b.bot, t),
        sunColor: lerpColor(a.sunColor, b.sunColor, t),
      };
    }
  }
  return getSky(1);
}

// ─── Pre-seeded stars ─────────────────────────────────────────────────────────
const STARS = Array.from({ length: 180 }, (_, i) => ({
  x: ((i * 137.508) % 100) / 100,
  y: ((i * 89.3) % 60) / 100,
  r: 0.4 + (i % 5) * 0.28,
  twinkleOffset: i * 0.7,
}));

// ─── Mountain path points (canvas coords, normalised 0-1) ─────────────────────
// These are the waypoints for the CLIMBING TRAIL on the mountain face
const PATH_PTS_NORM = [
  { x: 0.50, y: 0.95 }, // base camp
  { x: 0.44, y: 0.82 }, // zigzag 1
  { x: 0.56, y: 0.72 }, // zigzag 2
  { x: 0.42, y: 0.62 }, // zigzag 3
  { x: 0.55, y: 0.52 }, // zigzag 4
  { x: 0.43, y: 0.42 }, // zigzag 5
  { x: 0.53, y: 0.32 }, // zigzag 6
  { x: 0.45, y: 0.22 }, // near summit
  { x: 0.50, y: 0.13 }, // summit
];

function getPathPoint(t: number, w: number, h: number) {
  const pts = PATH_PTS_NORM;
  const scaled = t * (pts.length - 1);
  const i = Math.min(Math.floor(scaled), pts.length - 2);
  const f = scaled - i;
  const a = pts[i], b = pts[i + 1];
  // Smooth step for easing between waypoints
  const fe = f * f * (3 - 2 * f);
  return {
    x: (a.x + (b.x - a.x) * fe) * w,
    y: (a.y + (b.y - a.y) * fe) * h,
  };
}

function getPathAngle(t: number, w: number, h: number) {
  const dt = 0.01;
  const a = getPathPoint(Math.max(0, t - dt), w, h);
  const b = getPathPoint(Math.min(1, t + dt), w, h);
  return Math.atan2(b.y - a.y, b.x - a.x);
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────
function drawMountain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Main mountain
  const grad = ctx.createLinearGradient(w / 2, h * 0.1, w / 2, h);
  grad.addColorStop(0.0, "#e8eaf0");   // snow peak
  grad.addColorStop(0.08, "#c8ccd8");  // upper snow
  grad.addColorStop(0.22, "#8a90a0");  // rock face
  grad.addColorStop(0.45, "#525870");  // mid rock
  grad.addColorStop(0.65, "#363c50");  // dark rock
  grad.addColorStop(0.85, "#22283a");  // base rock
  grad.addColorStop(1.0,  "#141824");  // ground

  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.05, h * 0.80);
  ctx.lineTo(w * 0.12, h * 0.70);
  ctx.lineTo(w * 0.18, h * 0.62);
  ctx.lineTo(w * 0.24, h * 0.54);
  ctx.lineTo(w * 0.30, h * 0.46);
  ctx.lineTo(w * 0.36, h * 0.38);
  ctx.lineTo(w * 0.41, h * 0.30);
  ctx.lineTo(w * 0.45, h * 0.22);
  ctx.lineTo(w * 0.48, h * 0.16);
  ctx.lineTo(w * 0.50, h * 0.12);  // PEAK
  ctx.lineTo(w * 0.52, h * 0.16);
  ctx.lineTo(w * 0.55, h * 0.22);
  ctx.lineTo(w * 0.59, h * 0.30);
  ctx.lineTo(w * 0.64, h * 0.38);
  ctx.lineTo(w * 0.70, h * 0.46);
  ctx.lineTo(w * 0.76, h * 0.54);
  ctx.lineTo(w * 0.82, h * 0.62);
  ctx.lineTo(w * 0.88, h * 0.70);
  ctx.lineTo(w * 0.94, h * 0.80);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawBackMountains(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number) {
  // Far-right mountain
  ctx.save();
  ctx.translate(offset * 0.08, 0);
  ctx.beginPath();
  ctx.moveTo(w * 0.55, h);
  ctx.lineTo(w * 0.68, h * 0.52);
  ctx.lineTo(w * 0.75, h * 0.38);
  ctx.lineTo(w * 0.82, h * 0.52);
  ctx.lineTo(w * 0.95, h * 0.70);
  ctx.lineTo(w * 1.1, h);
  ctx.closePath();
  ctx.fillStyle = "rgba(20, 28, 48, 0.75)";
  ctx.fill();

  // Far-left mountain
  ctx.beginPath();
  ctx.moveTo(-w * 0.1, h);
  ctx.lineTo(w * 0.05, h * 0.60);
  ctx.lineTo(w * 0.13, h * 0.44);
  ctx.lineTo(w * 0.20, h * 0.58);
  ctx.lineTo(w * 0.32, h * 0.72);
  ctx.lineTo(w * 0.45, h);
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 22, 40, 0.65)";
  ctx.fill();
  ctx.restore();
}

function drawSnowCap(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.12, 0, w * 0.5, h * 0.12, w * 0.08);
  grad.addColorStop(0, "rgba(255,255,255,0.98)");
  grad.addColorStop(0.5, "rgba(235,240,250,0.85)");
  grad.addColorStop(1, "rgba(200,210,230,0)");

  ctx.beginPath();
  ctx.moveTo(w * 0.50, h * 0.12);
  ctx.lineTo(w * 0.45, h * 0.22);
  ctx.quadraticCurveTo(w * 0.50, h * 0.20, w * 0.55, h * 0.22);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawTrees(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) {
  if (opacity < 0.01) return;
  ctx.globalAlpha = opacity;
  const treeData = [
    { x: 0.07, baseY: 0.88, scale: 1.0 }, { x: 0.11, baseY: 0.90, scale: 0.8 },
    { x: 0.15, baseY: 0.87, scale: 1.1 }, { x: 0.20, baseY: 0.89, scale: 0.9 },
    { x: 0.80, baseY: 0.88, scale: 1.0 }, { x: 0.84, baseY: 0.91, scale: 0.85 },
    { x: 0.88, baseY: 0.87, scale: 1.15 }, { x: 0.92, baseY: 0.90, scale: 0.9 },
    { x: 0.25, baseY: 0.84, scale: 0.7 }, { x: 0.75, baseY: 0.84, scale: 0.7 },
  ];

  treeData.forEach(({ x, baseY, scale }) => {
    const tx = x * w, ty = baseY * h;
    const s = scale * Math.min(w, h) * 0.055;

    // Trunk
    ctx.fillStyle = "#5c3d1e";
    ctx.fillRect(tx - s * 0.08, ty - s * 0.4, s * 0.16, s * 0.4);

    // Layers
    const greens = ["#2a5a1a", "#346620", "#3d7525"];
    [0, 0.35, 0.65].forEach((offsetY, li) => {
      ctx.fillStyle = greens[li];
      ctx.beginPath();
      const layerScale = 1 - offsetY * 0.35;
      ctx.moveTo(tx, ty - s * (0.9 + offsetY));
      ctx.lineTo(tx - s * 0.52 * layerScale, ty - s * (0.3 + offsetY));
      ctx.lineTo(tx + s * 0.52 * layerScale, ty - s * (0.3 + offsetY));
      ctx.closePath();
      ctx.fill();
    });
  });
  ctx.globalAlpha = 1;
}

function drawTrail(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Ghost trail (full path)
  ctx.beginPath();
  PATH_PTS_NORM.forEach((pt, i) => {
    const x = pt.x * w, y = pt.y * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.setLineDash([5, 9]);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.setLineDash([]);

  // Completed trail — bright, glowing
  if (progress > 0.01) {
    const grad = ctx.createLinearGradient(w * 0.5, h * 0.95, w * 0.5, h * 0.13);
    grad.addColorStop(0, "rgba(14,187,255,0.0)");
    grad.addColorStop(0.4, "rgba(14,187,255,0.5)");
    grad.addColorStop(1, "rgba(192,132,252,0.7)");

    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(14,187,255,0.6)";
    ctx.beginPath();
    const segs = Math.ceil(progress * (PATH_PTS_NORM.length - 1));
    PATH_PTS_NORM.slice(0, segs + 1).forEach((pt, i) => {
      const x = pt.x * w, y = pt.y * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    // Last segment partial
    if (segs < PATH_PTS_NORM.length - 1) {
      const cur = getPathPoint(progress, w, h);
      ctx.lineTo(cur.x, cur.y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawCheckpointDots(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  CPS.forEach((cp) => {
    const pos = getPathPoint(cp.t, w, h);
    const reached = progress >= cp.t - 0.01;
    const radius = reached ? (cp.current ? 8 : 5.5) : 3.5;

    if (reached && cp.current) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = cp.color;
    }
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = reached ? cp.color : "rgba(255,255,255,0.2)";
    ctx.fill();
    ctx.shadowBlur = 0;

    if (reached) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  });
}

function drawClimber(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, progress: number) {
  const s = Math.max(14, Math.min(20, Math.min(ctx.canvas.width, ctx.canvas.height) * 0.024));
  const nearSummit = progress > 0.85;
  const accentColor = nearSummit ? "#a855f7" : "#0EBBFF";
  const bodyColor = nearSummit ? "#7c3aed" : "#1d4ed8";

  ctx.save();
  ctx.translate(x, y);
  // Tilt slightly based on slope, keep mostly upright
  const tilt = Math.max(-0.3, Math.min(0.3, (angle + Math.PI / 2) * 0.25));
  ctx.rotate(tilt);

  // Glow aura
  const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.2);
  aura.addColorStop(0, `${accentColor}40`);
  aura.addColorStop(1, "transparent");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, s * 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 14;
  ctx.shadowColor = accentColor;

  // Backpack
  ctx.fillStyle = nearSummit ? "#581c87" : "#92400e";
  ctx.beginPath();
  ctx.roundRect(s * 0.15, -s * 1.1, s * 0.45, s * 0.75, 2);
  ctx.fill();

  // Body
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = s * 0.28;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -s * 1.1);
  ctx.lineTo(0, -s * 0.35);
  ctx.stroke();

  // Head
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(0, -s * 1.5, s * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Helmet
  ctx.fillStyle = nearSummit ? "#7c3aed" : "#b91c1c";
  ctx.beginPath();
  ctx.arc(0, -s * 1.5, s * 0.42, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-s * 0.42, -s * 1.5, s * 0.84, s * 0.12);

  // Goggles
  ctx.fillStyle = nearSummit ? "#3b0764" : "#1e3a8a";
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.roundRect(-s * 0.38, -s * 1.62, s * 0.3, s * 0.17, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(s * 0.08, -s * 1.62, s * 0.3, s * 0.17, 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Left arm — raised, ice axe
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = s * 0.22;
  ctx.beginPath();
  ctx.moveTo(-s * 0.08, -s * 1.0);
  ctx.lineTo(-s * 0.7, -s * 1.5);
  ctx.stroke();

  // Ice axe
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = s * 0.12;
  ctx.beginPath();
  ctx.moveTo(-s * 0.7, -s * 1.5);
  ctx.lineTo(-s * 0.7, -s * 2.1);
  ctx.stroke();
  ctx.lineWidth = s * 0.18;
  ctx.beginPath();
  ctx.moveTo(-s * 1.0, -s * 2.1);
  ctx.lineTo(-s * 0.35, -s * 2.0);
  ctx.stroke();
  ctx.lineWidth = s * 0.12;
  ctx.beginPath();
  ctx.moveTo(-s * 0.35, -s * 2.0);
  ctx.lineTo(-s * 0.28, -s * 2.28);
  ctx.stroke();

  // Right arm — pole
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = s * 0.22;
  ctx.beginPath();
  ctx.moveTo(s * 0.08, -s * 1.0);
  ctx.lineTo(s * 0.65, -s * 0.7);
  ctx.stroke();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = s * 0.1;
  ctx.beginPath();
  ctx.moveTo(s * 0.65, -s * 0.7);
  ctx.lineTo(s * 0.8, -s * 0.1);
  ctx.stroke();

  // Legs (animated walk cycle based on time)
  const walk = Math.sin(Date.now() / 200) * 0.28;
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = s * 0.26;
  ctx.beginPath();
  ctx.moveTo(-s * 0.06, -s * 0.35);
  ctx.lineTo(-s * 0.3 + walk * s, s * 0.0);
  ctx.lineTo(-s * 0.22 + walk * s * 0.6, s * 0.32);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(s * 0.06, -s * 0.35);
  ctx.lineTo(s * 0.3 - walk * s, s * 0.0);
  ctx.lineTo(s * 0.22 - walk * s * 0.6, s * 0.32);
  ctx.stroke();

  // Boots
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.ellipse(-s * 0.2 + walk * s * 0.6, s * 0.38, s * 0.28, s * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(s * 0.2 - walk * s * 0.6, s * 0.38, s * 0.28, s * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number, time: number) {
  if (opacity < 0.02) return;
  ctx.globalAlpha = opacity;
  STARS.forEach((s) => {
    const twinkle = 0.5 + 0.5 * Math.sin(time * 0.8 + s.twinkleOffset);
    ctx.globalAlpha = opacity * (0.4 + 0.6 * twinkle);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawSunMoon(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, sky: SkyPalette) {
  // Sun arcs across sky, becomes moon at night
  const sunX = w * (0.15 + progress * 0.7);
  const sunY = h * (0.6 - Math.sin(progress * Math.PI) * 0.52);
  const radius = progress > 0.68 ? 14 : 22;
  const isMoon = progress > 0.68;

  ctx.shadowBlur = isMoon ? 30 : 60;
  ctx.shadowColor = sky.sunColor;
  const grad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, radius);
  grad.addColorStop(0, sky.sunColor);
  grad.addColorStop(0.4, sky.sunColor + "cc");
  grad.addColorStop(1, sky.sunColor + "00");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, radius * 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = sky.sunColor;
  ctx.beginPath();
  ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSnow(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number, time: number) {
  if (intensity < 0.03) return;
  ctx.globalAlpha = intensity * 0.7;
  ctx.fillStyle = "#ddeeff";
  for (let i = 0; i < 80; i++) {
    const seed = i * 137.5;
    const baseX = ((seed * 7.3) % 100) / 100;
    const baseY = ((seed * 13.7 + time * 12) % 100) / 100;
    const drift = Math.sin(time * 0.5 + i) * 0.008;
    const x = ((baseX + drift) % 1) * w;
    const y = baseY * h;
    const r = 0.8 + (i % 4) * 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Atmospheric haze at base
  const haze = ctx.createLinearGradient(0, h * 0.7, 0, h);
  const hazeAlpha = 0.08 + progress * 0.06;
  haze.addColorStop(0, "transparent");
  haze.addColorStop(1, `rgba(120,160,200,${hazeAlpha})`);
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MountainJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const smoothRef = useRef(0);        // lerped progress for buttery motion
  const timeRef = useRef(0);

  // React state only for HTML checkpoint cards (low freq)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set(["manipal"]));
  const [cpScreenPositions, setCpScreenPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const frameCount = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  // Draw loop — defined inside useEffect so self-recursion has stable closure
  // even under React Strict Mode double-mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = 0;
    let cancelled = false;
    let lastDpr = 0;
    let lastCssW = 0;
    let lastCssH = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW === lastCssW && cssH === lastCssH && dpr === lastDpr) return;
      lastDpr = dpr;
      lastCssW = cssW;
      lastCssH = cssH;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (cancelled) return;
      const c = canvasRef.current;
      if (!c) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const ctx = c.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      resize(); // re-apply if viewport / DPR changed

      const w = c.clientWidth;
      const h = c.clientHeight;

      if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const dt = 0.016;
      timeRef.current += dt;

      smoothRef.current += (scrollRef.current - smoothRef.current) * 0.06;
      const p = smoothRef.current;

      // Sky
      const sky = blendSky(p);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0.0, sky.top);
      skyGrad.addColorStop(0.45, sky.mid);
      skyGrad.addColorStop(1.0, sky.bot);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      const starsOpacity = p > 0.6 ? Math.min((p - 0.6) / 0.15, 1) : 0;
      drawStars(ctx, w, h, starsOpacity, timeRef.current);

      // Sun / Moon
      drawSunMoon(ctx, w, h, p, sky);

      // Back mountains (parallax)
      drawBackMountains(ctx, w, h, p * w * 0.12);

      // Main mountain
      drawMountain(ctx, w, h);
      drawSnowCap(ctx, w, h);

      // Fog / haze
      drawFog(ctx, w, h, p);

      // Trees (fade out as we climb)
      const treeOpacity = Math.max(0, 1 - p * 5);
      drawTrees(ctx, w, h, treeOpacity);

      // Trail + climber
      drawTrail(ctx, w, h, p);
      drawCheckpointDots(ctx, w, h, p);

      const climberPos = getPathPoint(p, w, h);
      const climberAngle = getPathAngle(p, w, h);
      drawClimber(ctx, climberPos.x, climberPos.y, climberAngle, p);

      // Snow
      const snowIntensity = p > 0.65 ? Math.min((p - 0.65) / 0.18, 1) : 0;
      drawSnow(ctx, w, h, snowIntensity, timeRef.current);

      // Throttle HTML updates to ~12fps
      frameCount.current++;
      if (frameCount.current % 5 === 0) {
        const ids = new Set<string>();
        const positions: Record<string, { x: number; y: number }> = {};
        CPS.forEach((cp) => {
          if (p >= cp.t - 0.02) ids.add(cp.id);
          const pt = getPathPoint(cp.t, w, h);
          positions[cp.id] = { x: pt.x / w, y: pt.y / h };
        });
        setVisibleIds(ids);
        setCpScreenPositions(positions);
        setCanvasSize({ w, h });
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(draw);
    rafRef.current = rafId;

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const uiProgress = smoothRef.current;

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Canvas — full screen */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Checkpoint cards HTML overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {CPS.map((cp) => {
            const pos = cpScreenPositions[cp.id];
            const visible = visibleIds.has(cp.id);
            if (!pos) return null;
            const isLeft = cp.side === "left";

            return (
              <AnimatePresence key={cp.id}>
                {visible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.82, x: isLeft ? -14 : 14 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.82 }}
                    transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute"
                    style={{
                      top: `${pos.y * 100}%`,
                      left: isLeft ? undefined : `${pos.x * 100}%`,
                      right: isLeft ? `${(1 - pos.x) * 100}%` : undefined,
                      transform: "translateY(-50%)",
                    }}
                  >
                    {/* Connector dot → line */}
                    <div
                      className="absolute top-1/2 -translate-y-px"
                      style={{
                        [isLeft ? "right" : "left"]: "100%",
                        width: 18,
                        height: 1,
                        background: cp.color + "80",
                      }}
                    />

                    <div
                      className="rounded-2xl border backdrop-blur-xl px-3.5 py-3"
                      style={{
                        marginLeft: isLeft ? 0 : 8,
                        marginRight: isLeft ? 8 : 0,
                        width: 195,
                        borderColor: cp.color + "45",
                        background: cp.current
                          ? `rgba(14,187,255,0.10)`
                          : `rgba(2,6,16,0.72)`,
                        boxShadow: cp.current
                          ? `0 0 32px rgba(14,187,255,0.18), 0 8px 40px rgba(0,0,0,0.55)`
                          : `0 8px 40px rgba(0,0,0,0.55)`,
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
                          <div className="text-[12px] font-bold text-white leading-snug">{cp.title}</div>
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* HUD overlays */}
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
              {scrollRef.current < 0.04 && (
                <motion.div
                  className="mt-4"
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-white/35 text-sm tracking-wide">scroll to climb</p>
                  <div className="flex justify-center mt-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10l6 6 6-6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Elevation right panel */}
          <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">alt.</span>
            <span
              className="text-2xl md:text-3xl font-bold text-white tabular-nums"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
            >
              {Math.round(scrollRef.current * 8849).toLocaleString()}
              <span className="text-sm font-normal text-white/40 ml-1">m</span>
            </span>
            <div className="w-px h-20 bg-white/8 rounded-full overflow-hidden mt-1">
              <div
                className="w-full rounded-full"
                style={{
                  height: `${scrollRef.current * 100}%`,
                  background: "linear-gradient(to top, #38bdf8, #c084fc)",
                  transition: "height 0.1s linear",
                  marginTop: "auto",
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </div>
          </div>

          {/* Season bottom-left */}
          <div className="absolute bottom-6 left-5 md:left-8">
            <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">
              {scrollRef.current < 0.22 ? "🌿 Spring" : scrollRef.current < 0.50 ? "🍂 Autumn" : scrollRef.current < 0.76 ? "❄️ Winter" : "⛰️ Summit"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
