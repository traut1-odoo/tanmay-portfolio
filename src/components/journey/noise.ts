/**
 * Hand-rolled 2D value noise + fractional Brownian motion.
 *
 * No external dependency. Deterministic — seeded by integer hash so the same
 * (x, y) always returns the same value. Used by the terrain mesh to displace
 * vertices into ridges and folds.
 */

// 32-bit integer hash → [0, 1)
function hash2(x: number, y: number): number {
  let h = (x * 374761393) ^ (y * 668265263);
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return ((h >>> 0) % 100000) / 100000;
}

// Smoothstep (Ken Perlin's quintic)
function smooth(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** 2D value noise, returns [0, 1] */
export function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const n00 = hash2(xi, yi);
  const n10 = hash2(xi + 1, yi);
  const n01 = hash2(xi, yi + 1);
  const n11 = hash2(xi + 1, yi + 1);

  const u = smooth(xf);
  const v = smooth(yf);

  const nx0 = n00 * (1 - u) + n10 * u;
  const nx1 = n01 * (1 - u) + n11 * u;
  return nx0 * (1 - v) + nx1 * v;
}

/**
 * Fractional Brownian Motion — stack multiple octaves of value noise for
 * mountain-like detail. Returns roughly [0, 1].
 */
export function fbm(x: number, y: number, octaves = 5, lacunarity = 2, gain = 0.5): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

/**
 * Ridge noise — `1 - |fbm * 2 - 1|`, then squared. Produces sharp mountain
 * ridges instead of soft rolling hills.
 */
export function ridge(x: number, y: number, octaves = 5): number {
  const f = fbm(x, y, octaves);
  const r = 1 - Math.abs(f * 2 - 1);
  return r * r;
}
