# wax-drops-and-pack-opening-experience

> **Status:** 🔄 Deep Refinement (PX Perfection Standard v1.1)  
> **Category:** Atomic Ecosystem – Drops & Pack Openings  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)  
> **Continuity:** [ECOSYSTEM-RESILIENCE.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md) · PX §11 Operator Continuity

**Goal:** Reference-quality **drop and pack opening UX** on WAX — transparent probabilities, accessible reveals, safe claim flows — plus a **calm recovery path** when a commercial frontend is offline and users still need to claim or unpack on-chain.

---

## Two modes (do not mix them up)

| Mode | Trust | Intent |
|------|--------|--------|
| **Product experience** | `recommended-for-new-value` when you control the contract | Joyful, fair opens for *your* drops/packs |
| **Recovery** | `recovery` / `avoid-new-value` for legacy platforms | Claim/unpack when a vendor UI is gone |

Operators and guilds sometimes reduce service or exit product lines. Chain state can remain. We document recovery **without** replaying disputes—see catalog resilience guidance.

---

## Vision

Opening packs should feel premium and honest. Claiming should be guided and previewed. If the pretty website disappears, users should still have **action recipes** and a minimal path to finish claims.

---

## Quick Start

### Product builders
1. Read educational core (probability + reveal + claim).
2. Use `/examples` — RevealAnimation, ProbabilityBreakdown, ClaimFlow, demo.
3. Point claim actions at **your** verified contract ABI.

### Recovery / support
1. Read `ACTION-RECIPES.md`.
2. Use `RecoveryClaimPanel` pattern — confirm contract + ids before WharfKit.
3. Cross-check inventory on explorer; never invent account names.

### AI agents
Load `spec.yaml`. Separate product claim templates from recovery-labeled recipes.

---

## Examples

- `RevealAnimation.tsx` — accessible reveal
- `ProbabilityBreakdown.tsx` — visual + text odds
- `ClaimFlow.tsx` — optimistic claim with rollback pattern
- `RecoveryClaimPanel.tsx` — offline-frontend recovery UX
- `useDropOpening.ts` — flow hook
- `demo.tsx` — composition
- `ACTION-RECIPES.md` — on-chain recovery documentation

---

## 1. Educational Core

### Why it matters
Opaque odds and broken claim UIs destroy trust. So does locking claims behind a single domain.

### Key concepts

| Concept | Value |
|---------|--------|
| Reveal mechanics | Anticipation without manipulation |
| Probability transparency | Trust |
| Guided claim | Safety |
| Recovery recipe | Continuity when operators leave |

### Learning outcomes
- Ship fair reveal + probability UX
- Wire WharfKit claims with previews and rollback
- Publish recovery steps for pack/claim without depending on one website

---

## 2. Architecture

```
Product path:  reveal → probability → claim (your contract)
Recovery path: inventory ids → verified ABI → RecoveryClaimPanel → wallet sign
```

Client-side first; on-chain confirmation is source of truth.

---

## 3. Integration levels

| Level | Scope |
|-------|--------|
| **Minimal** | Reveal + static odds + simple claim |
| **Recommended** | Full claim flow + a11y + recovery recipe doc |
| **Advanced** | Simulation mode, multi-pack, creator odds tools |

---

## 4. Best practices

**Do**
- Show probabilities in text and visuals
- Respect `prefers-reduced-motion`
- Confirm tx details before sign
- Document contract + action in git for critical claims

**Don’t**
- Hide odds
- Treat a vendor domain as permanent infrastructure
- Encourage new deposits into unmaintained shared pack platforms

### Production checklist
- [ ] Clear previews for on-chain claims
- [ ] Error and loading states
- [ ] A11y (motion, keyboard, screen reader)
- [ ] Trust label if any third-party contract is mentioned
- [ ] Recovery recipe or explorer path published

---

## 5. Ecosystem position

Works with:
- `wax-advanced-drop-mechanics-toolkit`
- `wax-blends-creator-and-visualizer`
- `wax-neftyblocks-RAM-sweeper` (balance recovery sibling)
- Security multi-sig tools for treasury-scale claims

---

## 6. License

MIT — **Pixel Journey**

*Exemplifies [PX Perfection Standard](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/PX-PERFECTION-STANDARD.md) v1.1.*

*Last major refinement pass: October 2026*
