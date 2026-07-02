import { useState, useCallback } from 'react';
import type { Session } from '@wharfkit/session';

interface DropResult {
  id: string;
  claimed?: boolean;
  [key: string]: any;
}

interface UseDropOpeningOptions {
  session: Session | null;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

/**
 * Custom hook for managing the full drop/pack opening flow.
 * 
 * Features:
 * - Manages revealing + claiming state
 * - Optimistic UI updates with rollback
 * - Clean error handling
 * - Easy to integrate with any UI
 */
export function useDropOpening({ session, onSuccess, onError }: UseDropOpeningOptions) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [result, setResult] = useState<DropResult | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startReveal = useCallback(() => {
    setIsRevealing(true);
    setError(null);
  }, []);

  const completeReveal = useCallback((dropResult: DropResult) => {
    setIsRevealing(false);
    setResult(dropResult);
  }, []);

  const claim = useCallback(async () => {
    if (!session || !result) return;

    setIsClaiming(true);
    setError(null);

    // Optimistic update
    const optimisticResult = { ...result, claimed: true };
    setResult(optimisticResult);

    try {
      const tx = await session.transact({
        actions: [
          {
            account: 'atomicassets',
            name: 'claimdrop',
            data: {
              // Add claim parameters here
            },
          },
        ],
      });

      if (onSuccess) onSuccess(tx);
      return tx;
    } catch (err: any) {
      // Rollback on failure
      setResult(result);
      const message = err?.message || 'Failed to claim drop';
      setError(message);
      if (onError) onError(err);
      throw err;
    } finally {
      setIsClaiming(false);
    }
  }, [session, result, onSuccess, onError]);

  const reset = useCallback(() => {
    setIsRevealing(false);
    setResult(null);
    setIsClaiming(false);
    setError(null);
  }, []);

  return {
    isRevealing,
    result,
    isClaiming,
    error,
    startReveal,
    completeReveal,
    claim,
    reset,
  };
}
