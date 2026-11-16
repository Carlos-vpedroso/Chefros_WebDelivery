
import prisma from "../../config/prisma";

export const roleService = {
  // -----------------------------
  // CREATE
  // -----------------------------
  async create(data: {
    name: string;
    permissions: any; // JSON
    businessId: string;
  }) {
    return await prisma.role.create({
      data: {
        name: data.name,
        permissions: data.permissions,
        businessId: data.businessId,
      },
    });
  },

  // -----------------------------
  // FIND ALL (por empresa)
  // -----------------------------
  async findAllByBusiness(slug: string) {
    const business = await prisma.business.findUnique({
        where: {
            slug
        }
    })

    if(!business){
        throw new Error ("Nenhuma empresa encontrada para o Slug fornecido.")
    }

    return prisma.role.findMany({
      where: {
        businessId: business?.id
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  // -----------------------------
  // FIND BY ID
  // -----------------------------
  async findById(id: string, businessId: string) {
    return await prisma.role.findFirst({
      where: {
        id,
        businessId,
      },
      include: {
        employees: true,
      },
    });
  },

  // -----------------------------
  // UPDATE
  // -----------------------------
  async update(
    id: string,
    businessId: string,
    data: {
      name?: string;
      permissions?: any; // JSON
    }
  ) {
    // garante que o role pertence à empresa
    const roleExists = await prisma.role.findFirst({
      where: { id, businessId },
    });

    if (!roleExists) {
      throw new Error("Cargo não encontrado para esta empresa");
    }

    return await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        permissions: data.permissions,
      },
    });
  },

  // -----------------------------
  // DELETE
  // -----------------------------
  async delete(id: string, businessId: string) {
    // impede deletar cargo que ainda possui funcionários
    const role = await prisma.role.findFirst({
      where: { id, businessId },
      include: {
        employees: true,
      },
    });

    if (!role) {
      throw new Error("Cargo não encontrado para esta empresa");
    }

    if (role.employees.length > 0) {
      throw new Error("Não é possível excluir um cargo com funcionários vinculados");
    }

    return await prisma.role.delete({
      where: { id },
    });
  },
};
