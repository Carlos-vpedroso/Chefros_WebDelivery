import { Category } from "@/types/product&category";

export const categoryService = {
  async getAll(
    empresaSlug: string,
    options?: { type?: string },
  ): Promise<{
    success: boolean;
    data?: Category[];
    error?: string;
  }> {
    try {
      const params = new URLSearchParams();
      if (options?.type) params.append("type", options.type);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/categories/getall/${empresaSlug}?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar categorias`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar produtos",
      };
    }
  },

  async create(
    accessToken: string,
    businessId: string,
    data: {
      name: string;
      type: "PRODUCT" | "SERVICE";
    },
  ): Promise<{
    success: boolean;
    data?: Category;
    error?: string;
  }> {
    try {
      const reqBody = { businessId, name: data.name, type: data.type };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Businessid: businessId,
          },
          body: JSON.stringify(reqBody),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao criar categoria",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },

  async update(
    slug: string,
    accessToken: string,
    id: string,
    data: {
      name: string;
      type: "PRODUCT" | "SERVICE";
    },
  ): Promise<{
    success: boolean;
    data?: Category;
    error?: string;
  }> {
    try {
      const reqBody = { name: data.name, type: data.type };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
          body: JSON.stringify(reqBody),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao editar categoria",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao editar categoria", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },

  async delete(
    slug: string,
    accessToken: string,
    id: string,
  ): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao excluir categoria",
        };
      }
      return {
        success: true,
        message: "Categoria deletada com Sucesso",
      };
    } catch (error) {
      console.error("Erro ao excluir categoria", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
};
