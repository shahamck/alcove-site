import '@fontsource/instrument-serif';
import '@fontsource-variable/inter';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { ROOMS, SERVICES, LISTINGS, POSTS, TRAIL } from './data.js';
import { counterMask } from './counter.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- icons + logo ---------- */
const svg = (inner, sw = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICONS = {
  chev: svg('<path d="m9 5 7 7-7 7"/>'),
  chevL: svg('<path d="m15 5-7 7 7 7"/>'),
  up: svg('<path d="M7 17 17 7M8.5 7H17v8.5"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
};
const LOGO = `${svg('<path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M8.5 21v-9.5a3.5 3.5 0 0 1 7 0V21"/><path d="M2.5 21h19"/>', 1.5)}<span>ALCOVE</span>`;
const paintIcons = (root = document) => $$('[data-icon]', root).forEach((el) => { if (!el.firstChild) el.innerHTML = ICONS[el.dataset.icon]; });
$$('.logo').forEach((el) => (el.innerHTML = LOGO));

/* ---------- render content ---------- */
function renderListings() {
  $('#listGrid').innerHTML = LISTINGS.map((l) => `
    <a class="li ${l.cls}" href="#contact" ${l.speed ? `data-speed="${l.speed}"` : ''}>
      <div class="li__img img-reveal"><img src="${l.img}" alt="${l.title}" loading="lazy" /></div>
      <div class="li__row"><h3>${l.title}</h3><span>${l.price}</span></div>
      <p class="li__loc"><span data-icon="pin"></span>${l.loc}</p>
    </a>`).join('');
}
function renderPosts() {
  $('#journalGrid').innerHTML = POSTS.map((p, i) => `
    <a class="post ${i ? 'post--sm' : ''}" href="#journal" data-fade>
      <div class="post__img img-reveal"><img src="${p.img}" alt="" loading="lazy" /></div>
      <div class="post__body">
        <h3 class="post__title">${p.title}</h3>
        ${p.excerpt ? `<p class="post__excerpt">${p.excerpt}</p>` : ''}
        <div class="post__meta"><span>${p.date}</span><span>${p.tag}</span></div>
      </div>
    </a>`).join('');
}
renderListings();
renderPosts();
paintIcons();

/* ---------- smooth scroll ---------- */
const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduced });
window.lenis = lenis;
window.gsap = gsap;
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const target = id === '#top' ? 0 : $(id);
  if (target === null) return;
  e.preventDefault();
  if (a.hasAttribute('data-menu-link')) closeMenu();
  lenis.scrollTo(target, { duration: 1.6 });
});

/* ---------- text + image reveals ---------- */
function splitLines(el) {
  const split = new SplitText(el, { type: 'lines', linesClass: 'line' });
  split.lines.forEach((line) => {
    const wrap = document.createElement('div');
    wrap.className = 'split-line';
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });
  return split.lines;
}

function setupReveals() {
  $$('[data-lines]').forEach((el) => {
    const lines = splitLines(el);
    gsap.from(lines, {
      yPercent: 108, duration: 1.2, stagger: 0.09, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  $$('[data-fade]').forEach((el) => {
    gsap.from(el, {
      y: 26, autoAlpha: 0, filter: 'blur(8px)', duration: 1.1, ease: 'power3.out',
      clearProps: 'filter',
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });

  $$('.img-reveal').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out' })
      .from(img, { scale: 1.25, duration: 1.8, ease: 'expo.out', clearProps: 'scale' }, 0);
  });

  $$('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -Number(img.dataset.parallax) }, {
      yPercent: Number(img.dataset.parallax), ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  $$('[data-speed]').forEach((el) => {
    gsap.fromTo(el, { yPercent: Number(el.dataset.speed) * 100 }, {
      yPercent: -Number(el.dataset.speed) * 100, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Hero drifts slower than the page as About slides over it
  gsap.to('#heroMedia', {
    yPercent: 22, scale: 1.06, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__content', {
    y: -60, autoAlpha: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: '35% top', end: '85% top', scrub: true },
  });

  $$('[data-count]').forEach((el) => {
    const n = Number(el.dataset.count);
    const o = { v: 0 };
    gsap.to(o, {
      v: n, duration: 2.2, ease: 'power3.out',
      onUpdate: () => (el.textContent = Math.round(o.v)),
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });
}

/* ---------- showcase ---------- */
function setupShowcase() {
  const slides = $('#showSlides');
  const card = $('#roomText');
  const dots = $('#roomDots');
  const spot = $('#hotspot');
  dots.innerHTML = ROOMS.map(() => '<i></i>').join('');
  let index = -1;
  let busy = null;

  const fillCard = (r) => {
    $('.room-card__title', card).textContent = r.title;
    $('.room-card__loc span:last-child', card).textContent = r.loc;
    $('.room-card__desc', card).textContent = r.desc;
    $('#roomPrice').textContent = r.price;
    $('#hotTitle').textContent = r.spot.title;
    const thumb = $('#hotThumb');
    thumb.style.backgroundImage = `url(${r.img})`;
    thumb.style.backgroundPosition = r.spot.focus;
    spot.style.left = r.spot.x + '%';
    spot.style.top = r.spot.y + '%';
    spot.classList.toggle('is-left', innerWidth <= 720 && r.spot.x > 45);
    $$('i', dots).forEach((d, i) => d.classList.toggle('on', i === index));
  };

  function go(next, dir = 1) {
    next = (next + ROOMS.length) % ROOMS.length;
    if (next === index) return;
    const first = index < 0;
    index = next;
    const r = ROOMS[next];
    const el = document.createElement('div');
    el.className = 'slide';
    el.innerHTML = `<img src="${r.img}" alt="${r.title}" />`;
    slides.appendChild(el);
    busy?.progress(1);
    if (first) { fillCard(r); return; }

    const old = $$('.slide', slides).slice(0, -1);
    busy = gsap.timeline({ onComplete: () => old.forEach((o) => o.remove()) })
      .fromTo(el, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut' })
      .from(el.firstChild, { scale: 1.22, yPercent: 8 * dir, duration: 1.6, ease: 'expo.out' }, 0.15)
      .to(card, { autoAlpha: 0, y: -10, filter: 'blur(6px)', duration: 0.35, ease: 'power2.in' }, 0)
      .to('.hotspot__card', { scale: 0.6, autoAlpha: 0, duration: 0.3 }, 0)
      .add(() => fillCard(r), 0.4)
      .to(card, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, 0.55)
      .to('.hotspot__card', { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.6)' }, 1.05);
  }

  go(0);
  $('#nextRoom').addEventListener('click', () => go(index + 1, 1));
  $('#prevRoom').addEventListener('click', () => go(index - 1, -1));

  // The inset frame opens to full bleed, then the pinned scroll steps through the rooms
  const frame = $('#showFrame');
  const gutter = getComputedStyle(document.documentElement).getPropertyValue('--gutter');
  const small = innerWidth <= 720;
  gsap.fromTo(frame,
    { clipPath: small ? 'inset(8% 16px 5% 16px)' : `inset(10% ${gutter} 6% ${gutter})` },
    { clipPath: 'inset(0% 0px 0% 0px)', ease: 'none', scrollTrigger: { trigger: '#showcase', start: 'top 70%', end: 'top top', scrub: true } });
  gsap.fromTo('#showSlides', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#showcase', start: 'top bottom', end: 'top top', scrub: true } });

  let stepped = 0;
  ScrollTrigger.create({
    trigger: '#showcase', start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      const step = Math.min(ROOMS.length - 1, Math.floor(st.progress * ROOMS.length * 0.999));
      if (step !== stepped) { go(step, step > stepped ? 1 : -1); stepped = step; }
    },
  });
}

/* ---------- services ---------- */
function setupServices() {
  const cats = $('#cats');
  const acc = $('#acc');
  let active = 0;
  cats.innerHTML = SERVICES.map((s, i) => `<li><button type="button" data-i="${i}">${s.name}</button></li>`).join('');

  const renderAcc = () => {
    acc.innerHTML = SERVICES[active].items.map(([title, desc, img], i) => `
      <li class="${i === 0 ? 'open' : ''}">
        <button class="acc__head" type="button" aria-expanded="${i === 0}"><i>${String(i + 1).padStart(2, '0')}</i><span>${title}</span></button>
        <div class="acc__body"><div>
          <div class="acc__img"><img src="./img/${img}.jpg" alt="" loading="lazy" /></div>
          <p>${desc}</p>
        </div></div>
      </li>`).join('');
    $$('button', cats).forEach((b, i) => b.classList.toggle('on', i === active));
  };
  renderAcc();

  let swapT;
  const pick = (i) => {
    if (i === active) return;
    active = i;
    $$('button', cats).forEach((b, j) => b.classList.toggle('on', j === active));
    clearTimeout(swapT);
    acc.classList.add('is-swapping');
    swapT = setTimeout(() => {
      renderAcc();
      requestAnimationFrame(() => acc.classList.remove('is-swapping'));
      ScrollTrigger.refresh();
    }, 420);
  };
  cats.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) pick(Number(b.dataset.i)); });
  if (finePointer) {
    let hoverT;
    cats.addEventListener('mouseover', (e) => {
      const b = e.target.closest('button');
      clearTimeout(hoverT);
      if (b) hoverT = setTimeout(() => pick(Number(b.dataset.i)), 160);
    });
  }
  acc.addEventListener('click', (e) => {
    const head = e.target.closest('.acc__head');
    if (!head) return;
    const li = head.parentElement;
    const open = !li.classList.contains('open');
    $$('li', acc).forEach((x) => { x.classList.remove('open'); $('.acc__head', x).setAttribute('aria-expanded', 'false'); });
    if (open) { li.classList.add('open'); head.setAttribute('aria-expanded', 'true'); }
    setTimeout(() => ScrollTrigger.refresh(), 750);
  });
}

/* ---------- menu ---------- */
const menu = $('#menu');
let menuTl;
function openMenu() {
  menu.setAttribute('aria-hidden', 'false');
  lenis.stop();
  menuTl?.kill();
  menuTl = gsap.timeline()
    .set(menu, { visibility: 'visible' })
    .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
    // explicit end values: the hidden menu would otherwise read the links' resting opacity as 0
    .fromTo('.menu__links a', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 0.55, stagger: 0.05, duration: 0.8, ease: 'power3.out', clearProps: 'opacity,transform' }, 0.45)
    .from('.menu__preview', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1, ease: 'expo.out' }, 0.5);
}
function closeMenu() {
  if (menu.getAttribute('aria-hidden') === 'true') return;
  menu.setAttribute('aria-hidden', 'true');
  menuTl?.kill();
  menuTl = gsap.timeline({ onComplete: () => gsap.set(menu, { visibility: 'hidden' }) })
    .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' });
  lenis.start();
}
$('#menuOpen').addEventListener('click', openMenu);
$('#menuClose').addEventListener('click', closeMenu);
addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
$$('.menu__links a').forEach((a) => a.addEventListener('mouseenter', () => { $('#menuPreview').src = a.dataset.img; }));

/* ---------- footer wordmark ---------- */
function setupMark() {
  const mark = $('#mark');
  const word = $('#markWord');
  word.innerHTML = 'ALCOVE'.split('').map((c) => (c === 'O' ? '<span class="mark__o">O<i class="mark__fill"></i></span>' : `<span>${c}</span>`)).join('');
  const o = $('.mark__o', word);
  const fill = $('.mark__fill', word);
  o.style.zIndex = 0;
  fill.style.zIndex = -1;
  fill.style.backgroundImage = `url(./img/extra-fire.jpg)`;

  // The mask is size-independent, so it is drawn once the word has a real size
  let masked = false;
  const fit = () => {
    word.style.fontSize = '100px';
    const w = $$('span', word).reduce((s, el) => s + el.getBoundingClientRect().width, 0);
    const avail = word.clientWidth;
    if (!w || !avail) return;
    word.style.fontSize = `${(100 * avail) / w * 0.995}px`;
    if (masked) return;
    const m = counterMask(o);
    if (!m) return;
    fill.style.webkitMaskImage = fill.style.maskImage = `url(${m.url})`;
    masked = true;
  };
  fit();
  addEventListener('resize', fit);
  if (!finePointer) {
    ScrollTrigger.create({ trigger: mark, start: 'top 70%', onEnter: () => (fill.style.transform = 'scale(1)') });
    return;
  }

  // Image trail that follows the cursor across the letters
  const trail = $('#markTrail');
  const pool = TRAIL.map((src) => { const im = new Image(); im.src = src; im.alt = ''; trail.appendChild(im); return im; });
  let n = 0, lx = -999, ly = -999;
  mark.addEventListener('mousemove', (e) => {
    const r = mark.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (Math.hypot(x - lx, y - ly) < 90) return;
    lx = x; ly = y;
    const im = pool[n++ % pool.length];
    gsap.killTweensOf(im);
    gsap.timeline()
      .fromTo(im, { x: x - im.offsetWidth / 2, y: y - im.offsetHeight / 2, rotation: gsap.utils.random(-14, 14), scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
      .to(im, { y: `+=${30}`, scale: 0.85, autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, 0.65);
  });
}

/* ---------- intro: wordmark → through the O → hero ---------- */
async function intro() {
  if (!reduced) { lenis.stop(); document.documentElement.classList.add('is-loading'); }
  const loader = $('#loader');
  const shade = $('#loaderShade');
  const dim = $('#loaderDim');
  const word = $('#loaderWord');
  word.innerHTML = 'ALCOVE'.split('').map((c) => `<span${c === 'O' ? ' class="lo-o"' : ''}>${c}</span>`).join('');
  const letters = $$('span', word);
  const o = $('.lo-o', word);
  const heroImg = $('#heroMedia img');
  await Promise.all([
    document.fonts.load('400 100px "Instrument Serif"').then(() => document.fonts.ready),
    heroImg.decode().catch(() => {}),
  ]);

  const heroTitle = splitLines($('.hero__title'));
  gsap.set('[data-intro]', { autoAlpha: 0, y: 22 });
  gsap.set(heroTitle, { yPercent: 110 });

  const landed = () => {
    loader.remove();
    document.documentElement.classList.remove('is-loading');
    lenis.start();
    gsap.timeline()
      .to(heroTitle, { yPercent: 0, duration: 1.3, stagger: 0.1, ease: 'power4.out' })
      .to('[data-intro]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.25);
  };

  if (reduced) { landed(); return; }
  const m = counterMask(o);
  if (!m) { gsap.to(loader, { autoAlpha: 0, duration: 0.6, onComplete: landed }); return; }

  // Geometry, measured before anything is transformed. C is the centre of the O's
  // counter on screen: the word scales about it and the O turns about it, so it never moves.
  const wr = word.getBoundingClientRect();
  const or = o.getBoundingClientRect();
  const fx = (m.box.x0 + m.box.x1) / 2, fy = (m.box.y0 + m.box.y1) / 2;
  const C = { x: or.left + or.width * fx, y: or.top + or.height * fy };
  gsap.set(word, { transformOrigin: `${C.x - wr.left}px ${C.y - wr.top}px` });
  gsap.set(o, { transformOrigin: `${or.width * fx}px ${or.height * fy}px` });

  // Lying on its side the O is wider than it was tall, so its neighbours step aside
  const inkW = or.width * (m.ink.x1 - m.ink.x0);
  const inkH = or.height * (m.ink.y1 - m.ink.y0);
  const push = (inkH - inkW) / 2 + or.width * 0.05;
  const i = letters.indexOf(o);
  const before = letters.slice(0, i), after = letters.slice(i + 1);

  // Scale at which the sideways counter (a across, b up after the turn) covers the viewport
  const a = (or.height * (m.box.y1 - m.box.y0)) / 2;
  const b = (or.width * (m.box.x1 - m.box.x0)) / 2;
  const S = Math.hypot(innerWidth / 2 / a, innerHeight / 2 / b) * 1.15;

  // The shade is a canvas redrawn every frame with the counter punched out,
  // using the same scale and rotation as the letters so the two stay locked together
  const ctx = shade.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  shade.width = Math.round(innerWidth * dpr);
  shade.height = Math.round(innerHeight * dpr);
  ctx.imageSmoothingQuality = 'high';
  const unit = or.width / m.canvas.width;
  const mcx = m.canvas.width * fx, mcy = m.canvas.height * fy;
  const st = { scale: 1, rot: 0, cut: 0 };
  const draw = () => {
    gsap.set(word, { scale: st.scale });
    gsap.set(o, { rotation: st.rot });
    // C and V only move as far as the turning O needs them to
    const k = gsap.utils.clamp(0, 1, st.rot / 90);
    gsap.set(before, { x: -push * k });
    gsap.set(after, { x: push * k });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#433a30';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    if (!st.cut) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.translate(C.x, C.y);
    ctx.rotate((st.rot * Math.PI) / 180);
    ctx.scale(st.scale * unit, st.scale * unit);
    ctx.drawImage(m.canvas, -mcx, -mcy);
  };
  draw();
  gsap.ticker.add(draw);

  const heroPic = $('#heroMedia img');
  gsap.set(heroPic, { scale: 1.14 });

  // The letters are simply there; only the O moves
  gsap.set(word, { opacity: 1 });
  gsap.timeline({ onComplete: () => { gsap.ticker.remove(draw); landed(); } })
    // the room starts to glow through the counter
    .set(st, { cut: 1 }, 0)
    .fromTo(dim, { opacity: 1 }, { opacity: 0.5, duration: 0.6, ease: 'sine.inOut' }, 0)
    // the O tips back, then swings onto its side: fast through the middle, soft at the end
    .to(st, { rot: -14, duration: 0.3, ease: 'power2.out' }, 0.2)
    .to(st, { rot: 90, duration: 1.3, ease: 'expo.inOut' }, 0.5)
    // meanwhile the camera flies through it
    .to(st, { scale: S, duration: 1.6, ease: 'power4.in' }, 0.3)
    .to(dim, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 1.1);
  // the room settles as we arrive (kept outside the timeline so it can outlast the intro)
  gsap.to(heroPic, { scale: 1, duration: 2.4, delay: 1.5, ease: 'power2.out' });
}

/* ---------- boot ---------- */
setupServices();
setupShowcase();
Promise.all([document.fonts.load('400 1em "Instrument Serif"'), document.fonts.load('400 1em "Inter Variable"')]).catch(() => {}).then(() => document.fonts.ready).then(() => {
  setupReveals();
  setupMark();
  ScrollTrigger.refresh();
});
intro();
addEventListener('load', () => ScrollTrigger.refresh());
