import { useState, useCallback } from "react";
import { claimUnboxedWithSession } from "./wharf/claimUnboxed";
import type { SessionLike } from "./wharf/types";

interface DropResult {
  id: string;
  claimed?: boolean;
  packAssetId?: string;
  originRollIds?: number[];
  [key: string]: unknown;
}

interface UseDropOpeningOptions {
  session: SessionLike | null;
  onSuccess?: (result: unknown) => void;
  onError?: (error: unknown) => void;
}

export function useDropOpening({
  session,
  onSuccess,
  onError,
}: UseDropOpeningOptions) {
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
    if (!session || !result?.packAssetId || !result.originRollIds?.length) {
      setError("Session and pack_asset_id + origin_roll_ids required");
      return;
    }

    setIsClaiming(true);
    setError(null);
    const previous = result;
    setResult({ ...result, claimed: true });

    try {
      const tx = await claimUnboxedWithSession(session, {
        packAssetId: result.packAssetId,
        originRollIds: result.originRollIds,
      });
      onSuccess?.(tx);
      return tx;
    } catch (err: unknown) {
      setResult(previous);
      const message =
        err instanceof Error ? err.message : "Failed to claimunboxed";
      setError(message);
      onError?.(err);
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
