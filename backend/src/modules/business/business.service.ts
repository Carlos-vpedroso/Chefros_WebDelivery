import prisma from "../../config/prisma";

export const businessService = {
  async findAll() {
    return prisma.business.findMany({
      include: { employees: true, modules: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.business.findUnique({
      where: { id },
      include: { employees: true, modules: true },
    });
  },

  async findBySlug(slug: string) {
    return prisma.business.findUnique({
      where: { slug },
      include: {
        modules: {
          select: {
            id: true,
            moduleType: true,
            active: true,
          },
        },
        workDays: {
          include: {
            workHours: true,
          },
        },
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.business.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.business.delete({ where: { id } });
  },
};
