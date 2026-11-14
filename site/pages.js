/*
 * Page templates. Each returns a complete HTML document.
 */
const { contact, practices, bySlug, insights } = require("./data");
const { esc, fmtDate, page, pageHero, card, contactScreen, footer } = require("./layout");

const num = (i) => String(i + 1).padStart(2, "0");
const arrow = `<svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

// =====================================================================
// Home
// =====================================================================
const home = () => page({
  title: "Trueworth | Law Firm",
  description: "Trueworth is a law firm giving clear, senior-led advice to businesses, families and individuals.",
  heroImage: "photo",
  main: `
    <!-- 1. Hero carousel -->
    <section class="hero" aria-roledescription="carousel" aria-label="Highlights" data-carousel>
      <div class="hero-slides">
        <article class="slide is-active" role="group" aria-roledescription="slide" aria-label="1 of 3">
          <img class="slide-media slide-media--photo" src="/assets/img/hero-glass-tower-1400.webp"
               srcset="/assets/img/hero-glass-tower-900.webp 900w, /assets/img/hero-glass-tower-1400.webp 1400w, /assets/img/hero-glass-tower-2000.webp 2000w"
               sizes="100vw" alt="" width="2000" height="1335" fetchpriority="high">
          <div class="slide-shade" aria-hidden="true"></div>
          <div class="container slide-content">
            <p class="eyebrow">Trueworth</p>
            <h1 class="display">Clear counsel for the decisions that matter most</h1>
            <a class="link-arrow" href="/firm">Our firm</a>
          </div>
        </article>

        <article class="slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
          <img class="slide-media slide-media--colonnade" src="/assets/img/art-colonnade.svg" alt="" width="1800" height="1200" loading="lazy">
          <div class="slide-shade" aria-hidden="true"></div>
          <div class="container slide-content">
            <p class="eyebrow">Disputes &amp; Litigation</p>
            <h2 class="display">Disputes resolved with judgement, not noise</h2>
            <a class="link-arrow" href="/expertise/disputes-litigation">Disputes &amp; Litigation</a>
          </div>
        </article>

        <article class="slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
          <img class="slide-media slide-media--louvres" src="/assets/img/art-louvres.svg" alt="" width="1800" height="1200" loading="lazy">
          <div class="slide-shade" aria-hidden="true"></div>
          <div class="container slide-content">
            <p class="eyebrow">Latest insight</p>
            <h2 class="display">${esc(insights[0].title)}</h2>
            <a class="link-arrow" href="/insights/${insights[0].slug}">Read the article</a>
          </div>
        </article>
      </div>

      <div class="container hero-ui">
        <div class="hero-progress" role="group" aria-label="Choose slide">
          <button type="button" class="progress-bar is-active" aria-label="Show slide 1" aria-current="true"><span></span></button>
          <button type="button" class="progress-bar" aria-label="Show slide 2"><span></span></button>
          <button type="button" class="progress-bar" aria-label="Show slide 3"><span></span></button>
        </div>
        <div class="hero-controls">
          <button type="button" class="hero-btn hero-btn--plain" data-carousel-toggle aria-label="Pause slideshow">
            <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
            <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>
          </button>
          <button type="button" class="hero-btn" data-carousel-prev aria-label="Previous slide">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button type="button" class="hero-btn" data-carousel-next aria-label="Next slide">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- 2. Firm statement -->
    <section class="screen statement" id="firm" aria-labelledby="firm-title">
      <div class="container">
        <p class="eyebrow eyebrow--teal reveal">Our firm</p>
        <h2 class="statement-text reveal" id="firm-title">
          Trueworth is built on a simple principle: the right advice, given plainly, at the moment it counts.
        </h2>
        <div class="statement-grid">
          <div>
            <p class="lead reveal">
              We act for businesses, families and individuals who want a lawyer who understands what is at stake
              and says what they think. Every matter is led by a senior lawyer from first call to final signature.
            </p>
            <a class="link-arrow link-arrow--teal reveal" href="/firm">About Trueworth</a>
          </div>
          <ul class="pillars" role="list">
            <li class="reveal">
              <span class="pillar-num">01</span>
              <h3>Senior-led</h3>
              <p>A senior lawyer owns your matter and is the person you speak to.</p>
            </li>
            <li class="reveal">
              <span class="pillar-num">02</span>
              <h3>Plain answers</h3>
              <p>Advice you can act on, written for decision-makers rather than other lawyers.</p>
            </li>
            <li class="reveal">
              <span class="pillar-num">03</span>
              <h3>Fees agreed up front</h3>
              <p>A clear scope and estimate before the work begins, with no surprises.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 3. Expertise -->
    <section class="screen expertise" id="expertise" aria-labelledby="expertise-title">
      <div class="container expertise-grid">
        <div class="expertise-intro">
          <p class="eyebrow eyebrow--sand reveal">Expertise</p>
          <h2 class="section-title reveal" id="expertise-title">Advice across the life of a business, a family and a career</h2>
          <p class="reveal">Select a practice area to see how we help.</p>
          <a class="link-arrow reveal" href="/expertise">All expertise</a>
        </div>

        <div class="practice-list">
${practices.map((p, i) => `          <details name="practice" class="practice reveal"${i === 0 ? " open" : ""}>
            <summary><span class="practice-num">${num(i)}</span><span class="practice-name">${esc(p.name)}</span><span class="practice-icon" aria-hidden="true"></span></summary>
            <p>${esc(p.summary)}</p>
            <a class="link-arrow practice-more" href="/expertise/${p.slug}">Explore ${esc(p.name)}</a>
          </details>`).join("\n")}
        </div>
      </div>
    </section>

    <!-- 4. Approach -->
    <section class="screen approach" id="approach" aria-labelledby="approach-title">
      <div class="approach-media" aria-hidden="true">
        <img src="/assets/img/art-atrium.svg" alt="" width="1800" height="1200" loading="lazy">
      </div>
      <div class="approach-body">
        <p class="eyebrow eyebrow--teal reveal">How we work</p>
        <h2 class="section-title reveal" id="approach-title">A straightforward way of working</h2>
        <ol class="steps" role="list">
          <li class="reveal"><h3>Listen</h3><p>We start by understanding the people, the commercial picture and what a good outcome looks like for you.</p></li>
          <li class="reveal"><h3>Advise</h3><p>You get a clear view of your options, the risks and our recommendation, in writing.</p></li>
          <li class="reveal"><h3>Act</h3><p>We do the work to an agreed scope and timetable, and keep you updated without being chased.</p></li>
          <li class="reveal"><h3>Stay close</h3><p>When the matter closes, we stay available for the next question, whenever it comes.</p></li>
        </ol>
        <a class="link-arrow link-arrow--teal reveal steps-more" href="/firm#commitments">Our commitments to you</a>
      </div>
    </section>

    <!-- 5. Insights -->
    <section class="screen insights" id="insights" aria-labelledby="insights-title">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow eyebrow--teal reveal">Insights</p>
            <h2 class="section-title reveal" id="insights-title">Thinking that's useful to you</h2>
          </div>
          <a class="link-arrow link-arrow--teal reveal" href="/insights">All insights</a>
        </div>
        <div class="cards">
${insights.slice(0, 3).map((a) => card(a)).join("\n")}
        </div>
      </div>
    </section>

    <!-- 6. Careers -->
    <section class="screen careers" id="careers" aria-labelledby="careers-title">
      <img class="careers-media" src="/assets/img/art-colonnade.svg" alt="" width="1800" height="1200" loading="lazy">
      <div class="careers-shade" aria-hidden="true"></div>
      <div class="container careers-content">
        <p class="eyebrow reveal">Careers</p>
        <h2 class="display reveal" id="careers-title">Do work you'll be proud to put your name to</h2>
        <p class="careers-text reveal">We are always glad to hear from talented lawyers, trainees and business services professionals.</p>
        <a class="link-arrow reveal" href="/careers">Careers at Trueworth</a>
      </div>
    </section>

    <!-- 7. Contact + footer -->
${contactScreen()}`,
});

// =====================================================================
// Our Firm
// =====================================================================
const PRINCIPLES = [
  ["Titles are earned", "No one is given seniority they have not shown, the founders included."],
  ["The client hears the truth plainly", "Clear advice and a clear recommendation, in words a client can act on."],
  ["Two people check what matters", "Advice, deadlines and money never rest on one person alone."],
  ["The firm comes before any one of us", "Decisions, credit and the name belong to Trueworth."],
  ["We grow our people", "Every lawyer should end each year better than they started it."],
];
const COMMITMENTS = [
  ["One named lawyer", "Every matter has one lawyer responsible for it, and you know who that is from the first letter."],
  ["Replies within one working day", "Every message gets a reply within one working day. If the full answer takes longer, we tell you when it will come."],
  ["A clear recommendation", "Our advice ends with what we recommend and why, not only a list of options."],
  ["Fees in writing first", "Before work starts you receive a written estimate and scope. If the work will cost more, we tell you before we go over it."],
  ["Plain English", "We write for the person making the decision, not for other lawyers."],
];

const firm = () => page({
  title: "Our Firm | Trueworth",
  description: "Trueworth is a law firm built on earned titles, plain advice and clear commitments to clients.",
  active: "firm",
  heroImage: "colonnade",
  main: `
${pageHero({ image: "colonnade", eyebrow: "Our firm", title: "A firm where every title is earned", lead: "Trueworth gives clear, senior-led legal advice to businesses, families and individuals." })}

    <section class="screen statement" aria-labelledby="who-title">
      <div class="container">
        <p class="eyebrow eyebrow--teal reveal">Who we are</p>
        <h2 class="statement-text reveal" id="who-title">We act for people who want a lawyer who understands what is at stake and says what they think.</h2>
        <div class="statement-grid">
          <p class="lead reveal">Trueworth advises on corporate and commercial matters, disputes, finance, property, employment, intellectual property and private client work.</p>
          <p class="lead reveal">We are deliberately built differently. The people who founded the firm hold themselves to the same rules as everyone who joins it, and those rules are written down.</p>
        </div>
      </div>
    </section>

    <section class="screen principles" aria-labelledby="principles-title">
      <div class="container">
        <p class="eyebrow eyebrow--teal reveal">Our principles</p>
        <h2 class="section-title reveal" id="principles-title">Five principles behind everything we do</h2>
        <ol class="principle-grid" role="list">
${PRINCIPLES.map(([t, d], i) => `          <li class="reveal"><span class="pillar-num">${num(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ol>
      </div>
    </section>

    <section class="screen titles" id="titles" aria-labelledby="titles-title">
      <div class="container titles-grid">
        <div>
          <p class="eyebrow eyebrow--sand reveal">Titles are earned</p>
          <h2 class="section-title reveal" id="titles-title">Even our founders start as Senior Associates</h2>
        </div>
        <div class="titles-body">
          <p class="reveal">At Trueworth, no one is given seniority they have not shown. The founders hold the title Senior Associate, and become Partners only after five years of committed practice.</p>
          <p class="reveal">That step is measured against published criteria and confirmed by an independent senior lawyer from outside the firm. Lawyers who join from other firms also start below Partner, whatever their previous title.</p>
          <p class="reveal">For clients, it means the title on our letters is one that has been earned.</p>
          <ol class="ladder reveal" role="list" aria-label="Titles at Trueworth">
            <li><span>Trainee</span></li>
            <li><span>Associate</span></li>
            <li class="is-founders"><span>Senior Associate</span><small>Founders start here</small></li>
            <li><span>Partner</span><small>After five years and independent review</small></li>
          </ol>
        </div>
      </div>
    </section>

    <section class="screen approach" id="commitments" aria-labelledby="commitments-title">
      <div class="approach-media" aria-hidden="true">
        <img src="/assets/img/art-atrium.svg" alt="" width="1800" height="1200" loading="lazy">
      </div>
      <div class="approach-body">
        <p class="eyebrow eyebrow--teal reveal">Our commitments</p>
        <h2 class="section-title reveal" id="commitments-title">What you can expect from us</h2>
        <ol class="steps" role="list">
${COMMITMENTS.map(([t, d]) => `          <li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ol>
      </div>
    </section>

${contactScreen()}`,
});

// =====================================================================
// Expertise index
// =====================================================================
const expertise = () => page({
  title: "Expertise | Trueworth",
  description: "Trueworth's practice areas: corporate and commercial, disputes, banking and finance, real estate, employment, IP and technology, and private client.",
  active: "expertise",
  heroImage: "tower",
  main: `
${pageHero({ image: "tower", eyebrow: "Expertise", title: "Advice across the life of a business, a family and a career", lead: "Seven practice areas, one standard of advice: clear, senior-led and practical." })}

    <section class="screen practice-index" aria-labelledby="areas-title">
      <div class="container practice-index-grid">
        <div class="practice-index-intro">
          <p class="eyebrow eyebrow--teal reveal">Practice areas</p>
          <h2 class="section-title reveal" id="areas-title">How we can help</h2>
          <p class="lead reveal">Choose an area to see what we do, and when clients usually call us.</p>
        </div>
        <ul class="practice-rows" role="list">
${practices.map((p, i) => `          <li class="reveal">
            <a class="practice-row" href="/expertise/${p.slug}">
              <span class="practice-num">${num(i)}</span>
              <span class="practice-row-text"><span class="practice-name">${esc(p.name)}</span><span class="practice-row-summary">${esc(p.summary)}</span></span>
              ${arrow}
            </a>
          </li>`).join("\n")}
        </ul>
      </div>
    </section>

${contactScreen()}`,
});

// =====================================================================
// Practice area
// =====================================================================
const practice = (p) => {
  const related = insights.filter((a) => a.practice === p.slug);
  // related articles first, topped up with the latest others so the row always has three
  const shown = [...related, ...insights.filter((a) => a.practice !== p.slug)].slice(0, 3);
  const others = practices.filter((o) => o.slug !== p.slug);
  return page({
    title: `${p.name} | Trueworth`,
    description: p.lead,
    active: "expertise",
    heroImage: p.image,
    main: `
${pageHero({
    image: p.image, eyebrow: "Expertise", eyebrowHref: "/expertise", title: p.name, lead: p.lead,
    actions: `<a class="btn btn-light" href="/contact?practice=${p.slug}">Discuss a matter</a>`,
  })}

    <section class="screen statement" aria-labelledby="help-title">
      <div class="container service-grid">
        <div>
          <p class="eyebrow eyebrow--teal reveal">How we help</p>
          <h2 class="section-title reveal" id="help-title">${esc(p.overview[0])}</h2>
          ${p.overview.slice(1).map((o) => `<p class="lead reveal">${esc(o)}</p>`).join("\n          ")}
        </div>
        <ul class="service-list" role="list" aria-label="Services">
${p.services.map((s, i) => `          <li class="reveal"><span class="pillar-num">${num(i)}</span>${esc(s)}</li>`).join("\n")}
        </ul>
      </div>
    </section>

    <section class="screen situations" aria-labelledby="when-title">
      <div class="container">
        <p class="eyebrow eyebrow--sand reveal">When to call us</p>
        <h2 class="section-title reveal" id="when-title">Situations we help with</h2>
        <ul class="situation-grid" role="list">
${p.situations.map(([t, d], i) => `          <li class="reveal"><span class="practice-num">${num(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ul>
      </div>
    </section>

    <section class="screen insights" aria-labelledby="related-title">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow eyebrow--teal reveal">Insights</p>
            <h2 class="section-title reveal" id="related-title">${related.length ? "Related insights" : "Latest insights"}</h2>
          </div>
          <a class="link-arrow link-arrow--teal reveal" href="/insights">All insights</a>
        </div>
        <div class="cards">
${shown.map((a) => card(a)).join("\n")}
        </div>
        <nav class="other-practices reveal" aria-label="Other practice areas">
          <p class="eyebrow eyebrow--teal">Other practice areas</p>
          <ul role="list">
${others.map((o) => `            <li><a href="/expertise/${o.slug}">${esc(o.name)}</a></li>`).join("\n")}
          </ul>
        </nav>
      </div>
    </section>

${contactScreen({ cta: { href: `/contact?practice=${p.slug}`, label: "Discuss a matter" } })}`,
  });
};

// =====================================================================
// Insights index
// =====================================================================
const insightsIndex = () => {
  const featured = insights[0];
  const cats = [...new Set(insights.map((a) => a.practice))];
  return page({
    title: "Insights | Trueworth",
    description: "Practical legal insights from Trueworth for businesses, boards and families.",
    active: "insights",
    heroImage: featured.image,
    main: `
    <h1 class="visually-hidden">Insights</h1>
${pageHero({
    image: featured.image, eyebrow: `Latest insight · ${bySlug[featured.practice].short}`, title: featured.title,
    lead: featured.standfirst, titleTag: "h2",
    actions: `<a class="btn btn-light" href="/insights/${featured.slug}">Read the article</a>`,
  })}

    <section class="screen insights insights-all" aria-labelledby="all-title">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow eyebrow--teal reveal">Insights</p>
            <h2 class="section-title reveal" id="all-title">Thinking that's useful to you</h2>
          </div>
        </div>
        <div class="filters reveal" role="group" aria-label="Filter by practice area" data-filters>
          <button type="button" class="filter is-active" aria-pressed="true" data-filter="all">All</button>
${cats.map((c) => `          <button type="button" class="filter" aria-pressed="false" data-filter="${c}">${esc(bySlug[c].short)}</button>`).join("\n")}
        </div>
        <div class="cards" data-filter-target>
${insights.map((a) => card(a)).join("\n")}
        </div>
      </div>
    </section>

${contactScreen()}`,
  });
};

// =====================================================================
// Article
// =====================================================================
const article = (a) => {
  const p = bySlug[a.practice];
  const more = insights.filter((o) => o.slug !== a.slug).slice(0, 3);
  return page({
    title: `${a.title} | Trueworth`,
    description: a.standfirst,
    active: "insights",
    heroImage: a.image,
    main: `
${pageHero({
    image: a.image, eyebrow: p.name, eyebrowHref: `/expertise/${p.slug}`, title: a.title, lead: a.standfirst,
    meta: `<time datetime="${a.date}">${fmtDate(a.date)}</time><span aria-hidden="true">·</span>${a.readMinutes} min read`,
  })}

    <section class="article" aria-label="Article">
      <div class="container article-grid">
        <aside class="article-aside">
          <dl>
            <div><dt>Published</dt><dd><time datetime="${a.date}">${fmtDate(a.date)}</time></dd></div>
            <div><dt>Practice area</dt><dd><a href="/expertise/${p.slug}">${esc(p.name)}</a></dd></div>
            <div><dt>Author</dt><dd>${esc(a.author || "Trueworth")}</dd></div>
          </dl>
          <a class="link-arrow link-arrow--teal link-arrow--back" href="/insights">All insights</a>
        </aside>
        <div class="prose">
${a.body.trim()}
          <p class="prose-note">This article is for general information only and is not legal advice. For advice on your situation, <a href="/contact?practice=${p.slug}">contact us</a>.</p>
        </div>
      </div>
    </section>

    <section class="screen insights" aria-labelledby="more-title">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow eyebrow--teal reveal">Insights</p>
            <h2 class="section-title reveal" id="more-title">More insights</h2>
          </div>
          <a class="link-arrow link-arrow--teal reveal" href="/insights">All insights</a>
        </div>
        <div class="cards">
${more.map((o) => card(o)).join("\n")}
        </div>
      </div>
    </section>

${contactScreen({ cta: { href: `/contact?practice=${p.slug}`, label: "Get in touch" } })}`,
  });
};

// =====================================================================
// Careers
// =====================================================================
const BENEFITS = [
  ["A named mentor", "Every junior lawyer has a named mentor from their first day."],
  ["Credit where it is due", "When we report work to a client, we name the people who did it."],
  ["Feedback within a week", "Everyone who worked on a major matter gets written feedback within a week of it closing."],
  ["Training every year", "Every lawyer has protected time for training, every year."],
  ["Pro bono", "Every lawyer gives time to pro bono work."],
  ["Holidays are taken", "Everyone takes their full holiday entitlement. The founders set the example."],
];
const PATHS = [
  ["Trainees", "For those starting out in law. You work on real matters from the start, with a mentor beside you."],
  ["Lawyers", "For qualified lawyers who want responsibility and straight feedback. Titles here are earned on published criteria."],
  ["Business services", "For the people who keep the firm running well: operations, finance, marketing and client service."],
];
const APPLY = [
  ["Write to us", `Email your CV and a short note on what interests you to ${contact.careersEmail}.`],
  ["A first conversation", "If there is a fit, we arrange an informal call to get to know each other."],
  ["Meet the team", "You meet the people you would work with, and ask them anything."],
  ["A clear answer", "We tell you the outcome promptly, whatever it is."],
];

const careers = () => page({
  title: "Careers | Trueworth",
  description: "Careers at Trueworth for trainees, lawyers and business services professionals.",
  active: "careers",
  heroImage: "photo",
  main: `
${pageHero({
    image: "photo", eyebrow: "Careers", title: "Do work you'll be proud to put your name to",
    lead: "We are always glad to hear from talented lawyers, trainees and business services professionals.",
    actions: `<a class="btn btn-light" href="#apply">How to apply</a>`,
  })}

    <section class="screen statement" aria-labelledby="why-title">
      <div class="container">
        <p class="eyebrow eyebrow--teal reveal">Why Trueworth</p>
        <h2 class="section-title reveal" id="why-title">A place to do your best work, and to grow</h2>
        <ul class="principle-grid principle-grid--three" role="list">
${BENEFITS.map(([t, d], i) => `          <li class="reveal"><span class="pillar-num">${num(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ul>
      </div>
    </section>

    <section class="screen principles" aria-labelledby="paths-title">
      <div class="container">
        <p class="eyebrow eyebrow--teal reveal">Who we hire</p>
        <h2 class="section-title reveal" id="paths-title">Three ways to join us</h2>
        <ul class="path-grid" role="list">
${PATHS.map(([t, d]) => `          <li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ul>
        <a class="link-arrow link-arrow--teal reveal" href="/firm#titles">How titles are earned at Trueworth</a>
      </div>
    </section>

    <section class="screen approach" id="apply" aria-labelledby="apply-title">
      <div class="approach-media" aria-hidden="true">
        <img src="/assets/img/art-tower.svg" alt="" width="1800" height="1200" loading="lazy" style="object-position: 62% 35%">
      </div>
      <div class="approach-body">
        <p class="eyebrow eyebrow--teal reveal">How to apply</p>
        <h2 class="section-title reveal" id="apply-title">Send us a short note and your CV</h2>
        <p class="lead reveal">We do not always advertise roles, so we welcome speculative applications.</p>
        <ol class="steps" role="list">
${APPLY.map(([t, d]) => `          <li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ol>
        <a class="btn btn-solid reveal" href="mailto:${contact.careersEmail}?subject=Application">Email ${esc(contact.careersEmail)}</a>
      </div>
    </section>

${contactScreen({ eyebrow: "Careers", title: "Questions about working here?", lead: "Email us and we will come back to you.", cta: { href: `mailto:${contact.careersEmail}`, label: "Email us" } })}`,
});

// =====================================================================
// Contact
// =====================================================================
const contactPage = () => page({
  title: "Contact | Trueworth",
  description: "Contact Trueworth. A lawyer will come back to you within one working day.",
  active: "contact",
  main: `
    <section class="screen contact contact-page" aria-labelledby="page-title">
      <div class="container contact-page-grid">
        <div>
          <p class="eyebrow eyebrow--teal reveal">Contact</p>
          <h1 class="section-title reveal" id="page-title">Let's talk about your matter</h1>
          <p class="lead reveal">Tell us briefly what you need and a lawyer will come back to you within one working day.</p>
          <dl class="contact-list reveal">
            <div><dt>Telephone</dt><dd><a href="${contact.phoneHref}">${esc(contact.phone)}</a></dd></div>
            <div><dt>Email</dt><dd><a href="mailto:${contact.email}">${esc(contact.email)}</a></dd></div>
            <div><dt>Office</dt><dd>${contact.address.map(esc).join("<br>")}</dd></div>
            <div><dt>Hours</dt><dd>${esc(contact.hours)}</dd></div>
          </dl>
        </div>

        <form class="enquiry reveal" action="mailto:${contact.email}" method="post" enctype="text/plain" data-enquiry data-to="${contact.email}">
          <div class="field-row">
            <div class="field">
              <label for="f-name">Name</label>
              <input id="f-name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="f-email">Email</label>
              <input id="f-email" name="email" type="email" autocomplete="email" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="f-phone">Phone <span class="optional">(optional)</span></label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel">
            </div>
            <div class="field">
              <label for="f-area">Area</label>
              <select id="f-area" name="area" data-practice-select>
                <option value="">General enquiry</option>
${practices.map((p) => `                <option value="${p.slug}">${esc(p.name)}</option>`).join("\n")}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="f-message">How can we help?</label>
            <textarea id="f-message" name="message" rows="6" required></textarea>
          </div>
          <label class="check">
            <input type="checkbox" name="ack" required>
            <span>I understand that sending this message does not create a lawyer–client relationship, and I have not included confidential information.</span>
          </label>
          <div class="form-actions">
            <button class="btn btn-solid" type="submit">Send by email</button>
            <p class="form-note">This opens your email app with your message ready to send.</p>
          </div>
        </form>
      </div>
    </section>
${footer()}`,
});

// =====================================================================
// 404
// =====================================================================
const notFound = () => page({
  title: "Page not found | Trueworth",
  description: "The page you were looking for could not be found.",
  main: `
    <section class="screen statement" aria-labelledby="page-title">
      <div class="container">
        <p class="eyebrow eyebrow--teal">Error 404</p>
        <h1 class="statement-text" id="page-title">We couldn't find that page.</h1>
        <p class="lead not-found-lead">It may have moved, or the link may be out of date.</p>
        <a class="btn btn-solid" href="/">Back to the homepage</a>
      </div>
    </section>
${footer()}`,
});

module.exports = { home, firm, expertise, practice, insightsIndex, article, careers, contactPage, notFound, practices, insights };
