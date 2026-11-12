/**
 * Pure preview of AtomicPacks receive_asset_transfer checks.
 * Source: pinknetworkx/atomicpacks-contract src/unboxing.cpp
 * (receive_asset_transfer function)
 *
 * Not on-chain. Not compiled. No broadcast.
 * These strings are the exact check messages the contract emits.
 */

export interface UnboxPreviewInput {
  to: string;
  assetIds: string[];
  memo: string;
  /** Whether the asset has a template_id != -1 (contract checks this after transfer). */
  hasTemplate?: boolean;
  /** Whether packs table has a row for this template_id. */
  packExistsForTemplate?: boolean;
  /** Current time vs pack unlock_time (seconds since epoch). */
  unlocked?: boolean;
}

export interface UnboxPreviewResult {
  ok: boolean;
  refusal?: string;
  notes: string[];
}

export function previewUnbox(input: UnboxPreviewInput): UnboxPreviewResult {
  const notes: string[] = [];

  if (input.to !== "atomicpacksx") {
    return { ok: false, refusal: "Destination is not atomicpacksx (receive_asset_transfer returns early)", notes };
  }

  if (input.assetIds.length !== 1) {
    return {
      ok: false,
      refusal: "Only one pack can be opened at a time",
      notes,
    };
  }

  if (input.memo !== "unbox") {
    return { ok: false, refusal: "Invalid memo", notes };
  }

  notes.push("Memo and single-asset checks passed (exact strings from unboxing.cpp).")

  if (input.hasTemplate === false) {
    return {
      ok: false,
      refusal: "The transferred asset does not belong to a template",
      notes,
    };
  }

  if (input.packExistsForTemplate === false) {
    return {
      ok: false,
      refusal: "The transferred asset's template does not belong to any pack",
      notes,
    };
  }

  if (input.unlocked === false) {
    return { ok: false, refusal: "The pack has not unlocked yet", notes };
  }

  notes.push(
    "On success the contract reserves RAM, emplaces unboxpacks, and sends requestrand to orng.wax with assoc_id = pack asset id."
  );
  notes.push("NFTs are not minted at this stage. Results land later in unboxassets after the RNG callback.");

  return { ok: true, notes };
}
