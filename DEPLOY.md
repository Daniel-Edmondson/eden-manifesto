# The Eden Project — Deployment Guide

## What You Need

1. **A Stripe account** (you have this)
2. **An Anthropic API key** — sign up at console.anthropic.com ($5 credit to start, each manifesto costs ~$0.15)
3. **A Vercel account** — free at vercel.com (sign up with GitHub)
4. **A GitHub account** — free at github.com

## Step-by-Step Setup (30 minutes)

### 1. Get Your Anthropic API Key

- Go to https://console.anthropic.com
- Sign up / sign in
- Go to API Keys → Create Key
- Copy the key (starts with `sk-ant-`)
- Add at least $5 in credits under Billing

### 2. Set Up Stripe

In your Stripe Dashboard:
- Make sure you're in **Live mode** (toggle at top of dashboard)
- Go to Developers → API Keys
- Copy your **Secret key** (starts with `sk_live_`)
- Copy your **Publishable key** (starts with `pk_live_`)

### 3. Push to GitHub

On your computer, open Terminal and run:

```bash
cd eden-manifesto
git init
git add .
git commit -m "Initial commit - The Eden Project"
```

Then go to github.com → New Repository → name it `eden-manifesto` → Create.

Follow GitHub's instructions to push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/eden-manifesto.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

- Go to vercel.com → Sign in with GitHub
- Click "Add New Project"
- Import your `eden-manifesto` repository
- In the **Environment Variables** section, add:

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` (from Stripe) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (from Stripe) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (from Anthropic) |
| `NEXT_PUBLIC_BASE_URL` | `https://eden-manifesto.vercel.app` (or your custom domain) |

- Click **Deploy**
- Wait 1-2 minutes

### 5. Test It

- Visit your deployed URL
- Use Stripe test mode first if you want to test without real charges
  - Switch to test mode in Stripe dashboard
  - Use test API keys instead of live keys
  - Test card number: 4242 4242 4242 4242

### 6. Custom Domain (Optional)

- In Vercel → Your project → Settings → Domains
- Add your domain (e.g., edenmanifesto.com)
- Update DNS records as instructed
- Update `NEXT_PUBLIC_BASE_URL` in Vercel environment variables

## Costs

- **Vercel hosting**: Free (hobby tier covers this easily)
- **Stripe fees**: 2.9% + $0.30 per transaction ($0.88 on a $20 sale)
- **Anthropic API**: ~$0.10-0.20 per manifesto generation
- **Your net per $20 sale**: ~$18.90

## Updating the Site

Edit files in the GitHub repository. Vercel auto-deploys on every push to main.

## Need Help?

The site is built with Next.js 14. Key files:
- `app/page.js` — Landing page copy and design
- `app/questionnaire/page.js` — Questionnaire flow
- `lib/framework.js` — The philosophical framework / AI instructions
- `app/api/generate-manifesto/route.js` — Manifesto generation + PDF creation
