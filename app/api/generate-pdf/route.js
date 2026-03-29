import PDFDocument from 'pdfkit';
import { NextResponse } from 'next/server';

function getStandardFonts() {
  return {
    serif: 'Times-Roman',
    serifBold: 'Times-Bold',
    serifItalic: 'Times-Italic',
    sans: 'Helvetica',
    sansBold: 'Helvetica-Bold',
  };
}

export async function POST(req) {
  try {
    const { text, name } = await req.json();

    if (!text || !name) {
      return NextResponse.json({ error: 'Missing text or name' }, { status: 400 });
    }

    const pdfBuffer = await generatePDF(text, name);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Eden-Guidebook-${name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF.' }, { status: 500 });
  }
}

function generatePDF(text, name) {
  return new Promise((resolve, reject) => {
    const fonts = getStandardFonts();
    const doc = new PDFDocument({
      size: 'letter',
      margins: { top: 96, bottom: 96, left: 96, right: 96 },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Title page
    doc.font(fonts.sans)
      .fontSize(9).fillColor('#999999')
      .text('THE EDEN PROJECT', { align: 'center', characterSpacing: 3 });

    doc.moveDown(8);

    doc.font(fonts.serif)
      .fontSize(28).fillColor('#000000')
      .text(`A Philosophical Guidebook for ${name}`, { align: 'center' });

    doc.moveDown(2);

    doc.font(fonts.serifItalic)
      .fontSize(11).fillColor('#666666')
      .text('Written specifically for you.', { align: 'center' });

    doc.moveDown(1);

    doc.font(fonts.serifItalic)
      .fontSize(11).fillColor('#666666')
      .text('Not a template. Not a copy. Yours.', { align: 'center' });

    doc.addPage();

    // Body text
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    paragraphs.forEach((para) => {
      const trimmed = para.trim();

      if (doc.y > doc.page.height - 150) {
        doc.addPage();
      }

      if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
        doc.moveDown(1.5);
        doc.font(fonts.sans).fontSize(10).fillColor('#cccccc')
          .text('*', { align: 'center' });
        doc.moveDown(1.5);
        return;
      }

      doc.font(fonts.serif)
        .fontSize(11.5).fillColor('#1a1a1a')
        .text(trimmed, { align: 'left', lineGap: 6, paragraphGap: 0 });

      doc.moveDown(0.8);
    });

    // Closing page
    doc.addPage();
    doc.moveDown(6);

    doc.font(fonts.sans)
      .fontSize(8).fillColor('#999999')
      .text('THE EDEN PROJECT', { align: 'center', characterSpacing: 3 });

    doc.moveDown(1.5);

    doc.font(fonts.serifItalic)
      .fontSize(10).fillColor('#666666')
      .text('If this changed something for you, share it.', { align: 'center' });

    doc.moveDown(0.5);

    doc.font(fonts.serifItalic)
      .fontSize(10).fillColor('#666666')
      .text('Not this document \u2014 the idea that someone wrote this for you.', { align: 'center' });

    doc.moveDown(2);

    doc.font(fonts.sans)
      .fontSize(9).fillColor('#999999')
      .text('edenmanifesto.com', { align: 'center' });

    doc.end();
  });
}
