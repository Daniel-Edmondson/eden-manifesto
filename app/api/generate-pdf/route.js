import { jsPDF } from 'jspdf';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { text, name } = await req.json();

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

    const pdfBytes = generatePDF(cleanText, name);
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Eden-${safeName}.pdf"`,
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

// ======== DESIGN SYSTEM ========

// Colors — dark, gold, cream
const MIDNIGHT = [13, 17, 23];
const MIDNIGHT_LIGHT = [22, 27, 34];
const DARK_BG = [16, 20, 26];
const CREAM = [245, 240, 232];
const CREAM_DIM = [200, 192, 176];
const CREAM_FAINT = [140, 130, 115];
const GOLD = [201, 162, 39];
const GOLD_LIGHT = [228, 200, 92];
const GOLD_MUTED = [168, 137, 42];
const GOLD_DIM = [120, 98, 35];
const WHITE = [255, 255, 255];

// ======== DECORATIVE HELPERS ========

function drawGoldO(doc, cx, cy, r, opacity = 1) {
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(0.8 * opacity);
  doc.circle(cx, cy, r, 'S');
}

function drawGoldODouble(doc, cx, cy, r1, r2) {
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, r1, 'S');
  doc.setDrawColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r2, 'S');
}

function drawGoldOTriple(doc, cx, cy, r1, r2, r3) {
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(1);
  doc.circle(cx, cy, r1, 'S');
  doc.setDrawColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r2, 'S');
  doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.setLineWidth(0.3);
  doc.circle(cx, cy, r3, 'S');
}

function drawTriad(doc, cx, cy, size) {
  const h = size * Math.sqrt(3) / 2;
  doc.setDrawColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.setLineWidth(0.3);
  // Triangle
  doc.line(cx, cy - h * 0.6, cx - size / 2, cy + h * 0.4);
  doc.line(cx - size / 2, cy + h * 0.4, cx + size / 2, cy + h * 0.4);
  doc.line(cx + size / 2, cy + h * 0.4, cx, cy - h * 0.6);
  // Dots
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.circle(cx, cy - h * 0.6, 2, 'F');
  doc.setFillColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.circle(cx - size / 2, cy + h * 0.4, 1.5, 'F');
  doc.setFillColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
  doc.circle(cx + size / 2, cy + h * 0.4, 1.5, 'F');
}

function drawDotDivider(doc, cx, y) {
  doc.setFillColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.circle(cx - 12, y, 1, 'F');
  doc.circle(cx, y, 1, 'F');
  doc.circle(cx + 12, y, 1, 'F');
}

function drawGoldRule(doc, cx, width, y) {
  const halfW = width * 0.2;
  // Gradient-like rule: thin line with gold
  doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.setLineWidth(0.3);
  doc.line(cx - halfW, y, cx + halfW, y);
  // Center diamond
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  const d = 2;
  doc.line(cx, y - d, cx + d, y);
  doc.line(cx + d, y, cx, y + d);
  doc.line(cx, y + d, cx - d, y);
  doc.line(cx - d, y, cx, y - d);
}

function drawCornerAccents(doc, x, y, w, h) {
  const len = 15;
  doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.setLineWidth(0.3);
  // Top-left
  doc.line(x, y, x + len, y);
  doc.line(x, y, x, y + len);
  // Top-right
  doc.line(x + w, y, x + w - len, y);
  doc.line(x + w, y, x + w, y + len);
  // Bottom-left
  doc.line(x, y + h, x + len, y + h);
  doc.line(x, y + h, x, y + h - len);
  // Bottom-right
  doc.line(x + w, y + h, x + w - len, y + h);
  doc.line(x + w, y + h, x + w, y + h - len);
}

function drawPageBorder(doc, pageWidth, pageHeight) {
  // Subtle inner border
  const inset = 36;
  doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.setLineWidth(0.2);
  doc.rect(inset, inset, pageWidth - 2 * inset, pageHeight - 2 * inset);
  // Corner accents
  drawCornerAccents(doc, inset + 4, inset + 4, pageWidth - 2 * inset - 8, pageHeight - 2 * inset - 8);
}

function drawSacredGeometrySubtle(doc, cx, cy, r) {
  doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.setLineWidth(0.15);
  // Six circles in flower pattern
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    doc.circle(x, y, r, 'S');
  }
  doc.circle(cx, cy, r, 'S');
}

// ======== MAIN PDF GENERATOR ========

function generatePDF(text, name) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 72;
  const marginRight = 72;
  const marginTop = 72;
  const marginBottom = 72;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const cx = pageWidth / 2;

  // ======== TITLE PAGE ========
  // Dark background
  doc.setFillColor(MIDNIGHT[0], MIDNIGHT[1], MIDNIGHT[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Page border
  drawPageBorder(doc, pageWidth, pageHeight);

  // Sacred geometry behind the O (very subtle)
  drawSacredGeometrySubtle(doc, cx, 260, 60);

  // Triple O symbol
  drawGoldOTriple(doc, cx, 260, 55, 38, 22);

  // Center dot
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.circle(cx, 260, 2, 'F');

  // "THE EDEN PROJECT"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.text('T H E   E D E N   P R O J E C T', cx, 170, { align: 'center' });

  // Decorative rule under header
  drawGoldRule(doc, cx, contentWidth, 182);

  // Title
  doc.setFont('times', 'normal');
  doc.setFontSize(30);
  doc.setTextColor(CREAM[0], CREAM[1], CREAM[2]);
  const titleLines = doc.splitTextToSize(`A Philosophical Document`, contentWidth - 40);
  doc.text(titleLines, cx, 350, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(24);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text(`for ${name}`, cx, 385, { align: 'center' });

  // Subtitle
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(CREAM_FAINT[0], CREAM_FAINT[1], CREAM_FAINT[2]);
  doc.text('Written for you. Not a template. Not a summary.', cx, 430, { align: 'center' });
  doc.text('A conversation between your words, a framework, and the landscape of human thought.', cx, 446, { align: 'center' });

  // Triad at bottom of title page
  drawTriad(doc, cx, pageHeight - 130, 60);

  // Triad labels
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.text('BEING', cx, pageHeight - 130 - 60 * Math.sqrt(3) / 2 * 0.6 - 8, { align: 'center' });
  doc.text('PARADOX', cx - 30 - 8, pageHeight - 130 + 60 * Math.sqrt(3) / 2 * 0.4 + 12, { align: 'center' });
  doc.text('TRANSCENDENCE', cx + 30 + 8, pageHeight - 130 + 60 * Math.sqrt(3) / 2 * 0.4 + 12, { align: 'center' });

  // ======== EPIGRAPH PAGE ========
  doc.addPage();
  doc.setFillColor(MIDNIGHT[0], MIDNIGHT[1], MIDNIGHT[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  drawPageBorder(doc, pageWidth, pageHeight);

  // Epigraph
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(CREAM_DIM[0], CREAM_DIM[1], CREAM_DIM[2]);
  const epigraph = '"The Kingdom of Heaven is within you."';
  doc.text(epigraph, cx, pageHeight / 2 - 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.text('Luke 17:21', cx, pageHeight / 2 + 10, { align: 'center' });

  drawGoldO(doc, cx, pageHeight / 2 + 50, 8, 0.5);

  // ======== BODY PAGES ========
  doc.addPage();
  doc.setFillColor(MIDNIGHT[0], MIDNIGHT[1], MIDNIGHT[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  let y = marginTop;
  let pageNum = 3;
  let paragraphCount = 0;

  const breakOptions = [
    (d, c, yy) => drawDotDivider(d, c, yy),
    (d, c, yy) => drawGoldRule(d, c, contentWidth, yy),
    (d, c, yy) => drawGoldO(d, c, yy, 5, 0.5),
    (d, c, yy) => drawTriad(d, c, yy, 20),
  ];
  let breakIdx = 0;

  function resetStyle() {
    doc.setFont('times', 'normal');
    doc.setFontSize(12.5);
    doc.setTextColor(CREAM_DIM[0], CREAM_DIM[1], CREAM_DIM[2]);
  }

  function addPageFooter(num) {
    // Page number in gold
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.text(String(num), cx, pageHeight - 30, { align: 'center' });

    // Subtle corner marks on each page
    doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.setLineWidth(0.15);
    // Bottom center O
    doc.circle(cx, pageHeight - 40, 3, 'S');

    resetStyle();
  }

  function newPage() {
    doc.addPage();
    doc.setFillColor(MIDNIGHT[0], MIDNIGHT[1], MIDNIGHT[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    pageNum++;
    y = marginTop;
    addPageFooter(pageNum);
    resetStyle();
  }

  addPageFooter(pageNum);

  const paragraphs = text.split('\n\n').filter(p => p.trim());

  // Detect potential pull quotes (short, punchy paragraphs)
  function isPullQuote(para) {
    const words = para.trim().split(/\s+/).length;
    return words >= 5 && words <= 30 && !para.includes('---') && !para.includes('***');
  }

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const trimmed = paragraphs[pIdx].trim();
    if (!trimmed) continue;
    paragraphCount++;

    // Section divider markers
    if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
      y += 16;
      drawDotDivider(doc, cx, y);
      y += 16;
      resetStyle();
      continue;
    }

    // Periodic decorative breaks between sections
    if (paragraphCount > 1 && paragraphCount % 8 === 0) {
      if (y + 50 < pageHeight - marginBottom) {
        y += 18;
        const gfx = breakOptions[breakIdx % breakOptions.length];
        gfx(doc, cx, y);
        breakIdx++;
        y += 22;
        resetStyle();
      }
    }

    // Pull quote treatment for short impactful paragraphs (every ~12 paragraphs)
    if (paragraphCount > 3 && paragraphCount % 12 === 0 && isPullQuote(trimmed)) {
      if (y + 80 < pageHeight - marginBottom) {
        y += 20;

        // Gold accent lines
        doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
        doc.setLineWidth(0.3);
        doc.line(marginLeft + 20, y, pageWidth - marginRight - 20, y);

        y += 20;

        doc.setFont('times', 'italic');
        doc.setFontSize(15);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        const pullLines = doc.splitTextToSize(trimmed, contentWidth - 60);
        for (const line of pullLines) {
          if (y > pageHeight - marginBottom) { newPage(); }
          doc.text(line, cx, y, { align: 'center' });
          y += 22;
        }

        y += 8;
        doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
        doc.setLineWidth(0.3);
        doc.line(marginLeft + 20, y, pageWidth - marginRight - 20, y);

        y += 20;
        resetStyle();
        continue;
      }
    }

    resetStyle();

    const lines = doc.splitTextToSize(trimmed, contentWidth);
    const lineHeight = 19;

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        newPage();
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += 13;
  }

  // ======== CLOSING PAGE ========
  doc.addPage();
  doc.setFillColor(MIDNIGHT[0], MIDNIGHT[1], MIDNIGHT[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  drawPageBorder(doc, pageWidth, pageHeight);

  // Sacred geometry
  drawSacredGeometrySubtle(doc, cx, pageHeight / 2 - 40, 40);

  // Triple O
  drawGoldOTriple(doc, cx, pageHeight / 2 - 40, 35, 22, 12);

  // Center dot
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.circle(cx, pageHeight / 2 - 40, 1.5, 'F');

  // Header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GOLD_MUTED[0], GOLD_MUTED[1], GOLD_MUTED[2]);
  doc.text('T H E   E D E N   P R O J E C T', cx, pageHeight / 2 + 20, { align: 'center' });

  // Closing line
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(CREAM_DIM[0], CREAM_DIM[1], CREAM_DIM[2]);
  doc.text('You are already what you are looking for.', cx, pageHeight / 2 + 50, { align: 'center' });

  // Rule
  drawGoldRule(doc, cx, contentWidth, pageHeight / 2 + 70);

  // Contact
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(CREAM_FAINT[0], CREAM_FAINT[1], CREAM_FAINT[2]);
  doc.text('If this changed something, share it.', cx, pageHeight / 2 + 95, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
  doc.text('danieledmondson45@gmail.com', cx, pageHeight / 2 + 115, { align: 'center' });

  // Bottom triad
  drawTriad(doc, cx, pageHeight - 100, 30);

  return Buffer.from(doc.output('arraybuffer'));
}
