# Examples

UI sketches for a drop and pack-opening screen. They are not a broadcast and not a claim on chain.

The tested pieces are the parent `src/engines.ts`, `src/wharf/unboxTransfer.ts`, and `src/wharf/claimUnboxed.ts`. Read the repo [README](../README.md) before copying a component. `ClaimFlow.tsx` does not submit a transaction by itself.

## Shared Types

See `types.ts` for common interfaces used across the examples (`DropResult`, `ProbabilityItem`, `ClaimOptions`, etc.).

## Available Components

| File                    | Description                                      | Recommended Use Case                  |
|-------------------------|--------------------------------------------------|---------------------------------------|
| `RevealAnimation.tsx`   | Smooth animated reveal with accessibility support | Core reveal moment                    |
| `ProbabilityBreakdown.tsx` | Clean visual + textual probability display    | Showing odds transparently            |
| `ClaimFlow.tsx`         | Sketch of a claim step with a rollback story     | Not a broadcast. Wire it yourself.    |
| `useDropOpening.ts`     | Custom hook managing the full flow               | State management in React components  |
| `ErrorBoundary.tsx`     | Reusable error boundary with good UX             | Production error handling             |
| `demo.tsx`              | Full composition example                         | Understanding how everything works together |

## How to Use

1. Copy the components you need into your project.
2. Adapt the styling to match your design system (they use Tailwind + shadcn/ui conventions).
3. Replace mock data with real data from your backend or on-chain sources.
4. Connect `ClaimFlow` functions to your actual WharfKit session.
5. Import shared types from `types.ts` for consistency.

## Best Practices

- Use `useDropOpening` hook for most real-world implementations.
- Always wrap sensitive flows with `ErrorBoundary`.
- Test the full flow (reveal → claim) including error states.
- Respect `prefers-reduced-motion`.

These examples follow strict TypeScript and modern React + WharfKit patterns.
