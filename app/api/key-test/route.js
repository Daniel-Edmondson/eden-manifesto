export const runtime = 'edge';

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY || 'NOT_SET';
  const timestamp = new Date().toISOString();

  // Test with the raw key
  let rawTest = 'skipped';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    rawTest = res.status;
  } catch (e) {
    rawTest = e.message;
  }

  // Test with trimmed key
  const trimmed = key.trim().replace(/\s+/g, '');
  let trimTest = 'skipped';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': trimmed,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    trimTest = res.status;
  } catch (e) {
    trimTest = e.message;
  }

  return new Response(JSON.stringify({
    buildTime: timestamp,
    keyLength: key.length,
    keyStart: key.slice(0, 20),
    keyEnd: key.slice(-15),
    rawKeyStatus: rawTest,
    trimmedKeyStatus: trimTest,
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
