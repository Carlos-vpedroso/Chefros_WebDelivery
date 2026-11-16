import { Request, Response } from "express";
import { subscriptionService } from "./subscription.service";
import { validateCPFOrCNPJ, validateEmail } from "../../utils/helpers";

export const subscriptionController = {
  async partialCheckout(req: Request, res: Response) {
    try {
      const { subscriptionPlanId, empresa, funcionario } = req.body;

      // ✅ Validação básica de presença
      if (!subscriptionPlanId || !empresa || !funcionario) {
        return res.status(400).json({
          success: false,
          error:
            "Campos obrigatórios: 'subscriptionPlanId', 'empresa' e 'funcionario'.",
        });
      }

      // ✅ Validação dos dados da empresa
      const requiredBusinessFields = [
        "name",
        "phone",
        "slug",
        "document",
        "segment",
        "address",
      ];
      const missingBusiness = requiredBusinessFields.filter(
        (field) => !empresa[field]
      );

      if (missingBusiness.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Campos ausentes em empresa",
        });
      }

      // ✅ Validação do documento da empresa (CPF/CNPJ)
      if (empresa.document && !validateCPFOrCNPJ(empresa.document)) {
        return res.status(400).json({
          success: false,
          error: "CPF ou CNPJ inválido.",
        });
      }

      // ✅ Validação do endereço da empresa
      if (empresa.address) {
        const requiredAddressFields = [
          "rua",
          "numero",
          "bairro",
          "cidade",
          "estado",
          "cep",
        ];
        const missingAddress = requiredAddressFields.filter(
          (field) => !empresa.address[field]
        );

        if (missingAddress.length > 0) {
          return res.status(400).json({
            success: false,
            error: `Campos de endereço ausentes em 'empresa': ${missingAddress.join(
              ", "
            )}.`,
          });
        }
      }

      // ✅ Validação dos dados do funcionário (CORRIGIDO)
      const requiredEmployeeFields = ["name", "email", "password"];
      const missingEmployee = requiredEmployeeFields.filter(
        (field) => !funcionario[field]
      ); // ✅ Agora validando 'funcionario'

      if (missingEmployee.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Campos ausentes em funcionario",
        });
      }

      // ✅ Validação de formato de email
      if (funcionario.email && !validateEmail(funcionario.email)) {
        return res.status(400).json({
          success: false,
          error: "Formato de e-mail inválido no campo 'funcionario'.",
        });
      }

      // ✅ Validação de comprimento mínimo da senha
      if (funcionario.password && funcionario.password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "A senha deve ter no mínimo 6 caracteres.",
        });
      }

      // ✅ Chama o serviço que cria empresa + assinatura com status PENDING_PAYMENT
      const result = await subscriptionService.createPartial(
        subscriptionPlanId,
        empresa,
        funcionario
      );

      return res.status(201).json(result);
    } catch (error: any) {
      console.error("❌ Erro ao criar empresa com assinatura:", error);
      if (error.message?.includes("já existe") || error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "Empresa ou usuário já existe no sistema.",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Erro interno ao criar empresa com assinatura.",
      });
    }
  },
  async getByBusinessSlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      // ✅ Validação básica
      if (!slug) {
        return res.status(400).json({
          success: false,
          error: "Parâmetro 'slug' é obrigatório.",
        });
      }

      const subscription =
        await subscriptionService.getSubscriptionByBusinessSlug(slug);

      return res.status(200).json(
        subscription,
      );
    } catch (error: any) {
      console.error("❌ Erro ao buscar assinatura por slug:", error);

      // 🎯 Erros de domínio (controle fino)
      if (error.message === "Business não encontrado") {
        return res.status(404).json({
          success: false,
          error: "Empresa não encontrada.",
        });
      }

      if (error.message === "Assinatura não encontrada para este negócio") {
        return res.status(404).json({
          success: false,
          error: "Assinatura não encontrada para esta empresa.",
        });
      }

      // 🚨 Erro inesperado
      return res.status(500).json({
        success: false,
        error: "Erro interno ao buscar assinatura.",
      });
    }
  },
};
