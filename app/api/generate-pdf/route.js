import { jsPDF } from 'jspdf';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { text, name, tier = 'deep' } = await req.json();

    if (!text || !name) {
      return new Response(JSON.stringify({ error: 'Missing text or name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanText = text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*/g, '')
      .replace(/(?<!\w)\*(?!\*)/g, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^>\s+/gm, '');

    const pdfBytes = generatePDF(cleanText, name, tier);
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Eden-Guidebook-${safeName}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ---- Color scheme ----
const GOLD = [200, 185, 140];
const GOLD_LIGHT = [220, 210, 185];
const GOLD_DARK = [160, 144, 96];
const BLACK = [0, 0, 0];
const DARK_GRAY = [26, 26, 26];
const MID_GRAY = [120, 120, 120];
const LIGHT_GRAY = [153, 153, 153];
const BG_CREAM = [250, 248, 242];

// ---- Decorative Helpers ----

function drawDotDivider(doc, cx, y) {
  doc.setFillColor(...GOLD);
  doc.circle(cx - 14, y, 1.2, 'F');
  doc.circle(cx, y, 1.2, 'F');
  doc.circle(cx + 14, y, 1.2, 'F');
}

function drawO(doc, cx, cy, r, opacity = 1) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5 * opacity);
  doc.circle(cx, cy, r, 'S');
}

function drawSmallDiamond(doc, cx, cy, size) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(cx, cy - size, cx + size, cy);
  doc.line(cx + size, cy, cx, cy + size);
  doc.line(cx, cy + size, cx - size, cy);
  doc.line(cx - size, cy, cx, cy - size);
}

function drawThinRule(doc, cx, width, y) {
  doc.setDrawColor(...GOLD_LIGHT);
  doc.setLineWidth(0.3);
  const halfW = width * 0.2;
  doc.line(cx - halfW, y, cx + halfW, y);
}

function drawTriad(doc, cx, cy, size) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  // Triangle
  const top = [cx, cy - size];
  const left = [cx - size * 0.87, cy + size * 0.5];
  const right = [cx + size * 0.87, cy + size * 0.5];
  doc.line(top[0], top[1], left[0], left[1]);
  doc.line(left[0], left[1], right[0], right[1]);
  doc.line(right[0], right[1], top[0], top[1]);
  // Dots at vertices
  doc.setFillColor(...GOLD);
  doc.circle(top[0], top[1], 2, 'F');
  doc.circle(left[0], left[1], 2, 'F');
  doc.circle(right[0], right[1], 2, 'F');
}

function drawSpiral(doc, cx, cy, maxR, turns) {
  doc.setDrawColor(...GOLD_LIGHT);
  doc.setLineWidth(0.3);
  const steps = turns * 60;
  let prevX = cx, prevY = cy;
  for (let i = 1; i <= steps; i++) {
    const angle = (i / steps) * turns * 2 * Math.PI;
    const r = (i / steps) * maxR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    doc.line(prevX, prevY, x, y);
    prevX = x;
    prevY = y;
  }
}

// ---- Main PDF Generator ----

function generatePDF(text, name, tier) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 52;
  const marginRight = 52;
  const marginTop = 60;
  const marginBottom = 60;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const cx = pageWidth / 2;

  const tierLabels = {
    essential: 'Essential',
    deep: 'Deep',
    complete: 'Complete',
  };

  // ======== TITLE PAGE ========

  // Background decorative circles
  drawO(doc, cx, 340, 90);
  drawO(doc, cx, 340, 60);
  if (tier === 'complete') {
    drawO(doc, cx, 340, 35);
    drawSpiral(doc, cx, 340, 25, 3);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...LIGHT_GRAY);
  doc.text('T H E   E D E N   P R O J E C T', cx, 200, { align: 'center' });

  if (tier !== 'essential') {
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text(tierLabels[tier].toUpperCase() + '   E D I T I O N', cx, 215, { align: 'center' });
  }

  doc.setFont('times', 'normal');
  doc.setFontSize(30);
  doc.setTextColor(...BLACK);
  const titleLines = doc.splitTextToSize(`A Philosophical Guidebook for ${name}`, contentWidth - 40);
  doc.text(titleLines, cx, 348, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...MID_GRAY);
  doc.text('Written specifically for you.', cx, 440, { align: 'center' });
  doc.text('Not a template. Not a copy. Yours.', cx, 458, { align: 'center' });

  // Tier-specific decorations on title page
  if (tier === 'complete') {
    drawTriad(doc, cx, pageHeight - 120, 20);
  } else {
    drawSmallDiamond(doc, cx, pageHeight - 80, 6);
  }

  // ======== BODY PAGES ========
  doc.addPage();
  let y = marginTop;
  let pageNum = 2;
  let paragraphCount = 0;

  const sectionBreaks = [
    (d, c, yy) => drawDotDivider(d, c, yy),
    (d, c, yy) => drawSmallDiamond(d, c, yy, 5),
    (d, c, yy) => drawO(d, c, yy, 6),
    (d, c, yy) => drawThinRule(d, c, contentWidth, yy),
    (d, c, yy) => drawDotDivider(d, c, yy),
    (d, c, yy) => drawO(d, c, yy, 8),
    (d, c, yy) => drawSmallDiamond(d, c, yy, 4),
    (d, c, yy) => drawThinRule(d, c, contentWidth, yy),
  ];

  // Add more break types for Complete tier
  if (tier === 'complete') {
    sectionBreaks.push(
      (d, c, yy) => drawTriad(d, c, yy, 8),
      (d, c, yy) => drawSpiral(d, c, yy, 10, 2),
    );
  }

  let breakIndex = 0;

  function resetBodyStyle() {
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(...DARK_GRAY);
  }

  function addPageNumber(num) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(String(num), cx, pageHeight - 30, { align: 'center' });
    resetBodyStyle();
  }

  addPageNumber(pageNum);

  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const breakInterval = tier === 'complete' ? 8 : tier === 'deep' ? 10 : 12;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    paragraphCount++;

    // Section divider markers
    if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
      y += 18;
      drawDotDivider(doc, cx, y);
      y += 18;
      resetBodyStyle();
      continue;
    }

    // Periodic decorative breaks
    if (paragraphCount > 1 && paragraphCount % breakInterval === 0) {
      if (y + 50 < pageHeight - marginBottom) {
        y += 18;
        const gfx = sectionBreaks[breakIndex % sectionBreaks.length];
        gfx(doc, cx, y);
        breakIndex++;
        y += 22;
        resetBodyStyle();
      }
    }

    resetBodyStyle();

    const lines = doc.splitTextToSize(trimmed, contentWidth);
    const lineHeight = 20;

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        pageNum++;
        y = marginTop;
        addPageNumber(pageNum);
        resetBodyStyle();
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += 14;
  }

  // ======== CLOSING PAGE ========
  doc.addPage();

  // Decorative circles
  drawO(doc, cx, pageHeight / 2 - 70, 55);
  drawO(doc, cx, pageHeight / 2 - 70, 35);
  if (tier === 'complete') {
    drawO(doc, cx, pageHeight / 2 - 70, 18);
    drawSpiral(doc, cx, pageHeight / 2 - 70, 12, 2);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...LIGHT_GRAY);
  doc.text('T H E   E D E N   P R O J E C T', cx, pageHeight / 2 + 10, { align: 'center' });

  if (tier !== 'essential') {
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text(tierLabels[tier].toUpperCase() + '   E D I T I O N', cx, pageHeight / 2 + 25, { align: 'center' });
  }

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...MID_GRAY);
  doc.text('If this changed something, share it.', cx, pageHeight / 2 + 55, { align: 'center' });
  doc.text('Not this document \u2014 the idea behind it.', cx, pageHeight / 2 + 73, { align: 'center' });

  if (tier === 'complete') {
    drawTriad(doc, cx, pageHeight / 2 + 110, 12);
  } else {
    drawSmallDiamond(doc, cx, pageHeight / 2 + 105, 5);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT_GRAY);
  doc.text('danieledmondson45@gmail.com', cx, pageHeight / 2 + 145, { align: 'center' });

  // Upsell for non-Complete tiers
  if (tier !== 'complete') {
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    const upsellText = tier === 'essential'
      ? 'Go deeper. The Deep and Complete editions are waiting.'
      : 'The Complete edition explores every thread. Your full theory of everything.';
    doc.text(upsellText, cx, pageHeight / 2 + 175, { align: 'center' });
  }

  return Buffer.from(doc.output('arraybuffer'));
}
