import { Request, Response } from "express";
import { workDaysService } from "./workDays.service";

export const workDaysController = {
  async getAll(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(400).json({ error: "slug é obrigatório" });
      }

      const workDays = await workDaysService.findAll(slug as string);

      return res.status(200).json(workDays);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar dias de funcionamento" });
    }
  },

  async updateAll(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { workDays } = req.body;

      if (!slug) {
        return res.status(400).json({ error: "slug é obrigatório" });
      }

      if (!Array.isArray(workDays)) {
        return res.status(400).json({ error: "workDays deve ser um array" });
      }

      const updated = await workDaysService.updateAll(slug, workDays);

      return res.status(200).json(updated);
    } catch (error: any) {
      console.error(error);

      return res.status(400).json({
        error: error.message ?? "Erro ao atualizar dias de funcionamento",
      });
    }
  },
};
