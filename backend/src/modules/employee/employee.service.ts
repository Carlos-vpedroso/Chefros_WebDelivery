import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { Business, Prisma } from "@prisma/client";

export const employeeService = {
  async findAll() {
    return prisma.employee.findMany({
      include: { business: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: { business: true },
    });
  },

  async findBySlug(slug: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
    });
    if (!business) {
      throw new Error("Nenhuma empresa encontrada para o Slug fornecido.");
    }
    return prisma.employee.findMany({
      where: { businessId: business.id },
      include: { role: true },
      orderBy: { name: "asc" },
    });
  },

  async findToLogin(email: string) {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: {
        business: true,
        role: { select: { name: true, permissions: true } },
      },
    });
    if (!employee) {
      throw new Error("Nenhum Funcionário encontrado.");
    }

    const payload: {
      id: string;
      name: string;
      email: string;
      password: string;
      businessId: string;
      roleId: string;
      createdAt: Date;
      updatedAt: Date;
      business: Business;
      role: string;
      permissions: Prisma.JsonValue;
    } = {
      ...employee,
      role: employee.role.name,
      permissions: employee.role.permissions ?? {},
    };
    return payload;
  },

  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.employee.create({
      data: { ...data, password: hashedPassword },
      include: { role: true },
    });
  },

  async update(id: string, data: any) {
    return prisma.employee.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.employee.delete({ where: { id } });
  },
};
