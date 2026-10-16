"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ChevronRight, Play, Terminal, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./trading-terminal.css";

// Public-facing reconstruction of the repository's workflow. All observations
// below are invented fixtures; the portfolio never calls trading APIs.
const pipeline = [
  { title: "Market snapshot", output: "Prices, indicators and source health", module: "data_fetch.py" },
  { title: "Universe scan", output: "Stock and ETF research queues", module: "scan_universe.py" },
  { title: "Ticker deep dive", output: "Eight lenses, with reasons attached", module: "deepdive.py" },
  { title: "Portfolio risk", output: "Concentration, beta and portfolio heat", module: "portfolio_risk.py" },
  { title: "Morning briefing", output: "Priorities delivered to CLI + dashboard", module: "morning_run.py" },
];

const lenses = ["Technicals", "Momentum", "Fundamentals", "News", "News quality", "Community", "Insiders", "Squeeze context"];
const samples = [
  {
    symbol: "DEMO-A", name: "Fresh catalyst", status: "REVIEW", tone: "blue",
    values: ["Candidate", "Improving", "Growing", "Positive", "Fresh", "Mixed", "Buying", "None"],
    notes: ["Technical conditions put this fictional company on the research list.", "Short and longer windows are compared instead of treating one good day as a trend.", "Growth, margins, cash flow and valuation add business context.", "The sample announcement supports the existing thesis.", "A primary source is recent, and the sample move has not already run far.", "Social signals disagree. Their source remains visible in the report.", "A sample open-market purchase adds evidence beyond the headline.", "No squeeze setup in this example. Context is kept separate from the score."],
    reason: "Several lenses support a closer look. The report keeps the evidence beside the conclusion.",
  },
  {
    symbol: "DEMO-B", name: "The headline already ran", status: "CHASE FLAG", tone: "amber",
    values: ["Extended", "Sharp jump", "Mixed", "Positive", "Already priced", "Bullish", "None", "Armed"],
    notes: ["The technical picture is extended in this fictional snapshot.", "The jump happened before this briefing was assembled.", "The headline does not resolve every question about the business.", "Positive coverage alone is not the entire analysis.", "The news-quality check flags a move that may already be reflected in price.", "High enthusiasm appears alongside the timing warning, rather than erasing it.", "No supporting insider event appears in this sample.", "A squeeze setup describes possible volatility. It is not a direction forecast."],
    reason: "Positive news can still arrive too late. The source and priced-in check make that conflict visible.",
  },
  {
    symbol: "DEMO-C", name: "Evidence missing", status: "INCOMPLETE", tone: "muted",
    values: ["Unavailable", "Mixed", "Available", "Neutral", "No catalyst", "Unavailable", "None", "None"],
    notes: ["The technical provider failed in this example. The report preserves the missing input.", "The available windows do not agree.", "Fundamentals are still readable even though another lens failed.", "No thesis-changing headline appears in this sample.", "There is no qualifying news event to assess for timing.", "The community source is unavailable. Missing data is not shown as a neutral score.", "No insider signal is available in this sample.", "No setup is reported in the available data."],
    reason: "A partial report should look partial. Failed sources stay visible so a polished result cannot hide the gap.",
  },
];

export function TradingTerminal() {
  const reduced = useReducedMotion();
  const [view, setView] = useState("briefing");
  const [phase, setPhase] = useState(5);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(0);
  const [lens, setLens] = useState(4);
  const [concentration, setConcentration] = useState(28);
  const [stale, setStale] = useState(false);
  const sample = samples[selected];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setPhase(value => Math.min(5, value + 1)), 440);
    const end = window.setTimeout(() => setRunning(false), 2300);
    return () => { window.clearInterval(timer); window.clearTimeout(end); };
  }, [running]);

  const runBriefing = () => {
    setView("briefing");
    if (reduced) { setPhase(5); return; }
    setPhase(0);
    setRunning(true);
  };

  return (
    <div className="trading-project">
      <div className="trading-story">
        <div><span className="trading-kicker">01 / TANMAY TRADING SYSTEM</span><h3>I built my own<br />trading desk.</h3></div>
        <div><p>A morning briefing, market scanners and a research trail I can inspect. Python does the analysis. A React dashboard puts it in reach.</p><Link href="/projects/trading-research-desk">See how it works <ArrowUpRight size={16} /></Link></div>
      </div>
      <div className="trading-terminal">
        <div className="trading-terminal-bar"><span><Terminal size={16} /> TANMAY / TRADING</span><span className="trading-demo-badge">INTERACTIVE RECONSTRUCTION</span></div>
        <div className="trading-facts"><span><strong>13</strong> dashboard views</span><span><strong>8</strong> research lenses</span><span>Python <ChevronRight size={12} /> FastAPI <ChevronRight size={12} /> React</span></div>
        <Tabs value={view} onValueChange={setView} className="trading-tabs">
          <TabsList aria-label="Trading system demo views" className="trading-tabs-list">
            <TabsTrigger value="briefing">01 <span>Morning run</span></TabsTrigger>
            <TabsTrigger value="deepdive">02 <span>Deep dive</span></TabsTrigger>
            <TabsTrigger value="checks">03 <span>Risk & checks</span></TabsTrigger>
          </TabsList>
          <TabsContent value="briefing" className="trading-tab-content">
            <div className="trading-command"><code><span>$</span> python morning_run.py</code><Button variant="ghost" disabled={running} onClick={runBriefing}>{running ? "Running sample…" : "Replay sample run"}{running ? <span className="trading-running-dot" /> : <Play size={12} />}</Button></div>
            <div className="trading-brief-layout">
              <ol className="trading-pipeline" aria-label="Morning briefing pipeline">
                {pipeline.map((item, i) => <li key={item.title} data-complete={phase > i} data-running={running && phase === i}>
                  <span className="trading-pipeline-mark">{phase > i ? <Check size={12} /> : `0${i + 1}`}</span>
                  <div><strong>{item.title}</strong><p>{item.output}</p></div>
                </li>)}
              </ol>
              <div className="trading-queue">
                <div className="trading-panel-label"><span>RESEARCH QUEUE</span><span>3 sample cases</span></div>
                <div className="trading-queue-rows">{samples.map((item, i) => <motion.div key={item.symbol} initial={false} animate={{ opacity: phase >= 3 ? 1 : 0.25, x: phase >= 3 || reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.07 }}>
                  <Button variant="ghost" onClick={() => { setSelected(i); setLens(4); setView("deepdive"); }} className="trading-queue-row"><span><strong>{item.symbol}</strong><small>{item.name}</small></span><span className="trading-signal" data-tone={item.tone}>{item.status}</span><ArrowUpRight size={14} /></Button>
                </motion.div>)}</div>
                <div className="trading-run-readout" role="status"><span className="trading-status-light" />{running ? `${phase} / 5 stages complete` : "Sample briefing ready. Pick a case to inspect."}</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="deepdive" className="trading-tab-content">
            <div className="trading-case-select" role="group" aria-label="Choose a fictional research case">{samples.map((item, i) => <Button key={item.symbol} variant="ghost" aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.symbol}<span className="trading-case-dot" data-tone={item.tone} /></Button>)}</div>
            <div className="trading-evidence-layout">
              <div className="trading-lenses" role="group" aria-label="Inspect a research lens">{lenses.map((name, i) => <Button key={name} variant="ghost" aria-pressed={lens === i} onClick={() => setLens(i)}><span>{name}</span><strong>{sample.values[i]}</strong><ChevronRight size={12} /></Button>)}</div>
              <div className="trading-evidence">
                <div className="trading-panel-label"><span>{sample.symbol} / EVIDENCE</span><span className="trading-signal" data-tone={sample.tone}>{sample.status}</span></div>
                <AnimatePresence mode="wait" initial={false}><motion.div key={`${selected}-${lens}`} initial={{ opacity: 0, y: reduced ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.15 }} className="trading-lens-detail" aria-live="polite"><span>0{lens + 1} / {lenses[lens]}</span><h4>{sample.values[lens]}</h4><p>{sample.notes[lens]}</p></motion.div></AnimatePresence>
                <div className="trading-reason"><span>THE REASONING</span><p>{sample.reason}</p></div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="checks" className="trading-tab-content">
            <div className="trading-checks-layout">
              <div className="trading-risk">
                <div className="trading-panel-label"><span>POSITION CONCENTRATION</span><span>SAMPLE PORTFOLIO</span></div>
                <div className="trading-risk-number"><strong>{concentration}<small>%</small></strong><span>in one position</span></div>
                <div className="trading-risk-meter"><motion.span animate={{ width: `${concentration}%` }} transition={{ duration: reduced ? 0 : 0.15 }} data-flagged={concentration > 40} /><i style={{ left: "40%" }} /></div>
                <label className="trading-risk-slider">Change the allocation<input type="range" min="10" max="70" value={concentration} onChange={event => setConcentration(Number(event.target.value))} aria-valuetext={`${concentration} percent in one fictional position`} /></label>
                <p className="trading-risk-readout" aria-live="polite">{concentration > 40 ? <TriangleAlert size={15} /> : <Check size={15} />}{concentration > 40 ? "Concentration flag triggered." : "Within this concentration threshold."}</p>
                <p className="trading-small">This reproduces the repo’s single-position check at more than 40%. Other risk checks run separately.</p>
              </div>
              <div className="trading-health">
                <div className="trading-panel-label"><span>DON’T HIDE THE FAILURE</span><span>HEALTH CHECKS</span></div>
                <Button variant="ghost" className="trading-stale-toggle" aria-pressed={stale} onClick={() => setStale(!stale)}><span className="trading-switch" />Simulate stale data</Button>
                <ul><li data-warning={stale}>{stale ? <TriangleAlert size={14} /> : <Check size={14} />}<span>Data freshness</span><strong>{stale ? "REVIEW" : "PASS"}</strong></li><li><Check size={14} /><span>Forward logs</span><strong>PASS</strong></li><li><Check size={14} /><span>Background job</span><strong>PASS</strong></li></ul>
                <p aria-live="polite">{stale ? "The sample freshness check flags old input. A finished report should not conceal a stale source." : "The system checks its inputs and jobs alongside the research."}</p>
              </div>
            </div>
            <div className="trading-validation"><span>HISTORICAL VALIDATION</span><div><i>In sample</i><b /> <i>Out of sample</i></div><p>Separate tools compare sizing, test stress periods and check whether results survive outside the tuning window.</p></div>
          </TabsContent>
        </Tabs>
        <div className="trading-terminal-footer"><span>Fictional tickers & data. No brokerage connection.</span><span>CLI + WEB DASHBOARD</span></div>
      </div>
    </div>
  );
}
