'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ProbabilityBreakdown } from '../examples/ProbabilityBreakdown';
import { RecoveryClaimPanel } from '../examples/RecoveryClaimPanel';
import { RevealAnimation } from '../examples/RevealAnimation';
import {
  demoOdds,
  formatChancePct,
  normalizeOdds,
  rollFromOdds,
} from '../examples/engines';
import {
  SMOKE_PACK_ASSET_ID,
  SMOKE_PENDING_UNBOX_ID,
  fetchOwnerPacks,
  fetchPackSummary,
  type PackAssetSummary,
} from '../examples/live/atomicassets';
import {
  fetchUnboxProgress,
  type UnboxProgress,
} from '../examples/live/atomicpacksx';
import {
  PLATFORM_PRESETS,
  type PlatformClaimPreset,
} from '../examples/platformPresets';

type Mode = 'demo' | 'live';

export default function DropsAndPackPage() {
  const [mode, setMode] = useState<Mode>('demo');
  const [assetId, setAssetId] = useState(SMOKE_PACK_ASSET_ID);
  const [owner, setOwner] = useState('');
  const [pack, setPack] = useState<PackAssetSummary | null>(null);
  const [inventory, setInventory] = useState<PackAssetSummary[]>([]);
  const [progress, setProgress] = useState<UnboxProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [rolled, setRolled] = useState<string | null>(null);
  const [presetId, setPresetId] = useState('atomic-packs');

  const preset: PlatformClaimPreset =
    PLATFORM_PRESETS.find((p) => p.id === presetId) ?? PLATFORM_PRESETS[0];

  const odds = useMemo(() => {
    if (mode === 'live' && pack?.odds.length) return pack.odds;
    return demoOdds();
  }, [mode, pack]);

  const normalized = useMemo(() => normalizeOdds(odds), [odds]);

  const applyPack = useCallback((p: PackAssetSummary) => {
    setPack(p);
    setAssetId(p.assetId);
    if (p.stack.presetId) setPresetId(p.stack.presetId);
  }, []);

  const loadLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    setRolled(null);
    setProgress(null);
    try {
      const { pack: p, source } = await fetchPackSummary(assetId);
      applyPack(p);
      setMeta(
        `${p.name} · stack ${p.stack.stackId} (${p.stack.confidence}) · ${source}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Live fetch failed');
      setPack(null);
    } finally {
      setLoading(false);
    }
  }, [assetId, applyPack]);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { packs, source } = await fetchOwnerPacks(owner, { limit: 30 });
      setInventory(packs);
      setMeta(`Owner packs: ${packs.length} · ${source}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Inventory fetch failed');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [owner]);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = assetId.trim() || SMOKE_PENDING_UNBOX_ID;
      const prog = await fetchUnboxProgress(id);
      setProgress(prog);
      setAssetId(id);
      setMeta(prog.note);
      if (prog.status === 'pending_claim') setPresetId('atomic-packs');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Progress poll failed');
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  const handleDemoRoll = () => {
    setRevealing(true);
    setRolled(null);
    window.setTimeout(() => {
      const u = Math.random();
      const { item } = rollFromOdds(normalized.items, u);
      setRolled(item?.name ?? '—');
      setRevealing(false);
    }, 900);
  };

  const trustColor =
    preset.trust === 'recommended-for-new-value'
      ? 'text-emerald-400'
      : 'text-amber-300';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl tracking-widest text-emerald-400 font-bold">
            DROPS & PACK OPENING
          </h1>
          <p className="text-xs opacity-60 mt-1">
            Inventory stack suggest · Atomic unbox progress · recovery presets
          </p>
        </header>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Mode">
          <button
            type="button"
            onClick={() => setMode('demo')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'demo' ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            Demo open
          </button>
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`px-4 py-2 rounded-xl text-sm ${
              mode === 'live' ? 'bg-sky-600' : 'bg-white/10'
            }`}
          >
            Live tools
          </button>
        </div>

        {mode === 'live' && (
          <div className="border border-white/10 bg-black/40 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="packAsset"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
                placeholder="pack asset_id"
                aria-label="Pack asset id"
              />
              <button
                type="button"
                onClick={loadLive}
                disabled={loading || !assetId.trim()}
                className="px-4 py-3 rounded-xl bg-sky-600 text-sm disabled:opacity-50"
              >
                Load pack
              </button>
              <button
                type="button"
                onClick={loadProgress}
                disabled={loading}
                className="px-4 py-3 rounded-xl bg-violet-600 text-sm disabled:opacity-50"
              >
                Poll unbox
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
                placeholder="owner account (schema packs)"
                aria-label="Owner account"
              />
              <button
                type="button"
                onClick={loadInventory}
                disabled={loading || !owner.trim()}
                className="px-4 py-3 rounded-xl bg-emerald-700 text-sm disabled:opacity-50"
              >
                List packs
              </button>
            </div>

            <p className="text-[11px] opacity-50">
              Pending unbox smoke id: {SMOKE_PENDING_UNBOX_ID} (may clear when claimed).
            </p>
          </div>
        )}

        {error && (
          <div role="alert" className="text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {meta && <p className="text-xs opacity-50 break-all">{meta}</p>}

        {mode === 'live' && inventory.length > 0 && (
          <section className="border border-white/10 rounded-2xl p-4 space-y-2">
            <h2 className="text-sm font-semibold text-emerald-400/90">Owner inventory</h2>
            <ul className="space-y-2 text-sm">
              {inventory.map((p) => (
                <li key={p.assetId}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-xl border border-white/10 hover:border-emerald-500/40 font-mono text-xs"
                    onClick={() => applyPack(p)}
                  >
                    <span className="text-emerald-400">{p.assetId}</span> · {p.name}
                    <span className="block opacity-60">
                      stack: {p.stack.stackId} ({p.stack.confidence})
                      {p.stack.matchedAccounts.length
                        ? ` · ${p.stack.matchedAccounts.join(', ')}`
                        : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {progress && (
          <section
            className="border border-violet-500/30 bg-violet-500/10 rounded-2xl p-4 space-y-2"
            aria-live="polite"
          >
            <h2 className="text-sm font-semibold text-violet-200">Atomic unbox progress</h2>
            <p className="text-xs font-mono">status: {progress.status}</p>
            {progress.packRow && (
              <p className="text-xs opacity-70">
                unboxer {progress.packRow.unboxer} · pack_id {progress.packRow.packId}
              </p>
            )}
            <ul className="text-xs font-mono space-y-1">
              {progress.rolls.map((r) => (
                <li key={r.originRollId}>
                  roll {r.originRollId} → template {r.templateId}
                </li>
              ))}
              {progress.rolls.length === 0 && (
                <li className="opacity-50">No unboxassets rows</li>
              )}
            </ul>
            {progress.claimableRollIds.length > 0 && (
              <p className="text-xs text-violet-100">
                claimunboxed origin_roll_ids: [{progress.claimableRollIds.join(', ')}]
              </p>
            )}
            <p className="text-[11px] opacity-60">{progress.note}</p>
          </section>
        )}

        <section className="border border-white/10 bg-black/40 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-emerald-400/90 tracking-wide">
            Probability breakdown
          </h2>
          <ProbabilityBreakdown items={normalized.items} showExpectedValue />
          <p className="text-[11px] opacity-50">{normalized.methodologyNote}</p>
        </section>

        {mode === 'demo' && (
          <section className="space-y-3">
            <button
              type="button"
              onClick={handleDemoRoll}
              disabled={revealing}
              className="w-full px-6 py-3 bg-emerald-600 rounded-xl font-medium disabled:opacity-50"
            >
              {revealing ? 'Opening…' : 'Simulate open (client RNG)'}
            </button>
            <RevealAnimation isRevealing={revealing}>
              <div className="text-center p-6 border border-white/10 rounded-2xl text-sm opacity-70">
                {revealing ? 'Revealing…' : 'Ready'}
              </div>
            </RevealAnimation>
            {rolled && (
              <p className="text-center text-lg" aria-live="polite">
                You rolled: <strong className="text-emerald-400">{rolled}</strong>
              </p>
            )}
          </section>
        )}

        {mode === 'live' && pack && (
          <section className="text-xs opacity-70 space-y-1 font-mono">
            <p>collection: {pack.collection ?? '—'}</p>
            <p>schema: {pack.schema ?? '—'}</p>
            <p>
              stack: {pack.stack.stackId} ({pack.stack.confidence}) — {pack.stack.note}
            </p>
            <p>authorized: {pack.authorizedAccounts.join(', ') || '—'}</p>
          </section>
        )}

        <section className="border border-white/10 bg-black/40 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold tracking-wide">Platform claim preset</h2>
          <select
            id="preset"
            value={preset.id}
            onChange={(e) => setPresetId(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm"
            aria-label="Contract stack"
          >
            {PLATFORM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className={`text-xs font-mono ${trustColor}`}>trust: {preset.trust}</p>
          <p className="text-xs opacity-60">{preset.openHint}</p>
        </section>

        <RecoveryClaimPanel
          contractAccount={preset.contractAccount}
          actionName={preset.actionName}
          fieldHints={preset.fieldHints}
          onPrepareClaim={(payload) => {
            console.info('Claim prepare (educational):', payload, preset.trust, progress);
          }}
        />

        <p className="text-xs opacity-50">
          <code className="text-emerald-400/80">fetchUnboxProgress</code> ·{' '}
          <code className="text-emerald-400/80">suggestStackFromAccounts</code> ·{' '}
          PLATFORM-CONTRACTS.md
        </p>

        <p className="text-[10px] opacity-40">
          Sample odds: {normalized.items[0]?.name}{' '}
          {formatChancePct(normalized.items[0]?.chance ?? 0)}
        </p>
      </div>
    </div>
  );
}
