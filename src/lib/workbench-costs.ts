export type PartId = "base" | "upright" | "bracket" | "bolts";
export type OperationId = "fabrication" | "finishing" | "assembly";

export interface SamplePart {
  readonly id: PartId;
  readonly name: string;
  readonly material: string;
  readonly quantity: number;
  readonly unitCost: number;
  readonly maxUnitCost: number;
}

export interface SampleOperation {
  readonly id: OperationId;
  readonly name: string;
  readonly workCentre: string;
  readonly minutes: number;
  readonly hourlyRate: number;
  readonly partIds: readonly PartId[];
}

export const SAMPLE_PARTS: readonly SamplePart[] = [
  { id: "base", name: "Base plate", material: "Steel plate", quantity: 1, unitCost: 22, maxUnitCost: 60 },
  { id: "upright", name: "Support", material: "Steel section", quantity: 1, unitCost: 14, maxUnitCost: 45 },
  { id: "bracket", name: "Mount plate", material: "Steel", quantity: 1, unitCost: 9, maxUnitCost: 30 },
  { id: "bolts", name: "Fasteners", material: "Steel", quantity: 4, unitCost: 0.75, maxUnitCost: 3 },
];

export const SAMPLE_OPERATIONS: readonly SampleOperation[] = [
  { id: "fabrication", name: "Fabrication", workCentre: "Fabrication", minutes: 12, hourlyRate: 60, partIds: ["base", "upright", "bracket"] },
  { id: "finishing", name: "Finishing", workCentre: "Powder coating", minutes: 8, hourlyRate: 45, partIds: ["base", "upright", "bracket"] },
  { id: "assembly", name: "Assembly", workCentre: "Assembly bench", minutes: 10, hourlyRate: 36, partIds: ["base", "upright", "bracket", "bolts"] },
];

export interface CostInputs {
  unitCosts: Record<PartId, number>;
  minutes: Record<OperationId, number>;
  hourlyRates: Record<OperationId, number>;
}

export interface CostLine<Id extends string> {
  id: Id;
  amountCents: number;
}

export interface CostBreakdown {
  materialLines: CostLine<PartId>[];
  operationLines: CostLine<OperationId>[];
  materialsCents: number;
  operationsCents: number;
  totalCents: number;
  totalMinutes: number;
}

export function makeInitialCosts(): CostInputs {
  return {
    unitCosts: Object.fromEntries(SAMPLE_PARTS.map((part) => [part.id, part.unitCost])) as Record<PartId, number>,
    minutes: Object.fromEntries(SAMPLE_OPERATIONS.map((operation) => [operation.id, operation.minutes])) as Record<OperationId, number>,
    hourlyRates: Object.fromEntries(SAMPLE_OPERATIONS.map((operation) => [operation.id, operation.hourlyRate])) as Record<OperationId, number>,
  };
}

function nonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function toCents(amount: number): number {
  // Round the extended line, not the unit price or each intermediate step.
  return Math.round((nonNegative(amount) + Number.EPSILON) * 100);
}

export function calculateCosts(inputs: CostInputs): CostBreakdown {
  const materialLines = SAMPLE_PARTS.map(({ id, quantity }) => ({
    id,
    amountCents: toCents(quantity * nonNegative(inputs.unitCosts[id])),
  }));
  const operationLines = SAMPLE_OPERATIONS.map(({ id }) => ({
    id,
    amountCents: toCents(nonNegative(inputs.minutes[id]) * nonNegative(inputs.hourlyRates[id]) / 60),
  }));
  const materialsCents = materialLines.reduce((sum, line) => sum + line.amountCents, 0);
  const operationsCents = operationLines.reduce((sum, line) => sum + line.amountCents, 0);

  return {
    materialLines,
    operationLines,
    materialsCents,
    operationsCents,
    totalCents: materialsCents + operationsCents,
    totalMinutes: SAMPLE_OPERATIONS.reduce((sum, { id }) => sum + nonNegative(inputs.minutes[id]), 0),
  };
}

export const INITIAL_TOTAL_CENTS = calculateCosts(makeInitialCosts()).totalCents;

const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCost(cents: number): string {
  return usdFormatter.format(cents / 100);
}
