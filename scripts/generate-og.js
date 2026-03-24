const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1200;
const H = 630;

async function generate() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── Background gradient (left #0F172A → right #1E293B) ──────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
  bgGrad.addColorStop(0, '#0F172A');
  bgGrad.addColorStop(1, '#1E293B');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Dot grid overlay ─────────────────────────────────────────────────────────
  const dotSpacing = 40;
  ctx.fillStyle = 'rgba(148, 163, 184, 0.05)';
  for (let x = dotSpacing / 2; x < W; x += dotSpacing) {
    for (let y = dotSpacing / 2; y < H; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Background orbs ──────────────────────────────────────────────────────────
  function drawOrb(cx, cy, r, color, alpha) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sky-blue orb — top-left area
  drawOrb(200, 180, 280, 'rgb(56,189,248)', 0.15);
  // Emerald orb — bottom-right
  drawOrb(1000, 480, 240, 'rgb(16,185,129)', 0.12);
  // Violet orb — center-right
  drawOrb(850, 200, 200, 'rgb(139,92,246)', 0.10);

  // ── LEFT SIDE: profile photo ──────────────────────────────────────────────────
  const photoX = 200;      // center X of circle
  const photoY = H / 2;    // center Y
  const photoR = 140;      // radius (280px diameter)

  // Glow behind photo
  const glowGrad = ctx.createRadialGradient(photoX, photoY, photoR * 0.5, photoX, photoY, photoR * 1.5);
  glowGrad.addColorStop(0, 'rgba(56,189,248,0.20)');
  glowGrad.addColorStop(1, 'rgba(56,189,248,0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Load & clip photo into circle
  try {
    const imgPath = path.join(__dirname, '../public/images/profile.jpeg');
    const img = await loadImage(imgPath);

    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.clip();

    // Draw image centered in circle
    const size = photoR * 2;
    ctx.drawImage(img, photoX - photoR, photoY - photoR, size, size);
    ctx.restore();
  } catch (e) {
    // Fallback: initials avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    const avatarGrad = ctx.createLinearGradient(photoX - photoR, photoY - photoR, photoX + photoR, photoY + photoR);
    avatarGrad.addColorStop(0, '#38BDF8');
    avatarGrad.addColorStop(1, '#10B981');
    ctx.fillStyle = avatarGrad;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('UA', photoX, photoY);
  }

  // Accent border ring around circle
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR + 4, 0, Math.PI * 2);
  ctx.stroke();

  // ── RIGHT SIDE: text ──────────────────────────────────────────────────────────
  const textX = 420;   // left edge of text block
  const maxW = W - textX - 60;

  // Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Umair Ahmad', textX, 210);

  // Tagline
  ctx.fillStyle = '#38BDF8';
  ctx.font = '22px Arial';
  ctx.fillText('Cybersecurity  •  AI/ML  •  Full-Stack  •  DevOps', textX, 265);

  // One-liner
  ctx.fillStyle = '#94A3B8';
  ctx.font = '18px Arial';
  ctx.fillText('Building secure, intelligent systems from code to cloud', textX, 310);

  // Divider line
  ctx.strokeStyle = 'rgba(56,189,248,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(textX, 345);
  ctx.lineTo(W - 60, 345);
  ctx.stroke();

  // Education / current role badges
  const badgeY = 385;
  function drawBadge(label, value, bx, color) {
    ctx.fillStyle = `${color}18`;
    const bw = 260;
    const bh = 56;
    roundRect(ctx, bx, badgeY, bw, bh, 10);
    ctx.fill();

    ctx.strokeStyle = `${color}50`;
    ctx.lineWidth = 1;
    roundRect(ctx, bx, badgeY, bw, bh, 10);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label.toUpperCase(), bx + 14, badgeY + 20);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '13px Arial';
    ctx.fillText(value, bx + 14, badgeY + 40);
  }

  drawBadge('Current Role', 'Web Hosting Eng. @ CIS', textX, '#38BDF8');
  drawBadge('Education', 'BS SE · COMSATS Wah', textX + 278, '#10B981');

  // Social line
  ctx.fillStyle = '#64748B';
  ctx.font = '14px "Courier New"';
  ctx.textAlign = 'left';
  ctx.fillText('github.com/100-1824  •  linkedin.com/in/umair1824  •  18umair24@gmail.com', textX, 490);

  // Location
  ctx.fillStyle = '#475569';
  ctx.font = '13px Arial';
  ctx.fillText('📍 Islamabad, Pakistan', textX, 520);

  // ── Bottom accent bar ────────────────────────────────────────────────────────
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, '#38BDF8');
  barGrad.addColorStop(0.5, '#10B981');
  barGrad.addColorStop(1, '#8B5CF6');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, H - 4, W, 4);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const outPath = path.join(__dirname, '../public/og-image.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);

  const size = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`✅ og-image.png saved — ${size} KB`);
}

// Helper: rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

generate().catch(console.error);
