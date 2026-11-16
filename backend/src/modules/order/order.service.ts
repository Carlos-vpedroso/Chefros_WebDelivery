import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PromotionType,
  WorkDays,
} from "@prisma/client";
import prisma from "../../config/prisma";
import { activityLogService } from "../activityLog/activityLog.service";
import { isBusinessOpen } from "../../utils/helpers";
import { getIO } from "../../socket";

// **************************************************
// Helpers para calculo das Promoções no create Order
// **************************************************
function isPromotionValid(promotion: {
  active: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  const now = new Date();

  if (!promotion.active) return false;
  if (promotion.startDate && promotion.startDate > now) return false;
  if (promotion.endDate && promotion.endDate < now) return false;

  return true;
}

function applyPromotion(
  price: number,
  promotion?: {
    name: string;
    type: PromotionType;
    value?: number | null;
    percentage?: number | null;
  }
) {
  if (!promotion) {
    return {
      finalPrice: price,
      snapshot: null,
    };
  }

  let finalPrice = price;

  if (promotion.type === "FIXED_DISCOUNT") {
    finalPrice = price - Number(promotion.value ?? 0);
  }

  if (promotion.type === "PERCENTAGE") {
    finalPrice = price - price * (Number(promotion.percentage ?? 0) / 100);
  }

  return {
    finalPrice: Math.max(finalPrice, 0),
    snapshot: {
      promotionName: promotion.name,
      promotionType: promotion.type,
      promotionValue:
        promotion.type === "FIXED_DISCOUNT"
          ? promotion.value
          : promotion.percentage,
    },
  };
}

export const orderService = {
  async getAll(
    slug: string,
    options?: {
      type?: OrderType;
      status?: OrderStatus;
    }
  ) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }

    return prisma.order.findMany({
      where: {
        ticket: {
          businessId: business.id,
        },
        ...(options?.status
          ? { status: options.status }
          : {
              status: {
                notIn: ["COMPLETED", "CANCELLED"],
              },
            }),
        ...(options?.type && { type: options.type }),
      },
      include: {
        ticket: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            status: true,
            tableId: true,
            table: {
              select: { name: true },
            },
            paymentMethod: true,
            totalAmount: true,
          },
        },
        items: {
          include: {
            product: true,
            combo: {
              include: { items: { include: { product: true, service: true } } },
            },
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async create(
    businessId: string,
    order: {
      tableId?: string;
      userId?: string;
      employeeId?: string;
      customerId?: string;
      type: OrderType;
      paymentMethod?: PaymentMethod;
      name?: string;
      phone?: string;
      address?: {
        cep: string;
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        complemento?: string;
      };
      items?: { productId: string; quantity: number; note?: string }[];
      services?: { serviceId: string; quantity: number; note?: string }[];
      combos?: { comboId: string; quantity: number; note?: string }[];
    }
  ) {
    try {
      const hasItems = order.items && order.items.length > 0;
      const hasServices = order.services && order.services.length > 0;
      const hasCombos = order.combos && order.combos.length > 0;

      if (!order.tableId && order.type === "DELIVERY" && !order.address) {
        throw new Error("O endereço é obrigatório para pedidos delivery.");
      }

      if (!hasItems && !hasServices && !hasCombos) {
        throw new Error("A ordem deve conter itens, serviços ou combos.");
      }

      const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: {
          workDays: {
            include: { workHours: true },
          },
        },
      });

      if (business && !isBusinessOpen(business.workDays as any)) {
        throw new Error("A empresa está fechada no momento.");
      }

      let ticket;
      // --------------------------------------------------------------------
      // 1. Procurar ticket existente baseado nos filtros enviados
      // --------------------------------------------------------------------
      if (order.tableId) {
        const ticketFilter: any = { status: "OPEN", tableId: order.tableId };
        ticket = await prisma.ticket.findFirst({ where: ticketFilter });
      }

      // --------------------------------------------------------------------
      // 2. Se NÃO existir ticket aberto → cria um novo
      // --------------------------------------------------------------------
      if (!ticket) {
        // 1) Criar Ticket
        ticket = await prisma.ticket.create({
          data: {
            status: "OPEN",
            businessId,
            paymentMethod: order.paymentMethod || null,
            tableId: order.tableId || null,
            userId: order.userId || null,
            employeeId: order.employeeId || null,
            customerId: order.customerId || null,
            address: order.address ?? undefined,
            name: order.name || null,
            phone: order.phone || null,

            totalAmount: 0,
          },
        });

        // 2) Se for mesa, vincular o ticket como ativo da mesa
        if (order.tableId) {
          await prisma.table.update({
            where: { id: order.tableId },
            data: {
              ticketId: ticket.id, // ticket ativo da mesa
              status: "OCCUPIED",
            },
          });
        }
      }

      // --------------------------------------------------------------------
      // 3. Transação: criar Order + Items + Services + atualizar ticket
      // --------------------------------------------------------------------
      const result = await prisma.$transaction(async (tx) => {
        let itemsData: any[] = [];
        let servicesData: any[] = [];
        let combosData: any[] = [];
        let totalOrderAmount = 0;

        // ---------------------------
        // 3.1 Processar produtos
        // ---------------------------
        if (hasItems) {
          const ids = order.items!.map((i) => i.productId);
          const products = await tx.product.findMany({
            where: { id: { in: ids } },
            include: {
              promotionItem: {
                include: {
                  promotion: true,
                },
              },
            },
          });

          itemsData = order.items!.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
              throw new Error(`Produto ${item.productId} não encontrado`);
            }

            const basePrice = Number(product.price);

            // pegar promoções válidas
            const validPromotionItem = product.promotionItem.find(
              (pi) => pi.promotion && isPromotionValid(pi.promotion)
            );

            const promotion = validPromotionItem?.promotion;

            const { finalPrice, snapshot } = applyPromotion(
              basePrice,
              promotion
                ? {
                    name: promotion.name,
                    type: promotion.type,
                    value: Number(promotion.value),
                    percentage: promotion.percentage,
                  }
                : undefined
            );

            const subtotal = finalPrice * item.quantity;
            totalOrderAmount += subtotal;

            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: finalPrice,
              subtotal,
              note: item.note || null,

              ...(snapshot && snapshot),
            };
          });
        }

        // ---------------------------
        // 3.2 Processar serviços
        // ---------------------------
        if (hasServices) {
          const ids = order.services!.map((i) => i.serviceId);
          const services = await tx.service.findMany({
            where: { id: { in: ids } },
            select: { id: true, price: true },
          });

          const serviceMap = new Map(services.map((s) => [s.id, s.price]));

          servicesData = order.services!.map((srv) => {
            const price = Number(serviceMap.get(srv.serviceId) || 0);
            const subtotal = price * srv.quantity;
            totalOrderAmount += subtotal;

            return {
              serviceId: srv.serviceId,
              quantity: srv.quantity,
              subtotal,
              note: srv.note || null,
            };
          });
        }

        // ---------------------------
        // 3.3 Processar combos
        // ---------------------------
        if (hasCombos) {
          const comboIds = order.combos!.map((c) => c.comboId);

          const combos = await tx.combo.findMany({
            where: {
              id: { in: comboIds },
              active: true,
            },
            include: {
              items: true, // produtos + serviços do combo
            },
          });

          const comboMap = new Map(combos.map((c) => [c.id, c]));

          combosData = order.combos!.map((comboInput) => {
            const combo = comboMap.get(comboInput.comboId);

            if (!combo) {
              throw new Error(`Combo ${comboInput.comboId} não encontrado`);
            }

            const price = Number(combo.price);
            const subtotal = price * comboInput.quantity;

            totalOrderAmount += subtotal;

            return {
              type: "COMBO",
              comboId: combo.id,
              quantity: comboInput.quantity,
              unitPrice: price,
              subtotal,
              note: comboInput.note || null,
            };
          });
        }
        // ---------------------------
        // 3.4 Criar Order
        // ---------------------------
        const createdOrder = await tx.order.create({
          data: {
            ticketId: ticket.id,
            type: order.type,
            totalAmount: totalOrderAmount,
          },
        });

        if (itemsData.length > 0) {
          await tx.orderItem.createMany({
            data: itemsData.map((i) => ({
              orderId: createdOrder.id,
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              subtotal: i.subtotal,
              note: i.note,
              promotionName: i.promotionName,
              promotionType: i.promotionType,
              promotionValue: i.promotionValue,
            })),
          });
        }

        if (servicesData.length > 0) {
          await tx.orderService.createMany({
            data: servicesData.map((s) => ({
              orderId: createdOrder.id,
              serviceId: s.serviceId,
              quantity: s.quantity,
              subtotal: s.subtotal,
              note: s.note || undefined,
            })),
          });
        }

        if (combosData.length > 0) {
          await tx.orderItem.createMany({
            data: combosData.map((c) => ({
              orderId: createdOrder.id,
              type: "COMBO",
              comboId: c.comboId,
              quantity: c.quantity,
              unitPrice: c.unitPrice,
              subtotal: c.subtotal,
              note: c.note || undefined,
            })),
          });
        }

        // ---------------------------
        // 3.5 Atualizar total do ticket
        // ---------------------------
        const updatedTicket = await tx.ticket.update({
          where: { id: ticket.id },
          data: {
            totalAmount: Number(ticket.totalAmount) + totalOrderAmount,
          },
        });

        const updatedOrder = await tx.order.findUnique({
          include: {
            items: {
              include: {
                product: true,
                combo: { include: { items: { include: { product: true } } } },
              },
            },
            services: { include: { service: true } },
            ticket: {
              select: {
                id: true,
                name: true,
                phone: true,
                address: true,
                status: true,
                tableId: true,
                table: {
                  select: { name: true },
                },
                paymentMethod: true,
                totalAmount: true,
                businessId: true,
                employeeId: true,
              },
            },
          },
          where: { id: createdOrder.id },
        });

        return {
          ticket: updatedTicket,
          order: updatedOrder,
          addedAmount: totalOrderAmount,
        };
      });
      await activityLogService.create({
        businessId: businessId,
        type: "ORDER_CREATED",
        title: "Pedido criado",
        description: `Pedido #${result.order?.id} foi criado`,
        actorType: "EMPLOYEE",
      });

      getIO().to(`business:${business?.slug}`).emit("order:new", result.order);

      if (order.tableId) {
        getIO().to(`business:${business?.slug}`).emit("table:updateStatus", {
          id: order.tableId,
          status: "OCCUPIED",
          activeTicket: result.ticket.id,
        });
      }

      return result;
    } catch (error: any) {
      console.error("❌ Erro ao criar order:", error);
      return { error: error.message };
    }
  },

  async changeStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: {
        ticket: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            status: true,
            tableId: true,
            table: {
              select: { name: true },
            },
            paymentMethod: true,
            totalAmount: true,
            businessId: true,
            employeeId: true,
          },
        },
        items: {
          include: {
            product: true,
            combo: {
              include: { items: { include: { product: true, service: true } } },
            },
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });
    if (status === "COMPLETED") {
      await activityLogService.create({
        businessId: order.ticket.businessId as string,
        type: "ORDER_COMPLETED",
        title: "Pedido Finalizado",
        description: `Pedido ${id} finalizado com sucesso`,
        actorType: "EMPLOYEE",
        ...(order.ticket.employeeId && {
          employeeId: order.ticket.employeeId,
        }),
      });
    }

    if (status === "COMPLETED" && !order.ticket.tableId) {
      await prisma.ticket.update({
        where: { id: order.ticket.id },
        data: {
          status: "CLOSED",
        },
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: order.ticket.businessId },
    });

    getIO().to(`business:${business?.slug}`).emit("order:updateStatus", order);

    return order;
  },
};
