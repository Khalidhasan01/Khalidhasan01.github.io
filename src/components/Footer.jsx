import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import Magnetic from './Magnetic';
import { distance, fadeUp, viewportOnce } from '../lib/motion';
import './Footer.css';

const inner = fadeUp(0, distance.lg);

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <motion.div
          className="footer-inner"
          variants={inner}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <h2 className="footer-heading">
            Let's build something{' '}
            <span className="dim">together.</span>
          </h2>

          <div className="footer-links">
            <Magnetic>
              <a
                href="https://github.com/Khalidhasan01"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                <GithubIcon size={15} /> GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://linkedin.com/in/khalidhasan"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                <LinkedinIcon size={15} /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a href="mailto:khalid.hasan@selisegroup.com" className="footer-link">
                <Mail size={15} /> Email
              </a>
            </Magnetic>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} · Built with{' '}
            <span>React</span> & <span>Framer Motion</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
