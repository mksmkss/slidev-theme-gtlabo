/* ===== Spec site app.js ===== */

// -------- Sidebar collapse --------
document.querySelectorAll('.nav-heading').forEach(h => {
  h.addEventListener('click', () => {
    h.parentElement.classList.toggle('collapsed');
  });
});

// -------- Copy buttons --------
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const wrap = btn.closest('.code-wrap');
    const pre = wrap.querySelector('pre');
    const text = pre.innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1400);
    });
  });
});

// -------- Font tweaks --------
const fontBtns = document.querySelectorAll('.font-btn');
fontBtns.forEach(b => {
  b.addEventListener('click', () => {
    fontBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.body.classList.remove('font-serif', 'font-mono');
    if (b.dataset.font === 'serif') document.body.classList.add('font-serif');
    if (b.dataset.font === 'mono') document.body.classList.add('font-mono');
  });
});
// simple style for font buttons (inline so we don't touch CSS file)
const fbStyle = document.createElement('style');
fbStyle.textContent = `
.font-btn { flex:1; font-family: var(--font-mono); font-size: 11px; padding: 6px 4px;
  background: #fff; border: 1px solid var(--line); border-radius: 3px; cursor: pointer;
  color: var(--ink-3); letter-spacing: 0.05em; transition: all 0.15s; }
.font-btn:hover { border-color: var(--sky-600); color: var(--sky-700); }
.font-btn.active { background: var(--sky-600); border-color: var(--sky-600); color: #fff; }
`;
document.head.appendChild(fbStyle);

// -------- Build right TOC from h2s --------
const tocList = document.getElementById('toc-list');
document.querySelectorAll('main h2').forEach(h2 => {
  const section = h2.closest('section.doc-section');
  if (!section || !section.id) return;
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = '#' + section.id;
  // get text without the num
  const num = h2.querySelector('.num');
  const label = Array.from(h2.childNodes)
    .filter(n => n !== num)
    .map(n => n.textContent)
    .join('').trim().replace(/\s*\/.*/, '');
  a.textContent = (num ? num.textContent + ' · ' : '') + label;
  li.appendChild(a);
  tocList.appendChild(li);
});

// -------- Scroll spy for both navs --------
const allSectionIds = new Set();
document.querySelectorAll('section.doc-section[id], section[id]').forEach(s => allSectionIds.add(s.id));
const allNavLinks = document.querySelectorAll('.sidebar .nav-list a, .toc ul a');

function onScroll() {
  const y = window.scrollY + 80;
  let current = null;
  document.querySelectorAll('section.doc-section[id], section[id]').forEach(s => {
    if (s.offsetTop <= y) current = s.id;
  });
  allNavLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ================================================
// ============= LIVE TWEAK PREVIEWS =============
// ================================================

// --- SectionTitle preview ---
(function(){
  const root = document.querySelector('[data-preview="sectiontitle"]');
  if (!root) return;
  const titleInput = root.querySelector('[data-key="title"]');
  const colorSel = root.querySelector('[data-key="color"]');
  const bar = root.querySelector('[data-target="bar"]');
  const text = root.querySelector('[data-target="text"]');

  const colorMap = {
    'sky-800': '#075985',
    'sky-600': '#0284c7',
    'indigo-700': '#4338ca',
    'red-700': '#b91c1c',
    '#db2777': '#db2777'
  };
  function apply() {
    text.textContent = titleInput.value || '（タイトル）';
    const c = colorMap[colorSel.value] || colorSel.value;
    bar.style.background = c;
    text.style.color = c;
  }
  titleInput.addEventListener('input', apply);
  colorSel.addEventListener('change', apply);
})();

// --- SubSectionTitle preview ---
(function(){
  const root = document.querySelector('[data-preview="subsectiontitle"]');
  if (!root) return;
  const titleInput = root.querySelector('[data-key="title"]');
  const colorSel = root.querySelector('[data-key="color"]');
  const chev = root.querySelector('[data-target="chev"]');
  const text = root.querySelector('[data-target="text"]');

  const colorMap = {
    'sky-700': '#0369a1',
    'sky-800': '#075985',
    'indigo-600': '#4f46e5',
    '#059669': '#059669'
  };
  function apply() {
    text.textContent = titleInput.value || '（サブタイトル）';
    const c = colorMap[colorSel.value] || colorSel.value;
    chev.style.color = c;
    text.style.color = c;
  }
  titleInput.addEventListener('input', apply);
  colorSel.addEventListener('change', apply);
})();

// --- Citation preview (numbered / APA switch) ---
(function(){
  const root = document.querySelector('[data-preview="citation"]');
  if (!root) return;
  const styleSel = root.querySelector('[data-key="style"]');
  const c1 = root.querySelector('[data-target="cit1"]');
  const c2 = root.querySelector('[data-target="cit2"]');

  function apply() {
    if (styleSel.value === 'apa') {
      c1.innerHTML = '(Smith, 2023)';
      c2.innerHTML = '(Jones, 2022)';
    } else {
      c1.innerHTML = '<sup>[1]</sup>';
      c2.innerHTML = '<sup>[2]</sup>';
    }
  }
  styleSel.addEventListener('change', apply);
})();

// --- AlertBox preview ---
(function(){
  const root = document.querySelector('[data-preview="alertbox"]');
  if (!root) return;
  const sel = root.querySelector('[data-key="variant"]');
  const box = root.querySelector('[data-target="box"]');
  const ico = root.querySelector('[data-target="ico"]');

  const icons = {
    warning: '☹',
    info: '💡',
    success: '✓',
    error: '✕',
    result: '🔍'
  };
  function apply() {
    box.className = 'pv-alert ' + sel.value;
    ico.textContent = icons[sel.value];
  }
  sel.addEventListener('change', apply);
})();

// --- HighlightText preview ---
(function(){
  const root = document.querySelector('[data-preview="highlight"]');
  if (!root) return;
  const sel = root.querySelector('[data-key="variant"]');
  const hl = root.querySelector('[data-target="hl"]');
  function apply() { hl.className = 'pv-hl ' + sel.value; }
  sel.addEventListener('change', apply);
})();

// --- TextColorBox preview ---
(function(){
  const root = document.querySelector('[data-preview="textcolorbox"]');
  if (!root) return;
  const t = root.querySelector('[data-key="title"]');
  const x = root.querySelector('[data-key="text"]');
  const tt = root.querySelector('[data-target="title"]');
  const xt = root.querySelector('[data-target="text"]');
  function apply() {
    tt.textContent = t.value || 'タイトル';
    xt.innerHTML = x.value || '（本文）';
  }
  t.addEventListener('input', apply);
  x.addEventListener('input', apply);
})();

// Smooth anchor scroll fix (in case of sticky offsets)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    }
  });
});
