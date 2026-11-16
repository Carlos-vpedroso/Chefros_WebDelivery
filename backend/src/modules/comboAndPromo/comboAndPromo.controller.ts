import { Request, Response } from "express";
import { comboAndPromoService } from "./comboAndPromo.service";
import { PromotionType } from "@prisma/client";
import { normalizeNumber } from "../../utils/helpers";

export const comboAndPromoController = {
  async findComboBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Campos obrigatórios faltando." });
      }
      const combos = await comboAndPromoService.findComboBySlug(slug);
      return res.status(200).json(combos);
    } catch (error: any) {
      console.error("Erro ao buscar combo:", error);

      return res.status(500).json({
        message: "Erro ao buscar combo.",
        error: error.message,
      });
    }
  },
  async createCombo(req: Request, res: Response) {
    try {
      const { name, description, price, businessId, active, items } = req.body;

      // 🔒 Validações básicas
      if (!name || !price || !businessId) {
        return res.status(400).json({
          error: "Nome, preço e businessId são obrigatórios.",
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: "O combo precisa ter ao menos um item.",
        });
      }
      const normalizedPrice =
        typeof price === "string" ? price.replace(",", ".") : price;

      const combo = await comboAndPromoService.createCombo({
        name,
        description,
        price: normalizedPrice,
        businessId,
        active,
        items,
      });

      return res.status(201).json(combo);
    } catch (error: any) {
      console.error("Erro ao criar combo:", error);

      return res.status(500).json({
        message: "Erro ao criar combo.",
        error: error.message,
      });
    }
  },
  async updateCombo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, active, items } = req.body;
      const normalizedPrice =
        typeof price === "string" ? price.replace(",", ".") : price;
      const combo = await comboAndPromoService.updateCombo(id, {
        name,
        description,
        price: normalizedPrice,
        active,
        items,
      });
      return res.status(200).json(combo);
    } catch (error: any) {
      console.error("Erro ao atualizar combo:", error);

      return res.status(500).json({
        message: "Erro ao atualizar combo.",
        error: error.message,
      });
    }
  },
  async deleteCombo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await comboAndPromoService.deleteCombo(id);
      return res.status(200).json({ message: "Combo excluído com sucesso!" });
    } catch (error: any) {
      console.error("Erro ao deletar combo:", error);

      return res.status(500).json({
        message: "Erro ao deletar combo.",
        error: error.message,
      });
    }
  },
  async findPromoBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Campos obrigatórios faltando." });
      }
      const promos = await comboAndPromoService.findPromoBySlug(slug);
      return res.status(200).json(promos);
    } catch (error: any) {
      console.error("Erro ao buscar promo:", error);

      return res.status(500).json({
        message: "Erro ao buscar promo.",
        error: error.message,
      });
    }
  },
  async createPromo(req: Request, res: Response) {
    try {
      const {
        businessId,
        name,
        type,
        value,
        percentage,
        startDate,
        endDate,
        items,
      } = req.body;

      // ===============================
      // Validação básica de payload
      // ===============================
      if (!businessId || !name || !type || !Array.isArray(items)) {
        return res.status(400).json({
          message: "Dados obrigatórios não informados.",
        });
      }

      if (!Object.values(PromotionType).includes(type)) {
        return res.status(400).json({
          message: "Tipo de promoção inválido.",
        });
      }

      // 🔥 NORMALIZAÇÃO
      const normalizedValue = normalizeNumber(value);
      const normalizedPercentage = normalizeNumber(percentage);

      // ===============================
      // Chamada do service
      // ===============================
      const promotion = await comboAndPromoService.createPromo({
        businessId,
        name,
        type,
        value: normalizedValue,
        percentage: normalizedPercentage,
        startDate,
        endDate,
        items,
      });

      return res.status(201).json(promotion);
    } catch (error: any) {
      console.error("Erro ao criar promo:", error);

      return res.status(500).json({
        message: "Erro ao criar promo.",
        error: error.message,
      });
    }
  },
  async updatePromo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, value, percentage, startDate, endDate, items } =
        req.body;

      if (!Object.values(PromotionType).includes(type)) {
        return res.status(400).json({
          message: "Tipo de promoção inválido.",
        });
      }

      // 🔥 NORMALIZAÇÃO
      const normalizedValue = normalizeNumber(value);
      const normalizedPercentage = normalizeNumber(percentage);

      // ===============================
      // Chamada do service
      // ===============================
      const promotion = await comboAndPromoService.updatePromo(id, {
        name,
        type,
        value: normalizedValue,
        percentage: normalizedPercentage,
        startDate,
        endDate,
        items,
      });

      return res.status(201).json(promotion);
    } catch (error: any) {
      console.error("Erro ao criar promo:", error);

      return res.status(500).json({
        message: "Erro ao criar promo.",
        error: error.message,
      });
    }
  },
  async deletePromo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await comboAndPromoService.deletePromo(id);
      return res
        .status(200)
        .json({ message: "Promoção excluído com sucesso!" });
    } catch (error: any) {
      console.error("Erro ao deletar promoção:", error);

      return res.status(500).json({
        message: "Erro ao deletar promoção.",
        error: error.message,
      });
    }
  },
};
