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

// ---- Colors — clean, bright, minimal ----
const BLACK = [26, 26, 26];
const DARK_GRAY = [64, 64, 64];
const MID_GRAY = [115, 115, 115];
const LIGHT_GRAY = [163, 163, 163];
const BORDER = [229, 229, 229];
const BG = [255, 255, 255];

// ---- Decorative Helpers ----

function drawO(doc, cx, cy, r) {
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r, 'S');
}

function drawDotDivider(doc, cx, y) {
  doc.setFillColor(...LIGHT_GRAY);
  doc.circle(cx - 10, y, 0.8, 'F');
  doc.circle(cx, y, 0.8, 'F');
  doc.circle(cx + 10, y, 0.8, 'F');
}

function drawThinRule(doc, cx, width, y) {
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.25);
  const halfW = width * 0.15;
  doc.line(cx - halfW, y, cx + halfW, y);
}

// ---- Main PDF Generator — clean, bright, Apple-like ----

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

  // Clean O
  drawO(doc, cx, 280, 50);
  drawO(doc, cx, 280, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT_GRAY);
  doc.text('T H E   E D E N   P R O J E C T', cx, 180, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(28);
  doc.setTextColor(...BLACK);
  const titleLines = doc.splitTextToSize(`A Philosophical Document for ${name}`, contentWidth - 60);
  doc.text(titleLines, cx, 360, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...MID_GRAY);
  doc.text('Written for you. Not a template.', cx, 420, { align: 'center' });

  // ======== BODY PAGES ========
  doc.addPage();
  let y = marginTop;
  let pageNum = 2;
  let paragraphCount = 0;

  const breakOptions = [
    (d, c, yy) => drawDotDivider(d, c, yy),
    (d, c, yy) => drawThinRule(d, c, contentWidth, yy),
    (d, c, yy) => drawO(d, c, yy, 4),
  ];
  let breakIdx = 0;

  function resetStyle() {
    doc.setFont('times', 'normal');
    doc.setFontSize(12.5);
    doc.setTextColor(...DARK_GRAY);
  }

  function addPageNum(num) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(String(num), cx, pageHeight - 36, { align: 'center' });
    resetStyle();
  }

  addPageNum(pageNum);

  const paragraphs = text.split('\n\n').filter(p => p.trim());

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    paragraphCount++;

    // Section divider markers
    if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
      y += 14;
      drawDotDivider(doc, cx, y);
      y += 14;
      resetStyle();
      continue;
    }

    // Periodic subtle breaks
    if (paragraphCount > 1 && paragraphCount % 10 === 0) {
      if (y + 40 < pageHeight - marginBottom) {
        y += 14;
        const gfx = breakOptions[breakIdx % breakOptions.length];
        gfx(doc, cx, y);
        breakIdx++;
        y += 18;
        resetStyle();
      }
    }

    resetStyle();

    const lines = doc.splitTextToSize(trimmed, contentWidth);
    const lineHeight = 19;

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        pageNum++;
        y = marginTop;
        addPageNum(pageNum);
        resetStyle();
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += 12;
  }

  // ======== CLOSING PAGE ========
  doc.addPage();

  drawO(doc, cx, pageHeight / 2 - 50, 35);
  drawO(doc, cx, pageHeight / 2 - 50, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT_GRAY);
  doc.text('T H E   E D E N   P R O J E C T', cx, pageHeight / 2 + 10, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...MID_GRAY);
  doc.text('If this changed something, share it.', cx, pageHeight / 2 + 40, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT_GRAY);
  doc.text('danieledmondson45@gmail.com', cx, pageHeight / 2 + 70, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}
