import { describe, expect, it } from "vitest";
import { suggestStackFromAccounts } from "./stackDetect";

describe("suggestStackFromAccounts", () => {
  it("detects atomicpacksx as high confidence", () => {
    const s = suggestStackFromAccounts(["pixeljourney", "atomicpacksx"]);
    expect(s.stackId).toBe("atomic-packs");
    expect(s.presetId).toBe("atomic-packs");
    expect(s.confidence).toBe("high");
  });

  it("detects neftyblocksp", () => {
    const s = suggestStackFromAccounts(["neftyblocksp", "neftyblocksd"]);
    expect(s.stackId).toBe("nefty-packs");
    expect(s.confidence).toBe("high");
  });

  it("detects nfthivepacks", () => {
    const s = suggestStackFromAccounts(["nfthivepacks"]);
    expect(s.stackId).toBe("hive-packs");
  });

  it("returns unknown when empty", () => {
    const s = suggestStackFromAccounts([]);
    expect(s.stackId).toBe("unknown");
    expect(s.presetId).toBeNull();
  });
});
