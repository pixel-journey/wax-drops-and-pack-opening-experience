# AI handoff — drops and pack opening

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
# https://github.com/atomicassets/atomic-knowledge — pin commit, AGENTS.md
```

| Source | Role |
| --- | --- |
| [atomicpacks-contract](https://github.com/pinknetworkx/atomicpacks-contract) | Unbox refusal strings |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | RNG after transfer |
| [PLATFORM-CONTRACTS.md](PLATFORM-CONTRACTS.md) | Atomic vs Nefty vs NFTHive trust |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before action |

## Non-negotiables

1. Atomic open path is **two+ actions**, not one button:
   - `atomicassets::transfer` → `atomicpacksx`, memo **`unbox`**, exactly **one** asset id
   - Poll `unboxpacks` / `unboxassets`
   - `atomicpacksx::claimunboxed` with still-present `origin_roll_ids`
2. Atomic = recommended for new value. Nefty `claim` / NFTHive `claimunpack` = **recovery / avoid-new-value** — different field names.
3. Detect stack from transfer history + ABI, **not** marketplace brand on the image.
4. Template id **-1** means no NFT for that roll (row erased only).
5. Builders and pure previews are tested; **live broadcast is untested in CI**.
6. Unbox is a **transfer**, not `backasset` / native backing.
7. `orng.wax` is WAX-only. Action accounts are WAX-shaped; re-read ABI on other chains.

## Prompt seeds

- "Using ClaimFlow patterns, wire a WharfKit claim with clear preview and rollback on failure."
- "Draft recovery for users who cannot open packs because a vendor UI is offline. Label trust as recovery."
- "List exact Atomic vs Nefty vs NFTHive claim action names — refuse mixing fields."
- "previewUnbox with two asset ids to atomicpacksx — exact refusal?"

## Do not

- Hide multi-step nature behind a single Open that only transfers.
- Recommend new deposits into dark vendor UIs.
- Call client animation "the open" before claim is sent.
- Mix Nefty claim keys with Atomic claimunboxed.
