# Verification Log

Honest record of what has and has not been tested.
Never mark something verified without running it and recording evidence.

## Status legend
- `VERIFIED` — ran against live endpoint or unit test
- `UNTESTED` — code exists, never executed
- `BROKEN` — ran, failed
- `N/A` — not applicable

## Claims in this repo
| Claim | Status | Evidence |
| --- | --- | --- |
| Probability breakdown is transparent and non-manipulative | UNTESTED | ProbabilityBreakdown.tsx |
| Reveal respects prefers-reduced-motion | UNTESTED | RevealAnimation.tsx |
| Claim flow previews before sign and supports rollback pattern | UNTESTED | ClaimFlow.tsx |
| Recovery path documents action recipes without inventing accounts | UNTESTED | ACTION-RECIPES.md + RecoveryClaimPanel.tsx |
| Demo runs with mock data (zero network) | UNTESTED | examples/demo.tsx |

## How to verify
```bash
# Typecheck
npm run typecheck

# (Future) Unit tests on probability helpers if extracted
```

**Trust label:** educational-reference
