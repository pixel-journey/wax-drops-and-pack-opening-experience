# VERIFICATION-LOG — wax-drops-and-pack-opening-experience

**Trust label:** `educational-reference`  
**Updated:** 2026-10-20 (inventory + unbox progress)

| Claim | Status | Evidence |
|-------|--------|----------|
| Odds engines | **verified** (unit) | `engines.test.ts` |
| Stack detect atomic/nefty/hive | **verified** (unit) | `stackDetect.test.ts` |
| Live pack contents parse | **verified** (smoke) | `1100003609672` |
| `unboxassets` schema + poll | **verified** (smoke) | scope `1100003553120` → rolls template_id 896941 |
| `unboxpacks` rows exist | **verified** (smoke) | greymass get_table_rows |
| Owner inventory list | **partial** | adapter + UI; needs manual owner with packs |
| WharfKit claimunboxed broadcast | **untested** | |

## Unbox progress smoke (2026-10-20)

```bash
curl -sS https://wax.greymass.com/v1/chain/get_table_rows \
  -d '{"code":"atomicpacksx","scope":"1100003553120","table":"unboxassets","limit":20,"json":true}'
```

Observed rows: `origin_roll_id` + `template_id`. Pending packs clear after `claimunboxed`.

## How to re-run

```bash
npm install && npm test && npm run typecheck
```
