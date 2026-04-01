import Stripe from 'stripe';
import { NextResponse } from 'next/server';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const tierDescriptions = {
  essential: {
    name: 'The Eden Project — Essential Philosophical Guidebook',
    description: 'A personalized 4,000–5,000 word philosophical guidebook with triadic analysis and faith integration.',
  },
  deep: {
    name: 'The Eden Project — Deep Philosophical Guidebook',
    description: 'An expanded 7,000–9,000 word philosophical guidebook with the psychedelic thesis and cross-tradition connections.',
  },
  complete: {
    name: 'The Eden Project — Complete Theory of Everything',
    description: 'The full 10,000–12,000 word philosophical guidebook — a comprehensive theory of everything for your life.',
  },
};

export async function POST(req) {
  try {
    const { amount, tier = 'deep' } = await req.json();
    const unitAmount = Math.max(2000, amount);
    const tierInfo = tierDescriptions[tier] || tierDescriptions.deep;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tierInfo.name,
              description: tierInfo.description,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/offering?tier=${tier}`,
      customer_creation: 'always',
      metadata: { tier },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
