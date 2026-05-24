"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileDown, Command } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MagneticCard } from "./scroll-animations";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  const openCmdK = () => {
    // Dispatch synthetic Cmd+K so CommandPalette opens
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true, bubbles: true }),
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true, bubbles: true }),
    );
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <MagneticCard strength={0.25}>
          <Link href="/" className="text-lg font-bold tracking-tight hover:text-accent transition-colors inline-block">
            TR
          </Link>
        </MagneticCard>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 text-sm transition-colors rounded-lg hover:text-accent ${
                pathname === link.href ? "text-accent" : "text-text-secondary"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}

          {/* Cmd+K trigger hint */}
          <button
            onClick={openCmdK}
            className="ml-2 px-2.5 py-1.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-text-secondary border border-border rounded-lg hover:text-accent hover:border-accent transition-colors"
            aria-label="Open command palette"
          >
            <Command className="w-3 h-3" />
            <span className="opacity-70">{isMac ? "⌘" : "Ctrl"}</span>
            <span>K</span>
          </button>

          {/* Resume download */}
          <a
            href="/tanmay-portfolio/resume.pdf"
            download="Tanmay-Raut-Resume.pdf"
            className="ml-1 px-2.5 py-1.5 inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors rounded-lg border border-transparent hover:border-border"
            aria-label="Download resume"
          >
            <FileDown className="w-3.5 h-3.5" />
            CV
          </a>

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-b border-border bg-background"
          >
            <div className="px-6 pb-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-accent bg-accent-glow"
                      : "text-text-secondary hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="/tanmay-portfolio/resume.pdf"
                download="Tanmay-Raut-Resume.pdf"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors inline-flex items-center gap-2 mt-2 border-t border-border pt-3"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
