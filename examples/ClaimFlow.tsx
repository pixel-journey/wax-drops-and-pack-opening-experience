import type { Session } from '@wharfkit/session';

interface ClaimOptions {
  session: Session;
  dropResult: any;
  updateUI: (result: any) => void;
  onError: (error: any) => void;
  onSuccess?: (result: any) => void;
}

/**
 * Production-ready optimistic claiming flow with safe rollback.
 * 
 * Best practices included:
 * - Optimistic UI update for perceived performance
 * - Safe rollback on failure
 * - Clear error handling
 * - Type-safe with WharfKit
 */
export async function claimWithOptimisticUpdate({
  session,
  dropResult,
  updateUI,
  onError,
  onSuccess,
}: ClaimOptions) {
  // Optimistically update the UI immediately
  const optimisticResult = { ...dropResult, claimed: true };
  updateUI(optimisticResult);

  try {
    const result = await session.transact({
      actions: [
        {
          account: 'atomicassets',
          name: 'claimdrop',
          data: {
            // Add your claim parameters here
            // owner: session.actor,
            // ... other data
          },
        },
      ],
    });

    // Optional: Confirm final state from chain
    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    // Rollback optimistic update on failure
    updateUI({ ...dropResult, claimed: false });
    onError(error);
    throw error;
  }
}

/**
 * Example error handler with user-friendly messages
 */
export function handleClaimError(error: any) {
  if (error?.message?.includes('insufficient')) {
    return 'Not enough resources to claim this drop. Please try again later.';
  }

  if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
    return 'Network issue detected. Please check your connection and try again.';
  }

  return 'Something went wrong while claiming. Please try again.';
}
