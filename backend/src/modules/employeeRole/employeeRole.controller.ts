import { Request, Response } from "express";
import { roleService } from "./employeeRole.service";

export const roleController = {
  // -----------------------------
  // CREATE
  // -----------------------------
  async create(req: Request, res: Response) {
    try {
      const { name, permissions, businessId } = req.body;

      // ✅ Validação básica
      if (!name || !permissions) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios: 'name' e 'permissions'.",
        });
      }

      const role = await roleService.create({
        name,
        permissions,
        businessId,
      });

      return res.status(201).json({
        success: true,
        message: "Cargo criado com sucesso",
        role,
      });
    } catch (error: any) {
      console.error("❌ Erro ao criar cargo:", error);

      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "Já existe um cargo com este nome para a empresa.",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Erro interno ao criar cargo.",
      });
    }
  },

  // -----------------------------
  // LIST (por empresa)
  // -----------------------------
  async list(req: Request, res: Response) {
    try {
      const { slug } = req.params; // slug da empresa

      if (!slug) {
        return res.status(400).json({
          success: false,
          error: "Slug da empresa não informado.",
        });
      }

      const roles = await roleService.findAllByBusiness(slug);

      return res.status(200).json(
        roles,
      );
    } catch (error: any) {
      console.error("❌ Erro ao listar cargos:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Erro interno ao listar cargos.",
      });
    }
  },

  // -----------------------------
  // GET BY ID
  // -----------------------------
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const businessId = (req as any).businessId;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Parâmetro 'id' é obrigatório.",
        });
      }

      const role = await roleService.findById(id, businessId);

      if (!role) {
        return res.status(404).json({
          success: false,
          error: "Cargo não encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        role,
      });
    } catch (error) {
      console.error("❌ Erro ao buscar cargo:", error);

      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar cargo.",
      });
    }
  },

  // -----------------------------
  // UPDATE
  // -----------------------------
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;
      const businessId = (req as any).businessId;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Parâmetro 'id' é obrigatório.",
        });
      }

      if (!name && !permissions) {
        return res.status(400).json({
          success: false,
          error: "Informe ao menos um campo para atualização.",
        });
      }

      const role = await roleService.update(id, businessId, {
        name,
        permissions,
      });

      return res.status(200).json({
        success: true,
        message: "Cargo atualizado com sucesso",
        role,
      });
    } catch (error: any) {
      console.error("❌ Erro ao atualizar cargo:", error);

      if (error.message?.includes("não encontrado")) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Erro interno ao atualizar cargo.",
      });
    }
  },

  // -----------------------------
  // DELETE
  // -----------------------------
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const businessId = (req as any).businessId;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Parâmetro 'id' é obrigatório.",
        });
      }

      await roleService.delete(id, businessId);

      return res.status(200).json({
        success: true,
        message: "Cargo removido com sucesso",
      });
    } catch (error: any) {
      console.error("❌ Erro ao remover cargo:", error);

      if (
        error.message?.includes("funcionários vinculados") ||
        error.message?.includes("não encontrado")
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Erro interno ao remover cargo.",
      });
    }
  },
};
