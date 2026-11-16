import { Request, Response } from "express";
import { orderService } from "./order.service";
import { OrderStatus, OrderType } from "@prisma/client";

export const orderController = {
  async getAll(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { type, status } = req.query;

      if (type && !Object.values(OrderType).includes(type as OrderType)) {
        return res.status(400).json({
          message: "Invalid order type",
        });
      }

      if (
        status &&
        !Object.values(OrderStatus).includes(status as OrderStatus)
      ) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      let options = {
        type: type as OrderType,
        status: status as OrderStatus,
      };
      const orders = await orderService.getAll(slug, options);

      return res.status(200).json(orders);
    } catch (error) {}
  },
  async create(req: Request, res: Response) {
    try {
      const { businessId, order } = req.body;
      // ------------------------------
      // Validação mínima do body
      // ------------------------------
      if (!businessId) {
        return res.status(400).json({
          error: "businessId não encontrado na requisição.",
        });
      }

      if (!order.type) {
        return res.status(400).json({ error: "Type é obrigatório." });
      }

      if (order.type === "DELIVERY" && !order.address) {
        return res.status(400).json({
          error: "O endereço é obrigatório.",
        });
      }

      const hasUserOrCustomer = !!order.userId || !!order.customerId;
      const hasNameAndPhone = !!order.name && !!order.phone;
      if (!hasUserOrCustomer && !hasNameAndPhone && !order.tableId) {
        return res.status(400).json({
          error:
            "Nome e telefone são obrigatórios quando não há usuário ou cliente identificado.",
        });
      }

      const hasItems = order.items && order.items.length > 0;
      const hasServices = order.services && order.services.length > 0;
      const hasCombos = order.combos && order.combos.length > 0;

      if (!hasItems && !hasServices && !hasCombos) {
        return res.status(400).json({
          error: "A ordem deve conter itens, serviços ou combos.",
        });
      }

      // ------------------------------
      // Chama o serviço
      // ------------------------------
      const result = await orderService.create(businessId, order);

      if ("error" in result) {
        return res.status(400).json({ success: false, error: result.error });
      }

      return res.status(201).json({
        order: result.order,
        ticket: result.ticket,
        addedAmount: result.addedAmount,
      });
    } catch (error: any) {
      console.error("❌ Erro no create OrderController:", error);
      return res.status(500).json({
        error: "Erro interno ao criar ordem.",
        detail: error.message,
      });
    }
  },
  async changeStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (
        status &&
        !Object.values(OrderStatus).includes(status as OrderStatus)
      ) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }
      const updatedOrder = await orderService.changeStatus(id, status);
      return res.status(200).json(updatedOrder);
    } catch (error) {}
  },
};
