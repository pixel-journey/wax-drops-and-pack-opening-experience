/**
 * AtomicPacks step 1: transfer pack NFT to atomicpacksx with memo "unbox".
 * Step 2 is claimunboxed (see claimUnboxed.ts).
 */

import {
  actorString,
  extractTransactionId,
  permissionString,
  type SessionLike,
  type TransactAction,
  type TransactResult,
} from "./types";
import { ATOMIC_PACKS_ACCOUNT } from "./claimUnboxed";

export const ATOMIC_ASSETS_ACCOUNT = "atomicassets";
export const UNBOX_MEMO = "unbox";

export interface UnboxTransferParams {
  /** Pack asset id(s) — AtomicPacks typically expects a single pack. */
  assetIds: Array<string | number>;
  /** Override destination; default atomicpacksx */
  to?: string;
  /** Override memo; must be "unbox" for AtomicPacks */
  memo?: string;
}

export function buildUnboxTransferAction(
  params: UnboxTransferParams,
  auth: { actor: string; permission?: string }
): TransactAction {
  const from = auth.actor.trim();
  if (!from) throw new Error("from (actor) required");

  const asset_ids = params.assetIds.map((id) => String(id).trim()).filter(Boolean);
  if (asset_ids.length === 0) throw new Error("asset_ids required");

  const to = (params.to ?? ATOMIC_PACKS_ACCOUNT).trim();
  const memo = params.memo ?? UNBOX_MEMO;
  if (to === ATOMIC_PACKS_ACCOUNT && memo !== UNBOX_MEMO) {
    throw new Error(
      `AtomicPacks requires memo "${UNBOX_MEMO}" when transferring to ${ATOMIC_PACKS_ACCOUNT}`
    );
  }

  return {
    account: ATOMIC_ASSETS_ACCOUNT,
    name: "transfer",
    authorization: [
      {
        actor: from,
        permission: auth.permission ?? "active",
      },
    ],
    data: {
      from,
      to,
      asset_ids,
      memo,
    },
  };
}

export function formatUnboxTransferSummary(
  params: UnboxTransferParams & { from?: string }
): string {
  const to = params.to ?? ATOMIC_PACKS_ACCOUNT;
  const memo = params.memo ?? UNBOX_MEMO;
  return [
    `Contract: ${ATOMIC_ASSETS_ACCOUNT}`,
    `Action: transfer`,
    `from: ${params.from ?? "<session actor>"}`,
    `to: ${to}`,
    `asset_ids: [${params.assetIds.join(", ")}]`,
    `memo: ${memo}`,
    "",
    "After success: wait for RNG, poll unboxassets, then claimunboxed.",
  ].join("\n");
}

export async function unboxTransferWithSession(
  session: SessionLike,
  params: UnboxTransferParams
): Promise<TransactResult> {
  const actor = actorString(session);
  const permission = permissionString(session);
  const action = buildUnboxTransferAction(params, { actor, permission });
  const raw = await session.transact({ actions: [action] });
  return {
    transactionId: extractTransactionId(raw),
    raw,
  };
}
