import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Activity,
  Shield,
  Globe,
  Smartphone,
  Building2,
  BarChart3,
  TestTubeDiagonal,
} from 'lucide-react';
import TiltCard from './TiltCard';
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

const projects = [
  {
    icon: <Activity size={18} />,
    name: 'LZTB — TB-App',
    type: 'fullstack',
    typeLabel: 'full-stack',
    desc: 'DOT-compliant clinical TB case management for Lunge Zürich — diagnostics, therapy, contact tracing, and screening in one workflow, with auto-saving forms and live lab-result screening tables.',
    tags: ['React 19', 'Vite', 'TanStack', 'Kotlin', 'Spring Boot', 'PostgreSQL', 'Azure AD'],
    featured: true,
  },
  {
    icon: <Shield size={18} />,
    name: 'FiLiP SK — Select Network',
    type: 'frontend',
    typeLabel: 'frontend',
    desc: 'Insurance & wealth-management web portal for Swiss Life Select Slovakia. Multi-role portal serving customers, advisors, and admins with contract management, e-signatures, and campaign tools.',
    tags: ['Angular 13', 'NgRx', 'GraphQL', 'Apollo', 'SSR', 'PWA', 'SignalR'],
  },
  {
    icon: <Globe size={18} />,
    name: 'FiLiP CZ — Select Network',
    type: 'frontend',
    typeLabel: 'frontend',
    desc: 'Financial advisory portal for Swiss Life Select Czech Republic. Unifies customer, advisor, and admin portals with calculators, real-estate tools, e-signature, and 100+ shared packages.',
    tags: ['Angular', 'NgRx', 'SSR', 'PWA', 'ECAP3', 'SignalR'],
  },
  {
    icon: <Smartphone size={18} />,
    name: 'FiLiP Mobile — FC-CZ',
    type: 'mobile',
    typeLabel: 'mobile',
    desc: 'Cross-platform mobile app for Swiss Life Select CZ. Customer self-service portal with contract management, digital signatures, advisor chat, real-estate monitoring, and offline-first storage.',
    tags: ['NativeScript', 'Angular 11', 'CouchBase', 'Firebase', 'GraphQL', 'Biometrics'],
  },
  {
    icon: <Building2 size={18} />,
    name: 'Adinova — Healthcare Advisory',
    type: 'fullstack',
    typeLabel: 'full-stack',
    desc: 'Advisory management platform with built-in CRM and appointment scheduling — calendar sync, document management, and background jobs keep client workflows moving without manual chasing.',
    tags: ['Angular 21', '.NET 8', 'MongoDB', 'SignalR', 'Hangfire', 'RabbitMQ'],
  },
  {
    icon: <BarChart3 size={18} />,
    name: 'OVB Stock App',
    type: 'frontend',
    typeLabel: 'frontend',
    desc: 'Financial/investment platform covering contracts, document management, appointments, real-time chat, e-signatures, review workflows, and goal tracking.',
    tags: ['Angular 20', 'Nx', 'NgRx', 'Tailwind', 'Chart.js', 'SignalR'],
  },
  {
    icon: <TestTubeDiagonal size={18} />,
    name: 'Automation Tool — INB',
    type: 'fullstack',
    typeLabel: 'full-stack',
    desc: 'Enterprise multi-tenant test automation platform. Manages UI, API, and mobile test workflows with per-tenant isolation, scheduling, and real-time reporting.',
    tags: ['Angular 19', '.NET 8', 'MongoDB', 'SignalR', 'Docker', 'Tailwind'],
  },
];

export default function Projects({ activeTech = null, onSelectTech }) {
  const matchedIndexes = useMemo(
    () => (activeTech ? matchProjects(activeTech, projects) : null),
    [activeTech]
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

          {projects.map((p, i) => {
            const dimmed = matchedIndexes !== null && !matchedIndexes.includes(i);
            const highlighted = matchedIndexes !== null && matchedIndexes.includes(i);
            return (
              <TiltCard
                key={i}
                className={`project-card ${p.featured ? 'featured' : ''} ${
                  highlighted ? 'is-highlighted' : ''
                } ${dimmed ? 'is-filtered-out' : ''}`}
                variants={gridItem}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 350, damping: 24 } }}
              >
                <div className="project-card-header">
                  <div className="project-icon">{p.icon}</div>
                  <div className="project-badges">
                    <span className={`project-type ${p.type}`}>
                      {p.typeLabel}
                    </span>
                    {p.featured && (
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
