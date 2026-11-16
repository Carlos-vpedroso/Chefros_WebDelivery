import prisma from "../../config/prisma";

type WorkDay = {
  id: string;
  day: number;
  active: boolean;
  workHours: {
    startTime: string;
    endTime: string;
  }[];
};

export const workDaysService = {
  async findAll(slug: string) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }
    return prisma.workDays.findMany({
      where: { businessId: business.id },
      include: {
        workHours: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateAll(slug: string, workDays: WorkDay[]) {
    this.validateWeekDays(workDays);
    this.validateWorkHours(workDays);

    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error(`Business not found for slug: ${slug}`);
    }

    const results = [];

    for (const day of workDays) {
      const updated = await prisma.workDays.update({
        where: {
          id: day.id,
          businessId: business.id,
        },
        data: {
          active: day.active,
          workHours: {
            deleteMany: {},
            create: day.active
              ? day.workHours.map((hour) => ({
                  startTime: hour.startTime,
                  endTime: hour.endTime,
                }))
              : [],
          },
        },
        include: { workHours: true },
      });

      results.push(updated);
    }

    return results;
  },

  validateWeekDays(workDays: WorkDay[]) {
    if (workDays.length !== 7) {
      throw new Error("Devem ser enviados os 7 dias da semana");
    }

    const days = workDays.map((d) => d.day);

    for (let i = 0; i <= 6; i++) {
      if (!days.includes(i)) {
        throw new Error(`Dia ${i} não foi enviado`);
      }
    }

    const uniqueDays = new Set(days);
    if (uniqueDays.size !== 7) {
      throw new Error("Existem dias duplicados no payload");
    }
  },

  validateWorkHours(workDays: WorkDay[]) {
    for (const day of workDays) {
      if (day.active && day.workHours.length === 0) {
        throw new Error(
          `O dia ${day.day} está ativo mas não possui nenhum horário`
        );
      }

      if (!day.active) continue;

      for (const hour of day.workHours) {
        if (hour.startTime >= hour.endTime) {
          throw new Error(
            `Horário inválido no dia ${day.day}: ${hour.startTime} - ${hour.endTime}`
          );
        }
      }
    }
  },
};
