import { motion } from 'framer-motion';
import {
  Code2,
  LayoutTemplate,
  Server,
  Database,
  TerminalSquare,
  Plug,
} from 'lucide-react';
import {
  fadeUp,
  popIn,
  slideX,
  spring,
  stagger,
  staggerTight,
  viewportEarly,
  viewportOnce,
} from '../lib/motion';
import { useSpotlight } from '../lib/useSpotlight';
import './TechStack.css';

const categories = [
  {
    id: 'languages',
    label: 'languages',
    icon: <Code2 size={13} />,
    items: ['TypeScript', 'JavaScript', 'C# 12', 'Kotlin', 'HTML/CSS', 'SCSS'],
  },
  {
    id: 'frontend',
    label: 'frontend',
    icon: <LayoutTemplate size={13} />,
    items: [
      'Angular 13–21',
      'React 19',
      'NgRx',
      'TanStack',
      'Jotai',
      'RxJS',
      'NativeScript',
      'Angular Material',
      'MUI Joy',
      'Tailwind CSS',
    ],
  },
  {
    id: 'backend',
    label: 'backend',
    icon: <Server size={13} />,
    items: [
      '.NET 8 / ASP.NET Core',
      'Spring Boot 3',
      'jOOQ',
      'Hangfire',
      'FluentValidation',
      'CQRS',
    ],
  },
  {
    id: 'databases',
    label: 'databases & messaging',
    icon: <Database size={13} />,
    items: ['MongoDB', 'PostgreSQL', 'CouchBase Lite', 'RabbitMQ', 'SignalR'],
  },
  {
    id: 'devops',
    label: 'devops & tools',
    icon: <TerminalSquare size={13} />,
    items: [
      'Docker',
      'GitHub Actions',
      'Azure Pipelines',
      'Nx',
      'Vite',
      'SonarQube',
      'Swagger',
      'Orval',
    ],
  },
  {
    id: 'integrations',
    label: 'integrations',
    icon: <Plug size={13} />,
    items: [
      'Google Calendar API',
      'Azure AD / Entra ID',
      'Firebase',
      'Apollo GraphQL',
      'OAuth 2.0',
    ],
  },
];

const container = stagger(0.05);
const categoryItem = staggerTight();
const labelItem = slideX();
const pillContainer = stagger(0.025);
const pillItem = popIn();
const sectionLabel = fadeUp();

export default function TechStack() {
  const handlePillMove = useSpotlight();

  return (
    <section className="tech-section" id="tech-stack">
      <div className="container">
        <motion.p
          className="section-label"
          variants={sectionLabel}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          tech stack
        </motion.p>

        <motion.div
          className="tech-categories"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={viewportEarly}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              className="tech-category"
              data-cat={cat.id}
              variants={categoryItem}
            >
              <motion.div className="tech-category-label" variants={labelItem}>
                <span className="tech-category-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </motion.div>

              <motion.div className="tech-pills" variants={pillContainer}>
                {cat.items.map((item) => (
                  <motion.span
                    key={item}
                    className="tech-pill"
                    variants={pillItem}
                    whileHover={{
                      y: -2,
                      scale: 1.05,
                      transition: spring.pill,
                    }}
                    onMouseMove={handlePillMove}
                  >
                    <span className="tech-pill-dot" />
                    <span className="tech-pill-text">{item}</span>
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}