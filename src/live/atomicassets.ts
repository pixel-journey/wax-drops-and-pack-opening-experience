/**
 * Live AtomicAssets helpers for pack-shaped assets.
 * Network only — odds math stays in engines.ts.
 */

import { parseContentsOdds } from "../engines";
import { suggestStackFromAccounts, type StackSuggestion } from "../stackDetect";
import type { ProbabilityItem } from "../types";

export const DEFAULT_ATOMIC = "https://wax.api.atomicassets.io";

/** Smoke-tested 2026-10-20: schema packs, contents odds string. */
export const SMOKE_PACK_ASSET_ID = "1100003609672";

/** Pending Atomic unbox sample (may clear when claimed). */
export const SMOKE_PENDING_UNBOX_ID = "1100003553120";

export interface PackAssetSummary {
  assetId: string;
  name: string;
  owner?: string;
  collection?: string;
  schema?: string;
  contentsText?: string;
  odds: ProbabilityItem[];
  authorizedAccounts: string[];
  notifyAccounts: string[];
  stack: StackSuggestion;
  recoveryHints: {
    trustLabel: "recovery" | "avoid-new-value";
    note: string;
  };
}

interface RawAsset {
  asset_id?: string;
  owner?: string;
  data?: Record<string, unknown>;
  immutable_data?: Record<string, unknown>;
  collection?: {
    collection_name?: string;
    authorized_accounts?: string[];
    notify_accounts?: string[];
  };
  schema?: { schema_name?: string };
}

function pickName(a: RawAsset): string {
  const d = a.data ?? {};
  const im = a.immutable_data ?? {};
  return String(d.name ?? im.name ?? a.asset_id ?? "pack");
}

function pickContents(a: RawAsset): string | undefined {
  const d = a.data ?? {};
  const im = a.immutable_data ?? {};
  const c = d.contents ?? im.contents;
  return typeof c === "string" ? c : undefined;
}

export function rawAssetToPackSummary(a: RawAsset): PackAssetSummary {
  const contentsText = pickContents(a);
  const odds = contentsText ? parseContentsOdds(contentsText) : [];
  const authorizedAccounts = a.collection?.authorized_accounts ?? [];
  const notifyAccounts = a.collection?.notify_accounts ?? [];
  const stack = suggestStackFromAccounts([
    ...authorizedAccounts,
    ...notifyAccounts,
  ]);
  return {
    assetId: String(a.asset_id ?? ""),
    name: pickName(a),
    owner: a.owner,
    collection: a.collection?.collection_name,
    schema: a.schema?.schema_name,
    contentsText,
    odds,
    authorizedAccounts,
    notifyAccounts,
    stack,
    recoveryHints: {
      trustLabel: "recovery",
      note: stack.note,
    },
  };
}

export async function fetchAsset(
  assetId: string,
  options: { atomicBase?: string; signal?: AbortSignal } = {}
): Promise<{ asset: RawAsset; source: string }> {
  const base = (options.atomicBase || DEFAULT_ATOMIC).replace(/\/$/, "");
  const id = assetId.trim();
  if (!id) throw new Error("asset_id required");
  const url = `${base}/atomicassets/v1/assets/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    signal: options.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`AtomicAssets ${res.status}: ${res.statusText}`);
  const json = await res.json();
  return { asset: (json.data ?? json) as RawAsset, source: url };
}

export async function fetchPackSummary(
  assetId: string,
  options: { atomicBase?: string; signal?: AbortSignal } = {}
): Promise<{ pack: PackAssetSummary; source: string }> {
  const { asset, source } = await fetchAsset(assetId, options);
  return { pack: rawAssetToPackSummary(asset), source };
}

export async function fetchOwnerPacks(
  owner: string,
  options: {
    atomicBase?: string;
    schemaName?: string;
    limit?: number;
    signal?: AbortSignal;
  } = {}
): Promise<{ packs: PackAssetSummary[]; source: string }> {
  const base = (options.atomicBase || DEFAULT_ATOMIC).replace(/\/$/, "");
  const o = owner.trim();
  if (!o) throw new Error("owner required");
  const schema = options.schemaName ?? "packs";
  const limit = options.limit ?? 20;
  const url = `${base}/atomicassets/v1/assets?owner=${encodeURIComponent(
    o
  )}&schema_name=${encodeURIComponent(schema)}&limit=${limit}&order=desc`;
  const res = await fetch(url, {
    signal: options.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`AtomicAssets ${res.status}: ${res.statusText}`);
  const json = await res.json();
  const list = (json.data ?? []) as RawAsset[];
  return {
    packs: list.map(rawAssetToPackSummary),
    source: url,
  };
}
