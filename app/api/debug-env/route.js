export const runtime = 'edge';

export async function GET() {
  const rawKey = process.env.ANTHROPIC_API_KEY || '';
  const trimmedKey = rawKey.trim().replace(/\s+/g, '');

  return new Response(JSON.stringify({
    rawLength: rawKey.length,
    trimmedLength: trimmedKey.length,
    hasWhitespace: rawKey !== trimmedKey,
    hasNewline: rawKey.includes('\n'),
    hasReturn: rawKey.includes('\r'),
    hasTab: rawKey.includes('\t'),
    rawPrefix: JSON.stringify(rawKey.slice(0, 15)),
    rawSuffix: JSON.stringify(rawKey.slice(-10)),
  }), { headers: { 'Content-Type': 'application/json' } });
}
