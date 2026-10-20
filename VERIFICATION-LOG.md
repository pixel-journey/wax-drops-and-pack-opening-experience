# VERIFICATION-LOG — wax-drops-and-pack-opening-experience

**Trust label:** `educational-reference`  
**Updated:** 2026-10-20 (pass 1)

| Claim | Status | Evidence |
|-------|--------|----------|
| normalizeOdds renormalizes non-unit sums | **verified** (unit) | `examples/engines.test.ts` |
| parseContentsOdds reads `65% Common` and `%1 Mythic` | **verified** (unit) | same |
| rollFromOdds deterministic for fixed u | **verified** (unit) | same |
| Live pack asset fetch + contents parse | **verified** (smoke) | `1100003609672` Chicken Pack contents string |
| Reveal respects prefers-reduced-motion | **untested** | RevealAnimation.tsx |
| Claim flow with real WharfKit session | **untested** | ClaimFlow / useDropOpening |
| Recovery panel is non-broadcasting | **partial** | RecoveryClaimPanel only prepare + confirm |
| Demo offline open | **partial** | app/page.tsx demo mode |

## Live smoke (2026-10-20)

```bash
curl -sS "https://wax.api.atomicassets.io/atomicassets/v1/assets/1100003609672"
```

Observed: schema `packs`, contents  
`65% Common - 20% Uncommon - 8% Rare - 4% Epic - 2% Legendary - %1 Mythic`,  
authorized_accounts includes collection + `atomicpacksx`-class notifier.

## How to re-run

```bash
npm install && npm test && npm run typecheck
```

## Next pass

- Owner pack inventory list UI
- Optional atomicpacksx ABI documentation only after explorer verify
- a11y audit on reveal
