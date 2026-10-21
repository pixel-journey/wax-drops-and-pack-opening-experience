import {
  claimUnboxedWithSession,
  type ClaimUnboxedParams,
} from "./wharf/claimUnboxed";
import type { SessionLike } from "./wharf/types";

interface ClaimOptions {
  session: SessionLike;
  params: ClaimUnboxedParams;
  updateUI?: (claimed: boolean) => void;
  onError?: (error: unknown) => void;
  onSuccess?: (result: { transactionId?: string; raw?: unknown }) => void;
}

/**
 * Optimistic claimunboxed with rollback on failure.
 */
export async function claimWithOptimisticUpdate({
  session,
  params,
  updateUI,
  onError,
  onSuccess,
}: ClaimOptions) {
  updateUI?.(true);
  try {
    const result = await claimUnboxedWithSession(session, params);
    onSuccess?.(result);
    return result;
  } catch (error) {
    updateUI?.(false);
    onError?.(error);
    throw error;
  }
}

export function handleClaimError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);

  if (/insufficient/i.test(message)) {
    return "Not enough CPU/NET/RAM to claim. Try again or use a resource provider.";
  }
  if (/network|timeout/i.test(message)) {
    return "Network issue. Check connection and retry.";
  }
  if (/WharfKit packages not available/i.test(message)) {
    return message;
  }
  return message || "Claim failed. Verify pack_asset_id and origin_roll_ids on explorer.";
}
