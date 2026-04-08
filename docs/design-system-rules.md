# Design System Rules

## Core stack

- Next.js App Router + TypeScript
- Tailwind CSS with semantic color tokens
- `cn()` utility from `clsx` + `tailwind-merge`

## Token principles

- Use semantic tokens in code (`bg-bg`, `text-text`, `text-muted`, `bg-panel`, `bg-green`, `bg-gold`).
- Avoid ad-hoc hex values inside feature components.
- Keep a clear mapping between Figma variables and Tailwind semantic tokens.

## Figma alignment

- Use semantic variable naming:
  - `color/bg/default`
  - `color/text/default`
  - `color/brand/green`
  - `color/brand/gold`
- Keep primitive values separate from semantic aliases.
- Define clear scopes for fills/strokes/text.

## Component conventions

- Reusable primitives in `components/ui/`.
- Feature-level composition in `components/sections/`, `components/members/`, `components/layout/`.
- Prefer semantic props (`variant`, `size`) over one-off class forks.

## Theming direction

- Continue moving toward CSS variable driven semantic theming for dark/light support.
- Keep visual style consistent with the current dark-first Superteam AU brand.
