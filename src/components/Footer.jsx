import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <motion.div
          className="footer-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="footer-heading">
            Let's build something{' '}
            <span className="dim">together.</span>
          </h2>

          <div className="footer-links">
            <a
              href="https://github.com/khalidhasan"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              <GithubIcon size={15} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/khalidhasan"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              <LinkedinIcon size={15} /> LinkedIn
            </a>
            <a href="mailto:khalid@example.com" className="footer-link">
              <Mail size={15} /> Email
            </a>
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
