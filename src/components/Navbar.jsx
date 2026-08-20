import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageUrl, hashUrl } from '../lib/paths';
import './Navbar.css';

export default function Navbar({ theme, onToggleTheme, page, onNavigate }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'projects', href: hashUrl('projects') },
    { label: 'about', href: pageUrl('about') },
    { label: 'contact', href: pageUrl('contact') },
  ];

  const navigate = (destination, event) => {
    setOpen(false);
    onNavigate?.(destination, event);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-inner">
        <a
          className="navbar-logo"
          href={pageUrl('home')}
          onClick={(event) => navigate('home', event)}
          aria-label="Khalid Hasan home"
        >
          <span className="dot" />
          <span>khalid</span>
          <span className="domain">.dev</span>
        </a>

        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {links.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={
                  page === 'about' && label === 'about'
                    ? 'active'
                    : page === 'contact' && label === 'contact'
                      ? 'active'
                      : undefined
                }
                onClick={(event) => navigate(label, event)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
