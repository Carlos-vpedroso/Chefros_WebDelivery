import { Request, Response } from "express";
import { activityLogService } from "./activityLog.service";

export const activityLogController = {
  // Endpoint para pegar os 10 últimos logs de atividades
  async getRecords(req: Request, res: Response) {
    const { slug } = req.params;
    const { quantity } = req.query;
    console.log(slug);

    if (!quantity) {
      return res
        .status(400)
        .json({ error: "Propriedade quantity faltando na query!" });
    }

    try {
      const logs = await activityLogService.getRecords(slug, Number(quantity));
      return res.status(200).json(logs);
    } catch (error) {
      console.error("Erro ao buscar logs de atividades:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar logs de atividades." });
    }
  },
};
