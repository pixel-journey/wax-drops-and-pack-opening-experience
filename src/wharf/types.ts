/**
 * Minimal shapes so this blueprint typechecks without requiring
 * @wharfkit/* installed until you opt into real wallet wiring.
 */

export interface TransactAction {
  account: string;
  name: string;
  authorization?: { actor: string; permission: string }[];
  data: Record<string, unknown>;
}

export interface TransactResult {
  /** Best-effort tx id when wallet returns one */
  transactionId?: string;
  raw?: unknown;
}

export interface SessionLike {
  actor: { toString(): string } | string;
  permission?: { toString(): string } | string;
  transact(args: { actions: TransactAction[] }): Promise<unknown>;
}

export function actorString(session: SessionLike): string {
  const a = session.actor;
  return typeof a === "string" ? a : a.toString();
}

export function permissionString(session: SessionLike): string {
  const p = session.permission;
  if (!p) return "active";
  return typeof p === "string" ? p : p.toString();
}

export function extractTransactionId(result: unknown): string | undefined {
  if (!result || typeof result !== "object") return undefined;
  const r = result as Record<string, unknown>;
  if (typeof r.transaction_id === "string") return r.transaction_id;
  if (typeof r.transactionId === "string") return r.transactionId;
  const resolved = r.resolved as Record<string, unknown> | undefined;
  const tx = resolved?.transaction as Record<string, unknown> | undefined;
  if (typeof tx?.id === "string") return tx.id;
  return undefined;
}
