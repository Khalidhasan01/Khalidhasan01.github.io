import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../lib/motion';
import './PageTransition.css';

/*
 * Page-change choreography.
 *
 * PageTransition sits inside an <AnimatePresence mode="wait">, so the outgoing
 * page finishes leaving before the incoming one arrives — no cross-fade mush,
 * and the scroll reset lands in the gap between them.
 *
 * PageSweep is deliberately NOT part of that subtree. It used to live inside
 * PageTransition and would freeze mid-wipe whenever a lazily-loaded page chunk
 * resolved and React re-rendered the Suspense boundary underneath it. It's
 * chrome, like the scroll-progress bar, so it belongs beside the page rather
 * than inside it — remounted by key on each page change.
 */

const page = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out, delay: 0.08 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.26, ease: ease.inOut } },
};

/** Reduced motion: swap instantly, no travel. */
const instant = { initial: {}, animate: {}, exit: {} };

export default function PageTransition({ children }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="page-layer"
      variants={reduce ? instant : page}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

/**
 * Accent line that wipes across the top on each page change — the same visual
 * language as the flagship panel's scan sweep, rather than the generic
 * full-bleed curtain every agency portfolio uses.
 */
export function PageSweep() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.span
      className="page-sweep"
      aria-hidden="true"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{
        clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)', 'inset(0 0 0 100%)'],
        transition: { duration: 0.75, ease: ease.inOut, times: [0, 0.45, 1] },
      }}
    />
  );
}
