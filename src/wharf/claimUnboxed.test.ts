import { describe, expect, it } from "vitest";
import {
  ATOMIC_PACKS_ACCOUNT,
  buildClaimUnboxedAction,
  claimUnboxedWithSession,
  formatClaimUnboxedSummary,
} from "./claimUnboxed";
import type { SessionLike } from "./types";

describe("buildClaimUnboxedAction", () => {
  it("builds atomicpacksx claimunboxed payload", () => {
    const action = buildClaimUnboxedAction({
      packAssetId: "1100003553120",
      originRollIds: [0, 1],
    });
    expect(action.account).toBe(ATOMIC_PACKS_ACCOUNT);
    expect(action.name).toBe("claimunboxed");
    expect(action.data.pack_asset_id).toBe("1100003553120");
    expect(action.data.origin_roll_ids).toEqual(["0", "1"]);
  });

  it("rejects empty rolls", () => {
    expect(() =>
      buildClaimUnboxedAction({ packAssetId: "1", originRollIds: [] })
    ).toThrow(/origin_roll_ids/);
  });

  it("attaches authorization when provided", () => {
    const action = buildClaimUnboxedAction(
      { packAssetId: "1", originRollIds: [0] },
      { actor: "alice.wam", permission: "active" }
    );
    expect(action.authorization?.[0]).toEqual({
      actor: "alice.wam",
      permission: "active",
    });
  });
});

describe("claimUnboxedWithSession", () => {
  it("calls session.transact with built action", async () => {
    const calls: unknown[] = [];
    const session: SessionLike = {
      actor: "bob.wam",
      permission: "active",
      async transact(args) {
        calls.push(args);
        return { transaction_id: "abc123" };
      },
    };
    const result = await claimUnboxedWithSession(session, {
      packAssetId: 42,
      originRollIds: [0],
    });
    expect(result.transactionId).toBe("abc123");
    expect(calls).toHaveLength(1);
    const args = calls[0] as { actions: { name: string; data: { pack_asset_id: string } }[] };
    expect(args.actions[0].name).toBe("claimunboxed");
    expect(args.actions[0].data.pack_asset_id).toBe("42");
  });
});

describe("formatClaimUnboxedSummary", () => {
  it("includes contract and ids", () => {
    const s = formatClaimUnboxedSummary({
      packAssetId: "9",
      originRollIds: [0],
    });
    expect(s).toContain("atomicpacksx");
    expect(s).toContain("9");
  });
});
