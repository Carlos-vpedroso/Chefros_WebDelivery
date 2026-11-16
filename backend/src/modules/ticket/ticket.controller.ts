import { Request, Response } from "express";
import { ticketService } from "./ticket.service";

export const ticketController = {
  // -------------------------------------------------------------
  // FIND ALL BY BUSINESS
  // -------------------------------------------------------------
  async findAllByBusiness(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const filters = {
        userId: req.query.userId as string | undefined,
        customerId: req.query.customerId as string | undefined,
        employeeId: req.query.employeeId as string | undefined,
        tableId: req.query.tableId as string | undefined,
        status: req.query.status as any,
      };

      const tickets = await ticketService.findAllByBusiness(slug, filters);

      return res.status(200).json(tickets);
    } catch (error: any) {
      console.error("❌ Controller Error (findAllByBusiness):", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Erro ao buscar tickets.",
      });
    }
  },

  // -------------------------------------------------------------
  // FIND BY ID
  // -------------------------------------------------------------
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ticket = await ticketService.findById(id);

      if (!ticket) {
        return res.status(404).json({
          error: "Ticket não encontrado.",
        });
      }

      return res.status(200).json(ticket);
    } catch (error: any) {
      console.error("❌ Controller Error (findById):", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar ticket.",
      });
    }
  },

  // -------------------------------------------------------------
  // CHECKOUT (Finalizar Comanda)
  // -------------------------------------------------------------
  async checkout(req: Request, res: Response) {
    try {
      const { slug, ticketId } = req.params;

      const { paymentMethod, employeeId, customerId, userId, tableId } =
        req.body;

      if (!slug && !ticketId && !paymentMethod) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios faltando.",
        });
      }

      if (
        paymentMethod &&
        !["PIX", "CREDIT_CARD", "DEBIT_CARD", "CASH", "BANK_TRANSFER"].includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          message: "paymentMethod inválido.",
        });
      }

      const closedTicket = await ticketService.checkout(slug, ticketId, {
        paymentMethod,
        employeeId,
        customerId,
        userId,
        tableId,
      });

      return res.status(200).json(closedTicket);
    } catch (error: any) {
      console.error("❌ Controller Error (checkout):", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Erro ao encerrar a comanda.",
      });
    }
  },
};
