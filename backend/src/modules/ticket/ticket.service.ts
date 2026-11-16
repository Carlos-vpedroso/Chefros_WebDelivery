import { PaymentMethod, TicketStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { getIO } from "../../socket";

export const ticketService = {
  async findAllByBusiness(
    slug: string,
    filters?: {
      userId?: string;
      customerId?: string;
      employeeId?: string;
      tableId?: string;
      status?: TicketStatus;
    }
  ) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }
    return prisma.ticket.findMany({
      where: {
        businessId: business.id,
        ...(filters?.userId ? { userId: filters.userId } : {}),
        ...(filters?.customerId ? { customerId: filters.customerId } : {}),
        ...(filters?.employeeId ? { employeeId: filters.employeeId } : {}),
        ...(filters?.tableId ? { tableId: filters.tableId } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
      },
      include: {
        orders: {
          include: {
            services: {
              include: {
                service: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    description: true,
                  },
                },
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    description: true,
                  },
                },
                combo: {
                  include: {
                    items: {
                      include: {
                        product: {
                          select: {
                            id: true,
                            name: true,
                            price: true,
                            imageUrl: true,
                            description: true,
                          },
                        },
                        service: {
                          select: {
                            id: true,
                            name: true,
                            price: true,
                            imageUrl: true,
                            description: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            services: {
              include: {
                service: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    description: true,
                  },
                },
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    description: true,
                  },
                },
                combo: {
                  include: {
                    items: {
                      include: {
                        product: {
                          select: {
                            id: true,
                            name: true,
                            price: true,
                            imageUrl: true,
                            description: true,
                          },
                        },
                        service: {
                          select: {
                            id: true,
                            name: true,
                            price: true,
                            imageUrl: true,
                            description: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async update(
    slug: string,
    ticketId: string,
    data: {
      tableId?: string | null;
      customerId?: string | null;
      userId?: string | null;
      employeeId?: string | null;
      status?: TicketStatus;
      paymentMethod?: PaymentMethod | null;
      totalAmount?: number;
    }
  ) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }

    // Verifica se o ticket pertence à empresa
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, businessId: business.id },
      select: { id: true },
    });

    if (!ticket) {
      throw new Error(`Ticket not found or does not belong to this business`);
    }

    // Atualização
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...(data.tableId !== undefined ? { tableId: data.tableId } : {}),
        ...(data.customerId !== undefined
          ? { customerId: data.customerId }
          : {}),
        ...(data.userId !== undefined ? { userId: data.userId } : {}),
        ...(data.employeeId !== undefined
          ? { employeeId: data.employeeId }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.paymentMethod !== undefined
          ? { paymentMethod: data.paymentMethod }
          : {}),
        ...(data.totalAmount !== undefined
          ? { totalAmount: data.totalAmount }
          : {}),
      },
      include: {
        orders: {
          include: {
            items: { include: { product: true } },
            services: { include: { service: true } },
          },
        },
      },
    });

    return updated;
  },

  async checkout(
    slug: string,
    ticketId: string,
    data: {
      paymentMethod: PaymentMethod;
      employeeId?: string;
      tableId?: string;
      userId?: string;
      customerId?: string;
    }
  ) {
    // Verifica se a empresa existe
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }

    // Busca o ticket e verifica se pertence ao estabelecimento
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        businessId: business.id,
      },
      include: {
        orders: {
          include: {
            items: true,
            services: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new Error("Ticket not found or does not belong to this business");
    }

    if (ticket.status !== "OPEN") {
      throw new Error("Only OPEN tickets can be closed");
    }

    //verifica a mesa com o business.id
    if (data.tableId) {
      const table = await prisma.table.findFirst({
        where: {
          id: data.tableId,
          businessId: business.id,
        },
        select: {
          id: true,
          ticketId: true,
        },
      });

      if (!table) {
        throw new Error("Table not found for this business");
      }

      // ⚠ Se a mesa tem um ticket ativo e é exatamente este ticket, limpar
      if (table.ticketId === ticketId) {
        await prisma.table.update({
          where: { id: table.id },
          data: {
            ticketId: null,
            status: "AVAILABLE",
          },
        });
      }
    }

    // Calcula o valor total somando orders, caso queira garantir
    const totalAmount = ticket.orders.reduce((total, order) => {
      return total + Number(order.totalAmount);
    }, 0);

    // Finaliza a comanda
    const closedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "CLOSED",
        paymentMethod: data.paymentMethod,
        totalAmount: totalAmount, // garante que o total final está correto
        ...(data.employeeId !== undefined && { employeeId: data.employeeId }),
        ...(data.customerId !== undefined && { customerId: data.customerId }),
        ...(data.userId !== undefined && { userId: data.userId }),
      },
      include: {
        orders: {
          include: {
            items: { include: { product: true } },
            services: { include: { service: true } },
          },
        },
      },
    });
    if (data.tableId) {
      getIO().to(`business:${slug}`).emit("table:updateStatus", {
        id: data.tableId,
        status: "AVAILABLE",
        activeTicket: null,
      });
    }

    return closedTicket;
  },
};
