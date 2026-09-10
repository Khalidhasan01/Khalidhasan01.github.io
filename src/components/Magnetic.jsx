import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { spring } from '../lib/motion';
import './Magnetic.css';

/*
 * Pulls its child toward the cursor.
 *
 * The inner span travels a little further than the wrapper, so the label
 * leads the button rather than moving with it as one rigid block — a small
 * parallax that's most of what makes the effect read as physical.
 */
const PULL = 0.32;
const LABEL_LEAD = 0.18;

export default function Magnetic({ children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { height, width, left, top } = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (left + width / 2)) * PULL,
      y: (e.clientY - (top + height / 2)) * PULL,
    });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  if (reduce) return <div className="magnetic">{children}</div>;

  return (
    <motion.div
      ref={ref}
      className="magnetic"
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={spring.magnetic}
    >
      <motion.div
        className="magnetic-inner"
        animate={{ x: pos.x * LABEL_LEAD, y: pos.y * LABEL_LEAD }}
        transition={spring.magnetic}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
