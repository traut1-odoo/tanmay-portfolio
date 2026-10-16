import assert from "node:assert/strict";
import test from "node:test";
import { calculateCosts, formatCost, INITIAL_TOTAL_CENTS, makeInitialCosts } from "./workbench-costs";

test("sample totals reconcile to $72 and 30 operation minutes", () => {
  const costs = calculateCosts(makeInitialCosts());
  assert.equal(costs.materialsCents, 4800);
  assert.equal(costs.operationsCents, 2400);
  assert.equal(costs.totalCents, 7200);
  assert.equal(costs.totalMinutes, 30);
  assert.equal(INITIAL_TOTAL_CENTS, 7200);
  assert.equal(formatCost(costs.totalCents), "$72.00");
});

test("zero unit costs and times produce zero costs", () => {
  const inputs = makeInitialCosts();
  inputs.unitCosts = { base: 0, upright: 0, bracket: 0, bolts: 0 };
  inputs.minutes = { fabrication: 0, finishing: 0, assembly: 0 };
  const costs = calculateCosts(inputs);
  assert.equal(costs.totalCents, 0);
  assert.equal(costs.totalMinutes, 0);
  assert.ok([...costs.materialLines, ...costs.operationLines].every((line) => line.amountCents === 0));
});

test("fastener unit-cost changes apply to all four pieces", () => {
  const inputs = makeInitialCosts();
  inputs.unitCosts.bolts = 1.25;
  const costs = calculateCosts(inputs);
  assert.equal(costs.materialLines.find((line) => line.id === "bolts")?.amountCents, 500);
  assert.equal(costs.totalCents - INITIAL_TOTAL_CENTS, 200);
});

test("five more assembly minutes at $36/hour add exactly $3", () => {
  const inputs = makeInitialCosts();
  inputs.minutes.assembly += 5;
  const costs = calculateCosts(inputs);
  assert.equal(costs.totalCents - INITIAL_TOTAL_CENTS, 300);
  assert.equal(costs.totalMinutes, 35);
});

test("round each extended line once, then sum the displayed cents", () => {
  const inputs = makeInitialCosts();
  inputs.unitCosts = { base: 1.005, upright: 0, bracket: 0, bolts: 0.333 };
  inputs.minutes = { fabrication: 1, finishing: 1, assembly: 1 };
  inputs.hourlyRates = { fabrication: 1, finishing: 1, assembly: 1 };
  const costs = calculateCosts(inputs);
  assert.equal(costs.materialLines.find((line) => line.id === "base")?.amountCents, 101);
  assert.equal(costs.materialLines.find((line) => line.id === "bolts")?.amountCents, 133);
  assert.deepEqual(costs.operationLines.map((line) => line.amountCents), [2, 2, 2]);
  assert.equal(costs.materialsCents, 234);
  assert.equal(costs.operationsCents, 6);
  assert.equal(costs.totalCents, 240);
  assert.equal(costs.totalCents, [...costs.materialLines, ...costs.operationLines].reduce((sum, line) => sum + line.amountCents, 0));
});

test("invalid and negative inputs become zero without offsetting other lines", () => {
  const inputs = makeInitialCosts();
  inputs.unitCosts = { base: Number.NaN, upright: Number.POSITIVE_INFINITY, bracket: -9, bolts: 0.75 };
  inputs.minutes = { fabrication: -12, finishing: Number.NaN, assembly: 10 };
  inputs.hourlyRates = { fabrication: 60, finishing: 45, assembly: Number.NEGATIVE_INFINITY };
  const costs = calculateCosts(inputs);
  assert.equal(costs.materialsCents, 300);
  assert.equal(costs.operationsCents, 0);
  assert.equal(costs.totalCents, 300);
  assert.equal(costs.totalMinutes, 10);
});

test("initial inputs are independent mutable copies", () => {
  const first = makeInitialCosts();
  const second = makeInitialCosts();
  first.unitCosts.base = 0;
  first.minutes.assembly = 0;
  first.hourlyRates.finishing = 0;
  assert.equal(calculateCosts(second).totalCents, INITIAL_TOTAL_CENTS);
});
