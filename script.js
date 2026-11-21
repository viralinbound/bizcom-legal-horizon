/* Bizcom Legal — "Horizon": scroll scenes, horizon ring, menu, form. No WebGL. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const body = document.body;
  $$('[data-year]').forEach(e => (e.textContent = new Date().getFullYear()));

  /* ---------- smooth scroll (Lenis if it loaded; native otherwise) ---------- */
  let lenis = null;
  if (!RM && window.Lenis) { try { lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true }); } catch (e) { lenis = null; } }

  /* ---------- menu ---------- */
  const mbtn = $('[data-menu]'), mnu = $('#menu'), mlabel = mbtn && $('span', mbtn);
  const setMenu = o => {
    if (!mbtn) return;
    body.classList.toggle('menu-open', o); mbtn.setAttribute('aria-expanded', o); mnu.setAttribute('aria-hidden', !o);
    if (mlabel) mlabel.textContent = o ? 'Close' : 'Menu';
    if (lenis) o ? lenis.stop() : lenis.start(); else body.style.overflow = o ? 'hidden' : '';
  };
  mbtn && mbtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  $$('a', mnu || document.createElement('div')).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* in-page anchors */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = document.getElementById(id.slice(1)); if (!t) return;
    e.preventDefault(); setMenu(false);
    lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  }));

  /* ---------- word splitting for scroll-lit paragraphs ---------- */
  const wordSets = $$('[data-words]').map(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span> `).join('');
    return { el, w: $$('.w', el), lit: -1 };
  });
  const light = (set, frac) => {
    const n = Math.round(clamp(frac) * set.w.length); if (n === set.lit) return;
    set.w.forEach((s, i) => s.classList.toggle('on', i < n)); set.lit = n;
  };

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv, .split:not([data-hold])').filter(el => !el.closest('.panel')).forEach(el => io.observe(el));

  /* ---------- intro (home, once per session) ---------- */
  const intro = $('[data-intro]'), hold = $('[data-hold]');
  let seen = false; try { seen = sessionStorage.getItem('bz-intro') === '1'; } catch (e) {}
  const release = () => hold && hold.classList.add('in');
  if (intro) {
    if (RM || seen) { body.classList.add('no-intro'); release(); }
    else {
      lenis && lenis.stop();
      setTimeout(() => { intro.classList.add('gone'); lenis && lenis.start(); setTimeout(release, 150); try { sessionStorage.setItem('bz-intro', '1'); } catch (e) {} }, 1750);
    }
  } else release();

  /* ---------- scenes ---------- */
  const scenes = $$('[data-scene]').map(el => ({ el, name: el.dataset.scene, top: 0, h: 0 }));
  let vh = innerHeight, vw = innerWidth;
  const measure = () => {
    vh = innerHeight; vw = innerWidth;
    scenes.forEach(s => { const r = s.el.getBoundingClientRect(); s.top = r.top + scrollY; s.h = s.el.offsetHeight; });
    sizeRing(); drawStars();
  };
  const prog = s => clamp((scrollY - s.top) / Math.max(1, s.h - vh));

  /* horizon ring — cards on the inside of a cylinder, rotated by scroll + a slow drift */
  const ring = $('[data-ring]'), cards = ring ? $$('.card', ring) : [];
  let R = 1000, D = 300, SP = 16, TOTAL = 160, LIM = 50;
  function sizeRing() {
    if (!ring) return;
    const cw = vw < 760 ? Math.max(140, vw * 0.44) : clamp(vw * 0.18, 190, 300);
    ring.style.setProperty('--cw', cw + 'px');
    R = cw * (vw < 760 ? 2.6 : 2.9); D = cw * (vw < 760 ? 0.9 : 0.95);
    SP = (cw * 1.12 / R) * 180 / Math.PI;
    TOTAL = SP * cards.length; LIM = Math.min(TOTAL / 2 - SP / 2, vw < 760 ? 52 : 50);
  }
  let drift = 0, last = performance.now();
  function placeRing(p, dt) {
    if (!RM) drift += dt * 0.0022;
    const off = p * 150 + drift;
    cards.forEach((c, i) => {
      let a = i * SP - off;
      a = ((a + TOTAL / 2) % TOTAL + TOTAL) % TOTAL - TOTAL / 2;
      const abs = Math.abs(a);
      if (abs > LIM) { if (c._v !== 0) { c.style.visibility = 'hidden'; c._v = 0; } return; }
      if (c._v !== 1) { c.style.visibility = 'visible'; c._v = 1; }
      const r = a * Math.PI / 180, x = R * Math.sin(r), z = R - D - R * Math.cos(r);
      c.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(-a).toFixed(2)}deg)`;
      c.style.opacity = clamp((LIM - abs) / 9).toFixed(3);
    });
  }

  const heroHead = $('.hero__head'), hint = $('.hero__hint'), heroWords = wordSets.find(s => s.el.classList.contains('hero__words'));
  const domeWords = wordSets.find(s => s.el.classList.contains('dome__words'));
  const mani = scenes.find(s => s.name === 'mani'), mWords = mani ? $$('.mani__swap .w', mani.el) : [], mCopy = mani ? $$('.mani__copy .c', mani.el) : [], mProg = mani && $('.mani__prog', mani.el);
  let mStep = -1;
  const dome = scenes.find(s => s.name === 'dome'), disc = dome && $('.dome__disc', dome.el);

  function frame(now) {
    const dt = Math.min(64, now - last); last = now;
    lenis && lenis.raf(now);
    const y = scrollY;
    for (const s of scenes) {
      if (y + vh < s.top - 50 || y > s.top + s.h + 50) continue; // off-screen
      const p = prog(s);
      if (s.name === 'hero') {
        placeRing(p, dt);
        heroWords && light(heroWords, (p - 0.04) / 0.42);
        if (heroHead) { heroHead.style.transform = `translateY(${(-p * 90).toFixed(1)}px)`; heroHead.style.opacity = clamp(1 - (p - 0.5) * 2.6).toFixed(3); }
        hint && (hint.style.opacity = clamp(1 - p * 12).toFixed(2));
      } else if (s.name === 'mani') {
        const st = Math.min(mWords.length - 1, Math.floor(p * mWords.length * 0.999));
        if (st !== mStep) {
          mWords.forEach((w, i) => { w.classList.toggle('on', i === st); w.classList.toggle('past', i < st); });
          mCopy.forEach((c, i) => c.classList.toggle('on', i === st)); mStep = st;
        }
        mProg && mProg.style.setProperty('--p', p.toFixed(3));
      } else if (s.name === 'dome') {
        domeWords && light(domeWords, p / 0.36);
        disc && disc.style.setProperty('--rise', (clamp((p - 0.12) / 0.5) * vh * 0.56).toFixed(1) + 'px');
        s.el.classList.toggle('facts-on', p > 0.6);
      }
    }
    const hero = scenes.find(s => s.name === 'hero');
    if (hero) body.classList.toggle('past-hero', y > hero.top + hero.h - vh * 1.1);
    requestAnimationFrame(frame);
  }

  /* ---------- practice panels: activate + side rail ---------- */
  const panels = $$('[data-panel]'), railLis = $$('[data-rail] li'), areas = $('.areas');
  if (panels.length) {
    const pio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); $('.split', e.target)?.classList.add('in');
      const i = panels.indexOf(e.target); railLis.forEach((l, j) => l.classList.toggle('on', j === i));
    }), { threshold: 0.55 });
    panels.forEach(p => pio.observe(p));
    new IntersectionObserver(es => es.forEach(e => body.classList.toggle('in-areas', e.isIntersecting)), { rootMargin: '-45% 0px -45% 0px' }).observe(areas);
  }

  /* ---------- stars over the dusk contact ---------- */
  const cv = $('[data-stars]');
  function drawStars() {
    if (!cv) return;
    const d = Math.min(2, devicePixelRatio || 1), w = cv.offsetWidth, h = cv.offsetHeight;
    cv.width = w * d; cv.height = h * d;
    const g = cv.getContext('2d'); g.scale(d, d);
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const n = Math.round(w * h / 2600);
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, yy = Math.pow(rnd(), 1.4) * h, r = rnd() * 0.9 + 0.2;
      g.globalAlpha = (1 - yy / h) * (0.25 + rnd() * 0.75);
      g.fillStyle = rnd() > 0.93 ? '#ffd9dc' : '#fff';
      g.beginPath(); g.arc(x, yy, r, 0, 6.283); g.fill();
    }
  }

  measure();
  addEventListener('resize', () => { clearTimeout(measure._t); measure._t = setTimeout(measure, 120); });
  addEventListener('load', measure);
  requestAnimationFrame(frame);

  /* ---------- active section: services sub-nav + privacy contents ---------- */
  const spy = links => {
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); } }), { rootMargin: '-35% 0px -60% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); s && o.observe(s); });
  };
  const sn = $$('.subnav a'); if (sn.length) spy(sn);
  const tc = $$('[data-toc] a'); if (tc.length) spy(tc);

  /* ---------- enquiry form — validates, then emails the firm via FormSubmit ---------- */
  const ENDPOINT = 'https://formsubmit.co/ajax/lynn@bizcomlegal.com.au';
  $$('[data-form]').forEach(f => {
    const rules = {
      name: v => v.trim().length > 1 || 'Please enter your name',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email',
      phone: v => v.replace(/\D/g, '').length >= 8 || 'Please enter a valid phone number',
      area: v => !!v || 'Please choose a service',
    };
    const check = el => {
      const r = rules[el.name]; if (!r) return true;
      const res = r(el.value), box = el.closest('.f');
      box.classList.toggle('err', res !== true); $('.f__err', box).textContent = res === true ? '' : res;
      el.setAttribute('aria-invalid', res !== true); return res === true;
    };
    $$('input,select', f).forEach(el => el.addEventListener('blur', () => check(el)));
    const btnS = $('button[type=submit]', f), status = $('[data-status]', f), card = f.closest('.fcard') || f;
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = $$('input,select', f).filter(el => !check(el)); if (bad.length) return bad[0].focus();
      if (f._honey && f._honey.value) return card.classList.add('done');
      const d = Object.fromEntries(new FormData(f));
      const label = btnS.innerHTML; btnS.disabled = true; btnS.textContent = 'Sending…'; status.textContent = '';
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `New website enquiry — ${d.area} — ${d.name}`, _template: 'table', _captcha: 'false', _replyto: d.email,
            Name: d.name, Email: d.email, Phone: d.phone, 'Service of interest': d.area,
            'Preferred contact time': d.time, Message: d.message || '—', Page: location.pathname,
          }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || res.status);
        card.classList.add('done'); f.reset();
      } catch (err) {
        status.innerHTML = 'Sorry — the message could not be sent. Please email <a href="mailto:lynn@bizcomlegal.com.au">lynn@bizcomlegal.com.au</a> or call (03) 9108 4865.';
      } finally { btnS.disabled = false; btnS.innerHTML = label; }
    });
  });
})();
