# Sources

| Source | Use |
| --- | --- |
| [pinknetworkx/atomicpacks-contract](https://github.com/pinknetworkx/atomicpacks-contract) | Unbox refusal strings |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | RNG after transfer. WAX-only account |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before a live action |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit if a host later signs |
| [docs.wax.io AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | NFT context |
| [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md) | Atomic vs Nefty vs NFTHive trust |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

## Product facts locked by tests

- Atomic open is **two or more actions**: `atomicassets::transfer` to `atomicpacksx` with memo **`unbox`** and exactly **one** asset id, then poll, then `atomicpacksx::claimunboxed` with still-present `origin_roll_ids`.
- Template id **-1** means no NFT for that roll (row erased only).
- Unbox is a **transfer**, not `backasset`.
- Builders and pure previews are tested. **Live broadcast is untested in CI.**
- Atomic = recommended for new value. Nefty `claim` and NFTHive `claimunpack` = recovery / avoid-new-value. Do not mix field names.

## Portability

The multi-step shape is specific to `atomicpacksx` on WAX. Re-read the ABI on any other chain. `orng.wax` does not exist elsewhere.
