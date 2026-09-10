import { useCallback } from 'react';

/*
 * Cursor-following spotlight.
 *
 * Writes the pointer's position relative to an element as `--mx` / `--my`,
 * which the CSS then uses as the centre of a radial glow. This was written
 * out by hand in four places (TiltCard, TechStack pills, the flagship panel,
 * and the SELISE capability grid); it lives here now.
 */

/** Write pointer position onto one element. Exported for callers that already
 *  have a mousemove handler of their own (e.g. TiltCard, which also tilts). */
export function applySpotlight(el, clientX, clientY) {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${clientX - r.left}px`);
  el.style.setProperty('--my', `${clientY - r.top}px`);
}

/**
 * Returns an `onMouseMove` handler.
 *
 * @param childSelector When set, the spotlight is applied to each matching
 *   descendant instead of the container — so a grid can light every card
 *   relative to the same cursor from a single listener.
 */
export function useSpotlight(childSelector) {
  return useCallback(
    (event) => {
      const { currentTarget, clientX, clientY } = event;
      if (childSelector) {
        currentTarget
          .querySelectorAll(childSelector)
          .forEach((el) => applySpotlight(el, clientX, clientY));
        return;
      }
      applySpotlight(currentTarget, clientX, clientY);
    },
    [childSelector]
  );
}
