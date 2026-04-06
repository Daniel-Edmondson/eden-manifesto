export const runtime = 'edge';

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY || '';

  // Make a minimal test call to Anthropic
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });

    const body = await response.text();

    return new Response(JSON.stringify({
      status: response.status,
      ok: response.ok,
      body: body.slice(0, 500),
      keyLength: key.length,
      keyPrefix: key.slice(0, 12) + '...',
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message,
      keyLength: key.length,
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}
