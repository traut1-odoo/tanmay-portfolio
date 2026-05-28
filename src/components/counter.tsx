"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export function Counter({ target, suffix = "", prefix = "", label, duration = 2 }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf2: number;
    const run = () => {
      let startTime: number | undefined;
      const tick = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) raf2 = requestAnimationFrame(tick);
      };
      raf2 = requestAnimationFrame(tick);
    };

    const start = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inViewport = r.top < window.innerHeight && r.bottom > 0;
      if (inViewport) {
        run();
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io.disconnect();
              run();
            }
          },
          { threshold: 0.1 },
        );
        io.observe(el);
      }
    });
    return () => {
      cancelAnimationFrame(start);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [target, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-text-secondary uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}
