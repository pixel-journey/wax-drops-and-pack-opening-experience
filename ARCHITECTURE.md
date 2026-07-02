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

## High-Level Architecture

```
User Interface (Next.js + Tailwind + framer-motion)
          │
          ▼
State Management (Zustand / Jotai)
          │
          ▼
Reveal Engine + Probability Calculator
          │
          ▼
WharfKit Session (signing & claiming)
          │
          ▼
On-chain confirmation (Hyperion / Light-API)
```

## Key Components

| Component              | Responsibility                                      | Key Technologies          |
|------------------------|-----------------------------------------------------|---------------------------|
| `RevealAnimation`      | Handles the visual reveal sequence                  | framer-motion             |
| `ProbabilityBreakdown` | Displays odds clearly (visual + textual)            | React + Tailwind          |
| `ClaimPanel`           | Guides the user through safe on-chain claiming      | WharfKit                  |
| `CollectionUpdate`     | Handles optimistic updates + final confirmation     | State + API polling       |

## Data Flow

1. User triggers opening
2. Client may pre-calculate possible outcomes (for instant feedback)
3. Animation sequence plays
4. Result is shown + collection updated optimistically
5. User confirms claim → WharfKit transaction preview shown
6. Transaction submitted
7. Final state fetched from chain and reconciled

## Error Handling Strategy

- Network / RPC failures → Show helpful retry message
- Insufficient resources → Clear, actionable error
- Transaction failure → Roll back optimistic state + explain what happened
- Always provide a path forward for the user

## Accessibility Considerations

- Respect `prefers-reduced-motion`
- Provide text alternatives for all visual reveals
- Ensure keyboard navigation works for claiming flow
- Use semantic HTML and ARIA where appropriate

## Future Extensions

- Simulation mode ("open 10 packs at once")
- Advanced probability analytics for creators
- Sound design layer
- Social/result sharing features

This architecture is designed to be understandable, maintainable, and easy to extend while staying true to the Pixel Journey emphasis on quality user experiences.
