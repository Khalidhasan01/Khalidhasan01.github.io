/* ==========================================================================
   Motion system — the single source of timing, easing, and reveal choreography.

   Every section used to declare its own `reveal` / `gridItem` / `wordItem`
   variants, so durations and offsets drifted between them. Compose from here
   instead: one vocabulary, one feel.
   ========================================================================== */

/** Easing curves. `out` is the house reveal curve — a soft expo-out. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.33, 1, 0.68, 1],
};

/** Duration scale. Reveals use `base`; micro-feedback uses `fast`. */
export const duration = {
  fast: 0.32,
  base: 0.55,
  slow: 0.8,
};

/** Named springs, so physics is consistent across every interactive surface. */
export const spring = {
  /** Card hover lift. */
  lift: { type: 'spring', stiffness: 350, damping: 24 },
  /** Small pills / chips. */
  pill: { type: 'spring', stiffness: 400, damping: 26 },
  /** Sliding layoutId indicators. */
  slide: { type: 'spring', stiffness: 380, damping: 30 },
  /** Magnetic cursor attraction. */
  magnetic: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
  /** 3D tilt (used as a useSpring config, so no `type`). */
  tilt: { stiffness: 200, damping: 20 },
};

/** Travel distances for reveals. Was previously 10/16/18/20/22/24/30 at random. */
export const distance = {
  sm: 12,
  md: 22,
  lg: 32,
};

/* ── Viewport triggers ── */
export const viewportOnce = { once: true, amount: 0.2 };
/** For tall grids that would otherwise never reach 20% visibility. */
export const viewportEarly = { once: true, amount: 0.1 };

/* ── Variant factories ──
   All return plain variant objects, so they drop straight into
   `variants={...}` and compose with `initial="hidden" whileInView="show"`. */

const transition = (d, delay) => ({ duration: d, ease: ease.out, delay });

/** Fade up from below — the default reveal. */
export const fadeUp = (delay = 0, y = distance.md, d = duration.base) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: transition(d, delay) },
});

/** Fade with no travel. */
export const fadeIn = (delay = 0, d = duration.base) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition(d, delay) },
});

/** Slide in horizontally. Negative x enters from the left. */
export const slideX = (x = -distance.sm, delay = 0, d = duration.fast) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: transition(d, delay) },
});

/** Pop up with a slight scale — for pills and small chips. */
export const popIn = (delay = 0, d = duration.fast) => ({
  hidden: { opacity: 0, y: 10, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: transition(d, delay) },
});

/**
 * Parent orchestrator. Children run their own `show` variant, offset by
 * `each` seconds. Holds no visual state of its own.
 */
export const stagger = (each = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren } },
});

/** Stagger presets, so callers stop inventing 0.025/0.04/0.05/0.07/0.12. */
export const staggerTight = () => stagger(0.04);
export const staggerBase = () => stagger(0.08);
export const staggerLoose = () => stagger(0.12);
