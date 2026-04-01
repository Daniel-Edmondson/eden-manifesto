/**
 * THE EDEN PROJECT — PRICING TIERS
 *
 * Three tiers of philosophical guidebook depth.
 * Each tier unlocks more from the framework.
 */

export const tiers = {
  essential: {
    id: 'essential',
    name: 'Essential',
    price: 20,
    priceInCents: 2000,
    wordRange: '4,000–5,000',
    maxTokens: 8000,
    description: 'The core philosophical guidebook',
    features: [
      'Personalized triadic analysis of your central tension',
      'Faith-specific philosophical integration',
      'The control argument applied to your life',
      'Beautiful PDF delivered instantly',
    ],
    promptAddendum: `LENGTH: Generate between 4,000 and 5,000 words of pure prose. This is the Essential tier — focused, precise, powerful. Cover the reader's central tension through triadic logic, integrate their faith tradition deeply, and apply the control argument. Every word must earn its place. Aim for 30-35 substantial paragraphs.`,
  },
  deep: {
    id: 'deep',
    name: 'Deep',
    price: 50,
    priceInCents: 5000,
    wordRange: '7,000–9,000',
    maxTokens: 14000,
    description: 'The expanded philosophical companion',
    features: [
      'Everything in Essential',
      'Extended exploration of multiple life tensions',
      'Novel philosophical connections across traditions',
      'The psychedelic thesis applied to your consciousness',
      'Diamond art & spiral analysis',
    ],
    promptAddendum: `LENGTH: Generate between 7,000 and 9,000 words of pure prose. This is the Deep tier — expansive, layered, spiraling. Explore not just the reader's central tension but multiple threads across their answers. Apply the psychedelic thesis. Use the diamond art metaphor. Build novel connections between their faith tradition and unexpected philosophical territory. Make connections no one has made before. Aim for 50-60 substantial paragraphs. Do not wrap up early.`,
  },
  complete: {
    id: 'complete',
    name: 'Complete',
    price: 100,
    priceInCents: 10000,
    wordRange: '10,000–12,000',
    maxTokens: 20000,
    description: 'The full theory of everything',
    features: [
      'Everything in Deep',
      'Comprehensive theory of everything for your life',
      'Full exploration of all 23 questionnaire responses',
      'Extended faith integration with cross-traditional connections',
      'The tree, the spiral, the sacred mundane — all applied',
      'The O: your personal symbol of completion',
    ],
    promptAddendum: `LENGTH: Generate between 10,000 and 12,000 words of pure prose. This is the Complete tier — the full theory of everything, written for one life. Leave nothing on the table. Explore EVERY thread from the reader's answers. Apply every element of the framework: the triad, the control argument, the psychedelic thesis, the tree, the diamond art, the spiral, the sacred mundane, the binary, anxiety as rational, the O. Make cross-traditional connections even within a single faith tradition. This should be a document they return to for years. Build it like a cathedral — every stone in its place, but the whole greater than the sum. Aim for 70-80+ substantial paragraphs. This is the magnum opus for this person.`,
  },
};

export function getTierById(id) {
  return tiers[id] || tiers.essential;
}

export function getTierByAmount(amountInCents) {
  if (amountInCents >= 10000) return tiers.complete;
  if (amountInCents >= 5000) return tiers.deep;
  return tiers.essential;
}
