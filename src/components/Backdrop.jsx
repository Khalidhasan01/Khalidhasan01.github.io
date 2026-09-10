import { lazy, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';
import Blobs from './Blobs';

/*
 * Chooses the background atmosphere.
 *
 * The shader is lazily imported so OGL stays out of the initial bundle — the
 * CSS blobs render immediately as the Suspense fallback and the shader takes
 * over once it arrives, which also makes this a clean progressive
 * enhancement rather than a blank layer while a chunk downloads.
 *
 * Under reduced motion neither renders: Blobs already opts itself out, and a
 * continuously animating backdrop is exactly what that setting is asking us
 * not to do.
 */
const ShaderBackdrop = lazy(() => import('./ShaderBackdrop'));

export default function Backdrop() {
  const reduce = useReducedMotion();

  if (reduce) return <Blobs />;

  return (
    <Suspense fallback={<Blobs />}>
      <ShaderBackdrop />
    </Suspense>
  );
}
