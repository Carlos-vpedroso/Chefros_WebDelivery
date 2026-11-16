import prisma from "../../config/prisma";
import { Prisma, ModuleType } from "@prisma/client";

export const subscriptionPlanService = {
  // 🔹 Buscar todos os planos
  async findAll(isActive?: boolean) {
    return prisma.subscriptionPlan.findMany({
      where: { ...(isActive !== undefined ? { isActive } : {}) },
      include: {
        modules: true, // opcional, remove se quiser só os planos
      },
      orderBy: {
        price: "asc",
      },
    });
  },

  // 🔹 Buscar um plano pelo slug
  async findBySlug(slug: string) {
    return prisma.subscriptionPlan.findUnique({
      where: { slug },
      include: {
        modules: true,
      },
    });
  },

  async createWithModules(data: {
    name: string;
    slug: string;
    description?: string;
    price: number | Prisma.Decimal;
    stripePriceId: string;
    stripeProductId: string;
    billingCycle?: "MONTHLY" | "YEARLY";
    features: string[];
    isActive?: boolean;
    modules: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      // 1️⃣ Cria o plano
      const plan = await tx.subscriptionPlan.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: new Prisma.Decimal(data.price),
          stripePriceId: data.stripePriceId,
          stripeProductId: data.stripeProductId,
          billingCycle: data.billingCycle || "MONTHLY",
          features: data.features || [],
          isActive: data.isActive ?? true,
        },
      });

      // 2️⃣ Cria os módulos vinculados ao plano
      if (data.modules.length > 0) {
        const validModules = data.modules.filter((mod) =>
          Object.values(ModuleType).includes(mod as ModuleType)
        );

        if (validModules.length !== data.modules.length) {
          throw new Error("Um ou mais módulos enviados são inválidos.");
        }

        const moduleRecords = validModules.map((mod) => ({
          planId: plan.id,
          moduleType: mod as ModuleType,
        }));

        await tx.planModule.createMany({
          data: moduleRecords,
        });
      }

      // 3️⃣ Retorna o plano completo com os módulos
      return tx.subscriptionPlan.findUnique({
        where: { id: plan.id },
        include: { modules: true },
      });
    });
  },

  // 🔹 Atualizar um plano existente
  async update(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stripePriceId: string;
      billingCycle: "MONTHLY" | "YEARLY";
      features: string[];
      isActive: boolean;
    }>
  ) {
    return prisma.subscriptionPlan.update({
      where: { id },
      data,
      include: { modules: true },
    });
  },

  // 🔹 Desativar (soft delete)
  async deactivate(id: number) {
    return prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
