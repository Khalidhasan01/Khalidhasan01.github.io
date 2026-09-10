import { useEffect } from 'react';
import { frame, cancelFrame, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { NAV_OFFSET, setLenis } from '../lib/smoothScroll';

/*
 * Lenis smooth scroll, driven by Framer Motion's frame loop.
 *
 * The important detail: `autoRaf: false`. Letting Lenis run its own
 * requestAnimationFrame alongside Framer Motion's is the documented cause of
 * jittery scroll-linked animation — two loops sampling scroll position at
 * different points in the frame. Driving lenis.raf() from frame.update means
 * one loop, and `useScroll`/`useTransform` stay in sync because Lenis moves
 * real native scroll rather than transforming a wrapper.
 *
 * Renders nothing. Disabled entirely under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      // Gentle expo-out: fast pickup, long settle. The "expensive" feel.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Lets plain <a href="#section"> links scroll smoothly without wiring.
      anchors: { offset: NAV_OFFSET },
    });

    setLenis(lenis);

    const update = ({ timestamp }) => lenis.raf(timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return null;
}
