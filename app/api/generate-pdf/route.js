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

// ======== DESIGN SYSTEM — Clean White ========

const WHITE = [255, 255, 255];
const INK = [29, 29, 31];               // #1d1d1f
const INK_SECONDARY = [110, 110, 115];  // #6e6e73
const INK_TERTIARY = [134, 134, 139];   // #86868b
const INK_FAINT = [210, 210, 215];      // #d2d2d7
const SURFACE = [245, 245, 247];        // #f5f5f7

// ======== DECORATIVE HELPERS ========

function drawO(doc, cx, cy, r, opacity = 1) {
  doc.setDrawColor(INK[0], INK[1], INK[2]);
  doc.setLineWidth(0.6 * opacity);
  doc.circle(cx, cy, r, 'S');
}

function drawODouble(doc, cx, cy, r1, r2) {
  doc.setDrawColor(INK[0], INK[1], INK[2]);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, r1, 'S');
  doc.setDrawColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r2, 'S');
}

function drawOTriple(doc, cx, cy, r1, r2, r3) {
  doc.setDrawColor(INK[0], INK[1], INK[2]);
  doc.setLineWidth(1);
  doc.circle(cx, cy, r1, 'S');
  doc.setDrawColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r2, 'S');
  doc.setDrawColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
  doc.setLineWidth(0.3);
  doc.circle(cx, cy, r3, 'S');
}

function drawTriad(doc, cx, cy, size) {
  const h = size * Math.sqrt(3) / 2;
  doc.setDrawColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
  doc.setLineWidth(0.3);
  doc.line(cx, cy - h * 0.6, cx - size / 2, cy + h * 0.4);
  doc.line(cx - size / 2, cy + h * 0.4, cx + size / 2, cy + h * 0.4);
  doc.line(cx + size / 2, cy + h * 0.4, cx, cy - h * 0.6);
  // Dots
  doc.setFillColor(INK[0], INK[1], INK[2]);
  doc.circle(cx, cy - h * 0.6, 2, 'F');
  doc.setFillColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
  doc.circle(cx - size / 2, cy + h * 0.4, 1.5, 'F');
  doc.circle(cx + size / 2, cy + h * 0.4, 1.5, 'F');
}

function drawDotDivider(doc, cx, y) {
  doc.setFillColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
  doc.circle(cx - 12, y, 0.8, 'F');
  doc.circle(cx, y, 0.8, 'F');
  doc.circle(cx + 12, y, 0.8, 'F');
}

function drawThinRule(doc, cx, width, y) {
  const halfW = width * 0.15;
  doc.setDrawColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
  doc.setLineWidth(0.3);
  doc.line(cx - halfW, y, cx + halfW, y);
}

// ======== MAIN PDF GENERATOR ========

function generatePDF(text, name) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 64;
  const marginRight = 64;
  const marginTop = 64;
  const marginBottom = 64;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const cx = pageWidth / 2;

  // ======== TITLE PAGE ========
  // Clean white background (default)

  // Triple O symbol
  drawOTriple(doc, cx, 240, 55, 38, 22);

  // Center dot
  doc.setFillColor(INK[0], INK[1], INK[2]);
  doc.circle(cx, 240, 2, 'F');

  // "THE EDEN PROJECT"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  doc.text('T H E   E D E N   P R O J E C T', cx, 160, { align: 'center' });

  // Thin rule under header
  drawThinRule(doc, cx, contentWidth, 172);

  // Title
  doc.setFont('times', 'normal');
  doc.setFontSize(32);
  doc.setTextColor(INK[0], INK[1], INK[2]);
  doc.text('A Philosophical Document', cx, 340, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(24);
  doc.setTextColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
  doc.text(`for ${name}`, cx, 378, { align: 'center' });

  // Subtitle
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  doc.text('Written for you. Not a template. Not a summary.', cx, 425, { align: 'center' });
  doc.text('A conversation between your words, a framework, and the landscape of human thought.', cx, 441, { align: 'center' });

  // Triad at bottom of title page
  drawTriad(doc, cx, pageHeight - 130, 50);

  // Triad labels
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  const triadH = 50 * Math.sqrt(3) / 2;
  doc.text('BEING', cx, pageHeight - 130 - triadH * 0.6 - 8, { align: 'center' });
  doc.text('PARADOX', cx - 25 - 8, pageHeight - 130 + triadH * 0.4 + 12, { align: 'center' });
  doc.text('TRANSCENDENCE', cx + 25 + 8, pageHeight - 130 + triadH * 0.4 + 12, { align: 'center' });

  // ======== EPIGRAPH PAGE ========
  doc.addPage();

  // Epigraph
  doc.setFont('times', 'italic');
  doc.setFontSize(16);
  doc.setTextColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
  doc.text('"The Kingdom of Heaven is within you."', cx, pageHeight / 2 - 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  doc.text('Luke 17:21', cx, pageHeight / 2 + 10, { align: 'center' });

  drawO(doc, cx, pageHeight / 2 + 50, 8, 0.3);

  // ======== BODY PAGES ========
  doc.addPage();

  let y = marginTop;
  let pageNum = 3;
  let paragraphCount = 0;

  // Body text: 16pt for iPhone readability (was 12.5pt)
  const bodyFontSize = 16;
  const lineHeight = 24;
  const paragraphSpacing = 16;

  const breakOptions = [
    (d, c, yy) => drawDotDivider(d, c, yy),
    (d, c, yy) => drawThinRule(d, c, contentWidth, yy),
    (d, c, yy) => drawO(d, c, yy, 4, 0.3),
  ];
  let breakIdx = 0;

  function resetStyle() {
    doc.setFont('times', 'normal');
    doc.setFontSize(bodyFontSize);
    doc.setTextColor(INK[0], INK[1], INK[2]);
  }

  function addPageFooter(num) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
    doc.text(String(num), cx, pageHeight - 28, { align: 'center' });
    resetStyle();
  }

  function newPage() {
    doc.addPage();
    pageNum++;
    y = marginTop;
    addPageFooter(pageNum);
    resetStyle();
  }

  addPageFooter(pageNum);

  const paragraphs = text.split('\n\n').filter(p => p.trim());

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

    // Periodic decorative breaks
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

    // Pull quote treatment
    if (paragraphCount > 3 && paragraphCount % 12 === 0 && isPullQuote(trimmed)) {
      if (y + 80 < pageHeight - marginBottom) {
        y += 20;

        // Thin rule above
        doc.setDrawColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
        doc.setLineWidth(0.3);
        doc.line(marginLeft + 30, y, pageWidth - marginRight - 30, y);

        y += 22;

        doc.setFont('times', 'italic');
        doc.setFontSize(18);
        doc.setTextColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
        const pullLines = doc.splitTextToSize(trimmed, contentWidth - 60);
        for (const line of pullLines) {
          if (y > pageHeight - marginBottom) { newPage(); }
          doc.text(line, cx, y, { align: 'center' });
          y += 26;
        }

        y += 8;
        doc.setDrawColor(INK_FAINT[0], INK_FAINT[1], INK_FAINT[2]);
        doc.setLineWidth(0.3);
        doc.line(marginLeft + 30, y, pageWidth - marginRight - 30, y);

        y += 22;
        resetStyle();
        continue;
      }
    }

    resetStyle();

    const lines = doc.splitTextToSize(trimmed, contentWidth);

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        newPage();
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += paragraphSpacing;
  }

  // ======== CLOSING PAGE ========
  doc.addPage();

  // Triple O
  drawOTriple(doc, cx, pageHeight / 2 - 50, 35, 22, 12);

  // Center dot
  doc.setFillColor(INK[0], INK[1], INK[2]);
  doc.circle(cx, pageHeight / 2 - 50, 1.5, 'F');

  // Header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  doc.text('T H E   E D E N   P R O J E C T', cx, pageHeight / 2 + 10, { align: 'center' });

  // Closing line
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
  doc.text('You are already what you are looking for.', cx, pageHeight / 2 + 40, { align: 'center' });

  // Rule
  drawThinRule(doc, cx, contentWidth, pageHeight / 2 + 60);

  // Contact
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(INK_TERTIARY[0], INK_TERTIARY[1], INK_TERTIARY[2]);
  doc.text('If this changed something, share it.', cx, pageHeight / 2 + 85, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(INK_SECONDARY[0], INK_SECONDARY[1], INK_SECONDARY[2]);
  doc.text('danieledmondson45@gmail.com', cx, pageHeight / 2 + 105, { align: 'center' });

  // Bottom triad
  drawTriad(doc, cx, pageHeight - 100, 25);

  return Buffer.from(doc.output('arraybuffer'));
}
