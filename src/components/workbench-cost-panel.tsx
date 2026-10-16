"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAMPLE_PARTS, SAMPLE_OPERATIONS, INITIAL_TOTAL_CENTS, formatCost, type CostInputs, type CostBreakdown, type PartId, type OperationId } from "@/lib/workbench-costs";

type Props = {
  mode: number;
  inputs: CostInputs;
  costs: CostBreakdown;
  partId: PartId;
  operationId: OperationId;
  onPart: (id: PartId) => void;
  onOperation: (id: OperationId) => void;
  onUnitCost: (id: PartId, value: number) => void;
  onMinutes: (id: OperationId, value: number) => void;
  onHourlyRate: (id: OperationId, value: number) => void;
  onMode: (mode: number) => void;
  onReset: () => void;
};

function CostSlider({ label, value, max, step = 1, display, onChange }: { label: string; value: number; max: number; step?: number; display: string; onChange: (value: number) => void }) {
  return <label className="cost-slider"><span>{label}<span className="cost-slider-value">{display}</span></span><input type="range" min="0" max={max} step={step} value={value} aria-label={label} aria-valuetext={display} onChange={event => onChange(Number(event.target.value))} /></label>;
}

export function WorkbenchCostPanel(props: Props) {
  const { mode, inputs, costs, partId, operationId, onPart, onOperation, onUnitCost, onMinutes, onHourlyRate, onMode, onReset } = props;
  const reduced = useReducedMotion();
  const part = SAMPLE_PARTS.find(item => item.id === partId)!;
  const operation = SAMPLE_OPERATIONS.find(item => item.id === operationId)!;
  const partCost = costs.materialLines.find(item => item.id === partId)!.amountCents;
  const operationCost = costs.operationLines.find(item => item.id === operationId)!.amountCents;
  const difference = costs.totalCents - INITIAL_TOTAL_CENTS;
  const materialShare = costs.totalCents === 0 ? 0 : costs.materialsCents / costs.totalCents * 100;

  return <div className="workbench-cost-panel">
    <div className="cost-panel-top"><span>EXAMPLE / ONE STAND / USD</span><Button variant="ghost" onClick={onReset} aria-label="Reset all example costs"><RotateCcw size={13} />Reset costs</Button></div>
    <div className="cost-editor">
      {mode === 0 && <div className="cost-materials">
        <p className="cost-instruction">Pick a part. Change its purchase cost.</p>
        <div className="cost-part-picker" role="group" aria-label="Select a costed part">{SAMPLE_PARTS.map(item => <Button key={item.id} variant="ghost" aria-pressed={partId === item.id} onClick={() => onPart(item.id)}><span>{item.name}<small>{item.quantity} {item.quantity === 1 ? "piece" : "pieces"}</small></span><strong>{formatCost(costs.materialLines.find(line => line.id === item.id)!.amountCents)}</strong></Button>)}</div>
        <div className="cost-selection"><span>{part.name}</span><span>{part.material}</span></div>
        <CostSlider label={`${part.name} unit cost`} value={inputs.unitCosts[partId]} max={part.maxUnitCost} step={0.25} display={formatCost(inputs.unitCosts[partId] * 100)} onChange={value => onUnitCost(partId, value)} />
        <div className="cost-equation"><span>{part.quantity} × {formatCost(inputs.unitCosts[partId] * 100)}</span><ArrowRight size={14} /><strong>{formatCost(partCost)}</strong><span>per stand</span></div>
        <p className="cost-footnote">Customer device is shown for context. It is excluded from this stand’s bill of materials.</p>
      </div>}
      {mode === 1 && <div className="cost-operations">
        <p className="cost-instruction">Follow the work. Change the time or rate.</p>
        <div className="cost-operation-picker" role="group" aria-label="Select a production operation">{SAMPLE_OPERATIONS.map((item, index) => <Button key={item.id} variant="ghost" aria-pressed={operationId === item.id} onClick={() => onOperation(item.id)}><span>0{index + 1}</span><strong>{item.name}</strong><small>{inputs.minutes[item.id]} min</small></Button>)}</div>
        <div className="cost-selection"><span>{operation.name}</span><span>{operation.workCentre}</span></div>
        <CostSlider label={`${operation.name} time per stand`} value={inputs.minutes[operationId]} max={40} display={`${inputs.minutes[operationId]} min`} onChange={value => onMinutes(operationId, value)} />
        <CostSlider label={`${operation.name} hourly rate`} value={inputs.hourlyRates[operationId]} max={120} display={`${formatCost(inputs.hourlyRates[operationId] * 100)} / hour`} onChange={value => onHourlyRate(operationId, value)} />
        <div className="cost-equation"><span>{inputs.minutes[operationId]} ÷ 60 × {formatCost(inputs.hourlyRates[operationId] * 100)}</span><ArrowRight size={14} /><strong>{formatCost(operationCost)}</strong></div>
        <p className="cost-footnote">Minutes per stand. Work-centre rates include labour and allocated overhead.</p>
      </div>}
      {mode === 2 && <div className="cost-picture">
        <p className="cost-instruction">Every part. Every operation. One cost.</p>
        <div className="cost-ledger">
          <div><Button variant="ghost" onClick={() => onMode(0)}>Materials <ArrowRight size={13} /></Button><strong>{formatCost(costs.materialsCents)}</strong></div>
          {SAMPLE_PARTS.map(item => <div key={item.id} className="cost-ledger-line"><span>{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</span><span>{formatCost(costs.materialLines.find(line => line.id === item.id)!.amountCents)}</span></div>)}
          <div className="cost-ledger-section"><Button variant="ghost" onClick={() => onMode(1)}>Operations <ArrowRight size={13} /></Button><strong>{formatCost(costs.operationsCents)}</strong></div>
          {SAMPLE_OPERATIONS.map(item => <div key={item.id} className="cost-ledger-line"><span>{item.name}<small>{inputs.minutes[item.id]} min</small></span><span>{formatCost(costs.operationLines.find(line => line.id === item.id)!.amountCents)}</span></div>)}
        </div>
        <div className="cost-what-if"><p>What if assembly took five minutes longer?</p><Button variant="ghost" disabled={inputs.minutes.assembly > 35} onClick={() => onMinutes("assembly", inputs.minutes.assembly + 5)}>Add 5 minutes <ArrowRight size={14} /></Button></div>
      </div>}
    </div>
    <div className="cost-running-total">
      <div className="cost-total-heading"><div><span>PRODUCTION COST / STAND</span><strong aria-live="polite" aria-atomic="true">{formatCost(costs.totalCents)}</strong></div><div className="cost-change"><span>{difference === 0 ? "Starting example" : `${difference > 0 ? "+" : "−"}${formatCost(Math.abs(difference))}`}</span><small>{difference === 0 ? "Adjust an input to explore" : `vs. ${formatCost(INITIAL_TOTAL_CENTS)} starting cost`}</small></div></div>
      <div className="cost-share-bar" role="img" aria-label={`Materials ${formatCost(costs.materialsCents)} plus operations ${formatCost(costs.operationsCents)} equals ${formatCost(costs.totalCents)}`}><motion.span className="cost-material-share" animate={{ width: `${materialShare}%` }} transition={{ duration: reduced ? 0 : 0.25 }} /><motion.span className="cost-operation-share" animate={{ width: `${costs.totalCents === 0 ? 0 : 100 - materialShare}%` }} transition={{ duration: reduced ? 0 : 0.25 }} /></div>
      <div className="cost-share-key"><span><i />Materials {formatCost(costs.materialsCents)}</span><span><i />Operations {formatCost(costs.operationsCents)}</span></div>
    </div>
    <p className="cost-example-label">Illustrative costs, not Heckler pricing or a live Odoo calculation.</p>
  </div>;
}
