interface TestimonialPerson {
  id: string;
  name: string;
  relationship: string;
  context: string;
}

export interface TestimonialDraft extends TestimonialPerson {
  status: "draft";
  suggestedQuote: string;
}

export interface ApprovedTestimonial extends TestimonialPerson {
  status: "approved";
  quote: string;
  /** Record the person's explicit approval of this exact wording before publishing. */
  approval: {
    confirmedOn: string;
  };
}

export type Testimonial = TestimonialDraft | ApprovedTestimonial;

// These are writing proposals, not statements supplied by the named people.
// Examples are illustrative, not recollections of real events.
// The development-only preview is the only consumer of this file.
export const testimonialDrafts: readonly TestimonialDraft[] = [
  {
    id: "rogelio-garcia",
    name: "Rogelio Garcia",
    relationship: "Accounting Manager",
    context: "Heckler Design",
    status: "draft",
    suggestedQuote:
      "Tanmay pays attention to what happens after a button is clicked. A tax exemption, for example, has to make sense on the order, the invoice and the refund. That connection between systems and accounting matters.",
  },
  {
    id: "sangam-kakade",
    name: "Sangam Kakade",
    relationship: "Former senior colleague",
    context: "United Foods",
    status: "draft",
    suggestedQuote:
      "Tanmay thinks about the person picking up the next step. If a batch is on hold, the reason, owner and release decision should be clear. That practical attention is what makes a process useful.",
  },
  {
    id: "nayan-jangid",
    name: "Nayan Jangid",
    relationship: "Friend",
    context: "Manipal",
    status: "draft",
    suggestedQuote:
      "Tanmay turns curiosity into side projects. A question about the markets can become a research tool, and learning a new skill can become an excuse to build something. That mix of learning and making feels very much like him.",
  },
  {
    id: "aditya-deshmukh",
    name: "Aditya Deshmukh",
    relationship: "University colleague",
    context: "Arizona State University",
    status: "draft",
    suggestedQuote:
      "Tanmay wants to understand why an answer works. If a machine becomes unavailable, a production plan needs another look. He brings that habit of questioning assumptions and working through tradeoffs to how he approaches engineering problems.",
  },
];

// A production testimonial section must consume approved records, never drafts.
// No approvals have been received or inferred from the request to draft wording.
export const approvedTestimonials: readonly ApprovedTestimonial[] = [];
