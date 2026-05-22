/**
 * Curated identity prose extracted from src/app/about/page.tsx.
 *
 * Manual single-source-of-truth duplication is intentional — parsing JSX for
 * prose is overkill. Update this file whenever the about page identity copy
 * changes materially, then re-run `npm run build:context`.
 */

export const ABOUT_HERO = `Tanmay Raut is an ERP systems engineer based in Phoenix, Arizona. Since 2020 he has been designing how manufacturing businesses operate through their systems — from the factory floor to the financial statements. Outside of work he plays soccer, travels, and reads philosophy and markets.`;

export interface IdentityCard {
  title: string;
  body: string;
}

/**
 * "Things about me" interactive story cards from the about page.
 * Mirror order/wording exactly so the bot answers track the live page.
 */
export const IDENTITY_CARDS: IdentityCard[] = [
  {
    title: "Factory Floor Origins",
    body: "Managed 30+ welders and machinists before ever touching an ERP. Production-floor experience precedes ERP architecture.",
  },
  {
    title: "Systems Thinker",
    body: "Everything is a workflow. Tanmay thinks in processes, not tasks.",
  },
  {
    title: "Soccer",
    body: "Weekend warrior on the pitch. Plays in a weekend league.",
  },
  {
    title: "AI × Domain Knowledge",
    body: "AI is his dev team. He brings the manufacturing judgment no model has.",
  },
  {
    title: "The Books Stop Here",
    body: "Heckler's accountants escalate to Tanmay when things don't balance — he owns the books-to-floor traceability.",
  },
  {
    title: "30 Places & Counting",
    body: "Travelled to 30+ locations including Monument Valley, Hawaii, the Northern Lights, Iceland, UK, France, Singapore, and Turkey.",
  },
  {
    title: "Market Watcher",
    body: "Follows patterns, builds financial literacy, studies the game.",
  },
  {
    title: "Philosophy & Mental Models",
    body: "Interested in how to think about thinking — systems within systems.",
  },
  {
    title: "The Vision",
    body: "Build systems so good that businesses run themselves.",
  },
  {
    title: "Mumbai → Phoenix",
    body: "Crossed continents for a Master's degree at Arizona State University. Stayed for the opportunity.",
  },
];

export const EDUCATION = [
  {
    degree: "M.S. Information Technology",
    school: "Arizona State University",
    location: "Phoenix, AZ",
  },
  {
    degree: "B.E. Mechanical Engineering",
    school: "University of Mumbai",
    location: "Mumbai, India",
  },
];

export const CERTIFICATIONS = [
  "Lean Six Sigma Green Belt",
  "SAP S/4HANA Essentials",
  "Supply Chain Operations (Rutgers)",
  "Tableau Visualization",
  "Materials Selection (MIT)",
  "Root Cause Analysis",
];

export const CONTACT = {
  email: "tanmay.rautwork@gmail.com",
  linkedin: "linkedin.com/in/rauttanmay",
  github: "github.com/tanmayrautheckler",
  location: "Phoenix, Arizona",
};
