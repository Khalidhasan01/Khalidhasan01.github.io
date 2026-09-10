import { lazy, Suspense, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import WhatIDo from './components/WhatIDo';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import Blobs from './components/Blobs';
import SmoothScroll from './components/SmoothScroll';
import PageTransition, { PageSweep } from './components/PageTransition';
import { pageFromPath, pageUrl, hashUrl, PAGES } from './lib/paths';
import { pageLoaders } from './lib/pageLoaders';
import { scrollToId, scrollToTop } from './lib/smoothScroll';
import './App.css';

/*
 * Sub-pages load on demand. Contact alone drags in html-to-image and
 * qrcode.react, which every visitor used to download whether or not they
 * ever opened it. Links warm their chunk on hover (see pageLoaders), so by
 * the time a click lands the chunk is usually already there.
 */
const ProjectsPage = lazy(pageLoaders.projects);
const About = lazy(pageLoaders.about);
const Contact = lazy(pageLoaders.contact);

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
    if (next) scrollToId('projects');
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

  /**
   * `destination` is either a page name or a home-section id.
   * Pages swap the view and start at the top; sections scroll, routing back
   * to home first if we're not already there.
   */
  const handleNavigate = (destination, event) => {
    event?.preventDefault();

    if (PAGES.includes(destination)) {
      if (page !== destination) {
        window.history.pushState({}, '', pageUrl(destination));
        setPage(destination);
        // Scroll reset happens in AnimatePresence's onExitComplete, once the
        // outgoing page is gone — resetting here would yank it mid-exit.
        return;
      }
      scrollToTop();
      return;
    }

    window.history.pushState({}, '', hashUrl(destination));

    if (page !== 'home') {
      setPage('home');
      // Wait for the home sections to mount before looking for the target.
      requestAnimationFrame(() => scrollToId(destination, { immediate: true }));
      return;
    }

    scrollToId(destination);
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

      /*
       * A ViewTransition exposes three promises, and an aborted transition
       * rejects all of them — hitting the toggle again mid-reveal is enough.
       * Every one needs a handler or it surfaces as an unhandled rejection,
       * so silence them all and clean up regardless of how it ended.
       */
      transition.ready.catch(() => {});
      transition.updateCallbackDone?.catch(() => {});
      transition.finished
        .catch(() => {})
        .finally(() => {
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
      <SmoothScroll />
      <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} />
      <PageSweep key={`sweep-${page}`} />
      <Blobs />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        page={page}
        onNavigate={handleNavigate}
      />
      <AnimatePresence mode="wait" onExitComplete={() => scrollToTop()}>
        <PageTransition key={page}>
          <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
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
                <Projects
                  activeTech={activeTech}
                  onSelectTech={handleSelectTech}
                  onNavigate={handleNavigate}
                />
                <TechStack />
              </>
            )}
          </Suspense>
        </PageTransition>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
