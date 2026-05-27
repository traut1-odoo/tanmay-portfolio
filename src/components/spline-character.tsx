"use client";

/**
 * SplineCharacter — 3D character widget for the chatbot button.
 *
 * Uses @splinetool/runtime directly in useEffect (client-only).
 * No React.lazy, no next/dynamic, no Promise leaking into render.
 * Falls back to animated headshot if Spline fails or URL is empty.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ── Config ────────────────────────────────────────────────────────────────────
const SPLINE_SCENE_URL = "https://prod.spline.design/V62uY8ufxBxptyGF/scene.splinecode";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SplineCharacterProps {
  state: "idle" | "talking";
  size?: number;
  compact?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SplineCharacter({ state, size = 56, compact = false }: SplineCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef = useRef<any>(null);
  const declutterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sizeObserverRef = useRef<MutationObserver | null>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);

  // Load Spline runtime on client only
  useEffect(() => {
    if (!SPLINE_SCENE_URL || !canvasRef.current) return;

    let cancelled = false;

    const loadSpline = async () => {
      const timeout = setTimeout(() => {
        if (!cancelled) {
          setSplineFailed(true);
        }
      }, 15_000);

      try {
        const { Application } = await import("@splinetool/runtime");
        if (cancelled || !canvasRef.current) return;

        const app = new Application(canvasRef.current);
        await app.load(SPLINE_SCENE_URL);

        clearTimeout(timeout);
        if (cancelled) return;

        // CRITICAL: Spline keeps forcing the canvas CSS to the scene's 1080²
        // frame, which overflows the page. A MutationObserver instantly pins it
        // back to `size` every time Spline touches the style (no flicker).
        const pinCanvasSize = () => {
          const c = canvasRef.current;
          if (!c) return;
          if (c.style.width !== `${size}px` || c.style.height !== `${size}px`) {
            c.style.width = `${size}px`;
            c.style.height = `${size}px`;
          }
        };
        if (canvasRef.current) {
          sizeObserverRef.current = new MutationObserver(pinCanvasSize);
          sizeObserverRef.current.observe(canvasRef.current, {
            attributes: true,
            attributeFilter: ["style"],
          });
        }

        // Hide pokeballs + decorative base so Pikachu floats free; zoom to frame.
        const hideNames = ["PKB", "Ellipse", "Cylinder", "Torus", "Boolean 2"];
        const declutter = () => {
          try {
            app.setSize(size, size);
            pinCanvasSize();
            hideNames.forEach((n) => {
              const o = app.findObjectByName(n);
              if (o) o.visible = false;
            });
            app.setZoom(0.62);
          } catch {
            // scene objects may differ — ignore
          }
        };
        declutter();
        let ticks = 0;
        declutterRef.current = setInterval(() => {
          declutter();
          if (++ticks > 20) {
            if (declutterRef.current) clearInterval(declutterRef.current);
            declutterRef.current = null;
          }
        }, 500);

        appRef.current = app;
        setSplineLoaded(true);
      } catch (err) {
        clearTimeout(timeout);
        if (!cancelled) {
          console.error("[Spline] error:", err);
          setSplineFailed(true);
        }
      }
    };

    loadSpline();

    return () => {
      cancelled = true;
      if (declutterRef.current) clearInterval(declutterRef.current);
      if (sizeObserverRef.current) sizeObserverRef.current.disconnect();
      if (appRef.current?.dispose) appRef.current.dispose();
    };
  }, []);

  // Talking → poke the scene's mouseHover interaction so Pikachu reacts/animates
  useEffect(() => {
    if (!appRef.current || !splineLoaded || state !== "talking") return;
    const app = appRef.current;
    const poke = () => {
      try {
        app.emitEvent("mouseHover", "hit box");
      } catch {
        // scene objects may differ — ignore
      }
    };
    poke();
    const id = setInterval(poke, 1500);
    return () => clearInterval(id);
  }, [state, splineLoaded]);

  // Spline manages the canvas drawing buffer; CSS size = display size.
  const BUFFER = 512;

  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
      className="flex items-center justify-center"
    >
      {/* Transparent scene (pokeballs + shadow disk hidden) → Pikachu floats free */}
      {SPLINE_SCENE_URL && !splineFailed && (
        <canvas
          ref={canvasRef}
          width={BUFFER}
          height={BUFFER}
          style={{
            width: size,
            height: size,
            opacity: splineLoaded ? 1 : 0,
            transition: "opacity 0.4s ease",
            // let drag/click reach the parent button; parent drives hover react
            pointerEvents: "none",
          }}
        />
      )}

      {/* Loading / fallback state — simple accent pulse, no headshot */}
      <AnimatePresence>
        {!splineLoaded && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: size, height: size }}
            className="absolute inset-0 rounded-full bg-accent/20 flex items-center justify-center"
          >
            <motion.div
              className="rounded-full bg-accent"
              style={{ width: size * 0.35, height: size * 0.35 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Headshot fallback avatar ───────────────────────────────────────────────────
function HeadshotAvatar({
  state,
  size,
  compact,
}: {
  state: "idle" | "talking";
  size: number;
  compact: boolean;
}) {
  const isTalking = state === "talking";

  return (
    <motion.div
      style={{ width: size, height: size }}
      className="relative rounded-full overflow-hidden select-none"
      animate={
        isTalking
          ? { scale: [1, 1.04, 1, 1.03, 1], y: [0, -1, 0, -1, 0] }
          : { scale: [1, 1.015, 1], y: [0, -2, 0] }
      }
      transition={
        isTalking
          ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
          : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full z-10 pointer-events-none"
        animate={
          isTalking
            ? { boxShadow: ["0 0 0 2px rgba(var(--accent-rgb),0.6)", "0 0 0 5px rgba(var(--accent-rgb),0.2)", "0 0 0 2px rgba(var(--accent-rgb),0.6)"] }
            : { boxShadow: ["0 0 0 2px rgba(var(--accent-rgb),0.3)", "0 0 0 3px rgba(var(--accent-rgb),0.1)", "0 0 0 2px rgba(var(--accent-rgb),0.3)"] }
        }
        transition={{ duration: isTalking ? 0.8 : 2.5, repeat: Infinity }}
      />

      <Image
        src="/images/headshot-cutout.png"
        alt="Tanmay"
        fill
        className="object-cover object-top scale-[1.8] translate-y-[12%]"
        sizes={`${size}px`}
        priority={compact}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {isTalking && (
        <motion.div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 z-20"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-white"
              animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.8, 1.4, 0.8] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
