import { motion } from 'framer-motion';
import { Monitor, Server, Smartphone, ArrowRight } from 'lucide-react';
import './WhatIDo.css';

const services = [
  {
    icon: <Monitor size={20} />,
    title: 'Frontend Development',
    desc: 'Building enterprise SPAs with Angular, React, NgRx, TanStack Router — PWAs, SSR, and complex data-entry interfaces.',
  },
  {
    icon: <Server size={20} />,
    title: 'Backend Development',
    desc: 'Architecting .NET 8 and Spring Boot APIs with CQRS, MongoDB, PostgreSQL, SignalR, and RabbitMQ integrations.',
  },
  {
    icon: <Smartphone size={20} />,
    title: 'Mobile Development',
    desc: 'Cross-platform apps with NativeScript + Angular — CouchBase offline, Firebase push, biometrics, and native UI.',
  },
];

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function WhatIDo() {
  return (
    <section className="whatido-section">
      <div className="container">
        <div className="whatido-header">
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            what i do
          </motion.p>
          <motion.a
            href="#about"
            className="whatido-link"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            more about me <ArrowRight size={12} />
          </motion.a>
        </div>

        <motion.div
          className="whatido-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="whatido-card"
              variants={gridItem}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 24 } }}
            >
              <div className="whatido-icon">{s.icon}</div>
              <div className="whatido-title">{s.title}</div>
              <div className="whatido-desc">{s.desc}</div>
              <a href="#projects" className="whatido-cta">
                view projects <ArrowRight size={11} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
