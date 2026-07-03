# wax-drops-and-pack-opening-experience — Drops & Pack Opening Experience

> **Status:** 🔄 In Active Development (Pixel Journey Standard)  
> **Category:** Atomic Ecosystem – Drops & Pack Openings  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Provide a high-quality, educational, and practical reference example for building delightful, transparent, and fair drop and pack opening experiences on WAX.

This repository includes **real, reusable component examples** and follows modern best practices for WAX, WharfKit, React, and accessibility.

---

## Vision & Long-Term Participation Mindset

Opening drops and packs is one of the most emotionally engaging moments in Web3 on WAX. A great opening experience builds excitement, trust, and long-term participation.

This blueprint aims to raise the standard by delivering experiences that are:

- **Joyful** — satisfying animations and feedback
- **Transparent** — clear probability communication
- **Fair** — honest mechanics and good UX
- **Educational** — helps users understand what is happening
- **Safe** — clear previews, graceful error handling, and responsible design

We build this for long-term participants in the WAX ecosystem — both end users and developers.

---

## Quick Start

**For Human Developers**
1. Read the Educational Core and Architecture sections.
2. Review the Integration Guide and Best Practices.
3. Explore the real component examples in the `/examples` folder (including the demo).
4. Adapt the patterns into your own project.

**For AI Agents & AI-Assisted Development**
- Start with the `spec.yaml` for structured machine instructions.
- Use the Architecture, Best Practices, and `/examples` components as high-quality context.

---

## Examples Folder

This repository includes a dedicated `/examples` folder with production-ready, well-documented components:

- `RevealAnimation.tsx` — Smooth, accessible animated reveal component
- `ProbabilityBreakdown.tsx` — Clean visual + textual probability display
- `ClaimFlow.tsx` — Optimistic claiming with error handling and rollback
- `useDropOpening.ts` — Custom hook for managing the full opening + claiming flow
- `ErrorBoundary.tsx` — Reusable error boundary
- `demo.tsx` — Example showing how to compose everything together

These examples follow strict TypeScript, modern React patterns, and WharfKit best practices.

---

## 1. Educational Core — Why Great Opening Experiences Matter

### The Problem

Many drop and pack opening experiences on WAX suffer from:
- Opaque reveals that reduce excitement
- Unclear probabilities that damage trust
- Clunky claiming flows that create friction
- Lack of visual feedback that disconnects users from outcomes

### Key Concepts

| Concept                  | Description                                      | Educational Value                          |
|--------------------------|--------------------------------------------------|--------------------------------------------|
| Reveal Mechanics         | Animated sequences that build anticipation       | Emotional engagement & perceived fairness  |
| Probability Transparency | Clear visualization of drop rates                | Builds trust and reduces frustration       |
| Result Tracking          | Real-time updates to user collection             | Creates sense of progression               |
| On-chain Claiming        | Secure and guided claiming of results            | Safety and completion of the experience    |

### Learning Outcomes

After studying this repository, you should be able to:
- Design emotionally engaging and fair reveal experiences
- Visualize probabilities effectively
- Implement smooth on-chain claiming flows using WharfKit
- Build systems that feel premium, trustworthy, safe, and production-ready

---

## 2. Architecture & Design Decisions

### Recommended Tech Stack

- **Framework**: Next.js 15 + TypeScript (strict)
- **UI**: Tailwind + shadcn/ui + framer-motion
- **State Management**: Zustand or Jotai
- **Blockchain Integration**: WharfKit (Session Kit)
- **Data Sources**: Hyperion or Light-API
- **Design System**: Pixel Journey Design System

### Core Component Architecture

```
/components/
  PackSelector.tsx
  RevealAnimation.tsx
  ProbabilityBreakdown.tsx
  ResultDisplay.tsx
  ClaimPanel.tsx
  CollectionUpdate.tsx
  ErrorBoundary.tsx
```

### Key Design Decisions & Rationale

| Decision                    | Rationale                                                                 | Trade-offs                              |
|-----------------------------|---------------------------------------------------------------------------|-----------------------------------------|
| Client-side first           | Enables instant feedback and better perceived performance                 | Requires careful handling of on-chain confirmation |
| Optimistic UI updates       | Improves perceived speed and user experience                              | Must be able to rollback safely         |
| Clear signing previews      | Critical for user trust and safety on sensitive actions                   | Slightly more complex UI                |
| Accessibility by default    | Reduces motion support, screen reader support                             | Requires extra implementation effort    |
| Component-based architecture| Easier to reuse, test, and maintain across projects                       | Slightly higher initial abstraction     |

### Data Flow Overview

1. User initiates opening
2. Client calculates possible outcomes (if possible)
3. Animation plays
4. Result is displayed + collection is updated optimistically
5. On-chain claim is triggered with preview
6. Final state is confirmed from chain (with rollback on failure)

---

## 3. Integration Guide

### Recommended Integration Path

**Phase 1 – Core Reveal Experience**
- Implement `RevealAnimation` with proper timing and accessibility.
- Add `ProbabilityBreakdown` for clear visual + textual odds.

**Phase 2 – On-Chain Integration**
- Connect `ClaimPanel` using WharfKit with clear transaction previews.
- Implement optimistic collection updates with safe rollback.

**Phase 3 – Polish & Production Readiness**
- Add proper error handling, loading states, and accessibility attributes.
- Test on average mobile devices.
- Add fairness/transparency messaging where relevant.

### Integration Levels

| Level           | Description                                                                 | Recommended For                          |
|-----------------|-----------------------------------------------------------------------------|------------------------------------------|
| **Minimal**         | Basic reveal + static probability + simple claim                            | Prototypes, MVPs, learning               |
| **Recommended**     | Full guided claiming, optimistic updates, clear probability, accessibility  | Most production applications             |
| **Advanced**        | Interactive probability explorer, simulation mode, advanced animations      | High-engagement games or collector tools |

See `spec.yaml` for machine-readable definitions of these levels.

---

## 4. Best Practices & Options

### Probability Visualization

- Always combine **visual** and **textual** representations.
- Consider showing expected value for more complex drops.
- Use progressive disclosure to avoid overwhelming users.
- Test with real users — clarity builds trust.

### Animation Principles

- Build anticipation before the reveal.
- Use motion and scale to communicate rarity without being overwhelming.
- Respect `prefers-reduced-motion`.
- Prioritize performance (prefer `transform` and `opacity`).

### On-Chain Safety & UX

- Always show clear transaction previews using WharfKit.
- Handle errors gracefully with helpful, calm messages.
- Use optimistic updates only when rollback is trivial and safe.
- Clearly communicate when something goes wrong.

### Accessibility & Performance

- Support reduced motion and provide text alternatives for visual reveals.
- Use semantic HTML and ARIA labels.
- Keep animations performant on average mobile devices.
- Test the full flow end-to-end, including error states.

### Fairness & Trust

- Never hide or obscure probability information.
- Be transparent about how outcomes are determined.
- Provide clear explanations when a user receives a result.
- Avoid mechanics that feel manipulative.

### Production Readiness Checklist

- [ ] Clear transaction previews for all on-chain actions
- [ ] Graceful error handling with user-friendly messages
- [ ] Accessibility support (reduced motion, screen reader, keyboard)
- [ ] Performance tested on average mobile devices
- [ ] Probability information is always visible and understandable
- [ ] Optimistic updates have safe rollback paths
- [ ] Loading and error states are clearly communicated

---

## 5. Code Examples

Real, reusable component examples are available in the `/examples` folder:

- `RevealAnimation.tsx`
- `ProbabilityBreakdown.tsx`
- `ClaimFlow.tsx`
- `useDropOpening.ts` — Custom hook for the full opening + claiming flow
- `ErrorBoundary.tsx` — Reusable error boundary
- `demo.tsx` — Example showing how to compose everything together

These examples follow strict TypeScript, modern React patterns, and WharfKit best practices.

---

## 6. Machine Instructions (For AI Agents)

This repository includes a structured `spec.yaml` file optimized for AI consumption.

Key instructions include:
- Building beautiful and accessible reveal animations
- Implementing clear probability visualization (visual + textual)
- Creating guided, safe on-chain claiming flows with WharfKit
- Supporting multiple integration levels (Minimal, Recommended, Advanced)
- Following Pixel Journey design and animation best practices

AI agents should start by reading `spec.yaml` for the most structured guidance.

---

## 7. Ecosystem Position

This repository is part of the broader Pixel Journey WAX blueprint collection and works well alongside:

- `wax-blends-creator-and-visualizer`
- `wax-advanced-drop-mechanics-toolkit`
- `wax-blend-economy-simulator`

It builds upon the foundational standards defined in:
- `pixel-journey-standards`
- `pixel-journey-templates`
- `gitbook-docs`
- `wax-ecosystem-blueprint-catalog`

---

## 8. License & Credits

MIT License

Built with care as a reference example for high-quality WAX user experiences.

Pixel Journey — Educational, practical, and beautiful interfaces for public blockchain infrastructure.

*Last updated: July 2026*
