import { Ticket, TicketStatus } from "@/types/ticket&order";
import { PaymentMethod } from "@/types/payment";

export const ticketService = {
  async getAll(
    accessToken: string,
    businessSlug: string,
    filters?: {
      userId?: string;
      customerId?: string;
      employeeId?: string;
      tableId?: string;
      status?: TicketStatus;
    },
  ): Promise<{
    success: boolean;
    data?: Ticket[];
    error?: string;
  }> {
    try {
      // Montar query string dinamicamente
      const params = new URLSearchParams();

      if (filters?.userId) params.append("userId", filters.userId);
      if (filters?.customerId) params.append("customerId", filters.customerId);
      if (filters?.employeeId) params.append("employeeId", filters.employeeId);
      if (filters?.tableId) params.append("tableId", filters.tableId);
      filters?.status
        ? params.append("status", filters.status)
        : params.append("status", "OPEN");

      const queryString = params.toString();
      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/tickets/getbyslug/${businessSlug}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Slug: businessSlug,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao buscar tickets",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("❌ Erro ao buscar tickets:", error);

      return {
        success: false,
        error: "Erro de conexão ao buscar tickets",
      };
    }
  },

  async getById(id: string): Promise<{
    success: boolean;
    data?: Ticket;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/getbyid/${id}`,
        {
          method: "GET",
        },
      );
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao buscar ticket.",
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("❌ Erro no getID Ticket:", error);

      return {
        success: false,
        error: "Erro de conexão ao buscar Ticket.",
      };
    }
  },

  async checkout(
    accessToken: string,
    slug: string,
    ticketId: string,
    data: {
      paymentMethod: PaymentMethod;
      employeeId?: string;
      customerId?: string;
      userId?: string;
      tableId?: string;
    },
  ): Promise<{
    success: boolean;
    data?: Ticket;
    error?: string;
  }> {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/tickets/checkout/${slug}/${ticketId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Slug: slug,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao finalizar comanda.",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("❌ Erro no checkout:", error);

      return {
        success: false,
        error: "Erro de conexão ao finalizar comanda.",
      };
    }
  },
};
