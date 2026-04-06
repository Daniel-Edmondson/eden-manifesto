export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY || '';
  return new Response(JSON.stringify({
    keyExists: !!key,
    keyLength: key.length,
    keyPrefix: key.slice(0, 10) + '...',
    keySuffix: '...' + key.slice(-4),
    allEnvKeys: Object.keys(process.env).filter(k =>
      k.includes('ANTHROPIC') || k.includes('STRIPE') || k.includes('PROMO') || k.includes('BASE_URL')
    ),
  }), { headers: { 'Content-Type': 'application/json' } });
}
