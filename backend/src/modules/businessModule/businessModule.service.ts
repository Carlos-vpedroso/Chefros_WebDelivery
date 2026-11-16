import { ModuleType } from "@prisma/client";
import prisma from "../../config/prisma";

export const businessModuleService = {
  async findBySlug(slug: string) {
    // 1️⃣ Verifica se a empresa existe
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });

    if (!business) {
      throw new Error("Empresa não encontrada para o slug informado.");
    }

    // 2️⃣ Busca todos os módulos ativos (ou todos, se preferir)
    const modules = await prisma.businessModule.findMany({
      where: {
        businessId: business.id,
      },
      select: {
        id: true,
        moduleType: true,
        active: true,
      },
    });

    // 3️⃣ Retorna modulos
    return modules;
  },
  async create(data: {
    businessId: string;
    moduleType: ModuleType;
    config?: Record<string, any> | null;
  }) {
    const { businessId, moduleType, config } = data;

    // 🔹 1. Verifica se o módulo já existe para essa empresa
    const existingModule = await prisma.businessModule.findUnique({
      where: {
        businessId_moduleType: {
          businessId,
          moduleType,
        },
      },
    });

    if (existingModule) {
      throw new Error(
        `O módulo ${moduleType} já está vinculado a esta empresa.`
      );
    }

    // 🔹 2. Cria o novo módulo
    const newModule = await prisma.businessModule.create({
      data: {
        businessId,
        moduleType,
        active: true,
        activatedAt: new Date(),
      },
    });

    return newModule;
  },
  async delete(id: string) {
    return prisma.businessModule.delete({
      where: { id },
    });
  },
};
