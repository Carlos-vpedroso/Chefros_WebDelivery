import prisma from "../../config/prisma";

export default async function handlerCheckoutSessionCompleted(
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  metadata: {
    businessId: string;
    subscriptionId: string;
    employeeId: string;
  }
) {
  try {
    return prisma.$transaction(async (tx) => {
      const business = await tx.business.update({
        where: { id: metadata.businessId },
        data: {
          stripeCustomerId,
        },
      });
      const subscription = await tx.subscription.update({
        where: { id: metadata.subscriptionId },
        data: {
          stripeSubscriptionId,
        },
      });
      return {
        business,
        subscription,
      };
    });
  } catch (error) {
    console.log(error);
    return { error: `Não foi possível processar o handler: ${error}` };
  }
}
