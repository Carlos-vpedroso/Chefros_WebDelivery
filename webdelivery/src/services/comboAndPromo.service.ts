import {
  Combo,
  ComboItemType,
  Promotion,
  PromotionItemType,
  PromotionType,
} from "@/types/product&category";

export const comboAndPromoService = {
  async getCombos(
    slug: string,
  ): Promise<{ success: boolean; data?: Combo[]; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/getcombobyslug/${slug}`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar combos`,
        };
      }
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao buscar combos:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar combos",
      };
    }
  },
  async createCombo(
    businessId: string,
    accessToken: string,
    data: {
      name: string;
      description?: string;
      price: number;
      items: {
        type: ComboItemType;
        productId?: string;
        serviceId?: string;
        quantity: number;
      }[];
    },
  ): Promise<{
    success: boolean;
    data?: Combo;
    error?: string;
  }> {
    try {
      if (!data.name || !data.price || !data.items) {
        return {
          success: false,
          error: "Preencha todos os campos!",
        };
      }
      if (!Array.isArray(data.items) || data.items.length === 0) {
        return {
          success: false,
          error: "É necessário adicionar pelo menos um item ao combo",
        };
      }
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        active: true,
        businessId: businessId,
        items: data.items,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/create-combo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Businessid: businessId,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao criar combos`,
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao criar combos:", error);
      return {
        success: false,
        error: "Erro de conexão ao criar combos",
      };
    }
  },
  async updateCombo(
    slug: string,
    accessToken: string,
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      price: number;
      items: {
        type: ComboItemType;
        productId?: string;
        serviceId?: string;
        quantity: number;
      }[];
    }>,
  ): Promise<{
    success: boolean;
    data?: Combo;
    error?: string;
  }> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID do combo não informado",
        };
      }

      if (!data || Object.keys(data).length === 0) {
        return {
          success: false,
          error: "Nenhum dado para atualizar",
        };
      }

      if (data.items && data.items.length === 0) {
        return {
          success: false,
          error: "O combo precisa ter ao menos um item",
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/update-combo/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Slug: slug,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Erro ${response.status}: ${errorText}`,
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao atualizar combo:", error);
      return {
        success: false,
        error: "Erro de conexão ao atualizar combo",
      };
    }
  },
  async deleteCombo(
    slug: string,
    accessToken: string,
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/delete-combo/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao deletar combo`,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      console.error("Erro ao deletar combos:", error);
      return {
        success: false,
        error: "Erro de conexão ao deletar combos",
      };
    }
  },
  async getPromos(
    slug: string,
    accessToken: string,
  ): Promise<{ success: boolean; data?: Promotion[]; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/getpromobyslug/${slug}`,
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
          error: `Erro ${response.status} ao buscar promoções`,
        };
      }
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao buscar promoções:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar promoções",
      };
    }
  },
  async createPromo(
    businessId: string,
    accessToken: string,
    data: {
      name: string;
      type: PromotionType;
      value: number;
      startDate?: string;
      endDate?: string;
      items: {
        type: PromotionItemType;
        productId?: string;
        serviceId?: string;
      }[];
    },
  ): Promise<{ success: boolean; data?: Promotion; error?: string }> {
    try {
      if (!Array.isArray(data.items) || data.items.length === 0) {
        return {
          success: false,
          error: "Precisa selecionar ao menos 1 item.",
        };
      }
      const payload = {
        businessId,
        name: data.name,
        type: data.type,
        value: data.type === "FIXED_DISCOUNT" ? data.value : undefined,
        percentage: data.type === "PERCENTAGE" ? data.value : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        items: data.items,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/create-promo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Businessid: businessId,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao criar promoção`,
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao criar promoção:", error);
      return {
        success: false,
        error: "Erro de conexão ao criar promoção",
      };
    }
  },
  async updatePromo(
    slug: string,
    accessToken: string,
    id: string,
    data: Partial<{
      name: string;
      type: PromotionType;
      value: number;
      startDate?: string;
      endDate?: string;
      items: {
        type: PromotionItemType;
        productId?: string;
        serviceId?: string;
      }[];
    }>,
  ): Promise<{ success: boolean; data?: Promotion; error?: string }> {
    try {
      const payload = {
        name: data.name,
        type: data.type,
        value: data.type === "FIXED_DISCOUNT" ? data.value : undefined,
        percentage: data.type === "PERCENTAGE" ? data.value : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        items: data.items,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/update-promo/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Slug: slug,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao atualizar promoção`,
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao atualizar promoção:", error);
      return {
        success: false,
        error: "Erro de conexão ao atualizar promoção",
      };
    }
  },
  async deletePromo(
    slug: string,
    accessToken: string,
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/combo-promo/delete-promo/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Slug: slug,
          },
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao deletar promoção`,
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      console.error("Erro ao deletar promoção:", error);
      return {
        success: false,
        error: "Erro de conexão ao deletar promoção",
      };
    }
  },
};
