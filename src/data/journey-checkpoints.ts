/**
 * Career checkpoints along the Journey to the Summit scroll-parallax.
 *
 * Sourced from Tanmay's LinkedIn export (May 2026). 6 milestone stops
 * chronologically up the mountain — peak left blank for "future".
 *
 * Each checkpoint has:
 *   - t: 0..1 path-progress (where the card appears along the climb)
 *   - season: which seasonal layer is most visible when this checkpoint
 *     pops in (drives the year/season HUD)
 *   - card data: title, org, period, note
 */

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface Checkpoint {
  id: string;
  /** Path progress 0..1 — where the card anchors */
  t: number;
  /** Headline season for this checkpoint */
  season: Season;
  /** Year label shown in HUD when this checkpoint is active */
  year: number;
  /** Card heading (icon + short label) */
  label: string;
  /** Role / degree */
  title: string;
  /** Org / school */
  org: string;
  /** Period string */
  period: string;
  /** One-line note */
  note: string;
  /** Accent color (hex) */
  color: string;
  /** Icon emoji */
  icon: string;
  /** Mark current role */
  current?: boolean;
}

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "manipal",
    t: 0.08,
    season: "spring",
    year: 2016,
    label: "Base Camp",
    title: "B.Tech, Aeronautical Engineering",
    org: "Manipal Academy of Higher Education",
    period: "2016 – 2020",
    note: "Foundations. Mechanical & aerospace first principles.",
    color: "#f59e0b",
    icon: "🎓",
  },
  {
    id: "vats",
    t: 0.25,
    season: "spring",
    year: 2020,
    label: "Camp I",
    title: "Manufacturing Supervisor",
    org: "Vats & Vessels Pvt. Ltd., Mumbai",
    period: "Jan 2020 – Dec 2021",
    note: "30+ team. ASME VIII pressure-vessel fabrication. Six Sigma + Lean.",
    color: "#f87171",
    icon: "🏭",
  },
  {
    id: "asu",
    t: 0.42,
    season: "summer",
    year: 2022,
    label: "Camp II",
    title: "M.S. Mechanical Engineering",
    org: "Arizona State University",
    period: "Jan 2022 – Dec 2023",
    note: "Crossed continents. Phoenix arrival.",
    color: "#60a5fa",
    icon: "🎓",
  },
  {
    id: "viva",
    t: 0.58,
    season: "summer",
    year: 2022,
    label: "Camp III",
    title: "Manufacturing Process Engineer",
    org: "VIVA Railings, Dallas",
    period: "Jul 2022 – Jan 2023",
    note: "First Odoo implementation. Where the ERP path began.",
    color: "#34d399",
    icon: "⚙️",
  },
  {
    id: "united",
    t: 0.72,
    season: "autumn",
    year: 2023,
    label: "Camp IV",
    title: "Manufacturing Engineer II",
    org: "United Foods International, Phoenix",
    period: "May 2023 – Oct 2023",
    note: "20% productivity gain. CMMS rollout. 30% downtime cut.",
    color: "#fb923c",
    icon: "🌾",
  },
  {
    id: "heckler",
    t: 0.88,
    season: "winter",
    year: 2023,
    label: "Camp V — Active",
    title: "ERP Systems Engineer",
    org: "Heckler Design",
    period: "Oct 2023 – Present",
    note: "Sole Odoo owner. 8+ departments. AI × ERP.",
    color: "#38bdf8",
    icon: "🏔️",
    current: true,
  },
];

/**
 * Year ticker mapping path progress (0..1) → calendar year.
 * Linear interpolation between checkpoint years.
 */
export function progressToYear(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  // 0 → 2016 (start), 1 → 2026 (now-ish)
  return 2016 + clamped * 10;
}

/** Returns the dominant season for a given path progress (0..1). */
export function progressToSeason(p: number): Season {
  if (p < 0.25) return "spring";
  if (p < 0.55) return "summer";
  if (p < 0.8) return "autumn";
  return "winter";
}

/**
 * SVG viewBox coordinates of the climbing path.
 * Coordinates match the 1920×1080 image space.
 *
 * Hand-fitted to the generated Ghibli mountain art:
 *   - Base camp village is at lower-left (~360, 720)
 *   - Path switchbacks up to the cloud-shrouded peak near (1080, 250)
 *
 * The Bézier control points produce a switchback feel.
 */
export const PATH_D =
  "M 360 720 C 480 700, 560 660, 640 620 C 720 580, 760 600, 820 560 C 880 520, 940 540, 980 480 C 1020 420, 1080 420, 1080 250";

/**
 * Sample point along the SVG path at progress t (0..1).
 * Approximated by evaluating the cubic Béziers in PATH_D piecewise.
 *
 * Returns {x, y} in 1920×1080 image-space coordinates.
 */
export function pathPointAt(t: number): { x: number; y: number; angle: number } {
  const clamped = Math.max(0, Math.min(1, t));

  // 4 cubic Béziers, each takes 1/4 of progress
  const segments: Array<[[number, number], [number, number], [number, number], [number, number]]> = [
    [[360, 720], [480, 700], [560, 660], [640, 620]],
    [[640, 620], [720, 580], [760, 600], [820, 560]],
    [[820, 560], [880, 520], [940, 540], [980, 480]],
    [[980, 480], [1020, 420], [1080, 420], [1080, 250]],
  ];

  const segLen = 1 / segments.length;
  const segIdx = Math.min(segments.length - 1, Math.floor(clamped / segLen));
  const localT = (clamped - segIdx * segLen) / segLen;

  const [p0, p1, p2, p3] = segments[segIdx];
  const u = 1 - localT;
  const x =
    u * u * u * p0[0] +
    3 * u * u * localT * p1[0] +
    3 * u * localT * localT * p2[0] +
    localT * localT * localT * p3[0];
  const y =
    u * u * u * p0[1] +
    3 * u * u * localT * p1[1] +
    3 * u * localT * localT * p2[1] +
    localT * localT * localT * p3[1];

  // Tangent for character rotation
  const dx =
    -3 * u * u * p0[0] +
    3 * u * u * p1[0] - 6 * u * localT * p1[0] +
    6 * u * localT * p2[0] - 3 * localT * localT * p2[0] +
    3 * localT * localT * p3[0];
  const dy =
    -3 * u * u * p0[1] +
    3 * u * u * p1[1] - 6 * u * localT * p1[1] +
    6 * u * localT * p2[1] - 3 * localT * localT * p2[1] +
    3 * localT * localT * p3[1];
  const angle = Math.atan2(dy, dx);

  return { x, y, angle };
}
