import { SYSTEM_PROMPT, buildUserPrompt } from '../../../lib/framework';

// Use Edge Runtime — 30s timeout on Hobby plan (vs 10s for Node.js)
export const runtime = 'edge';

export async function POST(req) {
  try {
    const { answers } = await req.json();

    if (!answers || !answers.name) {
      return new Response(JSON.stringify({ error: 'Missing answers' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response from Claude so the connection stays alive
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildUserPrompt(answers),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Anthropic API error:', response.status, errorBody);
      return new Response(JSON.stringify({ error: `API error: ${response.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a transform stream that extracts text from SSE events
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                controller.enqueue(encoder.encode(parsed.delta.text));
              }
            } catch (e) {
              // Skip unparseable lines
            }
          }
        }
      },
    });

    // Pipe the Anthropic stream through our transform
    response.body.pipeThrough(transformStream);

    return new Response(transformStream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    console.error('Generation error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate philosophical guidebook.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
