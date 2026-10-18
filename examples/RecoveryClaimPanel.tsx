"use client";

import { useId, useState } from "react";

export interface RecoveryClaimPanelProps {
  /** Display only — must be user-verified on explorer */
  contractAccount: string;
  actionName: string;
  fieldHints?: string[];
  onPrepareClaim?: (payload: {
    contractAccount: string;
    actionName: string;
    assetIds: string[];
  }) => void;
  className?: string;
}

/**
 * Educational recovery panel for when a commercial pack/drop UI is offline.
 * Does not broadcast by itself — parent wires WharfKit after user confirmation.
 */
export function RecoveryClaimPanel({
  contractAccount,
  actionName,
  fieldHints = ["asset_ids", "owner"],
  onPrepareClaim,
  className = "",
}: RecoveryClaimPanelProps) {
  const headingId = useId();
  const [assetIds, setAssetIds] = useState("");

  const ids = assetIds
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      className={`rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg text-amber-100 mb-1">
        Recovery claim path
      </h3>
      <p className="text-sm text-amber-100/80 mb-4 leading-relaxed">
        Use only to exit or claim existing positions when a product website is
        unavailable. Verify contract and ABI on an explorer. Not recommended for
        new high-value deposits into unmaintained platforms.
      </p>

      <dl className="text-xs font-mono text-amber-50/90 space-y-1 mb-4">
        <div>
          <dt className="inline opacity-60">Contract: </dt>
          <dd className="inline">{contractAccount}</dd>
        </div>
        <div>
          <dt className="inline opacity-60">Action: </dt>
          <dd className="inline">{actionName}</dd>
        </div>
        <div>
          <dt className="inline opacity-60">Fields: </dt>
          <dd className="inline">{fieldHints.join(", ")}</dd>
        </div>
      </dl>

      <label className="block text-sm text-amber-100/70 mb-1" htmlFor="recovery-ids">
        Pack / claim ids (comma or space separated)
      </label>
      <textarea
        id="recovery-ids"
        value={assetIds}
        onChange={(e) => setAssetIds(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white font-mono mb-3"
        placeholder="e.g. 123456789"
      />

      <button
        type="button"
        className="rounded-lg border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-50 hover:bg-amber-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        onClick={() => {
          if (ids.length === 0) return;
          const ok = window.confirm(
            `Prepare recovery claim?\n\nContract: ${contractAccount}\nAction: ${actionName}\nIds: ${ids.join(", ")}\n\nYou must still verify ABI and sign in wallet.`
          );
          if (ok) {
            onPrepareClaim?.({
              contractAccount,
              actionName,
              assetIds: ids,
            });
          }
        }}
      >
        Prepare claim (confirm)
      </button>
    </section>
  );
}
