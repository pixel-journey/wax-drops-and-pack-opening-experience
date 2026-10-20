"use client";

import { useCallback, useId, useState } from "react";
import {
  buildUnboxTransferAction,
  formatUnboxTransferSummary,
  unboxTransferWithSession,
} from "./wharf/unboxTransfer";
import {
  createDryRunSession,
  createSessionKit,
} from "./wharf/sessionFactory";
import { actorString, type SessionLike } from "./wharf/types";

export interface UnboxTransferPanelProps {
  packAssetId?: string;
  className?: string;
  /** Shared session from parent if already logged in */
  session?: SessionLike | null;
  onSession?: (session: SessionLike, mode: "dry-run" | "wallet") => void;
  onSuccess?: (txId?: string) => void;
}

/**
 * Step 1: atomicassets::transfer → atomicpacksx, memo "unbox".
 */
export function UnboxTransferPanel({
  packAssetId: initialPackId = "",
  className = "",
  session: externalSession = null,
  onSession,
  onSuccess,
}: UnboxTransferPanelProps) {
  const headingId = useId();
  const [packAssetId, setPackAssetId] = useState(initialPackId);
  const [session, setSession] = useState<SessionLike | null>(externalSession);
  const [mode, setMode] = useState<"dry-run" | "wallet">("dry-run");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const packId = (initialPackId || packAssetId).trim();

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
    try {
      const kit = await createSessionKit({ appName: "Pixel Journey Packs" });
      const { session: s } = await kit.login();
      setActiveSession(s, "wallet");
      setStatus(`Connected as ${actorString(s)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connect failed");
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
    if (!packId) {
      setError("pack asset_id required");
      return;
    }
    const active = session ?? externalSession ?? createDryRunSession();
    const from = actorString(active);
    const summary = formatUnboxTransferSummary({
      assetIds: [packId],
      from,
    });
    const ok = window.confirm(
      `Sign unbox transfer?\n\n${summary}\n\nMode: ${mode}${mode === "dry-run" ? " (no chain broadcast)" : ""}`
    );
    if (!ok) return;

    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      buildUnboxTransferAction(
        { assetIds: [packId] },
        { actor: from }
      );
      const result = await unboxTransferWithSession(active, {
        assetIds: [packId],
      });
      const msg = result.transactionId
        ? `Unbox transfer OK · tx ${result.transactionId} — poll unboxassets next`
        : "Unbox transfer OK — poll unboxassets next";
      setStatus(msg);
      onSuccess?.(result.transactionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unbox transfer failed");
    } finally {
      setBusy(false);
    }
  }, [packId, session, externalSession, mode, onSuccess]);

  return (
    <section
      className={`rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 space-y-3 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg text-sky-100">
        Step 1 · Transfer + memo unbox
      </h3>
      <p className="text-sm text-sky-100/80 leading-relaxed">
        <code className="text-sky-200">atomicassets::transfer</code> →{" "}
        <code className="text-sky-200">atomicpacksx</code> with memo{" "}
        <code className="text-sky-200">unbox</code>. Do not send the pack without the memo.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useDryRun}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-white/10 disabled:opacity-50"
        >
          Use dry-run session
        </button>
        <button
          type="button"
          onClick={connectWallet}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-sky-600 disabled:opacity-50"
        >
          {busy ? "Working…" : "Connect wallet"}
        </button>
      </div>

      <label className="block text-xs opacity-70" htmlFor="ut-pack">
        pack asset_id
      </label>
      <input
        id="ut-pack"
        value={initialPackId || packAssetId}
        onChange={(e) => setPackAssetId(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm font-mono"
        placeholder="NFT pack asset id you own"
      />

      <p className="text-[11px] opacity-50 font-mono">mode: {mode}</p>

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium disabled:opacity-50"
      >
        Confirm & transfer unbox
      </button>

      {status && (
        <p className="text-xs text-sky-200 break-all" role="status">
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
