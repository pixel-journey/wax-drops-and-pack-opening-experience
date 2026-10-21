"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  ATOMIC_ASSETS_ACCOUNT,
  UNBOX_MEMO,
  buildUnboxTransferAction,
  formatUnboxTransferSummary,
  unboxTransferWithSession,
} from "./wharf/unboxTransfer";
import { ATOMIC_PACKS_ACCOUNT } from "./wharf/claimUnboxed";
import {
  createDryRunSession,
  createSessionKit,
} from "./wharf/sessionFactory";
import { actorString, type SessionLike } from "./wharf/types";

export interface UnboxTransferPanelProps {
  packAssetId?: string;
  className?: string;
  session?: SessionLike | null;
  onSession?: (session: SessionLike, mode: "dry-run" | "wallet") => void;
  onPackAssetIdChange?: (id: string) => void;
  onSuccess?: (txId?: string) => void;
}

/**
 * Step 1 UI: atomicassets::transfer → atomicpacksx, memo "unbox".
 */
export function UnboxTransferPanel({
  packAssetId: controlledPackId,
  className = "",
  session: externalSession = null,
  onSession,
  onPackAssetIdChange,
  onSuccess,
}: UnboxTransferPanelProps) {
  const headingId = useId();
  const [localPackId, setLocalPackId] = useState(controlledPackId ?? "");
  const [session, setSession] = useState<SessionLike | null>(externalSession);
  const [mode, setMode] = useState<"dry-run" | "wallet">("dry-run");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (controlledPackId !== undefined && controlledPackId !== localPackId) {
      setLocalPackId(controlledPackId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from parent only
  }, [controlledPackId]);

  useEffect(() => {
    if (externalSession) setSession(externalSession);
  }, [externalSession]);

  const packId = localPackId.trim();

  const previewAction = useMemo(() => {
    if (!packId) return null;
    try {
      const actor = session ? actorString(session) : "<your.account>";
      return buildUnboxTransferAction(
        { assetIds: [packId] },
        { actor }
      );
    } catch {
      return null;
    }
  }, [packId, session]);

  const setActiveSession = useCallback(
    (s: SessionLike, m: "dry-run" | "wallet") => {
      setSession(s);
      setMode(m);
      onSession?.(s, m);
    },
    [onSession]
  );

  const onPackChange = (value: string) => {
    setLocalPackId(value);
    onPackAssetIdChange?.(value);
  };

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
      const result = await unboxTransferWithSession(active, {
        assetIds: [packId],
      });
      const msg = result.transactionId
        ? `Unbox transfer OK · tx ${result.transactionId} — next: Poll unbox`
        : "Unbox transfer OK — next: Poll unbox for origin_roll_ids";
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
      className={`rounded-2xl border border-sky-500/40 bg-gradient-to-b from-sky-500/15 to-black/40 p-6 space-y-4 ${className}`}
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-black">
          1
        </span>
        <h3 id={headingId} className="font-semibold text-lg text-sky-100">
          Transfer + memo unbox
        </h3>
      </div>

      <p className="text-sm text-sky-100/85 leading-relaxed">
        Sends your pack NFT to the AtomicPacks contract. The memo must be exactly{" "}
        <code className="rounded bg-black/40 px-1.5 py-0.5 text-sky-200">unbox</code>
        — otherwise the open will not start.
      </p>

      {/* Fixed route summary */}
      <dl className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-black/35 p-3 text-xs font-mono sm:grid-cols-2">
        <div>
          <dt className="opacity-50">Contract</dt>
          <dd className="text-sky-200">{ATOMIC_ASSETS_ACCOUNT}</dd>
        </div>
        <div>
          <dt className="opacity-50">Action</dt>
          <dd className="text-sky-200">transfer</dd>
        </div>
        <div>
          <dt className="opacity-50">To</dt>
          <dd className="text-sky-200">{ATOMIC_PACKS_ACCOUNT}</dd>
        </div>
        <div>
          <dt className="opacity-50">Memo</dt>
          <dd className="text-amber-200">{UNBOX_MEMO}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useDryRun}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          Use dry-run session
        </button>
        <button
          type="button"
          onClick={connectWallet}
          disabled={busy}
          className="px-3 py-2 rounded-lg text-sm bg-sky-600 hover:bg-sky-500 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {busy ? "Working…" : "Connect wallet"}
        </button>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {showPreview ? "Hide" : "Show"} action JSON
        </button>
      </div>

      <div>
        <label className="block text-xs opacity-70 mb-1" htmlFor="ut-pack">
          Pack asset_id (must be in your inventory)
        </label>
        <input
          id="ut-pack"
          value={localPackId}
          onChange={(e) => onPackChange(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          placeholder="e.g. 1100003609672"
          autoComplete="off"
          inputMode="numeric"
        />
      </div>

      {showPreview && (
        <div className="rounded-xl border border-sky-500/20 bg-black/50 p-3">
          <p className="text-[11px] uppercase tracking-wide opacity-50 mb-2">
            Action preview
          </p>
          {previewAction ? (
            <pre className="text-[11px] font-mono text-sky-100/90 overflow-x-auto whitespace-pre-wrap break-all">
              {JSON.stringify(previewAction, null, 2)}
            </pre>
          ) : (
            <p className="text-xs opacity-50">Enter a pack asset_id to preview.</p>
          )}
        </div>
      )}

      <p className="text-[11px] opacity-50 font-mono">
        session: {mode}
        {session ? ` · ${actorString(session)}` : " · not set (dry-run on submit)"}
      </p>

      <button
        type="button"
        onClick={submit}
        disabled={busy || !packId}
        className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-3.5 text-sm font-semibold disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      >
        Confirm & transfer unbox
      </button>

      <p className="text-[11px] text-sky-100/60 leading-relaxed">
        After success: wait a few seconds for RNG, then use <strong>Poll unbox</strong>{" "}
        and Step 2 <code className="text-sky-200">claimunboxed</code>.
      </p>

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
