# wax-drops-and-pack-opening-experience

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **Status:** 🔄 Phase 2 · Pass 1 (pure odds engines + live pack parse)  
> **Category:** Atomic Ecosystem – Drops & Pack Openings  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)  
> **Continuity:** [ECOSYSTEM-RESILIENCE.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md) · PX §11

**Goal:** Reference-quality **drop and pack opening UX** on WAX — transparent probabilities, accessible reveals, safe claim flows — plus a **calm recovery path** when a commercial frontend is offline.

---

## Two modes (do not mix them up)

| Mode | Trust | Intent |
|------|--------|--------|
| **Product experience** | `recommended-for-new-value` when you control the contract | Joyful, fair opens for *your* drops/packs |
| **Recovery** | `recovery` / `avoid-new-value` for legacy platforms | Claim/unpack when a vendor UI is gone |

---

## Quick start

```bash
npm install
npm test
npm run typecheck
npm run dev
```

```ts
import { normalizeOdds, parseContentsOdds, rollFromOdds, demoOdds } from "./examples/engines";
import { fetchPackSummary } from "./examples/live/atomicassets";

const odds = parseContentsOdds("65% Common - 20% Uncommon - 8% Rare");
const { items } = normalizeOdds(odds);
const { item } = rollFromOdds(items, 0.7); // educational client RNG only

const live = await fetchPackSummary("1100003609672");
```

---

## Pure engines

| Function | Role |
|----------|------|
| `normalizeOdds` | Renormalize tables that do not sum to 1 |
| `parseContentsOdds` | Parse human "65% Common" contents strings |
| `rollFromOdds` | Deterministic pick from cumulative odds |

**Honesty:** Parsed pack contents and client rolls are **display/education**. On-chain pack RNG and contract logic may differ.

---

## Examples

- `engines.ts` / `engines.test.ts` — pure probability
- `live/atomicassets.ts` — pack asset summary + owner packs query
- `RevealAnimation.tsx`, `ProbabilityBreakdown.tsx`, `ClaimFlow.tsx`
- `RecoveryClaimPanel.tsx` — offline-frontend recovery UX (no auto-broadcast)
- `ACTION-RECIPES.md` — recovery documentation
- `app/page.tsx` — Demo open + live pack load + recovery panel

---

## Learning outcomes

- Ship fair probability UX (visual + text)
- Parse and normalize imperfect marketing odds strings
- Separate product claim flows from **recovery** paths
- Never invent third-party contract accounts — verify on explorer

---

## Best practices

**Do:** show odds, respect `prefers-reduced-motion`, confirm before sign, document ABI in git for critical claims.  
**Don’t:** hide odds, treat a vendor domain as permanent infrastructure, encourage new deposits into unmaintained shared pack platforms.

---

## Related

- `wax-neftyblocks-RAM-sweeper`
- `wax-seizure-safe-pack-opening-canvas`
- `wax-pity-system-and-guaranteed-rewards`
- `wax-screen-reader-accessible-inventory`

## License

MIT — **Pixel Journey**
