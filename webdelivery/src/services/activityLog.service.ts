import { ActivityLog } from "@/types/activityLog";

export const activityLogService = {
  async getRecord(
    slug: string,
    accessToken: string,
    quantity: number,
  ): Promise<{
    success: boolean;
    data?: ActivityLog[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/get-records/${slug}?quantity=${quantity}`,
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
          error: `Erro ${response.status} ao buscar log de atividade.`,
        };
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar produtos",
      };
    }
  },
};
