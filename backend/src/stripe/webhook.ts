import { Router } from "express";
import express from "express";
import { Request, Response } from "express";
import Stripe from "stripe";
import handlerCheckoutSessionCompleted from "./handlers/handlerCheckoutSessionCompleted";
import handlerInvoicePaid from "./handlers/handlerInvoicePaid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookRouter = Router();

webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).send("Missing stripe signature");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // 🔥 RAW BUFFER
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    try {
      switch (event.type) {
        // CHECKOUT FINALIZADO (Não quer dizer que foi pago!)
        case "checkout.session.completed": {
          console.log("checkout.session.completed");
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.metadata?.origin !== "checkout") return;
          // 🔐 Validações essenciais
          if (
            !session.customer ||
            !session.subscription ||
            !session.metadata?.businessId ||
            !session.metadata?.subscriptionId
          ) {
            console.error("Checkout session incompleta:", session.id);
            break;
          }

          await handlerCheckoutSessionCompleted(
            session.customer as string,
            session.subscription as string,
            {
              businessId: session.metadata.businessId,
              subscriptionId: session.metadata.subscriptionId,
              employeeId: session.metadata.employeeId,
            }
          );

          break;
        }
        // FATURA PAGA
        case "invoice.payment_succeeded": {
          console.log("invoice.payment_succeeded");
          const session = event.data.object as Stripe.Invoice;
          const customer = session.customer;
          if (!customer) {
            console.error("Invoice incompleta:", session.id);
            break;
          }
          await handlerInvoicePaid(customer as string);
          break;
        }
        default:
          console.log(`⚠️ Evento não tratado: ${event.type}`);
      }
    } catch (handlerError) {
      console.error("Erro ao processar lógica do webhook:", handlerError);
      // Retornamos 500 para que o Stripe tente reenviar o evento mais tarde
      return res.status(500).json({ error: "Webhook handler failed" });
    }

    return res.sendStatus(200);
  }
);
// checkout.session.completed
// invoice.payment_succeeded
// customer.subscription.updated
// customer.subscription.deleted

export default webhookRouter;
