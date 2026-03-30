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

  // ---- Title Page ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(153, 153, 153);
  doc.text('T H E   E D E N   P R O J E C T', pageWidth / 2, 200, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(26);
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(`A Philosophical Guidebook for ${name}`, contentWidth);
  doc.text(titleLines, pageWidth / 2, 320, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(102, 102, 102);
  doc.text('Written specifically for you.', pageWidth / 2, 400, { align: 'center' });
  doc.text('Not a template. Not a copy. Yours.', pageWidth / 2, 418, { align: 'center' });

  // ---- Body Pages ----
  doc.addPage();
  let y = marginTop;

  const paragraphs = text.split('\n\n').filter(p => p.trim());

  for (const para of paragraphs) {
    const trimmed = para.trim();

    // Section divider
    if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
      y += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text('*', pageWidth / 2, y, { align: 'center' });
      y += 20;
      continue;
    }

    // Body text
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);

    const lines = doc.splitTextToSize(trimmed, contentWidth);
    const lineHeight = 20;

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += 14; // paragraph gap
  }

  // ---- Closing Page ----
  doc.addPage();

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text('T H E   E D E N   P R O J E C T', pageWidth / 2, 280, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text('If this changed something for you, share it.', pageWidth / 2, 330, { align: 'center' });
  doc.text('Not this document \u2014 the idea that someone wrote this for you.', pageWidth / 2, 348, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(153, 153, 153);
  doc.text('danieledmondson45@gmail.com', pageWidth / 2, 400, { align: 'center' });

  // Return as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
