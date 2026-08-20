import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import WhatIDo from './components/WhatIDo';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import Blobs from './components/Blobs';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'light'
  );

  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Stats />
      <WhatIDo />
      <Projects />
      <TechStack />
      <Footer />
    </div>
  );
}

export default App;
