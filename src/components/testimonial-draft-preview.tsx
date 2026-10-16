"use client";

import dynamic from "next/dynamic";

// Next replaces NODE_ENV at build time. Production never imports the draft UI.
const DevelopmentPreview =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./testimonial-draft-preview-content"))
    : null;

export function TestimonialDraftPreview() {
  if (!DevelopmentPreview) return null;

  return <DevelopmentPreview />;
}
