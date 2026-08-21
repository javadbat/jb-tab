# Changelog

## [0.1.0] - 2026-08-21

- Add `jb-tab`, `jb-tab-list`, `jb-tab-trigger`, and `jb-tab-content`.
- Add controlled, default, and nullable selection modes.
- Add animated horizontal and vertical tab indicators.
- Add per-trigger indicator colors using design-system variants or arbitrary CSS colors.
- Automatically adapt selected trigger text for contrast with its indicator color.
- Add subtle semantic trigger colors and apply semantic selected-text colors without a delayed update.
- Add list-level `xs`, `sm`, `md`, `lg`, and `xl` sizes shared by every trigger.
- Derive the list background radius from its trigger radius and padding.
- Add keyboard navigation and ARIA tab relationships.
- Add React wrappers for every custom element.
- Represent `jb-tab-content` visibility with `hidden` instead of `selected`, allowing consumers to show an additional panel without changing the selected trigger.
