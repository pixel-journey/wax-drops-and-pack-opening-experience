# ARCHITECTURE.md — Drops & Pack Opening Experience

This document provides deeper technical context for the drop and pack opening experience blueprint.

## Overview

The goal of this system is to deliver a delightful, transparent, and safe user experience when opening drops and packs on WAX, while remaining easy to integrate and extend.

## Core Principles

- **Transparency first**: Users should always understand probabilities and what is happening.
- **Performance & Feel**: Animations and feedback should feel premium and responsive.
- **Safety**: All on-chain actions must be clearly previewed.
- **Accessibility**: Support reduced motion and screen readers.
- **Reusability**: Components and patterns should be easy to adapt to other projects.
- **Educational value**: The architecture and code should teach good patterns.

## High-Level Architecture

```
User Interface (Next.js + Tailwind + framer-motion)
          │
          ▼
State Management (Zustand / Jotai)
          │
          ▼
Reveal Engine + Probability Calculator (client-side)
          │
          ▼
WharfKit Session (signing & claiming)
          │
          ▼
On-chain confirmation (Hyperion / Light-API)
          │
          ▼
UI Reconciliation + Error Handling
```

## Key Components

| Component              | Responsibility                                      | Key Technologies              |
|------------------------|-----------------------------------------------------|-------------------------------|
| `RevealAnimation`      | Handles the visual reveal sequence                  | framer-motion                 |
| `ProbabilityBreakdown` | Displays odds clearly (visual + textual)            | React + Tailwind              |
| `ClaimPanel`           | Guides the user through safe on-chain claiming      | WharfKit                      |
| `CollectionUpdate`     | Handles optimistic updates + final confirmation     | State management + API        |
| `ErrorBoundary`        | Graceful error handling and recovery                | React Error Boundaries        |

## Data Flow

1. User triggers opening
2. Client may pre-calculate possible outcomes (for instant feedback)
3. Animation sequence plays with proper timing and accessibility support
4. Result is shown + collection is updated optimistically
5. User confirms claim → WharfKit transaction preview is shown
6. Transaction is submitted
7. Final state is fetched from chain and reconciled (with rollback on failure)

## State Management Strategy

- Use lightweight state management (Zustand or Jotai) for local UI state.
- Keep simulation and calculation logic pure where possible (easy to test).
- Optimistic updates are applied immediately for perceived performance, with clear rollback paths on error.
- Server state (on-chain confirmation) is handled via TanStack Query or similar when needed.

## Error Handling Strategy

- **Network / RPC failures**: Show helpful retry message with exponential backoff recommendation.
- **Insufficient resources**: Clear, actionable error (“Not enough RAM to claim”).
- **Transaction failure**: Roll back optimistic state + explain what happened and next steps.
- **Unexpected errors**: Catch in ErrorBoundary and show calm recovery UI.
- Always provide a clear path forward for the user.

## Accessibility Considerations

- Respect `prefers-reduced-motion` globally.
- Provide text alternatives and ARIA live regions for visual reveals.
- Ensure keyboard navigation works for the entire claiming flow.
- Use semantic HTML and proper focus management.
- Test with screen readers.

## Performance Considerations

- Prefer `transform` and `opacity` for animations (GPU-accelerated).
- Avoid layout thrashing during reveal sequences.
- Pre-calculate probabilities client-side where feasible for instant feedback.
- Keep bundle size reasonable — tree-shake unused components.
- Test on average mobile devices (target < 1.5s initial load).

## Security & Trust Considerations

- Never hide probability information.
- All on-chain actions must show clear previews via WharfKit.
- Avoid optimistic updates on sensitive actions unless rollback is trivial and safe.
- Handle transaction failures gracefully without exposing internal details to users.

## Testing Recommendations

- Unit test pure calculation functions (probability engine, threshold logic).
- Integration test full reveal + claim flow (including error states).
- Accessibility testing (keyboard, screen reader, reduced motion).
- Performance testing on mid-range mobile devices.
- User testing for clarity of probability communication.

## Future Extensions

- Simulation mode (“What if I open 10 packs?”)
- Advanced probability analytics for creators
- Sound design integration
- Social/result sharing features
- Cross-drop pity or progression systems

This architecture is designed to be understandable, maintainable, performant, accessible, and easy to extend while staying true to the Pixel Journey emphasis on quality user experiences.
