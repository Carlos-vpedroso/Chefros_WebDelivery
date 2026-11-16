import prisma from "../../config/prisma";

export default async function handlerInvoicePaid(stripeCustomerId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 🔎 Busca empresa
      const business = await tx.business.findUnique({
        where: { stripeCustomerId },
        include: {
          subscription: {
            include: {
              plan: {
                include: {
                  modules: true, // PlanModule[]
                },
              },
            },
          },
        },
      });

      if (!business || !business.subscription) {
        throw new Error("Empresa ou assinatura não encontrada");
      }

      const subscription = business.subscription;

      // 🔁 Idempotência: já ativa
      if (subscription.status === "ACTIVE") {
        console.log("Invoice já processada para business:", business.id);
        return;
      }

      // 1️⃣ Ativa assinatura
      await tx.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "ACTIVE",
          isActive: true,
        },
      });

      // 2️⃣ Atualiza empresa
      await tx.business.update({
        where: { id: business.id },
        data: {
          paymentExpiresAt: null,
          active: true,
        },
      });

      // 3️⃣ Cria módulos do plano
      const planModules = subscription.plan.modules;

      if (planModules.length > 0) {
        await tx.businessModule.createMany({
          data: planModules.map((pm) => ({
            businessId: business.id,
            moduleType: pm.moduleType,
            active: true,
            activatedAt: new Date(),
          })),
          skipDuplicates: true, // 🔥 ESSENCIAL
        });
      }

      return {
        businessId: business.id,
        subscriptionId: subscription.id,
        activatedModules: planModules.map((m) => m.moduleType),
      };
    });
  } catch (error) {
    console.log(error);
    return { error: `Não foi possível processar o handler: ${error}` };
  }
}
