import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, ChevronRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import GitHubCard from './GitHubCard';
import Magnetic from './Magnetic';
import SplitText from './SplitText';
import profileImg from '../assets/profile.jpeg';
import './Hero.css';

const headlineWords = [
  'I',
  'build',
  'systems',
  { text: 'and', dim: true },
  { text: 'interfaces', dim: true },
  { text: 'that', dim: true },
  { text: 'scale.', accent: true },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -50]);
  const fade = useTransform(scrollY, [0, 500], [1, 0.6]);

  return (
    <section className="hero" id="about">
      <div className="container">
        <div className="hero-inner">
          {/* ── Left Column ── */}
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="hero-identity">
              <img className="hero-avatar" src={profileImg} alt="Khalid Hasan" />
              <div className="hero-meta">
                <span className="hero-name">Khalid Hasan</span>
                <span className="hero-role">
                  Software Engineer · SELISE Digital Platforms · Dhaka, BD
                </span>
              </div>
            </div>

            <SplitText
              as="h1"
              className="hero-headline"
              words={headlineWords}
              delay={0.45}
            />

            <p className="hero-desc">
              I engineer full-stack platforms for healthcare, fintech, and
              insurance — from Angular SPAs and React clinical tools to
              .NET/Kotlin backends. Deep in enterprise architecture, CQRS
              patterns, and shipping products that handle real complexity.
            </p>

            <div className="hero-ctas">
              <Magnetic>
                <a href="#projects" className="btn-primary">
                  <ChevronRight size={14} />
                  view projects
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className="btn-secondary">
                  get in touch
                </a>
              </Magnetic>
            </div>

            <div className="hero-socials">
              <a
                href="https://github.com/Khalidhasan01"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon size={14} /> github
              </a>
              <a
                href="https://linkedin.com/in/khalidhasan"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinIcon size={14} /> linkedin
              </a>
              <a href="mailto:khalid.hasan@selisegroup.com">
                <Mail size={14} /> email
              </a>
            </div>
          </motion.div>

          {/* ── Right Column ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ y: parallaxY, opacity: fade }}
          >
            <GitHubCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
