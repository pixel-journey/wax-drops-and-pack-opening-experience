/**
 * Live AtomicPacks progress — poll unboxassets / unboxpacks after memo "unbox".
 * Network only. Claim still requires wallet (claimunboxed).
 */

export const DEFAULT_RPC = "https://wax.greymass.com";
export const ATOMIC_PACKS_CONTRACT = "atomicpacksx";

export interface UnboxRoll {
  originRollId: number;
  templateId: number;
}

export interface UnboxPackRow {
  packAssetId: string;
  packId: number;
  unboxer: string;
}

export interface UnboxProgress {
  packAssetId: string;
  rolls: UnboxRoll[];
  /** origin_roll_ids still claimable */
  claimableRollIds: number[];
  packRow: UnboxPackRow | null;
  status: "empty" | "pending_claim" | "unknown";
  sources: string[];
  note: string;
}

async function getTableRows(
  body: Record<string, unknown>,
  options: { rpc?: string; signal?: AbortSignal } = {}
): Promise<{ rows: unknown[]; source: string }> {
  const rpc = (options.rpc || DEFAULT_RPC).replace(/\/$/, "");
  const url = `${rpc}/v1/chain/get_table_rows`;
  const res = await fetch(url, {
    method: "POST",
    signal: options.signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ json: true, ...body }),
  });
  if (!res.ok) throw new Error(`RPC ${res.status}: ${res.statusText}`);
  const json = await res.json();
  return { rows: json.rows ?? [], source: url };
}

/** Rows in unboxassets with scope = pack asset_id. */
export async function fetchUnboxAssets(
  packAssetId: string,
  options: { rpc?: string; signal?: AbortSignal } = {}
): Promise<{ rolls: UnboxRoll[]; source: string }> {
  const id = packAssetId.trim();
  if (!id) throw new Error("pack_asset_id required");
  const { rows, source } = await getTableRows(
    {
      code: ATOMIC_PACKS_CONTRACT,
      scope: id,
      table: "unboxassets",
      limit: 100,
    },
    options
  );
  const rolls: UnboxRoll[] = rows.map((r) => {
    const row = r as { origin_roll_id?: number | string; template_id?: number | string };
    return {
      originRollId: Number(row.origin_roll_id),
      templateId: Number(row.template_id),
    };
  });
  return { rolls, source };
}

/** Optional: find unboxpacks row by pack_asset_id (primary key). */
export async function fetchUnboxPackRow(
  packAssetId: string,
  options: { rpc?: string; signal?: AbortSignal } = {}
): Promise<{ row: UnboxPackRow | null; source: string }> {
  const id = packAssetId.trim();
  const { rows, source } = await getTableRows(
    {
      code: ATOMIC_PACKS_CONTRACT,
      scope: ATOMIC_PACKS_CONTRACT,
      table: "unboxpacks",
      lower_bound: id,
      upper_bound: id,
      limit: 1,
    },
    options
  );
  if (!rows.length) return { row: null, source };
  const r = rows[0] as {
    pack_asset_id?: string | number;
    pack_id?: number | string;
    unboxer?: string;
  };
  return {
    row: {
      packAssetId: String(r.pack_asset_id ?? id),
      packId: Number(r.pack_id),
      unboxer: String(r.unboxer ?? ""),
    },
    source,
  };
}

export async function fetchUnboxProgress(
  packAssetId: string,
  options: { rpc?: string; signal?: AbortSignal } = {}
): Promise<UnboxProgress> {
  const id = packAssetId.trim();
  const [assets, pack] = await Promise.all([
    fetchUnboxAssets(id, options),
    fetchUnboxPackRow(id, options),
  ]);
  const claimableRollIds = assets.rolls.map((r) => r.originRollId);
  const hasRows = assets.rolls.length > 0 || pack.row != null;
  return {
    packAssetId: id,
    rolls: assets.rolls,
    claimableRollIds,
    packRow: pack.row,
    status: hasRows ? "pending_claim" : "empty",
    sources: [assets.source, pack.source],
    note: hasRows
      ? "Pending AtomicPacks unbox — call claimunboxed with these origin_roll_ids after verifying ABI."
      : "No unboxassets/unboxpacks rows — pack not unboxed yet, already claimed, or not an atomicpacksx flow.",
  };
}
