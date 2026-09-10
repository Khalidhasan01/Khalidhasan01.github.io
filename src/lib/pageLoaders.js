/*
 * Dynamic imports for the code-split sub-pages.
 *
 * Kept apart from the lazy() components in App so that any link pointing at a
 * page can warm its chunk on hover or focus. Dynamic imports are cached by the
 * module system, so calling these repeatedly is free after the first time.
 */
export const pageLoaders = {
  projects: () => import('../components/ProjectsPage'),
  about: () => import('../components/About'),
  contact: () => import('../components/Contact'),
};

/** Start fetching a page's chunk. Safe to call with a section id or unknown name. */
export const prefetchPage = (page) => {
  pageLoaders[page]?.();
};
