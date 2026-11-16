import { Service } from "@/types/service";

export const serviceService = {
  async getAll(
    empresaSlug: string,
    options?: {
      search?: string;
      categoryId?: string;
      active?: boolean;
    },
  ): Promise<{
    success: boolean;
    data?: Service[];
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
        }/services/getall/${empresaSlug}?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar serviços`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar serviços",
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
      duration: number;
      imageFile: File;
      slug: string; //slug da empresa
    },
  ): Promise<{
    success: boolean;
    data?: Service;
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("duration", String(data.duration));
      formData.append("categoryId", data.categoryId);
      formData.append("businessId", businessId);
      formData.append("slug", data.slug);

      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/create`,
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
          error: result.error || "Erro ao criar serviço",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao criar serviço", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },

  async update(
    slug: string,
    accessToken: string,
    serviceId: string,
    data: {
      name: string;
      description: string;
      price: string;
      duration: number;
      categoryId: string;
      imageFile?: File;
      slug: string; //slug da empresa
      active?: boolean;
    },
  ): Promise<{
    success: boolean;
    data?: Service;
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("duration", String(data.duration));
      formData.append("categoryId", data.categoryId);
      formData.append("slug", data.slug);

      if (data.active !== undefined) {
        formData.append("active", data.active ? "true" : "false");
      }

      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/update/${serviceId}`,
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
          error: result.error || "Erro ao atualizar serviço",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao atualizar serviço", error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/services/delete/${id}`,
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
          error: result.error || "Erro ao excluir serviço",
        };
      }
      return {
        success: true,
        message: "Serviço deletado com Sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar serviço", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
};
