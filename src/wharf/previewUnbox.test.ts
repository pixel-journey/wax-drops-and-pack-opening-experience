import { describe, expect, it } from "vitest";
import { previewUnbox } from "./previewUnbox";

describe("previewUnbox", () => {
  it("refuses more than one asset id (exact string)", () => {
    const r = previewUnbox({
      to: "atomicpacksx",
      assetIds: ["1", "2"],
      memo: "unbox",
    });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe("Only one pack can be opened at a time");
  });

  it("refuses wrong memo (exact string)", () => {
    const r = previewUnbox({
      to: "atomicpacksx",
      assetIds: ["1"],
      memo: "open",
    });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe("Invalid memo");
  });

  it("refuses locked pack (exact string)", () => {
    const r = previewUnbox({
      to: "atomicpacksx",
      assetIds: ["1"],
      memo: "unbox",
      unlocked: false,
    });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe("The pack has not unlocked yet");
  });

  it("accepts the happy path and notes RNG step", () => {
    const r = previewUnbox({
      to: "atomicpacksx",
      assetIds: ["1100003553120"],
      memo: "unbox",
      hasTemplate: true,
      packExistsForTemplate: true,
      unlocked: true,
    });
    expect(r.ok).toBe(true);
    expect(r.notes.some((n) => n.includes("requestrand"))).toBe(true);
  });
});
