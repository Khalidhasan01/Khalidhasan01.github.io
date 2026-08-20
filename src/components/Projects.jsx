import { motion } from 'framer-motion';
import {
  Activity,
  Shield,
  Globe,
  Smartphone,
  Building2,
  BarChart3,
  TestTubeDiagonal,
} from 'lucide-react';
import TiltCard from './TiltCard';
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
    desc: 'Clinical tuberculosis case-management system for Lunge Zürich. Manages the full patient journey — diagnostics, therapy, contact tracing, screening, and DOT compliance. Frontend is a data-heavy React 19 SPA with auto-saving forms; backend is a Kotlin/Spring Boot REST API with jOOQ + PostgreSQL.',
    tags: ['React 19', 'Vite', 'TanStack', 'Kotlin', 'Spring Boot', 'PostgreSQL', 'Azure AD'],
    featured: true,
  },
  {
    icon: <Shield size={18} />,
    name: 'FiLiP SK — Select Network',
    type: 'frontend',
    typeLabel: 'frontend',
    desc: 'Insurance & wealth-management web portal for Swiss Life Select Slovakia. Multi-role SPA serving customers, advisors, and admins with contract management, e-signatures, and campaign tools.',
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
    desc: 'Cross-platform NativeScript mobile app for Swiss Life Select CZ. Customer self-service portal with contract management, digital signatures, advisor chat, real-estate monitoring, and offline-first CouchBase storage.',
    tags: ['NativeScript', 'Angular 11', 'CouchBase', 'Firebase', 'GraphQL', 'Biometrics'],
  },
  {
    icon: <Building2 size={18} />,
    name: 'Adinova — Healthcare Advisory',
    type: 'fullstack',
    typeLabel: 'full-stack',
    desc: 'Healthcare/financial advisory management platform with appointment scheduling, Google Calendar sync, CRM, FileVault document management, and background job processing via Hangfire.',
    tags: ['Angular 21', '.NET 8', 'MongoDB', 'SignalR', 'Hangfire', 'RabbitMQ'],
  },
  {
    icon: <BarChart3 size={18} />,
    name: 'OVB Stock App',
    type: 'frontend',
    typeLabel: 'frontend',
    desc: 'Financial/investment platform in an Nx monorepo. Covers contracts, DMS, appointments, real-time chat, e-signatures, review workflows, goal tracking, and zoneless change detection.',
    tags: ['Angular 20', 'Nx', 'NgRx', 'Tailwind', 'Chart.js', 'SignalR'],
  },
  {
    icon: <TestTubeDiagonal size={18} />,
    name: 'Automation Tool — INB',
    type: 'fullstack',
    typeLabel: 'full-stack',
    desc: 'Enterprise multi-tenant test automation platform. Manages UI, API, Mobile, and Kafka test workflows with database-per-tenant isolation, scheduling, and real-time reporting via SignalR.',
    tags: ['Angular 19', '.NET 8', 'MongoDB', 'SignalR', 'Docker', 'Tailwind'],
  },
];

export default function Projects() {
  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          featured projects
        </motion.p>

        <motion.div
          className="projects-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {projects.map((p, i) => (
            <TiltCard
              key={i}
              className={`project-card ${p.featured ? 'featured' : ''}`}
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
              <div className="project-tags">
                {p.tags.map((tag, j) => (
                  <span key={j} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
