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

    // Create a readable stream that extracts text from SSE events
    // with proper buffering to handle chunks split across boundaries
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = response.body.getReader();

    const stream = new ReadableStream({
      async pull(controller) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              processLines(buffer, controller, encoder);
            }
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete lines (ending with \n)
          const lastNewline = buffer.lastIndexOf('\n');
          if (lastNewline !== -1) {
            const complete = buffer.substring(0, lastNewline);
            buffer = buffer.substring(lastNewline + 1);
            processLines(complete, controller, encoder);
          }
        }
      },
    });

    return new Response(stream, {
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

function processLines(text, controller, encoder) {
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6).trim();
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
}
