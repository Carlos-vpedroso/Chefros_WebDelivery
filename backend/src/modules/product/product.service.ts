import prisma from "../../config/prisma";
import { Product } from "@prisma/client";
import { activityLogService } from "../activityLog/activityLog.service";

export const productService = {
  // 🔍 Busca todos os produtos de uma empresa com filtros e includes otimizados
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
    return prisma.product.findMany({
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
        promotionItem: {
          where: {
            promotion: { active: true },
          },
          include: {
            promotion: true,
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

  // 🔍 Busca produto por ID com relação à categoria e empresa
  async findById(id: string) {
    return prisma.product.findUnique({
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

  async create(data: Product) {
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
      type: "PRODUCT_CREATED",
      title: "Produto cadastrado",
      description: `Produto ${data.name} foi criado`,
      actorType: "EMPLOYEE",
    });

    return prisma.product.create({
      data: {
        businessId: data.businessId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
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

  async update(id: string, data: Partial<Product>) {
    // Verifica se produto existe e não foi deletado
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      throw new Error("Produto não encontrado");
    }

    // Valida categoryId se for fornecido
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: data.categoryId,
          businessId: existingProduct.businessId,
        },
      });

      if (!category) {
        throw new Error("Categoria não encontrada");
      }
    }

    return prisma.product.update({
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

  async canDelete(productId: string) {
    const [combo, promotion, order] = await Promise.all([
      prisma.comboItem.findFirst({
        where: { productId },
        select: { id: true },
      }),
      prisma.promotionItem.findFirst({
        where: { productId },
        select: { id: true },
      }),
      prisma.orderItem.findFirst({
        where: { productId },
        select: { id: true },
      }),
    ]);

    return {
      hasCombo: !!combo,
      hasPromotion: !!promotion,
      hasOrder: !!order,
    };
  },

  // 🗑️ Exclusão permanente (apenas para admin)
  async permanentDelete(id: string, employeeId?: string) {
    const usage = await this.canDelete(id);

    if (usage.hasCombo || usage.hasPromotion || usage.hasOrder) {
      throw new Error(
        "Este produto não pode ser excluído pois está vinculado a um combo, promoção ou pedido."
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        businessId: true,
      },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    await activityLogService.create({
      businessId: product.businessId,
      type: "PRODUCT_DELETED",
      title: "Produto excluído",
      description: `Produto ${product.name} foi excluído`,
      actorType: "EMPLOYEE",
      ...(employeeId && { employeeId }),
    });

    return prisma.product.delete({
      where: { id },
    });
  },
};
