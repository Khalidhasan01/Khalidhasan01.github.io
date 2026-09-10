import { useEffect, useRef, useState } from 'react';
import { frame, cancelFrame } from 'framer-motion';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { fragment, vertex } from '../lib/backdropShader';
import { readBackdropPalette } from '../lib/themeColors';
import { getScrollVelocity } from '../lib/smoothScroll';
import Blobs from './Blobs';
import './ShaderBackdrop.css';

/*
 * WebGL atmosphere behind the whole site.
 *
 * Replaces the two blurred CSS divs with a live, cursor-reactive gradient.
 * OGL rather than Three.js: this is one fullscreen triangle running one
 * fragment shader, and Three would cost ~15x the bytes to do it.
 *
 * If the context can't be created — old hardware, blocklisted driver,
 * WebGL disabled — this falls back to the original CSS blobs rather than
 * leaving a blank layer.
 */

/** Retina at full DPR is the usual cause of shader jank; 2 is plenty here. */
const MAX_DPR = 2;
/** How fast the cursor position and theme colours chase their targets, per 60Hz frame. */
const FOLLOW_DECAY = 0.92;
const THEME_DECAY = 0.9;

/** Frame-rate independent approach: identical feel at 60Hz and 120Hz. */
const damp = (current, target, decay, dt) => {
  const factor = Math.pow(decay, dt * 60);
  return target + (current - target) * factor;
};

export default function ShaderBackdrop() {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    /*
     * Everything from context creation through shader compilation can fail on
     * hardware we'll never see — blocklisted drivers, WebGL switched off, a
     * precision qualifier some GPU rejects. One try/catch over the whole
     * setup, and any of it failing drops us back to the CSS blobs.
     */
    let renderer;
    let gl;
    let program;
    let mesh;
    let palette;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR),
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      });
      gl = renderer?.gl;
      if (!gl) throw new Error('no WebGL context');

      gl.clearColor(0, 0, 0, 0);
      container.appendChild(gl.canvas);

      palette = readBackdropPalette();
      program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uMouse: { value: [0.5, 0.5] },
          uMouseStrength: { value: 0 },
          uColorA: { value: [...palette.a] },
          uColorB: { value: [...palette.b] },
          uColorC: { value: [...palette.c] },
          uIntensity: { value: 0 },
          uVelocity: { value: 0 },
        },
      });
      /*
       * OGL reports shader compile and link failures with console.warn and
       * then returns — it never throws. Without this check a driver that
       * rejects the shader leaves a live canvas drawing nothing, and the
       * fallback below never runs. Ask the GL context directly instead.
       */
      if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
        throw new Error('backdrop shader failed to link');
      }

      mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    } catch {
      gl?.canvas?.remove();
      setFailed(true);
      return undefined;
    }

    const u = program.uniforms;

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      u.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Cursor ── */
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, strength: 0, tStrength: 0 };
    const onPointerMove = (event) => {
      pointer.tx = event.clientX / window.innerWidth;
      // Flip Y: clip space counts up, the page counts down.
      pointer.ty = 1 - event.clientY / window.innerHeight;
      pointer.tStrength = 1;
    };
    const onPointerLeave = () => {
      pointer.tStrength = 0;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    /*
     * Theme changes animate rather than snap, so the shader crossfades
     * alongside the View Transitions circular reveal instead of popping to
     * the new palette a frame ahead of it.
     */
    const target = { ...palette };
    const themeObserver = new MutationObserver(() => {
      const next = readBackdropPalette();
      target.a = next.a;
      target.b = next.b;
      target.c = next.c;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    /* ── Loop ── */
    let elapsed = 0;
    let velocity = 0;
    let running = true;

    const update = ({ delta }) => {
      if (!running) return;
      // Clamp: a backgrounded tab hands back a huge delta on resume, which
      // would jump the animation forward by seconds.
      const dt = Math.min(delta, 50) / 1000;
      elapsed += dt;

      pointer.x = damp(pointer.x, pointer.tx, FOLLOW_DECAY, dt);
      pointer.y = damp(pointer.y, pointer.ty, FOLLOW_DECAY, dt);
      pointer.strength = damp(pointer.strength, pointer.tStrength, FOLLOW_DECAY, dt);

      for (const key of ['a', 'b', 'c']) {
        const uniform = u[`uColor${key.toUpperCase()}`].value;
        for (let i = 0; i < 3; i++) {
          uniform[i] = damp(uniform[i], target[key][i], THEME_DECAY, dt);
        }
      }

      // Damped so a flick of the wheel swells the backdrop and settles,
      // rather than strobing with every velocity sample.
      velocity = damp(velocity, getScrollVelocity(), 0.86, dt);

      u.uTime.value = elapsed;
      u.uVelocity.value = velocity;
      u.uMouse.value = [pointer.x, pointer.y];
      u.uMouseStrength.value = pointer.strength;
      // Fade in over the first second so the backdrop arrives rather than blinks on.
      u.uIntensity.value = Math.min(elapsed / 1, 1);

      renderer.render({ scene: mesh });
    };

    frame.update(update, true);

    // Don't burn battery rendering to a tab nobody is looking at.
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelFrame(update);
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  if (failed) return <Blobs />;

  return <div className="shader-backdrop" ref={containerRef} aria-hidden="true" />;
}
