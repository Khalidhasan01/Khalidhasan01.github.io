# My Portfolio — Features

A personal portfolio website for **Khalid Hasan**, Software Engineer at SELISE Digital Platforms.
Built with **React 19 + Vite 8**, animated with **Framer Motion**, styled with hand-written CSS (no UI framework), and deployed to **GitHub Pages**.

---

## 1. Multi-Page SPA Routing (No Router Library)

Implemented manually in `src/App.jsx` + `src/lib/paths.js` using the History API:

- **Four pages**: Home (`/`), Projects (`/projects`), About (`/about`), Contact (`/contact`)
- `pushState` navigation with full `popstate` (back/forward button) support
- Deep links work — the page is derived from `window.location.pathname` on load
- On sub-pages, nav links fall back to `/#section-id` hash URLs that scroll to home sections
- **404 fallback**: the deploy script copies `index.html` → `404.html` so GitHub Pages serves the SPA on any route

## 2. Light / Dark Theme System

- Toggle in the navbar; preference persisted in `localStorage`
- First visit respects the OS `prefers-color-scheme`
- **FOUC prevention**: an inline script in `index.html` sets `data-theme` before React boots
- **Circular reveal animation**: uses the View Transition API to expand the new theme outward from the toggle button (radius computed from button position)
- Graceful fallback (fading overlay) for browsers without View Transitions
- Full theme defined as CSS custom properties in `src/index.css` — dark mode is a designed brand palette, not just an inversion

## 3. Navbar

- Floating glass-style header with logo (`khalid.github.io`)
- Desktop links + active-page highlighting
- **Mobile menu**: hamburger toggle, click-outside close, `Escape` key close, scrim overlay, and body scroll-lock while open
- Automatically closes if the viewport is resized past the mobile breakpoint

## 4. Hero Section

- Word-by-word staggered headline animation (“I build systems and interfaces that scale.”)
- Identity row with avatar photo, name, role, and location
- Scroll-linked **parallax + fade** on the right-hand column
- Magnetic CTA buttons and social links (GitHub / LinkedIn / email)

## 5. Live GitHub Card

`src/components/GitHubCard.jsx` + `src/lib/github.js`

- Fetches live profile data (repos, followers, join year) from the GitHub API
- Renders a **contribution heatmap** (last ~26 weeks) powered by the jogruber contributions API
- Stats displayed as animated count-up numbers
- **Session-storage caching** with a 1-hour TTL to avoid rate limits / refetches
- Loading skeleton state and randomized fallback cells if the API fails
- Responsive: fewer weeks shown on narrow screens (18 vs 26), with tooltips per day
- Language badge row (AG / TS / C# / KT / RX / NS)

## 6. “By the Numbers” Stats Band

- Animated stat counters (years, projects, stacks, surfaces) that count up when scrolled into view (`Counter.jsx`, framer-motion `animate` + `useInView`)
- Spring-based hover lift on each card

## 7. “What I Do” Services Section

- Three service cards: Frontend, Backend, Mobile development
- Each card links into the Projects section; header links to the About page

## 8. Featured Projects Grid (Home)

Data-driven from `src/lib/projects.js`:

- Curated subset of projects marked for the home page
- Badges for project type and **featured/flagship** status
- **Cross-section tech filtering**: clicking a technology pill in the Tech Stack section scrolls to Projects and highlights matching cards while dimming non-matches
  - Matching logic in `src/lib/techMatch.js` normalizes names (strips version numbers like “Angular 21”, maps aliases like “Tailwind CSS” → “tailwind”)
  - Dismissible filter chip shows the match count
  - Empty-state message when no project matches

## 9. Tech Stack Section

- Six categorized groups: languages, frontend, backend, databases & messaging, devops & tools, integrations
- Pills animate in with nested stagger choreography
- Hover: spring lift + scale, plus a **cursor-following radial spotlight** driven by `--mx`/`--my` CSS variables

## 10. Dedicated Projects Page

- Word-by-word animated hero (“Things I’ve built.”)
- **Category filter tabs** (`all / full-stack / frontend / mobile / personal`) with live counts and an animated sliding pill indicator (`layoutId` spring)
- Card enter/exit transitions via `AnimatePresence` + `popLayout`
- **Flagship spotlight** panel: LZTB clinical platform with an animated mock “screening table” visualization, scan-line effect, sweep highlight, and cursor spotlight
- NDA-aware labeling: client work is tagged `work · client (NDA)` instead of linked
- Per-card status lines (“building…”, “exploration”) and external links where available
- **“What I build at SELISE”** capability grid describing NDA work by category (clinical tables, multi-role portals, e-signatures, offline-first mobile, etc.), each item with its own cursor spotlight
- Closing CTA with magnetic “get in touch” button

## 11. About Page

- Animated intro headline + bio summary with availability/location sidebar
- **Career timeline** (intern → associate → software engineer, plus degree)
- “Where I’m headed” direction section with focus-area tags
- **Tools & proficiency matrix** — categories with 1–5 dot depth indicators
- “How I work” principle cards with cursor-spotlight hover
- Ownership highlights list

## 12. Contact Page — Interactive Business Card

The centerpiece of the contact experience:

- **3D tilt card** that tracks the cursor (perspective rotation via springs)
- **Flip animation** (click/tap) revealing contact details (email, GitHub, LinkedIn) on the back
- Embedded **QR code** (`qrcode.react`) linking to the live site
- **Copy email to clipboard** button with “copied!” confirmation feedback
- **Download card as PNG** using `html-to-image` (auto-flips the card back before capture, 2× pixel ratio)
- Magnetic email / GitHub / LinkedIn action buttons
- Reduced-motion users get an instant (0 s) flip

## 13. Reusable Interaction Components

| Component | What it does |
|---|---|
| `TiltCard.jsx` | Mouse-tracked 3D tilt with spring damping + exposes cursor position for spotlight glows |
| `Magnetic.jsx` | Wraps buttons/links so they’re gently attracted toward the cursor with spring physics |
| `Counter.jsx` | Scroll-triggered animated number counter |
| `Blobs.jsx` | Ambient blurred gradient orbs drifting in the background |
| `BrandIcons.jsx` | Inline SVG GitHub / LinkedIn icons (no icon-font dependency) |

## 14. Visual Design System

- **JetBrains Mono** typography throughout — terminal/editor aesthetic
- Fixed dotted-grid background pattern + corner gradient orb
- **Scroll progress bar** pinned to the top, smoothed with a spring
- Consistent radius/spacing tokens, responsive tiering (1440px / 768px / 480px breakpoints), safe-area-inset support for notched devices

## 15. Motion & Accessibility

- Scroll-reveal animations (`whileInView`) with staggered children across every section
- **`prefers-reduced-motion` fully respected**: blobs are removed, smooth-scroll becomes instant, theme transition skips the reveal, card flip is instant
- Semantic HTML with ARIA: `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-selected`, `role="tablist"/"tab"`, `aria-live` for copy feedback, `hidden` attribute on closed menus
- Keyboard support (Escape closes the mobile menu)

## 16. SEO & Meta

- Descriptive title, description, keywords, and author meta tags
- Open Graph tags (`og:title`, `og:description`, `og:type`)
- Custom SVG favicon

## 17. Tooling & Deployment

- **Vite 8** dev server/build with the official React plugin (Oxc-powered)
- **Oxlint** for linting (`npm run lint`)
- One-command **GitHub Pages deploy**: `npm run deploy` (builds, copies `index.html` → `404.html` for SPA deep links, publishes `dist/` via `gh-pages`)
