/*
 * Site content: contact details, practice areas and insights.
 * Edit here, then run `node site/build.js` to regenerate the pages.
 * Plain text fields are escaped when rendered. Articles come from Sanity (see site/sanity.js).
 */

const contact = {
  phone: "+00 (0)00 0000 0000",
  phoneHref: "tel:+000000000000",
  email: "info@trueworth.example",
  careersEmail: "careers@trueworth.example",
  address: ["Office address line 1", "City, Postcode"],
  hours: "Monday to Friday, 9:00 to 17:30",
};

/** Hero / card images. `pos` is the CSS object-position that keeps the subject in frame. */
const images = {
  photo: {
    src: "/assets/img/hero-glass-tower-1400.webp",
    srcset: "/assets/img/hero-glass-tower-900.webp 900w, /assets/img/hero-glass-tower-1400.webp 1400w, /assets/img/hero-glass-tower-2000.webp 2000w",
    w: 2000, h: 1335, pos: "50% 30%",
  },
  colonnade: { src: "/assets/img/art-colonnade.svg", w: 1800, h: 1200, pos: "62% 45%" },
  louvres: { src: "/assets/img/art-louvres.svg", w: 1800, h: 1200, pos: "20% 50%" },
  atrium: { src: "/assets/img/art-atrium.svg", w: 1800, h: 1200, pos: "50% 50%" },
  tower: { src: "/assets/img/art-tower.svg", w: 1800, h: 1200, pos: "62% 35%" },
};

const practices = [
  {
    slug: "corporate-commercial",
    name: "Corporate & Commercial",
    short: "Corporate",
    image: "photo",
    summary: "Shareholder agreements, acquisitions and disposals, joint ventures, corporate governance and the commercial contracts that run your business day to day.",
    lead: "Advice for the moments that shape a business: starting it, funding it, growing it and selling it.",
    overview: [
      "We advise founders, owners, boards and investors on the transactions and agreements that shape a business.",
      "We keep documents as simple as the deal allows, and we tell you which points matter and which do not.",
    ],
    services: [
      "Shareholder and joint venture agreements",
      "Acquisitions and disposals",
      "Group structuring and reorganisations",
      "Commercial contracts and terms of business",
      "Corporate governance and board advice",
      "Company secretarial and statutory filings",
    ],
    situations: [
      ["You are starting a company with others", "We help co-founders agree ownership, decision-making and what happens if someone leaves, before it matters."],
      ["You are raising investment", "We negotiate term sheets, prepare for due diligence and settle the investment documents."],
      ["You are buying or selling a business", "We run due diligence, negotiate the deal and take it through to completion."],
      ["You need contracts that work", "We write supplier, customer and distribution agreements around how you actually trade."],
    ],
  },
  {
    slug: "startups-technology",
    name: "Startups & Technology",
    short: "Startups & Tech",
    image: "louvres",
    summary: "Company formation, founders' agreements, fundraising, employee share options, intellectual property and technology contracts, for founders and the investors who back them.",
    lead: "Legal advice for founders, from the first idea to the next round.",
    overview: [
      "We advise founders and the investors who back them, from incorporation through every funding round.",
      "We also protect what you build: your brand, your code and the data you hold.",
    ],
    services: [
      "Company formation and founders' agreements",
      "Fundraising: SAFEs, convertible notes and equity rounds",
      "Employee share option plans",
      "Trade marks and ownership of your code and brand",
      "Technology, SaaS and platform contracts",
      "Privacy policies, terms of service and data protection",
    ],
    situations: [
      ["You are starting with co-founders", "We help you agree who owns what before it matters."],
      ["You are raising your first round", "We handle the term sheet, due diligence and investment documents."],
      ["You are hiring your first team", "We put in place contracts and share options that keep good people."],
      ["You are launching your product", "We prepare your terms and privacy policy, and protect your brand."],
    ],
  },
  {
    slug: "banking-finance",
    name: "Banking & Finance",
    short: "Banking & Finance",
    image: "tower",
    summary: "Lending and security, refinancing and restructuring, and financial regulation, including fintech, payments and virtual assets.",
    lead: "Clear advice on lending, security and financial regulation for borrowers, lenders and investors.",
    overview: [
      "We advise borrowers, lenders and investors on finance transactions and the regulation around them.",
      "That includes the fast-changing rules on fintech, payments and virtual assets.",
    ],
    services: [
      "Loan facilities and refinancing",
      "Security and guarantees",
      "Debt restructuring",
      "Fintech and payments regulation",
      "Virtual assets and digital finance",
      "Licensing and regulatory compliance",
    ],
    situations: [
      ["You are borrowing or refinancing", "We negotiate facility terms you can live with and explain the obligations that matter."],
      ["You are lending and need security", "We document the loan and take security that will hold up if it is ever needed."],
      ["You run or invest in a fintech", "We explain which rules apply, which licences you need and how to stay compliant."],
      ["Your business is under financial pressure", "We help you talk to lenders early and find a workable way through."],
    ],
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    short: "Oil & Gas",
    image: "atrium",
    summary: "Licences and regulatory approvals, joint ventures, asset acquisitions, local content compliance and commercial contracts across the oil and gas value chain.",
    lead: "Clear advice on the licences, partnerships and contracts that move energy projects forward.",
    overview: [
      "We advise operators, investors, service companies and financiers across the oil and gas value chain.",
      "We bring commercial judgement to the licences, partnerships and contracts that projects depend on.",
    ],
    services: [
      "Licensing and regulatory approvals",
      "Joint venture and joint operating agreements",
      "Acquisitions and disposals of oil and gas assets",
      "Local content compliance",
      "Supply, services and offtake contracts",
      "Energy disputes and arbitration",
    ],
    situations: [
      ["You are bidding for or acquiring an asset", "We carry out the due diligence and negotiate the deal documents."],
      ["You are entering a joint venture", "We help you agree control, costs and exit before you commit."],
      ["You are dealing with a regulator", "We prepare applications, secure approvals and keep you compliant."],
      ["A contract dispute has arisen", "We work with our disputes team to resolve it quickly."],
    ],
  },
  {
    slug: "disputes-litigation",
    name: "Disputes & Litigation",
    short: "Disputes",
    image: "colonnade",
    summary: "Commercial disputes, contract claims, debt recovery and arbitration. We aim to resolve matters early and are ready to go to court when we need to.",
    lead: "Disputes resolved with judgement, not noise.",
    overview: [
      "We act for businesses and individuals in commercial disputes. We start by working out what a good outcome looks like for you, and the quickest sensible route to it.",
      "Where a dispute has to be fought, we prepare thoroughly and fight it properly.",
    ],
    services: [
      "Commercial and contract disputes",
      "Debt recovery",
      "Arbitration",
      "Mediation and negotiated settlement",
      "Injunctions and urgent applications",
      "Enforcement of judgments and awards",
    ],
    situations: [
      ["A contract has gone wrong", "We assess your position quickly and tell you plainly what it is worth pursuing."],
      ["You are owed money", "We use the fastest effective route to recovery, from a firm letter to enforcement."],
      ["You have received a claim", "Deadlines to respond can be short. Call us early so your options stay open."],
      ["Something must be stopped now", "We act fast to seek urgent court orders where a delay would cause real harm."],
    ],
  },
  {
    slug: "employment",
    name: "Employment",
    short: "Employment",
    image: "tower",
    summary: "Contracts, policies, workplace investigations, exits and employment claims, for employers and senior executives.",
    lead: "Practical employment advice for employers and senior executives.",
    overview: [
      "We help employers build sound foundations, and we guide them through the difficult moments.",
      "We also advise senior executives on their contracts and on leaving well.",
    ],
    services: [
      "Employment contracts and policies",
      "Executive service agreements",
      "Workplace investigations and discipline",
      "Restructuring and redundancy",
      "Exits and settlement agreements",
      "Employment disputes and claims",
    ],
    situations: [
      ["You are hiring senior people", "We draft contracts that protect the business and are fair enough to sign."],
      ["A complaint or investigation has started", "We help you run a fair process that will stand up to scrutiny."],
      ["You are reorganising the team", "We plan the process, the timing and the communications with you."],
      ["A senior person is leaving", "We negotiate terms that protect your business, your clients and your confidential information."],
    ],
  },
  {
    slug: "real-estate-private-client",
    name: "Real Estate & Private Client",
    short: "Real Estate & Private Client",
    image: "atrium",
    summary: "Property purchases, leases and development, alongside wills, trusts, estates, succession planning and family matters.",
    lead: "Discreet advice on property, wealth and the people you care about.",
    overview: [
      "We act on the purchase, sale, leasing and development of property, and help individuals and families plan for the future.",
      "We work with care and discretion, and we explain each step in plain language.",
    ],
    services: [
      "Property purchases and sales",
      "Commercial and residential leases",
      "Development and construction contracts",
      "Wills and estate administration",
      "Trusts and succession planning",
      "Family and matrimonial matters",
    ],
    situations: [
      ["You are buying or leasing property", "We check title, flag the risks and negotiate terms that suit how you will use it."],
      ["You are developing a site", "We put the land, finance and construction contracts in place."],
      ["You are planning for your family's future", "We make sure your wishes are clear, valid and practical to carry out."],
      ["A loved one has died", "We guide you through administering the estate, one step at a time."],
    ],
  },
];

const bySlug = Object.fromEntries(practices.map((p) => [p.slug, p]));

/* ---------- insights ----------
 * Articles are written in the Sanity Studio (trueworthlp.com/studio) and fetched by site/build.js,
 * which fills this array (newest first) before the pages are rendered.
 * The articles that used to live here are kept in tools/sanity/legacy-articles.js.
 */
const insights = [];

module.exports = { contact, images, practices, bySlug, insights };
