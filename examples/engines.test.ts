import { describe, expect, it } from "vitest";
import {
  demoOdds,
  normalizeOdds,
  parseContentsOdds,
  rollFromOdds,
} from "./engines";

describe("normalizeOdds", () => {
  it("renormalizes when sum ≠ 1", () => {
    const r = normalizeOdds([
      { name: "A", chance: 2 },
      { name: "B", chance: 2 },
    ]);
    expect(r.wasRenormalized).toBe(true);
    expect(r.items[0]?.chance).toBeCloseTo(0.5);
    expect(r.items[1]?.chance).toBeCloseTo(0.5);
  });

  it("keeps demo odds near 1.0", () => {
    const r = normalizeOdds(demoOdds());
    expect(r.wasRenormalized).toBe(false);
    const sum = r.items.reduce((s, i) => s + i.chance, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
});

describe("parseContentsOdds", () => {
  it("parses standard percent labels", () => {
    const items = parseContentsOdds("65% Common - 20% Uncommon - 8% Rare");
    expect(items.map((i) => i.name)).toEqual([
      "Common",
      "Uncommon",
      "Rare",
    ]);
    expect(items[0]?.chance).toBeCloseTo(0.65);
  });

  it("handles typo form %1 Mythic", () => {
    const items = parseContentsOdds(
      "65% Common - 20% Uncommon - 8% Rare - 4% Epic - 2% Legendary - %1 Mythic"
    );
    const mythic = items.find((i) => /mythic/i.test(i.name));
    expect(mythic?.chance).toBeCloseTo(0.01);
  });
});

describe("rollFromOdds", () => {
  it("is deterministic for fixed u", () => {
    const items = demoOdds();
    expect(rollFromOdds(items, 0).item?.name).toBe("Common Item");
    expect(rollFromOdds(items, 0.7).item?.name).toBe("Rare Item");
    expect(rollFromOdds(items, 0.95).item?.name).toBe("Legendary Item");
  });
});
