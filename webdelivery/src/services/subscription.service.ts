export const subscriptionService = {
  async partialCheckout(
    planId: string,
    business: {
      name: string;
      phone: string;
      slug: string;
      document: string;
      segment: string;
      address: {
        cep: string;
        numero: string;
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
      };
    },
    employee: {
      name: string;
      email: string;
      password: string;
    },
  ): Promise<{
    success: boolean;
    error?: string;
    data?: { businessId: string; subscriptionId: string; employeeId: string };
  }> {
    try {
      const payload = {
        subscriptionPlanId: Number(planId),
        empresa: business,
        funcionario: employee,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/partial-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Erro da API:", data);
        return {
          success: false,
          error:
            data?.error ||
            `Erro ${response.status}: ${data?.message || "Dados inválidos"}`,
        };
      }
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("🔌 Erro de conexão ao criar assinatura:", error);
      return {
        success: false,
        error: "Erro de conexão ao criar assinatura",
      };
    }
  },
  async getByBusinessSlug(
    slug: string,
    accessToken: string,
  ): Promise<{
    success: boolean;
    error?: string;
    data?: any;
  }> {
    try {
      if (!slug) {
        return {
          success: false,
          error: "Slug não informado",
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/getbyslug/${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Erro da API:", data);
        return {
          success: false,
          error:
            data?.error ||
            `Erro ${response.status}: ${data?.message || "Erro ao buscar assinatura"}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("🔌 Erro de conexão ao buscar assinatura:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar assinatura",
      };
    }
  },
};
