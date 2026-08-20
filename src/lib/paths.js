export const BASE_URL = import.meta.env.BASE_URL;

export const pageUrl = (page) => {
  if (page === 'about') return `${BASE_URL}about`;
  if (page === 'contact') return `${BASE_URL}contact`;
  return BASE_URL;
};

export const hashUrl = (id) => `${BASE_URL}#${id}`;

export const pageFromPath = (pathname) => {
  const stripped = pathname.replace(BASE_URL, '').replace(/\/+$/, '') || '/';
  if (stripped === '/about') return 'about';
  if (stripped === '/contact') return 'contact';
  return 'home';
};
