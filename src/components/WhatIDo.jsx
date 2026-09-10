import { motion } from 'framer-motion';
import { Monitor, Server, Smartphone, ArrowRight } from 'lucide-react';
import { pageUrl } from '../lib/paths';
import {
  distance,
  fadeIn,
  fadeUp,
  spring,
  staggerLoose,
  viewportOnce,
} from '../lib/motion';
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

const gridContainer = staggerLoose();
const gridItem = fadeUp(0, distance.lg);
const label = fadeUp();
const link = fadeIn(0.3);

export default function WhatIDo({ onNavigate }) {
  return (
    <section className="whatido-section">
      <div className="container">
        <div className="whatido-header">
          <motion.p
            className="section-label"
            variants={label}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            what i do
          </motion.p>
          <motion.a
            href={pageUrl('about')}
            className="whatido-link"
            onClick={(event) => onNavigate?.('about', event)}
            variants={link}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            more about me <ArrowRight size={12} />
          </motion.a>
        </div>

        <motion.div
          className="whatido-grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="whatido-card"
              variants={gridItem}
              whileHover={{ y: -6, transition: spring.lift }}
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
