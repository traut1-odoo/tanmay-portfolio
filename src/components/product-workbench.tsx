"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Layers3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import "./product-workbench.css";

const AssemblyScene = dynamic(() => import("./assembly-scene"), { ssr: false, loading: () => <div className="assembly-fallback">Opening the workbench…</div> });
function AssemblyDiagram() {
  return <div className="assembly-fallback">
    <svg viewBox="0 0 440 310" aria-hidden="true" style={{ width: "100%", height: "100%", maxHeight: 350 }}>
      <path d="M200 116V282" stroke="#809789" strokeDasharray="4 7" />
      <rect x="108" y="24" width="184" height="104" rx="8" fill="#343d42" />
      <rect x="116" y="32" width="168" height="88" rx="4" fill="#b4d5c3" />
      <path d="M135 59H245M135 76H219M135 93H245" stroke="#5d806b" strokeWidth="5" />
      <rect x="155" y="154" width="90" height="35" rx="4" fill="#6b7c72" />
      <path d="M187 216H210L219 261H182Z" fill="#53695d" />
      <path d="M135 284H265L287 298H113Z" fill="#343d42" />
      <g stroke="#809789"><path d="M300 76H325" /><path d="M252 172H325" /><path d="M227 239H325" /><path d="M290 291H325" /></g>
      <g fill="#3b5546" fontFamily="monospace" fontSize="12"><text x="334" y="80">Device</text><text x="334" y="176">Mount</text><text x="334" y="243">Support</text><text x="334" y="295">Base</text></g>
    </svg>
  </div>;
}

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean; checked: boolean }> {
  state = { failed: false, checked: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidMount() {
    // R3F creates its renderer asynchronously. Check unsupported WebGL before
    // mounting Canvas, then release the temporary context immediately.
    let supported = false;
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      supported = !!context;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { /* The static diagram also works when context creation throws. */ }
    this.setState({ checked: true, failed: !supported });
    if (!supported) this.props.onUnavailable();
  }
  componentDidCatch() { this.props.onUnavailable(); }
  render() {
    if (this.state.failed) return <AssemblyDiagram />;
    if (!this.state.checked) return <div className="assembly-fallback">Opening the workbench…</div>;
    return this.props.children;
  }
}

const details = [
  { label: "Materials", value: "Parts & purchase cost", text: "Start with what goes into the product." },
  { label: "Operations", value: "Time & work centres", text: "Add the work it takes to make it." },
  { label: "The full picture", value: "A cost you can explain", text: "Connect the bill of materials to the numbers." },
];

export function ProductWorkbench() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { margin: "300px", once: true });
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 25%"] });
  const { scrollYProgress: assemblyProgress } = useScroll({ target: stage, offset: ["start 90%", "end 45%"] });
  const [explode, setExplode] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [finish, setFinish] = useState<"graphite" | "silver">("graphite");
  const [detail, setDetail] = useState(0);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);
  const handleSceneUnavailable = useCallback(() => setSceneUnavailable(true), []);
  const startDrag = useRef<{ x: number; rotation: number } | null>(null);
  const line = useTransform(scrollYProgress, [0.05, 0.8], [0, 1]);

  return (
    <section id="under-the-surface" ref={ref} className="product-workbench" aria-labelledby="workbench-title">
      <div className="workbench-topline"><span>02 / Under the surface</span><span>Manufacturing + finance</span></div>
      <div className="workbench-layout">
        <div className="workbench-story">
          <h2 id="workbench-title">A product.<br /><em>A hundred decisions.</em></h2>
          <p>What goes into it. Who makes it. What it really costs. I connect those details in Odoo.</p>
          <div className="workbench-detail-list" role="group" aria-label="Explore manufacturing costs">
            {details.map((item, i) => <Button key={item.label} variant="ghost" className="workbench-detail" aria-pressed={detail === i} onClick={() => { setDetail(i); if (!sceneUnavailable) setExplode(i === 0 ? 1 : i === 1 ? 0.55 : 0); }}>
              <span className="workbench-detail-number">0{i + 1}</span><span><small>{item.label}</small><strong>{item.value}</strong></span><ArrowUpRight size={18} />
            </Button>)}
          </div>
          <p className="workbench-note" aria-live="polite">{details[detail].text}</p>
          <Link href="/projects/manufacturing-cost-accounting" className="workbench-case">How I approached costing <ArrowUpRight size={17} /></Link>
        </div>
        <div className="workbench-artifact">
          <div className="workbench-artifact-label"><span><span className="workbench-dot" /> Assembly study / 001</span><span role="status">{sceneUnavailable ? "3D unavailable · Static view" : "Interactive 3D"}</span></div>
          <div ref={stage} className="workbench-stage" role="img" style={sceneUnavailable ? { cursor: "default" } : undefined} aria-label={sceneUnavailable ? "Static assembly diagram showing the device, mount, support and base separated vertically. 3D is unavailable; the manufacturing cost topics remain available." : "Interactive illustrative tablet stand. Scroll to separate its device, mount, support and base. Use the controls below to rotate or assemble it."}
            onPointerDown={event => { if (sceneUnavailable || event.button !== 0) return; startDrag.current = { x: event.clientX, rotation }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={event => { if (!sceneUnavailable && startDrag.current) setRotation(Math.max(-180, Math.min(180, startDrag.current.rotation + (event.clientX - startDrag.current.x) * 0.5))); }}
            onPointerUp={() => { startDrag.current = null; }} onPointerCancel={() => { startDrag.current = null; }}>
            <div className="workbench-technical-grid" aria-hidden="true" />
            <span className="workbench-axis workbench-axis-top">DEVICE</span><span className="workbench-axis workbench-axis-bottom">MATERIAL / PROCESS / COST</span>
            {sceneUnavailable ? <AssemblyDiagram /> : seen && <SceneBoundary onUnavailable={handleSceneUnavailable}><AssemblyScene progress={assemblyProgress} explode={explode} rotation={rotation} finish={finish} reduced={!!reduced} onUnavailable={handleSceneUnavailable} fallback={<AssemblyDiagram />} /></SceneBoundary>}
          </div>
          <div className="workbench-tools">
            <div className="workbench-view-buttons" role="group" aria-label="Assembly view">
              <Button variant="ghost" disabled={sceneUnavailable} aria-pressed={explode === 0} onClick={() => setExplode(0)}>Assemble</Button>
              <Button variant="ghost" disabled={sceneUnavailable} aria-pressed={explode === 1} onClick={() => setExplode(1)}><Layers3 size={14} /> Take apart</Button>
              <Button variant="ghost" disabled={sceneUnavailable} aria-label="Reset model to scroll control" title="Reset model to scroll control" onClick={() => { setExplode(null); setRotation(0); }}><RotateCcw size={15} /></Button>
            </div>
            <div className="workbench-finishes" role="group" aria-label="Stand finish"><Button variant="ghost" disabled={sceneUnavailable} aria-label="Graphite finish" aria-pressed={finish === "graphite"} onClick={() => setFinish("graphite")}><span style={{ background: "#343d42" }} /></Button><Button variant="ghost" disabled={sceneUnavailable} aria-label="Silver finish" aria-pressed={finish === "silver"} onClick={() => setFinish("silver")}><span style={{ background: "#b8c1c9" }} /></Button></div>
          </div>
          <label className="workbench-rotation">Rotate <input type="range" min="-180" max="180" disabled={sceneUnavailable} aria-valuetext={`${Math.round(rotation)} degrees`} value={rotation} onChange={event => setRotation(Number(event.target.value))} /><span>{Math.round(rotation)}°</span></label>
          <div className="workbench-artifact-footer"><span><ArrowDown size={13} /> {sceneUnavailable ? "Static diagram. Explore the cost topics alongside it." : explode === null ? "Scroll to take it apart. Drag to turn." : "Manual view. Reset ↻ to follow scrolling."}</span><span>Illustrative model</span></div>
        </div>
      </div>
      <div className="workbench-index">
        <div className="workbench-index-title"><span>Other things I’ve untangled</span><Link href="/projects/archive">All {projects.length} projects <ArrowUpRight size={17} /></Link></div>
        <Link href="/projects/stripe-tax-odoo" className="workbench-project"><span>01</span><strong>Tax that follows the transaction.</strong><small>My Stripe Tax module for Odoo</small><ArrowUpRight /></Link>
        <Link href="/case-studies/odoo-17" className="workbench-project"><span>02</span><strong>Moving the business to Odoo 17.</strong><small>Migration & cutover</small><ArrowUpRight /></Link>
        <div className="workbench-bottom-line"><motion.span style={{ scaleX: reduced ? 1 : line }} /></div>
      </div>
    </section>
  );
}
