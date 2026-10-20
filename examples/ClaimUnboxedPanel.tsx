"use client";

import { useCallback, useId, useState } from "react";
import {
  buildClaimUnboxedAction,
  claimUnboxedWithSession,
  formatClaimUnboxedSummary,
} from "./wharf/claimUnboxed";
import {
  createDryRunSession,
  createSessionKit,
} from "./wharf/sessionFactory";
import type { SessionLike } from "./wharf/types";

export interface ClaimUnboxedPanelProps {
  packAssetId?: string;
  originRollIds?: number[];
  className?: string;
  onSuccess?: (txId?: string) => void;
}

/**
 * Confirm-first AtomicPacks claimunboxed.
 * Default path uses dry-run session; "Connect wallet" tries real SessionKit.
 */
export function ClaimUnboxedPanel({
  packAssetId: initialPackId = "",
  originRollIds: initialRolls = [],
  className = "",
  onSuccess,
}: ClaimUnboxedPanelProps) {
  const headingId = useId();
  const [packAssetId, setPackAssetId] = useState(initialPackId);
  const [rollsText, setRollsText] = useState(
    initialRolls.length ? initialRolls.join(", ") : "0"
  );
  const [session, setSession] = useState<SessionLike | null>(null);
  const [mode, setMode] = useState<"dry-run" | "wallet">("dry-run");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync when parent polls new progress
  const syncedPack =
    initialPackId && initialPackId !== packAssetId ? initialPackId : packAssetId;
  const syncedRolls =
    initialRolls.length > 0
      ? initialRolls.join(", ")
      : rollsText;

  const parseRolls = (text: string): number[] =>
    text
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n));

  const connectWallet = useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const kit = await createSessionKit({
        appName: "Pixel Journey Packs",
      });
      const { session: s } = await kit.login();
      setSession(s);
      setMode("wallet");
      setStatus(`Connected as ${typeof s.actor === "string" ? s.actor : s.actor.toString()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connect failed");
      setMode("dry-run");
      setSession(null);
    } finally {
      setBusy(false);
    }
  }, []);

  const useDryRun = useCallback(() => {
    setSession(createDryRunSession());
    setMode("dry-run");
    setStatus("Dry-run session active (no broadcast)");
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    const packId = (initialPackId || packAssetId).trim();
    const rolls = parseRolls(initialRolls.length ? initialRolls.join(",") : rollsText);
    if (!packId || rolls.length === 0) {
      setError("pack_asset_id and origin_roll_ids required");
      return;
    }

    const summary = formatClaimUnboxedSummary({
      packAssetId: packId,
      originRollIds: rolls,
    });
    const ok = window.confirm(
      `Sign claimunboxed?\n\n${summary}\n\nMode: ${mode}${mode === "dry-run" ? " (no chain broadcast)" : ""}`
    );
    if (!ok) return;

    const active = session ?? createDryRunSession();
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      // Validate shape before transact
      buildClaimUnboxedAction({ packAssetId: packId, originRollIds: rolls });
      const result = await claimUnboxedWithSession(active, {
        packAssetId: packId,
        originRollIds: rolls,
      });
      const msg = result.transactionId
        ? `OK · tx ${result.transactionId}`
        : "OK · wallet returned without tx id";
      setStatus(msg);
      onSuccess?.(result.transactionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "claimunboxed failed");
    } finally {
      setBusy(false);
    }
  }, [initialPackId, packAssetId, initialRolls, rollsText, session, mode, onSuccess]);

  return (
    <section
      className={`rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-3 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg text-emerald-100">
        Atomic claimunboxed (WharfKit)
      </h3>
      <p className="text-sm text-emerald-100/80 leading-relaxed">
        Builds <code className="text-emerald-200">atomicpacksx::claimunboxed</code> after you
        confirm. Prefer polling unboxassets first so roll ids match chain state.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useDryRun}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 disabled:opacity-50"
        >
          Use dry-run session
        </button>
        <button
          type="button"
          onClick={connectWallet}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          {busy ? "Working…" : "Connect wallet (WharfKit)"}
        </button>
      </div>

      <label className="block text-xs opacity-70" htmlFor="cu-pack">
        pack_asset_id
      </label>
      <input
        id="cu-pack"
        value={initialPackId || packAssetId}
        onChange={(e) => setPackAssetId(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm font-mono"
        placeholder="from unbox transfer"
      />

      <label className="block text-xs opacity-70" htmlFor="cu-rolls">
        origin_roll_ids
      </label>
      <input
        id="cu-rolls"
        value={initialRolls.length ? initialRolls.join(", ") : rollsText}
        onChange={(e) => setRollsText(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm font-mono"
        placeholder="0, 1, 2"
      />

      <p className="text-[11px] opacity-50 font-mono">
        mode: {mode}
        {syncedPack ? ` · pack ${syncedPack}` : ""}
        {syncedRolls ? ` · rolls ${syncedRolls}` : ""}
      </p>

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium disabled:opacity-50"
      >
        Confirm & claimunboxed
      </button>

      {status && (
        <p className="text-xs text-emerald-200 break-all" role="status">
          {status}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-300 break-all" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
