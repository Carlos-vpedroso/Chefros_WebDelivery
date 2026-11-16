import { WorkDay } from "@/types/workDays";

export const workDaysService = {
  async getWorkDays(
    slug: string,
  ): Promise<{ success: boolean; data?: WorkDay[]; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/workDays/getAll/${slug}`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status} ao buscar horários de funcionamento`,
        };
      }
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao buscar horários de funcionamento:", error);
      return {
        success: false,
        error: "Erro de conexão ao buscar horários de funcionamento",
      };
    }
  },

  async updateWorkDays(
    slug: string,
    accessToken: string,
    workDays: Partial<{
      day: number;
      active: boolean;
      workHours: {
        startTime: string;
        endTime: string;
      }[];
    }>[],
  ): Promise<{
    success: boolean;
    data?: WorkDay[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/workDays/updateAll/${slug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Slug: slug,
          },
          body: JSON.stringify({ workDays: workDays }),
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
      console.error("Erro ao atualizar dias de funcionamento:", error);
      return {
        success: false,
        error: "Erro de conexão ao atualizar dias de funcionamento",
      };
    }
  },
};
