import Image from "next/image";

// Official artwork and provenance are recorded in public/brands/README.md.
const technologies = [
  { name: "Odoo", use: "ERP operations", href: "https://www.odoo.com", asset: "odoo", width: 98, height: 31, variants: true },
  { name: "Shopify", use: "Commerce", href: "https://www.shopify.com", asset: "shopify", width: 126, height: 36, variants: true },
  { name: "Stripe", use: "Payments & tax", href: "https://stripe.com", asset: "stripe", width: 76, height: 32, variants: true },
  { name: "ShipStation", use: "Shipping", href: "https://www.shipstation.com", asset: "shipstation", width: 138, height: 22, intrinsicWidth: 104, intrinsicHeight: 16, monochromeDark: true },
  { name: "Claude", use: "AI workflows", href: "https://claude.com", asset: "claude", width: 116, height: 26, intrinsicWidth: 573, intrinsicHeight: 125, monochromeDark: true },
  { name: "Avalara", use: "Sales tax", href: "https://www.avalara.com", asset: "avalara", width: 122, height: 27 },
];

export function TechLogos() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 xl:grid-cols-6" aria-label="Technologies and integrations">
      {technologies.map((tech) => (
        <li key={tech.name}>
          <a
            href={tech.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tech.name}: ${tech.use} (opens in a new tab)`}
            className="flex min-h-28 flex-col items-center justify-center gap-4 rounded-xl px-3 py-5 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <span className="flex h-10 w-full items-center justify-center" aria-hidden="true">
              {tech.variants ? (
                <>
                  <Image src={`/brands/${tech.asset}-light.svg`} alt="" width={tech.width} height={tech.height} className="brand-logo-light max-w-full object-contain" unoptimized />
                  <Image src={`/brands/${tech.asset}-dark.svg`} alt="" width={tech.width} height={tech.height} className="brand-logo-dark max-w-full object-contain" unoptimized />
                </>
              ) : (
                <Image src={`/brands/${tech.asset}.svg`} alt="" width={tech.intrinsicWidth ?? tech.width} height={tech.intrinsicHeight ?? tech.height} style={{ width: tech.width, height: "auto" }} className={`max-w-full object-contain${tech.monochromeDark ? " brand-logo-adaptive" : ""}`} unoptimized />
              )}
            </span>
            <span className="text-xs font-medium text-text-secondary">{tech.use}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
