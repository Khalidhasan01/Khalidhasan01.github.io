import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Code2,
  MapPin,
  Sparkles,
  Wrench,
} from 'lucide-react';
import SplitText from './SplitText';
import {
  distance,
  fadeUp,
  popIn,
  slideX,
  stagger,
  staggerLoose,
  viewportOnce,
} from '../lib/motion';
import { useSpotlight } from '../lib/useSpotlight';
import './About.css';

const timeline = [
  { period: '2024 — present', title: 'Software Engineer', place: 'SELISE Digital Platforms · Dhaka' },
  { period: '2023 — 2024', title: 'Associate Software Engineer', place: 'SELISE Digital Platforms' },
  { period: '2023 · Feb — Aug', title: 'Intern', place: 'SELISE Digital Platforms' },
  { period: '2018 — 2022', title: 'B.Sc. Computer Science & Engineering', place: 'American International University-Bangladesh' },
];

const tools = [
  ['Languages', 4, 'Kotlin, TypeScript, JavaScript, Java'],
  ['Frontend', 5, 'React, Angular, TanStack Router/Query, NgRx, Redux, Tailwind CSS'],
  ['UI libraries', 3, 'Angular Material, Joy UI'],
  ['Backend', 4, 'Spring Boot, JPA/Hibernate, jOOQ, Liquibase, Gradle'],
  ['Databases & auth', 3, 'PostgreSQL, Neon, Azure AD / JWT'],
  ['DevOps & tools', 3, 'Docker, Vercel, Render, Git, Cursor, Obsidian, Ollama'],
];

const principles = [
  {
    icon: Code2,
    title: 'Learn in the real codebase',
    text: 'I picked up React in a live production app. Real constraints make lessons stick.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Own it end to end',
    text: 'On personal projects, the backend, database, and deployment are part of the work—not hand-offs.',
  },
  {
    icon: Wrench,
    title: 'Trace it, don’t route around it',
    text: 'When something breaks, I prefer finding the underlying cause over adding a temporary patch.',
  },
  {
    icon: Sparkles,
    title: 'Keep knowledge useful',
    text: 'I keep working notes and setups in Obsidian so learning does not disappear after the task ends.',
  },
];

const summary = [
  'I’m a Software Engineer at SELISE Digital Platforms, working from Dhaka across Kotlin/Spring Boot backends and React/TypeScript frontends. Most recently, I’ve worked on LZTBCare, a clinical case-management system for TB patients—building lab-result screening tables, contact tracing, and medication-management logic.',
  'I’ve also built CRM modules in Angular with NgRx signals and Angular Material, then moved into React mid-project—learning hooks, TanStack Router, and component composition inside a live production codebase.',
  'Outside work, I’m building FitMonitor solo: frontend, Kotlin/Spring Boot backend, auth, data model, and deployment decisions. I also explore .NET Core and run local AI tools to understand what is useful beyond an API call.',
];

const highlights = [
  'Full-stack ownership across LZTBCare—from Kotlin/Spring Boot backend to React frontend features.',
  'Solo end-to-end build of FitMonitor: architecture, backend, database, and deployment planning.',
  'Transitioned from Angular to React mid-project and became productive in a live codebase.',
];

const headlineWords = ["I'm", { text: 'Khalid', accent: true }, 'Hasan.'];

/* ── Variants — composed from the shared motion system ── */
const intro = fadeUp(0.08);
const columnContainer = stagger(0.1);
const columnItem = fadeUp();
const timelineContainer = stagger(0.09);
const timelineItem = slideX(-distance.md);
const directionContainer = staggerLoose();
const directionItem = fadeUp();
const tagContainer = stagger(0.05);
const tagItem = popIn();
const toolItem = fadeUp(0, distance.sm);
const principleItem = fadeUp();
const highlightsItem = slideX(distance.md);

export default function About() {
  const handleSpotlight = useSpotlight('.about-principles article');

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="about-intro"
            variants={intro}
            initial="hidden"
            animate="show"
          >
            <p className="section-label">&gt;_ About</p>
            <SplitText as="h1" words={headlineWords} delay={0.1} />
            <p className="about-lede">
              A full-stack software engineer who likes understanding the system beneath the interface.
            </p>
          </motion.div>

          <motion.div
            className="about-summary"
            variants={columnContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <div className="about-summary-copy">
              {summary.map((p, i) => (
                <motion.p key={i} variants={columnItem}>
                  {p}
                </motion.p>
              ))}
            </div>
            <motion.aside className="about-location" variants={columnItem}>
              <span className="about-status"><i /> available for interesting work</span>
              <div><MapPin size={15} /> Dhaka, Bangladesh</div>
              <div><Code2 size={15} /> Full-stack engineering</div>
            </motion.aside>
          </motion.div>
        </div>
      </section>

      <section className="about-section about-path">
        <motion.div
          className="container about-two-column"
          variants={columnContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div variants={columnItem}>
            <p className="section-label">Path here</p>
            <h2>A practical path through product engineering.</h2>
          </motion.div>
          <motion.ol className="about-timeline" variants={timelineContainer}>
            {timeline.map((item) => (
              <motion.li key={`${item.period}-${item.title}`} variants={timelineItem}>
                <span>{item.period}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.place}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </section>

      <section className="about-section">
        <motion.div
          className="container about-two-column"
          variants={columnContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div variants={columnItem}>
            <p className="section-label">Where I’m headed</p>
            <h2>More ownership of the system, not only the feature.</h2>
          </motion.div>
          <motion.div className="about-direction" variants={directionContainer}>
            <motion.p variants={directionItem}>
              Building FitMonitor solo has made backend architecture decisions feel just as important as the UI. I’m drawn to the seam between frontend and backend, where product ideas become dependable systems.
            </motion.p>
            <motion.p variants={directionItem}>
              I’m also spending time with local AI tooling out of curiosity: running models on my own hardware and separating what is genuinely useful from what is merely new.
            </motion.p>
            <motion.div className="about-tags" variants={tagContainer}>
              {['Kotlin', 'Spring Boot', 'React', 'System Design', 'AI Tooling'].map((tag) => (
                <motion.span key={tag} variants={tagItem}>{tag}</motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="about-section about-work-with">
        <motion.div
          className="container"
          variants={columnContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.p className="section-label" variants={columnItem}>What I work with</motion.p>
          <motion.div className="about-tools" variants={timelineContainer}>
            {tools.map(([category, depth, items]) => (
              <motion.div className="about-tool" key={category} variants={toolItem}>
                <div className="about-tool-topline">
                  <strong>{category}</strong>
                  <span aria-label={`${depth} out of 5 depth`}>
                    {[1, 2, 3, 4, 5].map((point) => <i key={point} className={point <= depth ? 'filled' : ''} />)}
                  </span>
                </div>
                <p>{items}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="about-section">
        <motion.div
          className="container"
          variants={columnContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.p className="section-label" variants={columnItem}>How I work</motion.p>
          <motion.div
            className="about-principles"
            variants={timelineContainer}
            onMouseMove={handleSpotlight}
          >
            {principles.map(({ icon: Icon, title, text }) => (
              <motion.article key={title} variants={principleItem}>
                <Icon size={18} strokeWidth={1.6} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="about-section about-highlights">
        <motion.div
          className="container about-two-column"
          variants={columnContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div variants={columnItem}>
            <p className="section-label">Ownership highlights</p>
            <h2>Work I’m glad to put my name behind.</h2>
          </motion.div>
          <motion.ul variants={timelineContainer}>
            {highlights.map((h, i) => (
              <motion.li key={i} variants={highlightsItem}>{h}</motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>
    </main>
  );
}