import { loadStripe, Stripe } from "@stripe/stripe-js";
let stripePromise: Stripe | null = null;

export const getStripe = async (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
    stripePromise = await loadStripe(stripePublicKey);
  }
  return stripePromise;
};
