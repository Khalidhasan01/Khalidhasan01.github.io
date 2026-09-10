export const BASE_URL = import.meta.env.BASE_URL;

/** Every top-level page. Drives both routing and the navigate() dispatch. */
export const PAGES = ['home', 'projects', 'about', 'contact'];

export const pageUrl = (page) => (page === 'home' ? BASE_URL : `${BASE_URL}${page}`);

export const hashUrl = (id) => `${BASE_URL}#${id}`;

export const pageFromPath = (pathname) => {
  const stripped = pathname.replace(BASE_URL, '').replace(/^\/+|\/+$/g, '');
  return PAGES.includes(stripped) ? stripped : 'home';
};
