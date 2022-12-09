import { Stripe } from "stripe";
import { configs } from "./configs";

export const stripe = new Stripe(configs.STRIPE_SECRET, {
  apiVersion: "2022-11-15",
});
