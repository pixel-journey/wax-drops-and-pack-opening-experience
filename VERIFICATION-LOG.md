# VERIFICATION-LOG — wax-drops-and-pack-opening-experience

**Updated:** 2026-10-20 (transfer + memo unbox)

| Claim | Status | Evidence |
|-------|--------|----------|
| `buildUnboxTransferAction` → atomicpacksx memo unbox | **verified** (unit) | `wharf/unboxTransfer.test.ts` |
| Rejects non-unbox memo for atomicpacksx | **verified** (unit) | same |
| `buildClaimUnboxedAction` | **verified** (unit) | `wharf/claimUnboxed.test.ts` |
| unboxassets poll | **verified** (smoke) | live table rows |
| Live wallet broadcast | **untested** in CI | optional peers |

## Full path

1. `unboxTransferWithSession` — `atomicassets::transfer`  
2. `fetchUnboxProgress` — tables  
3. `claimUnboxedWithSession` — `claimunboxed`

```bash
npm test && npm run typecheck
```
