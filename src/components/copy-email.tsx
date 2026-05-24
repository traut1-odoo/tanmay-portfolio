"use client";

/**
 * Click-to-copy email — morphs "email" → "Copied!" pill on click.
 * Two presentations:
 *   <CopyEmail variant="icon" /> — icon button (footer)
 *   <CopyEmail variant="pill" /> — full email-pill (contact page)
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { useSound } from "@/hooks/use-sound";

const EMAIL = "tanmay.rautwork@gmail.com";

export function CopyEmail({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "pill";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();

  async function copy() {
    play("click");
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Fallback: mailto
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (variant === "icon") {
    return (
      <button
        onClick={copy}
        aria-label="Copy email"
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-accent transition-colors ${className || ""}`}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
              transition={{ duration: 0.25 }}
              className="absolute"
            >
              <Check className="w-5 h-5 text-emerald-400" />
            </motion.span>
          ) : (
            <motion.span
              key="mail"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className="absolute"
            >
              <Mail className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Copied tooltip */}
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap"
            >
              Copied
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  // Pill variant
  return (
    <button
      onClick={copy}
      className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all overflow-hidden ${className || ""}`}
      style={{
        background: copied ? "rgba(34,197,94,0.10)" : "var(--surface-hover)",
        borderColor: copied ? "rgba(34,197,94,0.5)" : "var(--border)",
        color: copied ? "rgb(110,231,183)" : "var(--foreground)",
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="ok"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="font-mono text-sm tabular-nums">Copied!</span>
          </motion.span>
        ) : (
          <motion.span
            key="email"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-text-secondary" />
            <span className="font-mono text-sm">{EMAIL}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
