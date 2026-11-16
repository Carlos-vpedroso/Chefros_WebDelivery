import { Business } from "@/types/business";

export const businessService = {
  async getBySlug(
    businessSlug: string,
  ): Promise<{ success: boolean; data?: Business[]; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/getinfo/${businessSlug}`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar empresa`,
        };
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar empresa",
      };
    }
  },

  async update(
    accessToken: string,
    businessId: string,
    data: {
      legalName?: string;
      phone?: string;
      email?: string;
      address?: {
        cep: string | undefined;
        numero: string | undefined;
        rua: string | undefined;
        bairro: string | undefined;
        cidade: string | undefined;
        estado: string | undefined;
        complemento?: string | undefined;
      };
    },
  ): Promise<{
    success: boolean;
    data?: Business;
    error?: string;
  }> {
    try {
      // Monta o corpo da requisição dinamicamente
      const reqBody: Record<string, any> = {};

      if (data.legalName) reqBody.legalName = data.legalName;
      if (data.phone) reqBody.phone = data.phone;
      if (data.email) reqBody.email = data.email;

      if (data.address) {
        reqBody.address = {
          cep: data.address.cep,
          numero: data.address.numero,
          rua: data.address.rua,
          bairro: data.address.bairro,
          cidade: data.address.cidade,
          estado: data.address.estado,
          ...(data.address.complemento && {
            complemento: data.address.complemento,
          }),
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/update/${businessId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Businessid: businessId,
          },
          body: JSON.stringify(reqBody),
        },
      );

      if (!response.ok) {
        const errMsg = await response.text();
        return {
          success: false,
          error: `Erro ao atualizar empresa: ${errMsg}`,
        };
      }

      const newBusiness = await response.json();

      return {
        success: true,
        data: newBusiness as Business,
      };
    } catch (error: any) {
      console.error("Erro BusinessService.update:", error);

      return {
        success: false,
        error: error.message || "Erro interno ao atualizar empresa",
      };
    }
  },

  async updateImage(
    accessToken: string,
    businessId: string,
    type: "logo" | "banner",
    imageFile: File,
  ): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/uploadimage/${businessId}?type=${type}`,

        {
          method: "PUT",
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
          error: result.error || "Erro ao atualizar imagem",
        };
      }
      return {
        success: true,
        imageUrl: result.imageUrl,
      };
    } catch (error) {
      console.error("Erro ao atualizar imagem", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  },
};
