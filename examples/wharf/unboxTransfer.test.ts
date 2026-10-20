import { describe, expect, it } from "vitest";
import { ATOMIC_PACKS_ACCOUNT } from "./claimUnboxed";
import {
  ATOMIC_ASSETS_ACCOUNT,
  UNBOX_MEMO,
  buildUnboxTransferAction,
  unboxTransferWithSession,
} from "./unboxTransfer";
import type { SessionLike } from "./types";

describe("buildUnboxTransferAction", () => {
  it("builds transfer to atomicpacksx with memo unbox", () => {
    const action = buildUnboxTransferAction(
      { assetIds: ["1100003553120"] },
      { actor: "alice.wam" }
    );
    expect(action.account).toBe(ATOMIC_ASSETS_ACCOUNT);
    expect(action.name).toBe("transfer");
    expect(action.data).toEqual({
      from: "alice.wam",
      to: ATOMIC_PACKS_ACCOUNT,
      asset_ids: ["1100003553120"],
      memo: UNBOX_MEMO,
    });
    expect(action.authorization?.[0].actor).toBe("alice.wam");
  });

  it("rejects wrong memo for atomicpacksx destination", () => {
    expect(() =>
      buildUnboxTransferAction(
        { assetIds: ["1"], memo: "open" },
        { actor: "alice.wam" }
      )
    ).toThrow(/memo/);
  });

  it("rejects empty asset ids", () => {
    expect(() =>
      buildUnboxTransferAction({ assetIds: [] }, { actor: "alice.wam" })
    ).toThrow(/asset_ids/);
  });
});

describe("unboxTransferWithSession", () => {
  it("transacts transfer action", async () => {
    const session: SessionLike = {
      actor: "bob.wam",
      async transact(args) {
        return { transaction_id: "tx-unbox", actions: args.actions };
      },
    };
    const result = await unboxTransferWithSession(session, {
      assetIds: [99],
    });
    expect(result.transactionId).toBe("tx-unbox");
  });
});
