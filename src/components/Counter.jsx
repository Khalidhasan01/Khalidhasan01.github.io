import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';

export default function Counter({ value, suffix = '', className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v) + suffix);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.4, ease: 'easeOut' });
    return controls.stop;
  }, [inView, value, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
