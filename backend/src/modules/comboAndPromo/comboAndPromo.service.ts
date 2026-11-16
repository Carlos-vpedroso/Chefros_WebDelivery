import {
  ComboItemType,
  Prisma,
  PromotionItemType,
  PromotionType,
} from "@prisma/client";
import prisma from "../../config/prisma";

export const comboAndPromoService = {
  async findComboBySlug(slug: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
    });
    if (!business) {
      throw new Error("Empresa não encontrada para o slug informado.");
    }
    return prisma.combo.findMany({
      where: { businessId: business.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                description: true,
                price: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                description: true,
              },
            },
          },
        },
      },
    });
  },
  async createCombo(data: {
    name: string;
    description?: string;
    price: number;
    businessId: string;
    active?: boolean;
    items: {
      type: ComboItemType;
      productId?: string;
      serviceId?: string;
      quantity: number;
    }[];
  }) {
    if (!data.items || data.items.length === 0) {
      throw new Error("O combo precisa ter ao menos um item.");
    }
    return prisma.$transaction(async (tx) => {
      const combo = await tx.combo.create({
        data: {
          name: data.name,
          description: data.description,
          price: new Prisma.Decimal(data.price),
          active: data.active ?? true,
          businessId: data.businessId,

          items: {
            create: data.items.map((item) => {
              if (item.type === "PRODUCT") {
                if (!item.productId) {
                  throw new Error("productId é obrigatório para item PRODUCT");
                }

                return {
                  type: ComboItemType.PRODUCT,
                  productId: item.productId,
                  quantity: item.quantity ?? 1,
                };
              }

              if (item.type === "SERVICE") {
                if (!item.serviceId) {
                  throw new Error("serviceId é obrigatório para item SERVICE");
                }

                return {
                  type: ComboItemType.SERVICE,
                  serviceId: item.serviceId,
                  quantity: item.quantity ?? 1,
                };
              }

              throw new Error("Tipo de item inválido no combo");
            }),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      return combo;
    });
  },
  async updateCombo(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      active: boolean;
      items: {
        type: ComboItemType;
        productId?: string;
        serviceId?: string;
        quantity: number;
      }[];
    }>
  ) {
    return prisma.$transaction(async (tx) => {
      // Verifica se o combo existe
      const existingCombo = await tx.combo.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existingCombo) {
        throw new Error("Combo não encontrado");
      }

      // Atualiza dados básicos do combo
      const combo = await tx.combo.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price:
            typeof data.price === "number"
              ? new Prisma.Decimal(data.price)
              : undefined,
          active: data.active,
        },
      });

      // Se vier items → recria
      if (data.items) {
        if (data.items.length === 0) {
          throw new Error("O combo precisa ter ao menos um item");
        }

        // Remove itens antigos
        await tx.comboItem.deleteMany({
          where: { comboId: id },
        });

        // Cria novos itens
        await tx.comboItem.createMany({
          data: data.items.map((item) => {
            if (item.type === ComboItemType.PRODUCT) {
              if (!item.productId) {
                throw new Error("productId é obrigatório para PRODUCT");
              }

              return {
                comboId: id,
                type: ComboItemType.PRODUCT,
                productId: item.productId,
                quantity: item.quantity ?? 1,
              };
            }

            if (item.type === ComboItemType.SERVICE) {
              if (!item.serviceId) {
                throw new Error("serviceId é obrigatório para SERVICE");
              }

              return {
                comboId: id,
                type: ComboItemType.SERVICE,
                serviceId: item.serviceId,
                quantity: item.quantity ?? 1,
              };
            }

            throw new Error("Tipo de item inválido");
          }),
        });
      }

      // Retorna combo atualizado com itens
      return tx.combo.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    });
  },

  async deleteCombo(id: string) {
    return prisma.combo.delete({
      where: { id },
    });
  },

  async findPromoBySlug(slug: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
    });
    if (!business) {
      throw new Error("Empresa não encontrada para o slug informado.");
    }
    return prisma.promotion.findMany({
      where: { businessId: business.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                description: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                description: true,
              },
            },
          },
        },
      },
    });
  },
  async createPromo(data: {
    businessId: string;
    name: string;
    type: PromotionType;
    value?: number;
    percentage?: number;
    startDate?: string;
    endDate?: string;
    items: {
      type: PromotionItemType;
      productId?: string;
      serviceId?: string;
    }[];
  }) {
    const {
      businessId,
      name,
      type,
      value,
      percentage,
      startDate,
      endDate,
      items,
    } = data;

    // ===============================
    // Validações básicas
    // ===============================
    if (!businessId) {
      throw new Error("businessId é obrigatório");
    }

    if (!name) {
      throw new Error("Nome da promoção é obrigatório");
    }

    if (type === "FIXED_DISCOUNT" && !value) {
      throw new Error("value é obrigatório para FIXED_DISCOUNT");
    }

    if (type === "PERCENTAGE" && !percentage) {
      throw new Error("percentage é obrigatório para PERCENTAGE");
    }

    // ===============================
    // Validação dos itens
    // ===============================
    for (const item of items) {
      if (item.type === "PRODUCT" && !item.productId) {
        throw new Error("productId é obrigatório quando type = PRODUCT");
      }

      if (item.type === "SERVICE" && !item.serviceId) {
        throw new Error("serviceId é obrigatório quando type = SERVICE");
      }
    }

    // ===============================
    // Criação da promoção
    // ===============================
    const promotion = await prisma.promotion.create({
      data: {
        businessId,
        name,
        type,
        value: type === "FIXED_DISCOUNT" ? value : null,
        percentage: type === "PERCENTAGE" ? percentage : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        active: true,
        items: {
          create: items.map((item) => ({
            type: item.type,
            productId: item.type === "PRODUCT" ? item.productId : null,
            serviceId: item.type === "SERVICE" ? item.serviceId : null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            service: true,
          },
        },
      },
    });

    return promotion;
  },
  async updatePromo(
    promotionId: string,
    data: {
      name?: string;
      type?: PromotionType;
      value?: number;
      percentage?: number;
      startDate?: string;
      endDate?: string;
      active?: boolean;
      items?: {
        type: PromotionItemType;
        productId?: string;
        serviceId?: string;
      }[];
    }
  ) {
    if (!promotionId) {
      throw new Error("promotionId é obrigatório");
    }

    // ===============================
    // Verifica se a promoção existe
    // ===============================
    const promoExists = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promoExists) {
      throw new Error("Promoção não encontrada");
    }

    const finalType = data.type ?? promoExists.type;

    // ===============================
    // Validações de tipo
    // ===============================
    if (
      finalType === "FIXED_DISCOUNT" &&
      data.value === undefined &&
      promoExists.value === null
    ) {
      throw new Error("value é obrigatório para FIXED_DISCOUNT");
    }

    if (
      finalType === "PERCENTAGE" &&
      data.percentage === undefined &&
      promoExists.percentage === null
    ) {
      throw new Error("percentage é obrigatório para PERCENTAGE");
    }

    // ===============================
    // Validação dos itens (se enviados)
    // ===============================
    if (data.items) {
      for (const item of data.items) {
        if (item.type === "PRODUCT" && !item.productId) {
          throw new Error("productId é obrigatório quando type = PRODUCT");
        }

        if (item.type === "SERVICE" && !item.serviceId) {
          throw new Error("serviceId é obrigatório quando type = SERVICE");
        }
      }
    }

    // ===============================
    // Atualização
    // ===============================
    const promotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        name: data.name,
        type: data.type,
        value: data.value !== undefined ? data.value : undefined,
        percentage: data.percentage !== undefined ? data.percentage : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        active: data.active,

        ...(data.items && {
          items: {
            deleteMany: {}, // remove todos os itens antigos
            create: data.items.map((item) => ({
              type: item.type,
              productId: item.type === "PRODUCT" ? item.productId : null,
              serviceId: item.type === "SERVICE" ? item.serviceId : null,
            })),
          },
        }),
      },
      include: {
        items: {
          include: {
            product: true,
            service: true,
          },
        },
      },
    });

    return promotion;
  },
  async deletePromo(id: string) {
    return prisma.promotion.delete({
      where: { id },
    });
  },
};
