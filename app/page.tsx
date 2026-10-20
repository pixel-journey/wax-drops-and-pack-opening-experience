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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl tracking-widest text-emerald-400 font-bold">
            DROPS & PACK OPENING
          </h1>
          <p className="text-xs opacity-60 mt-1">
            Pixel Journey · Transparent odds · Recovery-aware claims
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
              Prefill smoke id has a human contents odds string. Parsed odds are for
              display education — on-chain RNG may differ.
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
          <ProbabilityBreakdown
            items={normalized.items}
            showExpectedValue
          />
          {normalized.wasRenormalized && (
            <p className="text-xs text-amber-300/80">{normalized.methodologyNote}</p>
          )}
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
            <p className="text-[11px] opacity-50 text-center">
              Demo roll is local educational RNG — not on-chain randomness.
            </p>
          </section>
        )}

        {mode === 'live' && pack && (
          <section className="text-xs opacity-70 space-y-1 font-mono">
            <p>collection: {pack.collection ?? '—'}</p>
            <p>schema: {pack.schema ?? '—'}</p>
            <p>authorized_accounts: {pack.authorizedAccounts.join(', ') || '—'}</p>
            <p className="text-amber-200/70">{pack.recoveryHints.note}</p>
          </section>
        )}

        <RecoveryClaimPanel
          contractAccount="VERIFY_ON_EXPLORER"
          actionName="unpack | claim (ABI)"
          fieldHints={['asset_ids', 'owner']}
          onPrepareClaim={(payload) => {
            console.info('Recovery prepare (educational):', payload);
          }}
        />

        <p className="text-xs opacity-50">
          Pure: <code className="text-emerald-400/80">normalizeOdds</code>,{' '}
          <code className="text-emerald-400/80">parseContentsOdds</code>,{' '}
          <code className="text-emerald-400/80">rollFromOdds</code>. See ACTION-RECIPES.md
          and catalog ECOSYSTEM-RESILIENCE.
        </p>

        <p className="text-[10px] opacity-40">
          Sample odds row: {normalized.items[0]?.name}{' '}
          {formatChancePct(normalized.items[0]?.chance ?? 0)}
        </p>
      </div>
    </div>
  );
}
