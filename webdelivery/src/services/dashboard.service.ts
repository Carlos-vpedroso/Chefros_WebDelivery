import { Period, ProdutoMaisVendido, ProdutoVendido, Vendas } from "@/types/dashboard";

export const dashboardService = {
  async analyticsVenda(
    accessToken: string,
    slug: string,
  ): Promise<{
    success: boolean;
    data?: Vendas;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/vendas/analytics/${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Erro ao carregar dados de analytics",
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar analytics:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },

  // -----------------------------
  // Produtos Vendidos
  // -----------------------------
  async produtosVendidos(
    accessToken: string,
    slug: string,
    params: {
      period: Period;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{
    success: boolean;
    data?: ProdutoVendido[];
    error?: string;
  }> {
    try {
      const query = new URLSearchParams({
        period: params.period,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/produtos/vendidos/${slug}?${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Erro ao carregar produtos vendidos",
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar produtos vendidos:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
  // -----------------------------
  // Produtos Mais Vendidos
  // -----------------------------
  async produtosMaisVendidos(
    accessToken: string,
    slug: string,
    params: {
      period: Period;
      startDate?: string;
      endDate?: string;
      limit?: number;
    },
  ): Promise<{
    success: boolean;
    data?: ProdutoMaisVendido[];
    error?: string;
  }> {
    try {
      const query = new URLSearchParams({
        period: params.period,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...(params.limit && { limit: String(params.limit) }),
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/maisvendidos/${slug}?${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Erro ao carregar produtos mais vendidos",
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar produtos mais vendidos:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
  // -----------------------------
  // Produtos Menos Vendidos
  // -----------------------------
  async produtosMenosVendidos(
    accessToken: string,
    slug: string,
  ): Promise<{
    success: boolean;
    data?: {
      productId: string;
      name: string;
      category?: string;
      imageUrl?: string;
      quantidadeVendida: number;
      ultimaVenda: string | null;
      status: "SEM_VENDA" | "BAIXO_GIRO";
    }[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/menosvendidos/${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Erro ao carregar produtos menos vendidos",
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar produtos menos vendidos:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
  // -----------------------------
  // Faturamento por Categoria
  // -----------------------------
  async faturamentoPorCategoria(
    accessToken: string,
    slug: string,
    params: {
      period: Period;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{
    success: boolean;
    data?: {
      categoria: string;
      faturamento: number;
      quantidadeVendida: number;
      participacaoFaturamento: number;
    }[];
    error?: string;
  }> {
    try {
      const query = new URLSearchParams({
        period: params.period,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/faturamentocategoria/${slug}?${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Erro ao carregar faturamento por categoria",
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar faturamento por categoria:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
};
