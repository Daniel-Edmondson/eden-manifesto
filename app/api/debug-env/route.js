export const runtime = 'edge';

export async function GET() {
  const rawKey = process.env.ANTHROPIC_API_KEY || '';
  const trimmedKey = rawKey.trim().replace(/\s+/g, '');

  // Test the key directly against Anthropic's API
  let apiTest = 'not tested';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': trimmedKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    apiTest = `status: ${res.status}`;
    if (!res.ok) {
      const body = await res.text();
      apiTest += ` body: ${body}`;
    } else {
      apiTest += ' — key works!';
    }
  } catch (e) {
    apiTest = `fetch error: ${e.message}`;
  }

  return new Response(JSON.stringify({
    rawLength: rawKey.length,
    trimmedLength: trimmedKey.length,
    hasWhitespace: rawKey !== trimmedKey,
    rawPrefix: JSON.stringify(rawKey.slice(0, 15)),
    rawSuffix: JSON.stringify(rawKey.slice(-10)),
    apiTest,
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
