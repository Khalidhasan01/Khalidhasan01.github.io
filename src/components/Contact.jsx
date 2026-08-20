import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Mail, Copy, Check, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import TiltCard from './TiltCard';
import Magnetic from './Magnetic';
import './Contact.css';

const EMAIL = 'khalid.hasan@selisegroup.com';
const GITHUB_URL = 'https://github.com/Khalidhasan01';
const LINKEDIN_URL = 'https://linkedin.com/in/khalidhasan';
const SITE_URL = 'https://khalidhasan01.github.io/';

const backRows = [
  { icon: <Mail size={15} />, label: 'Email', value: EMAIL },
  { icon: <GithubIcon size={15} />, label: 'GitHub', value: 'Khalidhasan01' },
  { icon: <LinkedinIcon size={15} />, label: 'LinkedIn', value: 'in/khalidhasan' },
];

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, amount: 0.2 };

export default function Contact() {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (flipped) {
        setFlipped(false);
        await new Promise((r) => setTimeout(r, reduce ? 0 : 700));
      }
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'khalid-dev-card.png';
      link.href = dataUrl;
      link.click();
    } catch {
      /* export failed — ignore */
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <motion.div
            className="contact-intro"
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <p className="section-label">&gt;_ Contact</p>
            <h1>
              Let&rsquo;s talk<span className="accent">.</span>
            </h1>
            <p className="contact-lede">
              Move your cursor over the card to tilt it &mdash; click or tap to
              flip for how to reach me.
            </p>
          </motion.div>

          <motion.div
            className="contact-card-wrap"
            variants={reveal}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <div className="contact-stage">
              <TiltCard
                className="contact-tilt"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <button
                  ref={cardRef}
                  type="button"
                  className="contact-card"
                  onClick={() => setFlipped((f) => !f)}
                  aria-pressed={flipped}
                  aria-label="Flip business card to reveal contact details"
                >
                  <motion.div
                    className="contact-card-inner"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.6, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="contact-face contact-front">
                      <div className="contact-front-top">
                        <span className="contact-brand">
                          <i className="dot" />
                          <span>khalid</span>
                          <span className="domain">.github.io</span>
                        </span>
                        <span className="contact-qr">
                          <QRCodeSVG value={SITE_URL} size={64} fgColor="#111827" bgColor="#ffffff" />
                        </span>
                      </div>
                      <div className="contact-front-bottom">
                        <strong>Khalid Hasan</strong>
                        <span>Software Engineer</span>
                        <span className="muted">SELISE Digital Platforms &middot; Dhaka, BD</span>
                      </div>
                    </div>

                    <div className="contact-face contact-back">
                      <span className="contact-back-title">how to reach me</span>
                      {backRows.map(({ icon, label, value }) => (
                        <div className="contact-row" key={label}>
                          {icon}
                          <span className="contact-row-label">{label}</span>
                          <span className="contact-row-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </button>
              </TiltCard>
            </div>
            <p className="contact-caption">move to tilt &middot; click to flip</p>
          </motion.div>

          <motion.div
            className="contact-open-to"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p>
              Open to full-stack engineering opportunities &mdash;
              Kotlin/Spring Boot, React, or where the two meet.
            </p>
          </motion.div>

          <motion.div
            className="contact-actions"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Magnetic>
              <a className="contact-btn primary" href={`mailto:${EMAIL}`}>
                <Mail size={14} /> email me
              </a>
            </Magnetic>
            <Magnetic>
              <a className="contact-btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <GithubIcon size={14} /> github
              </a>
            </Magnetic>
            <Magnetic>
              <a className="contact-btn" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                <LinkedinIcon size={14} /> linkedin
              </a>
            </Magnetic>
            <button
              type="button"
              className="contact-btn"
              onClick={handleCopy}
              aria-live="polite"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'copied!' : 'copy email'}
            </button>
            <button
              type="button"
              className="contact-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={14} />
              {downloading ? 'generating…' : 'download card'}
            </button>
          </motion.div>

          <p className="contact-footer-note">
            scan the card&rsquo;s QR to open this site &middot; or download it as
            an image above
          </p>
        </div>
      </section>
    </main>
  );
}