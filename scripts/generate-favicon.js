const { createCanvas } = require('canvas');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '../public');
const APP    = path.join(__dirname, '../src/app');

async function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const r = size * 0.20; // 20% border radius

  // ── Rounded-rect clip ──────────────────────────────────────────────────────
  function roundedRect(x, y, w, h, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y,         x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h,     x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x,    y + h,      x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x,    y,          x + radius, y);
    ctx.closePath();
  }

  // ── Background ─────────────────────────────────────────────────────────────
  roundedRect(0, 0, size, size, r);
  ctx.fillStyle = '#0F172A';
  ctx.fill();

  // ── Subtle inner glow ──────────────────────────────────────────────────────
  const glow = ctx.createRadialGradient(
    size * 0.35, size * 0.35, 0,
    size * 0.5,  size * 0.5,  size * 0.65
  );
  glow.addColorStop(0, 'rgba(56,189,248,0.10)');
  glow.addColorStop(1, 'rgba(56,189,248,0)');
  roundedRect(0, 0, size, size, r);
  ctx.fillStyle = glow;
  ctx.fill();

  // ── Border ring ────────────────────────────────────────────────────────────
  const borderW = Math.max(1, size * 0.004); // ~2px at 512, scales down
  roundedRect(
    borderW / 2, borderW / 2,
    size - borderW, size - borderW,
    r - borderW / 2
  );
  ctx.strokeStyle = 'rgba(56,189,248,0.30)';
  ctx.lineWidth = borderW;
  ctx.stroke();

  // ── "UA" text ──────────────────────────────────────────────────────────────
  // Scale font to ~43% of icon size so it fits with some padding
  const fontSize = Math.round(size * 0.43);
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'left';

  // Measure "U" and "A" separately to kern them tightly
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  const uMetrics = ctx.measureText('U');
  const aMetrics = ctx.measureText('A');

  // Total text width; tighten kern by 8% of fontSize
  const kern      = fontSize * 0.08;
  const totalW    = uMetrics.width + aMetrics.width - kern;
  const startX    = (size - totalW) / 2;
  const midY      = size / 2;

  // "U" — white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('U', startX, midY);

  // "A" — accent
  ctx.fillStyle = '#38BDF8';
  ctx.fillText('A', startX + uMetrics.width - kern, midY);

  // ── Terminal cursor bar ────────────────────────────────────────────────────
  // Small rect immediately after "A", vertically centred, 60% letter height
  const cursorW = Math.max(1, Math.round(size * 0.008)); // ~4px at 512
  const cursorH = Math.round(fontSize * 0.60);
  const cursorX = startX + uMetrics.width - kern + aMetrics.width + Math.round(size * 0.012);
  const cursorY = midY - cursorH / 2;

  // Only draw cursor if it fits inside the icon
  if (cursorX + cursorW < size - size * 0.06) {
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(cursorX, cursorY, cursorW, cursorH);
  }

  return canvas.toBuffer('image/png');
}

async function run() {
  // 1. Generate master 512×512
  const master = await drawIcon(512);
  const masterPath = path.join(PUBLIC, 'favicon-512.png');
  fs.writeFileSync(masterPath, master);
  console.log(`✅ favicon-512.png  — ${(master.length / 1024).toFixed(1)} KB`);

  // 2. icon-512.png (same as master)
  fs.copyFileSync(masterPath, path.join(PUBLIC, 'icon-512.png'));
  console.log('✅ icon-512.png     — copy of master');

  // 3. icon-192.png
  const buf192 = await sharp(master).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC, 'icon-192.png'), buf192);
  console.log(`✅ icon-192.png     — ${(buf192.length / 1024).toFixed(1)} KB`);

  // 4. apple-touch-icon.png (180×180)
  const buf180 = await sharp(master).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), buf180);
  console.log(`✅ apple-touch-icon.png — ${(buf180.length / 1024).toFixed(1)} KB`);

  // 5. favicon.ico — 48×48 ICO-compatible PNG written to both locations
  const buf48 = await sharp(master).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), buf48);
  fs.writeFileSync(path.join(APP,    'favicon.ico'), buf48);
  console.log(`✅ favicon.ico      — ${(buf48.length / 1024).toFixed(1)} KB  (48×48, written to public/ and src/app/)`);

  // Verify all outputs
  console.log('\n── Verification ──────────────────────────────');
  const files = [
    'favicon-512.png', 'icon-512.png', 'icon-192.png',
    'apple-touch-icon.png', 'favicon.ico',
  ];
  files.forEach(f => {
    const p = path.join(PUBLIC, f);
    const exists = fs.existsSync(p);
    const kb = exists ? (fs.statSync(p).size / 1024).toFixed(1) + ' KB' : 'MISSING';
    console.log(`  ${exists ? '✓' : '✗'} public/${f.padEnd(24)} ${kb}`);
  });
  const appIco = path.join(APP, 'favicon.ico');
  console.log(`  ${fs.existsSync(appIco) ? '✓' : '✗'} src/app/favicon.ico          ${(fs.statSync(appIco).size / 1024).toFixed(1)} KB`);
}

run().catch(err => { console.error(err); process.exit(1); });
