import { jsPDF } from 'jspdf';

// Explicitly use Node.js runtime for PDF generation
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

    // Strip markdown formatting: headers, bold, italic, list markers
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

// ---- Minimal Decorative Helpers ----

// Small centered dot divider (three dots)
function drawDotDivider(doc, cx, y) {
  doc.setFillColor(200, 185, 140);
  doc.circle(cx - 12, y, 1.2, 'F');
  doc.circle(cx, y, 1.2, 'F');
  doc.circle(cx + 12, y, 1.2, 'F');
}

// Single thin circle (the O)
function drawO(doc, cx, cy, r) {
  doc.setDrawColor(200, 185, 140);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r, 'S');
}

// Small diamond
function drawSmallDiamond(doc, cx, cy, size) {
  doc.setDrawColor(200, 185, 140);
  doc.setLineWidth(0.5);
  doc.line(cx, cy - size, cx + size, cy);
  doc.line(cx + size, cy, cx, cy + size);
  doc.line(cx, cy + size, cx - size, cy);
  doc.line(cx - size, cy, cx, cy - size);
}

// Thin horizontal rule
function drawThinRule(doc, cx, width, y) {
  doc.setDrawColor(220, 210, 185);
  doc.setLineWidth(0.3);
  const halfW = width * 0.2;
  doc.line(cx - halfW, y, cx + halfW, y);
}

// ---- Main PDF Generator ----

function generatePDF(text, name) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 48;
  const marginRight = 48;
  const marginTop = 56;
  const marginBottom = 56;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const cx = pageWidth / 2;

  // ======== TITLE PAGE ========

  // Single elegant circle behind title
  drawO(doc, cx, 330, 80);
  drawO(doc, cx, 330, 55);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(153, 153, 153);
  doc.text('T H E   E D E N   P R O J E C T', cx, 220, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(`A Philosophical Guidebook for ${name}`, contentWidth - 40);
  doc.text(titleLines, cx, 338, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text('Written specifically for you.', cx, 430, { align: 'center' });
  doc.text('Not a template. Not a copy. Yours.', cx, 448, { align: 'center' });

  // Small diamond at bottom of title page
  drawSmallDiamond(doc, cx, pageHeight - 80, 6);

  // ======== BODY PAGES ========
  doc.addPage();
  let y = marginTop;
  let pageNum = 2;
  let paragraphCount = 0;

  // Rotating set of small section break graphics
  const sectionBreakGraphics = [
    (doc, cx, y) => drawDotDivider(doc, cx, y),
    (doc, cx, y) => drawSmallDiamond(doc, cx, y, 5),
    (doc, cx, y) => drawO(doc, cx, y, 6),
    (doc, cx, y) => drawThinRule(doc, cx, contentWidth, y),
    (doc, cx, y) => drawDotDivider(doc, cx, y),
    (doc, cx, y) => drawO(doc, cx, y, 8),
  ];
  let graphicIndex = 0;

  // Reset text style to body defaults — call after any decoration
  function resetBodyStyle() {
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
  }

  // Page number only
  function addPageNumber(num) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(String(num), cx, pageHeight - 30, { align: 'center' });
    resetBodyStyle();
  }

  addPageNumber(pageNum);

  const paragraphs = text.split('\n\n').filter(p => p.trim());

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    paragraphCount++;

    // Section divider detection
    if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
      y += 18;
      drawDotDivider(doc, cx, y);
      y += 18;
      resetBodyStyle();
      continue;
    }

    // Insert a small decorative break every ~10 paragraphs
    if (paragraphCount > 1 && paragraphCount % 10 === 0) {
      if (y + 50 < pageHeight - marginBottom) {
        y += 16;
        const gfx = sectionBreakGraphics[graphicIndex % sectionBreakGraphics.length];
        gfx(doc, cx, y);
        graphicIndex++;
        y += 20;
        resetBodyStyle();
      }
    }

    // Body text — always reset to ensure correct style
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

    y += 14; // paragraph gap
  }

  // ======== CLOSING PAGE ========
  doc.addPage();

  // Two concentric circles
  drawO(doc, cx, pageHeight / 2 - 60, 50);
  drawO(doc, cx, pageHeight / 2 - 60, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text('T H E   E D E N   P R O J E C T', cx, pageHeight / 2 + 10, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text('If this changed something, share it.', cx, pageHeight / 2 + 50, { align: 'center' });
  doc.text('Not this document \u2014 the idea behind it.', cx, pageHeight / 2 + 68, { align: 'center' });

  drawSmallDiamond(doc, cx, pageHeight / 2 + 100, 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(153, 153, 153);
  doc.text('danieledmondson45@gmail.com', cx, pageHeight / 2 + 130, { align: 'center' });

  // Return as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
