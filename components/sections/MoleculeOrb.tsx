"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Living, wave-driven 3D particle ellipsoid in Canvas 2D.
 *
 * ~14 500 particles (shell + 5 ring orbits + interior fog).
 *
 * Motion model — VECTOR wave field (no global heartbeat):
 *
 *   Each of 5 waves displaces particles along a SPECIFIC tangent direction
 *   instead of all pulling radially. Per-particle local frame:
 *     - radial  (out from center)
 *     - east    (along +longitude, perpendicular to north pole)
 *     - north   (along +latitude)
 *
 *   W1 east  — slow flow varying with latitude       (slides E↔W in bands)
 *   W2 north — slow flow varying with longitude      (slides N↔S in slices)
 *   W3 east  — fast diagonal east flow               (rapid swirl)
 *   W4 north — counter-direction slow north flow     (cross-current)
 *   W5 radial — high-spatial-freq local bulges       (NOT global pulse)
 *
 *   Only ONE wave (W5) is radial, and at HIGH spatial frequency so
 *   neighboring regions are out of phase — local bulges, not heartbeat.
 *
 *   Per-particle tangent drift (decoupled from waves) adds incoherent
 *   shimmer along each particle's own random unit direction.
 *
 *   Net feel: a flowing, swirling cloud where regions move in different
 *   directions while particles individually shimmer — no synchronized pulse.
 *
 * Tempo accelerated ~5× from the first version. Rotation kept slow.
 */

const SHELL_COUNT = 8000;
const RING_COUNT = 800;
const RING_NUMBER = 5;
const FOG_COUNT = 2500;

const ELLIPSOID_X = 1.0;
const ELLIPSOID_Y = 0.92;
const ELLIPSOID_Z = 1.0;

// Per-particle tangent drift (decoupled — no wave coupling)
const DRIFT_AMP_MIN = 0.05;
const DRIFT_AMP_MAX = 0.13;
const DRIFT_SPEED_MIN = 0.8;
const DRIFT_SPEED_MAX = 3.0;

// (dirIndex, latFreq, lonFreq, rFreq, speed, amp)
// dirIndex: 0=east, 1=north, 2=radial
const WAVE_DIR: number[] = [0, 1, 0, 1, 2];
const WAVE_LAT_F = [3.0, 0.0, 5.0, 6.0, 4.0];
const WAVE_LON_F = [0.0, 4.0, 6.0, -4.0, 5.0];
const WAVE_R_F = [0.0, 0.0, 0.0, 0.0, 0.0];
const WAVE_SPD = [1.4, 1.1, 2.0, -0.9, 1.7];
const WAVE_AMP = [0.13, 0.11, 0.09, 0.08, 0.08];

// Buffer layout per particle (20 floats)
//  0..2   home unit position (x, y, z)
//  3..5   drift direction (random unit vector)
//  6      base alpha
//  7      base size
//  8      drift amplitude
//  9      drift speed
//  10     drift phase
//  11     lat (precomputed)
//  12     lon (precomputed)
//  13     r   (precomputed)
//  14..16 east tangent (precomputed)
//  17..19 north tangent (precomputed)
const STRIDE = 20;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randUnitVec(rng: () => number): [number, number, number] {
  const u = 1 - 2 * rng();
  const t = 2 * Math.PI * rng();
  const sr = Math.sqrt(1 - u * u);
  return [sr * Math.cos(t), u, sr * Math.sin(t)];
}

function generate(): Float32Array {
  const total = SHELL_COUNT + RING_NUMBER * RING_COUNT + FOG_COUNT;
  const buf = new Float32Array(total * STRIDE);
  const rng = mulberry32(424242);

  let idx = 0;
  const push = (
    x: number,
    y: number,
    z: number,
    alpha: number,
    size: number,
  ) => {
    const o = idx * STRIDE;
    buf[o + 0] = x;
    buf[o + 1] = y;
    buf[o + 2] = z;
    const [drx, dry, drz] = randUnitVec(rng);
    buf[o + 3] = drx;
    buf[o + 4] = dry;
    buf[o + 5] = drz;
    buf[o + 6] = alpha;
    buf[o + 7] = size;
    buf[o + 8] = DRIFT_AMP_MIN + rng() * (DRIFT_AMP_MAX - DRIFT_AMP_MIN);
    buf[o + 9] =
      DRIFT_SPEED_MIN + rng() * (DRIFT_SPEED_MAX - DRIFT_SPEED_MIN);
    buf[o + 10] = rng() * Math.PI * 2;
    const r = Math.hypot(x, y, z) || 1e-9;
    const lat = Math.asin(Math.max(-1, Math.min(1, y / r)));
    const lon = Math.atan2(z, x);
    buf[o + 11] = lat;
    buf[o + 12] = lon;
    buf[o + 13] = r;
    // East tangent (perpendicular to radial + Y-up)
    buf[o + 14] = -Math.sin(lon);
    buf[o + 15] = 0;
    buf[o + 16] = Math.cos(lon);
    // North tangent (perpendicular to east, in the meridian plane)
    buf[o + 17] = -Math.sin(lat) * Math.cos(lon);
    buf[o + 18] = Math.cos(lat);
    buf[o + 19] = -Math.sin(lat) * Math.sin(lon);
    idx++;
  };

  // 1) Outer shell — Fibonacci sphere
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < SHELL_COUNT; i++) {
    const y = 1 - (i / (SHELL_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const radJitter = 1 + (rng() - 0.5) * 0.06;
    push(
      x * radJitter,
      y * radJitter,
      z * radJitter,
      0.5 + rng() * 0.45,
      0.55 + rng() * 0.65,
    );
  }

  // 2) Ring orbits
  for (let r = 0; r < RING_NUMBER; r++) {
    const ax = rng() - 0.5;
    const ay = rng() - 0.5;
    const az = rng() - 0.5;
    const len = Math.hypot(ax, ay, az) || 1;
    const u: [number, number, number] = [ax / len, ay / len, az / len];
    const helper: [number, number, number] =
      Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const e1 = normalize(cross(u, helper));
    const e2 = normalize(cross(u, e1));

    const ringRadius = 0.95 + rng() * 0.08;
    const ringWidth = 0.025 + rng() * 0.022;

    for (let i = 0; i < RING_COUNT; i++) {
      const a = (i / RING_COUNT) * Math.PI * 2 + rng() * 0.018;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const wobble = (rng() - 0.5) * ringWidth;
      const px = (e1[0] * c + e2[0] * s) * (ringRadius + wobble);
      const py = (e1[1] * c + e2[1] * s) * (ringRadius + wobble);
      const pz = (e1[2] * c + e2[2] * s) * (ringRadius + wobble);
      push(px, py, pz, 0.55 + rng() * 0.4, 0.55 + rng() * 0.55);
    }
  }

  // 3) Interior fog
  for (let i = 0; i < FOG_COUNT; i++) {
    const r = Math.cbrt(rng()) * 0.92;
    const u = 1 - 2 * rng();
    const t = 2 * Math.PI * rng();
    const sr = Math.sqrt(1 - u * u);
    push(
      r * sr * Math.cos(t),
      r * u,
      r * sr * Math.sin(t),
      0.16 + rng() * 0.28,
      0.45 + rng() * 0.4,
    );
  }

  return buf;
}

function cross(a: number[], b: number[]): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function normalize(v: number[]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

export function MoleculeOrb() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let widthCss = 0;
    let heightCss = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      widthCss = rect.width;
      heightCss = rect.height;
      canvas.width = Math.round(widthCss * dpr);
      canvas.height = Math.round(heightCss * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const buf = generate();
    const n = buf.length / STRIDE;

    const proj = new Float32Array(n * 5);
    const indices: number[] = new Array(n);
    for (let i = 0; i < n; i++) indices[i] = i;

    const readColorBase = () => {
      const fg =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-fg")
          .trim() || "#26251e";
      const rgb = hexToRgb(fg);
      return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    };
    let colorBase = readColorBase();

    // Re-lê a cor quando o tema muda (data-theme attribute)
    const themeObserver = new MutationObserver(() => {
      colorBase = readColorBase();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);

    let raf = 0;
    let waveT = 0;
    let rotT = 0;

    const draw = (wT: number, rT: number) => {
      const w = widthCss;
      const h = heightCss;
      const cx = w / 2;
      const cy = h / 2;
      // Generous headroom: directional waves push particles in many ways
      const radius = Math.min(w, h) * 0.32;

      const cy_ = Math.cos(rT);
      const sy_ = Math.sin(rT);
      const wob = Math.sin(rT * 0.32) * 0.18;
      const cx_ = Math.cos(wob);
      const sx_ = Math.sin(wob);

      const wt0 = wT * WAVE_SPD[0];
      const wt1 = wT * WAVE_SPD[1];
      const wt2 = wT * WAVE_SPD[2];
      const wt3 = wT * WAVE_SPD[3];
      const wt4 = wT * WAVE_SPD[4];

      for (let i = 0; i < n; i++) {
        const o = i * STRIDE;
        const ux = buf[o + 0];
        const uy = buf[o + 1];
        const uz = buf[o + 2];
        const drX = buf[o + 3];
        const drY = buf[o + 4];
        const drZ = buf[o + 5];
        const dAmp = buf[o + 8];
        const dSpd = buf[o + 9];
        const ph = buf[o + 10];
        const lat = buf[o + 11];
        const lon = buf[o + 12];
        const r = buf[o + 13];
        const eX = buf[o + 14];
        const eY = buf[o + 15];
        const eZ = buf[o + 16];
        const nX = buf[o + 17];
        const nY = buf[o + 18];
        const nZ = buf[o + 19];

        // Compute wave values
        const w0 =
          Math.sin(lat * WAVE_LAT_F[0] + lon * WAVE_LON_F[0] + r * WAVE_R_F[0] + wt0) *
          WAVE_AMP[0];
        const w1 =
          Math.sin(lat * WAVE_LAT_F[1] + lon * WAVE_LON_F[1] + r * WAVE_R_F[1] + wt1) *
          WAVE_AMP[1];
        const w2 =
          Math.sin(lat * WAVE_LAT_F[2] + lon * WAVE_LON_F[2] + r * WAVE_R_F[2] + wt2) *
          WAVE_AMP[2];
        const w3 =
          Math.sin(lat * WAVE_LAT_F[3] + lon * WAVE_LON_F[3] + r * WAVE_R_F[3] + wt3) *
          WAVE_AMP[3];
        const w4 =
          Math.sin(lat * WAVE_LAT_F[4] + lon * WAVE_LON_F[4] + r * WAVE_R_F[4] + wt4) *
          WAVE_AMP[4];

        // Sum by direction
        // dir indices: 0=east 1=north 2=radial
        const eastSum =
          (WAVE_DIR[0] === 0 ? w0 : 0) +
          (WAVE_DIR[1] === 0 ? w1 : 0) +
          (WAVE_DIR[2] === 0 ? w2 : 0) +
          (WAVE_DIR[3] === 0 ? w3 : 0) +
          (WAVE_DIR[4] === 0 ? w4 : 0);
        const northSum =
          (WAVE_DIR[0] === 1 ? w0 : 0) +
          (WAVE_DIR[1] === 1 ? w1 : 0) +
          (WAVE_DIR[2] === 1 ? w2 : 0) +
          (WAVE_DIR[3] === 1 ? w3 : 0) +
          (WAVE_DIR[4] === 1 ? w4 : 0);
        const radialSum =
          (WAVE_DIR[0] === 2 ? w0 : 0) +
          (WAVE_DIR[1] === 2 ? w1 : 0) +
          (WAVE_DIR[2] === 2 ? w2 : 0) +
          (WAVE_DIR[3] === 2 ? w3 : 0) +
          (WAVE_DIR[4] === 2 ? w4 : 0);

        // Per-particle tangent drift — decoupled, no wave-amp coupling
        const tan = Math.sin(wT * dSpd + ph) * dAmp;
        const ddx = drX * tan;
        const ddy = drY * tan;
        const ddz = drZ * tan;

        // Combine: scale radially, add east + north tangent flows + drift
        const scaleR = 1 + radialSum;
        const lx =
          (ux * scaleR + eX * eastSum + nX * northSum + ddx) * ELLIPSOID_X;
        const ly =
          (uy * scaleR + eY * eastSum + nY * northSum + ddy) * ELLIPSOID_Y;
        const lz =
          (uz * scaleR + eZ * eastSum + nZ * northSum + ddz) * ELLIPSOID_Z;

        // Rotate around Y
        const x1 = lx * cy_ - lz * sy_;
        const z1 = lx * sy_ + lz * cy_;
        const y1 = ly;
        // Wobble around X
        const y2 = y1 * cx_ - z1 * sx_;
        const z2 = y1 * sx_ + z1 * cx_;
        // Perspective
        const persp = 1 / (1.55 - z2 * 0.32);

        const off = i * 5;
        proj[off] = cx + x1 * radius * persp;
        proj[off + 1] = cy + y2 * radius * persp;
        proj[off + 2] = z2;
        proj[off + 3] = buf[o + 6];
        proj[off + 4] = buf[o + 7] * persp;
      }

      indices.sort((a, b) => proj[a * 5 + 2] - proj[b * 5 + 2]);

      ctx.clearRect(0, 0, w, h);

      for (let k = 0; k < indices.length; k++) {
        const i = indices[k];
        const off = i * 5;
        const sx = proj[off];
        const sy = proj[off + 1];
        const depth = proj[off + 2];
        const alpha = proj[off + 3];
        const size = proj[off + 4];

        const lum = 0.28 + (depth + 1.2) * 0.32;
        const finalAlpha = alpha * lum;
        if (finalAlpha < 0.02) continue;

        ctx.fillStyle = `rgba(${colorBase}, ${finalAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size < 0.4 ? 0.4 : size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (visible) {
        // 5× faster than v1, but rotation stays slow
        waveT += 0.018;
        rotT += 0.005;
        draw(waveT, rotT);
      }
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      draw(0.6, 0.6);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
    };
  }, [reduce]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
      <canvas
        ref={ref}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(v, 16);
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
  };
}
