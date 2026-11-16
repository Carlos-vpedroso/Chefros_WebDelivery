import { Request, Response } from "express";
import { tableService } from "./table.service";

export const tableController = {
  // -------------------------------------------------
  // 📌 Buscar todas as mesas de um estabelecimento
  // -------------------------------------------------
  async getAll(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(400).json({ error: "slug é obrigatório" });
      }

      const tables = await tableService.findAll(slug as string);
      return res.status(200).json(tables);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar mesas" });
    }
  },

  // -------------------------------------------------
  // 📌 Buscar mesa por ID
  // -------------------------------------------------
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const mesa = await tableService.findOne(id);
      if (!mesa) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }

      return res.status(200).json(mesa);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar mesa" });
    }
  },

  // -------------------------------------------------
  // 📌 Criar nova mesa
  // -------------------------------------------------
  async create(req: Request, res: Response) {
    try {
      const { businessId, name, capacity, status = "AVAILABLE" } = req.body;

      if (!businessId || !name) {
        return res.status(400).json({
          message: "businessId e name são obrigatórios",
        });
      }

      // valida status caso enviado
      if (status && !["AVAILABLE", "OCCUPIED", "CLOSED"].includes(status)) {
        return res.status(400).json({
          message: "Status inválido. Use AVAILABLE, OCCUPIED ou CLOSED.",
        });
      }

      const newTable = await tableService.create({
        businessId,
        name,
        capacity,
        status,
      });

      return res.status(201).json(newTable);
    } catch (error: any) {
      console.error(error);

      // erros Prisma
      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Já existe uma mesa com este nome neste estabelecimento",
        });
      }

      return res.status(500).json({ error: "Erro ao criar mesa" });
    }
  },

  // -------------------------------------------------
  // 📌 Atualizar mesa
  // -------------------------------------------------
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, capacity, status } = req.body;

      if (status && !["AVAILABLE", "OCCUPIED", "CLOSED"].includes(status)) {
        return res.status(400).json({
          message: "Status inválido. Use AVAILABLE, OCCUPIED ou CLOSED.",
        });
      }

      const updated = await tableService.update(id, {
        name,
        capacity,
        status,
      });

      return res.status(200).json(updated);
    } catch (error: any) {
      console.error(error);

      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Já existe uma mesa com este nome neste estabelecimento",
        });
      }

      return res.status(500).json({ error: "Erro ao atualizar mesa" });
    }
  },

  // -------------------------------------------------
  // 📌 Deletar mesa
  // -------------------------------------------------
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // regra de negócio opcional: impedir deletar mesa com pedido ativo
      const mesa = await tableService.findOne(id);

      if (mesa?.ticketId) {
        return res.status(400).json({
          message: "Não é possível excluir mesa com pedido ativo",
        });
      }

      await tableService.delete(id);

      return res.status(200).json({
        message: "Mesa deletada com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar mesa" });
    }
  },
};
