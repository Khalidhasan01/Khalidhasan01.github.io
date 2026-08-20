import { motion } from 'framer-motion';
import Counter from './Counter';
import './Stats.css';

const stats = [
  { value: 3, suffix: '+', label: 'years of experience' },
  { value: 7, suffix: '+', label: 'projects delivered' },
  { value: 6, suffix: '+', label: 'tech stacks' },
  { value: 10, suffix: '+', label: 'product surfaces' },
];

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          by the numbers
        </motion.p>

        <motion.div
          className="stats-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              variants={gridItem}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 350, damping: 24 } }}
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
