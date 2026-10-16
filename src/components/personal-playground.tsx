"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, HeartHandshake, RotateCcw, ScanLine, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./personal-playground.css";

const SCENARIOS = [
  { label: "Clear trend", points: [66, 70, 64, 80, 77, 92, 88, 101, 98, 121, 112, 128, 135, 131, 147, 155, 150, 171, 163, 185], note: "A consistent pattern. The source and the risk still need checking." },
  { label: "Mixed signals", points: [95, 103, 88, 114, 125, 106, 94, 118, 140, 116, 101, 125, 112, 99, 123, 138, 117, 105, 128, 115], note: "Conflicting signals. More context beats a confident score." },
  { label: "Reversal", points: [68, 75, 90, 86, 108, 116, 111, 139, 147, 162, 173, 163, 140, 120, 128, 97, 82, 90, 65, 52], note: "Direction changed. Recheck the assumptions behind the earlier view." },
];
const REQUESTS = [
  { id: "groceries", label: "Groceries", pin: "01", title: "A few groceries. A quick hello.", detail: "Bread, milk and fruit for someone at home.", result: "Everything on the list is home. We stayed for a quick chat.", x: 590, y: 112, route: "M90 330 H260 V112 H590", xs: [90, 260, 260, 590], ys: [330, 330, 112, 112] },
  { id: "walk", label: "A short walk", pin: "02", title: "A little company outdoors.", detail: "A gentle walk around the neighbourhood park.", result: "Back from the park. A short walk and a good conversation.", x: 570, y: 304, route: "M90 330 H430 V304 H570", xs: [90, 260, 430, 430, 570], ys: [330, 330, 330, 304, 304] },
  { id: "visit", label: "A check-in", pin: "03", title: "Sometimes, just showing up helps.", detail: "A friendly visit and an update for family.", result: "Dropped by for tea. Everything is fine at home.", x: 365, y: 195, route: "M90 330 H260 V195 H365", xs: [90, 260, 260, 365], ys: [330, 330, 195, 195] },
];

function ResearchDesk() {
  const ref = useRef<HTMLDivElement>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [observation, setObservation] = useState(13);
  const [stale, setStale] = useState(false);
  const [concentrated, setConcentrated] = useState(false);
  const id = useId().replaceAll(":", "");
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.38, 1], [-3, 0, 2]);
  const y = useTransform(scrollYProgress, [0, 0.38, 1], [80, 0, -45]);
  const clipWidth = useTransform(scrollYProgress, [0, 0.18, 0.4], [80, 420, 800]);
  const scenario = SCENARIOS[scenarioIndex];
  const selectedX = 42 + observation * 37;
  const selectedY = 300 - scenario.points[observation];
  const line = scenario.points.map((value, i) => `${i ? "L" : "M"}${42 + i * 37} ${300 - value}`).join(" ");
  const note = stale ? "The source is old. Refresh it before trusting the picture." : concentrated ? "Exposure is concentrated. A good-looking signal is only part of the decision." : scenario.note;

  return (
    <div className="play-research" ref={ref}>
      <div className="play-project-caption"><span>01 / Trading research</span><p>I built a desk for questioning the data.</p><Link href="/projects/trading-research-desk">Inside the project <ArrowRight size={15} /></Link></div>
      <motion.div className="research-instrument" style={reducedMotion ? undefined : { rotate, y }}>
        <div className="research-instrument-top"><span><SlidersHorizontal size={14} /> RESEARCH / 01</span><span className={stale ? "research-light stale" : "research-light"}>{stale ? "SOURCE OLD" : "SOURCE READY"}</span></div>
        <div className="research-instrument-heading"><h3>Read between<br /><span>the signals.</span></h3><div><span>OBSERVATION</span><strong>{String(observation + 1).padStart(2, "0")}<small>/20</small></strong></div></div>
        <div className="research-scenarios" role="group" aria-label="Choose a fictional research scenario">{SCENARIOS.map((scenario, index) => <Button key={scenario.label} variant="ghost" aria-pressed={scenarioIndex === index} onClick={() => setScenarioIndex(index)}>{scenario.label}</Button>)}</div>
        <div className="research-chart-wrap">
          <svg viewBox="0 0 800 360" className="research-chart" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
            <title id={`${id}-title`}>{`${scenario.label}, fictional market pattern`}</title><desc id={`${id}-desc`}>Twenty invented observations. Use the scrubber to inspect the pattern. No live prices or return claims.</desc>
            <defs><clipPath id={`${id}-reveal`}><motion.rect x="0" y="0" width={reducedMotion ? 800 : clipWidth} height="360" /></clipPath><linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bdeb96" stopOpacity=".17" /><stop offset="100%" stopColor="#bdeb96" stopOpacity="0" /></linearGradient></defs>
            {[65, 125, 185, 245, 305].map((level) => <line key={level} x1="20" x2="780" y1={level} y2={level} stroke="#e5eee1" strokeOpacity=".08" />)}
            {[42, 190, 338, 486, 634, 745].map((x) => <line key={x} x1={x} x2={x} y1="35" y2="305" stroke="#e5eee1" strokeOpacity=".04" />)}
            <g clipPath={`url(#${id}-reveal)`} opacity={stale ? 0.28 : 1}>
              <motion.path animate={{ d: `${line} L745 305 L42 305Z` }} transition={{ duration: reducedMotion ? 0 : 0.65 }} fill={`url(#${id}-area)`} />
              {scenario.points.map((value, index) => {
                const previous = index ? scenario.points[index - 1] : value - 8;
                const up = value >= previous;
                const x = 42 + index * 37;
                return <g key={index}><motion.line animate={{ x1: x, x2: x, y1: 300 - Math.max(value, previous) - 14, y2: 300 - Math.min(value, previous) + 13 }} transition={{ duration: reducedMotion ? 0 : 0.6 }} stroke={up ? "#bdeb96" : "#e88a6d"} strokeWidth="1.5" /><motion.rect animate={{ x: x - 6, y: 300 - Math.max(value, previous), height: Math.max(4, Math.abs(value - previous)) }} transition={{ duration: reducedMotion ? 0 : 0.6 }} width="12" rx="1" fill={up ? "#bdeb96" : "#e88a6d"} /></g>;
              })}
              <motion.path animate={{ d: line }} transition={{ duration: reducedMotion ? 0 : 0.6 }} fill="none" stroke="#e9f5db" strokeWidth="1.5" strokeOpacity=".35" />
            </g>
            <motion.line animate={{ x1: selectedX, x2: selectedX }} transition={{ duration: reducedMotion ? 0 : 0.15 }} y1="30" y2="309" stroke="#fff8e6" strokeOpacity=".7" strokeDasharray="3 6" />
            <motion.circle animate={{ cx: selectedX, cy: selectedY }} transition={{ duration: reducedMotion ? 0 : 0.15 }} r="5" fill="#fbf5df" stroke="#12221f" strokeWidth="2" />
            <text x="25" y="342" fill="#92a69b" fontSize="11" fontFamily="monospace">START</text><text x="775" y="342" textAnchor="end" fill="#92a69b" fontSize="11" fontFamily="monospace">LATEST</text>
          </svg>
          {concentrated && <div className="research-exposure"><span>EXPOSURE</span><div><i /><i /><i /><i /><i /></div><strong>Concentrated</strong></div>}
        </div>
        <div className="research-scrubber"><label htmlFor={`${id}-scrub`}><ScanLine size={15} />Scrub through the pattern</label><input id={`${id}-scrub`} type="range" min="0" max="19" value={observation} onChange={(event) => setObservation(Number(event.target.value))} aria-valuetext={`Observation ${observation + 1} of 20`} /></div>
        <div className="research-controls" role="group" aria-label="Test the research assumptions">
          <Button variant="ghost" aria-pressed={stale} onClick={() => setStale(!stale)}><span className="research-toggle" /><span>Age the source</span></Button>
          <Button variant="ghost" aria-pressed={concentrated} onClick={() => setConcentrated(!concentrated)}><span className="research-toggle" /><span>Increase exposure</span></Button>
        </div>
        <p className="research-readout" aria-live="polite"><span>READOUT</span>{note}</p>
        <div className="research-instrument-bottom"><span>Synthetic data</span><span>Research illustration</span><span>Drag. Switch. Question.</span></div>
      </motion.div>
    </div>
  );
}

function NeighbourDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const mapId = useId().replaceAll(":", "");
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.4, 1], [4, 0, -2]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [70, 0, -35]);
  const request = REQUESTS[selected];

  return (
    <div className="play-neighbour" ref={ref}>
      <div className="play-project-caption"><span>02 / NeighbourHelper</span><p>A little help, a few streets away.</p><Link href="/projects/neighbourhelper">Inside the prototype <ArrowRight size={15} /></Link></div>
      <motion.div className="neighbour-atlas" style={reducedMotion ? undefined : { rotate, y }}>
        <div className="neighbour-map-heading"><div><HeartHandshake size={18} /><h3>Small favours.<br /><span>Closer connections.</span></h3></div><span>Fictional<br />neighbourhood</span></div>
        <div className="neighbour-map">
          <svg viewBox="0 0 760 420" aria-hidden="true">
            <defs><pattern id={`${mapId}-grain`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".6" fill="#526854" opacity=".12" /></pattern></defs>
            <rect width="760" height="420" fill="#e4e8d9" /><rect width="760" height="420" fill={`url(#${mapId}-grain)`} />
            <path d="M0 112H760 M0 330H760 M260 0V420 M430 0V420 M0 195H760" stroke="#fcfaf0" strokeWidth="18" fill="none" />
            <path d="M0 112H760 M0 330H760 M260 0V420 M430 0V420 M0 195H760" stroke="#cbd0be" strokeWidth="1" strokeDasharray="3 5" fill="none" />
            <rect x="468" y="222" width="240" height="60" rx="24" fill="#becfaf" /><path d="M495 251H680" stroke="#eaf0dd" strokeWidth="10" strokeLinecap="round" /><text x="583" y="257" textAnchor="middle" fill="#68805e" fontSize="10" letterSpacing="2" fontFamily="monospace">THE PARK</text>
            {[[48, 42], [128, 42], [304, 44], [493, 38], [650, 43], [54, 240], [145, 242], [310, 246], [54, 363], [146, 366], [318, 363], [490, 363], [641, 366], [71, 142], [161, 146], [317, 142], [496, 145], [653, 144]].map(([x, y], index) => <g key={index} transform={`translate(${x} ${y})`}><rect x="4" y="4" width="42" height="25" rx="2" fill="#233d2720" /><rect width="42" height="25" rx="2" fill={index % 3 ? "#a4b59b" : "#c6ad91"} stroke="#8d9c82" strokeWidth=".5" /><path d="M21 0V25" stroke="#f0eee0" strokeOpacity=".5" /></g>)}
            <path d={request.route} fill="none" stroke="#637855" strokeWidth="2" strokeDasharray="5 6" opacity=".35" />
            <motion.path key={`${request.id}-${stage}`} d={request.route} initial={{ pathLength: reducedMotion ? (stage ? 1 : 0) : 0 }} animate={{ pathLength: stage ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.2, ease: "easeInOut" }} fill="none" stroke="#355845" strokeWidth="5" strokeLinecap="round" />
            <circle cx="90" cy="330" r="20" fill="#fcfaf0" stroke="#344c3c" strokeWidth="1.5" /><text x="90" y="334" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#344c3c">V</text><text x="90" y="395" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#60705b">VOLUNTEER</text>
            {stage > 0 && <motion.circle key={request.id} initial={false} animate={{ cx: reducedMotion ? request.x : request.xs, cy: reducedMotion ? request.y : request.ys }} transition={{ duration: reducedMotion ? 0 : 1.2, ease: "easeInOut" }} r="6" fill="#fcfaf0" stroke="#355845" strokeWidth="3" />}
          </svg>
          {REQUESTS.map((item, index) => <Button key={item.id} variant="ghost" onClick={() => { setSelected(index); setStage(0); }} aria-pressed={selected === index} aria-label={`Select ${item.label.toLowerCase()} request`} className="neighbour-pin" style={{ left: `${item.x / 760 * 100}%`, top: `${item.y / 420 * 100}%` }}>{stage === 2 && selected === index ? <Check size={18} /> : item.pin}</Button>)}
        </div>
        <div className="neighbour-request-types" role="group" aria-label="Choose a fictional request">{REQUESTS.map((item, index) => <Button key={item.id} variant="ghost" aria-pressed={selected === index} onClick={() => { setSelected(index); setStage(0); }}><span>{item.pin}</span>{item.label}</Button>)}</div>
        <div className="neighbour-request"><div><span>{stage === 0 ? "FAMILY REQUEST" : stage === 1 ? "VOLUNTEER CONNECTED" : "FAMILY UPDATE"}</span><h4>{stage === 2 ? "One less thing to wonder about." : request.title}</h4><p aria-live="polite">{stage === 2 ? request.result : stage === 1 ? "A nearby volunteer has the details. Follow the request through." : request.detail}</p></div><Button onClick={() => setStage((stage + 1) % 3)} className="neighbour-next">{stage === 0 ? "Find a helping hand" : stage === 1 ? "Complete demo visit" : "Try again"}{stage === 2 ? <RotateCcw /> : <ArrowRight />}</Button></div>
        <div className="neighbour-stage-line" aria-label={`Step ${stage + 1} of 3`}>{["Family", "Volunteer", "Update"].map((name, index) => <span key={name} data-active={stage >= index}>{index < stage ? <Check size={11} /> : `0${index + 1}`}<span>{name}</span></span>)}</div>
      </motion.div>
    </div>
  );
}

export function PersonalPlayground() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const titleX = useTransform(scrollYProgress, [0, 1], [-32, 32]);
  return (
    <section id="off-the-clock" ref={ref} aria-labelledby="personal-playground-title" className="personal-playground">
      <header className="play-heading"><p>PERSONAL PROJECTS / CURIOUS BY DEFAULT</p><motion.h2 id="personal-playground-title" style={reducedMotion ? undefined : { x: titleX }}>Off the <span>clock.</span></motion.h2><p>Markets. Neighbours. Ideas I wanted to try.</p></header>
      <Tabs defaultValue="research" className="play-tabs">
        <TabsList aria-label="Explore a personal project" className="play-tabs-list"><TabsTrigger value="research"><TrendingUp size={16} />Trading research <span>01</span></TabsTrigger><TabsTrigger value="neighbour"><HeartHandshake size={16} />NeighbourHelper <span>02</span></TabsTrigger></TabsList>
        <TabsContent value="research"><ResearchDesk /></TabsContent><TabsContent value="neighbour"><NeighbourDemo /></TabsContent>
      </Tabs>
      <footer className="play-footer"><span>Made from curiosity.</span><span>Fictional demos. No live trades or care requests.</span></footer>
    </section>
  );
}
