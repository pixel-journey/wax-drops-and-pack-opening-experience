# VERIFICATION-LOG — wax-drops-and-pack-opening-experience

**Trust label:** `educational-reference`  
**Updated:** 2026-10-20 (platform contracts pass)

| Claim | Status | Evidence |
|-------|--------|----------|
| normalizeOdds / parseContentsOdds / rollFromOdds | **verified** (unit) | `engines.test.ts` |
| Live pack contents parse | **verified** (smoke) | asset `1100003609672` |
| Atomic pack flow: transfer+unbox → claimunboxed | **verified** (live txs / docs) | mainnet txs + pinknetworkx atomicpacks README |
| Atomic drop claimdrop on atomicdropsx | **verified** (Hyperion) | `claimdrop` action samples |
| Nefty pack: transfer→neftyblocksp unbox + claim | **verified** (live txs) | claim_id + roll_indexes |
| Nefty drop: neftyblocksd claimdrop | **verified** (live txs) | |
| NFTHive pack: nfthivepacks claimunpack | **verified** (live txs) | pack_asset_id only |
| NFTHive drop: nfthivedrops claimdrop | **verified** (live txs) | |
| WharfKit end-to-end sign | **untested** | |
| Reveal reduced-motion | **untested** | |

## Platform research notes (2026-10-20)

Documented in `PLATFORM-CONTRACTS.md` / `ACTION-RECIPES.md` / `examples/platformPresets.ts`.

**Forward:** `atomicpacksx`, `atomicdropsx`  
**Recovery / avoid-new-value:** `neftyblocksp`, `neftyblocksd`, `nfthivepacks`, `nfthivedrops`

Nefty/Hive remain on-chain-executable in sampled txs; product UIs and operator trust are the risk — not “contracts vanished.”

## How to re-run

```bash
npm install && npm test && npm run typecheck
```
