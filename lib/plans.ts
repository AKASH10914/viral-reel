import type { Plan } from "@prisma/client";

export const PLAN_LIMITS: Record<Plan, { dailyMatches: number; canGenerateApplication: boolean; advancedInsights: boolean }> = {
  FREE: {
    dailyMatches: 20,
    canGenerateApplication: false,
    advancedInsights: false
  },
  PRO: {
    dailyMatches: Number.POSITIVE_INFINITY,
    canGenerateApplication: true,
    advancedInsights: false
  },
  PREMIUM: {
    dailyMatches: Number.POSITIVE_INFINITY,
    canGenerateApplication: true,
    advancedInsights: true
  }
};

export const PRICING = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    description: "Start matching against real remote roles.",
    features: ["20 feature requests per day", "Resume skill extraction", "All 9 AI features"],
    cta: "Start free"
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$19",
    description: "Generate complete applications faster.",
    features: ["Unlimited requests", "All features", "Priority support"],
    cta: "Upgrade to Pro"
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: "$39",
    description: "Enterprise features with priority support.",
    features: ["Everything in Pro", "Advanced AI insights", "Priority matching", "Premium support"],
    cta: "Upgrade to Premium"
  }
] as const;

export function planFromPriceId(priceId?: string | null): Plan {
  if (!priceId) {
    return "FREE";
  }

  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
    return "PREMIUM";
  }

  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return "PRO";
  }

  return "FREE";
}

export function getPriceIdForPlan(plan: Exclude<Plan, "FREE">) {
  const priceId = plan === "PRO" ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;

  if (!priceId) {
    throw new Error(`Missing Stripe price ID for ${plan}`);
  }

  return priceId;
}
