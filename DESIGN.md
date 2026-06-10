---
name: hovanhoa.net
description: Personal portfolio + blog — quiet editorial canvas with warm graphite ink and a single ember-orange accent.
colors:
  canvas: "#ffffff"
  canvas-sub: "#fafafa"
  surface: "#ffffff"
  surface-2: "#f6f6f5"
  border: "#e8e8e6"
  border-strong: "#dededc"
  hairline: "#ededeb"
  ink: "#0c0c0c"
  ink-secondary: "#54534f"
  ink-tertiary: "#8c8b85"
  ink-faint: "#b6b5ae"
  graphite: "#3a3936"
  graphite-ink: "#1c1b19"
  graphite-bg: "#efeeec"
  ember-orange: "#d8602f"
  ember-orange-ink: "#b54a1f"
  ember-orange-bg: "#fbeee7"
  status-ok: "#1f8a5b"
  status-warn: "#c98a16"
  status-down: "#d23b3b"
typography:
  display:
    fontFamily: "Geist Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 3rem)"
    fontWeight: 600
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.3rem)"
    fontWeight: 600
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Geist Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.5vw, 1.28rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Geist Sans, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  sm: "7px"
  md: "11px"
  lg: "16px"
  full: "9999px"
spacing:
  grid-gap: "0.75rem"
  page-pad: "clamp(20px, 5vw, 56px)"
components:
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  app-pill:
    backgroundColor: "{colors.ember-orange-bg}"
    textColor: "{colors.ember-orange-ink}"
    rounded: "{rounded.full}"
    padding: "0.375rem 0.75rem"
  eyebrow:
    textColor: "{colors.ink-tertiary}"
    typography: "{typography.label}"
---

# Design System: hovanhoa.net

## 1. Overview

**Creative North Star: "The Home Directory"**

`~/hovanhoa` is a place, not a brochure. The site is the hub of a family of subdomains (insight, gallery, music, status, info), and the visual system treats it like a well-kept home directory: everything lowercase, everything in its path, quiet structure with warm, personal details left in the margins. The writing is the product; the design's job is to make long-form technical prose effortless to read and to make the place feel unmistakably lived-in — the blinking caret, the faux terminal window, the mono breadcrumb labels.

The system is a near-monochrome editorial canvas — pure white (light) or near-black (dark), warm graphite ink — with exactly one voice of color: Ember Orange. Orange marks "you are here" (the current app in the nav), "go here" (hover states, the post-tile arrow), and "this is alive" (the ecosystem graph, the coding sparkline). It explicitly rejects the SaaS landing page (gradient heroes, metric cards, marketing-speak) and the over-designed showcase (heavy animation, 3D, scroll-jacking). Warmth comes from voice, the ember accent, and small intentional touches — never from a louder system.

**Key Characteristics:**
- All-lowercase presentation (CSS `text-transform`; source text stays normal-case for screen readers)
- Geist Sans for prose, Geist Mono for every label, date, tag, and terminal flavor
- Flat, border-drawn surfaces; shadows only on true overlays
- One accent color used sparingly; graphite carries structure
- Token layer (`--rd-*`) shared across the whole subdomain family, light and dark

## 2. Colors

A near-monochrome warm-neutral ramp with a single ember accent; in dark mode the same roles invert via the `--rd-*` token layer (toggle in the nav, cookie-shared across `*.hovanhoa.net`).

### Primary
- **Warm Graphite** (#3a3936): the working accent — underline-link hovers, meter fills, the terminal prompt `$`, traffic-light rings. Soft pencil-dark with a warm cast; authority without coldness.
- **Graphite Ink** (#1c1b19): the pressed/hover state of graphite elements and emphasized links.
- **Graphite Wash** (#efeeec): tinted background for graphite-accented chips and fills.

### Secondary
- **Ember Orange** (#d8602f): the one voice of color. Current-app pill, post-tile hover arrow and dot, active tags, ecosystem-graph edges, sparkline. Never decoration — always "here", "go", or "alive".
- **Ember Ink** (#b54a1f): text-on-light ember (passes contrast where #d8602f as text would not) — hover text color, active nav link.
- **Ember Wash** (#fbeee7): tinted pill/selection background behind ember text.

### Tertiary
- **Status Green / Amber / Red** (#1f8a5b / #c98a16 / #d23b3b): operational status only (uptime, health indicators). Never used for brand or emphasis.

### Neutral
- **Canvas** (#ffffff) and **Canvas Sub** (#fafafa): page background and quiet alternating bands.
- **Surface** (#ffffff) / **Surface-2** (#f6f6f5): card faces and inset wells (terminal title bar, meter tracks).
- **Border** (#e8e8e6) / **Border Strong** (#dededc) / **Hairline** (#ededeb): the structural system — 1px lines do the work shadows would do elsewhere.
- **Ink** (#0c0c0c): headings and primary text.
- **Ink Secondary** (#54534f): body prose, descriptions, lead paragraphs.
- **Ink Tertiary** (#8c8b85): dates, tags, eyebrows, meta — small mono labels only.
- **Ink Faint** (#b6b5ae): disabled/ghost text only.

### Named Rules
**The One Ember Rule.** Ember Orange touches at most ~10% of any screen. It means "current", "interactive", or "live data" — nothing else, with one named exception: the footer's section labels run in Ember Ink as a deliberate brand cadence (the footer is the site's one ember-washed surface, and the labels belong to it). If orange appears anywhere else and none of the three meanings applies, remove it.

**The Meta-Only Gray Rule.** Ink Tertiary (#8c8b85) and below are forbidden for body prose and for any interactive text (links, tags, nav items) — both need Ink or Ink Secondary. Tertiary grays are reserved for small non-interactive mono meta (dates, eyebrows, footnotes) where AA incidental thresholds apply.

## 3. Typography

**Display Font:** Geist Sans (with Inter, system-ui fallback)
**Body Font:** Geist Sans
**Label/Mono Font:** Geist Mono (with ui-monospace, Menlo fallback)

**Character:** One sans family in multiple weights, counterpointed by a mono voice. Geist Sans is quiet and contemporary; Geist Mono carries all the personality — every date, tag, nav link, eyebrow, and terminal line. Everything renders lowercase (except the uppercase mono eyebrow), which is the brand's signature voice.

### Hierarchy
- **Display** (600, clamp(1.9rem, 4vw, 3rem), -0.04em): the page h1 ("hovanhoa", post titles). Confident but well under shouting size.
- **Headline** (600, clamp(1.7rem, 3vw, 2.3rem), -0.035em): section headings (`.rd-h-sec`).
- **Title** (700, 1.25rem → 1.5rem at sm, tight tracking): post-tile titles in the blog feed.
- **Lead** (400, clamp(1.05rem, 1.5vw, 1.28rem), 1.6, max 46ch, `text-wrap: pretty`): the hero intro paragraph (`.rd-lead`), in Ink Secondary.
- **Body** (400, 0.875rem, leading-7): post excerpts and rendered article prose (via `@tailwindcss/typography` `.document` preset). Article measure stays ≤ 72ch.
- **Label** (mono, 500, 11.5px, +0.14em, UPPERCASE): the eyebrow (`.rd-eyebrow`) — the one uppercase element in a lowercase world. Mono meta (dates, tags, nav links) runs 12–13px without the tracking.

### Named Rules
**The Lowercase Rule.** Lowercase is applied visually (`text-transform: lowercase` on body); source text and markup remain normal-case so screen readers and copy-paste stay correct. Never hard-code lowercase strings to fake the effect.

**The Mono Meta Rule.** If text is data about content (date, tag, path, status, label), it is Geist Mono. If it is content, it is Geist Sans. No exceptions, no third font.

## 4. Elevation

Flat by default. Structure is drawn, not lifted: 1px borders (Border/Hairline), background tints (Surface-2, the washes), and the left timeline rail of the blog feed convey hierarchy. Shadows exist only as a response to true overlay — the nav app-switcher dropdown (Tailwind `shadow-lg`) — and dialogs/popovers if added later. Hover feedback is color movement (border darkens, text shifts to an ink/ember tone), never lift.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): dropdowns, popovers, dialogs — elements that genuinely float above the page. Nothing else.

### Named Rules
**The Hairline Rule.** If you reach for a shadow to separate two resting surfaces, use a 1px border or a Surface-2 tint instead. Shadows answer "is it floating?", not "is it separate?".

## 5. Components

Refined and restrained: quiet at rest, precise on hover. Feedback is a color shift over 0.18s ease; no transforms larger than the post-tile arrow's 4px slide, no bounce.

### Buttons
- **Shape:** fully rounded pill or soft square (7–11px) depending on context; the site is link-driven and has few true buttons.
- **Icon button** (theme toggle): 36px square, transparent at rest; hover gains Surface-2 background and Ink text. No border.
- **App-switcher pill:** Ember Wash background, Ember Ink mono text (13px, 600), fully rounded; a mono `/` prefix in Ember Orange. Hover dims to 80% opacity.
- **Hover / Focus:** color transitions at 0.18s; focus uses the browser's visible focus ring — never remove it.

### Chips
- **Style** (`.rd-chip`): Surface background, 1px Border, fully rounded, 12.5px medium text in Ink Secondary, 4px × 10px padding.
- **State:** tags in the blog feed are bare mono text instead — Ink Secondary at rest (they're interactive), Ember Ink + medium weight when active, Ember Ink on hover.

### Cards / Containers
- **Corner Style:** 11px (`--rd-r`); 16px (`--rd-r-lg`) for large feature panels.
- **Background:** Surface, with Surface-2 for inset regions (terminal title bar).
- **Shadow Strategy:** none — see The Hairline Rule.
- **Border:** 1px Border, darkening toward Border Strong on hover (0.18s).
- **Internal Padding:** 20–24px (`p-5`/`p-6`).

### Inputs / Fields
Not yet part of the system (no forms on the site). If added: Surface background, 1px Border, 7px radius, focus = Border Strong + visible focus ring; follow The Hairline Rule.

### Navigation
- Avatar (34px circle, 1px border) + app-switcher pill + inline mono links (13px, Ink Secondary — interactive text never drops below Ink Secondary) for the subdomain family; current app reads Ember Ink.
- Hover: links warm to Ember Ink over 0.2s. Mobile: inline links collapse, the pill's dropdown (Surface, 1px Border, 12px radius, Overlay shadow) takes over.
- Underline links in prose (`.rd-ulink`): 1.5px bottom border in Border Strong; hover shifts border to Graphite and text to Graphite Ink.

### Terminal Card (signature)
A faux terminal window in family mono: Surface-2 title bar with three hollow graphite traffic-light dots and a `~/hovanhoa` path; body lines as `$ command` (graphite prompt, Ink Secondary command) over Ink output; a 0.55ch Ember-free graphite caret blinking at 1.1s steps on the last line. The single most identity-dense component — reuse its grammar (prompt, path, caret) rather than inventing new terminal idioms.

### Blog Feed Timeline (signature)
Posts hang off a 1px left rail (Hairline, `--rd-line`) with a hollow 10px dot per entry (Border Strong ring on a Canvas fill, so it inverts with the theme); hovering anywhere on a tile turns the dot's ring and an arrow (`→`, slides 4px) Ember Orange and the title Ember Ink. The whole tile is clickable via a stretched link; tags sit above it and toggle independently.

## 6. Do's and Don'ts

### Do:
- **Do** keep body prose at Ink (#0c0c0c) or Ink Secondary (#54534f) — both clear 4.5:1 on Canvas. (The Meta-Only Gray Rule.)
- **Do** use Geist Mono for every piece of meta — dates, tags, paths, labels, nav. (The Mono Meta Rule.)
- **Do** draw structure with 1px borders and Surface-2 tints; reserve the Overlay shadow for things that float. (The Hairline Rule.)
- **Do** keep Ember Orange under ~10% of the screen and only meaning "current", "interactive", or "live". (The One Ember Rule.)
- **Do** ship a `prefers-reduced-motion: reduce` alternative for every animation, as the ecosystem graph's `eg-flow` already does.
- **Do** keep both themes in sync: every new color must be defined in `:root` and `.dark` in the `--rd-*` layer, since the tokens are shared across the subdomain family.

### Don't:
- **Don't** build anything that reads as a "SaaS landing page" — gradient heroes, metric cards, marketing-speak, corporate startup energy (PRODUCT.md anti-reference, verbatim).
- **Don't** drift toward the "over-designed showcase" — heavy animations, 3D, scroll-jacking; style must never overpower the writing (PRODUCT.md anti-reference, verbatim).
- **Don't** rebuild the generic dev-portfolio template — hero + skills grid + identical project cards.
- **Don't** introduce a second accent hue. Graphite is structure, Ember is the voice; status colors are operational only.
- **Don't** use gradient text, `border-left` color stripes, or glassmorphism anywhere.
- **Don't** uppercase anything except the mono eyebrow, and never bake lowercase into source strings.
- **Don't** use Ink Tertiary (#8c8b85) or Ink Faint (#b6b5ae) for running text — meta labels only.
- **Don't** animate with bounce or elastic easing; all transitions are short (≈0.18s) ease-outs. If a hover needs more than a color shift and a ≤4px slide, it's too much.
