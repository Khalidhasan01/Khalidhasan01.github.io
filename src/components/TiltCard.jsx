import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { spring } from '../lib/motion';
import { applySpotlight } from '../lib/useSpotlight';

export default function TiltCard({ children, ...props }) {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), spring.tilt);
  const rotateY = useSpring(useMotionValue(0), spring.tilt);

  const handleMouseMove = (e) => {
    // currentTarget rather than ref.current: the ref is cleared as soon as a
    // page starts unmounting, but the card stays on screen through its exit
    // animation and keeps receiving mousemove — hovering a card while
    // navigating away used to throw on every frame.
    const el = e.currentTarget ?? ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateX.set(py * -8);
    rotateY.set(px * 8);
    applySpotlight(el, e.clientX, e.clientY);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
