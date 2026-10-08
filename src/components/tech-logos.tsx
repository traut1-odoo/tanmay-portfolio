"use client";

// ═══ INLINE SVG LOGO ICONS ═══

function OdooIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="20" />
      <circle cx="15" cy="50" r="12" />
      <circle cx="85" cy="50" r="12" />
    </svg>
  );
}

function ShopifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104zm-1.332-17.61c0-.136-.015-.251-.029-.362l-1.544.477s.345-2.139-.496-2.139c-.451 0-.844.549-1.074 1.162-.34-.177-.695-.362-1.074-.549.225-1.392.84-2.529 1.544-2.529.174 0 .33.059.465.162.84-.174 1.139.9 1.139.9s.689-.24 1.065-.24c.944 0 1.096 1.186.99 1.904-.239 1.53-.869 3.225-.869 3.225l1.883-.579v-.432zm-3.24 1.886c-.539-.24-1.11-.51-1.724-.801.345-1.351 1.021-2.849 2.174-2.849.105 0 .21.015.314.044-.314.57-.645 1.425-.764 3.606zm2.384-.735c-.24.074-.51.164-.795.254-.135-1.29-.465-2.174-.99-2.625.66.105 1.275.99 1.785 2.371zM12.332 4.8c.194 0 .381.015.561.044C11.348 5.414 9.897 8.1 9.523 11.549l-2.174-.674S8.249 4.8 12.332 4.8z"/>
    </svg>
  );
}

function StripeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
    </svg>
  );
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.709 15.955l4.466-2.578-4.466-2.578V8.22l6.776 3.91v2.578L4.709 18.62v-2.665zm14.582 0v2.665l-6.776-3.912v-2.578l6.776-3.91v2.578L14.825 13.377l4.466 2.578z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18.5c-4.694 0-8.5-3.806-8.5-8.5S7.306 3.5 12 3.5s8.5 3.806 8.5 8.5-3.806 8.5-8.5 8.5z"/>
    </svg>
  );
}

function ShipStationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 21H4a1 1 0 0 1-1-1V8a1 1 0 0 1 .553-.894l8-4a1 1 0 0 1 .894 0l8 4A1 1 0 0 1 21 8v12a1 1 0 0 1-1 1zM5 19h14V8.618l-7-3.5-7 3.5V19z"/>
      <path d="M12 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>
  );
}

function AvalaraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 19h20L12 2zm0 4l6.93 12H5.07L12 6z"/>
      <circle cx="12" cy="15" r="1.5"/>
    </svg>
  );
}

// Real brand colors per tech (applied on hover; rest = monochrome)
const technologies = [
  { name: "Odoo", icon: OdooIcon, color: "#714B67" },
  { name: "Shopify", icon: ShopifyIcon, color: "#95BF47" },
  { name: "Stripe", icon: StripeIcon, color: "#635BFF" },
  { name: "ShipStation", icon: ShipStationIcon, color: "#00BCEB" },
  { name: "Claude AI", icon: ClaudeIcon, color: "#CC785C" },
  { name: "Avalara", icon: AvalaraIcon, color: "#FF6B00" },
];

export function TechLogos() {
  const items = [...technologies, ...technologies, ...technologies];

  return (
    <div className="relative overflow-hidden py-10">
      <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="marquee flex items-center gap-16 whitespace-nowrap">
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="tech-logo flex flex-col items-center gap-2 flex-shrink-0 group transition-all duration-300"
            style={{ "--brand": tech.color } as React.CSSProperties}
          >
            <span style={{ color: tech.color, display: "inline-flex" }} className="transition-transform duration-300 group-hover:scale-125">
              <tech.icon className="h-8 w-8" />
            </span>
            <span className="font-mono text-[9px] text-text-secondary/60 uppercase tracking-[0.15em] group-hover:text-text-secondary transition-colors duration-300">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
