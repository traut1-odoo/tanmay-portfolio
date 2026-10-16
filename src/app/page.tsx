"use client";

import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { EditorialHero } from "@/components/editorial-hero";
import { MountainJourney } from "@/components/mountain-journey";
import { WorkJourney } from "@/components/work-journey";
import { PersonalPlayground } from "@/components/personal-playground";
import { TravelStory } from "@/components/travel-story";
import { TechLogos } from "@/components/tech-logos";
import { TestimonialDraftPreview } from "@/components/testimonial-draft-preview";
import { ProductWorkbench } from "@/components/product-workbench";

export default function Home() {
  return (
    <>
      <div className="-mt-16"><EditorialHero /></div>
      <MountainJourney />
      <WorkJourney />

      <ProductWorkbench />

      <TestimonialDraftPreview />

      <div className="mx-auto max-w-[1440px] px-3 pb-12 md:px-8 md:pb-20"><PersonalPlayground /></div>
      <TravelStory />

      <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-24 border-y border-border py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 id="tools-heading" className="mb-3 text-center text-sm font-medium text-text-secondary">Tools I work with</h2>
          <TechLogos />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <p className="mb-7 text-sm text-text-secondary">Have something in mind?</p>
        <Link href="/contact" className="group flex items-center justify-between gap-6 border-b border-border pb-8">
          <h2 className="text-[clamp(3.5rem,9vw,8rem)] font-medium leading-none tracking-[-.06em]">Let’s talk.</h2>
          <ArrowDownRight className="size-12 transition-transform duration-500 group-hover:-rotate-45 motion-reduce:transition-none md:size-20" />
        </Link>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary">A process to improve. An idea to build. Or a good conversation.</p>
      </section>
    </>
  );
}
