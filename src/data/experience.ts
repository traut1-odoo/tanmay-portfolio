export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  type: "manufacturing" | "erp";
}

export const experiences: Experience[] = [
  {
    title: "ERP Systems Engineer II",
    company: "Heckler Design Inc",
    location: "Phoenix, AZ",
    period: "Apr 2024 - Present",
    description: "Sole owner of Odoo ERP across 8+ departments, managing system architecture for 500+ active SKUs.",
    highlights: [
      "Lead enterprise-wide ERP strategy and governance across Manufacturing, Procurement, Sales, Finance, Quality, Inventory, CRM, and Shipping",
      "Connected manufacturing costs to Odoo Accounting, with traceability from production to the financial statements",
      "Defined the reporting requirements and delivered dashboards for cycle time, yield and backlog",
      "Led the rollout of an MCP connector so teams can query manufacturing data in Odoo through Claude",
      "Manage cross-platform integrations: Shopify, ShipStation, Stripe, Slack, Avalara",
      "Designed C-SKU cut parts program: 35+ components with multi-level BOMs and machine routings"
    ],
    type: "erp"
  },
  {
    title: "ERP Systems Engineer",
    company: "Heckler Design Inc",
    location: "Phoenix, AZ",
    period: "Oct 2023 - Mar 2024",
    description: "Led Odoo ERP upgrade and launched core financial and manufacturing modules.",
    highlights: [
      "Led the Odoo 16 to 17 upgrade, including testing, UAT, department training and support after launch",
      "Launched MRP module with automated reordering and procurement automation",
      "Implemented Odoo Accounting as the company's financial system from scratch",
      "Designed work order automation in Odoo Studio and tested it with the teams using it"
    ],
    type: "erp"
  },
  {
    title: "Manufacturing Engineer",
    company: "United Foods",
    location: "Phoenix, AZ",
    period: "Jul 2023 - Oct 2023",
    description: "Led continuous improvement projects targeting labor efficiency and line balancing.",
    highlights: [
      "Improved hourly output through time studies and standardized work instructions",
      "Optimized preventive maintenance scheduling to reduce equipment downtime",
      "Implemented line balancing for production efficiency"
    ],
    type: "manufacturing"
  },
  {
    title: "Production Supervisor — Industrial Fabrication",
    company: "Vats and Vessels Ltd",
    location: "Mumbai, India",
    period: "Jan 2020 - Dec 2022",
    description: "Managed pressure vessel fabrication for 30+ personnel under ASME Section VIII and ISO 9001.",
    highlights: [
      "Managed welding, machining, and inspection for pressure vessel fabrication",
      "Applied Lean tools (5S, Kaizen), improving first-pass yield and efficiency",
      "Developed BOMs, routing sheets, and operator logs",
      "Zero reportable safety incidents across 12+ months"
    ],
    type: "manufacturing"
  }
];
