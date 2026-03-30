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

// ---- Decorative Drawing Helpers ----

// Seeded pseudo-random for consistent results per name
function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 2147483647;
  };
}

// Draw concentric circles (the O symbol)
function drawConcentricCircles(doc, cx, cy, maxR, rings, color) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.5);
  for (let i = 1; i <= rings; i++) {
    const r = (maxR / rings) * i;
    const opacity = 0.08 + (i / rings) * 0.15;
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setGState(new doc.GState({ opacity }));
    doc.circle(cx, cy, r, 'S');
  }
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Draw a golden spiral approximation
function drawSpiral(doc, cx, cy, maxR, turns, color) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.6);
  doc.setGState(new doc.GState({ opacity: 0.12 }));
  const points = [];
  const steps = turns * 60;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = (maxR / (turns * 2 * Math.PI)) * t;
    points.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) });
  }
  for (let i = 1; i < points.length; i++) {
    doc.line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
  }
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Draw a diamond/rhombus
function drawDiamond(doc, cx, cy, size, color, opacity = 0.1) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.5);
  doc.setGState(new doc.GState({ opacity }));
  doc.line(cx, cy - size, cx + size, cy);
  doc.line(cx + size, cy, cx, cy + size);
  doc.line(cx, cy + size, cx - size, cy);
  doc.line(cx - size, cy, cx, cy - size);
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Draw constellation dots
function drawConstellation(doc, cx, cy, spread, count, rand, color) {
  doc.setGState(new doc.GState({ opacity: 0.15 }));
  doc.setFillColor(color.r, color.g, color.b);
  const stars = [];
  for (let i = 0; i < count; i++) {
    const x = cx + (rand() - 0.5) * spread * 2;
    const y = cy + (rand() - 0.5) * spread * 2;
    const r = 0.8 + rand() * 1.5;
    doc.circle(x, y, r, 'F');
    stars.push({ x, y });
  }
  // Connect some stars with faint lines
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.3);
  doc.setGState(new doc.GState({ opacity: 0.06 }));
  for (let i = 0; i < stars.length - 1; i++) {
    if (rand() > 0.5) {
      const j = Math.min(i + 1 + Math.floor(rand() * 2), stars.length - 1);
      doc.line(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
    }
  }
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Draw the tree of life (simple geometric)
function drawTreeOfLife(doc, cx, cy, size, color) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.6);
  doc.setGState(new doc.GState({ opacity: 0.1 }));

  // Trunk
  doc.line(cx, cy + size * 0.6, cx, cy - size * 0.2);

  // Branches - symmetric
  const branches = [
    [-0.3, -0.1, -0.5, -0.45],
    [0.3, -0.1, 0.5, -0.45],
    [-0.2, -0.3, -0.4, -0.6],
    [0.2, -0.3, 0.4, -0.6],
    [-0.1, -0.45, -0.25, -0.75],
    [0.1, -0.45, 0.25, -0.75],
    [0, -0.5, 0, -0.85],
  ];
  for (const [x1, y1, x2, y2] of branches) {
    doc.line(cx + x1 * size, cy + y1 * size, cx + x2 * size, cy + y2 * size);
  }

  // Roots
  const roots = [
    [-0.15, 0.6, -0.35, 0.85],
    [0.15, 0.6, 0.35, 0.85],
    [0, 0.6, 0, 0.9],
  ];
  for (const [x1, y1, x2, y2] of roots) {
    doc.line(cx + x1 * size, cy + y1 * size, cx + x2 * size, cy + y2 * size);
  }

  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Draw a triadic triangle
function drawTriad(doc, cx, cy, size, color, opacity = 0.1) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.6);
  doc.setGState(new doc.GState({ opacity }));
  const top = { x: cx, y: cy - size };
  const left = { x: cx - size * 0.866, y: cy + size * 0.5 };
  const right = { x: cx + size * 0.866, y: cy + size * 0.5 };
  doc.line(top.x, top.y, left.x, left.y);
  doc.line(left.x, left.y, right.x, right.y);
  doc.line(right.x, right.y, top.x, top.y);
  // Inner circle
  const inR = size * 0.45;
  doc.circle(cx, cy, inR, 'S');
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Draw wave pattern across the page
function drawWaves(doc, y, pageWidth, color) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setLineWidth(0.4);
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  for (let wave = 0; wave < 3; wave++) {
    const baseY = y + wave * 6;
    for (let x = 0; x < pageWidth; x += 2) {
      const y1 = baseY + Math.sin((x / pageWidth) * Math.PI * 4 + wave) * 4;
      const y2 = baseY + Math.sin(((x + 2) / pageWidth) * Math.PI * 4 + wave) * 4;
      doc.line(x, y1, x + 2, y2);
    }
  }
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Thin decorative line with dots at ends
function drawSectionDivider(doc, cx, width, y, color) {
  doc.setDrawColor(color.r, color.g, color.b);
  doc.setFillColor(color.r, color.g, color.b);
  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.setLineWidth(0.4);
  const halfW = width * 0.3;
  doc.line(cx - halfW, y, cx + halfW, y);
  doc.circle(cx - halfW - 2, y, 1.5, 'F');
  doc.circle(cx + halfW + 2, y, 1.5, 'F');
  doc.circle(cx, y, 2, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));
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

  // Warm gold accent color
  const gold = { r: 180, g: 150, b: 80 };
  // Soft navy accent
  const navy = { r: 40, g: 55, b: 90 };
  // Light sage
  const sage = { r: 120, g: 150, b: 120 };

  const rand = seededRandom(name);

  // ======== TITLE PAGE ========

  // Background constellation
  drawConstellation(doc, cx, 180, 180, 25, rand, navy);

  // Large concentric circles behind title
  drawConcentricCircles(doc, cx, 340, 160, 8, gold);

  // Small triadic triangle top
  drawTriad(doc, cx, 140, 30, gold, 0.12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(153, 153, 153);
  doc.text('T H E   E D E N   P R O J E C T', cx, 220, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(`A Philosophical Guidebook for ${name}`, contentWidth - 40);
  doc.text(titleLines, cx, 330, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(102, 102, 102);
  doc.text('Written specifically for you.', cx, 420, { align: 'center' });
  doc.text('Not a template. Not a copy. Yours.', cx, 438, { align: 'center' });

  // Bottom decorative wave
  drawWaves(doc, pageHeight - 80, pageWidth, sage);

  // Small diamond at bottom
  drawDiamond(doc, cx, pageHeight - 50, 8, gold, 0.15);

  // ======== BODY PAGES ========
  doc.addPage();
  let y = marginTop;
  let pageNum = 2;
  let paragraphCount = 0;

  // Array of decorative graphics to place at section breaks
  const sectionGraphics = [
    (doc, cx, y) => drawSpiral(doc, cx, y, 35, 3, gold),
    (doc, cx, y) => drawConcentricCircles(doc, cx, y, 25, 5, navy),
    (doc, cx, y) => drawDiamond(doc, cx, y, 18, gold, 0.12),
    (doc, cx, y) => drawTriad(doc, cx, y, 20, sage, 0.12),
    (doc, cx, y) => drawTreeOfLife(doc, cx, y, 30, navy),
    (doc, cx, y) => drawConcentricCircles(doc, cx, y, 20, 4, sage),
    (doc, cx, y) => drawSpiral(doc, cx, y, 28, 2.5, sage),
    (doc, cx, y) => drawDiamond(doc, cx, y, 14, navy, 0.1),
    (doc, cx, y) => drawTriad(doc, cx, y, 16, gold, 0.1),
  ];
  let graphicIndex = 0;

  // Page decoration function — subtle corner/margin elements
  function decoratePage(doc, pageNum) {
    const r = seededRandom(name + pageNum);

    // Subtle page number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(String(pageNum), cx, pageHeight - 30, { align: 'center' });

    // Occasional margin constellation (every 3rd page)
    if (pageNum % 3 === 0) {
      const side = r() > 0.5 ? 20 : pageWidth - 20;
      drawConstellation(doc, side, 100 + r() * 400, 60, 6, r, navy);
    }

    // Occasional small corner diamond (every 4th page)
    if (pageNum % 4 === 1) {
      drawDiamond(doc, pageWidth - 30, 30, 6, gold, 0.08);
    }

    // Occasional corner circle (every 5th page)
    if (pageNum % 5 === 0) {
      drawConcentricCircles(doc, 30, 30, 15, 3, sage);
    }
  }

  decoratePage(doc, pageNum);

  const paragraphs = text.split('\n\n').filter(p => p.trim());

  for (const para of paragraphs) {
    const trimmed = para.trim();
    paragraphCount++;

    // Section divider
    if (trimmed.length < 10 && (trimmed === '---' || trimmed === '***' || trimmed === '* * *')) {
      y += 24;
      drawSectionDivider(doc, cx, contentWidth, y, gold);
      y += 24;
      continue;
    }

    // Insert a decorative graphic every ~8 paragraphs (section breaks)
    if (paragraphCount > 0 && paragraphCount % 8 === 0) {
      // Check if enough space
      if (y + 80 < pageHeight - marginBottom) {
        y += 20;
        const gfx = sectionGraphics[graphicIndex % sectionGraphics.length];
        gfx(doc, cx, y + 20);
        graphicIndex++;
        y += 55;
      }
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
        pageNum++;
        y = marginTop;
        decoratePage(doc, pageNum);
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += 14; // paragraph gap
  }

  // ======== CLOSING PAGE ========
  doc.addPage();
  pageNum++;

  // Large spiral background
  drawSpiral(doc, cx, pageHeight / 2 - 40, 120, 4, gold);

  // Constellation
  drawConstellation(doc, cx, 200, 150, 20, seededRandom(name + 'close'), navy);

  // The O symbol — concentric circles
  drawConcentricCircles(doc, cx, pageHeight / 2 - 40, 80, 6, sage);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text('T H E   E D E N   P R O J E C T', cx, 280, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(102, 102, 102);
  doc.text('If this changed something, share it.', cx, 340, { align: 'center' });
  doc.text('Not this document \u2014 the idea behind it.', cx, 358, { align: 'center' });

  // Triadic triangle above email
  drawTriad(doc, cx, 400, 15, gold, 0.15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(153, 153, 153);
  doc.text('danieledmondson45@gmail.com', cx, 440, { align: 'center' });

  // Bottom wave
  drawWaves(doc, pageHeight - 60, pageWidth, sage);

  // Return as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
