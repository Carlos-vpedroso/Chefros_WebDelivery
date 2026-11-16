import prisma from "../../config/prisma";
import { Service } from "@prisma/client";
import { activityLogService } from "../activityLog/activityLog.service";

export const serviceService = {
  async findAllByBusiness(
    slug: string,
    filters?: { search?: string; categoryId?: string; active?: boolean }
  ) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }
    return prisma.service.findMany({
      where: {
        businessId: business.id,
        ...(filters?.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                {
                  description: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
        ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters?.active !== undefined ? { active: filters.active } : {}),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: [
        {
          category: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    });
  },

  async findById(id: string) {
    return prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  },

  async create(data: Service) {
    // Valida se categoryId existe (se fornecido)
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: data.categoryId,
          businessId: data.businessId, // Garante que a categoria é do mesmo business
        },
      });

      if (!category) {
        throw new Error(
          "Categoria não encontrada ou não pertence a este business"
        );
      }
    }

    await activityLogService.create({
      businessId: data.businessId,
      type: "SERVICE_CREATED",
      title: "Serviço cadastrado",
      description: `Serviço ${data.name} foi criado`,
      actorType: "EMPLOYEE",
    });

    return prisma.service.create({
      data: {
        businessId: data.businessId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        duration: data.duration,
        categoryId: data.categoryId,
        active: data.active !== undefined ? data.active : true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  },

  // 🔄 Atualização com atualização automática de "updatedAt"
  async update(id: string, data: Partial<Service>) {
    const existingService = await prisma.service.findFirst({
      where: {
        id,
      },
    });

    if (!existingService) {
      throw new Error("Serviço não encontrado");
    }

    // Valida categoryId se for fornecido
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: data.categoryId,
          businessId: existingService.businessId,
        },
      });

      if (!category) {
        throw new Error("Categoria não encontrada");
      }
    }

    return prisma.service.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  },

  // 🗑️ Exclusão permanente (apenas para admin)
  async permanentDelete(id: string, employeeId?: string) {
    
    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        businessId: true,
      },
    });
  
    if (!service) {
      throw new Error("Serviço não encontrado.");
    }
  
    
    await activityLogService.create({
      businessId: service.businessId,
      type: "SERVICE_DELETED",
      title: "Serviço excluído",
      description: `Serviço ${service.name} foi excluído`,
      actorType: "EMPLOYEE",
      ...(employeeId && { employeeId }),
    });
  
    
    return prisma.service.delete({
      where: { id },
    });
  }
  
};
