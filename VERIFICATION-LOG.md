# VERIFICATION-LOG — wax-drops-and-pack-opening-experience

**Trust label:** `educational-reference`  
**Updated:** 2026-10-20 (WharfKit claimunboxed)

| Claim | Status | Evidence |
|-------|--------|----------|
| Odds engines | **verified** (unit) | `engines.test.ts` |
| Stack detect | **verified** (unit) | `stackDetect.test.ts` |
| `buildClaimUnboxedAction` | **verified** (unit) | `wharf/claimUnboxed.test.ts` |
| `claimUnboxedWithSession` mock transact | **verified** (unit) | same |
| Live unboxassets poll | **verified** (smoke) | scope `1100003553120` |
| Real wallet SessionKit login + broadcast | **untested** in CI | requires installed peers + Anchor/Cloud |
| Dry-run session path | **partial** | `createDryRunSession` + panel UI |

## Install peers for live wallet

```bash
npm i @wharfkit/session @wharfkit/web-renderer \
  @wharfkit/wallet-plugin-anchor @wharfkit/wallet-plugin-cloudwallet
```

## How to re-run

```bash
npm install && npm test && npm run typecheck
```
