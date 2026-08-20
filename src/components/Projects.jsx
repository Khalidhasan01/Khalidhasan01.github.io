import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import TiltCard from './TiltCard';
import { projects } from '../lib/projects';
import { matchProjects } from '../lib/techMatch';
import './Projects.css';

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Projects({ activeTech = null, onSelectTech, onNavigate }) {
  const homeProjects = useMemo(() => projects.filter((p) => p.home), []);
  const matchedIndexes = useMemo(
    () => (activeTech ? matchProjects(activeTech, homeProjects) : null),
    [activeTech, homeProjects]
  );

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <div className="projects-header">
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            featured projects
          </motion.p>

          <div className="projects-header-actions">
            {activeTech && (
              <motion.button
                type="button"
                className="filter-chip"
                onClick={() => onSelectTech(activeTech)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="filter-chip-count">
                  {matchedIndexes?.length ?? 0}
                </span>
                {activeTech}
                <X size={12} />
              </motion.button>
            )}
            <motion.a
              className="projects-view-all"
              href="#projects"
              onClick={(event) => onNavigate?.('projects', event)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              view all projects <ArrowUpRight size={14} />
            </motion.a>
          </div>
        </div>

        <motion.div
          className="projects-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {matchedIndexes !== null && matchedIndexes.length === 0 && (
            <div className="filter-empty">
              No projects tagged with “{activeTech}” yet.
            </div>
          )}

          {homeProjects.map((p, i) => {
            const dimmed = matchedIndexes !== null && !matchedIndexes.includes(i);
            const highlighted = matchedIndexes !== null && matchedIndexes.includes(i);
            return (
              <TiltCard
                key={p.name}
                className={`project-card ${p.flagship ? 'featured' : ''} ${
                  highlighted ? 'is-highlighted' : ''
                } ${dimmed ? 'is-filtered-out' : ''}`}
                variants={gridItem}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 350, damping: 24 } }}
              >
                <div className="project-card-header">
                  <div className="project-icon">{<p.icon size={18} />}</div>
                  <div className="project-badges">
                    <span className={`project-type ${p.type}`}>
                      {p.typeLabel}
                    </span>
                    {p.flagship && (
                      <span className="project-featured">featured</span>
                    )}
                  </div>
                </div>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.desc}</div>
              </TiltCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}