import { motion } from 'framer-motion';
import {
  Code2,
  LayoutTemplate,
  Server,
  Database,
  TerminalSquare,
  Plug,
} from 'lucide-react';
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const categoryItem = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const labelItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const pillContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025 } },
};

const pillItem = {
  hidden: { opacity: 0, y: 10, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function TechStack() {
  const handlePillMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section className="tech-section" id="tech-stack">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          tech stack
        </motion.p>

        <motion.div
          className="tech-categories"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
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
                      transition: { type: 'spring', stiffness: 400, damping: 25 },
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