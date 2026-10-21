import { CHAIN_ORIGIN, tableRows } from "./api";
import { SMOKE_PACK_ASSET_ID } from "./live/atomicassets";
import { DEFAULT_ATOMIC } from "./live/atomicassets";
import { buildClaimUnboxedAction } from "./wharf/claimUnboxed";
import { buildUnboxTransferAction } from "./wharf/unboxTransfer";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

function asAction(action: {
  account: string;
  name: string;
  data: Record<string, unknown>;
  authorization?: { actor: string; permission: string }[];
}): ChainAction {
  return {
    account: action.account,
    name: action.name,
    data: action.data,
    authorization: (action.authorization ?? []).map((row) => ({
      actor: row.actor,
      permission: row.permission === "owner" ? "owner" : "active",
    })),
  };
}

const unbox = buildUnboxTransferAction({ assetIds: [SMOKE_PACK_ASSET_ID] }, { actor: "alice" });
const claim = buildClaimUnboxedAction(
  { packAssetId: SMOKE_PACK_ASSET_ID, originRollIds: ["1"] },
  { actor: "alice", permission: "active" },
);

export const USE_CASES: UseCase[] = [
  {
    title: "Poll unboxassets for the smoke pack",
    detail: "Same get_table_rows body fetchUnboxAssets posts. Scope is the pack asset id. origin_roll_id 1 below is a placeholder until this table returns real ids. The request is not sent.",
    request: tableRows(CHAIN_ORIGIN, "atomicpacksx", SMOKE_PACK_ASSET_ID, "unboxassets", 100),
    transaction: {
      note: "Step 1. Transfer the pack to atomicpacksx with memo unbox. Not broadcast.",
      actions: [asAction(unbox as unknown as Parameters<typeof asAction>[0])],
    },
  },
  {
    title: "Then claimunboxed",
    detail: "Step 2 uses origin_roll_ids from the table, not from a guess. The asset URL is the AtomicAssets read for the same pack id.",
    request: { method: "GET", url: `${DEFAULT_ATOMIC}/atomicassets/v1/assets/${SMOKE_PACK_ASSET_ID}`, executed: false },
    transaction: {
      note: "Step 2. claimunboxed. Replace origin_roll_ids with ids from unboxassets before anyone signs.",
      actions: [asAction(claim as unknown as Parameters<typeof asAction>[0])],
    },
  },
];

export function assertUseCases(): void {
  if (unbox.name !== "transfer" || unbox.data.memo !== "unbox" || unbox.data.to !== "atomicpacksx") throw new Error("unbox");
  if (claim.name !== "claimunboxed" || claim.account !== "atomicpacksx") throw new Error("claim");
}
