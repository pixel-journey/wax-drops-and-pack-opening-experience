# Drops and pack opening without pretending the website is the source of truth

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)  
**Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
**Platform details:** [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md)

A pack opening screen that hides the contract, the memo, and the claim step is a recovery problem waiting to happen. This repo shows the Atomic open path in the open, labels other platforms as recovery-only, and keeps the probability and progress logic testable without a wallet.

Nothing here mints a pack or opens one on mainnet in CI. Live broadcast remains optional.

## What you can learn

- Why the open path is two actions, not one button: transfer with memo, then claim after RNG settles.
- How Atomic, Nefty-class, and NFTHive-class claim shapes differ (action names and field lists are not interchangeable).
- Why a website dying does not delete the tables — and what a recovery UI must still show.
- How to keep probability display, stack detection, and progress polling pure enough to unit-test.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `examples/engines.ts` | Probability, stack detect, unbox progress helpers |
| `examples/engines.test.ts` | Unit coverage for the pure pieces |
| `examples/wharf/unboxTransfer.ts` + test | `atomicassets::transfer` with memo `unbox` builder |
| `examples/wharf/claimUnboxed.ts` + test | `atomicpacksx::claimunboxed` builder |
| `examples/wharf/sessionFactory.ts` | Dry-run session (no peers required) |
| `examples/UnboxTransferPanel.tsx` | Step 1 UI |
| `examples/ClaimUnboxedPanel.tsx` | Claim UI after poll |
| `examples/ProbabilityBreakdown.tsx` | Odds display |
| `examples/stackDetect.ts` | Which platform stack a pack appears to use |
| `PLATFORM-CONTRACTS.md` | Trust labels + side-by-side flows |
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
import { unboxTransferWithSession } from "./examples/wharf/unboxTransfer";
import { claimUnboxedWithSession } from "./examples/wharf/claimUnboxed";
import { createDryRunSession } from "./examples/wharf/sessionFactory";

const session = createDryRunSession("alice.wam");
await unboxTransferWithSession(session, { assetIds: ["1100003553120"] });
// …poll unboxassets…
await claimUnboxedWithSession(session, {
  packAssetId: "1100003553120",
  originRollIds: [0, 1],
});
```

UI sequence in the demo: **UnboxTransferPanel** → poll → **ClaimUnboxedPanel**.

## Platform trust (read this before new deposits)

| Family | Pack contract | Trust for new value | Notes |
| --- | --- | --- | --- |
| Atomic | `atomicpacksx` | `recommended-for-new-value` | Standard shared path; still the default public infrastructure |
| Nefty-class | `neftyblocksp` | `recovery` / `avoid-new-value` | Claim action is `claim` (not `claimunboxed`); field names differ |
| NFTHive-class | `nfthivepacks` | `recovery` / `avoid-new-value` | Often single-id `claimunpack`; verify tables |

Full side-by-side, ABI notes, and recovery recipes: [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md).  
Related catalog note: `ECOSYSTEM-RESILIENCE.md`.

**Do** prefer Atomic (or a contract you control with a published ABI) for new launches.  
**Do not** treat a marketplace brand on the image as proof of the underlying pack contract.  
**Do not** transfer a pack to `atomicpacksx` without the `unbox` memo and without understanding the later claim step.

## Edge cases

- Claiming a roll id that is no longer in `unboxassets` fails. Poll first; only pass still-present `origin_roll_ids`.
- Mixing Nefty `claim` field names with an Atomic action (or the reverse) produces a transaction the contract rejects.
- A pack can sit mid-unbox if the claim step is never finished. The tables remain the source of truth.
- Dry-run session succeeds without network peers; a real session requires a wallet and the correct authority.
- Probability display is client-side. It does not change what the contract rolls.

## Best practice and the opposite

**Do** show the contract, action, and key fields before the sign button.  
**Do** label recovery-only platforms clearly in the UI.  
**Do** keep the progress and odds helpers pure so they can be tested without Hyperion.

**Do not** call a client animation “the open” when the claim action has not yet been sent.  
**Do not** hide the two-step nature behind a single “Open Pack” button that only does the transfer.  
**Do not** recommend new high-value deposits into platforms whose product UI has already gone dark.

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
