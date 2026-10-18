# ACTION-RECIPES.md — Drops & packs (new value + recovery)

**PX:** Operator continuity §11 · [ECOSYSTEM-RESILIENCE.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md)

## Trust labels

| Label | Meaning |
|-------|--------|
| `recommended-for-new-value` | Your contract / Atomic-standard paths you control |
| `recovery` | Legacy platform claim when product UI is gone |
| `avoid-new-value` | Do not deposit fresh high value here |

## Recommended: owned Atomic-style flows

Document **your** drop/pack contract account and ABI in git. Typical claim-shaped actions vary by implementation—**verify ABI**:

```
Contract: <YOUR_PACK_OR_DROP_CONTRACT>
Action:   claim | unpack | open | claimassets  (name from ABI)
Auth:     owner active
Data:     owner, pack asset ids / claim ids (per ABI)
```

Never hard-code a third-party account as “the” pack system for new launches.

## Recovery: unopened packs when a frontend died

1. Find pack **asset ids** in the user inventory (AtomicAssets API or explorer).
2. Identify **which contract** the pack interacts with (transfer history / memo / known integration).
3. Open explorer → contract → ABI → matching claim/unpack action.
4. Sign via wallet or a minimal open UI (this blueprint’s claim patterns).
5. Confirm assets appear in inventory after success.

Placeholders only—**VERIFY_ON_EXPLORER**:

| Need | Contract hint | Action hint |
|------|---------------|-------------|
| Legacy pack claim | `VERIFY_ON_EXPLORER` | unpack / claim (ABI) |
| Legacy drop claim | `VERIFY_ON_EXPLORER` | claimdrop / claim (ABI) |
| Balance withdraw (Nefty-class) | see `wax-neftyblocks-RAM-sweeper` | withdraw |

## UI requirements when documenting recovery

- Banner: recovery / not for new deposits
- Confirm dialog listing contract + action + ids
- No private keys in the page
- Link to ecosystem resilience doc

---

*Pixel Journey*
