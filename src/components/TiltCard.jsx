import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { spring } from '../lib/motion';
import { applySpotlight } from '../lib/useSpotlight';

export default function TiltCard({ children, ...props }) {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), spring.tilt);
  const rotateY = useSpring(useMotionValue(0), spring.tilt);

  const handleMouseMove = (e) => {
    const el = ref.current;
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
