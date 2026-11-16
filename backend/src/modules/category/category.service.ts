import prisma from "../../config/prisma";
import { CategoryType } from "@prisma/client";

export const categoryService = {
  // 🔍 Busca todas as categorias de uma empresa
  async findAllByBusiness(slug: string, type?: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
    return prisma.category.findMany({
      where: {
        businessId: business?.id,
        ...(type ? { type: type as any } : {}),
      },
      include: {
        _count: {
          select: {
            products: { where: { active: true } },
            services: { where: { active: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  // 🔍 Busca categoria por ID
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true, name: true, active: true },
        },
        services: {
          select: { id: true, name: true, active: true },
        },
        _count: {
          select: {
            products: true,
            services: true,
          },
        },
      },
    });
  },

  // ➕ Criação de categoria
  async create(data: {
    businessId: string;
    name: string;
    type: CategoryType;
    parentId?: string;
  }) {
    return prisma.category.create({
      data: {
        businessId: data.businessId,
        name: data.name,
        type: data.type,
        parentId: data.parentId || null,
      },
      include: {
        _count: {
          select: {
            products: true,
            services: true,
          },
        },
      },
    });
  },

  // 🔄 Atualização de categoria
  async update(
    id: string,
    data: {
      name: string;
      type: CategoryType;
      parentId?: string;
    }
  ) {
    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        parentId: data.parentId,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            products: true,
            services: true,
          },
        },
      },
    });
  },

  // 🗑️ Exclusão de categoria
  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },

  // 🔍 Verifica se categoria tem produtos/serviços
  async hasProducts(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          take: 1,
        },
        services: {
          take: 1,
        },
      },
    });

    return !!(category?.products.length || category?.services.length);
  },

  // 📊 Busca categorias com contagem de produtos
  async findWithProductCount(businessId: string, type?: string) {
    const categories = await prisma.category.findMany({
      where: {
        businessId,
        ...(type ? { type: type as CategoryType } : {}),
      },
      include: {
        _count: {
          select: {
            products: {
              where: { active: true },
            },
            services: {
              where: { active: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((category) => ({
      ...category,
      productCount: category._count.products + category._count.services,
    }));
  },
};
