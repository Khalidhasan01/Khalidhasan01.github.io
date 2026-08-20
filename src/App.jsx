import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import WhatIDo from './components/WhatIDo';
import Projects from './components/Projects';
import ProjectsPage from './components/ProjectsPage';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import Blobs from './components/Blobs';
import About from './components/About';
import Contact from './components/Contact';
import { pageFromPath, pageUrl, hashUrl } from './lib/paths';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'light'
  );
  const [activeTech, setActiveTech] = useState(null);
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname));

  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const handleSelectTech = (name) => {
    const next = activeTech === name ? null : name;
    setActiveTech(next);
    if (next) {
      const reduce =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById('projects')
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (destination, event) => {
    event?.preventDefault();

    if (destination === 'home') {
      if (page !== 'home') {
        window.history.pushState({}, '', pageUrl('home'));
        setPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (destination === 'projects') {
      if (page !== 'projects') {
        window.history.pushState({}, '', pageUrl('projects'));
        setPage('projects');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (destination === 'about') {
      if (page !== 'about') {
        window.history.pushState({}, '', pageUrl('about'));
        setPage('about');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (destination === 'contact') {
      if (page !== 'contact') {
        window.history.pushState({}, '', pageUrl('contact'));
        setPage('contact');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (page === 'about' || page === 'contact' || page === 'projects') {
      window.history.pushState({}, '', hashUrl(destination));
      setPage('home');
      requestAnimationFrame(() => {
        document.getElementById(destination)?.scrollIntoView({ behavior: 'auto' });
      });
      return;
    }

    window.history.pushState({}, '', hashUrl(destination));
    document.getElementById(destination)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;

    if (
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const btn = document.querySelector('.theme-toggle-btn');
      const rect = btn?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      root.style.setProperty('--reveal-x', `${x}px`);
      root.style.setProperty('--reveal-y', `${y}px`);
      root.style.setProperty('--reveal-r', `${radius}px`);

      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });

      transition.finished.finally(() => {
        root.style.removeProperty('--reveal-x');
        root.style.removeProperty('--reveal-y');
        root.style.removeProperty('--reveal-r');
      });
      return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:' +
      getComputedStyle(document.body).backgroundColor +
      ';z-index:9999;pointer-events:none;opacity:1;transition:opacity 0.25s ease !important;';
    document.body.appendChild(overlay);

    root.classList.add('theme-switching');
    setTheme(next);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
      });
    });

    setTimeout(() => {
      root.classList.remove('theme-switching');
      overlay.remove();
    }, 350);
  };

  return (
    <div className="app">
      <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} />
      <Blobs />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        page={page}
        onNavigate={handleNavigate}
      />
      {page === 'projects' ? (
        <ProjectsPage onNavigate={handleNavigate} />
      ) : page === 'about' ? (
        <About />
      ) : page === 'contact' ? (
        <Contact />
      ) : (
        <>
          <Hero />
          <Stats />
          <WhatIDo onNavigate={handleNavigate} />
          <Projects activeTech={activeTech} onSelectTech={handleSelectTech} onNavigate={handleNavigate} />
          <TechStack />
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
