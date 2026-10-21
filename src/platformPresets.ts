/**
 * Educational presets for pack/drop claim panels.
 * Always verify ABI on explorer before signing.
 */

export type TrustLabel =
  | "recommended-for-new-value"
  | "recovery"
  | "avoid-new-value";

export interface PlatformClaimPreset {
  id: string;
  label: string;
  contractAccount: string;
  actionName: string;
  fieldHints: string[];
  trust: TrustLabel;
  /** Short open-flow hint */
  openHint: string;
}

export const PLATFORM_PRESETS: PlatformClaimPreset[] = [
  {
    id: "atomic-packs",
    label: "Atomic packs (atomicpacksx)",
    contractAccount: "atomicpacksx",
    actionName: "claimunboxed",
    fieldHints: ["pack_asset_id", "origin_roll_ids"],
    trust: "recommended-for-new-value",
    openHint:
      'Step 1: atomicassets::transfer to atomicpacksx with memo "unbox". Step 2: claimunboxed.',
  },
  {
    id: "atomic-drops",
    label: "Atomic drops (atomicdropsx)",
    contractAccount: "atomicdropsx",
    actionName: "claimdrop",
    fieldHints: [
      "claimer",
      "drop_id",
      "claim_amount",
      "intended_delphi_median",
      "referrer",
      "country",
    ],
    trust: "recommended-for-new-value",
    openHint: "Pay per drop rules, then claimdrop. Verify price fields on explorer.",
  },
  {
    id: "nefty-packs",
    label: "Nefty packs (neftyblocksp) — recovery only",
    contractAccount: "neftyblocksp",
    actionName: "claim",
    fieldHints: ["claim_id", "roll_indexes"],
    trust: "avoid-new-value",
    openHint:
      'Transfer to neftyblocksp memo "unbox", then claim. Not recommended for new deposits.',
  },
  {
    id: "nefty-drops",
    label: "Nefty drops (neftyblocksd) — recovery only",
    contractAccount: "neftyblocksd",
    actionName: "claimdrop",
    fieldHints: ["claimer", "drop_id", "amount", "currency"],
    trust: "avoid-new-value",
    openHint: "Legacy drop claim path. Avoid new high-value deposits.",
  },
  {
    id: "hive-packs",
    label: "NFTHive packs (nfthivepacks) — recovery only",
    contractAccount: "nfthivepacks",
    actionName: "claimunpack",
    fieldHints: ["pack_asset_id"],
    trust: "avoid-new-value",
    openHint: "claimunpack(pack_asset_id). Verify unbox history for this asset first.",
  },
  {
    id: "hive-drops",
    label: "NFTHive drops (nfthivedrops) — recovery only",
    contractAccount: "nfthivedrops",
    actionName: "claimdrop",
    fieldHints: ["claimer", "drop_id", "amount", "currency"],
    trust: "avoid-new-value",
    openHint: "Legacy Hive drop claim. Avoid new deposits.",
  },
];

export function presetById(id: string): PlatformClaimPreset | undefined {
  return PLATFORM_PRESETS.find((p) => p.id === id);
}
