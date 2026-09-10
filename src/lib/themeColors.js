/*
 * Reads the live theme palette out of CSS custom properties so the shader
 * never carries its own copy of the brand colours. Change index.css and the
 * backdrop follows.
 */

const cache = new Map();

/** "#2563eb" or "37, 99, 235" → [0..1, 0..1, 0..1] */
function parseColor(raw) {
  const value = raw.trim();

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    const int = parseInt(full, 16);
    return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
  }

  const parts = value.split(',').map((n) => parseFloat(n));
  if (parts.length >= 3 && parts.every((n) => !Number.isNaN(n))) {
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
  }

  return [0, 0, 0];
}

export function readThemeColor(varName, fallback = '#2563eb') {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
  const key = `${varName}:${raw}`;
  if (!cache.has(key)) cache.set(key, parseColor(raw || fallback));
  return cache.get(key);
}

/** The three colours the backdrop mixes between, for the current theme. */
export function readBackdropPalette() {
  return {
    a: readThemeColor('--color-accent'),
    b: readThemeColor('--color-accent-link'),
    c: readThemeColor('--color-stat-value'),
  };
}
