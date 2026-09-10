/* ==========================================================================
   Smooth-scroll access layer.

   Holds the live Lenis instance (or null, when smooth scroll is disabled for
   reduced-motion users) and exposes scroll helpers that degrade to native
   behaviour. Callers never branch on "is Lenis running?" — they just ask for
   a scroll and get the best available one.
   ========================================================================== */

/** Matches the fixed navbar height, replacing `scroll-margin-top`. */
export const NAV_OFFSET = -72;

let lenis = null;

export const setLenis = (instance) => {
  lenis = instance;
};

export const getLenis = () => lenis;

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll to an element id. No-ops silently if the target isn't mounted. */
export function scrollToId(id, { immediate = false } = {}) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenis && !immediate) {
    lenis.scrollTo(target, { offset: NAV_OFFSET });
    return;
  }
  target.scrollIntoView({ behavior: immediate || prefersReduced() ? 'auto' : 'smooth' });
}

/** Jump to the top. Page changes use `immediate` so the new page starts clean. */
export function scrollToTop({ immediate = true } = {}) {
  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
}

/*
 * Scroll locking for the mobile menu.
 *
 * `body { overflow: hidden }` alone does not hold Lenis — it drives real
 * scroll through its own loop and will keep going. Both are needed: stop()
 * for Lenis, overflow for native touch scrolling underneath it.
 */
export function lockScroll() {
  lenis?.stop();
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  lenis?.start();
  document.body.style.overflow = '';
}
