"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Check, ChevronRight, CircleDot, Layers, Package, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./work-journey.css";

const chapters = [
  {
    label: "Commerce", system: "Heckler Headless", title: "Behind every order,", emphasis: "a whole business.",
    description: "Connecting the dealer’s quote to stock, production and a delivery promise the team can keep.",
    role: "My contributions connect dealer ordering, manufacturing, reporting and partner workflows in Heckler’s shared platform.",
    href: "/projects/heckler-headless", link: "Explore the Headless work", accent: "#c4ed9b", layer: "CUSTOMER EXPERIENCE", base: "ODOO / BUSINESS RECORDS", tag: "Commerce · Planning · Partners",
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
    href: "/projects/vendor-management-portal", link: "Explore the supplier portal", accent: "#f5bf8d", layer: "SUPPLIER COLLABORATION", base: "ODOO / SHARED RECORDS", tag: "8 modules · Two workspaces",
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
  const tilt = useTransform(progress, value => Math.max(-1, Math.min(1, galleryPosition(value) - chapter)) * -12);
  const rise = useTransform(progress, value => Math.max(-1, Math.min(1, galleryPosition(value) - chapter)) * 24);
  const sceneScale = useTransform(progress, value => 1 - Math.min(1, Math.abs(galleryPosition(value) - chapter)) * 0.08);
  const routeReveal = useTransform(progress, value => 0.18 + chapterProgress(value, chapter) * 0.82);
  useMotionValueEvent(progress, "change", value => {
    const next = Math.min(2, Math.floor(chapterProgress(value, chapter) * 3));
    if (next === scrollStep) return;
    setScrollStep(next);
    // A click takes control until scrolling reaches the next workflow step.
    setStepOverride(null);
    setViewOverride(null);
    setAnswerOverride(null);
  });
  const routes = [
    "M24 420V95Q24 55 64 55H535Q576 55 576 95V420",
    "M18 130H65V55H530V130H580V420H530V455H65V420H18Z",
    "M20 90H140Q180 90 180 130V370Q180 410 140 410H20M580 90H460Q420 90 420 130V370Q420 410 460 410H580",
    "M30 90L300 28L570 90M30 90L65 410L300 465L535 410L570 90M65 410L535 410",
  ];
  const stages = chapter === 1 ? ["Receive", "Inspect", "Resolve"] : ["Quote", "Plan", "Deliver"];
  const duration = reduced ? 0 : 0.65;
  const packaged = chapter === 1 ? step === 0 : step === 2;

  return (
    <div className="journey-scene" style={{ "--chapter-accent": info.accent } as React.CSSProperties}>
      <svg className="journey-workflow-map" viewBox="0 0 600 500" fill="none" aria-hidden="true">
        <path d={routes[chapter]} stroke="currentColor" strokeOpacity="0.14" />
        <motion.path d={routes[chapter]} stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55" style={{ pathLength: reduced ? 1 : routeReveal }} />
        {[{ x: 30, y: 90 }, { x: 570, y: 90 }, { x: 65, y: 410 }, { x: 535, y: 410 }].map((point, i) => <rect key={i} x={point.x - 4} y={point.y - 4} width="8" height="8" rx="2" fill="currentColor" opacity="0.65" />)}
      </svg>
      <motion.div className="journey-system" style={{ rotateY: reduced ? 0 : tilt, y: reduced ? 0 : rise, scale: reduced ? 1 : sceneScale }}>
        <motion.div className="journey-backplate" animate={{ rotate: [0, 1, -1, 0][chapter], x: [30, -10, 20, 0][chapter] }} transition={{ duration }}>
          <Layers size={15} /><span>{info.base}</span><span className="journey-led" />
        </motion.div>
        <motion.div className="journey-connector" initial={false} animate={{ scaleY: 1 }} aria-hidden="true" />
        <motion.div className="journey-window" initial={reduced ? false : { opacity: 0, y: 48, rotateX: 12, scale: 0.92 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} transition={{ duration, ease: [0.22, 1, 0.36, 1] }}>
          <div className="journey-window-bar"><span><CircleDot size={13} /> {info.system}</span><span className="journey-demo-label">Demo</span></div>
          <div className="journey-window-body">
            {chapter < 2 && <>
              <div className="journey-window-heading"><div><span className="journey-micro">{chapter === 1 ? "CUSTOMER RETURN" : "DEALER WORKSPACE"}</span><h4>{chapter === 1 ? "A clear next step." : "An order taking shape."}</h4></div><Package className="journey-package-icon" size={28} /></div>
              <div className="journey-stage-tabs" aria-label={chapter === 1 ? "Return stages" : "Order stages"}>
                {stages.map((name, i) => <Button key={name} variant="ghost" aria-pressed={step === i} onClick={() => setStepOverride(i)} className="journey-stage-button"><span>{i < step ? <Check size={12} /> : `0${i + 1}`}</span>{name}</Button>)}
              </div>
              <div className="journey-track"><motion.span animate={{ width: `${(step + 1) / 3 * 100}%` }} transition={{ duration }} /></div>
              <div className="journey-order-content">
                <div className="journey-object" aria-hidden="true">
                  <motion.svg viewBox="0 0 180 175" animate={{ rotate: step === 1 ? -5 : 0 }} transition={{ duration }}>
                    <defs><linearGradient id={`stand-metal-${chapter}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ccd4dc" /><stop offset="0.48" stopColor="#59646e" /><stop offset="1" stopColor="#252e36" /></linearGradient></defs>
                    <ellipse cx="90" cy="153" rx="66" ry="9" fill="#000" opacity=".3" />
                    <motion.path initial={false} animate={{ y: step === 1 ? 13 : 0 }} transition={{ duration }} d="M56 126 L110 112 L149 130 L91 147 Z" fill={`url(#stand-metal-${chapter})`} stroke="#8b979f" />
                    <path d="M83 52 L105 47 L114 116 L91 126 Z" fill={`url(#stand-metal-${chapter})`} stroke="#8b979f" />
                    <motion.g initial={false} animate={{ y: step === 1 ? -10 : 0 }} transition={{ duration }}>
                    <path d="M26 29 L113 9 L148 72 L58 96 Z" fill="#27343c" stroke="#a3adb4" strokeWidth="2" />
                    <path d="M34 34 L108 17 L137 67 L62 87 Z" fill="#10181c" stroke="#4d6470" />
                    <path d="M52 49 L101 37 M57 59 L118 43 M63 69 L91 62" stroke={info.accent} opacity=".6" />
                    <circle cx="93" cy="78" r="1.5" fill="#cdd3d8" />
                    </motion.g>
                    <motion.g initial={false} animate={{ opacity: packaged ? 1 : 0, y: packaged ? 0 : 18 }} transition={{ duration }}>
                      <path d="M14 71L87 44L166 70V139L92 167L14 137Z" fill={info.accent} fillOpacity=".12" stroke={info.accent} strokeWidth="1.5" />
                      <path d="M14 71L92 99L166 70M92 99V167M52 57L128 85V106" stroke={info.accent} strokeWidth="1.5" />
                    </motion.g>
                  </motion.svg>
                  <span>Sample product</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} className="journey-record" initial={reduced ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }}>
                    <span className="journey-micro">{chapter === 1 ? "RETURN / EXAMPLE 024" : "ORDER / EXAMPLE 024"}</span>
                    <h5>{chapter === 1 ? ["Parcel received", "Inspection recorded", "Ready for handoff"][step] : ["Quote prepared", "Build requirements", "Delivery promise"][step]}</h5>
                    <p>{chapter === 1 ? ["Match the arrival to the return. Keep partial arrivals visible.", "Record the condition. Choose restock or scrap with the evidence attached.", "Pass the outcome to accounting so the credit can be reviewed."][step] : ["One place for the dealer to review items and documents.", "Check parts, quantities and production work behind the order.", "Carry the plan into an update the customer can understand."][step]}</p>
                    <span className="journey-record-status"><Check size={12} />{chapter === 1 ? ["Receiving", "Quality review", "Accounting review"][step] : ["Dealer", "Operations", "Customer"][step]}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <Button className="journey-action" variant="ghost" onClick={() => setStepOverride((step + 1) % 3)}>{step === 2 ? "Start again" : `Continue to ${stages[step + 1].toLowerCase()}`} {step === 2 ? <RotateCcw size={14} /> : <ArrowRight size={14} />}</Button>
            </>}
            {chapter === 2 && <>
              <div className="journey-window-heading"><div><span className="journey-micro">TWO SIDES / ONE RECORD</span><h4>The same order. In context.</h4></div><ShieldCheck size={26} className="journey-package-icon" /></div>
              <div className="journey-stage-tabs" aria-label="Portal perspectives">{["Staff", "Supplier"].map(name => <Button key={name} variant="ghost" className="journey-stage-button" aria-pressed={view === name} onClick={() => setViewOverride(name)}>{name} view</Button>)}</div>
              <div className="journey-supplier-record"><span className="journey-micro">PURCHASE ORDER / SAMPLE 024</span><h5>Aluminium components</h5><div className="journey-table"><span>Ordered</span><strong>120 units</strong><span>Received</span><strong>80 units</strong><span>Remaining</span><strong style={{ color: info.accent }}>40 units</strong></div></div>
              <AnimatePresence mode="wait" initial={false}><motion.p key={view} className="journey-permission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}><ShieldCheck size={15} />{view === "Staff" ? "Staff review pricing, receipts and the full order history." : "Suppliers see their own orders and provide delivery updates."}</motion.p></AnimatePresence>
            </>}
            {chapter === 3 && <>
              <div className="journey-window-heading"><div><span className="journey-micro">QUESTION → TOOL → RECORD</span><h4>Less digging. More context.</h4></div><Search size={26} className="journey-package-icon" /></div>
              <div className="journey-query">Which parts need attention?<span>↵</span></div>
              <div className="journey-query-route"><span>Question</span><ChevronRight size={14} /><span>MCP tool</span><ChevronRight size={14} /><span>Odoo records</span></div>
              <motion.div className="journey-query-result" animate={{ opacity: answer ? 1 : 0.38, y: answer || reduced ? 0 : 8 }} transition={{ duration }}><span className="journey-micro">ILLUSTRATIVE RESPONSE</span><h5>{answer ? "Two parts to review." : "The answer starts with the source."}</h5><p>{answer ? "One component is short against planned builds. Another needs its expected delivery checked. Review the records before changing the plan." : "A structured query brings the relevant records into the conversation."}</p>{answer && <span className="journey-record-status"><Check size={12} /> Context attached</span>}</motion.div>
              <Button variant="ghost" className="journey-action" onClick={() => setAnswerOverride(!answer)}>{answer ? "Reset example" : "Trace the question"}{answer ? <RotateCcw size={14} /> : <ArrowRight size={14} />}</Button>
            </>}
          </div>
        </motion.div>
        <motion.div className="journey-front-tag" initial={reduced ? false : { x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration, delay: reduced ? 0 : 0.15 }}><span className="journey-led" />{info.layer}</motion.div>
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
