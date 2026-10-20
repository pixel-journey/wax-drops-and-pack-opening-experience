# wax-drops-and-pack-opening-experience

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **Status:** Phase 2 · full Atomic open path (transfer+unbox → poll → claimunboxed)

## Atomic open path (WharfKit)

```
1) atomicassets::transfer → atomicpacksx, memo "unbox"
2) Poll unboxassets / unboxpacks (RNG via orng.wax)
3) atomicpacksx::claimunboxed(pack_asset_id, origin_roll_ids)
```

```ts
import { unboxTransferWithSession } from "./examples/wharf/unboxTransfer";
import { claimUnboxedWithSession } from "./examples/wharf/claimUnboxed";
import { createDryRunSession } from "./examples/wharf/sessionFactory";

const session = createDryRunSession("alice.wam");
await unboxTransferWithSession(session, { assetIds: ["1100003553120"] });
// …poll…
await claimUnboxedWithSession(session, {
  packAssetId: "1100003553120",
  originRollIds: [0, 1],
});
```

UI: **Step 1 UnboxTransferPanel** → **Poll unbox** → **ClaimUnboxedPanel**. Dry-run works without Wharf peers; install optional `@wharfkit/*` for real signing.

## Platform trust

Atomic preferred for new value. Nefty/Hive = recovery only — see [PLATFORM-CONTRACTS.md](./PLATFORM-CONTRACTS.md).

```bash
npm install && npm test && npm run dev
```

MIT — Pixel Journey
