import Stripe from 'stripe';
import { NextResponse } from 'next/server';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    const { amount } = await req.json();
    // Minimum $15 (1500 cents), maximum $100 (10000 cents)
    const unitAmount = Math.max(1500, Math.min(10000, amount));

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Eden Project — Philosophical Document',
              description: 'A personalized philosophical document built from your answers and a framework designed to meet you where you are.',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/offering`,
      customer_creation: 'always',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
