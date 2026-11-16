import { PaymentMethod } from "@/types/payment";
import { Order, OrderStatus, OrderType, Ticket } from "@/types/ticket&order";

export const orderService = {
  async getAll(
    slug: string,
    accessToken: string,
    options?: { type?: OrderType; status?: OrderStatus },
  ): Promise<{
    success: boolean;
    data?: Order[];
    error?: string;
  }> {
    try {
      const params = new URLSearchParams();

      if (options?.type) params.append("type", options.type);
      if (options?.status) params.append("status", options.status);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/getall/${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            slug: slug,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar pedidos`,
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar pedidos",
      };
    }
  },
  async create(
    businessId: string,
    order: {
      tableId?: string;
      userId?: string;
      employeeId?: string;
      customerId?: string;
      type: OrderType;
      paymentMethod?: PaymentMethod;
      name?: string;
      phone?: string;
      address?: {
        cep: string;
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        complemento?: string;
      };
      items?: { productId: string; quantity: number; note?: string }[];
      services?: { serviceId: string; quantity: number; note?: string }[];
      combos?: { comboId: string; quantity: number; note?: string }[];
    },
  ): Promise<{
    success: boolean;
    data?: {
      order: Order;
      ticket: Ticket;
      addedAmount: number;
    };
    error?: string;
  }> {
    try {
      if (order.type === "DELIVERY" && !order.address) {
        return {
          success: false,
          error: "O endereço é obrigatório.",
        };
      }
      const hasUserOrCustomer = !!order.userId || !!order.customerId;
      const hasNameAndPhone = !!order.name && !!order.phone;
      if (!hasUserOrCustomer && !hasNameAndPhone && !order.tableId) {
        return {
          success: false,
          error:
            "Nome e telefone são obrigatórios quando não há usuário ou cliente identificado.",
        };
      }

      const body = { businessId, order };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erro ao criar ordem.",
        };
      }

      return {
        success: true,
        data: result, // contém: order, ticket, addedAmount
      };
    } catch (error) {
      console.error("❌ Erro ao criar ordem:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor.",
      };
    }
  },
  async changeStatus(
    slug: string,
    accessToken: string,
    id: string,
    status: OrderStatus,
  ): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            slug: slug,
          },
          body: JSON.stringify({ status: status }),
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao atualizar status do pedido`,
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      return {
        success: false,
        error: "Erro de conexão ao atualizar status do pedido",
      };
    }
  },
};
