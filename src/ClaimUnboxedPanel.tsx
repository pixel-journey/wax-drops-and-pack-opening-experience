"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  buildClaimUnboxedAction,
  claimUnboxedWithSession,
  formatClaimUnboxedSummary,
} from "./wharf/claimUnboxed";
import {
  createDryRunSession,
  createSessionKit,
} from "./wharf/sessionFactory";
import { actorString, type SessionLike } from "./wharf/types";

export interface ClaimUnboxedPanelProps {
  packAssetId?: string;
  originRollIds?: number[];
  className?: string;
  session?: SessionLike | null;
  onSession?: (session: SessionLike, mode: "dry-run" | "wallet") => void;
  onSuccess?: (txId?: string) => void;
}

/** Step 2: atomicpacksx::claimunboxed after unboxassets are ready. */
export function ClaimUnboxedPanel({
  packAssetId: initialPackId = "",
  originRollIds: initialRolls = [],
  className = "",
  session: externalSession = null,
  onSession,
  onSuccess,
}: ClaimUnboxedPanelProps) {
  const headingId = useId();
  const [packAssetId, setPackAssetId] = useState(initialPackId);
  const [rollsText, setRollsText] = useState(
    initialRolls.length ? initialRolls.join(", ") : ""
  );
  const [session, setSession] = useState<SessionLike | null>(externalSession);
  const [mode, setMode] = useState<"dry-run" | "wallet">("dry-run");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPackId) setPackAssetId(initialPackId);
  }, [initialPackId]);

  useEffect(() => {
    if (initialRolls.length > 0) setRollsText(initialRolls.join(", "));
  }, [initialRolls]);

  useEffect(() => {
    if (externalSession) setSession(externalSession);
  }, [externalSession]);

  const parseRolls = (text: string): number[] =>
    text
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n));

  const setActiveSession = useCallback(
    (s: SessionLike, m: "dry-run" | "wallet") => {
      setSession(s);
      setMode(m);
      onSession?.(s, m);
    },
    [onSession]
  );

  const connectWallet = useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const kit = await createSessionKit({ appName: "Pixel Journey Packs" });
      const { session: s } = await kit.login();
      setActiveSession(s, "wallet");
      setStatus(`Connected as ${actorString(s)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connect failed");
      setMode("dry-run");
    } finally {
      setBusy(false);
    }
  }, [setActiveSession]);

  const useDryRun = useCallback(() => {
    setActiveSession(createDryRunSession(), "dry-run");
    setStatus("Dry-run session active (no broadcast)");
    setError(null);
  }, [setActiveSession]);

  const submit = useCallback(async () => {
    const packId = packAssetId.trim();
    const rolls = parseRolls(rollsText);
    if (!packId || rolls.length === 0) {
      setError("pack_asset_id and origin_roll_ids required — poll unbox first");
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
  }, [packAssetId, rollsText, session, mode, onSuccess]);

  return (
    <section
      className={`rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 to-black/40 p-6 space-y-4 ${className}`}
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-black">
          2
        </span>
        <h3 id={headingId} className="font-semibold text-lg text-emerald-100">
          Claim unboxed
        </h3>
      </div>

      <p className="text-sm text-emerald-100/85 leading-relaxed">
        After Step 1 and RNG settle, claim outcomes with{" "}
        <code className="rounded bg-black/40 px-1.5 py-0.5 text-emerald-200">
          atomicpacksx::claimunboxed
        </code>
        . Roll ids come from the unboxassets table.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useDryRun}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-white/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Use dry-run session
        </button>
        <button
          type="button"
          onClick={connectWallet}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-emerald-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {busy ? "Working…" : "Connect wallet"}
        </button>
      </div>

      <div>
        <label className="block text-xs opacity-70 mb-1" htmlFor="cu-pack">
          pack_asset_id
        </label>
        <input
          id="cu-pack"
          value={packAssetId}
          onChange={(e) => setPackAssetId(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          placeholder="same id used in Step 1"
        />
      </div>

      <div>
        <label className="block text-xs opacity-70 mb-1" htmlFor="cu-rolls">
          origin_roll_ids
        </label>
        <input
          id="cu-rolls"
          value={rollsText}
          onChange={(e) => setRollsText(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          placeholder="0, 1, 2 — from Poll unbox"
        />
      </div>

      <p className="text-[11px] opacity-50 font-mono">
        session: {mode}
        {session ? ` · ${actorString(session)}` : ""}
      </p>

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3.5 text-sm font-semibold disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
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
