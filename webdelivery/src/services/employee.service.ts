import { Employee } from "@/types/employee";
import { UsuarioFuncionario } from "@/types/users";
import Cookies from "js-cookie";

export const employeeService = {
  async login(
    email: string,
    senha: string,
  ): Promise<{
    success: boolean;
    data?: { route: string; employee: UsuarioFuncionario; token: string };
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password: senha,
          }),
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: "Não foi possível fazer o login.",
        };
      }
      const result = await response.json();

      if (!result.employee && !result.token) {
        return {
          success: false,
          error: "Formato de Resposta API ínvalido",
        };
      }

      Cookies.set(
        `employee_access_token_${result.employee.business.slug}`,
        result.token,
        {
          path: "/",
          sameSite: "strict",
        },
      );

      return {
        success: true,
        data: {
          route: `/${result.employee.business.slug}/dashboard`,
          employee: result.employee as UsuarioFuncionario,
          token: result.token as string,
        },
      };
    } catch (error) {
      console.error("Erro no service login:", error);
      return {
        success: false,
        error: "Erro de conexão. Tente novamente.",
      };
    }
  },
  async getBySlug(
    businessSlug: string,
    accessToken: string,
  ): Promise<{
    success: boolean;
    data?: Employee[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/getbyslug/${businessSlug}`,
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
          error: `Erro ${response.status} ao buscar funcionarios`,
        };
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar funcionarios:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar funcionarios",
      };
    }
  },
  // ----------------------------------
  // CREATE EMPLOYEE
  // ----------------------------------
  async create(
    accessToken: string,
    businessSlug: string,
    data: {
      name: string;
      email: string;
      password: string;
      businessId: string;
      roleId: string;
    },
  ): Promise<{
    success: boolean;
    data?: Employee;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/create`,
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
          error: result.error || "Erro ao criar funcionário",
        };
      }

      return {
        success: true,
        data: result as Employee,
      };
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      return {
        success: false,
        error: "Erro de conexão ao criar funcionário",
      };
    }
  },
  // ----------------------------------
  // UPDATE EMPLOYEE
  // ----------------------------------

  async update(
    accessToken: string,
    businessSlug: string,
    employeeId: string,
    data: {
      name: string;
      email: string;
      roleId: string;
      password?: string;
    },
  ): Promise<{
    success: boolean;
    data?: Employee;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/update/${employeeId}`,
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
        return { success: false, error: result.error };
      }

      return { success: true, data: result as Employee };
    } catch {
      return { success: false, error: "Erro de conexão" };
    }
  },
  // ----------------------------------
  // DELETE EMPLOYEE
  // ----------------------------------
  async delete(
    accessToken: string,
    businessSlug: string,
    employeeId: string,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/delete/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: businessSlug,
          },
        },
      );

      if (!response.ok) {
        let errorMessage = "Erro ao deletar funcionário";

        try {
          const result = await response.json();
          errorMessage = result?.error || errorMessage;
        } catch {
          // response 204 ou sem body
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      return {
        success: false,
        error: "Erro de conexão ao deletar funcionário",
      };
    }
  },
};
