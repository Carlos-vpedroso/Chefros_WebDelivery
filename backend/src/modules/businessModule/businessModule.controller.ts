import { Request, Response } from "express";
import { ModuleType } from "@prisma/client";
import { businessModuleService } from "./businessModule.service";

export const businessModuleController = {
  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const modules = await businessModuleService.findBySlug(slug);
      res.status(200).json(modules);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar módulos", error });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const { businessId, moduleType, config } = req.body;

      // 🧩 Validação básica
      if (!businessId || !moduleType) {
        return res.status(400).json({
          error: "Os campos 'businessId' e 'moduleType' são obrigatórios.",
        });
      }

      // 🔍 Valida se o tipo de módulo é válido (garante que vem do enum)
      if (!Object.values(ModuleType).includes(moduleType)) {
        return res
          .status(400)
          .json({ error: `Tipo de módulo inválido: ${moduleType}` });
      }

      // 🧠 Chama o service para criar o módulo
      const newModule = await businessModuleService.create({
        businessId,
        moduleType,
        config: config || {},
      });

      // ✅ Retorna sucesso
      return res.status(201).json({
        message: "Módulo criado com sucesso!",
        data: newModule,
      });
    } catch (error: any) {
      console.error("Erro ao criar módulo:", error);
      return res.status(500).json({
        error: "Erro ao criar módulo",
        details: error.message,
      });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await businessModuleService.delete(id);
      return res.status(201).json({
        message: "Módulo deletado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao criar módulo:", error);
      return res.status(500).json({
        error: "Erro ao deletar módulo",
      });
    }
  },
};
