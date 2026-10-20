/**
 * AtomicPacks claimunboxed — pure action builder + optional session.transact.
 * Verify ABI on explorer before production use.
 */

import {
  actorString,
  extractTransactionId,
  permissionString,
  type SessionLike,
  type TransactAction,
  type TransactResult,
} from "./types";

export const ATOMIC_PACKS_ACCOUNT = "atomicpacksx";
export const CLAIM_UNBOXED_ACTION = "claimunboxed";

export interface ClaimUnboxedParams {
  packAssetId: string | number;
  originRollIds: Array<string | number>;
}

export function buildClaimUnboxedAction(
  params: ClaimUnboxedParams,
  auth?: { actor: string; permission?: string }
): TransactAction {
  const pack_asset_id = String(params.packAssetId).trim();
  if (!pack_asset_id) throw new Error("pack_asset_id required");
  const origin_roll_ids = params.originRollIds.map((id) => String(id));
  if (origin_roll_ids.length === 0) {
    throw new Error("origin_roll_ids must be non-empty");
  }

  const action: TransactAction = {
    account: ATOMIC_PACKS_ACCOUNT,
    name: CLAIM_UNBOXED_ACTION,
    data: {
      pack_asset_id,
      origin_roll_ids,
    },
  };

  if (auth?.actor) {
    action.authorization = [
      {
        actor: auth.actor,
        permission: auth.permission ?? "active",
      },
    ];
  }

  return action;
}

/** Human-readable summary for confirm dialogs. */
export function formatClaimUnboxedSummary(params: ClaimUnboxedParams): string {
  return [
    `Contract: ${ATOMIC_PACKS_ACCOUNT}`,
    `Action: ${CLAIM_UNBOXED_ACTION}`,
    `pack_asset_id: ${params.packAssetId}`,
    `origin_roll_ids: [${params.originRollIds.join(", ")}]`,
  ].join("\n");
}

export async function claimUnboxedWithSession(
  session: SessionLike,
  params: ClaimUnboxedParams
): Promise<TransactResult> {
  const actor = actorString(session);
  const permission = permissionString(session);
  const action = buildClaimUnboxedAction(params, { actor, permission });
  const raw = await session.transact({ actions: [action] });
  return {
    transactionId: extractTransactionId(raw),
    raw,
  };
}
