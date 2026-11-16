import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { BusinessSegment, SubscriptionStatus } from "@prisma/client";

export const subscriptionService = {
  async createPartial(
    subscriptionPlanId: number,
    empresa: {
      name: string;
      phone: string;
      slug: string;
      document: string;
      segment: BusinessSegment;
      address: any; // JSON
    },
    funcionario: {
      name: string;
      email: string;
      password: string;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1h para pagar

      // 1️⃣ Criar empresa
      const business = await tx.business.create({
        data: {
          name: empresa.name,
          phone: empresa.phone,
          slug: empresa.slug,
          document: empresa.document,
          segment: empresa.segment,
          address: empresa.address,
          active: true,
          paymentExpiresAt: expiresAt,
        },
      });

      const weekDays = [0, 1, 2, 3, 4, 5, 6];

      await tx.workDays.createMany({
        data: weekDays.map((day) => ({
          businessId: business.id,
          day,
          active: false,
        })),
      });

      // 2️⃣ Criar assinatura PENDENTE
      const subscription = await tx.subscription.create({
        data: {
          businessId: business.id,
          planId: subscriptionPlanId,
          status: SubscriptionStatus.PENDING_PAYMENT,
          isActive: false,
        },
      });

      // 3️⃣ Criar role inicial
      const adminRole = await tx.role.create({
        data: {
          name: "Administrador",
          permissions: { fullaccess: true },
          businessId: business.id,
        },
      });

      // 4️⃣ Criar funcionário administrador
      const passwordHash = await bcrypt.hash(funcionario.password, 10);

      const employee = await tx.employee.create({
        data: {
          name: funcionario.name,
          email: funcionario.email,
          password: passwordHash,
          businessId: business.id,
          roleId: adminRole.id,
        },
      });

      return {
        businessId: business.id,
        subscriptionId: subscription.id,
        employeeId: employee.id,
      };
    });
  },
  async getSubscriptionByBusinessSlug(slug: string) {
  
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error("Business não encontrado");
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        businessId: business.id,
      },
      select: {
        id: true,
        status: true,
        isActive: true,
        trialEndsAt: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        canceledAt: true,
        createdAt: true,

        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            billingCycle: true,
            features: true,

            modules: {
              select: {
                moduleType: true,
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      throw new Error("Assinatura não encontrada para este negócio");
    }

    return subscription;
  },
};
