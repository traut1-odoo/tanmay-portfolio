"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Check, ArrowDown, Box, FileText, Layers, Package, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./work-journey.css";

const chapters = [
  {
    label: "Commerce", system: "Heckler Headless", title: "Behind every order,", emphasis: "a whole business.",
    description: "Connecting the dealer’s quote to stock, production and a delivery promise the team can keep.",
    role: "My contributions connect dealer ordering, manufacturing, reporting and partner workflows in Heckler’s shared platform.",
    href: "/projects/heckler-headless", link: "Explore the Headless work", accent: "#345f3b", layer: "CUSTOMER EXPERIENCE", base: "ODOO / BUSINESS RECORDS", tag: "Commerce · Planning · Partners",
  },
  {
    label: "Operations", system: "Odoo operations", title: "The return arrives.", emphasis: "What happens next?",
    description: "From receiving to inspection to accounting. Giving the next person everything they need to act.",
    role: "I work on the steps in between: inspection, restocking, scrap, accounting handoffs and the exceptions that need a person.",
    href: "/projects/odoo-operations", link: "Explore the operations work", accent: "#9bcbef", layer: "PEOPLE / PROCESS", base: "ODOO / OPERATIONS", tag: "Returns · Capacity · Timekeeping",
  },
  {
    label: "Suppliers", system: "Supplier portal", title: "One shared view.", emphasis: "Fewer loose ends.",
    description: "An 8,441-row spreadsheet became a shared workspace for staff and suppliers.",
    role: "I mapped the process, designed the staff and supplier workflows, and directed the build around Odoo.",
    href: "/projects/vendor-management-portal", link: "Explore the supplier portal", accent: "#8e542a", layer: "SUPPLIER COLLABORATION", base: "ODOO / SHARED RECORDS", tag: "8 modules · Two workspaces",
  },
  {
    label: "AI tools", system: "Odoo + MCP", title: "Ask a question.", emphasis: "Follow the evidence.",
    description: "Getting an answer should not mean opening five screens. I connected natural-language questions to structured ERP queries.",
    role: "I defined the operational questions, the tool interface and the checks needed to make the answers useful.",
    href: "/projects/ai-erp-connector", link: "Explore the ERP connector", accent: "#c8b8f4", layer: "NATURAL LANGUAGE", base: "ODOO / SOURCE RECORDS", tag: "Questions · Tools · Context",
  },
];

const scrollQuery = "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference), (min-width: 480px) and (max-width: 899px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";
function subscribeLayout(callback: () => void) {
  const media = window.matchMedia(scrollQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getScrollLayout = () => window.matchMedia(scrollQuery).matches;
const getServerLayout = () => false;
const chapterStarts = [0, 0.25, 0.5, 0.75];
const chapterEnds = [0.17, 0.42, 0.67, 1];
const galleryStops = [0, 0.17, 0.25, 0.42, 0.5, 0.67, 0.75, 1];

function chapterProgress(value: number, chapter: number) {
  return Math.max(0, Math.min(1, (value - chapterStarts[chapter]) / (chapterEnds[chapter] - chapterStarts[chapter])));
}

function galleryPosition(value: number) {
  const chapter = Math.min(3, Math.floor(value * 4));
  if (chapter === 3 || value <= chapterEnds[chapter]) return chapter;
  return chapter + (value - chapterEnds[chapter]) / (chapterStarts[chapter + 1] - chapterEnds[chapter]);
}

function ProductDrawing({ step, packaged, accent, duration }: { step: number; packaged: boolean; accent: string; duration: number }) {
  return (
    <motion.svg viewBox="0 0 180 175" animate={{ rotate: step === 1 ? -5 : 0 }} transition={{ duration }} aria-hidden="true">
      <ellipse cx="90" cy="153" rx="66" ry="9" fill="currentColor" opacity=".08" />
      <motion.path initial={false} animate={{ y: step === 1 ? 13 : 0 }} transition={{ duration }} d="M56 126L110 112L149 130L91 147Z" fill="#75848b" stroke="#a9b5bc" />
      <path d="M83 52L105 47L114 116L91 126Z" fill="#50616a" stroke="#acb7bc" />
      <motion.g initial={false} animate={{ y: step === 1 ? -10 : 0 }} transition={{ duration }}>
        <path d="M26 29L113 9L148 72L58 96Z" fill="#2c3d44" stroke="#b4c1c4" strokeWidth="2" />
        <path d="M34 34L108 17L137 67L62 87Z" fill="#17282e" stroke="#59717b" />
        <path d="M52 49L101 37M57 59L118 43M63 69L91 62" stroke="#c4ed9b" opacity=".7" />
      </motion.g>
      <motion.g initial={false} animate={{ opacity: packaged ? 1 : 0, y: packaged ? 0 : 18 }} transition={{ duration }}>
        <path d="M14 71L87 44L166 70V139L92 167L14 137Z" fill={accent} fillOpacity=".1" stroke={accent} strokeWidth="1.5" />
        <path d="M14 71L92 99L166 70M92 99V167M52 57L128 85V106" stroke={accent} strokeWidth="1.5" />
      </motion.g>
    </motion.svg>
  );
}

function JourneyScene({ chapter, progress }: { chapter: number; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const [scrollStep, setScrollStep] = useState(0);
  const [stepOverride, setStepOverride] = useState<number | null>(null);
  const [viewOverride, setViewOverride] = useState<string | null>(null);
  const [answerOverride, setAnswerOverride] = useState<boolean | null>(null);
  const step = stepOverride ?? scrollStep;
  const view = viewOverride ?? (scrollStep > 0 ? "Supplier" : "Staff");
  const answer = answerOverride ?? scrollStep > 0;
  const info = chapters[chapter];
  const rise = useTransform(progress, value => Math.max(-1, Math.min(1, galleryPosition(value) - chapter)) * 30);
  const sceneScale = useTransform(progress, value => 1 - Math.min(1, Math.abs(galleryPosition(value) - chapter)) * 0.06);
  useMotionValueEvent(progress, "change", value => {
    const next = Math.min(2, Math.floor(chapterProgress(value, chapter) * 3));
    if (next === scrollStep) return;
    setScrollStep(next);
    // A click takes control until scrolling reaches the next workflow step.
    setStepOverride(null);
    setViewOverride(null);
    setAnswerOverride(null);
  });
  const stages = chapter === 1 ? ["Receive", "Inspect", "Resolve"] : ["Quote", "Plan", "Deliver"];
  const duration = reduced ? 0 : 0.55;
  const titles = chapter === 1 ? ["Parcel received", "Inspection recorded", "Ready for handoff"] : ["Quote prepared", "Build requirements", "Delivery promise"];
  const descriptions = chapter === 1
    ? ["Match the arrival to the return. Keep partial arrivals visible.", "Record the condition. Choose restock or scrap with the evidence attached.", "Pass the outcome to accounting so the credit can be reviewed."]
    : ["One place for the dealer to review items and documents.", "Check parts, quantities and production work behind the order.", "Carry the plan into an update the customer can understand."];
  const nextStep = <Button className="workflow-next" variant="ghost" onClick={() => setStepOverride((step + 1) % 3)}>{step === 2 ? "Start again" : `Continue to ${stages[step + 1].toLowerCase()}`} {step === 2 ? <RotateCcw size={15} /> : <ArrowRight size={15} />}</Button>;

  return (
    <div className="journey-scene" style={{ "--chapter-accent": info.accent } as React.CSSProperties}>
      <motion.div className={`workflow-composition workflow-${chapter}`} style={{ y: reduced ? 0 : rise, scale: reduced ? 1 : sceneScale }}>
        {chapter === 0 && <div className="commerce-conveyor">
          <div className="commerce-stations" aria-label="Order stages">
            {stages.map((name, i) => <Button key={name} variant="ghost" className="commerce-station" aria-pressed={step === i} onClick={() => setStepOverride(i)}><span>{i < step ? <Check size={13} /> : `0${i + 1}`}</span>{name}</Button>)}
            <div className="commerce-rail" aria-hidden="true"><motion.span animate={{ scaleX: (step + 1) / 3 }} transition={{ duration }} /></div>
          </div>
          <div className="commerce-artifacts">
            <motion.div className="commerce-ticket" animate={{ rotate: step === 0 ? -5 : -2, y: step === 0 ? -5 : 3 }} transition={{ duration }}>
              <FileText size={19} /><span>ORDER / 024</span><h4>Dealer<br />quote.</h4><div className="ticket-rule" /><p>Items<br />Documents<br />One workspace</p><div className="ticket-barcode" aria-hidden="true" />
            </motion.div>
            <div className="commerce-product"><ProductDrawing step={step} packaged={step === 2} accent={info.accent} duration={duration} /><span>Sample product</span></div>
            <motion.div className="commerce-dispatch" animate={{ opacity: step === 2 ? 1 : 0.45, y: step === 2 ? -3 : 9 }} transition={{ duration }}>
              <Package size={22} /><span>DELIVERY</span><strong>A promise<br />you can keep.</strong><span className="dispatch-check"><Check size={13} />{step === 2 ? "Plan carried through" : "Plan comes first"}</span>
            </motion.div>
          </div>
          <div className="commerce-detail"><h4>{titles[step]}</h4><p>{descriptions[step]}</p></div>
          {nextStep}
        </div>}

        {chapter === 1 && <div className="operations-workbench">
          <div className="bench-heading"><span>RETURN / EXAMPLE 024</span><span className="bench-status">{["Receiving", "Quality review", "Accounting review"][step]}</span></div>
          <div className="bench-surface">
            <div className="bench-stages" aria-label="Return stages">{stages.map((name, i) => <Button key={name} variant="ghost" className="bench-stage" aria-pressed={step === i} onClick={() => setStepOverride(i)}><span>0{i + 1}</span>{name}{step === i && <ArrowRight size={13} />}</Button>)}</div>
            <div className="bench-specimen">
              <span className="bench-cross bench-cross-top" aria-hidden="true">+</span><span className="bench-cross bench-cross-bottom" aria-hidden="true">+</span>
              <ProductDrawing step={step} packaged={step === 0} accent={info.accent} duration={duration} />
              <motion.div className="inspection-line" animate={{ top: step === 1 ? "73%" : "23%", opacity: step === 1 ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.9 }} aria-hidden="true" />
              <span>ILLUSTRATIVE INSPECTION</span>
            </div>
          </div>
          <div className="bench-disposition"><h4>{titles[step]}</h4><p>{descriptions[step]}</p></div>
          {nextStep}
        </div>}

        {chapter === 2 && <div className="supplier-workspace">
          <div className="supplier-perspectives" aria-label="Portal perspectives">{["Staff", "Supplier"].map(name => <Button key={name} variant="ghost" className="supplier-perspective" aria-pressed={view === name} onClick={() => setViewOverride(name)}>{name === "Staff" ? <Layers size={15} /> : <Box size={15} />}{name} view</Button>)}</div>
          <div className="supplier-documents">
            <motion.div className="supplier-document staff-document" data-focused={view === "Staff"} animate={{ rotate: view === "Staff" ? -3 : -1, y: view === "Staff" ? -4 : 3 }} transition={{ duration }}>
              <span>INTERNAL WORKSPACE</span><h4>Purchase<br />order 024</h4><p>Aluminium components</p><div className="document-rule" /><ul><li><Check size={11} /> Pricing</li><li><Check size={11} /> Receipts</li><li><Check size={11} /> Order history</li></ul>
            </motion.div>
            <div className="supplier-bridge" aria-hidden="true"><span /><ArrowRight size={17} /><span /></div>
            <motion.div className="supplier-document vendor-document" data-focused={view === "Supplier"} animate={{ rotate: view === "Supplier" ? 3 : 1, y: view === "Supplier" ? -4 : 3 }} transition={{ duration }}>
              <span>SUPPLIER WORKSPACE</span><h4>The same<br />order.</h4><p>Aluminium components</p><div className="document-rule" /><strong>40 <small>units remaining</small></strong><p>Delivery updates for<br />your own orders.</p>
            </motion.div>
          </div>
          <div className="supplier-reconciliation"><div><strong>120</strong><span>ordered</span></div><span>−</span><div><strong>80</strong><span>received</span></div><span>=</span><div><strong>40</strong><span>remaining</span></div></div>
          <p className="supplier-permission"><ShieldCheck size={15} />{view === "Staff" ? "Staff review pricing, receipts and the full order history." : "Suppliers see their own orders and provide delivery updates."}</p>
        </div>}

        {chapter === 3 && <div className="ai-trace">
          <div className="ai-question"><span>01 / QUESTION</span><h4>Which parts<br />need attention?</h4><Search size={22} /></div>
          <div className="ai-tool-path"><div className="ai-trace-line" /><motion.div className="ai-tool-node" animate={{ borderColor: answer ? info.accent : "#80798e", scale: answer ? 1 : 0.94 }} transition={{ duration }}><Layers size={16} /><span>MCP tool</span></motion.div><ArrowDown size={15} /></div>
          <div className="ai-evidence-branches">
            <svg viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M200 0V10H90V26M200 10H310V26" fill="none" stroke="currentColor" strokeWidth="1" animate={{ pathLength: answer ? 1 : 0.25 }} transition={{ duration }} /></svg>
            <motion.div className="ai-evidence" animate={{ opacity: answer ? 1 : 0.4, y: answer || reduced ? 0 : 7 }} transition={{ duration }}><span>ODOO RECORDS</span><strong>Stock + builds</strong><p>{answer ? "Component shortfall" : "Check requirements"}</p></motion.div>
            <motion.div className="ai-evidence" animate={{ opacity: answer ? 1 : 0.4, y: answer || reduced ? 0 : 7 }} transition={{ duration, delay: reduced ? 0 : 0.08 }}><span>ODOO RECORDS</span><strong>Expected delivery</strong><p>{answer ? "Delivery needs review" : "Check the incoming plan"}</p></motion.div>
          </div>
          <div className="ai-result"><span>ILLUSTRATIVE RESPONSE</span><h4>{answer ? "Two parts to review." : "The answer starts with the source."}</h4><p>{answer ? "One component is short against planned builds. Another needs its expected delivery checked. Review the records before changing the plan." : "A structured query brings the relevant records into the conversation."}</p></div>
          <Button variant="ghost" className="workflow-next" onClick={() => setAnswerOverride(!answer)}>{answer ? "Reset example" : "Trace the question"}{answer ? <RotateCcw size={15} /> : <ArrowRight size={15} />}</Button>
        </div>}
      </motion.div>
      <p className="journey-scene-caption">Recreated workflow · Sample data</p>
    </div>
  );
}

export function WorkJourney() {
  const introduction = useRef<HTMLElement>(null);
  const section = useRef<HTMLElement>(null);
  const scrollLayout = useSyncExternalStore(subscribeLayout, getScrollLayout, getServerLayout);
  const reduced = useReducedMotion();
  const { scrollYProgress: introductionProgress } = useScroll({ target: introduction, offset: ["start 90%", "end 45%"] });
  const progress = useMotionValue(0);
  const [active, setActive] = useState(0);
  const chapter = chapters[active];
  const stripX = useTransform(progress, galleryStops, ["0%", "0%", "-25%", "-25%", "-50%", "-50%", "-75%", "-75%"]);

  useMotionValueEvent(progress, "change", value => {
    if (scrollLayout) setActive(Math.round(galleryPosition(value)));
  });

  useEffect(() => {
    if (!scrollLayout) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance = rect.height - window.innerHeight + 64;
      progress.set(Math.max(0, Math.min(1, (64 - rect.top) / distance)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (section.current) observer.observe(section.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [scrollLayout, progress]);

  const selectChapter = (index: number) => {
    if (scrollLayout && section.current) {
      const rect = section.current.getBoundingClientRect();
      const distance = rect.height - window.innerHeight + 64;
      window.scrollTo({ top: window.scrollY + rect.top - 64 + chapterStarts[index] * distance, behavior: "smooth" });
    } else {
      setActive(index);
      progress.set(chapterStarts[index]);
    }
  };

  return (
    <>
      <section ref={introduction} className="work-introduction mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-24" aria-labelledby="work-intro-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[.15em] text-text-secondary">The work today</p>
          <Link href="/projects/archive" className="inline-flex min-h-11 items-center gap-2 text-sm hover:underline">All projects <ArrowRight size={15} /></Link>
        </div>
        <div className="journey-intro-layout">
          <div>
            <h2 id="work-intro-title">From order <span className="serif-display italic">to outcome.</span></h2>
            <p>Orders, people and the systems between them. A few things I work on at Heckler.</p>
          </div>
          <div className="journey-intro-flow">
            <svg viewBox="0 0 600 60" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M30 30H570" stroke="currentColor" strokeOpacity="0.15" />
              <motion.path d="M30 30H570" stroke="currentColor" strokeWidth="2" style={{ pathLength: reduced ? 1 : introductionProgress }} />
              {[30, 210, 390, 570].map(x => <circle key={x} cx={x} cy="30" r="5" fill="currentColor" />)}
            </svg>
            <ol><li>Quote</li><li>Plan</li><li>Build</li><li>Deliver</li></ol>
          </div>
        </div>
      </section>
      <section ref={section} id="inside-the-work" aria-label="Explore four parts of my work" className="work-journey" style={{ "--chapter-accent": chapter.accent } as React.CSSProperties}>
        <div className="journey-sticky">
          <div className="journey-navigation">
            <nav aria-label="Work chapters">{chapters.map((c, i) => <Button key={c.label} variant="ghost" aria-pressed={i === active} aria-controls={`work-chapter-${i}`} onClick={() => selectChapter(i)} className="journey-chapter-button"><span>0{i + 1}</span>{c.label}</Button>)}</nav>
            <span className="journey-scroll-instruction">{scrollLayout ? "SCROLL TO MOVE THROUGH THE WORK →" : "CHOOSE A CHAPTER"}</span>
          </div>
          <div className="journey-viewport">
            <motion.div className="journey-strip" style={{ x: scrollLayout ? stripX : 0 }}>
              {chapters.map((item, i) => (
                <article id={`work-chapter-${i}`} key={item.label} className="journey-slide" data-chapter={i} data-active={i === active} aria-hidden={i !== active} inert={i !== active} style={{ "--chapter-accent": item.accent } as React.CSSProperties}>
                  <div className="journey-layout">
                    <div className="journey-copy">
                      <p className="journey-eyebrow">{item.system}</p>
                      <h3>{item.title}<br /><span>{item.emphasis}</span></h3>
                      <p className="journey-description">{item.description}</p>
                      <Button asChild variant="ghost" className="journey-project-link"><Link href={item.href}>{item.link}<ArrowRight size={16} /></Link></Button>
                    </div>
                    <JourneyScene chapter={i} progress={progress} />
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
          <div className="journey-progress" aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
        </div>
      </section>
    </>
  );
}
