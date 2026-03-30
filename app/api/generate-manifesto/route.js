import { NextResponse } from 'next/server';

// This endpoint has been replaced by /api/generate-text + /api/generate-pdf
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Use /api/generate-text and /api/generate-pdf instead.' },
    { status: 410 }
  );
}
