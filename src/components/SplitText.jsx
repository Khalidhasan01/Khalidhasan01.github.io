import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ease, stagger } from '../lib/motion';
import './SplitText.css';

/*
 * Character-level headline reveal.
 *
 * Each character sits inside an overflow-hidden mask and slides up from
 * behind it — no opacity fade, which is what separates a mask reveal from a
 * plain stagger. Words never break across lines because the mask wraps the
 * character but the word wraps the masks.
 *
 * Accepts the same `words` shape the hand-rolled headlines already used:
 *   ['I', 'build', { text: 'scale.', accent: true }]
 * plus `attached: true` for punctuation that should hug the previous word.
 */

const charVariants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.7, ease: ease.out } },
};

const wordClass = (w) =>
  typeof w === 'object' ? (w.dim ? 'dim' : w.accent ? 'accent' : undefined) : undefined;

const wordText = (w) => (typeof w === 'object' ? w.text : w);

/*
 * Word gaps are real space characters in their own element, not margin.
 * Margin looks identical but leaves the DOM text as "I'mKhalidHasan." — which
 * is what gets copied, indexed, and read by anything that walks text nodes.
 * `.split-space` carries the space and sets the gap width in CSS.
 */
const needsSpace = (words, i) =>
  i > 0 && !(typeof words[i] === 'object' && words[i].attached);

export default function SplitText({
  words,
  as: Tag = 'h1',
  className,
  delay = 0,
  perChar = 0.02,
  whileInView = false,
  viewport = { once: true, amount: 0.5 },
  ...rest
}) {
  const reduce = useReducedMotion();
  const label = words
    .map((w, i) => (typeof w === 'object' && w.attached ? '' : i === 0 ? '' : ' ') + wordText(w))
    .join('');

  if (reduce) {
    return (
      <Tag className={className} {...rest}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {needsSpace(words, i) && ' '}
            <span className={wordClass(w)}>{wordText(w)}</span>
          </Fragment>
        ))}
      </Tag>
    );
  }

  const MotionTag = motion[Tag] ?? motion.div;
  const activation = whileInView
    ? { whileInView: 'show', viewport }
    : { animate: 'show' };

  return (
    <MotionTag
      className={className}
      variants={stagger(perChar, delay)}
      initial="hidden"
      aria-label={label}
      {...activation}
      {...rest}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          {needsSpace(words, i) && <span className="split-space"> </span>}
          <span className={`split-word ${wordClass(w) ?? ''}`} aria-hidden="true">
            {[...wordText(w)].map((char, j) => (
              <span key={j} className="split-mask">
                <motion.span className="split-char" variants={charVariants}>
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </MotionTag>
  );
}
