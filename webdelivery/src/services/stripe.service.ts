const stripeService = {
  async createSession(
    planId: string,
    metaData: {
      businessId: string;
      subscriptionId: string;
      employeeId: string;
    },
  ): Promise<{
    success: boolean;
    data?: { id: string; client_secret: string };
    error?: string;
  }> {
    try {
      const body = {
        planId,
        businessId: metaData.businessId,
        subscriptionId: metaData.subscriptionId,
        employeeId: metaData.employeeId,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: "Não foi possível prosseguir para Pagamento.",
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro de conexão ao criar sessão com stripe:", error);
      return {
        success: false,
        error: "Erro de conexão ao criar sessão com stripe",
      };
    }
  },
};

export default stripeService;
