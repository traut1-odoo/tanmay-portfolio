"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, HeartHandshake, RotateCcw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./personal-playground.css";
import { TradingTerminal } from "./trading-terminal";

const REQUESTS = [
  { id: "groceries", label: "Groceries", pin: "01", title: "A few groceries. A quick hello.", detail: "Bread, milk and fruit for someone at home.", result: "Everything on the list is home. We stayed for a quick chat.", x: 590, y: 112, route: "M90 330 H260 V112 H590", xs: [90, 260, 260, 590], ys: [330, 330, 112, 112] },
  { id: "walk", label: "A short walk", pin: "02", title: "A little company outdoors.", detail: "A gentle walk around the neighbourhood park.", result: "Back from the park. A short walk and a good conversation.", x: 570, y: 304, route: "M90 330 H430 V304 H570", xs: [90, 260, 430, 430, 570], ys: [330, 330, 330, 304, 304] },
  { id: "visit", label: "A check-in", pin: "03", title: "Sometimes, just showing up helps.", detail: "A friendly visit and an update for family.", result: "Dropped by for tea. Everything is fine at home.", x: 365, y: 195, route: "M90 330 H260 V195 H365", xs: [90, 260, 260, 365], ys: [330, 330, 195, 195] },
];

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
        <TabsList aria-label="Explore a personal project" className="play-tabs-list"><TabsTrigger value="research"><TrendingUp size={16} />Trading system <span>01</span></TabsTrigger><TabsTrigger value="neighbour"><HeartHandshake size={16} />NeighbourHelper <span>02</span></TabsTrigger></TabsList>
        <TabsContent value="research"><TradingTerminal /></TabsContent><TabsContent value="neighbour"><NeighbourDemo /></TabsContent>
      </Tabs>
      <footer className="play-footer"><span>Made from curiosity.</span><span>Fictional demos. No live trades or care requests.</span></footer>
    </section>
  );
}
