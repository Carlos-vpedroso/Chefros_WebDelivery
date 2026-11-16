import prisma from "../../config/prisma";
import { ActivityType, ActorType } from "@prisma/client";

interface CreateActivityLogInput {
  businessId: string;
  type: ActivityType;
  title: string;
  description?: string;
  actorType?: ActorType;

  employeeId?: string;
  customerId?: string;
  userId?: string;
}

export const activityLogService = {
  async getRecords(slug: string, quantity: number) {
    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      throw new Error("Empresa não encontrada para o slug informado.");
    }

    return prisma.activityLog.findMany({
      where: {
        businessId: business.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: quantity,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async getAllBySlug(slug: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
    });
    if (!business) {
      throw new Error("Empresa não encontrada para o slug informado.");
    }
    return prisma.activityLog.findMany({
      where: { businessId: business.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async create(data: CreateActivityLogInput) {
    return prisma.activityLog.create({
      data: {
        businessId: data.businessId,
        type: data.type,
        title: data.title,
        description: data.description,
        actorType: data.actorType,

        employeeId: data.employeeId,
        customerId: data.customerId,
        userId: data.userId,
      },
    });
  },
};
