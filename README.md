# wax-drops-and-pack-opening-experience

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **Status:** Phase 2 · **WharfKit claimunboxed** + progress poll + stack detect  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

Transparent pack odds, Atomic unbox progress, and a **confirm-first** `atomicpacksx::claimunboxed` path (dry-run or real wallet).

## Platform map

| Stack | Packs | New value? |
|-------|-------|------------|
| Atomic `atomicpacksx` | `claimunboxed` | Preferred |
| Nefty `neftyblocksp` | recovery | Avoid new deposits |
| NFTHive `nfthivepacks` | recovery | Avoid new deposits |

See [PLATFORM-CONTRACTS.md](./PLATFORM-CONTRACTS.md).

## Quick start

```bash
npm install
npm test
npm run dev
```

### Optional real wallet (WharfKit)

```bash
npm i @wharfkit/session @wharfkit/web-renderer \
  @wharfkit/wallet-plugin-anchor @wharfkit/wallet-plugin-cloudwallet
```

Without those packages, **Use dry-run session** still builds and "signs" locally (no broadcast).

## claimunboxed flow

1. User transfers pack → `atomicpacksx` memo `unbox`
2. **Poll unbox** → `unboxassets` / `unboxpacks`
3. **ClaimUnboxedPanel** → confirm → `session.transact` with `claimunboxed`

```ts
import { buildClaimUnboxedAction, claimUnboxedWithSession } from "./examples/wharf/claimUnboxed";
import { createDryRunSession } from "./examples/wharf/sessionFactory";

const action = buildClaimUnboxedAction({
  packAssetId: "1100003553120",
  originRollIds: [0, 1],
});
await claimUnboxedWithSession(createDryRunSession("alice.wam"), {
  packAssetId: "1100003553120",
  originRollIds: [0, 1],
});
```

## License

MIT — Pixel Journey
