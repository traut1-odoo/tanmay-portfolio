"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, FileSpreadsheet, MessageSquare, Package, RotateCcw, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stories = [
  {
    id: "suppliers", label: "Supplier orders", icon: Package,
    title: "Which spreadsheet is right?", result: "One place to find the answer.",
    problem: "Products, prices, orders and returns lived in an 8,441-row spreadsheet. Keeping it current was part of the job.",
    solution: "A shared portal puts the order and its history together. Staff manage the work. Suppliers see what they need.",
    role: "I mapped the process, designed both sides of the portal and led the build.",
    before: ["Check the spreadsheet", "Find the latest email", "Ask for an update"],
    after: ["Open the order", "See delivery and pricing", "Resolve the return"],
    proof: "8 modules", detail: "Products, orders, pricing and more",
    href: "/projects/vendor-management-portal", link: "Explore the supplier portal",
  },
  {
    id: "quality", label: "Quality & returns", icon: RotateCcw,
    title: "A defect. Now who owns it?", result: "A clear next step for every return.",
    problem: "A failed inspection needs more than a note. Someone has to decide what happens to the part and follow through with the supplier.",
    solution: "Inspection, disposition and vendor response sit in one workflow. The credit note follows the decision.",
    role: "I designed the inspection and return process, then guided the module build in Odoo.",
    before: ["Record the defect", "Chase a decision", "Follow up on the credit"],
    after: ["Log an inspection", "Choose a disposition", "Track the vendor response"],
    proof: "6 dispositions", detail: "A defined route for each outcome",
    href: "/projects/qc-vendor-rma", link: "Explore the returns workflow",
  },
  {
    id: "answers", label: "Finding answers", icon: Search,
    title: "A quick question. Another export.", result: "Ask the question. Get to the records.",
    problem: "Answering an operations question often meant opening several screens, exporting data and working through a spreadsheet.",
    solution: "An MCP connector lets Claude query Odoo directly. People can ask about stock, orders and manufacturing in their own words.",
    role: "I defined the tools and business questions, directed the build and rolled it out to the team.",
    before: ["Find the right screens", "Export the records", "Build a spreadsheet"],
    after: ["Ask an operations question", "Query Odoo through MCP", "Review the returned records"],
    proof: "Direct Odoo queries", detail: "Inventory, orders and manufacturing",
    href: "/projects/ai-erp-connector", link: "Explore the Odoo connector",
  },
];

export function WorkExplorer() {
  const [view, setView] = useState("before");
  const reducedMotion = useReducedMotion();

  return (
    <section id="inside-the-work" aria-labelledby="work-explorer-title" className="work-explorer scroll-mt-24 py-14 md:py-24">
      <div className="mb-9 grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
        <div>
          <p className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-text-secondary">01 / What I do</p>
          <h2 id="work-explorer-title" className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Good systems.<br /><span className="serif-display font-normal italic">Less chasing.</span></h2>
        </div>
        <div>
          <p className="max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">I look after Odoo across eight departments at Heckler Design. I work with the people using it, figure out what needs to change and see it through.</p>
          <p className="mt-4 text-sm font-medium">Pick a familiar problem. See what changed.</p>
        </div>
      </div>

      <Tabs defaultValue="suppliers" onValueChange={() => setView("before")} className="gap-0">
        <TabsList aria-label="Explore a work problem" className="mb-5 h-auto! w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0 pb-3">
          {stories.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="min-h-12 flex-1 gap-2 rounded-xl px-2 py-3 text-xs sm:flex-none sm:px-5 sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background">
              <Icon className="hidden size-4 sm:block" />{label}
            </TabsTrigger>
          ))}
        </TabsList>
        {stories.map((story) => (
          <TabsContent key={story.id} value={story.id} className="overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="flex flex-col p-6 sm:p-9 lg:p-10">
                <div className="mb-7 flex items-center gap-2 text-xs font-mono text-text-secondary"><span className="size-2 rounded-full bg-accent" />From my work at Heckler</div>
                <h3 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">{story.title}</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">{story.problem}</p>
                <div className="mt-7 border-t border-border pt-5">
                  <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-secondary">My part</p>
                  <p className="max-w-md text-sm leading-relaxed">{story.role}</p>
                </div>
                <Button asChild variant="outline" className="mt-8 min-h-12 self-start whitespace-normal px-4 text-left">
                  <Link href={story.href}>{story.link}<ArrowRight /></Link>
                </Button>
              </div>

              <div className="work-board border-t border-border bg-surface-hover p-5 sm:p-8 lg:border-t-0 lg:border-l">
                <Tabs value={view} onValueChange={setView} className="gap-0">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">The everyday workflow</span>
                    <TabsList aria-label="Compare the workflow" className="h-auto! border border-border bg-background p-1">
                      <TabsTrigger value="before" className="min-h-10 px-4 data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background">Before</TabsTrigger>
                      <TabsTrigger value="after" className="min-h-10 px-4 data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background">After</TabsTrigger>
                    </TabsList>
                  </div>
                  {(["before", "after"] as const).map((mode) => (
                    <TabsContent key={mode} value={mode} className="m-0">
                      <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className="flex min-h-72 flex-col justify-center px-2 py-4 sm:px-6">
                          {story[mode].map((step, i) => (
                            <div key={step}>
                              <div className={cn("flex min-h-16 items-center gap-3 rounded-xl border bg-background px-4 py-3 shadow-sm", mode === "after" ? "border-accent/40" : "border-border", mode === "before" && (i % 2 ? "ml-5 -rotate-2" : "mr-5 rotate-1"))}>
                                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", mode === "after" ? "bg-accent/10 text-foreground" : "bg-surface-hover text-text-secondary")}>
                                  {mode === "after" ? <Check className="size-4" /> : i === 1 ? <MessageSquare className="size-4" /> : <FileSpreadsheet className="size-4" />}
                                </span>
                                <span className="text-sm font-medium">{step}</span>
                                <span className="ml-auto font-mono text-xs text-text-secondary">0{i + 1}</span>
                              </div>
                              {i < 2 && <div className="flex h-7 items-center justify-center"><ArrowDown aria-hidden="true" className={cn("size-4", mode === "after" ? "text-accent" : "text-text-secondary/50")} /></div>}
                            </div>
                          ))}
                        </div>
                        <div className="min-h-36 border-t border-border pt-5">
                          <h4 className="text-lg font-semibold">{mode === "after" ? story.result : "Too much time between the steps."}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{mode === "after" ? story.solution : "Switch to After to see how the work fits together."}</p>
                        </div>
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
                  <span className="text-sm font-semibold">{story.proof}</span>
                  <span className="text-xs text-text-secondary">Illustrated workflow, not live data</span>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-text-secondary">
        <span>Process design. Odoo. Manufacturing. Cost accounting.</span>
        <Link href="/labs" className="inline-flex min-h-11 items-center gap-2 text-foreground underline-offset-4 hover:underline">Want to try the tools? <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  );
}
