# ACTION-RECIPES.md — Drops & packs (new value + recovery)

**PX:** Operator continuity §11 · [ECOSYSTEM-RESILIENCE.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md)  
**Full comparison:** [PLATFORM-CONTRACTS.md](./PLATFORM-CONTRACTS.md)

## Trust labels

| Label | Meaning |
|-------|--------|
| `recommended-for-new-value` | Atomic-standard or contracts you control |
| `recovery` | Finish existing unbox/claim when product UI is gone |
| `avoid-new-value` | Do not deposit fresh high value |

---

## A. Forward path — Atomic packs (`atomicpacksx`)

**Trust:** `recommended-for-new-value`

```
1) atomicassets::transfer
     from: <user>
     to: atomicpacksx
     asset_ids: [<pack_asset_id>]
     memo: unbox

2) Wait for RNG / poll atomicpacksx tables:
     unboxassets (scope = pack_asset_id)
     unboxpacks

3) atomicpacksx::claimunboxed
     pack_asset_id: <pack_asset_id>
     origin_roll_ids: [0, 1, …, n-1]  // only ids still in table
```

---

## B. Forward path — Atomic drops (`atomicdropsx`)

**Trust:** `recommended-for-new-value` (per drop)

```
atomicdropsx::claimdrop
  claimer, drop_id, claim_amount,
  intended_delphi_median, referrer, country
+ payment transfer per drop rules (verify)
```

---

## C. Recovery — Nefty packs (`neftyblocksp`)

**Trust:** `recovery` · **`avoid-new-value`**

```
1) atomicassets::transfer → neftyblocksp, memo: unbox
2) neftyblocksp::claim
     claim_id: <id>           // VERIFY in tables / history
     roll_indexes: [0, 1, …]
```

Do not use Atomic field names here. Platform ownership/UI trust is weak — claim existing positions only.

---

## D. Recovery — Nefty drops (`neftyblocksd`)

**Trust:** `recovery` · **`avoid-new-value`**

```
neftyblocksd::assertprice (when required)
neftyblocksd::claimdrop
  claimer, drop_id, amount, …
```

---

## E. Recovery — NFTHive packs (`nfthivepacks`)

**Trust:** `recovery` · **`avoid-new-value`**

```
nfthivepacks::claimunpack
  pack_asset_id: <id>
```

Confirm unbox transfer target from **this asset’s** history; do not assume Atomic memo flow.

---

## F. Recovery — NFTHive drops (`nfthivedrops`)

**Trust:** `recovery` · **`avoid-new-value`**

```
nfthivedrops::claimdrop
  claimer, drop_id, amount, …
+ deposit transfer rules (verify)
```

---

## Detection checklist

1. Inventory → pack asset ids  
2. Transfer history → which account received the pack / `unbox`  
3. Explorer ABI → match claim action  
4. Sign only after confirm dialog lists contract + action + ids  

RAM/balance leftovers (Nefty-class): see `wax-neftyblocks-RAM-sweeper`.

---

*Pixel Journey — verify on explorer before every sign.*
