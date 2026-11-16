import { Table, TableStatus } from "@/types/table";

export const tableService = {
  async getAll(
    accessToken: string,
    businessSlug: string,
  ): Promise<{
    success: boolean;
    data?: Table[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tables/getall/${businessSlug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: businessSlug,
          },
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar mesas`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar mesas",
      };
    }
  },

  async create(
    accessToken: string,
    businessId: string,
    data: {
      name: string;
      capacity: number;
    },
  ): Promise<{
    success: boolean;
    data?: Table;
    error?: string;
  }> {
    try {
      const reqBody = { businessId, name: data.name, capacity: data.capacity };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tables/create`,
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
          error: result.error || "Erro ao criar mesa",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao criar mesa", error);
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
      capacity: number;
      status: TableStatus;
    },
  ): Promise<{
    success: boolean;
    data?: Table;
    error?: string;
  }> {
    try {
      const reqBody = {
        name: data.name,
        capacity: data.capacity,
        status: data.status,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tables/update/${id}`,
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
          error: result.error || "Erro ao editar mesa",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao editar mesa", error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/tables/delete/${id}`,
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
          error: result.error || "Erro ao excluir mesa",
        };
      }
      return {
        success: true,
        message: "Mesa deletada com Sucesso",
      };
    } catch (error) {
      console.error("Erro ao excluir mesa", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
};
