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
  fetchPackSummary,
  type PackAssetSummary,
} from '../examples/live/atomicassets';
import {
  PLATFORM_PRESETS,
  type PlatformClaimPreset,
} from '../examples/platformPresets';

type Mode = 'demo' | 'live';

export default function DropsAndPackPage() {
  const [mode, setMode] = useState<Mode>('demo');
  const [assetId, setAssetId] = useState(SMOKE_PACK_ASSET_ID);
  const [pack, setPack] = useState<PackAssetSummary | null>(null);
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

  const loadLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    setRolled(null);
    try {
      const { pack: p, source } = await fetchPackSummary(assetId);
      setPack(p);
      setMeta(
        `${p.name} · ${p.odds.length} odds rows · ${source}` +
          (p.contentsText ? ` · contents: ${p.contentsText}` : '')
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Live fetch failed');
      setPack(null);
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
            Pixel Journey · Atomic forward path · Nefty/Hive recovery recipes
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
            Live pack asset
          </button>
        </div>

        {mode === 'live' && (
          <div className="border border-white/10 bg-black/40 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="packAsset">
                Pack asset id
              </label>
              <input
                id="packAsset"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
                placeholder="asset_id"
              />
              <button
                type="button"
                onClick={loadLive}
                disabled={loading || !assetId.trim()}
                className="px-6 py-3 rounded-xl bg-sky-600 text-sm disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Load pack'}
              </button>
            </div>
            <p className="text-[11px] opacity-50">
              Detect stack via transfer history + authorized_accounts — see PLATFORM-CONTRACTS.md.
            </p>
          </div>
        )}

        {error && (
          <div role="alert" className="text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {meta && <p className="text-xs opacity-50 break-all">{meta}</p>}

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
            <p>authorized_accounts: {pack.authorizedAccounts.join(', ') || '—'}</p>
          </section>
        )}

        <section className="border border-white/10 bg-black/40 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold tracking-wide">Platform claim preset</h2>
          <label className="block text-xs opacity-70" htmlFor="preset">
            Contract stack
          </label>
          <select
            id="preset"
            value={preset.id}
            onChange={(e) => setPresetId(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm"
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
            console.info('Claim prepare (educational):', payload, preset.trust);
          }}
        />

        <p className="text-xs opacity-50">
          See <code className="text-emerald-400/80">PLATFORM-CONTRACTS.md</code> and{' '}
          <code className="text-emerald-400/80">ACTION-RECIPES.md</code>. Prefer Atomic for new
          value; Nefty/Hive presets are recovery-oriented.
        </p>

        <p className="text-[10px] opacity-40">
          Sample odds: {normalized.items[0]?.name}{' '}
          {formatChancePct(normalized.items[0]?.chance ?? 0)}
        </p>
      </div>
    </div>
  );
}
