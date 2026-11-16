import { subscriptionPlanService } from "./subscriptionPlan.service";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const subscriptionPlanController = {
  async getAllSubscriptionPlans(req: Request, res: Response) {
    try {
      const { isActive } = req.query;

      const activeFlag =
        isActive === "true" ? true : isActive === "false" ? false : true;
      const plans = await subscriptionPlanService.findAll(activeFlag);

      return res.status(200).json({
        success: true,
        count: plans.length,
        plans,
      });
    } catch (error: any) {
      console.error("Erro ao buscar planos:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar planos.",
        details: error.message,
      });
    }
  },
  async createSubscriptionPlan(req: Request, res: Response) {
    try {
      const {
        name,
        slug,
        description,
        price,
        stripePriceId,
        stripeProductId,
        billingCycle = "MONTHLY",
        features = [],
        isActive = true,
        modules = [], // 👈 módulos vindos do body
      } = req.body;

      // ✅ Validação básica
      if (!name || !slug || !price) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios: name, slug e price.",
        });
      }

      // ✅ Validação dos módulos
      if (!Array.isArray(modules)) {
        return res.status(400).json({
          success: false,
          error: "O campo 'modules' deve ser um array de strings.",
        });
      }

      // ✅ Criação do plano + módulos no mesmo fluxo transacional
      const plan = await subscriptionPlanService.createWithModules({
        name,
        slug,
        description,
        price: new Prisma.Decimal(price),
        stripePriceId,
        stripeProductId,
        billingCycle,
        features,
        isActive,
        modules,
      });

      return res.status(201).json({
        success: true,
        message: "Plano criado com sucesso!",
        plan,
      });
    } catch (error: any) {
      console.error("Erro ao criar plano:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno ao criar o plano.",
        details: error.message,
      });
    }
  },
  async updateSubscriptionPlan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const planId = Number(id);
      const { name, description, price, billingCycle, features, isActive } =
        req.body;

      // ✅ Verifica se o ID foi informado
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "O campo 'id' é obrigatório na URL.",
        });
      }

      // ✅ Monta o objeto com os campos que vierem no body
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = new Prisma.Decimal(price);
      if (billingCycle !== undefined) updateData.billingCycle = billingCycle;
      if (features !== undefined) updateData.features = features;
      if (isActive !== undefined) updateData.isActive = isActive;

      // ✅ Verifica se há algo para atualizar
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: "Nenhum campo foi enviado para atualização.",
        });
      }

      // ✅ Atualiza o plano no banco
      const updatedPlan = await subscriptionPlanService.update(
        planId,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Plano atualizado com sucesso!",
        plan: updatedPlan,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar plano:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno ao atualizar o plano.",
        details: error.message,
      });
    }
  },
  async deactivateSubscriptionPlan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const planId = Number(id);

      // ✅ Verifica se o ID foi informado
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "O campo 'id' é obrigatório na URL.",
        });
      }

      // ✅ Remove o plano via service
      const deactivatePlan = await subscriptionPlanService.deactivate(planId);

      if (!deactivatePlan) {
        return res.status(404).json({
          success: false,
          error: "Plano não encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Plano desativado com sucesso!",
        plan: deactivatePlan,
      });
    } catch (error: any) {
      console.error("Erro ao deletar plano:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno ao deletar o plano.",
        details: error.message,
      });
    }
  },
};
