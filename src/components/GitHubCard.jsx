import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import Counter from './Counter';
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

// Generate a stable grid once — content doesn't change between renders.
function makeCells() {
  const arr = [];
  for (let i = 0; i < 182; i++) {
    const r = Math.random();
    let level = '';
    if (r > 0.82) level = 'l4';
    else if (r > 0.65) level = 'l3';
    else if (r > 0.45) level = 'l2';
    else if (r > 0.3) level = 'l1';
    arr.push(level);
  }
  return arr;
}

const cells = makeCells();

export default function GitHubCard() {

  return (
    <div className="gh-card">
      {/* Header */}
      <div className="gh-header">
        <div className="gh-user">
          <GithubIcon size={16} />
          <span>@Khalidhasan01</span>
          <span className="since">· since 2022</span>
        </div>
        <a
          href="https://github.com/Khalidhasan01"
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
          <Counter className="gh-stat-value" value={500} suffix="+" />
          <span className="gh-stat-label">contributions</span>
        </div>
        <div className="gh-stat">
          <Counter className="gh-stat-value" value={20} suffix="+" />
          <span className="gh-stat-label">repositories</span>
        </div>
        <div className="gh-stat">
          <Counter className="gh-stat-value" value={10} />
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

      <div className="gh-grid">
        {cells.map((level, i) => (
          <motion.div
            key={i}
            className={`gh-cell ${level}`}
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
