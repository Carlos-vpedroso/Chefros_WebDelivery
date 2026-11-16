import prisma from "../../config/prisma";

export const userService = {
  // Buscar todos os usuários
  async findAll() {
    return prisma.user.findMany({
      include: { addresses: true, orders: true },
      orderBy: { createdAt: "desc" },
    });
  },

  // Buscar um usuário pelo ID
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { addresses: true, orders: true },
    });
  },

  // Criar um novo usuário
  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data });
  },

  // Atualizar um usuário
  async update(
    id: string,
    data: Partial<{ name: string; email: string; password: string }>
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  // Deletar um usuário
  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
