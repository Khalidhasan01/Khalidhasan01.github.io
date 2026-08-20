export const GITHUB_USERNAME = 'Khalidhasan01';
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}`;
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const PROFILE_CACHE_KEY = 'gh-profile-v2';
const CONTRIB_CACHE_KEY = 'gh-contributions-v2';

const LEVEL_CLASS = ['', 'l1', 'l2', 'l3', 'l4'];

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore quota / private-mode errors
  }
}

export function levelToClass(level) {
  return LEVEL_CLASS[level] ?? '';
}

/** Slice to the last N weeks (7 days each) for the compact grid. */
export function sliceWeeks(days, weeks = 26) {
  const count = weeks * 7;
  return days.length > count ? days.slice(-count) : days;
}

export async function fetchGitHubProfile() {
  const cached = readCache(PROFILE_CACHE_KEY);
  if (cached) return cached;

  const res = await fetch(GITHUB_API);
  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`);

  const data = await res.json();
  const profile = {
    login: data.login,
    followers: data.followers,
    publicRepos: data.public_repos,
    sinceYear: new Date(data.created_at).getFullYear(),
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
  };

  writeCache(PROFILE_CACHE_KEY, profile);
  return profile;
}

export async function fetchContributions() {
  const cached = readCache(CONTRIB_CACHE_KEY);
  if (cached) return cached;

  const res = await fetch(CONTRIB_API);
  if (!res.ok) throw new Error(`Contributions fetch failed: ${res.status}`);

  const data = await res.json();
  const contributions = {
    total: data.total?.lastYear ?? 0,
    days: (data.contributions ?? []).map(({ date, count, level }) => ({
      date,
      count,
      level,
      className: levelToClass(level),
    })),
  };

  writeCache(CONTRIB_CACHE_KEY, contributions);
  return contributions;
}
