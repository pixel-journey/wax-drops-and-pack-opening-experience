/**
 * Pure drop/pack probability helpers — no network, no wallet.
 */

import type { ProbabilityItem } from "./types";

export interface NormalizedOdds {
  items: ProbabilityItem[];
  /** Sum of input chances before normalization (may be ≠ 1) */
  rawSum: number;
  /** True if rawSum was outside [0.99, 1.01] */
  wasRenormalized: boolean;
  methodologyNote: string;
}

/** Clamp negative to 0; renormalize so chances sum to 1 when possible. */
export function normalizeOdds(items: ProbabilityItem[]): NormalizedOdds {
  const cleaned = items.map((it) => ({
    ...it,
    chance: Number.isFinite(it.chance) ? Math.max(0, it.chance) : 0,
  }));
  const rawSum = cleaned.reduce((s, it) => s + it.chance, 0);
  if (rawSum <= 0) {
    return {
      items: cleaned.map((it) => ({ ...it, chance: 0 })),
      rawSum,
      wasRenormalized: false,
      methodologyNote: "All chances zero or invalid — cannot normalize.",
    };
  }
  const wasRenormalized = rawSum < 0.99 || rawSum > 1.01;
  const itemsOut = cleaned.map((it) => ({
    ...it,
    chance: it.chance / rawSum,
  }));
  return {
    items: itemsOut,
    rawSum,
    wasRenormalized,
    methodologyNote: wasRenormalized
      ? `Input sum was ${rawSum.toFixed(4)}; renormalized to 1.0 for fair display/roll.`
      : "Input probabilities already sum ≈ 1.0.",
  };
}

/**
 * Parse human pack "contents" strings like:
 * "65% Common - 20% Uncommon - 8% Rare" or typo forms "%1 Mythic".
 */
export function parseContentsOdds(text: string): ProbabilityItem[] {
  if (!text || typeof text !== "string") return [];
  const items: ProbabilityItem[] = [];
  // Match: 65% Common | %1 Mythic | 1% Mythic
  const re =
    /(?:(\d+(?:\.\d+)?)\s*%\s*([A-Za-z][\w\s-]*)|%\s*(\d+(?:\.\d+)?)\s*([A-Za-z][\w\s-]*))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const pct = m[1] ?? m[3];
    const name = (m[2] ?? m[4] ?? "").trim().replace(/[-–—]+$/, "").trim();
    if (!pct || !name) continue;
    const chance = Number(pct) / 100;
    if (!Number.isFinite(chance)) continue;
    items.push({ name, chance });
  }
  return items;
}

/** Deterministic roll: pick index from cumulative odds using u in [0,1). */
export function rollFromOdds(
  items: ProbabilityItem[],
  u: number
): { index: number; item: ProbabilityItem | null } {
  const { items: norm } = normalizeOdds(items);
  if (norm.length === 0 || norm.every((i) => i.chance <= 0)) {
    return { index: -1, item: null };
  }
  const x = Math.min(Math.max(u, 0), 0.999999999);
  let acc = 0;
  for (let i = 0; i < norm.length; i++) {
    acc += norm[i].chance;
    if (x < acc) return { index: i, item: norm[i] };
  }
  const last = norm.length - 1;
  return { index: last, item: norm[last] };
}

/** Demo table matching educational common/rare/legendary split. */
export function demoOdds(): ProbabilityItem[] {
  return [
    { name: "Common Item", chance: 0.6, color: "#22c55e" },
    { name: "Rare Item", chance: 0.3, color: "#eab308" },
    { name: "Legendary Item", chance: 0.1, color: "#a855f7" },
  ];
}

export function formatChancePct(chance: number, digits = 1): string {
  return `${(chance * 100).toFixed(digits)}%`;
}
