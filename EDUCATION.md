# AtomicPacks unbox + claim — source-backed walkthrough

**Trust label:** `educational-reference`  
**Status:** pure previews only. Not on-chain. Not compiled. No broadcast.  
**Official source:** [pinknetworkx/atomicpacks-contract](https://github.com/pinknetworkx/atomicpacks-contract) (`src/unboxing.cpp`)  
**AtomicAssets transfer:** [pinknetworkx/atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract)  
**WAX docs:** [docs.wax.io How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets)

This file exists so a developer, creator, or AI vibe-coder can predict what the live contract will refuse before they ever sign a transaction.

## The two-step open (never one button)

```
1) atomicassets::transfer
   to: atomicpacksx
   asset_ids: [one pack only]
   memo: "unbox"

2) (after RNG callback)
   atomicpacksx::claimunboxed
   pack_asset_id: same id
   origin_roll_ids: [still-present rolls]
```

Nothing is minted in step 1. The pack is burned inside the RNG callback. Results sit in `unboxassets` (scope = pack asset id) until claimed.

## Predict-run: transfer checks (from receive_asset_transfer)

| Input | Contract check (exact message) | Source line area |
| --- | --- | --- |
| `asset_ids.size() != 1` | `Only one pack can be opened at a time` | unboxing.cpp |
| `memo != "unbox"` | `Invalid memo` | unboxing.cpp |
| asset has no template | `The transferred asset does not belong to a template` | unboxing.cpp |
| template not in packs table | `The transferred asset's template does not belong to any pack` | unboxing.cpp |
| `unlock_time` in the future | `The pack has not unlocked yet` | unboxing.cpp |

Use `previewUnbox` in `src/wharf/previewUnbox.ts` to surface these strings without a wallet.

## Predict-run: claimunboxed checks

| Input | Contract check (exact message) | Notes |
| --- | --- | --- |
| no `unboxpacks` row | `No unboxpack with this pack asset id exists` | |
| caller is neither unboxer nor contract | `The transaction needs to be authorized either by the unboxer or by the contract itself` | |
| empty `origin_roll_ids` | `The original roll ids vector can't be empty` | |
| roll id missing from `unboxassets` | `No unbox asset with the origin roll id <id> exists` | string is interpolated |
| `template_id == -1` | (no refusal) | skip mint, erase row only |
| template `max_supply != 0` | (no refusal, just skip mint) | locked templates are skipped |

Use `previewClaimUnboxed` in `src/wharf/previewClaimUnboxed.ts`.

## RAM notes (from the same file)

- Transfer reserves: 112 (unboxassets scope) + 124 per roll + 264 (unboxpacks) + 120 + 144 (orng).
- Claim: +151 per minted asset (minimum size), -124 per erased unboxassets row, -376 when the last row clears the unboxpacks entry.
- Collection RAM balance is debited/credited. Insufficient balance surfaces as a clear refusal.

## Attack / mistake table

| Mistake | What happens | How to avoid |
| --- | --- | --- |
| Send two pack ids in one transfer | Refused: only one pack at a time | Always single id |
| Wrong memo | Refused: Invalid memo | Hard-code `"unbox"` |
| Claim before RNG callback | Missing unboxpack or missing rolls | Poll `unboxassets` first |
| Claim a roll already claimed | Missing roll refusal | Only pass still-present ids |
| Treat animation as "opened" | User thinks they have the NFTs; tables still hold them | Show claim step separately |
| Mix Nefty `claim` fields with Atomic action | Contract rejects | Detect stack first (see PLATFORM-CONTRACTS.md) |

## Interlinks

- This repo's builders: `src/wharf/unboxTransfer.ts`, `src/wharf/claimUnboxed.ts`
- Platform comparison: [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md)
- Pity / rate math (designer arithmetic, separate from the open path): [wax-pity-system-and-guaranteed-rewards](https://github.com/pixel-journey/wax-pity-system-and-guaranteed-rewards) (see its [EDUCATION.md](https://github.com/pixel-journey/wax-pity-system-and-guaranteed-rewards/blob/main/EDUCATION.md))
- Template supply rules that affect whether a claim mints (max_supply, lock, delete): [wax-atomic-template-and-schema-explorer](https://github.com/pixel-journey/wax-atomic-template-and-schema-explorer)
- Mutable data / schema (what the minted NFTs look like): related AtomicAssets labs in the catalog

## What this lab does not do

- It does not compile the C++ contract.
- It does not broadcast.
- It does not claim to be a replacement for reading the live ABI on an explorer.
- It does not invent AtomicDrops (`atomicdropsx`) rules; those live in ACTION-RECIPES.md and still require reading the specific drop row.
- It does not implement soft or hard pity; that arithmetic lives in the pity lab.

Always re-verify the live ABI before any production sign.
