"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoSectionProps {
  src: string;
  caption?: string;
  subcaption?: string;
  height?: string;
  overlay?: "dark" | "gradient";
}

export function VideoSection({
  src,
  caption,
  subcaption,
  height = "80vh",
  overlay = "dark",
}: VideoSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const captionY = useTransform(scrollYProgress, [0.2, 0.5], [60, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  useEffect(() => {
    if (reduced) videoRef.current?.pause();
    else void videoRef.current?.play().catch(() => {});
  }, [reduced]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height }}>
      {/* Video */}
      <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : scale }}>
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </motion.div>

      {/* Overlay */}
      {overlay === "dark" && <div className="absolute inset-0 bg-black/50" />}
      {overlay === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
      )}

      {/* Edge fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" style={{ opacity: 0.5 }} />

      {/* Caption */}
      {caption && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center z-10 px-6"
            style={{ y: reduced ? 0 : captionY, opacity: reduced ? 1 : captionOpacity }}
          >
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-tight">
              {caption}
            </h3>
            {subcaption && (
              <p className="mt-3 text-sm md:text-base text-white/60 font-mono tracking-wider uppercase">
                {subcaption}
              </p>
            )}
          </motion.div>
        </div>
      )}
      <Button
        variant="outline"
        className="absolute bottom-5 right-5 z-10 min-h-11 border-white/30 bg-black/60 px-4 text-white hover:bg-black/80 hover:text-white"
        onClick={() => {
          if (playing) videoRef.current?.pause();
          else void videoRef.current?.play().catch(() => {});
        }}
        aria-label={playing ? "Pause travel video" : "Play travel video"}
      >
        {playing ? <Pause /> : <Play />}{playing ? "Pause" : "Play"}
      </Button>
    </div>
  );
}
