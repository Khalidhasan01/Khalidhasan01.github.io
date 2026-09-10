import { motion } from 'framer-motion';
import Counter from './Counter';
import { distance, fadeUp, spring, stagger, viewportOnce } from '../lib/motion';
import './Stats.css';

const stats = [
  { value: 3, suffix: '+', label: 'years of experience' },
  { value: 7, suffix: '+', label: 'projects delivered' },
  { value: 6, suffix: '+', label: 'tech stacks' },
  { value: 10, suffix: '+', label: 'product surfaces' },
];

const gridContainer = stagger(0.1);
const gridItem = fadeUp(0, distance.lg);
const label = fadeUp();

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <motion.p
          className="section-label"
          variants={label}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          by the numbers
        </motion.p>

        <motion.div
          className="stats-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              variants={gridItem}
              whileHover={{ y: -5, transition: spring.lift }}
            >
              <Counter className="stat-number" value={s.value} suffix={s.suffix} />
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
