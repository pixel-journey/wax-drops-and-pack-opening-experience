'use client';

import { useState } from 'react';
import { RevealAnimation } from './RevealAnimation';
import { ProbabilityBreakdown } from './ProbabilityBreakdown';
import { claimWithOptimisticUpdate, handleClaimError } from './ClaimFlow';
import { useDropOpening } from './useDropOpening';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Simple demo showing how to compose the example components together.
 * This is for illustration purposes.
 */
export default function DropOpeningDemo() {
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { 
    isRevealing, 
    result: hookResult, 
    isClaiming, 
    error, 
    startReveal, 
    completeReveal, 
    claim, 
    reset 
  } = useDropOpening({
    session: null, // In real app, pass real WharfKit session
    onSuccess: (tx) => console.log('Claim successful', tx),
    onError: (err) => console.error('Claim failed', err),
  });

  const mockProbabilities = [
    { name: 'Common Item', chance: 0.6, color: '#22c55e' },
    { name: 'Rare Item', chance: 0.3, color: '#eab308' },
    { name: 'Legendary Item', chance: 0.1, color: '#a855f7' },
  ];

  const handleOpen = () => {
    setIsOpening(true);
    startReveal();

    // Simulate reveal after delay
    setTimeout(() => {
      const mockResult = { id: 'drop-123', item: 'Rare Sword' };
      completeReveal(mockResult);
      setResult(mockResult);
      setIsOpening(false);
    }, 1200);
  };

  const handleClaim = async () => {
    if (!result) return;
    try {
      await claim();
    } catch (e) {
      // Error already handled in the hook
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-md mx-auto p-6 space-y-6">
        <h2 className="text-xl font-bold">Drop Opening Demo</h2>

        <ProbabilityBreakdown items={mockProbabilities} />

        <button
          onClick={handleOpen}
          disabled={isOpening || isRevealing}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl font-medium transition-colors"
        >
          Open Drop
        </button>

        <RevealAnimation isRevealing={isRevealing}>
          <div className="text-center p-8 border border-white/10 rounded-2xl">
            Revealing...
          </div>
        </RevealAnimation>

        {result && (
          <div className="p-4 border border-white/10 rounded-xl">
            <p className="mb-4">You received: <strong>{result.item}</strong></p>
            
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full px-6 py-2 bg-white text-black rounded-xl font-medium disabled:opacity-50"
            >
              {isClaiming ? 'Claiming...' : 'Claim Reward'}
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <button onClick={reset} className="text-sm underline opacity-70">
          Reset Demo
        </button>
      </div>
    </ErrorBoundary>
  );
}
