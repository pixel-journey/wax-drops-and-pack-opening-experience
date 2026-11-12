/**
 * Pure preview of AtomicPacks claimunboxed checks.
 * Source: pinknetworkx/atomicpacks-contract src/unboxing.cpp
 * (ACTION atomicpacks::claimunboxed)
 *
 * Not on-chain. Not compiled. No broadcast.
 * Exact refusal strings from the contract source.
 */

export interface ClaimPreviewInput {
  packAssetId: string;
  originRollIds: string[];
  /** Whether an unboxpacks row exists for this pack_asset_id. */
  unboxpackExists?: boolean;
  /** Whether the caller is the unboxer or the contract itself. */
  authorized?: boolean;
  /** For each origin_roll_id, whether the unboxassets row still exists. */
  rollsPresent?: Record<string, boolean>;
  /** template_id for a roll; -1 means skip mint (no asset created). */
  rollTemplates?: Record<string, number>;
}

export interface ClaimPreviewResult {
  ok: boolean;
  refusal?: string;
  notes: string[];
  mints: string[];
  skips: string[];
}

export function previewClaimUnboxed(input: ClaimPreviewInput): ClaimPreviewResult {
  const notes: string[] = [];
  const mints: string[] = [];
  const skips: string[] = [];

  if (input.unboxpackExists === false) {
    return {
      ok: false,
      refusal: "No unboxpack with this pack asset id exists",
      notes,
      mints,
      skips,
    };
  }

  if (input.authorized === false) {
    return {
      ok: false,
      refusal:
        "The transaction needs to be authorized either by the unboxer or by the contract itself",
      notes,
      mints,
      skips,
    };
  }

  if (input.originRollIds.length === 0) {
    return {
      ok: false,
      refusal: "The original roll ids vector can't be empty",
      notes,
      mints,
      skips,
    };
  }

  for (const rollId of input.originRollIds) {
    if (input.rollsPresent && input.rollsPresent[rollId] === false) {
      return {
        ok: false,
        refusal: `No unbox asset with the origin roll id ${rollId} exists`,
        notes,
        mints,
        skips,
      };
    }

    const templateId = input.rollTemplates?.[rollId];
    if (templateId === -1) {
      skips.push(rollId);
      notes.push(`Roll ${rollId}: template_id = -1 → no mint, row erased only.`);
    } else if (templateId !== undefined) {
      mints.push(rollId);
      notes.push(
        `Roll ${rollId}: template_id = ${templateId} → mintasset if max_supply == 0 (locked templates are skipped).`
      );
    }
  }

  notes.push(
    "On success: erase claimed unboxassets rows. When the last row is gone, erase unboxpacks and refund the reserved RAM bytes (112 + 264)."
  );
  notes.push(
    "RAM accounting: +151 per minted asset (min size), -124 per erased unboxassets row, optional +112 if first asset for unboxer. Collection RAM balance is adjusted."
  );

  return { ok: true, notes, mints, skips };
}
