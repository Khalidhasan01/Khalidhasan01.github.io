import { motion, useReducedMotion } from 'framer-motion';

export default function Blobs() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="blobs" aria-hidden="true">
      <motion.div
        className="blob blob-1"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-2"
        animate={{ x: [0, -35, 25, 0], y: [0, 25, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
