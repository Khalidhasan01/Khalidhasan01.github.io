/* ==========================================================================
   Backdrop shader.

   A slow, domain-warped fbm aurora in the brand palette, with a soft warmth
   that follows the cursor. Deliberately low-contrast: it sits behind the
   dotted grid and all the page content, so it reads as atmosphere rather
   than as a graphic.
   ========================================================================== */

export const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragment = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uIntensity;

  varying vec2 vUv;

  // Ashima simplex noise (webgl-noise, MIT).
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Three octaves, not four: broad soft forms read as atmosphere, where the
  // extra detail octave reads as smoke.
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amplitude * snoise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(vUv.x * aspect, vUv.y) * 1.05;
    float t = uTime * 0.045;

    // Domain warp: noise offset by noise, which is what turns bland fbm into
    // something that looks like it's flowing rather than just scrolling.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.2, 1.7) - t * 0.8));
    float n = fbm(p + q * 0.9 + t * 0.35) * 0.5 + 0.5;

    vec2 mouse = vec2(uMouse.x * aspect, uMouse.y) * 1.05;
    float glow = exp(-distance(p, mouse) * 2.6) * uMouseStrength;

    vec3 col = mix(uColorA, uColorB, smoothstep(0.25, 0.75, n));
    col = mix(col, uColorC, smoothstep(0.6, 1.0, n) * 0.6);
    col = mix(col, uColorB, glow * 0.5);

    /*
     * Inverse vignette. The original design kept its gradient orbs in the
     * corners and left the middle clean for body copy; a centre-weighted
     * cloud fights every paragraph on the page. Ambient noise is pushed to
     * the edges, and only the cursor glow is allowed into the middle.
     */
    vec2 d = abs(vUv - 0.5) * 2.0;
    float edge = smoothstep(0.3, 1.05, max(d.x, d.y) * 0.75 + length(d) * 0.4);

    float ambient = smoothstep(0.4, 1.0, n) * edge;
    float alpha = (ambient * 0.9 + glow * 0.55) * uIntensity;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;
