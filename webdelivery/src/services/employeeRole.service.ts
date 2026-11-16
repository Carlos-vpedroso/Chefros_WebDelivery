import { Role } from "@/types/employee";

export const roleService = {
  // -----------------------------
  // LISTAR TODOS (por slug)
  // GET /role/getall/:slug
  // -----------------------------
  async getAllBySlug(
    businessSlug: string,
    accessToken: string,
  ): Promise<{
    success: boolean;
    data?: Role[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/role/getall/${businessSlug}`,
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
          error: `Erro ${response.status} ao buscar cargos`,
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar cargos:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar cargos",
      };
    }
  },

  // -----------------------------
  // BUSCAR POR ID
  // GET /role/getbyid/:id
  // -----------------------------
  async getById(
    accessToken: string,
    roleId: string,
    businessSlug: string,
  ): Promise<{
    success: boolean;
    data?: Role;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/role/getbyid/${roleId}`,
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
          error: `Erro ${response.status} ao buscar cargo`,
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result.role as Role,
      };
    } catch (error) {
      console.error("Erro ao buscar cargo:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar cargo",
      };
    }
  },

  // -----------------------------
  // CRIAR
  // POST /role/create
  // -----------------------------
  async create(
    accessToken: string,
    businessSlug: string,
    data: {
      name: string;
      permissions: any;
      businessId: string;
    },
  ): Promise<{
    success: boolean;
    data?: Role;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/role/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Slug: businessSlug,
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao criar cargo",
        };
      }

      return {
        success: true,
        data: result.role as Role,
      };
    } catch (error) {
      console.error("Erro ao criar cargo:", error);
      return {
        success: false,
        error: "Erro de conexão ao criar cargo",
      };
    }
  },

  // -----------------------------
  // ATUALIZAR
  // PUT /role/update/:id
  // -----------------------------
  async update(
    accessToken: string,
    roleId: string,
    businessSlug: string,
    data: {
      name?: string;
      permissions?: any;
    },
  ): Promise<{
    success: boolean;
    data?: Role;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/role/update/${roleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Slug: businessSlug,
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao atualizar cargo",
        };
      }

      return {
        success: true,
        data: result.role as Role,
      };
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error);
      return {
        success: false,
        error: "Erro de conexão ao atualizar cargo",
      };
    }
  },

  // -----------------------------
  // DELETAR
  // DELETE /role/delete/:id
  // -----------------------------
  async remove(
    accessToken: string,
    roleId: string,
    businessSlug: string,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/role/delete/${roleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: businessSlug,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao remover cargo",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erro ao remover cargo:", error);
      return {
        success: false,
        error: "Erro de conexão ao remover cargo",
      };
    }
  },
};
