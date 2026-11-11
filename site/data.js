/*
 * Site content: contact details, practice areas and insights.
 * Edit here, then run `node site/build.js` to regenerate the pages.
 * Plain text fields are escaped when rendered; fields named `html` / `body` are trusted HTML.
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
    summary: "Company formation, shareholder agreements, acquisitions and disposals, joint ventures and the commercial contracts that run your business day to day.",
    lead: "Advice for the moments that shape a business: starting it, funding it, growing it and selling it.",
    overview: [
      "We advise founders, owners, boards and investors on the transactions and agreements that shape a business.",
      "We keep documents as simple as the deal allows, and we tell you which points matter and which do not.",
    ],
    services: [
      "Company formation and structuring",
      "Shareholder and joint venture agreements",
      "Acquisitions and disposals",
      "Investment and fundraising rounds",
      "Commercial contracts and terms of business",
      "Corporate governance and board advice",
    ],
    situations: [
      ["You are starting a company with others", "We help co-founders agree ownership, decision-making and what happens if someone leaves, before it matters."],
      ["You are raising investment", "We negotiate term sheets, prepare for due diligence and settle the investment documents."],
      ["You are buying or selling a business", "We run due diligence, negotiate the deal and take it through to completion."],
      ["You need contracts that work", "We write supplier, customer and distribution agreements around how you actually trade."],
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
    slug: "banking-finance",
    name: "Banking & Finance",
    short: "Banking & Finance",
    image: "louvres",
    summary: "Lending and security, refinancing and restructuring, and financial regulation for borrowers, lenders and investors.",
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
    slug: "real-estate",
    name: "Real Estate",
    short: "Real Estate",
    image: "atrium",
    summary: "Acquisitions, leasing, development and property finance for commercial and private clients.",
    lead: "Property advice for owners, occupiers, investors and developers.",
    overview: [
      "We act on the purchase, sale, leasing and development of property for businesses and private clients.",
      "We check what you are buying before you commit, and we make sure the paperwork protects you afterwards.",
    ],
    services: [
      "Acquisitions and sales",
      "Commercial leases",
      "Development and construction contracts",
      "Property finance",
      "Title checks and due diligence",
      "Property disputes",
    ],
    situations: [
      ["You are buying property", "We investigate title, flag the risks and take the purchase through to completion."],
      ["You are taking or granting a lease", "We negotiate terms on rent, repairs and breaks that suit how you will use the space."],
      ["You are developing a site", "We put the land, finance and construction contracts in place."],
      ["A property dispute has arisen", "We work with our disputes team to resolve it quickly and cost-effectively."],
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
    slug: "ip-technology",
    name: "Intellectual Property & Technology",
    short: "IP & Technology",
    image: "louvres",
    summary: "Brand protection, licensing, technology contracts, data protection and privacy compliance.",
    lead: "Protecting what you create, and the technology you build your business on.",
    overview: [
      "We help businesses protect their brands and ideas, license them, and contract for the technology they rely on.",
      "We also advise on handling personal data lawfully, an issue that investors and large customers increasingly ask about.",
    ],
    services: [
      "Trade marks and brand protection",
      "Licensing and IP agreements",
      "Technology and software contracts",
      "Data protection and privacy compliance",
      "Website and platform terms",
      "IP enforcement and disputes",
    ],
    situations: [
      ["You are launching a brand", "We check it is free to use and register it in the places that matter."],
      ["You are licensing technology in or out", "We agree who owns what, what it may be used for and what happens if it fails."],
      ["You handle personal data", "We review your practices and put the right notices, policies and contracts in place."],
      ["Someone is copying your work", "We act quickly to stop the infringement and protect your position."],
    ],
  },
  {
    slug: "private-client-family",
    name: "Private Client & Family",
    short: "Private Client",
    image: "colonnade",
    summary: "Wills, estates, trusts, succession planning and family matters, handled with discretion.",
    lead: "Discreet advice on wealth, succession and family matters.",
    overview: [
      "We help individuals and families plan for the future, manage what they have built and deal with difficult moments.",
      "We work with care and discretion, and we explain each step in plain language.",
    ],
    services: [
      "Wills",
      "Estate administration",
      "Trusts",
      "Succession planning for family businesses",
      "Family and matrimonial matters",
      "Powers of attorney",
    ],
    situations: [
      ["You are planning for your family's future", "We make sure your wishes are clear, valid and practical to carry out."],
      ["A loved one has died", "We guide you through administering the estate, one step at a time."],
      ["You are passing on a family business", "We plan the handover so that the business and the family stay intact."],
      ["You are going through a separation", "We give calm, clear advice on your options and the likely outcomes."],
    ],
  },
];

const bySlug = Object.fromEntries(practices.map((p) => [p.slug, p]));

/* ---------- insights (newest first) ---------- */
const insights = [
  {
    slug: "virtual-assets-in-nigeria",
    title: "Virtual assets in Nigeria",
    standfirst: "A practical overview of the CBN's regulatory framework for non-security virtual assets.",
    practice: "banking-finance",
    date: "2026-11-10",
    image: "photo",
    readMinutes: 8,
    // Draft outline: replace each bracketed section with the published article text.
    body: `
<p class="prose-lead">[Opening: in two or three sentences, say what the framework is, who issued it and why it matters to the reader.]</p>
<h2>What counts as a non-security virtual asset</h2>
<p>[Explain the definition used in the framework and give everyday examples.]</p>
<h2>Who the framework applies to</h2>
<p>[Set out which businesses are covered: for example exchanges, wallet providers and the banks that serve them.]</p>
<h2>The key requirements</h2>
<p>[Summarise licensing, capital, customer due diligence, reporting and any restrictions on dealing with banks.]</p>
<h2>What businesses should do now</h2>
<p>[Give a short, practical checklist for businesses in or near the sector.]</p>`,
  },
  {
    slug: "data-rules-for-growing-businesses",
    title: "What the new data rules mean for growing businesses",
    standfirst: "A practical checklist for founders and boards.",
    practice: "ip-technology",
    date: "2026-10-14",
    image: "louvres",
    readMinutes: 4,
    body: `
<p class="prose-lead">Data protection rules are getting stricter, and regulators are enforcing them. For a growing business, compliance is now a commercial issue as much as a legal one: investors, partners and large customers increasingly ask to see it.</p>
<h2>Start with what you hold</h2>
<p>List the personal data the business collects about customers, staff, suppliers and website visitors. For each, note why you hold it, where it is stored and who can access it. Most of the steps below build on this record.</p>
<h2>Have a lawful reason for each use</h2>
<p>Every use of personal data needs a legal basis, such as consent, a contract or a legitimate business need. Consent is not always the best basis. Where you rely on it, it must be freely given and easy to withdraw.</p>
<h2>Tell people what you do</h2>
<p>A clear privacy notice on your website and in your sign-up flows should say what you collect, why, how long you keep it and who you share it with.</p>
<h2>Secure it, and plan for a breach</h2>
<p>Limit access, use strong authentication and encrypt sensitive data. Decide now who does what if data is lost or stolen: many laws set short deadlines for telling the regulator and the people affected.</p>
<h2>Check your suppliers</h2>
<p>Cloud providers, payroll services and marketing tools all handle your data. Your contracts with them should cover security, confidentiality and what happens to the data when the contract ends, especially where it is stored abroad.</p>
<h2>The checklist</h2>
<ul>
  <li>A record of the personal data you hold</li>
  <li>A legal basis for each use</li>
  <li>An up-to-date privacy notice</li>
  <li>Security measures and a breach plan</li>
  <li>Data protection terms in supplier contracts</li>
  <li>A named person responsible for data protection</li>
</ul>
<p>If you would like to know where your business stands, we can review your current practices and tell you what to fix first.</p>`,
  },
  {
    slug: "shareholder-agreement-clauses",
    title: "Five clauses to check before you sign a shareholder agreement",
    standfirst: "The points that matter most when shareholders stop agreeing.",
    practice: "corporate-commercial",
    date: "2026-09-30",
    image: "tower",
    readMinutes: 4,
    body: `
<p class="prose-lead">A shareholder agreement is easiest to negotiate when everyone gets on, and most valuable when they no longer do. These are the five clauses we look at first.</p>
<h2>1. Who decides what</h2>
<p>Most decisions are made by the board or by a simple majority of shareholders. A shareholder agreement usually lists "reserved matters" that need wider approval, such as issuing new shares, taking on large debts or selling the business. Check that the list protects you without letting one person block everything.</p>
<h2>2. Selling shares</h2>
<p>Pre-emption rights give existing shareholders the first chance to buy shares that someone wants to sell. Drag-along rights let a majority require the minority to join a sale of the whole company; tag-along rights let the minority join a sale on the same terms. Make sure the thresholds and prices are ones you can live with.</p>
<h2>3. Deadlock</h2>
<p>Where shareholders are split evenly, a disagreement can freeze the company. A good agreement sets out what happens next: escalation to senior people, then mediation, and as a last resort a way for one side to buy out the other.</p>
<h2>4. When someone leaves</h2>
<p>Leaver clauses decide what happens to a founder's or employee's shares when they stop working in the business. "Good leavers" usually receive fair value; "bad leavers" may receive less. The definitions matter more than any other words in the clause.</p>
<h2>5. Future funding</h2>
<p>Check how new investment will be raised, whether shareholders must contribute, and how existing stakes are protected from dilution. Investors often ask for protections here, so it is worth agreeing the principles early.</p>
<p>If you are about to sign a shareholder agreement, we can review it and tell you which points are worth negotiating.</p>`,
  },
  {
    slug: "settling-early",
    title: "Settling early: when it makes sense, and when it doesn't",
    standfirst: "How to weigh a settlement against the cost and risk of going to court.",
    practice: "disputes-litigation",
    date: "2026-09-12",
    image: "colonnade",
    readMinutes: 3,
    body: `
<p class="prose-lead">Most disputes end in a settlement. The real questions are when, and on what terms. Settling early can save cost and time, but it is not always the right answer.</p>
<h2>When settling early makes sense</h2>
<ul>
  <li><strong>Cost.</strong> Legal costs rise quickly once proceedings start, and are rarely recovered in full even when you win.</li>
  <li><strong>Time and attention.</strong> A dispute can occupy management for months or years.</li>
  <li><strong>Relationships.</strong> A negotiated outcome can preserve a commercial relationship that litigation would end.</li>
  <li><strong>Certainty.</strong> A settlement removes the risk of losing at trial.</li>
</ul>
<h2>When it may not</h2>
<ul>
  <li>When you need a ruling, for example to set a precedent or to deter others.</li>
  <li>When the other side is unlikely to honour an agreement.</li>
  <li>When you need urgent protection from the court, such as an order to stop something happening.</li>
</ul>
<h2>How to approach it</h2>
<p>Settlement discussions can usually take place "without prejudice", which generally means what is said cannot later be used in court. Mediation with a neutral third party often helps when direct talks have stalled.</p>
<p>Whatever the route, record the terms in a properly drafted settlement agreement, so that the dispute stays settled.</p>`,
  },
];

module.exports = { contact, images, practices, bySlug, insights };
