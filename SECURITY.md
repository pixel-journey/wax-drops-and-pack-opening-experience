# Security — pack opening

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Two asset ids on unbox transfer | refused |
| Memo other than `unbox` | refused on the Atomic path |
| Template id -1 | no NFT; row erased only |
| Vendor field mix | Nefty / NFTHive names are not `claimunboxed` |

## Not closed

| Concern | Guidance |
| --- | --- |
| Live broadcast | Untested in CI |
| Vendor UI trust | Recovery only; do not deposit new value |
| RNG | `orng.wax` after transfer; not this page's animation |

## Attack angles

1. A single Open button that only transfers and never claims.  
2. Treating the reveal animation as the on-chain open.  
3. Recommending new deposits into a dark Nefty or NFTHive UI.  
4. Copying Nefty claim keys onto `atomicpacksx::claimunboxed`.

## Honesty limits

Pure builders and previews. Prefer WharfKit for any later signature. Detect the stack from transfer history and ABI, not from the marketplace logo.

[atomicpacks-contract](https://github.com/pinknetworkx/atomicpacks-contract)
