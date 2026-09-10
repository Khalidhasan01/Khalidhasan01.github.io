import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { spring } from '../lib/motion';
import './Magnetic.css';

export default function Magnetic({ children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      className="magnetic"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={spring.magnetic}
    >
      {children}
    </motion.div>
  );
}
