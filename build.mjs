// Bizcom Legal — "Horizon" (OVA-inspired cinematic direction).  Run: node build.mjs
// Palette stays on-brand: graphite greys, white, and the logo red as the horizon line.
// Photos = the approved illustrative set (no team photos). Content = the real Bizcom copy only.
import fs from 'node:fs';

const V = '1.1';
const PHONE = '(03) 9108 4865', TEL = 'tel:+61391084865', MOB = '+61 421 327 828', MOBTEL = 'tel:+61421327828';
const EMAIL = 'lynn@bizcomlegal.com.au', WA = 'https://wa.me/61414822108';
const ADDR = 'Suite 25, Third Floor, 2 Brandon Park Drive, Wheelers Hill VIC 3150';
const FEE_LONG = '$350.00 plus GST';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('2 Brandon Park Drive, Wheelers Hill VIC 3150');
const esc = s => s.replace(/&(?![a-z#0-9]+;)/g, '&amp;');
const AR = '<i class="ar" aria-hidden="true">↗</i>';

const NAV = [['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'], ['resources.html', 'Resources'], ['contact.html', 'Contact']];

const pic = (name, alt, sizes, eager = false) => `<img src="assets/img/${name}-1920.jpg?v=${V}" srcset="assets/img/${name}-800.jpg?v=${V} 800w, assets/img/${name}-1280.jpg?v=${V} 1280w, assets/img/${name}-1920.jpg?v=${V} 1920w, assets/img/${name}-2560.jpg?v=${V} 2560w" sizes="${sizes}" alt="${alt}" width="1920" height="1920" ${eager ? '' : 'loading="lazy" '}decoding="async">`;

/* ----- practice areas (only what Bizcom Legal offers; no migration / criminal) ----- */
const AREAS = [
  { id: 'commercial', img: 'commercial-law', alt: 'Lawyers and a client shaking hands across a meeting-room table', t: 'Business & Commercial', short: 'Commercial', lead: 'Day-to-day and transactional counsel that keeps your business moving — from formation documents through to recovery and disputes.',
    items: ['Business Conveyancing', 'Leases & Licensing', 'Contracts', 'E-commerce policies', 'Dispute Resolution', 'Debt Collection', 'Franchising', 'Employment law'] },
  { id: 'property', img: 'property-law', alt: 'A set of house keys being handed over in a bright home', t: 'Property', short: 'Property', lead: 'Conveyancing and property advisory across the eastern states, including guidance for investors and lenders.',
    items: ['Conveyancing — VIC, NSW, QLD, WA, ACT', 'Investment property', 'Guarantor & private lending advice'] },
  { id: 'family-law', img: 'family-law', alt: 'A family walking hand in hand at sunset', t: 'Family Law', short: 'Family', lead: 'Considered, supportive advice on financial and parenting matters — formalised properly and built to last.',
    items: ['Property settlements', 'Binding Financial Agreements / Consent Orders', 'Parenting & Child Support'] },
  { id: 'litigation', img: 'litigation', alt: 'Scales of justice and law books on a desk with a fountain pen', t: 'Litigation', short: 'Litigation', lead: 'Representation and dispute resolution across Victorian tribunals and courts, at every level.',
    items: ['VCAT', 'Magistrates, County & Supreme Court of Victoria', 'Small Claims & Consumer Law'] },
  { id: 'wills-estates', img: 'wills-estates', alt: 'A fountain pen resting on a document on a wooden desk', t: 'Wills & Estates', short: 'Estates', lead: 'Estate planning and administration handled with care — from your will today to probate when it matters.',
    items: ['Wills & Powers of Attorney', 'Estate Planning', 'Probate', 'Letters of Administration'] },
];
/* typographic cards that sit between the photos on the horizon ring — facts from the firm's own copy */
const FACTS = [
  ['2009', 'Admitted — Supreme Court of Victoria'],
  ['VIC · NSW · QLD · WA · ACT', 'Conveyancing'],
  ['VCAT', 'Through to the Supreme Court of Victoria'],
  ['Plain language', 'Practical, tailored advice'],
  ['5', 'Practice areas, one standard of care'],
];
const STEPS = [
  ['Listens', 'Consultation', 'Contact us via phone or email. Our staff books your consultation and a confirmation email is sent.'],
  ['Strategises', 'Strategise', 'You receive tailored advice — clear next steps, with a focus on the results that matter to you.'],
  ['Acts', 'Take action', 'Our legal team supports you through to favourable outcomes, every step of the way.'],
];

/* ----- shared pieces ----- */
const form = (id, tone = 'dark', showFee = false) => `
<div class="fcard fcard--${tone}" ${id === 'h' || id === 'c' ? 'id="enquire"' : ''}>
  <form data-form novalidate aria-label="Enquiry form">
    <div class="fgrid">
      <div class="f"><label for="${id}-name">Full name *</label><input id="${id}-name" name="name" autocomplete="name" required placeholder="Your name"><span class="f__err"></span></div>
      <div class="f"><label for="${id}-email">Email *</label><input id="${id}-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"><span class="f__err"></span></div>
      <div class="f"><label for="${id}-phone">Phone *</label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required placeholder="04xx xxx xxx"><span class="f__err"></span></div>
      <div class="f"><label for="${id}-area">Service of interest *</label><select id="${id}-area" name="area" required><option value="">Select…</option>${AREAS.map(a => `<option>${esc(a.t)}</option>`).join('')}<option>Other</option></select><span class="f__err"></span></div>
      <div class="f f--full"><label for="${id}-time">Preferred contact time</label><select id="${id}-time" name="time"><option>Anytime</option><option>Morning (9am–12pm)</option><option>Afternoon (12pm–5pm)</option><option>Evening (5pm–7pm)</option></select></div>
      <div class="f f--full"><label for="${id}-msg">Message</label><textarea id="${id}-msg" name="message" rows="3" placeholder="A few lines about your matter…"></textarea></div>
    </div>
    <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0">
    <p class="form__status" data-status role="alert"></p>
    <div class="fcard__foot">
      <button class="pill pill--red pill--lg" type="submit">Send enquiry ${AR}</button>
      <p class="fcard__note">Submitting this form does not create a solicitor–client relationship. By submitting you agree to our <a href="privacy.html">Privacy Policy</a>. Enquiries are typically acknowledged within one business day.${showFee ? ` Initial consultation fee: ${FEE_LONG}.` : ''}</p>
    </div>
  </form>
  <div class="form__ok" role="status" aria-live="polite"><span class="mono">Received</span><h4>Thank you — your enquiry has been received.</h4><p>A member of the Bizcom Legal team will respond within one business day.</p></div>
</div>`;

const sky = (extra = '') => `<div class="sky ${extra}" aria-hidden="true"><i class="sky__glow"></i><i class="sky__line"></i><i class="grain"></i></div>`;

function page({ file, title, desc, body, cls = '' }) {
  const home = file === 'index.html';
  const book = home || file === 'contact.html' ? '#enquire' : 'contact.html#enquire';
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#16171A">
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=${V}">
</head>
<body class="${cls}">
<a class="skip" href="#main">Skip to content</a>
<header class="ui" data-ui>
  <div class="ui__l">
    <a class="pill" href="${home ? '#contact' : 'contact.html'}">Contact ${AR}</a>
    <a class="pill pill--opt" href="${home ? '#about' : 'about.html'}">About <i class="ar" aria-hidden="true">↓</i></a>
  </div>
  <a class="ui__c mono" href="index.html" aria-label="Bizcom Legal — home"><span class="live" aria-hidden="true"></span>Bizcom Legal · VIC</a>
  <div class="ui__r">
    <a class="pill pill--cta" href="${book}">Make an appointment</a>
    <button class="menu" data-menu aria-expanded="false" aria-controls="menu"><span class="mono">Menu</span><i aria-hidden="true"></i><img src="assets/brand/monogram-reverse.svg" alt="" width="38" height="20"></button>
  </div>
</header>
<div class="mnu" id="menu" aria-hidden="true">
  ${sky('sky--menu')}
  <nav class="mnu__nav" aria-label="Primary">${NAV.map(([h, t], i) => `<a href="${h}"${h === file ? ' aria-current="page"' : ''}><small class="mono">0${i + 1}</small>${t}</a>`).join('')}</nav>
  <div class="mnu__foot mono"><a href="${TEL}">${PHONE}</a><a href="mailto:${EMAIL}">${EMAIL}</a><span>${ADDR}</span></div>
</div>
<main id="main">
${body}
</main>
<footer class="ft">
  <div class="ft__top">
    <img src="assets/brand/logo-horizontal-reverse.svg" alt="Bizcom Legal" width="190" height="41">
    <p>A Victorian law firm delivering practical, trusted advice across commercial, property, family law and dispute resolution.</p>
  </div>
  <div class="ft__cols">
    <div><h4 class="mono">Pages</h4>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="privacy.html">Privacy Policy</a></div>
    <div><h4 class="mono">Practice</h4>${AREAS.map(a => `<a href="services.html#${a.id}">${esc(a.t)}</a>`).join('')}</div>
    <div><h4 class="mono">Contact</h4><a href="${TEL}">${PHONE}</a><a href="${MOBTEL}">Mobile ${MOB}</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></div>
    <div><h4 class="mono">Office</h4><address>${ADDR}</address><a href="${MAPS}" target="_blank" rel="noopener">Open in Maps ${AR}</a></div>
  </div>
  <div class="ft__auth mono"><span>Victorian Legal Jurisdiction</span><span>Law Institute of Victoria</span><span>Admitted — Supreme Court of Victoria</span></div>
  <div class="ft__base mono"><span>© <span data-year>2026</span> Bizcom Legal. General information only — not legal advice.</span><span>Developed &amp; managed by <a href="https://viralinbound.com" target="_blank" rel="noopener">Viral Inbound</a></span></div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="script.js?v=${V}" defer></script>
</body>
</html>
`;
}

/* inner-page hero: a short horizon band with the page title */
const phead = (crumb, h, p) => `
<section class="phead">
  ${sky('sky--band')}
  <div class="phead__in">
    <span class="mono phead__k"><a href="index.html">Home</a> / ${crumb}</span>
    <h1 class="split"><span class="ln"><span>${h}</span></span></h1>
    <p>${p}</p>
  </div>
</section>`;

/* ================= HOME ================= */
const ring = [];
AREAS.forEach((a, i) => {
  ring.push(`<a class="card card--ph" href="services.html#${a.id}">${pic(a.img, a.alt, '(max-width:760px) 44vw, 20vw', true)}<span class="card__cap mono">0${i + 1} — ${esc(a.short)}</span></a>`);
  const [b, s] = FACTS[i];
  ring.push(`<div class="card card--fact"><b>${b}</b><span class="mono">${s}</span></div>`);
});

const homeBody = `
<div class="intro" data-intro aria-hidden="true">${sky('sky--intro')}<img class="intro__logo" src="assets/brand/logo-stacked-reverse.svg" alt="" width="260" height="150"></div>

<section class="hero" data-scene="hero">
  <div class="stage">
    ${sky('sky--hero')}
    <div class="hero__head">
      <h1 class="split" data-hold><span class="ln"><span>Practical advice,</span></span><span class="ln"><span>tailored to you.</span></span></h1>
    </div>
    <div class="ring" data-ring aria-label="Practice areas">${ring.join('')}</div>
    <p class="hero__words" data-words>Bizcom Legal is a Victorian law firm built around a central promise: practical, tailored advice in plain language — and clear communication at every stage.</p>
    <span class="hero__hint mono" aria-hidden="true">Scroll</span>
  </div>
</section>

<section class="areas" id="practice" aria-label="Practice areas">
  <ol class="rail mono" data-rail aria-hidden="true">${AREAS.map((a, i) => `<li><span>0${i + 1}</span></li>`).join('')}</ol>
  ${AREAS.map((a, i) => `<article class="panel" id="area-${a.id}" data-panel>
    <figure class="panel__ph">${pic(a.img, a.alt, '100vw')}</figure>
    <div class="panel__in">
      <span class="mono panel__k">With expertise in</span>
      <h2 class="split"><span class="ln"><span>${esc(a.t)}</span></span></h2>
      <p class="panel__lead">${a.lead}</p>
      <ul class="panel__list mono">${a.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="panel__btns"><a class="pill pill--light" href="services.html#${a.id}">Learn more ${AR}</a><a class="pill pill--red" href="#enquire">Enquire ${AR}</a></div>
    </div>
    <span class="panel__tag mono">Practice area — 0${i + 1} / 0${AREAS.length}</span>
  </article>`).join('\n  ')}
</section>

<section class="mani" data-scene="mani" aria-label="How we work">
  <div class="stage">
    ${sky('sky--low')}
    <div class="mani__word">
      <span class="mani__brand mono">Bizcom Legal</span>
      <div class="mani__swap" aria-live="off">${STEPS.map(([w], i) => `<span class="w" data-step="${i}">${w}</span>`).join('')}</div>
    </div>
    <div class="mani__copy">${STEPS.map(([, k, d], i) => `<div class="c" data-step="${i}"><span class="mono">0${i + 1} — ${k}</span><p>${d}</p></div>`).join('')}
      <div class="mani__sig"><b>Lynn Saldanha</b><span class="mono">Principal Legal Practitioner</span></div>
    </div>
    <div class="mani__prog" aria-hidden="true"><i></i></div>
  </div>
  <ol class="sr-only">${STEPS.map(([, k, d]) => `<li>${k}: ${d}</li>`).join('')}</ol>
</section>

<section class="dome" id="about" data-scene="dome">
  <div class="stage">
    <p class="dome__words" data-words>Since 2009, Principal Lynn Saldanha has advised Victorian businesses and families — admitted to practice as a Solicitor and Barrister in the Supreme Court, with expertise across commercial law, property, family law and dispute resolution.</p>
    <div class="dome__disc" aria-hidden="true"><i></i></div>
    <div class="dome__facts">
      <div><b>2009</b><span class="mono">Admitted — Supreme Court of Victoria</span></div>
      <div><b>LLB · GDLP · BA</b><span class="mono">Qualifications</span></div>
      <div><b>5 states</b><span class="mono">Conveyancing — VIC, NSW, QLD, WA, ACT</span></div>
      <div><b>VCAT → Supreme</b><span class="mono">Magistrates, County &amp; Supreme Courts</span></div>
    </div>
    <a class="pill pill--light dome__btn" href="about.html">About the firm ${AR}</a>
  </div>
</section>

<section class="dusk" id="contact">
  ${sky('sky--dusk')}
  <canvas class="stars" data-stars aria-hidden="true"></canvas>
  <div class="dusk__in">
    <h2 class="split dusk__h"><span class="ln"><span>Let’s talk</span></span></h2>
    <p class="dusk__p">Book your initial consultation. New enquiries are typically acknowledged within one business day.</p>
    <div class="dusk__links mono">
      <a class="pill" href="${TEL}">${PHONE}</a>
      <a class="pill" href="mailto:${EMAIL}">Email ${AR}</a>
      <a class="pill" href="${WA}" target="_blank" rel="noopener">WhatsApp ${AR}</a>
    </div>
    ${form('h', 'dark', true)}
  </div>
</section>`;

/* ================= ABOUT ================= */
const about = phead('About', 'About Bizcom Legal', 'A Victorian firm with a practical approach — advising on commercial law, property and conveyancing (VIC, NSW, QLD, WA &amp; ACT), family law, dispute resolution and litigation (VCAT &amp; the courts), and wills &amp; estates.') + `
<section class="sec">
  <div class="wrap two">
    <div class="rv">
      <span class="mono k">Our approach</span>
      <h2>Practical advice, accountable delivery.</h2>
      <p class="lead">We keep advice clear and commercial — explaining your options in plain language and staying with you through to a favourable outcome.</p>
    </div>
    <ul class="ticks rv">${['Admitted Solicitor &amp; Barrister, Supreme Court of Victoria (2009)', 'Commercial, property, family law &amp; dispute resolution', 'Conveyancing across VIC, NSW, QLD, WA &amp; ACT', 'Litigation experience across VCAT and the courts', 'Quality advice across a range of industries', 'Estate planning, probate &amp; letters of administration', 'Clear communication at every stage', 'Focused on the best outcomes for you'].map(x => `<li>${x}</li>`).join('')}</ul>
  </div>
</section>
<section class="sec sec--ink">
  <div class="wrap two">
    <div class="rv">
      <span class="mono k">The Principal</span>
      <h2>Lynn Saldanha</h2>
      <p class="mono sub">Principal Legal Practitioner — LLB, GDLP, BA</p>
    </div>
    <div class="rv">
      <p class="lead">Lynn Saldanha is the Principal of Bizcom Legal. Admitted to practice as a Solicitor and Barrister in the Supreme Court in 2009. Expertise in commercial law, property law, family law and dispute resolution. Passionate about achieving the best outcomes for clients.</p>
      <dl class="facts"><div><dt class="mono">Admitted</dt><dd>Supreme Court, 2009</dd></div><div><dt class="mono">Conveyancing</dt><dd>VIC, NSW, QLD, WA, ACT</dd></div><div><dt class="mono">Courts &amp; tribunals</dt><dd>VCAT, Magistrates, County, Supreme</dd></div></dl>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <span class="mono k rv">Areas of expertise</span>
    <div class="rows">${AREAS.map((a, i) => `<a class="row rv" href="services.html#${a.id}"><span class="mono">0${i + 1}</span><b>${esc(a.t)}</b><span class="row__d">${a.lead}</span>${AR}</a>`).join('')}</div>
  </div>
</section>
${bandCta('contact.html#enquire')}`;

function bandCta(href) {
  return `
<section class="band">
  ${sky('sky--band')}
  <div class="band__in">
    <h2 class="split"><span class="ln"><span>Book your initial consultation</span></span></h2>
    <div class="band__btns"><a class="pill pill--red pill--lg" href="${href}">Make an appointment ${AR}</a><a class="pill pill--lg" href="${TEL}">Call ${PHONE}</a></div>
  </div>
</section>`;
}

/* ================= SERVICES ================= */
const services = phead('Services', 'Legal services, grouped by capability', 'Five practice clusters covering the matters Victorian businesses and families face most. One accountable practice across all of them.') + `
<nav class="subnav mono" aria-label="Practice clusters"><div class="wrap">${AREAS.map(a => `<a href="#${a.id}">${esc(a.t)}</a>`).join('')}</div></nav>
<section class="sec sec--tight">
  <div class="wrap">
    ${AREAS.map((a, i) => `<article class="svc" id="${a.id}">
      <figure class="svc__ph rv">${pic(a.img, a.alt, '(max-width:860px) 100vw, 42vw')}</figure>
      <div class="rv">
        <span class="mono k">0${i + 1} / 0${AREAS.length}</span>
        <h2>${esc(a.t)}</h2>
        <p class="lead">${a.lead}</p>
        <ul class="svc__list">${a.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <a class="pill pill--red" href="contact.html#enquire">Enquire ${AR}</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>
${bandCta('contact.html#enquire')}`;

/* ================= RESOURCES ================= */
const DOCS = [
  ['Wills, estates &amp; powers of attorney', [['Making a Will in Victoria', 'What a valid will needs, executors, and keeping it up to date.'], ['Enduring Powers of Attorney — Overview', 'Financial and personal POA, when they apply, and safeguards.'], ['Estate Planning — Getting Started', 'Key documents and decisions to protect your family and assets.'], ['Probate &amp; Letters of Administration — Process Guide', 'Administering an estate, with and without a will.']]],
  ['Disputes, consumer &amp; property', [['Your Consumer Rights in Victoria', 'Guarantees, refunds and where to go when something goes wrong.'], ['Resolving Disputes — Options Before Court', 'Negotiation, mediation and VCAT pathways explained.'], ['Buying Property — Conveyancing Checklist', 'From contract review to settlement, step by step.'], ['Guarantor &amp; Private Lending — What to Know', 'Risks, protections and questions to ask before you sign.'], ['Binding Financial Agreements — Explained', 'How agreements and consent orders formalise a settlement.'], ['Commercial Leasing — Tenant &amp; Landlord Basics', 'Key terms, obligations and common pitfalls in retail/commercial leases.']]],
];
const LINKS = [['Victoria Online', 'https://www.vic.gov.au'], ['OAIC', 'https://www.oaic.gov.au'], ['VCAT', 'https://www.vcat.vic.gov.au'], ['Consumer Affairs Victoria', 'https://www.consumer.vic.gov.au'], ['Law Institute of Victoria', 'https://www.liv.asn.au'], ['Supreme Court of Victoria', 'https://www.supremecourt.vic.gov.au'], ['City of Monash', 'https://www.monash.vic.gov.au'], ['Land Use Victoria', 'https://www.land.vic.gov.au'], ['Courts Victoria', 'https://www.courts.vic.gov.au']];
const resources = phead('Resources', 'Important information', `Reference documents available free on request — by email to ${EMAIL} or in person at our office. General information only, not legal advice.`) + `
<section class="sec">
  <div class="wrap">
    ${DOCS.map(([g, list]) => `<div class="docgrp rv"><span class="mono k">${g}</span><div class="rows">${list.map(([t, d]) => `<a class="row" href="mailto:${EMAIL}?subject=${encodeURIComponent('Document request: ' + t.replace(/&amp;/g, '&'))}"><span class="mono">PDF</span><b>${t}</b><span class="row__d">${d}</span><span class="mono row__r">Request ${AR}</span></a>`).join('')}</div></div>`).join('')}
  </div>
</section>
<section class="sec sec--ink">
  <div class="wrap">
    <span class="mono k rv">Helpful links — official Victorian &amp; Australian resources</span>
    <div class="lgrid rv">${LINKS.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ${AR}</a>`).join('')}</div>
  </div>
</section>
${bandCta('contact.html#enquire')}`;

/* ================= CONTACT ================= */
const contact = phead('Contact', 'Get in touch', 'New enquiries are typically acknowledged within one business day. Call us, email us, or send an enquiry below.') + `
<section class="sec">
  <div class="wrap cgrid">
    <div>
      <div class="rows rows--contact">
        <a class="row rv" href="${TEL}"><span class="mono">Phone</span><b>${PHONE}</b><span class="row__d">Office line — Mon–Fri</span>${AR}</a>
        <a class="row rv" href="${MOBTEL}"><span class="mono">Mobile</span><b>${MOB}</b><span class="row__d">Direct mobile</span>${AR}</a>
        <a class="row rv" href="mailto:${EMAIL}"><span class="mono">Email</span><b>${EMAIL}</b><span class="row__d">Lynn Saldanha — Principal Legal Practitioner</span>${AR}</a>
        <a class="row rv" href="${WA}" target="_blank" rel="noopener"><span class="mono">WhatsApp</span><b>Message us</b><span class="row__d">Quick questions welcome</span>${AR}</a>
        <a class="row rv" href="${MAPS}" target="_blank" rel="noopener"><span class="mono">Office</span><b>Wheelers Hill</b><span class="row__d">${ADDR}</span>${AR}</a>
      </div>
      <div class="map rv"><iframe title="Bizcom Legal office — 2 Brandon Park Drive, Wheelers Hill VIC 3150" src="https://www.google.com/maps?q=2%20Brandon%20Park%20Drive%2C%20Wheelers%20Hill%20VIC%203150&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
    <div class="rv"><span class="mono k">Book an appointment</span>${form('c', 'light', true)}</div>
  </div>
</section>`;

/* ================= PRIVACY ================= */
const pbody = fs.readFileSync('src/privacy-body.html', 'utf8');
const toc = [...pbody.matchAll(/<section id="([^"]+)">\s*<h2>([^<]+)<\/h2>/g)].map(m => `<a href="#${m[1]}">${m[2]}</a>`).join('');
const privacy = phead('Privacy Policy', 'Privacy policy', 'How Bizcom Legal collects, uses, stores, secures and discloses personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). Last updated: 2026.') + `
<section class="sec"><div class="wrap legal"><nav class="toc mono" data-toc aria-label="On this page">${toc}</nav><div class="prose">${pbody}</div></div></section>`;

const pages = [
  { file: 'index.html', cls: 'is-home', title: 'Bizcom Legal | Commercial, Property &amp; Dispute Resolution — Wheelers Hill, VIC', desc: 'Bizcom Legal — a Victorian law firm led by Principal Lynn Saldanha. Commercial, property, family law, litigation, wills and estates.', body: homeBody },
  { file: 'about.html', title: 'About | Bizcom Legal', desc: 'About Bizcom Legal and Principal Lynn Saldanha — admitted Solicitor and Barrister, Supreme Court of Victoria (2009).', body: about },
  { file: 'services.html', title: 'Services | Bizcom Legal', desc: 'Commercial, property, family law, litigation and wills & estates — one accountable Victorian practice.', body: services },
  { file: 'resources.html', title: 'Resources | Bizcom Legal', desc: 'Free reference documents on request and helpful official Victorian and Australian links.', body: resources },
  { file: 'contact.html', title: 'Contact | Bizcom Legal', desc: `Contact Bizcom Legal — ${PHONE}, ${EMAIL}.`, body: contact },
  { file: 'privacy.html', title: 'Privacy Policy | Bizcom Legal', desc: 'How Bizcom Legal handles personal information under the Privacy Act 1988 (Cth) and the APPs.', body: privacy },
];
for (const p of pages) fs.writeFileSync(p.file, page(p));
console.log('built', pages.map(p => p.file).join(', '));
