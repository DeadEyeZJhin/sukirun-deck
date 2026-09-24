/* ============================================================
   SukiRun deck engine
   ------------------------------------------------------------
   The same navigation, theme and notes behaviour as the Network Build deck,
   with the topology diagrams, traffic-flow animation and queue simulator
   taken out — this deck shows screenshots, not networks.

   Keys: ← → Space PgUp/PgDn · Home/End · T theme · N notes · F present · P print
   ============================================================ */

/* ============================================================
   1. NAVIGATION
   ============================================================ */
const slides  = [...document.querySelectorAll('.slide')];
const rail    = document.getElementById('rail');
const counter = document.getElementById('counter');
const prog    = document.getElementById('prog');
const root    = document.documentElement;
let dots = [], idx = 0;

slides.forEach((s, i) => {
  const b = document.createElement('button');
  b.dataset.t = String(i + 1).padStart(2, '0') + ' · ' + (s.dataset.title || '');
  b.addEventListener('click', () => go(i));
  rail.appendChild(b);
});
dots = [...rail.children];

function go(i){
  idx = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((s, k) => s.classList.toggle('on', k === idx));
  dots.forEach((d, k) => d.classList.toggle('on', k === idx));
  counter.innerHTML = '<b>' + String(idx + 1).padStart(2, '0') + '</b> / ' + slides.length;
  prog.style.width = (idx / (slides.length - 1) * 100) + '%';
  slides[idx].scrollTop = 0;
  if (location.hash !== '#' + (idx + 1)) history.replaceState(null, '', '#' + (idx + 1));
}

document.getElementById('nextBtn').onclick = () => go(idx + 1);
document.getElementById('prevBtn').onclick = () => go(idx - 1);

addEventListener('keydown', e => {
  if (e.target.matches('input,textarea')) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' '){ e.preventDefault(); go(idx + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp'){ e.preventDefault(); go(idx - 1); }
  else if (k === 'Home'){ go(0); }
  else if (k === 'End'){ go(slides.length - 1); }
  else if (k.toLowerCase() === 't'){ toggleTheme(); }
  else if (k.toLowerCase() === 'n'){ document.body.classList.toggle('notes'); }
  else if (k.toLowerCase() === 'f'){ toggleFs(); }
  else if (k.toLowerCase() === 'p'){ e.preventDefault(); print(); }
});

/* touch swipe */
let tx = 0, ty = 0;
addEventListener('touchstart', e => {
  tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
}, {passive:true});
addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) go(idx + (dx < 0 ? 1 : -1));
}, {passive:true});

function toggleFs(){
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}
document.getElementById('fsBtn')?.addEventListener('click', toggleFs);
document.getElementById('notesBtn')?.addEventListener('click',
  () => document.body.classList.toggle('notes'));

go((parseInt(location.hash.slice(1)) - 1) || 0);

/* deep links: index.html#7 jumps to slide 7 without a reload */
addEventListener('hashchange', () => {
  const n = parseInt(location.hash.slice(1));
  if (!isNaN(n) && n - 1 !== idx) go(n - 1);
});

/* ============================================================
   2. THEME
   ============================================================ */
const themeIcon  = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
function applyTheme(t){
  root.dataset.theme = t;
  if (themeIcon)  themeIcon.src = t === 'dark' ? 'assets/sun.png' : 'assets/moon.png';
  if (themeLabel) themeLabel.textContent = t === 'dark' ? 'Light' : 'Dark';
  try { localStorage.setItem('suki-theme', t); } catch(e){}
}
function toggleTheme(){ applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'); }
document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);
let saved = null;
try { saved = localStorage.getItem('suki-theme'); } catch(e){}
applyTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

/* ============================================================
   3. CONSTELLATION BACKGROUND
   ============================================================ */
(function(){
  const cv = document.getElementById('stars');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, dpr, stars = [];
  const css = v => getComputedStyle(root).getPropertyValue(v).trim();

  function resize(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width  = innerWidth  * dpr;
    H = cv.height = innerHeight * dpr;
    cv.style.width  = innerWidth  + 'px';
    cv.style.height = innerHeight + 'px';
    const n = Math.round(innerWidth * innerHeight / 9000);
    stars = Array.from({length: Math.min(n, 190)}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() * 1.5 + .35) * dpr,
      vx: (Math.random() - .5) * .09 * dpr,
      vy: (Math.random() - .5) * .09 * dpr,
      ph: Math.random() * Math.PI * 2,
      sp: .6 + Math.random() * 1.4,
      hot: Math.random() < .16,
    }));
  }
  resize();
  addEventListener('resize', resize);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let t = 0;
  (function loop(){
    t += .016;
    ctx.clearRect(0, 0, W, H);
    const base = css('--star')   || '#cfd8ee';
    const acc  = css('--accent') || '#FF4D7E';
    const link = root.dataset.theme === 'light' ? 'rgba(80,100,140,' : 'rgba(190,210,255,';
    const maxD = 128 * dpr;
    for (let i = 0; i < stars.length; i++){
      const a = stars[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0) a.x = W; if (a.x > W) a.x = 0;
      if (a.y < 0) a.y = H; if (a.y > H) a.y = 0;
      for (let j = i + 1; j < stars.length; j++){
        const b = stars[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < maxD){
          ctx.strokeStyle = link + (0.16 * (1 - d / maxD)) + ')';
          ctx.lineWidth = .6 * dpr;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const tw = .45 + .55 * Math.abs(Math.sin(a.ph + t * a.sp));
      ctx.globalAlpha = (root.dataset.theme === 'light' ? .38 : .72) * tw;
      ctx.fillStyle = a.hot ? acc : base;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      if (a.hot){
        ctx.globalAlpha = .16 * tw;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 4.5, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   4. SCREENSHOTS
   ------------------------------------------------------------
   Every slot is written as a dashed placeholder naming the file it wants. Drop that
   file into assets/screens/ and it swaps itself in — no editing index.html.
   In the bundled presentation.html the same paths resolve through the ASSETS map.
   ============================================================ */
document.querySelectorAll('[data-shot]').forEach(el => {
  const path = 'assets/screens/' + el.dataset.shot;
  const url  = (typeof ASSETS !== 'undefined' && ASSETS[path]) || path;
  const img  = new Image();
  img.alt = el.dataset.shot.replace(/\.png$/, '').replace(/-/g, ' ');
  img.onload = () => {
    el.classList.remove('todo');
    el.textContent = '';
    el.appendChild(img);
  };
  img.src = url;          // still missing? the placeholder simply stays
});
