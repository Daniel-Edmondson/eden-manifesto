import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { suggestion } = await req.json();

    if (!suggestion || suggestion.trim().length === 0) {
      return NextResponse.json({ error: 'Empty suggestion' }, { status: 400 });
    }

    // Log the suggestion — in production, you could send this to an email,
    // database, or notification service
    console.log('[Song Suggestion]', new Date().toISOString(), suggestion.trim());

    // Could also send an email notification here:
    // await sendEmail({ to: 'danieledmondson45@gmail.com', subject: 'New Song Suggestion', body: suggestion });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Song suggestion error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
