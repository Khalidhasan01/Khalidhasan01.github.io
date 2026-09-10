import { useEffect, useRef, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageUrl } from '../lib/paths';
import { lockScroll, unlockScroll } from '../lib/smoothScroll';
import './Navbar.css';

export default function Navbar({ theme, onToggleTheme, page, onNavigate }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [page]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (event) => {
      if (!event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    return unlockScroll;
  }, [open]);

  const links = [
    { label: 'projects', href: pageUrl('projects') },
    { label: 'about', href: pageUrl('about') },
    { label: 'contact', href: pageUrl('contact') },
  ];

  const navigate = (destination, event) => {
    setOpen(false);
    onNavigate?.(destination, event);
  };

  const isActive = (label) =>
    (label === 'projects' && page === 'projects') ||
    (label === 'about' && page === 'about') ||
    (label === 'contact' && page === 'contact');

  const renderLinks = () =>
    links.map(({ label, href }) => (
      <li key={label}>
        <a
          href={href}
          className={isActive(label) ? 'active' : undefined}
          onClick={(event) => navigate(label, event)}
        >
          {label}
        </a>
      </li>
    ));

  return (
    <>
      <header
        ref={navRef}
        className={`navbar-shell ${open ? 'is-open' : ''}`}
      >
      <nav aria-label="Primary">
        <motion.div
          className="navbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
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
              <span className="domain">.github.io</span>
            </a>

            <ul className="navbar-links">{renderLinks()}</ul>

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
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-navigation"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </motion.div>

        <ul id="mobile-navigation" className={`navbar-menu ${open ? 'open' : ''}`} hidden={!open}>
          {renderLinks()}
        </ul>
      </nav>

      {open && <div className="navbar-scrim" aria-hidden="true" onClick={() => setOpen(false)} />}
      </header>
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
}
