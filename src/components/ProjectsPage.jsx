import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Table2,
  Users,
  Contact,
  FileSignature,
  WifiOff,
  Layers,
  Languages,
  Blocks,
} from 'lucide-react';
import TiltCard from './TiltCard';
import Magnetic from './Magnetic';
import { projects, projectFilters } from '../lib/projects';
import './Projects.css';
import './ProjectsPage.css';

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const columnContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const columnItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const wordItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const tableContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const tableItem = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const viewportOnce = { once: true, amount: 0.15 };

const headlineWords = ['Things', 'I’ve', 'built', { text: '.', accent: true }];

const seliseCapabilities = [
  {
    icon: Table2,
    title: 'Data-heavy clinical tables',
    text: 'Complex screening and lab-result tables with domain-specific logic — status coding and findings interpretation.',
  },
  {
    icon: Users,
    title: 'Multi-role portals',
    text: 'Customer, advisor, and admin experiences unified into one application.',
  },
  {
    icon: Contact,
    title: 'CRM & lead management',
    text: 'Household and contact detail views, lead pipelines, and task calendars.',
  },
  {
    icon: FileSignature,
    title: 'Contract & e-signature flows',
    text: 'Digital contract management with e-signatures and calculators.',
  },
  {
    icon: WifiOff,
    title: 'Offline-first mobile',
    text: 'Cross-platform apps that keep working without a connection.',
  },
  {
    icon: Layers,
    title: 'Full-stack APIs',
    text: 'Kotlin/Spring Boot backends with jOOQ, Liquibase, and JWT auth wired to production frontends.',
  },
  {
    icon: Languages,
    title: 'Localization',
    text: 'Multi-language interfaces with formatted dates and translated flows.',
  },
  {
    icon: Blocks,
    title: 'Shared component libraries',
    text: 'Contributing to shared UI kits used across a product line’s frontends.',
  },
];

const screeningRows = [
  { patient: 'P-1042', result: 'Smear +', code: 'T0', tone: 'green' },
  { patient: 'P-0871', result: 'Smear −', code: 'T2', tone: 'blue' },
  { patient: 'P-0915', result: 'Pending', code: '—', tone: 'amber' },
  { patient: 'P-0764', result: 'Cx −', code: 'T1', tone: 'blue' },
];

const scopeLabel = (p) => (p.nda ? 'work · client (NDA)' : p.scope);

export default function ProjectsPage({ onNavigate }) {
  const [filter, setFilter] = useState('all');

  const flagship = projects.find((p) => p.flagship);
  const gridProjects = useMemo(() => {
    const rest = projects.filter((p) => !p.flagship);
    if (filter === 'all') return rest;
    return rest.filter((p) => p.categories.includes(filter));
  }, [filter]);

  const counts = useMemo(() => {
    const rest = projects.filter((p) => !p.flagship);
    return Object.fromEntries(
      projectFilters.map((f) => [
        f,
        f === 'all' ? rest.length : rest.filter((p) => p.categories.includes(f)).length,
      ])
    );
  }, []);

  const handleSpotlight = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const handleWisSpotlight = (e) => {
    const items = e.currentTarget.querySelectorAll('.wis-item');
    items.forEach((item) => {
      const r = item.getBoundingClientRect();
      item.style.setProperty('--mx', `${e.clientX - r.left}px`);
      item.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  };

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="container">
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            &gt;_ PROJECTS
          </motion.p>
          <motion.h1 variants={wordContainer} initial="hidden" animate="show">
            {headlineWords.map((w, i) => (
              <motion.span
                key={i}
                variants={wordItem}
                className={typeof w === 'object' && w.accent ? 'accent' : undefined}
                style={{ display: 'inline-block', marginRight: '0.22em' }}
              >
                {typeof w === 'object' ? w.text : w}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="projects-lede"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            Client systems, personal projects, and experiments &mdash;{' '}
            <span className="lede-underline">the ones I keep coming back to</span> live at the top.
          </motion.p>
        </div>
      </section>

      <section className="projects-list">
        <div className="container">
          <motion.div
            className="projects-tabs"
            role="tablist"
            aria-label="Filter projects by category"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {projectFilters.map((f) => (
              <motion.button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={`projects-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                layout
                whileTap={{ scale: 0.94 }}
              >
                {filter === f && (
                  <motion.span
                    className="projects-tab-pill"
                    layoutId="projects-tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="projects-tab-label">{f}</span>
                <span className="projects-tab-count">{counts[f]}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className="flagship"
            variants={columnContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            onMouseMove={handleSpotlight}
          >
            <span className="flagship-sweep" aria-hidden="true" />
            <div className="flagship-copy">
              <motion.p className="flagship-tag" variants={columnItem}>
                ◆ flagship
              </motion.p>
              <motion.h2 variants={columnItem}>{flagship.name}</motion.h2>
              <motion.p className="flagship-desc" variants={columnItem}>
                {flagship.desc}
              </motion.p>
              <motion.div className="flagship-tags" variants={columnItem}>
                {flagship.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </motion.div>
              <motion.div className="flagship-meta" variants={columnItem}>
                <span className="project-scope work">work · client (NDA)</span>
                <span className="flagship-note">no live link &mdash; clinical client work</span>
              </motion.div>
            </div>

            <motion.div className="flagship-visual" variants={columnItem} aria-hidden="true">
              <div className="fv-window">
                <i />
                <i />
                <i />
                <em>screening_tables.tsx</em>
              </div>
              <motion.div className="fv-table" variants={tableContainer}>
                <motion.div className="fv-row fv-head" variants={tableItem}>
                  <span>patient</span>
                  <span>result</span>
                  <span>status</span>
                </motion.div>
                {screeningRows.map((r) => (
                  <motion.div className="fv-row" key={r.patient} variants={tableItem}>
                    <span className="fv-cell">{r.patient}</span>
                    <span className="fv-cell">{r.result}</span>
                    <span className="fv-cell fv-status">
                      <i className={r.tone} />
                      {r.code}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
              <span className="fv-scan" />
            </motion.div>
          </motion.div>

          <motion.div className="projects-grid">
            <AnimatePresence mode="popLayout">
              {gridProjects.map((p, i) => (
                <TiltCard
                  key={p.name}
                  className="project-card project-card-page"
                  layout
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.05 }}
                  whileHover={{ y: -8, transition: { type: 'spring', stiffness: 350, damping: 24 } }}
                >
                  <div className="project-card-header">
                    <div className="project-icon">{<p.icon size={18} />}</div>
                    <div className="project-badges">
                      <span className={`project-type ${p.type}`}>{p.typeLabel}</span>
                      <span className={`project-scope ${p.scope}`}>{scopeLabel(p)}</span>
                    </div>
                  </div>
                  <div className="project-name">{p.name}</div>
                  <div className="project-desc">{p.desc}</div>
                  {p.status && (
                    <div className="project-status">
                      <i /> {p.status}
                    </div>
                  )}
                  {p.links && (
                    <div className="project-links">
                      {p.links.map((l) => (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                          {l.label} <ArrowUpRight size={13} />
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="wis-section">
        <div className="container">
          <motion.div
            className="wis-head"
            variants={columnContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <motion.div variants={columnItem}>
              <p className="section-label">What I build at SELISE</p>
              <h2>Client platforms I can&rsquo;t show, but can describe.</h2>
            </motion.div>
            <motion.p className="wis-lede" variants={columnItem}>
              Across LZTBCare and the FiLiP/Adinova product line I work on healthcare and financial-advisory
              platforms under NDA &mdash; so here&rsquo;s what I build, by type.
            </motion.p>
          </motion.div>

          <motion.div
            className="wis-grid"
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            onMouseMove={handleWisSpotlight}
          >
            {seliseCapabilities.map(({ icon: Icon, title, text }) => (
              <motion.article key={title} className="wis-item" variants={gridItem}>
                <Icon size={18} strokeWidth={1.6} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="projects-hello">
        <div className="container">
          <motion.div
            variants={columnContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p className="section-label" variants={columnItem}>Say hello</motion.p>
            <motion.h2 variants={columnItem}>Like what you see? Let&rsquo;s talk.</motion.h2>
            <motion.div variants={columnItem}>
              <Magnetic>
                <button
                  type="button"
                  className="projects-cta"
                  onClick={(event) => onNavigate?.('contact', event)}
                >
                  get in touch <ArrowUpRight size={15} />
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}