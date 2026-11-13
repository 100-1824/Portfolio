/**
 * Procedural artwork generator for the portfolio.
 * Renders deterministic, on-brand cyber illustrations (SVG → WebP via sharp).
 *
 *   node scripts/generate-art.mjs
 *
 * Output: public/art/**
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'art');

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  ink: '#04060A',
  ink2: '#0A0F17',
  line: '#1B2533',
  mint: '#3DF5C4',
  blue: '#6E8BFF',
  red: '#FF5A4E',
  amber: '#FFB547',
  violet: '#A98BFF',
  white: '#E8F0F7',
};

// ── Seeded RNG ───────────────────────────────────────────────────────────────
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 100) / 100;
const MONO = "font-family=\"Menlo, 'DejaVu Sans Mono', monospace\"";
const SANS = "font-family=\"'Helvetica Neue', Helvetica, Arial, sans-serif\"";

// ── Shared building blocks ───────────────────────────────────────────────────
function defs(accent, extra = '') {
  return `
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowL" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="70%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="0.45" stop-color="${accent}" stop-opacity="0.04"/>
      <stop offset="1" stop-color="${C.ink}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.75"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${C.white}" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${C.white}" fill-opacity="0.07"/>
    </pattern>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#000" fill-opacity="0.18"/>
    </pattern>
    ${extra}
  </defs>`;
}

function background(W, H, accent, { grid = 'grid' } = {}) {
  return `
  <rect width="${W}" height="${H}" fill="${C.ink}"/>
  <rect width="${W}" height="${H}" fill="url(#bgGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#${grid})"/>`;
}

function finish(W, H, accent, label, idx) {
  const b = 28;
  const L = 34;
  const corners = [
    `M${b} ${b + L}V${b}H${b + L}`,
    `M${W - b - L} ${b}H${W - b}V${b + L}`,
    `M${b} ${H - b - L}V${H - b}H${b + L}`,
    `M${W - b - L} ${H - b}H${W - b}V${H - b - L}`,
  ];
  return `
  <rect width="${W}" height="${H}" fill="url(#scan)"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <g stroke="${accent}" stroke-opacity="0.7" stroke-width="2" fill="none">
    ${corners.map((d) => `<path d="${d}"/>`).join('')}
  </g>
  ${
    label
      ? `<g ${MONO} font-size="15" letter-spacing="2" fill="${C.white}" fill-opacity="0.55">
    <text x="${b + 14}" y="${b + 30}">${label}</text>
    <text x="${W - b - 14}" y="${H - b - 16}" text-anchor="end">${idx ?? ''}</text>
  </g>
  <circle cx="${b + 4}" cy="${b + 25}" r="0" fill="${accent}"/>`
      : ''
  }`;
}

function svg(W, H, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

async function render(file, W, H, body, { quality = 82 } = {}) {
  const out = path.join(OUT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg(W, H, body)), { density: 96 })
    .webp({ quality, effort: 6 })
    .toFile(out);
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`  ✓ ${file}  (${W}×${H}, ${kb} KB)`);
}

// ── Sphere projection helpers ────────────────────────────────────────────────
function makeProjector(cx, cy, R, rotY, tilt) {
  const cY = Math.cos(rotY), sY = Math.sin(rotY);
  const cT = Math.cos(tilt), sT = Math.sin(tilt);
  return (lat, lon, alt = 1) => {
    let x = Math.cos(lat) * Math.sin(lon) * alt;
    let y = Math.sin(lat) * alt;
    let z = Math.cos(lat) * Math.cos(lon) * alt;
    // rotate Y
    const x1 = x * cY + z * sY;
    const z1 = -x * sY + z * cY;
    // rotate X (tilt)
    const y2 = y * cT - z1 * sT;
    const z2 = y * sT + z1 * cT;
    return { x: cx + R * x1, y: cy - R * y2, z: z2 };
  };
}

function polyline(points, close = false) {
  if (!points.length) return '';
  return 'M' + points.map((p) => `${f(p.x)} ${f(p.y)}`).join('L') + (close ? 'Z' : '');
}

function segmentsByVisibility(points) {
  const front = [], back = [];
  let cur = [], vis = null;
  for (const p of points) {
    const v = p.z >= 0;
    if (vis === null) vis = v;
    if (v !== vis) {
      (vis ? front : back).push(cur);
      cur = [cur[cur.length - 1]];
      vis = v;
    }
    cur.push(p);
  }
  if (cur.length) (vis ? front : back).push(cur);
  return { front, back };
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO — wireframe threat-intel globe
// ═════════════════════════════════════════════════════════════════════════════
async function heroGlobe() {
  const W = 1400, H = 1400, cx = 700, cy = 700, R = 470;
  const r = rng(7);
  const P = makeProjector(cx, cy, R, -0.6, 0.38);
  const D = Math.PI / 180;
  let front = '', back = '';

  // latitude lines
  for (let lat = -75; lat <= 75; lat += 15) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 3) pts.push(P(lat * D, lon * D));
    const s = segmentsByVisibility(pts);
    s.front.forEach((p) => (front += `<path d="${polyline(p)}"/>`));
    s.back.forEach((p) => (back += `<path d="${polyline(p)}"/>`));
  }
  // longitude lines
  for (let lon = -180; lon < 180; lon += 15) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 3) pts.push(P(lat * D, lon * D));
    const s = segmentsByVisibility(pts);
    s.front.forEach((p) => (front += `<path d="${polyline(p)}"/>`));
    s.back.forEach((p) => (back += `<path d="${polyline(p)}"/>`));
  }

  // "landmass" dot clusters
  const clusters = Array.from({ length: 14 }, () => ({
    lat: (r() * 120 - 55) * D,
    lon: (r() * 360 - 180) * D,
    s: 8 + r() * 22,
  }));
  let dots = '';
  for (const c of clusters) {
    const n = Math.round(c.s * 9);
    for (let i = 0; i < n; i++) {
      const lat = c.lat + (r() - 0.5) * c.s * D * 1.6;
      const lon = c.lon + (r() - 0.5) * c.s * D * 2.2;
      const p = P(lat, lon);
      if (p.z < 0.02) continue;
      const o = 0.18 + p.z * 0.55;
      dots += `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(1.3 + p.z * 1.4)}" fill="${C.mint}" fill-opacity="${f(o)}"/>`;
    }
  }

  // nodes + arcs
  const nodes = Array.from({ length: 16 }, () => {
    const lat = (r() * 110 - 50) * D, lon = (r() * 360 - 180) * D;
    return { lat, lon, p: P(lat, lon) };
  }).filter((n) => n.p.z > 0.12);

  let arcs = '', nodeSvg = '';
  const toVec = (lat, lon) => [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  const toLL = (v) => {
    const l = Math.hypot(...v);
    return [Math.asin(v[1] / l), Math.atan2(v[0], v[2])];
  };
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i], b = nodes[(i * 5 + 3) % nodes.length];
    if (a === b) continue;
    const va = toVec(a.lat, a.lon), vb = toVec(b.lat, b.lon);
    const pts = [];
    for (let t = 0; t <= 1.0001; t += 0.025) {
      const v = va.map((x, k) => x * (1 - t) + vb[k] * t);
      const [lat, lon] = toLL(v);
      pts.push(P(lat, lon, 1 + 0.22 * Math.sin(Math.PI * t)));
    }
    const threat = i % 4 === 1;
    const col = threat ? C.red : i % 3 === 0 ? C.blue : C.mint;
    const d = polyline(pts);
    arcs += `<path d="${d}" stroke="${col}" stroke-opacity="0.18" stroke-width="7" filter="url(#soft)"/>`;
    arcs += `<path d="${d}" stroke="${col}" stroke-opacity="0.9" stroke-width="1.8" stroke-dasharray="${threat ? '6 7' : '0'}"/>`;
    const head = pts[Math.floor(pts.length * 0.62)];
    arcs += `<circle cx="${f(head.x)}" cy="${f(head.y)}" r="4" fill="${col}" filter="url(#glow)"/>`;
  }
  nodes.forEach((n, i) => {
    const col = i % 4 === 1 ? C.red : C.mint;
    nodeSvg += `<circle cx="${f(n.p.x)}" cy="${f(n.p.y)}" r="16" fill="none" stroke="${col}" stroke-opacity="0.35"/>`;
    nodeSvg += `<circle cx="${f(n.p.x)}" cy="${f(n.p.y)}" r="5" fill="${col}" filter="url(#glow)"/>`;
  });

  // orbit rings
  const ring = (rx, ry, rot, col, op, dash) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="1.2" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;

  // ticks on outer ring
  let ticks = '';
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const r1 = R + 70, r2 = R + (i % 10 === 0 ? 90 : 78);
    ticks += `<line x1="${f(cx + Math.cos(a) * r1)}" y1="${f(cy + Math.sin(a) * r1)}" x2="${f(cx + Math.cos(a) * r2)}" y2="${f(cy + Math.sin(a) * r2)}"/>`;
  }

  const extra = `
    <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
      <stop offset="0.80" stop-color="${C.mint}" stop-opacity="0"/>
      <stop offset="0.92" stop-color="${C.mint}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${C.mint}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sphere" cx="38%" cy="32%" r="75%">
      <stop offset="0" stop-color="#0F2A2A" stop-opacity="0.95"/>
      <stop offset="0.6" stop-color="#071214" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#03070A" stop-opacity="1"/>
    </radialGradient>`;

  const body = `
  ${defs(C.mint, extra)}
  <rect width="${W}" height="${H}" fill="${C.ink}" fill-opacity="0"/>
  <circle cx="${cx}" cy="${cy}" r="${R * 1.2}" fill="url(#atmo)"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#sphere)"/>
  <g fill="none" stroke="${C.mint}" stroke-opacity="0.07" stroke-width="1">${back}</g>
  <g fill="none" stroke="${C.mint}" stroke-opacity="0.22" stroke-width="1">${front}</g>
  ${dots}
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.mint}" stroke-opacity="0.5" stroke-width="1.5"/>
  <g fill="none" stroke-linecap="round">${arcs}</g>
  ${nodeSvg}
  ${ring(R + 40, R + 40, 0, C.white, 0.08)}
  <g stroke="${C.white}" stroke-opacity="0.18" stroke-width="1">${ticks}</g>
  ${ring(R + 130, R * 0.42, -18, C.mint, 0.25, '2 10')}
  ${ring(R + 160, R * 0.28, 24, C.blue, 0.18)}
  `;
  // transparent bg version for layering
  const out = path.join(OUT, 'hero-globe.webp');
  fs.mkdirSync(OUT, { recursive: true });
  await sharp(Buffer.from(svg(W, H, body))).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(out);
  console.log(`  ✓ hero-globe.webp (${Math.round(fs.statSync(out).size / 1024)} KB)`);
}

// ═════════════════════════════════════════════════════════════════════════════
// PROJECT COVERS — 1600×1000
// ═════════════════════════════════════════════════════════════════════════════
const PW = 1600, PH = 1000;

async function coverDIDS() {
  const r = rng(101), acc = C.mint;
  const nodes = Array.from({ length: 46 }, () => ({ x: 120 + r() * 880, y: 140 + r() * 720 }));
  let edges = '', ns = '';
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    near.forEach(({ j }) => {
      if (j < i) return;
      edges += `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(nodes[j].x)}" y2="${f(nodes[j].y)}"/>`;
    });
  });
  // intrusion path
  const pathIdx = [3, 11, 19, 7, 28];
  const ip = pathIdx.map((i) => nodes[i]);
  const intr = 'M' + ip.map((p) => `${f(p.x)} ${f(p.y)}`).join('L');
  nodes.forEach((n, i) => {
    const bad = pathIdx.includes(i);
    const col = bad ? C.red : i % 5 === 0 ? C.blue : acc;
    ns += `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${bad ? 7 : 4}" fill="${col}" ${bad ? 'filter="url(#glow)"' : `fill-opacity="${f(0.5 + r() * 0.5)}"`}/>`;
    if (bad) ns += `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="20" fill="none" stroke="${C.red}" stroke-opacity="0.5"/>`;
  });
  const blocked = ip[ip.length - 1];

  // Shield at right
  const sx = 1220, sy = 430;
  const shield = `M${sx} ${sy - 190} L${sx + 150} ${sy - 130} V${sy + 10} C${sx + 150} ${sy + 120} ${sx + 70} ${sy + 190} ${sx} ${sy + 230} C${sx - 70} ${sy + 190} ${sx - 150} ${sy + 120} ${sx - 150} ${sy + 10} V${sy - 130} Z`;
  // histogram
  let bars = '';
  for (let i = 0; i < 40; i++) {
    const h = 20 + Math.abs(Math.sin(i * 0.45) * 70) + r() * 40;
    const spike = i === 27 || i === 28;
    bars += `<rect x="${1040 + i * 9}" y="${f(900 - (spike ? h + 60 : h))}" width="5" height="${f(spike ? h + 60 : h)}" rx="1" fill="${spike ? C.red : acc}" fill-opacity="${spike ? 0.95 : 0.55}"/>`;
  }
  const body = `
  ${defs(acc, `<linearGradient id="shieldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${acc}" stop-opacity="0.35"/><stop offset="1" stop-color="${acc}" stop-opacity="0.02"/></linearGradient>`)}
  ${background(PW, PH, acc)}
  <g stroke="${acc}" stroke-opacity="0.22" stroke-width="1.2">${edges}</g>
  <path d="${intr}" fill="none" stroke="${C.red}" stroke-width="8" stroke-opacity="0.2" filter="url(#soft)"/>
  <path d="${intr}" fill="none" stroke="${C.red}" stroke-width="2.4" stroke-dasharray="10 8"/>
  ${ns}
  <g transform="translate(${f(blocked.x)} ${f(blocked.y)})">
    <rect x="18" y="-34" width="150" height="30" rx="4" fill="${C.red}" fill-opacity="0.15" stroke="${C.red}" stroke-opacity="0.6"/>
    <text x="30" y="-14" ${MONO} font-size="14" fill="${C.red}" letter-spacing="1.5">BLOCKED · DQN</text>
  </g>
  <path d="${shield}" fill="${acc}" fill-opacity="0.08" filter="url(#glowL)"/>
  <path d="${shield}" fill="url(#shieldG)" stroke="${acc}" stroke-width="3"/>
  <path d="${shield}" fill="none" stroke="${acc}" stroke-opacity="0.25" stroke-width="1" transform="translate(${sx} ${sy + 20}) scale(0.78) translate(${-sx} ${-sy - 20})"/>
  <path d="M${sx - 60} ${sy + 20} l45 45 l85 -95" fill="none" stroke="${acc}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  ${bars}
  <g ${MONO} font-size="14" fill="${C.white}" fill-opacity="0.6" letter-spacing="2">
    <text x="1040" y="935">TRAFFIC · PKT/S</text>
    <text x="1400" y="935" fill="${acc}">ACC 99.0%</text>
  </g>
  ${finish(PW, PH, acc, 'DIDS // SURICATA + CNN·LSTM + DDQN', '01')}`;
  await render('projects/dids.webp', PW, PH, body);
}

async function coverIUJ() {
  const r = rng(202), acc = C.blue;
  let cols = '';
  // editorial layout
  const page = { x: 160, y: 150, w: 820, h: 720 };
  cols += `<rect x="${page.x}" y="${page.y}" width="${page.w}" height="${page.h}" rx="14" fill="${C.ink2}" stroke="${C.white}" stroke-opacity="0.12"/>`;
  cols += `<rect x="${page.x}" y="${page.y}" width="${page.w}" height="56" rx="14" fill="${acc}" fill-opacity="0.12"/>`;
  [0, 1, 2].forEach((i) => (cols += `<circle cx="${page.x + 28 + i * 20}" cy="${page.y + 28}" r="6" fill="${C.white}" fill-opacity="0.25"/>`));
  cols += `<rect x="${page.x + 40}" y="${page.y + 96}" width="520" height="34" rx="4" fill="${C.white}" fill-opacity="0.85"/>`;
  cols += `<rect x="${page.x + 40}" y="${page.y + 142}" width="380" height="34" rx="4" fill="${C.white}" fill-opacity="0.85"/>`;
  cols += `<rect x="${page.x + 40}" y="${page.y + 200}" width="130" height="22" rx="11" fill="${acc}" fill-opacity="0.25" stroke="${acc}"/>`;
  // hero image block
  cols += `<rect x="${page.x + 40}" y="${page.y + 250}" width="460" height="260" rx="10" fill="url(#imgG)"/>`;
  for (let i = 0; i < 6; i++) cols += `<path d="M${page.x + 40 + i * 90} ${page.y + 510} l120 -260" stroke="${C.white}" stroke-opacity="0.05" stroke-width="30"/>`;
  // text columns
  for (let c = 0; c < 2; c++) {
    for (let i = 0; i < 10; i++) {
      const w = 120 + r() * 110;
      cols += `<rect x="${page.x + 540 + c * 0}" y="${page.y + 250 + i * 26 + c * 300}" width="${f(c ? w : w)}" height="8" rx="4" fill="${C.white}" fill-opacity="0.18"/>`;
    }
  }
  for (let i = 0; i < 5; i++) {
    cols += `<rect x="${page.x + 40}" y="${page.y + 540 + i * 26}" width="${f(300 + r() * 160)}" height="8" rx="4" fill="${C.white}" fill-opacity="0.16"/>`;
  }
  // photo album stack on right
  let stack = '';
  [[-10, 0.4], [6, 0.65], [0, 1]].forEach(([rot, op], i) => {
    stack += `<g transform="rotate(${rot} 1230 470)" opacity="${op}">
      <rect x="1060" y="300" width="340" height="340" rx="14" fill="${C.ink2}" stroke="${C.white}" stroke-opacity="0.18"/>
      <rect x="1080" y="320" width="300" height="240" rx="8" fill="url(#imgG${i === 2 ? '2' : ''})"/>
      <rect x="1080" y="580" width="${160 + i * 30}" height="10" rx="5" fill="${C.white}" fill-opacity="0.3"/>
    </g>`;
  });
  // aperture icon
  const ax = 1230, ay = 440;
  let aperture = `<circle cx="${ax}" cy="${ay}" r="62" fill="none" stroke="${C.white}" stroke-opacity="0.85" stroke-width="3"/>`;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    aperture += `<line x1="${f(ax + Math.cos(a) * 22)}" y1="${f(ay + Math.sin(a) * 22)}" x2="${f(ax + Math.cos(a + 1.1) * 62)}" y2="${f(ay + Math.sin(a + 1.1) * 62)}" stroke="${C.white}" stroke-opacity="0.8" stroke-width="3"/>`;
  }
  // deploy pipeline badge
  const pipe = `<g transform="translate(1060 740)">
    <rect width="340" height="110" rx="12" fill="${C.ink2}" stroke="${acc}" stroke-opacity="0.5"/>
    <text x="20" y="34" ${MONO} font-size="13" fill="${acc}" letter-spacing="2">CPANEL ⇄ GITHUB SYNC</text>
    <circle cx="40" cy="74" r="10" fill="${C.mint}"/><line x1="52" y1="74" x2="148" y2="74" stroke="${C.mint}" stroke-width="2" stroke-dasharray="6 6"/>
    <circle cx="170" cy="74" r="10" fill="${C.mint}"/><line x1="182" y1="74" x2="278" y2="74" stroke="${acc}" stroke-width="2" stroke-dasharray="6 6"/>
    <circle cx="300" cy="74" r="10" fill="none" stroke="${acc}" stroke-width="2"/>
  </g>`;
  const extra = `
   <linearGradient id="imgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${acc}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0.15"/></linearGradient>
   <linearGradient id="imgG2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B2B55"/><stop offset="1" stop-color="#0B1222"/></linearGradient>`;
  const body = `${defs(acc, extra)}${background(PW, PH, acc, { grid: 'dots' })}${cols}${stack}${aperture}${pipe}${finish(PW, PH, acc, 'IUJ // PRESS · ALBUMS · MEMBERS', '02')}`;
  await render('projects/iuj.webp', PW, PH, body);
}

async function coverLegal() {
  const r = rng(303), acc = C.violet;
  const cx = 600, cy = 520;
  let rings = '';
  [90, 180, 270, 360].forEach((rr, i) => (rings += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${acc}" stroke-opacity="${0.12 + i * 0.05}" stroke-dasharray="${i % 2 ? '3 9' : '0'}"/>`));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    rings += `<line x1="${cx}" y1="${cy}" x2="${f(cx + Math.cos(a) * 380)}" y2="${f(cy + Math.sin(a) * 380)}" stroke="${acc}" stroke-opacity="0.08"/>`;
  }
  // sweep wedge
  const a0 = -0.9, a1 = -0.25;
  const wedge = `M${cx} ${cy} L${f(cx + Math.cos(a0) * 360)} ${f(cy + Math.sin(a0) * 360)} A360 360 0 0 1 ${f(cx + Math.cos(a1) * 360)} ${f(cy + Math.sin(a1) * 360)} Z`;
  // blips
  let blips = '';
  const scores = [];
  for (let i = 0; i < 22; i++) {
    const a = r() * Math.PI * 2, d = 60 + r() * 290;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const hot = i < 4;
    const col = hot ? C.amber : acc;
    blips += `<circle cx="${f(x)}" cy="${f(y)}" r="${hot ? 7 : 3.5}" fill="${col}" ${hot ? 'filter="url(#glow)"' : 'fill-opacity="0.7"'}/>`;
    if (hot) {
      const s = (0.82 + r() * 0.17).toFixed(2);
      scores.push(s);
      blips += `<circle cx="${f(x)}" cy="${f(y)}" r="18" fill="none" stroke="${col}" stroke-opacity="0.5"/>`;
      blips += `<text x="${f(x + 24)}" y="${f(y + 5)}" ${MONO} font-size="14" fill="${col}">${s}</text>`;
    }
  }
  // lead cards right
  let cards = '';
  for (let i = 0; i < 4; i++) {
    const y = 210 + i * 150;
    cards += `<g transform="translate(1080 ${y})">
      <rect width="380" height="120" rx="12" fill="${C.ink2}" stroke="${i === 0 ? C.amber : C.white}" stroke-opacity="${i === 0 ? 0.6 : 0.12}"/>
      <rect x="20" y="22" width="${f(140 + r() * 120)}" height="12" rx="6" fill="${C.white}" fill-opacity="0.7"/>
      <rect x="20" y="48" width="${f(200 + r() * 120)}" height="8" rx="4" fill="${C.white}" fill-opacity="0.18"/>
      <rect x="20" y="66" width="${f(150 + r() * 120)}" height="8" rx="4" fill="${C.white}" fill-opacity="0.18"/>
      <rect x="20" y="92" width="250" height="6" rx="3" fill="${C.white}" fill-opacity="0.08"/>
      <rect x="20" y="92" width="${f(250 * Number(scores[i] ?? 0.6))}" height="6" rx="3" fill="${i === 0 ? C.amber : acc}"/>
      <text x="356" y="38" text-anchor="end" ${MONO} font-size="14" fill="${i === 0 ? C.amber : acc}">${scores[i] ?? '0.61'}</text>
    </g>`;
  }
  const extra = `<linearGradient id="sweep" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${acc}" stop-opacity="0"/><stop offset="1" stop-color="${acc}" stop-opacity="0.45"/></linearGradient>`;
  const body = `${defs(acc, extra)}${background(PW, PH, acc)}${rings}
  <path d="${wedge}" fill="url(#sweep)"/>
  <line x1="${cx}" y1="${cy}" x2="${f(cx + Math.cos(a1) * 360)}" y2="${f(cy + Math.sin(a1) * 360)}" stroke="${acc}" stroke-width="2.5" filter="url(#glow)"/>
  ${blips}
  <circle cx="${cx}" cy="${cy}" r="10" fill="${acc}" filter="url(#glow)"/>
  ${cards}
  ${finish(PW, PH, acc, 'LEGAL INTEL // GEMINI LEAD SCORING', '03')}`;
  await render('projects/legal-intel.webp', PW, PH, body);
}

async function coverAircraft() {
  const r = rng(404), acc = C.amber;
  // perspective grid
  const hz = 380, vx = 800;
  let grid = '';
  for (let i = -20; i <= 20; i++) {
    grid += `<line x1="${vx}" y1="${hz}" x2="${vx + i * 140}" y2="${PH + 40}" stroke="${C.white}" stroke-opacity="0.07"/>`;
  }
  for (let i = 1; i < 16; i++) {
    const y = hz + Math.pow(i / 15, 2.2) * (PH - hz + 40);
    grid += `<line x1="0" y1="${f(y)}" x2="${PW}" y2="${f(y)}" stroke="${C.white}" stroke-opacity="${f(0.03 + (i / 15) * 0.07)}"/>`;
  }
  const plane = (x, y, rot, col) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M18 0 L-12 -11 L-6 0 L-12 11 Z" fill="${col}" filter="url(#glow)"/></g>`;
  const traj = (d, col, dash) =>
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="10" stroke-opacity="0.12" filter="url(#soft)"/><path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
  const body = `${defs(acc, `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1020"/><stop offset="1" stop-color="${C.ink}"/></linearGradient>`)}
  <rect width="${PW}" height="${PH}" fill="url(#sky)"/><rect width="${PW}" height="${PH}" fill="url(#bgGlow)"/>
  ${grid}
  <line x1="0" y1="${hz}" x2="${PW}" y2="${hz}" stroke="${acc}" stroke-opacity="0.35"/>
  ${traj('M80 820 C 420 760, 620 420, 1000 300 S 1450 200, 1560 160', C.mint)}
  ${traj('M120 520 C 420 470, 760 520, 1050 420 S 1400 260, 1540 300', C.blue)}
  ${traj('M1540 860 C 1200 760, 980 520, 880 420 S 560 260, 240 220', C.red, '12 8')}
  ${plane(1000, 300, -20, C.mint)}${plane(1050, 420, -18, C.blue)}${plane(880, 420, -140, C.red)}
  <circle cx="930" cy="380" r="110" fill="${C.red}" fill-opacity="0.05" stroke="${C.red}" stroke-opacity="0.6" stroke-dasharray="4 8"/>
  <circle cx="930" cy="380" r="160" fill="none" stroke="${acc}" stroke-opacity="0.25"/>
  <g ${MONO} font-size="14" letter-spacing="1.5">
    <text x="1080" y="262" fill="${C.mint}">FRD-07 · ALT 9.2K</text>
    <text x="700" y="455" fill="${C.red}">HST-13 · CPA 1.4NM</text>
    <text x="1080" y="405" fill="${C.blue}">FRD-02</text>
    <text x="960" y="560" fill="${acc}">⚠ REROUTE</text>
  </g>
  ${finish(PW, PH, acc, 'TRAJECTORY // FRIEND · FOE · AVOID', '04')}`;
  await render('projects/aircraft-viz.webp', PW, PH, body);
}

async function coverRestaurant() {
  const r = rng(505), acc = C.amber;
  const stages = [
    { x: 160, label: 'ORDER' },
    { x: 560, label: 'KITCHEN' },
    { x: 960, label: 'SERVE' },
  ];
  let flow = '';
  stages.forEach((s, i) => {
    flow += `<g transform="translate(${s.x} 380)">
      <rect width="300" height="240" rx="18" fill="${C.ink2}" stroke="${i === 1 ? acc : C.white}" stroke-opacity="${i === 1 ? 0.7 : 0.14}"/>
      <text x="26" y="46" ${MONO} font-size="15" letter-spacing="3" fill="${i === 1 ? acc : C.white}" fill-opacity="0.85">${s.label}</text>
      ${Array.from({ length: 4 }, (_, k) => `<rect x="26" y="${78 + k * 36}" width="${f(150 + r() * 100)}" height="12" rx="6" fill="${C.white}" fill-opacity="${0.12 + (k === 0 ? 0.2 : 0)}"/><circle cx="270" cy="${84 + k * 36}" r="6" fill="${k < (i + 2) ? C.mint : C.white}" fill-opacity="${k < (i + 2) ? 0.9 : 0.15}"/>`).join('')}
    </g>`;
    if (i < 2) flow += `<path d="M${s.x + 300} 500 H${s.x + 400}" stroke="${acc}" stroke-width="3" stroke-dasharray="8 8"/><path d="M${s.x + 392} 490 l12 10 l-12 10" fill="none" stroke="${acc}" stroke-width="3"/>`;
  });
  // receipt
  let receipt = `<g transform="translate(1330 180) rotate(6)">
    <path d="M0 0 H200 V560 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 Z" fill="${C.white}" fill-opacity="0.92"/>
    <rect x="24" y="30" width="110" height="14" rx="3" fill="${C.ink}"/>`;
  for (let i = 0; i < 10; i++) receipt += `<rect x="24" y="${80 + i * 34}" width="${f(70 + r() * 50)}" height="8" rx="2" fill="${C.ink}" fill-opacity="0.45"/><rect x="146" y="${80 + i * 34}" width="30" height="8" rx="2" fill="${C.ink}" fill-opacity="0.6"/>`;
  receipt += `<line x1="24" y1="450" x2="176" y2="450" stroke="${C.ink}" stroke-dasharray="4 4"/><rect x="24" y="470" width="70" height="16" rx="3" fill="${C.ink}"/><rect x="120" y="470" width="56" height="16" rx="3" fill="${acc}"/></g>`;
  const body = `${defs(acc)}${background(PW, PH, acc, { grid: 'dots' })}${flow}${receipt}
  <g ${MONO} font-size="14" fill="${C.white}" fill-opacity="0.5" letter-spacing="2"><text x="160" y="680">ROLE-BASED AUTH · ADMIN · REPORTING</text></g>
  ${finish(PW, PH, acc, 'RESTAURANT OPS // LARAVEL', '05')}`;
  await render('projects/restaurant.webp', PW, PH, body);
}

async function coverScraper() {
  const r = rng(606), acc = '#FF7A45';
  // glyph rain
  let rain = '';
  const hex = '0123456789ABCDEF';
  for (let c = 0; c < 26; c++) {
    const x = 70 + c * 30;
    const len = 8 + Math.floor(r() * 18), start = Math.floor(r() * 10);
    for (let i = 0; i < len; i++) {
      const y = 140 + (start + i) * 28;
      if (y > 900) break;
      const op = (i / len) * 0.7;
      rain += `<text x="${x}" y="${y}" fill="${i === len - 1 ? C.white : acc}" fill-opacity="${f(i === len - 1 ? 0.9 : op)}">${hex[Math.floor(r() * 16)]}${hex[Math.floor(r() * 16)]}</text>`;
    }
  }
  // thread tree
  let tree = '';
  const tx = 940;
  const branch = (x, y, depth) => {
    if (depth > 3) return y;
    let cy = y;
    const kids = depth === 0 ? 3 : 1 + Math.floor(r() * 2);
    for (let k = 0; k < kids; k++) {
      cy += 56;
      tree += `<path d="M${x} ${y + 12} V${cy} H${x + 40}" fill="none" stroke="${C.white}" stroke-opacity="0.2"/>`;
      tree += `<circle cx="${x + 48}" cy="${cy}" r="7" fill="${depth === 0 ? acc : C.white}" fill-opacity="${depth === 0 ? 1 : 0.5}"/>`;
      tree += `<rect x="${x + 66}" y="${cy - 5}" width="${f(120 + r() * 140)}" height="10" rx="5" fill="${C.white}" fill-opacity="0.18"/>`;
      cy = branch(x + 48, cy, depth + 1);
    }
    return cy;
  };
  tree += `<circle cx="${tx}" cy="170" r="10" fill="${acc}" filter="url(#glow)"/><rect x="${tx + 22}" y="163" width="240" height="14" rx="7" fill="${C.white}" fill-opacity="0.7"/>`;
  branch(tx, 170, 0);
  // DB cylinder
  const dx = 1380, dy = 640;
  const cyl = [0, 70, 140].map((o) => `<path d="M${dx - 90} ${dy + o} v50 a90 26 0 0 0 180 0 v-50" fill="${C.ink2}" stroke="${acc}" stroke-opacity="0.7"/><ellipse cx="${dx}" cy="${dy + o}" rx="90" ry="26" fill="${C.ink2}" stroke="${acc}"/>`).reverse().join('');
  const body = `${defs(acc)}${background(PW, PH, acc)}
  <g ${MONO} font-size="18">${rain}</g>
  ${tree}
  ${cyl}
  <text x="${dx}" y="${dy + 250}" text-anchor="middle" ${MONO} font-size="14" letter-spacing="2" fill="${acc}">CSV · MONGODB</text>
  ${finish(PW, PH, acc, 'PRAW // SCRAPE → SUMMARISE → STORE', '06')}`;
  await render('projects/reddit-scraper.webp', PW, PH, body);
}


async function coverCyberHawk() {
  const r = rng(707), acc = C.red;
  // SOC dashboard: module tiles + entropy meter + flow chart
  const mods = [
    { t: 'MALWARE', s: 'RF · GBM', c: C.red, v: 0.82 },
    { t: 'RANSOMWARE', s: 'ENTROPY WATCH', c: C.amber, v: 0.64 },
    { t: 'NETWORK', s: 'SCAPY FLOWS', c: C.mint, v: 0.91 },
    { t: 'THREAT INTEL', s: 'IOC FEED', c: C.blue, v: 0.47 },
  ];
  let tiles = '';
  mods.forEach((m, i) => {
    const x = 120 + (i % 2) * 330, y = 170 + Math.floor(i / 2) * 250;
    tiles += `<g transform="translate(${x} ${y})">
      <rect width="300" height="220" rx="16" fill="${C.ink2}" stroke="${m.c}" stroke-opacity="${i === 0 ? 0.7 : 0.25}"/>
      <text x="22" y="40" ${MONO} font-size="15" letter-spacing="3" fill="${m.c}">${m.t}</text>
      <text x="22" y="64" ${MONO} font-size="12" letter-spacing="2" fill="${C.white}" fill-opacity="0.45">${m.s}</text>
      <circle cx="230" cy="140" r="44" fill="none" stroke="${C.white}" stroke-opacity="0.08" stroke-width="10"/>
      <circle cx="230" cy="140" r="44" fill="none" stroke="${m.c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${f(276 * m.v)} 276" transform="rotate(-90 230 140)" filter="url(#glow)"/>
      <text x="230" y="147" text-anchor="middle" ${MONO} font-size="18" fill="${C.white}">${Math.round(m.v * 100)}</text>
      ${Array.from({ length: 3 }, (_, k) => `<rect x="22" y="${110 + k * 24}" width="${f(70 + r() * 70)}" height="8" rx="4" fill="${C.white}" fill-opacity="0.15"/>`).join('')}
    </g>`;
  });
  // hawk-eye emblem
  const ex = 1200, ey = 330;
  const eye = `<g transform="translate(${ex} ${ey})">
    <circle r="150" fill="none" stroke="${acc}" stroke-opacity="0.18"/>
    <circle r="110" fill="none" stroke="${acc}" stroke-opacity="0.3" stroke-dasharray="4 8"/>
    <path d="M-120 0 Q0 -95 120 0 Q0 95 -120 0Z" fill="${acc}" fill-opacity="0.08" stroke="${acc}" stroke-width="4" filter="url(#glow)"/>
    <circle r="40" fill="${C.ink2}" stroke="${C.white}" stroke-width="4"/>
    <circle r="16" fill="${acc}" filter="url(#glow)"/>
  </g>`;
  // alert log
  const logs = ['BLOCK 185.220.x.x  null-route', 'QUARANTINE  invoice.exe', 'ALERT  entropy 7.92 /docs', 'FLOW  DDoS · 4.1k pps'];
  const log = logs.map((l, i) => `<text x="900" y="${600 + i * 40}" ${MONO} font-size="17" fill="${i === 0 ? acc : C.white}" fill-opacity="${i === 0 ? 1 : 0.55 - i * 0.08}">&gt; ${l}</text>`).join('');
  const body = `${defs(acc)}${background(PW, PH, acc)}${tiles}${eye}
  <rect x="870" y="560" width="600" height="190" rx="14" fill="${C.ink2}" fill-opacity="0.6" stroke="${C.white}" stroke-opacity="0.1"/>${log}
  ${finish(PW, PH, acc, 'CYBERHAWK // SOC PLATFORM', '02')}`;
  await render('projects/cyberhawk.webp', PW, PH, body);
}

async function coverTickTock() {
  const r = rng(808), acc = C.blue;
  // weekly timesheet grid
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  let grid = `<rect x="120" y="150" width="860" height="700" rx="18" fill="${C.ink2}" stroke="${C.white}" stroke-opacity="0.12"/>
    <text x="160" y="210" ${SANS} font-size="34" font-weight="700" fill="${C.white}">This week</text>
    <rect x="160" y="240" width="780" height="10" rx="5" fill="${C.white}" fill-opacity="0.08"/>
    <rect x="160" y="240" width="560" height="10" rx="5" fill="${acc}"/>
    <text x="940" y="214" text-anchor="end" ${MONO} font-size="16" fill="${acc}">28 / 40 H</text>`;
  days.forEach((d, i) => {
    const y = 300 + i * 105;
    grid += `<line x1="160" y1="${y - 18}" x2="940" y2="${y - 18}" stroke="${C.white}" stroke-opacity="0.06"/>
      <text x="160" y="${y + 28}" ${MONO} font-size="15" letter-spacing="2" fill="${C.white}" fill-opacity="0.5">${d}</text>`;
    let x = 260;
    const n = 1 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const w = 120 + r() * 160;
      if (x + w > 940) break;
      const col = [acc, C.mint, C.violet][(i + k) % 3];
      grid += `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="44" rx="10" fill="${col}" fill-opacity="0.16" stroke="${col}" stroke-opacity="0.6"/>
        <rect x="${f(x + 14)}" y="${y + 18}" width="${f(w * 0.5)}" height="8" rx="4" fill="${C.white}" fill-opacity="0.5"/>`;
      x += w + 16;
      if (x > 860) break;
    }
  });
  // test report
  let tests = `<g transform="translate(1060 230)">
    <rect width="400" height="520" rx="18" fill="${C.ink2}" stroke="${C.mint}" stroke-opacity="0.45"/>
    <text x="28" y="54" ${MONO} font-size="15" letter-spacing="2" fill="${C.mint}">JEST · RTL</text>
    <text x="28" y="140" ${SANS} font-size="92" font-weight="700" fill="${C.white}">57</text>
    <text x="30" y="178" ${MONO} font-size="15" letter-spacing="2" fill="${C.white}" fill-opacity="0.55">TESTS PASSING</text>`;
  for (let i = 0; i < 7; i++) {
    tests += `<circle cx="42" cy="${236 + i * 38}" r="9" fill="${C.mint}" fill-opacity="0.2"/><path d="M37 ${236 + i * 38} l4 4 l7 -8" fill="none" stroke="${C.mint}" stroke-width="2.5"/>
      <rect x="66" y="${231 + i * 38}" width="${f(150 + r() * 150)}" height="9" rx="4" fill="${C.white}" fill-opacity="0.2"/>`;
  }
  tests += `</g>`;
  const body = `${defs(acc)}${background(PW, PH, acc, { grid: 'dots' })}${grid}${tests}${finish(PW, PH, acc, 'TICKTOCK // NEXT.JS · NEXT-AUTH', '05')}`;
  await render('projects/ticktock.webp', PW, PH, body);
}

async function coverPOS() {
  const r = rng(909), acc = C.mint;
  // barcode
  let bars = '';
  let x = 160;
  while (x < 620) {
    const w = 2 + Math.floor(r() * 7);
    bars += `<rect x="${x}" y="200" width="${w}" height="220" fill="${C.white}" fill-opacity="0.9"/>`;
    x += w + 3 + Math.floor(r() * 6);
  }
  const scan = `<rect x="130" y="300" width="520" height="3" fill="${C.red}" filter="url(#glow)"/>`;
  // sales chart
  let chart = `<g transform="translate(760 180)"><rect width="700" height="420" rx="18" fill="${C.ink2}" stroke="${C.white}" stroke-opacity="0.12"/>
    <text x="30" y="52" ${MONO} font-size="15" letter-spacing="2" fill="${C.white}" fill-opacity="0.6">SALES · 14 DAYS</text>`;
  for (let i = 0; i < 14; i++) {
    const h = 60 + Math.abs(Math.sin(i * 0.6 + 1)) * 180 + r() * 50;
    chart += `<rect x="${40 + i * 46}" y="${f(380 - h)}" width="28" height="${f(h)}" rx="5" fill="${acc}" fill-opacity="${i === 12 ? 1 : 0.4}"/>`;
  }
  chart += `</g>`;
  // KPI cards
  const kpis = [['PRODUCTS', '1.2K'], ['TODAY', 'Rs 84K'], ['EXPENSES', 'Rs 12K']];
  let k = '';
  kpis.forEach(([l, v], i) => {
    k += `<g transform="translate(${160 + i * 440} 680)"><rect width="400" height="150" rx="16" fill="${C.ink2}" stroke="${i === 1 ? acc : C.white}" stroke-opacity="${i === 1 ? 0.6 : 0.12}"/>
      <text x="28" y="50" ${MONO} font-size="14" letter-spacing="3" fill="${C.white}" fill-opacity="0.5">${l}</text>
      <text x="28" y="112" ${SANS} font-size="48" font-weight="700" fill="${i === 1 ? acc : C.white}">${v}</text></g>`;
  });
  const body = `${defs(acc)}${background(PW, PH, acc)}<rect x="130" y="170" width="520" height="280" rx="18" fill="${C.ink2}" stroke="${C.white}" stroke-opacity="0.12"/>${bars}${scan}${chart}${k}
  ${finish(PW, PH, acc, 'UNIQUE HARDWARE // LARAVEL POS', '06')}`;
  await render('projects/pos.webp', PW, PH, body);
}

async function coverHDFS() {
  const r = rng(1010), acc = C.violet;
  const mx = 800, my = 230;
  let s = `<g transform="translate(${mx - 170} ${my - 70})"><rect width="340" height="140" rx="18" fill="${C.ink2}" stroke="${acc}" stroke-width="2" filter="url(#glow)"/>
    <text x="170" y="62" text-anchor="middle" ${MONO} font-size="18" letter-spacing="4" fill="${acc}">MASTER</text>
    <text x="170" y="96" text-anchor="middle" ${MONO} font-size="13" letter-spacing="2" fill="${C.white}" fill-opacity="0.5">METADATA · BLOCK MAP</text></g>`;
  const cols = [C.mint, C.blue, C.amber, C.red, acc];
  for (let i = 0; i < 4; i++) {
    const x = 170 + i * 340, y = 560;
    s += `<path d="M${mx} ${my + 70} C ${mx} ${my + 200}, ${x + 120} ${y - 160}, ${x + 120} ${y}" fill="none" stroke="${acc}" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="7 7"/>`;
    s += `<g transform="translate(${x} ${y})"><rect width="240" height="300" rx="16" fill="${C.ink2}" stroke="${C.white}" stroke-opacity="0.14"/>
      <text x="22" y="40" ${MONO} font-size="14" letter-spacing="3" fill="${C.white}" fill-opacity="0.7">DATANODE-0${i + 1}</text>`;
    for (let b = 0; b < 9; b++) {
      const c = cols[Math.floor(r() * cols.length)];
      s += `<rect x="${22 + (b % 3) * 68}" y="${70 + Math.floor(b / 3) * 70}" width="58" height="58" rx="8" fill="${c}" fill-opacity="${f(0.15 + r() * 0.5)}" stroke="${c}" stroke-opacity="0.6"/>`;
    }
    s += `</g>`;
  }
  const body = `${defs(acc)}${background(PW, PH, acc)}${s}${finish(PW, PH, acc, 'HDFS // DISTRIBUTED STORAGE · PYTHON', '10')}`;
  await render('projects/hdfs.webp', PW, PH, body);
}

// ═════════════════════════════════════════════════════════════════════════════
// CAPABILITY ILLUSTRATIONS — 900×600
// ═════════════════════════════════════════════════════════════════════════════
const SW = 900, SH = 600;

function emblemFrame(acc, inner, label) {
  const cx = SW / 2, cy = SH / 2 + 10;
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r1 = 200, r2 = i % 6 === 0 ? 214 : 206;
    ticks += `<line x1="${f(cx + Math.cos(a) * r1)}" y1="${f(cy + Math.sin(a) * r1)}" x2="${f(cx + Math.cos(a) * r2)}" y2="${f(cy + Math.sin(a) * r2)}"/>`;
  }
  return `${defs(acc, `<radialGradient id="core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${acc}" stop-opacity="0.22"/><stop offset="1" stop-color="${acc}" stop-opacity="0"/></radialGradient>`)}
  ${background(SW, SH, acc)}
  <circle cx="${cx}" cy="${cy}" r="230" fill="url(#core)"/>
  <circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="${acc}" stroke-opacity="0.25"/>
  <circle cx="${cx}" cy="${cy}" r="250" fill="none" stroke="${acc}" stroke-opacity="0.12" stroke-dasharray="2 8"/>
  <g stroke="${acc}" stroke-opacity="0.35">${ticks}</g>
  <g transform="translate(${cx} ${cy})">${inner}</g>
  ${finish(SW, SH, acc, label)}`;
}

const skillArt = {
  programming: [C.blue, `
    <path d="M-70 -50 L-120 0 L-70 50" fill="none" stroke="${C.blue}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
    <path d="M70 -50 L120 0 L70 50" fill="none" stroke="${C.blue}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
    <path d="M22 -70 L-22 70" stroke="${C.white}" stroke-width="12" stroke-linecap="round"/>`, 'SRC // PY · PHP · BASH'],
  cybersecurity: [C.mint, `
    <path d="M0 -120 L95 -82 V-5 C95 60 50 100 0 125 C-50 100 -95 60 -95 -5 V-82 Z" fill="${C.mint}" fill-opacity="0.12" stroke="${C.mint}" stroke-width="5" filter="url(#glow)"/>
    <circle cx="0" cy="-10" r="22" fill="none" stroke="${C.white}" stroke-width="9"/>
    <path d="M0 12 V55" stroke="${C.white}" stroke-width="10" stroke-linecap="round"/>`, 'SEC // RED · BLUE'],
  aiml: [C.violet, (() => {
    const layers = [[-120, 3], [-40, 5], [40, 5], [120, 2]];
    let s = '', pts = layers.map(([x, n]) => Array.from({ length: n }, (_, i) => ({ x, y: (i - (n - 1) / 2) * 50 })));
    for (let l = 0; l < pts.length - 1; l++) for (const a of pts[l]) for (const b of pts[l + 1]) s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${C.violet}" stroke-opacity="0.35" stroke-width="1.5"/>`;
    pts.flat().forEach((p, i) => (s += `<circle cx="${p.x}" cy="${p.y}" r="11" fill="${i % 3 === 0 ? C.white : C.violet}" filter="url(#glow)"/>`));
    return s;
  })(), 'ML // CNN · LSTM · RF'],
  devops: [C.amber, `
    <path d="M0 0 C-40 -60 -130 -60 -130 0 C-130 60 -40 60 0 0 C40 -60 130 -60 130 0 C130 60 40 60 0 0 Z" fill="none" stroke="${C.amber}" stroke-width="12" stroke-linejoin="round" filter="url(#glow)"/>
    <circle cx="-130" cy="0" r="8" fill="${C.white}"/><circle cx="130" cy="0" r="8" fill="${C.white}"/>
    ${[-60, 0, 60].map((x, i) => `<rect x="${x - 22}" y="${92}" width="44" height="34" rx="5" fill="${C.ink2}" stroke="${i === 1 ? C.amber : C.white}" stroke-opacity="${i === 1 ? 1 : 0.4}" stroke-width="2"/>`).join('')}`, 'OPS // CI · K8S · TF'],
  webdev: [C.mint, `
    <rect x="-150" y="-100" width="300" height="200" rx="14" fill="${C.ink2}" stroke="${C.mint}" stroke-width="4" filter="url(#glow)"/>
    <line x1="-150" y1="-64" x2="150" y2="-64" stroke="${C.mint}" stroke-opacity="0.6" stroke-width="2"/>
    ${[0, 1, 2].map((i) => `<circle cx="${-128 + i * 18}" cy="-82" r="5" fill="${C.white}" fill-opacity="0.5"/>`).join('')}
    <rect x="-126" y="-40" width="120" height="110" rx="8" fill="${C.mint}" fill-opacity="0.18"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="10" y="${-36 + i * 26}" width="${110 - i * 18}" height="10" rx="5" fill="${C.white}" fill-opacity="0.35"/>`).join('')}`, 'WEB // API · FULL-STACK'],
  databases: [C.blue, [60, 0, -60].map((o, i) => `
    <path d="M-110 ${o - 10} v40 a110 30 0 0 0 220 0 v-40" fill="${C.ink2}" stroke="${C.blue}" stroke-width="4"/>
    <ellipse cx="0" cy="${o - 10}" rx="110" ry="30" fill="${C.ink2}" stroke="${i === 2 ? C.white : C.blue}" stroke-width="4" ${i === 2 ? 'filter="url(#glow)"' : ''}/>`).join(''), 'DATA // MONGO · MYSQL'],
};

async function skills() {
  for (const [id, [acc, inner, label]] of Object.entries(skillArt)) {
    await render(`skills/${id}.webp`, SW, SH, emblemFrame(acc, inner, label));
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// CREDENTIAL BADGES — 640×640
// ═════════════════════════════════════════════════════════════════════════════
async function badge(file, acc, glyph, top, bottom) {
  const W = 640, cx = 320, cy = 320;
  const hex = (rr) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
    }).join(' L');
  const extra = `<linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${acc}" stop-opacity="0.35"/><stop offset="1" stop-color="${acc}" stop-opacity="0.04"/></linearGradient>`;
  const body = `${defs(acc, extra)}${background(W, W, acc)}
  <path d="M${hex(250)}Z" fill="${acc}" fill-opacity="0.1" filter="url(#glowL)"/>
  <path d="M${hex(240)}Z" fill="url(#bg2)" stroke="${acc}" stroke-width="4"/>
  <path d="M${hex(212)}Z" fill="none" stroke="${acc}" stroke-opacity="0.35" stroke-dasharray="3 7"/>
  <g transform="translate(${cx} ${cy - 20})">${glyph}</g>
  <text x="${cx}" y="${cy + 120}" text-anchor="middle" ${MONO} font-size="20" letter-spacing="5" fill="${C.white}" fill-opacity="0.9">${top}</text>
  <text x="${cx}" y="${cy + 150}" text-anchor="middle" ${MONO} font-size="14" letter-spacing="4" fill="${acc}">${bottom}</text>
  ${finish(W, W, acc, '')}`;
  await render(file, W, W, body);
}

async function certs() {
  await badge(
    'certs/google-cybersec.webp',
    C.mint,
    `<path d="M0 -90 L70 -62 V-5 C70 45 35 75 0 92 C-35 75 -70 45 -70 -5 V-62 Z" fill="${C.ink2}" stroke="${C.mint}" stroke-width="6" filter="url(#glow)"/>
     <path d="M-30 0 l22 22 l40 -46" fill="none" stroke="${C.white}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
    'CYBERSECURITY',
    'PROFESSIONAL CERT'
  );
  await badge(
    'certs/cap.webp',
    C.blue,
    `<rect x="-60" y="-30" width="120" height="100" rx="14" fill="${C.ink2}" stroke="${C.blue}" stroke-width="6" filter="url(#glow)"/>
     <path d="M-36 -30 V-58 A36 36 0 0 1 36 -58 V-30" fill="none" stroke="${C.blue}" stroke-width="8"/>
     <path d="M-24 8 L-38 22 L-24 36 M24 8 L38 22 L24 36" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    'APPSEC',
    'CERTIFIED PRACTITIONER'
  );
  await badge(
    'certs/isc2-cc.webp',
    C.violet,
    `<circle cx="0" cy="0" r="78" fill="${C.ink2}" stroke="${C.violet}" stroke-width="6" filter="url(#glow)"/>
     <circle cx="0" cy="0" r="56" fill="none" stroke="${C.violet}" stroke-opacity="0.4" stroke-dasharray="4 6"/>
     <text x="0" y="16" text-anchor="middle" ${SANS} font-size="48" font-weight="700" fill="${C.white}" letter-spacing="2">CC</text>`,
    'ISC2 CERTIFIED',
    'IN CYBERSECURITY'
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTACT — secure channel / fingerprint lock (1200×1200)
// ═════════════════════════════════════════════════════════════════════════════
async function contactArt() {
  const W = 1200, cx = 600, cy = 600, acc = C.mint;
  const r = rng(909);
  let arcs = '';
  for (let i = 0; i < 16; i++) {
    const rr = 70 + i * 24;
    const gaps = 1 + Math.floor(r() * 3);
    let a = r() * Math.PI * 2;
    for (let g = 0; g < gaps; g++) {
      const len = (Math.PI * 2) / gaps - 0.3 - r() * 0.6;
      const a2 = a + len;
      const p1 = [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr], p2 = [cx + Math.cos(a2) * rr, cy + Math.sin(a2) * rr];
      arcs += `<path d="M${f(p1[0])} ${f(p1[1])} A${rr} ${rr} 0 ${len > Math.PI ? 1 : 0} 1 ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="${i % 5 === 0 ? C.blue : acc}" stroke-opacity="${f(0.15 + (1 - i / 16) * 0.55)}" stroke-width="${i % 4 === 0 ? 4 : 2}" stroke-linecap="round"/>`;
      a = a2 + 0.3 + r() * 0.6;
    }
  }
  const body = `${defs(acc)}<rect width="${W}" height="${W}" fill="${C.ink}" fill-opacity="0"/>
  <circle cx="${cx}" cy="${cy}" r="480" fill="url(#bgGlow)"/>
  ${arcs}
  <rect x="${cx - 46}" y="${cy - 10}" width="92" height="76" rx="12" fill="${C.ink2}" stroke="${acc}" stroke-width="5" filter="url(#glow)"/>
  <path d="M${cx - 28} ${cy - 10} V${cy - 34} A28 28 0 0 1 ${cx + 28} ${cy - 34} V${cy - 10}" fill="none" stroke="${acc}" stroke-width="6"/>
  <circle cx="${cx}" cy="${cy + 24}" r="8" fill="${C.white}"/>`;
  const out = path.join(OUT, 'contact-lock.webp');
  await sharp(Buffer.from(svg(W, W, body))).webp({ quality: 82, alphaQuality: 90 }).toFile(out);
  console.log(`  ✓ contact-lock.webp (${Math.round(fs.statSync(out).size / 1024)} KB)`);
}

// ═════════════════════════════════════════════════════════════════════════════
// PORTRAIT — web-optimised + mono variant
// ═════════════════════════════════════════════════════════════════════════════
async function portrait() {
  const src = path.join(ROOT, 'public', 'images', 'profile.jpeg');
  await sharp(src).resize({ width: 760, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(OUT, 'profile-formal.webp'));
  await sharp(src)
    .resize({ width: 760, withoutEnlargement: true })
    .grayscale()
    .linear(1.18, -18)
    .tint({ r: 70, g: 245, b: 196 })
    .webp({ quality: 84 })
    .toFile(path.join(OUT, 'profile-formal-mono.webp'));
  console.log('  ✓ profile-formal.webp, profile-formal-mono.webp');
}

// ═════════════════════════════════════════════════════════════════════════════
// OG IMAGE — 1200×630
// ═════════════════════════════════════════════════════════════════════════════
async function ogImage() {
  const W = 1200, H = 630, acc = C.mint;
  const globe = await sharp(path.join(OUT, 'hero-globe.webp'))
    .resize(760)
    .extract({ left: 0, top: 65, width: 560, height: 630 })
    .png()
    .toBuffer();
  const body = `${defs(acc)}${background(W, H, acc)}
  <g ${MONO} font-size="18" letter-spacing="4" fill="${acc}"><text x="80" y="170">● SECURITY ENGINEER</text></g>
  <text x="80" y="270" ${SANS} font-size="84" font-weight="700" fill="${C.white}" letter-spacing="-2">Umair Ahmad</text>
  <text x="80" y="340" ${SANS} font-size="34" fill="${C.white}" fill-opacity="0.6">Cybersecurity · AI/ML · Full-Stack</text>
  <g ${MONO} font-size="16" letter-spacing="3" fill="${C.white}" fill-opacity="0.5"><text x="80" y="500">ISLAMABAD, PK  ·  DIDS · 99% DETECTION</text></g>
  ${finish(W, H, acc, '')}`;
  const base = await sharp(Buffer.from(svg(W, H, body))).png().toBuffer();
  await sharp(base)
    .composite([{ input: globe, left: 640, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, 'public', 'og-image.png'));
  console.log('  ✓ og-image.png');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('Generating artwork →', path.relative(ROOT, OUT));
await heroGlobe();
await Promise.all([coverDIDS(), coverIUJ(), coverLegal(), coverAircraft(), coverRestaurant(), coverScraper()]);
await Promise.all([coverCyberHawk(), coverTickTock(), coverPOS(), coverHDFS()]);
await skills();
await certs();
await contactArt();
await portrait();
await ogImage();
console.log('Done.');
