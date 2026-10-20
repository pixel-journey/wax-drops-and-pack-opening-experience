# PLATFORM-CONTRACTS.md — WAX packs & drops by platform

**Last verified (public chain samples):** 2026-10-20  
**Tone:** Operational. Trust labels only — not a grievance narrative.  
**Always re-verify ABI + authorities on an explorer before signing.**

Related: [ACTION-RECIPES.md](./ACTION-RECIPES.md) · [ECOSYSTEM-RESILIENCE.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md)

---

## Snapshot (as the scene looks today)

| Platform family | Pack contract (mainnet) | Drop contract (mainnet) | Product UI | Trust for **new** value |
|-----------------|-------------------------|-------------------------|------------|-------------------------|
| **Atomic / AtomicHub path** | `atomicpacksx` | `atomicdropsx` | Still the standard public infrastructure path | **`recommended-for-new-value`** when using Atomic-standard flows you understand |
| **NeftyBlocks-class** | `neftyblocksp` | `neftyblocksd` | Domain / product continuity unreliable; ownership of platform reported changed | **`recovery`** / **`avoid-new-value`** |
| **NFTHive-class** | `nfthivepacks` | `nfthivedrops` | Product surface largely offline / reduced | **`recovery`** / **`avoid-new-value`** |

**Forward guidance for Pixel Journey users and creators**

- Prefer **AtomicPacks (`atomicpacksx`) + AtomicDrops (`atomicdropsx`)** (or contracts **you** control with published ABIs) for new launches and new deposits.
- Keep **Nefty / NFTHive** recipes in this repo so holders can still **finish unbox/claim** if assets sit mid-flow — not so anyone treats those platforms as a default for new high-value activity.
- A website is never the source of truth; tables + actions are.

---

## 1. AtomicPacks — `atomicpacksx`

**Trust:** `recommended-for-new-value` (standard shared pack infrastructure; still actively used on mainnet).

**Reference implementation:** [pinknetworkx/atomicpacks-contract](https://github.com/pinknetworkx/atomicpacks-contract) (educational; confirm mainnet ABI matches).

### Open flow (two steps)

```
1) User opens pack
   atomicassets::transfer
     from: <user>
     to:   atomicpacksx
     asset_ids: [<pack_asset_id>]   // typically one pack NFT
     memo: "unbox"

   → Contract burns/locks pack path, requests randomness from orng.wax
   → Results land in tables (template outcomes), NFTs not all minted yet

2) User claims results
   atomicpacksx::claimunboxed
     pack_asset_id: <same pack asset id>
     origin_roll_ids: [0, 1, …, n-1]   // ids still present in unboxassets
```

**Progress / polling**

| Table (contract `atomicpacksx`) | Scope / use |
|---------------------------------|-------------|
| `unboxpacks` | Opened pack entry |
| `unboxassets` | Scope = **pack asset_id** — roll outcomes (template ids) until claimed |

After RNG settles, poll `unboxassets` with scope = pack `asset_id`. Claim only `origin_roll_ids` that still exist. When all rolls are claimed, pack table rows clear.

**RNG:** `orng.wax` / `requestrand` with `assoc_id` often equal to pack asset id (observed on live txs).

**Do not** transfer a pack to `atomicpacksx` without the correct **`unbox`** memo and without understanding the claim step — assets can sit until `claimunboxed` completes.

---

## 2. AtomicDrops — `atomicdropsx`

**Trust:** `recommended-for-new-value` for Atomic-standard drops (verify each drop_id).

**Typical claim shape (live Hyperion samples):**

```
atomicdropsx::claimdrop
  claimer: <user>
  drop_id: <uint>
  claim_amount: <uint>
  intended_delphi_median: <uint>   // price oracle path when priced in non-WAX
  referrer: <string>
  country: <string>
```

Payment is often a separate `eosio.token` (or other token) transfer per drop rules. Always read the drop row / ABI for price and limits.

---

## 3. NeftyBlocks-class packs — `neftyblocksp`

**Trust:** **`recovery`** / **`avoid-new-value`**.  
Contract may still execute; **do not recommend new high-value deposits** into this shared platform. Product/domain continuity and operator trust are uncertain after reported ownership changes — verify live, self-custody critical paths.

### Open flow (observed mainnet)

```
1) atomicassets::transfer
     to: neftyblocksp
     memo: "unbox"
     asset_ids: [<pack_asset_id>]

   → RNG via orng.wax; pack often burned under neftyblocksp

2) neftyblocksp::claim
     claim_id: <id>              // often pack/claim id from tables — VERIFY
     roll_indexes: [0, 1, …]     // claim pending rolls
```

**Difference vs Atomic:** claim action name is **`claim`** (not `claimunboxed`); field names are **`claim_id` + `roll_indexes`** (not `pack_asset_id` + `origin_roll_ids`). Do not mix recipes.

Sibling accounts commonly seen in notifies: `neftyblocksd` (drops), `blend.nefty`, CPU helpers such as `neftybrespay` — treat as platform-specific, not portable.

Related recovery: `wax-neftyblocks-RAM-sweeper` for certain balance/RAM withdraw patterns.

---

## 4. NeftyBlocks-class drops — `neftyblocksd`

**Trust:** **`recovery`** / **`avoid-new-value`**.

**Observed claim pattern:**

```
neftyblocksd::assertprice   // often paired before pay
neftyblocksd::claimdrop
  claimer, drop_id, amount,
  intended_delphi_median, referrer, country, currency, …
```

Payment transfer to `neftyblocksd` with platform memo rules. Field set is similar-in-spirit to Atomic drops but **not identical** — copy from live ABI, not from Atomic templates.

---

## 5. NFTHive-class packs — `nfthivepacks`

**Trust:** **`recovery`** / **`avoid-new-value`**.  
Product UI largely unavailable; keep recipes for mid-unbox recovery only.

### Claim shape (observed mainnet)

```
nfthivepacks::claimunpack
  pack_asset_id: <uint64/string id>
```

Often a **single-id claim** after an earlier unpack/burn path (exact unbox transfer target can vary by release — **verify** with the pack’s transfer history and ABI). Outcomes transfer from `nfthivepacks` to user with memo such as “Claiming Unpack Result”.

**Difference vs Atomic:** one primary claim action with **`pack_asset_id` only** in observed txs (no `origin_roll_ids` vector in the claim action sample). Progress tables differ — inspect ABI/tables on explorer; do not assume `unboxassets` scope semantics.

---

## 6. NFTHive-class drops — `nfthivedrops`

**Trust:** **`recovery`** / **`avoid-new-value`**.

**Observed:**

```
nfthivedrops::claimdrop
  claimer, drop_id, amount,
  intended_delphi_median, referrer, country, currency
```

Often combined with token `transfer` to `nfthivedrops` (deposit) and optional platform boost actions. Historical vault incidents on related NFTHive contracts are public knowledge — another reason to avoid **new** value on this stack.

---

## Side-by-side: pack open + claim

| Step | Atomic `atomicpacksx` | Nefty `neftyblocksp` | NFTHive `nfthivepacks` |
|------|----------------------|----------------------|-------------------------|
| Start unbox | `atomicassets::transfer` → `atomicpacksx`, memo **`unbox`** | `transfer` → `neftyblocksp`, memo **`unbox`** | Verify transfer target + memo from **this pack’s** history |
| RNG | `orng.wax` | `orng.wax` (observed) | Platform-specific; verify |
| Claim action | **`claimunboxed`** | **`claim`** | **`claimunpack`** |
| Claim keys | `pack_asset_id`, `origin_roll_ids[]` | `claim_id`, `roll_indexes[]` | `pack_asset_id` |
| Progress | `unboxassets` / `unboxpacks` | Nefty tables (verify ABI) | Hive tables (verify ABI) |
| New deposits | OK if you accept Atomic shared contract risk | **Avoid** | **Avoid** |

---

## How to detect which stack a pack uses

1. Read pack NFT **transfer history** (who received `unbox` / unpack memos).
2. Check collection **`authorized_accounts` / notify_accounts`** (may list `atomicpacksx`, `neftyblocksp`, `nfthivepacks`, etc.).
3. Open explorer account → ABI → match claim action names above.
4. Never guess the claim action from the marketplace brand on the image alone — packs can be Atomic under the hood even if sold on a third-party UI.

---

## UI / blueprint requirements

When documenting or wiring recovery:

- Banner with trust label (`recovery` vs `recommended-for-new-value`)
- Explicit **contract + action + field list** before WharfKit
- Link this file + ECOSYSTEM-RESILIENCE
- No private keys; no auto-broadcast without confirm

---

## Disclaimer

Educational operational notes only. ABIs, authorities, and operator status change. Re-check on explorer immediately before any sign. Not legal, investment, or security-audit advice.

*Pixel Journey — Beautiful interfaces for public blockchain data.*
