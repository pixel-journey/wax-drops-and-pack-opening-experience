# wax-drops-and-pack-opening-experience — Drops & Pack Opening Experience

> **Status:** 🔄 In Active Development (Pixel Journey Standard)  
> **Category:** Atomic Ecosystem – Drops & Pack Openings  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Provide a high-quality, educational, and practical reference example for building delightful, transparent, and fair drop and pack opening experiences on WAX.

This repository is designed to be useful for both human developers and AI-assisted development.

---

## Vision & Long-Term Participation Mindset

Opening drops and packs is one of the most emotionally engaging moments in Web3 on WAX. A great opening experience builds excitement, trust, and long-term participation.

This blueprint aims to raise the standard by delivering experiences that are:

- **Joyful** — satisfying animations and feedback
- **Transparent** — clear probability communication
- **Fair** — honest mechanics and good UX
- **Educational** — helps users understand what is happening

We build this for long-term participants in the WAX ecosystem — both end users and developers.

---

## Quick Start

**For Human Developers**
1. Read the Educational Core and Architecture sections.
2. Review the Integration Guide.
3. Explore the Code Examples and Best Practices.
4. Use the patterns in your own project.

**For AI Agents & AI-Assisted Development**
- Start with the `spec.yaml` for structured machine instructions.
- Use the Architecture and Integration Guide sections as high-quality context.
- Follow the patterns shown in the examples when generating code.

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
- Build systems that feel premium and trustworthy

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
  RevealAnimation.tsx          # Core animated reveal engine
  ProbabilityBreakdown.tsx     # Visual + textual probability display
  ResultDisplay.tsx
  ClaimPanel.tsx               # Guided on-chain claiming with previews
  CollectionUpdate.tsx
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
6. Final state is confirmed from chain

---

## 3. Integration Guide

### How to Integrate This Pattern

**Step 1: Basic Reveal**
Start by implementing the `RevealAnimation` component with your drop/pack data.

**Step 2: Add Probability Display**
Use the `ProbabilityBreakdown` pattern to show clear odds to the user.

**Step 3: Connect On-Chain Claiming**
Integrate the `ClaimPanel` using WharfKit. Always show transaction previews.

**Step 4: Add Feedback & Polish**
Implement optimistic collection updates and proper error handling.

### Integration Levels

| Level           | Description                                                                 | When to Use                              |
|-----------------|-----------------------------------------------------------------------------|------------------------------------------|
| **Minimal**         | Basic reveal animation + static probability list + simple claim button         | Prototypes, learning, MVPs               |
| **Recommended**     | Full guided claiming, optimistic updates, good animations, clear probability breakdown | Most production applications             |
| **Advanced**        | Interactive probability explorer, simulation mode, advanced animations         | High-engagement games or collector tools |

See `spec.yaml` for machine-readable definitions of these levels.

---

## 4. Best Practices & Options

### Probability Visualization

- Always combine **visual** and **textual** representations
- Consider showing expected value when relevant
- Use progressive disclosure to avoid overwhelming users
- Test with real users — clarity builds trust

### Animation Principles

- Build anticipation before the reveal
- Use motion and scale to communicate rarity
- Respect `prefers-reduced-motion`
- Prioritize performance (use transform and opacity)

### On-Chain Safety

- Always show clear transaction previews using WharfKit
- Handle errors gracefully with helpful messages
- Use optimistic updates only when you can safely rollback
- Communicate clearly when something goes wrong

### Multiple Options

You can choose different levels of complexity depending on your needs:
- Simple static probability list (fast to implement)
- Rich visual probability breakdown (recommended for most cases)
- Full interactive explorer + simulation (for advanced tools)

---

## 5. Demo & Code Examples

This repository provides both simple and more complete examples.

**Simple / Minimal Example**
- Basic reveal animation
- Static probability list
- Simple claiming button

**Recommended / Production Example**
- Rich animations with rarity feedback
- Clear visual + textual probability breakdown
- Full guided claiming flow with previews
- Optimistic collection updates

> Look for example code in the repository (components and patterns are designed to be copied and adapted).

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
