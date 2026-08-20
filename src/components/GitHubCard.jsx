import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import Counter from './Counter';
import {
  fetchContributions,
  fetchGitHubProfile,
  GITHUB_URL,
  sliceWeeks,
} from '../lib/github';
import './GitHubCard.css';

const BADGE_COLORS = [
  'var(--badge-ag)',
  'var(--badge-ts)',
  'var(--badge-cs)',
  'var(--badge-kt)',
  'var(--badge-rx)',
  'var(--badge-ns)',
];
const BADGE_LABELS = ['AG', 'TS', 'C#', 'KT', 'RX', 'NS'];

const GRAPH_LEVELS = [
  'var(--graph-empty)',
  'var(--graph-level-1)',
  'var(--graph-level-2)',
  'var(--graph-level-3)',
  'var(--graph-level-4)',
];

const STAT_FLOORS = {
  repos: { floor: 20, showcase: 20, suffix: '+' },
  followers: { floor: 10, showcase: 10, suffix: '' },
};

const FALLBACK_SINCE = 2022;

function makeFallbackCells() {
  const arr = [];
  for (let i = 0; i < 182; i++) {
    const r = Math.random();
    let level = '';
    if (r > 0.82) level = 'l4';
    else if (r > 0.65) level = 'l3';
    else if (r > 0.45) level = 'l2';
    else if (r > 0.3) level = 'l1';
    arr.push({ date: '', count: 0, className: level });
  }
  return arr;
}

function displayStat(liveValue, { floor, showcase, suffix }) {
  if (liveValue >= floor) return { value: liveValue, suffix };
  return { value: showcase, suffix };
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export default function GitHubCard() {
  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isNarrow = useMediaQuery('(max-width: 500px)');
  const weeks = isNarrow ? 18 : 26;

  const fallbackCells = useMemo(() => makeFallbackCells(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const [profileData, contribData] = await Promise.all([
          fetchGitHubProfile(),
          fetchContributions(),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          setContributions(contribData);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sinceYear = profile?.sinceYear ?? FALLBACK_SINCE;

  const contribStat = {
    value: contributions?.total ?? 0,
    suffix: '',
  };
  const repoStat = displayStat(
    profile?.publicRepos ?? 0,
    STAT_FLOORS.repos,
  );
  const followerStat = displayStat(
    profile?.followers ?? 0,
    STAT_FLOORS.followers,
  );

  const gridCells = useMemo(() => {
    if (error || !contributions?.days?.length) return fallbackCells;
    return sliceWeeks(contributions.days, weeks);
  }, [contributions, error, fallbackCells, weeks]);

  return (
    <div className="gh-card">
      {/* Header */}
      <div className="gh-header">
        <div className="gh-user">
          <GithubIcon size={16} />
          <span>@Khalidhasan01</span>
          <span className="since">· since {sinceYear}</span>
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="gh-follow"
        >
          follow <ArrowRight size={12} />
        </a>
      </div>

      {/* Stats */}
      <div className="gh-stats">
        <div className="gh-stat">
          <Counter
            className="gh-stat-value"
            value={contribStat.value}
            suffix={contribStat.suffix}
          />
          <span className="gh-stat-label">contributions</span>
        </div>
        <div className="gh-stat">
          <Counter
            className="gh-stat-value"
            value={repoStat.value}
            suffix={repoStat.suffix}
          />
          <span className="gh-stat-label">repositories</span>
        </div>
        <div className="gh-stat">
          <Counter
            className="gh-stat-value"
            value={followerStat.value}
            suffix={followerStat.suffix}
          />
          <span className="gh-stat-label">followers</span>
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="gh-contrib-header">
        <span className="gh-contrib-label">last year</span>
        <div className="gh-contrib-legend">
          <span>less</span>
          {GRAPH_LEVELS.map((bg, i) => (
            <div key={i} className="gh-legend-cell" style={{ background: bg }} />
          ))}
          <span>more</span>
        </div>
      </div>

      <div
        className={`gh-grid${loading ? ' gh-grid--loading' : ''}`}
        style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
      >
        {gridCells.map((day, i) => (
          <motion.div
            key={day.date || `fallback-${i}`}
            className={`gh-cell ${day.className}${loading ? ' gh-cell--loading' : ''}`}
            title={
              day.date
                ? `${day.date} · ${day.count} contribution${day.count === 1 ? '' : 's'}`
                : undefined
            }
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.004, duration: 0.3 }}
          />
        ))}
      </div>

      {/* Badges */}
      <div className="gh-badges-row">
        <span className="gh-badges-label">badges</span>
        {BADGE_LABELS.map((label, i) => (
          <div
            key={i}
            className="gh-badge"
            style={{ background: BADGE_COLORS[i] }}
            title={label}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
