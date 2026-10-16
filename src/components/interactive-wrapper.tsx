"use client";

import dynamic from "next/dynamic";

const ScrollProgress = dynamic(() => import("./scroll-progress").then(m => ({ default: m.ScrollProgress })), { ssr: false });
const ThemeSelector = dynamic(() => import("./theme-selector").then(m => ({ default: m.ThemeSelector })), { ssr: false });
const AIChatbot = dynamic(() => import("./ai-chatbot").then(m => ({ default: m.AIChatbot })), { ssr: false });
const CommandPalette = dynamic(() => import("./cmd-palette").then(m => ({ default: m.CommandPalette })), { ssr: false });

export function InteractiveEffects() {
  return (
    <>
      <ScrollProgress />
      <ThemeSelector />
      <CommandPalette />
      <AIChatbot />
    </>
  );
}
