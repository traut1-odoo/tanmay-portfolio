"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testimonialDrafts } from "@/data/testimonial-drafts";

export default function TestimonialDraftPreviewContent() {
  // Defense in depth if someone imports this component directly in the future.
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <section
      id="testimonial-drafts"
      aria-labelledby="testimonial-drafts-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24"
    >
      <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12">
        <div>
          <p className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-text-secondary">
            Local preview
          </p>
          <h2
            id="testimonial-drafts-title"
            className="max-w-xl text-3xl font-medium leading-tight tracking-tight md:text-5xl"
          >
            A few people<br />
            <span className="serif-display font-normal italic">along the way.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
          Suggested wording for review. These words have not been supplied or
          approved by the people named below. This preview stays off the
          production site.
        </p>
      </div>

      <Tabs defaultValue={testimonialDrafts[0].id} className="gap-0">
        {testimonialDrafts.map((person) => (
          <TabsContent
            key={person.id}
            value={person.id}
            className="m-0 border-y border-border py-8 md:py-10"
          >
            <figure className="flex min-h-72 flex-col justify-between gap-7 md:min-h-80 md:gap-9">
              <p className="text-xs font-medium text-text-secondary">
                <span className="mr-2 inline-block size-1.5 rounded-full bg-amber-600 align-middle dark:bg-amber-400" aria-hidden="true" />
                Draft for review · Illustrative example · Not approved
              </p>
              <blockquote className="max-w-5xl text-[clamp(1.5rem,3.3vw,2.75rem)] font-normal leading-[1.35] tracking-tight text-foreground">
                <p>“{person.suggestedQuote}”</p>
              </blockquote>
              <figcaption className="flex flex-col gap-1 text-sm sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
                <span className="font-medium">Prepared for {person.name}</span>
                <span className="text-text-secondary">
                  {person.relationship} · {person.context}
                </span>
              </figcaption>
            </figure>
          </TabsContent>
        ))}

        <TabsList
          aria-label="Choose a testimonial draft to review"
          className="grid h-auto! w-full grid-cols-2 gap-0 rounded-none bg-transparent p-0 md:grid-cols-4"
        >
          {testimonialDrafts.map((person, index) => (
            <TabsTrigger
              key={person.id}
              value={person.id}
              className="h-auto min-h-24 flex-col items-start justify-center gap-2 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-5 text-left whitespace-normal transition-colors data-[state=active]:border-foreground data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-none motion-reduce:transition-none sm:px-5 dark:data-[state=active]:border-foreground dark:data-[state=active]:bg-surface"
            >
              <span className="text-[10px] font-mono text-text-secondary">
                0{index + 1}
              </span>
              <span className="text-sm font-medium">{person.name}</span>
              <span className="text-xs font-normal text-text-secondary">
                {person.context}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  );
}
