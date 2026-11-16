import { Product } from "@/types/product&category";

export const productService = {
  async getAll(
    empresaSlug: string,
    options?: {
      search?: string;
      categoryId?: string;
      active?: boolean;
    },
  ): Promise<{
    success: boolean;
    data?: Product[];
    error?: string;
  }> {
    try {
      const params = new URLSearchParams();

      if (options?.search) params.append("search", options.search);
      if (options?.categoryId) params.append("categoryId", options.categoryId);
      if (options?.active !== undefined)
        params.append("active", String(options.active));

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/products/getall/${empresaSlug}?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar produtos`,
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
      categoryId: string;
      name: string;
      description: string;
      price: string;
      imageFile: File;
      slug: string; //slug da empresa
    },
  ): Promise<{
    success: boolean;
    data?: Product;
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("categoryId", data.categoryId);
      formData.append("businessId", businessId);
      formData.append("slug", data.slug);

      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Businessid: businessId,
          },
          body: formData,
        },
      );

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao criar produto",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao criar produto", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },

  async update(
    slug: string,
    accessToken: string,
    productId: string,
    data: {
      name: string;
      description: string;
      price: string;
      categoryId: string;
      imageFile?: File;
      slug: string; //slug da empresa
      active?: boolean;
    },
  ): Promise<{
    success: boolean;
    data?: Product;
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("categoryId", data.categoryId);
      formData.append("slug", data.slug);

      if (data.active !== undefined) {
        formData.append("active", data.active ? "true" : "false");
      }

      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/update/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
          body: formData,
        },
      );
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao atualizar produto",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/products/delete/${id}`,
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
          error: result.error || "Erro ao excluir produto",
        };
      }
      return {
        success: true,
        message: "Produto deletado com Sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar produto", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
};
