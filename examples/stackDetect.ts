/**
 * Pure helpers: suggest pack stack from collection authorized_accounts / notify hints.
 * Not a guarantee — transfer history still wins.
 */

export type PackStackId =
  | "atomic-packs"
  | "nefty-packs"
  | "hive-packs"
  | "unknown";

export interface StackSuggestion {
  stackId: PackStackId;
  /** platformPresets id when known */
  presetId: string | null;
  confidence: "high" | "medium" | "low";
  matchedAccounts: string[];
  note: string;
}

const ATOMIC_HINTS = ["atomicpacksx", "atomicdropsx"];
const NEFTY_HINTS = ["neftyblocksp", "neftyblocksd", "neftyblocksx", "blend.nefty"];
const HIVE_HINTS = ["nfthivepacks", "nfthivedrops", "nfthivecraft"];

function matches(list: string[], hints: string[]): string[] {
  const lower = list.map((a) => a.toLowerCase());
  return hints.filter((h) => lower.includes(h.toLowerCase()));
}

/**
 * Rank stacks by authorized/notify account overlap.
 * Prefer explicit pack contracts over soft hints (blend.nefty).
 */
export function suggestStackFromAccounts(
  accounts: string[],
  options: { preferPackContracts?: boolean } = {}
): StackSuggestion {
  const prefer = options.preferPackContracts !== false;
  const atomic = matches(accounts, prefer ? ["atomicpacksx"] : ATOMIC_HINTS);
  const nefty = matches(accounts, prefer ? ["neftyblocksp"] : NEFTY_HINTS);
  const hive = matches(accounts, prefer ? ["nfthivepacks"] : HIVE_HINTS);

  // Soft fallbacks if strict pack account missing
  const atomicSoft = atomic.length ? atomic : matches(accounts, ATOMIC_HINTS);
  const neftySoft = nefty.length ? nefty : matches(accounts, NEFTY_HINTS);
  const hiveSoft = hive.length ? hive : matches(accounts, HIVE_HINTS);

  const scored: { id: PackStackId; presetId: string; hits: string[]; weight: number }[] = [
    {
      id: "atomic-packs",
      presetId: "atomic-packs",
      hits: atomicSoft,
      weight: atomicSoft.some((h) => h === "atomicpacksx") ? 3 : atomicSoft.length ? 1 : 0,
    },
    {
      id: "nefty-packs",
      presetId: "nefty-packs",
      hits: neftySoft,
      weight: neftySoft.some((h) => h === "neftyblocksp") ? 3 : neftySoft.length ? 1 : 0,
    },
    {
      id: "hive-packs",
      presetId: "hive-packs",
      hits: hiveSoft,
      weight: hiveSoft.some((h) => h === "nfthivepacks") ? 3 : hiveSoft.length ? 1 : 0,
    },
  ];

  scored.sort((a, b) => b.weight - a.weight);
  const top = scored[0];
  if (!top || top.weight === 0) {
    return {
      stackId: "unknown",
      presetId: null,
      confidence: "low",
      matchedAccounts: [],
      note: "No known pack contract in authorized_accounts — check transfer history for unbox target.",
    };
  }

  const confidence: StackSuggestion["confidence"] =
    top.weight >= 3 ? "high" : top.weight >= 1 ? "medium" : "low";

  return {
    stackId: top.id,
    presetId: top.presetId,
    confidence,
    matchedAccounts: top.hits,
    note:
      confidence === "high"
        ? `Matched pack contract ${top.hits.join(", ")}. Still verify with transfer memo/history.`
        : `Weak hint via ${top.hits.join(", ")}. Confirm unbox destination on explorer before signing.`,
  };
}
