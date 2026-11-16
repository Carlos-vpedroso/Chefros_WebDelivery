import { Request, Response } from "express";
import { dashboardVendasService } from "./dashboard.service";

export const dashboardVendasController = {
  async analytics(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res
          .status(400)
          .json({ error: "O parâmetro businessId é obrigatório." });
      }

      const analytics = await dashboardVendasService.analytics(slug);

      return res.status(200).json(analytics);
    } catch (error) {
      console.error("Erro ao buscar analytics do dashboard:", error);

      return res.status(500).json({
        success: false,
        error: "Erro interno ao gerar analytics.",
      });
    }
  },

  async produtosVendidos(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { period, startDate, endDate } = req.query;

      if (!slug) {
        return res.status(400).json({
          error: "O parâmetro slug é obrigatório.",
        });
      }

      if (!period) {
        return res.status(400).json({
          error: "O parâmetro periodp é obrigatório.",
        });
      }

      const produtos = await dashboardVendasService.produtosVendidos({
        slug,
        period: period as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos vendidos:", error);

      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar produtos vendidos.",
      });
    }
  },
  async produtosMaisVendidos(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { period, startDate, endDate, limit } = req.query;
  
      if (!slug) {
        return res.status(400).json({
          error: "O parâmetro slug é obrigatório.",
        });
      }
  
      if (!period) {
        return res.status(400).json({
          error: "O parâmetro period é obrigatório.",
        });
      }
  
      const produtos = await dashboardVendasService.produtosMaisVendidos({
        slug,
        period: period as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: limit ? Number(limit) : 10,
      });
  
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos mais vendidos:", error);
  
      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar produtos mais vendidos.",
      });
    }
  },

  async produtosMenosVendidos(req: Request, res: Response) {
    try {
      const { slug } = req.params;
  
      if (!slug) {
        return res.status(400).json({
          error: "O parâmetro slug é obrigatório.",
        });
      }
  
      const produtos = await dashboardVendasService.produtosMenosVendidos({
        slug,
      });
  
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos menos vendidos:", error);
  
      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar produtos menos vendidos.",
      });
    }
  },

  async faturamentoPorCategoria(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { period, startDate, endDate } = req.query;
  
      if (!slug) {
        return res.status(400).json({
          error: "O parâmetro slug é obrigatório.",
        });
      }
  
      if (!period) {
        return res.status(400).json({
          error: "O parâmetro period é obrigatório.",
        });
      }
  
      const faturamento = await dashboardVendasService.faturamentoPorCategoria({
        slug,
        period: period as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });
  
      return res.status(200).json(faturamento);
    } catch (error) {
      console.error("Erro ao buscar faturamento por categoria:", error);
  
      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar faturamento por categoria.",
      });
    }
  }
};
