import { TableStatus } from "@prisma/client";
import QRCode from "qrcode";
import prisma from "../../config/prisma";

export const tableService = {
  // ---------------------
  // Buscar todas as mesas
  // ---------------------
  async findAll(slug: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }
    return prisma.table.findMany({
      where: { businessId: business.id },
      include: {
        ticket: true,
        tickets: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ------------------------
  // Criar nova mesa
  // ------------------------
  async create(data: {
    businessId: string;
    name: string;
    capacity?: number;
    status?: string;
  }) {
    try {
      // 1️⃣ Busca a empresa para pegar o slug
      const business = await prisma.business.findUnique({
        where: { id: data.businessId },
      });

      if (!business) {
        return { success: false, error: "Empresa não encontrada" };
      }
      // 2️⃣ Cria a mesa inicialmente SEM QRCode
      const newTable = await prisma.table.create({
        data: {
          businessId: data.businessId,
          name: data.name,
          capacity: data.capacity,
          status: (data.status as TableStatus) ?? "AVAILABLE",
        },
      });
      const url = `${process.env.SITE_URL}/${business.slug}/cardapio?mesa=${newTable.id}`;

      // 4️⃣ Gera o QRCode em base64
      const qrCodeBase64 = await QRCode.toDataURL(url);

      // 5️⃣ Atualiza a mesa com o QRCode
      return prisma.table.update({
        where: { id: newTable.id },
        data: {
          qrCodeUrl: qrCodeBase64,
        },
      });
    } catch (error) {
      console.error("Erro ao criar mesa:", error);
      return { error: "Erro ao criar mesa" };
    }
  },

  // ------------------------
  // Buscar uma mesa por ID
  // ------------------------
  async findOne(id: string) {
    return prisma.table.findUnique({
      where: { id },
      include: {
        ticket: true,
        tickets: true,
      },
    });
  },

  // ------------------------
  // Atualizar mesa
  // ------------------------
  async update(
    id: string,
    data: Partial<{
      name: string;
      capacity: number;
      status: string;
    }>
  ) {
    return prisma.table.update({
      where: { id },
      data: {
        name: data.name,
        capacity: data.capacity,
        status: data.status as TableStatus,
      },
    });
  },

  // ------------------------
  // Deletar mesa
  // ------------------------
  async delete(id: string) {
    return prisma.table.delete({
      where: { id },
    });
  },
};
