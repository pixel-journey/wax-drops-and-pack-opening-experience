# Drops and pack opening without pretending the website is the source of truth

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)  
**Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
**Platform details:** [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md)  
**Action recipes:** [ACTION-RECIPES.md](ACTION-RECIPES.md)

A pack opening screen that hides the contract, the memo, and the claim step is a recovery problem waiting to happen. This repo shows the Atomic open path in the open, labels other platforms as recovery-only, and keeps the probability and progress logic testable without a wallet.

Nothing here mints a pack or opens one on mainnet in CI. Live broadcast remains optional.

## What you can learn

- Why the open path is two (or more) actions, not one button: transfer with memo, then claim after RNG settles.
- How Atomic, Nefty-class, and NFTHive-class claim shapes differ (action names and field lists are not interchangeable).
- Why a website dying does not delete the tables — and what a recovery UI must still show.
- How to detect which stack a pack uses from transfer history and ABI, not from the marketplace brand on the image.
- How to keep probability display, stack detection, and progress polling pure enough to unit-test.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `src/engines.ts` | Probability, stack detect, unbox progress helpers |
| `src/engines.test.ts` | Unit coverage for the pure pieces |
| `src/wharf/unboxTransfer.ts` + test | `atomicassets::transfer` with memo `unbox` builder |
| `src/wharf/claimUnboxed.ts` + test | `atomicpacksx::claimunboxed` builder |
| `src/wharf/sessionFactory.ts` | Dry-run session (no peers required) |
| `src/UnboxTransferPanel.tsx` | Step 1 UI |
| `src/ClaimUnboxedPanel.tsx` | Claim UI after poll |
| `src/ProbabilityBreakdown.tsx` | Odds display |
| `src/stackDetect.ts` | Which platform stack a pack appears to use |
| `src/api.ts` / `src/usecases.ts` | HTTP request builders and unsigned transaction cases |
| `PLATFORM-CONTRACTS.md` | Trust labels + side-by-side flows |
| `ACTION-RECIPES.md` | Copy-pastable forward and recovery recipes |
| `ARCHITECTURE.md` | Data flow, a11y, error, performance notes |
| `app/` | Next.js demo with live-tools steps |

`npm test` and `npm run dev`. Dry-run works without installing `@wharfkit/*`. Real signing needs the optional peers.

## Atomic open path (recommended for new value)

```
1) atomicassets::transfer → atomicpacksx
   memo: "unbox"
   asset_ids: [pack_asset_id]

2) Poll atomicpacksx tables
   unboxpacks / unboxassets (scope = pack asset id)
   RNG via orng.wax

3) atomicpacksx::claimunboxed
   pack_asset_id
   origin_roll_ids: [still-present rolls]
```

```ts
import { unboxTransferWithSession } from "./src/wharf/unboxTransfer";
import { claimUnboxedWithSession } from "./src/wharf/claimUnboxed";
import { createDryRunSession } from "./src/wharf/sessionFactory";

const session = createDryRunSession("alice.wam");
await unboxTransferWithSession(session, { assetIds: ["1100003553120"] });
// …poll unboxassets…
await claimUnboxedWithSession(session, {
  packAssetId: "1100003553120",
  originRollIds: [0, 1],
});
```

UI sequence in the demo: **UnboxTransferPanel** → poll → **ClaimUnboxedPanel**.

Atomic drops (`atomicdropsx::claimdrop`) follow a separate claim shape with payment transfer rules — see ACTION-RECIPES.md. Always read the live drop row.

## Platform trust (read this before new deposits)

| Family | Pack contract | Trust for new value | Notes |
| --- | --- | --- | --- |
| Atomic | `atomicpacksx` | `recommended-for-new-value` | Standard shared path; still the default public infrastructure |
| Nefty-class | `neftyblocksp` | `recovery` / `avoid-new-value` | Claim action is `claim` (not `claimunboxed`); field names differ |
| NFTHive-class | `nfthivepacks` | `recovery` / `avoid-new-value` | Often single-id `claimunpack`; verify tables |

Full side-by-side, ABI notes, and recovery recipes: [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md) and [ACTION-RECIPES.md](ACTION-RECIPES.md).  
Related catalog note: `ECOSYSTEM-RESILIENCE.md`.

**Do** prefer Atomic (or a contract you control with a published ABI) for new launches.  
**Do not** treat a marketplace brand on the image as proof of the underlying pack contract.  
**Do not** transfer a pack to `atomicpacksx` without the `unbox` memo and without understanding the later claim step.

### Side-by-side pack open + claim

| Step | Atomic `atomicpacksx` | Nefty `neftyblocksp` | NFTHive `nfthivepacks` |
| --- | --- | --- | --- |
| Start unbox | `atomicassets::transfer` → `atomicpacksx`, memo **`unbox`** | `transfer` → `neftyblocksp`, memo **`unbox`** | Verify transfer target + memo from **this pack’s** history |
| RNG | `orng.wax` | `orng.wax` (observed) | Platform-specific; verify |
| Claim action | **`claimunboxed`** | **`claim`** | **`claimunpack`** |
| Claim keys | `pack_asset_id`, `origin_roll_ids[]` | `claim_id`, `roll_indexes[]` | `pack_asset_id` |
| Progress | `unboxassets` / `unboxpacks` | Nefty tables (verify ABI) | Hive tables (verify ABI) |
| New deposits | OK if you accept Atomic shared contract risk | **Avoid** | **Avoid** |

### How to detect which stack a pack uses

1. Read pack NFT **transfer history** (who received `unbox` / unpack memos).
2. Check collection **`authorized_accounts` / notify_accounts`** (may list `atomicpacksx`, `neftyblocksp`, `nfthivepacks`, etc.).
3. Open explorer account → ABI → match claim action names above.
4. Never guess the claim action from the marketplace brand on the image alone — packs can be Atomic under the hood even if sold on a third-party UI.

## Architecture principles (from ARCHITECTURE.md)

- **Transparency first**: Users should always understand probabilities and what is happening.
- **Safety**: All on-chain actions must be clearly previewed via WharfKit.
- **Accessibility**: Respect `prefers-reduced-motion`; provide ARIA live regions and keyboard paths.
- **Reusability**: Pure helpers in `src/` so they can be copied without the demo shell.
- **Educational value**: Code and docs should teach good patterns rather than hide them.

High-level flow: UI → pure reveal/probability engines → WharfKit session → public endpoints (Hyperion / Atomic API) → reconciliation with clear rollback on failure.

## Edge cases

- Claiming a roll id that is no longer in `unboxassets` fails. Poll first; only pass still-present `origin_roll_ids`.
- Mixing Nefty `claim` field names with an Atomic action (or the reverse) produces a transaction the contract rejects.
- A pack can sit mid-unbox if the claim step is never finished. The tables remain the source of truth.
- Dry-run session succeeds without network peers; a real session requires a wallet and the correct authority.
- Probability display is client-side. It does not change what the contract rolls.
- NFTHive claim is often a single `pack_asset_id`; do not assume the Atomic `origin_roll_ids` vector.
- Insufficient RAM or other resource errors surface as clear, actionable messages rather than raw RPC noise.

## Best practice and the opposite

**Do** show the contract, action, and key fields before the sign button.  
**Do** label recovery-only platforms clearly in the UI with a trust banner.  
**Do** keep the progress and odds helpers pure so they can be tested without Hyperion.  
**Do** re-verify ABI and authorities on an explorer immediately before signing.

**Do not** call a client animation “the open” when the claim action has not yet been sent.  
**Do not** hide the multi-step nature behind a single “Open Pack” button that only does the transfer.  
**Do not** recommend new high-value deposits into platforms whose product UI has already gone dark.  
**Do not** auto-broadcast without an explicit confirm dialog that lists the contract + action + ids.

## Antelope notes

The transfer + claim shape is Antelope-specific in its action names and table layout, but the same pattern (burn/lock + RNG + claim) appears on other Antelope chains that adopt Atomic-style packs. Always re-read the live ABI. This repo’s builders target the WAX mainnet accounts documented in PLATFORM-CONTRACTS.md; they have not been re-tested against other chains in CI.

## Live path, not shipped in CI

```
user pack NFT
    → atomicassets::transfer (memo unbox)     [builder tested]
    → poll unboxassets                        [helper tested]
    → atomicpacksx::claimunboxed              [builder tested]
    → optional live wallet broadcast          [untested in CI]
```

See VERIFICATION-LOG.md for the full claim-to-evidence map.

## AtomicAssets v2 — unbox is a transfer, not backing

`buildUnboxTransferAction` returns `atomicassets::transfer` to `atomicpacksx` with memo `unbox`. It does not call `backasset` and it does not set `tokens_to_back`. Native backing is deprecated. A pack is not a token-backed NFT.

The builder rejects an empty id list and a memo other than `unbox` when the destination is `atomicpacksx`. It still accepts more than one id if the caller passes them. The unit test uses one id (`1100003553120`) and a fake session. This pass did not re-run `npm test` and did not open a pack.

AtomicMarket v2 sales are also one asset. That rule is not enforced here. This file is the pack open, not the sale.

## Related

- [wax-pity-system-and-guaranteed-rewards](https://github.com/pixel-journey/wax-pity-system-and-guaranteed-rewards) — arithmetic for rates and guarantees, separate from the open UX
- [wax-neftyblocks-RAM-sweeper](https://github.com/pixel-journey/wax-neftyblocks-RAM-sweeper) — recovery helper for certain Nefty balances
- Catalog `ECOSYSTEM-RESILIENCE.md` — frontend abandonment patterns

## Run

```bash
npm install
npm test
npm run dev
```

MIT — Pixel Journey

## Queries and unsigned transactions

`src/api.ts` builds the HTTP requests. `src/usecases.ts` is the worked case: those requests, and an unsigned transaction when this repo already has an action or the chain action is the standard Antelope one for the topic. `executed` is false. Nothing is sent.

The code used to sit in `examples/`. GitHub treats that directory as documentation, so the language bar hid the TypeScript.
