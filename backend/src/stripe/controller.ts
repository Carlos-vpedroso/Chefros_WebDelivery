import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../config/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeController = {
  async createSession(req: Request, res: Response) {
    const { planId, businessId, subscriptionId, employeeId } = req.body;
    const id = Number(planId);
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!plan) {
      throw new Error(
        "Plano não encontrado, não foi possível prosseguir para pagamento."
      );
    }
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { stripeCustomerId: true },
    });

    if (!business) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    let customerId = business.stripeCustomerId;

    try {
      const session = await stripe.checkout.sessions.create({
        ...(customerId ? { customer: customerId } : {}),
        ui_mode: "embedded",
        locale: "pt-BR",
        line_items: [
          {
            quantity: 1,
            price: plan.stripePriceId as string,
          },
        ],
        metadata: {
          businessId,
          subscriptionId,
          employeeId,
          origin: "checkout",
        },
        mode: "subscription",
        return_url: `${process.env.SITE_URL}/login`,
        payment_method_types: ["card"],
      });

      return res.status(200).json({
        id: session.id,
        client_secret: session.client_secret,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  },

  //função futura para integrar com Stripe Elements
  async createSubscription(req: Request, res: Response) {
    const { planId, email } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: Number(planId) },
    });

    if (!plan?.stripePriceId) {
      return res.status(400).json({ error: "Plano inválido" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    /** 1️⃣ Criar Customer */
    const customer = await stripe.customers.create({
      email,
      metadata: {
        origin: "checkout",
        planId: String(plan.id),
      },
    });

    /** 2️⃣ Criar Subscription INCOMPLETA */
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan.stripePriceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    const latestInvoice = subscription.latest_invoice;

    return res.status(200).json({
      clientSecret: latestInvoice,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customer.id,
    });
  },
};
