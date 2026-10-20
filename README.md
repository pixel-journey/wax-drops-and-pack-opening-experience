# wax-drops-and-pack-opening-experience

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **Status:** 🔄 Phase 2 · Platform contracts documented (Atomic / Nefty / NFTHive)  
> **Category:** Atomic Ecosystem – Drops & Pack Openings  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)  
> **Continuity:** [ECOSYSTEM-RESILIENCE.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md) · PX §11

**Goal:** Transparent pack/drop UX **plus** accurate on-chain recipes for the major WAX pack stacks — with clear **forward vs recovery** trust labels.

---

## Platform map (today)

| Stack | Packs | Drops | New value? |
|-------|-------|-------|------------|
| **Atomic** | `atomicpacksx` | `atomicdropsx` | **Preferred** for new launches |
| **NeftyBlocks-class** | `neftyblocksp` | `neftyblocksd` | **Recovery only** — avoid new deposits |
| **NFTHive-class** | `nfthivepacks` | `nfthivedrops` | **Recovery only** — avoid new deposits |

Full action/table differences: **[PLATFORM-CONTRACTS.md](./PLATFORM-CONTRACTS.md)**  
Copy-paste recipes: **[ACTION-RECIPES.md](./ACTION-RECIPES.md)**

Atomic open is **two-step** (`transfer` + memo `unbox` → `claimunboxed` + roll ids). Nefty/Hive use **different claim action names and fields** — do not mix them.

---

## Quick start

```bash
npm install && npm test && npm run dev
```

```ts
import { PLATFORM_PRESETS } from "./examples/platformPresets";
import { parseContentsOdds, normalizeOdds } from "./examples/engines";
```

UI: demo odds · live pack parse · **platform preset selector** (Atomic / Nefty / Hive) · recovery claim panel.

---

## Learning outcomes

- Prefer Atomic-standard contracts for **new** packs/drops
- Document Nefty/Hive only as **recovery** paths when UI is gone
- Detect stack via transfer history + ABI, not marketplace branding alone
- Show odds honestly; client RNG ≠ on-chain RNG

---

## Related

- `wax-neftyblocks-RAM-sweeper`
- `wax-seizure-safe-pack-opening-canvas`
- `wax-screen-reader-accessible-inventory`

## License

MIT — **Pixel Journey**
