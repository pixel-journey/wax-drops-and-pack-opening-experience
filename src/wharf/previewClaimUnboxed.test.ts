import { describe, expect, it } from "vitest";
import { previewClaimUnboxed } from "./previewClaimUnboxed";

describe("previewClaimUnboxed", () => {
  it("refuses missing unboxpack (exact string)", () => {
    const r = previewClaimUnboxed({
      packAssetId: "1",
      originRollIds: ["0"],
      unboxpackExists: false,
    });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe("No unboxpack with this pack asset id exists");
  });

  it("refuses empty origin_roll_ids (exact string)", () => {
    const r = previewClaimUnboxed({
      packAssetId: "1",
      originRollIds: [],
      unboxpackExists: true,
      authorized: true,
    });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe("The original roll ids vector can't be empty");
  });

  it("refuses missing roll (exact interpolated string)", () => {
    const r = previewClaimUnboxed({
      packAssetId: "1",
      originRollIds: ["2"],
      unboxpackExists: true,
      authorized: true,
      rollsPresent: { "2": false },
    });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe("No unbox asset with the origin roll id 2 exists");
  });

  it("marks template -1 as skip (no mint)", () => {
    const r = previewClaimUnboxed({
      packAssetId: "1",
      originRollIds: ["0", "1"],
      unboxpackExists: true,
      authorized: true,
      rollsPresent: { "0": true, "1": true },
      rollTemplates: { "0": 100, "1": -1 },
    });
    expect(r.ok).toBe(true);
    expect(r.mints).toEqual(["0"]);
    expect(r.skips).toEqual(["1"]);
  });
});
