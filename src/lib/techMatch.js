const ALIASES = {
  'tailwind css': 'tailwind',
  'couchbase lite': 'couchbase',
  'apollo graphql': 'graphql',
  'azure ad / entra id': 'azure ad',
  'html/css': 'htmlcss',
  'c#': 'csharp',
};

export function normalizeTech(name) {
  let s = String(name).toLowerCase().trim();
  if (ALIASES[s]) return ALIASES[s];

  s = s.split(' / ')[0].trim();
  s = s.replace(/\s*\d+(?:[–-]\d+)?(?:\.\d+)*\s*$/g, '');
  s = s.replace(/\s+/g, ' ').trim();

  return ALIASES[s] || s;
}

export function matchProjects(techName, projects) {
  if (!techName) return [];
  const key = normalizeTech(techName);
  return projects
    .map((p, i) => (p.tags.some((t) => normalizeTech(t) === key) ? i : -1))
    .filter((i) => i !== -1);
}