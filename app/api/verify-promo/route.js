import { NextResponse } from 'next/server';

// Promo codes are stored in the PROMO_CODES environment variable
// as a comma-separated list, e.g.: "EDEN2026,FRIEND,LAUNCH"
// If not set, defaults to "EDEN" as a fallback
function getValidCodes() {
  const codesEnv = process.env.PROMO_CODES || 'EDEN';
  return codesEnv.split(',').map(c => c.trim().toUpperCase());
}

export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false });
    }

    const validCodes = getValidCodes();
    const isValid = validCodes.includes(code.trim().toUpperCase());

    return NextResponse.json({ valid: isValid });
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
