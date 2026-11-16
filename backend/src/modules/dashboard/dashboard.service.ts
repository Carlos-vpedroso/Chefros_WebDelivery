import prisma from "../../config/prisma";
import {
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

type Period = "DAY" | "WEEK" | "MONTH" | "CUSTOM";

interface ProductsSoldParams {
  slug: string;
  period: Period;
  startDate?: Date;
  endDate?: Date;
}

export const dashboardVendasService = {
  async analytics(slug: string) {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    // Períodos para comparação
    const lastWeekStart = startOfWeek(subWeeks(today, 1));
    const lastWeekEnd = endOfWeek(subWeeks(today, 1));

    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      throw new Error("Nenhuma empresa encontrada.");
    }

    // ---------------------------------------
    // MÉTRICAS DIA ATUAL
    // ---------------------------------------
    const pendingOrdersCount = await prisma.order.count({
      where: {
        status: "PENDING",
        ticket: { businessId: business.id },
        createdAt: { gte: start, lte: end },
      },
    });

    const completedOrdersCount = await prisma.order.count({
      where: {
        status: "COMPLETED",
        ticket: { businessId: business.id },
        updatedAt: { gte: start, lte: end },
      },
    });

    const closedTickets = await prisma.ticket.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "CLOSED",
        businessId: business.id,
        updatedAt: { gte: start, lte: end },
      },
    });

    const totalFaturado = closedTickets._sum.totalAmount || 0;

    const closedTicketsData = await prisma.ticket.findMany({
      where: {
        status: "CLOSED",
        businessId: business.id,
        updatedAt: { gte: start, lte: end },
      },
      select: { totalAmount: true },
    });

    const ticketMedio =
      closedTicketsData.length > 0
        ? closedTicketsData.reduce((acc, t) => acc + Number(t.totalAmount), 0) /
          closedTicketsData.length
        : 0;

    // ---------------------------------------
    // MÉTRICAS SEMANA ATUAL (até hoje)
    // ---------------------------------------
    const weekStart = startOfWeek(today);

    const pendingOrdersWeek = await prisma.order.count({
      where: {
        status: "PENDING",
        ticket: { businessId: business.id },
        createdAt: { gte: weekStart, lte: end },
      },
    });

    const completedOrdersWeek = await prisma.order.count({
      where: {
        status: "COMPLETED",
        ticket: { businessId: business.id },
        updatedAt: { gte: weekStart, lte: end },
      },
    });

    const closedTicketsWeek = await prisma.ticket.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "CLOSED",
        businessId: business.id,
        updatedAt: { gte: weekStart, lte: end },
      },
    });

    const totalFaturadoWeek = closedTicketsWeek._sum.totalAmount || 0;

    // ---------------------------------------
    // MÉTRICAS SEMANA ANTERIOR (para trend)
    // ---------------------------------------
    const pendingOrdersLastWeek = await prisma.order.count({
      where: {
        status: "PENDING",
        ticket: { businessId: business.id },
        createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    });

    const completedOrdersLastWeek = await prisma.order.count({
      where: {
        status: "COMPLETED",
        ticket: { businessId: business.id },
        updatedAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    });

    const closedTicketsLastWeek = await prisma.ticket.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "CLOSED",
        businessId: business.id,
        updatedAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    });

    const totalFaturadoLastWeek = closedTicketsLastWeek._sum.totalAmount || 0;

    // Calcular trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const pendingOrdersTrend = calculateTrend(
      pendingOrdersWeek,
      pendingOrdersLastWeek
    );
    const completedOrdersTrend = calculateTrend(
      completedOrdersWeek,
      completedOrdersLastWeek
    );

    // ---------------------------------------
    // TEMPO MÉDIO ÚLTIMOS 30 DIAS com trend
    // ---------------------------------------
    const last30Days = subDays(today, 30);
    const previous30Days = subDays(today, 60);

    const completedOrders30Days = await prisma.order.findMany({
      where: {
        status: "COMPLETED",
        ticket: { businessId: business.id },
        updatedAt: { gte: last30Days },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const previousCompletedOrders = await prisma.order.findMany({
      where: {
        status: "COMPLETED",
        ticket: { businessId: business.id },
        updatedAt: { gte: previous30Days, lt: last30Days },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    let tempoMedioMinutos = 0;
    let tempoMedioTrend = 0;

    if (completedOrders30Days.length > 0) {
      const tempos = completedOrders30Days.map((order) => {
        const diffMs =
          new Date(order.updatedAt).getTime() -
          new Date(order.createdAt).getTime();
        return diffMs / 1000 / 60;
      });
      tempoMedioMinutos = tempos.reduce((acc, t) => acc + t, 0) / tempos.length;
    }

    if (previousCompletedOrders.length > 0) {
      const previousTempos = previousCompletedOrders.map((order) => {
        const diffMs =
          new Date(order.updatedAt).getTime() -
          new Date(order.createdAt).getTime();
        return diffMs / 1000 / 60;
      });
      const previousTempoMedio =
        previousTempos.reduce((acc, t) => acc + t, 0) / previousTempos.length;
      tempoMedioTrend =
        calculateTrend(tempoMedioMinutos, previousTempoMedio) * -1; // Negativo porque tempo menor é melhor
    }

    // Trend do Ticket Médio (compara semana atual com anterior)
    const closedTicketsWeekData = await prisma.ticket.findMany({
      where: {
        status: "CLOSED",
        businessId: business.id,
        updatedAt: { gte: weekStart, lte: end },
      },
      select: { totalAmount: true },
    });

    const closedTicketsLastWeekData = await prisma.ticket.findMany({
      where: {
        status: "CLOSED",
        businessId: business.id,
        updatedAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
      select: { totalAmount: true },
    });

    const ticketMedioWeek =
      closedTicketsWeekData.length > 0
        ? closedTicketsWeekData.reduce(
            (acc, t) => acc + Number(t.totalAmount),
            0
          ) / closedTicketsWeekData.length
        : 0;

    const ticketMedioLastWeek =
      closedTicketsLastWeekData.length > 0
        ? closedTicketsLastWeekData.reduce(
            (acc, t) => acc + Number(t.totalAmount),
            0
          ) / closedTicketsLastWeekData.length
        : 0;

    const ticketMedioTrend = calculateTrend(
      ticketMedioWeek,
      ticketMedioLastWeek
    );

    // ---------------------------------------
    // DADOS DOS ÚLTIMOS 7 DIAS (para gráficos)
    // ---------------------------------------
    const last7Days = subDays(today, 6);
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // Criar array dos últimos 7 dias
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i); // Começa do dia mais antigo (6 dias atrás) até hoje
      return {
        date,
        nomeDia: diasSemana[date.getDay()],
        dataString: date.toISOString().split("T")[0], // Para agrupamento
      };
    });

    // Inicializar mapas
    const pedidosMap: Record<string, number> = {};
    const faturamentoMap: Record<string, number> = {};

    // Inicializar todos os dias com 0
    ultimos7Dias.forEach(({ nomeDia, dataString }) => {
      pedidosMap[dataString] = 0;
      faturamentoMap[dataString] = 0;
    });

    // Buscar dados dos últimos 7 dias
    const startOfLast7Days = startOfDay(subDays(today, 6));
    const endOfLast7Days = endOfDay(today);

    const ticketsLast7Days = await prisma.ticket.findMany({
      where: {
        businessId: business.id,
        status: "CLOSED",
        updatedAt: {
          gte: startOfLast7Days,
          lte: endOfLast7Days,
        },
      },
      select: {
        totalAmount: true,
        updatedAt: true,
      },
    });

    const ordersLast7Days = await prisma.order.findMany({
      where: {
        ticket: { businessId: business.id },
        status: "COMPLETED",
        updatedAt: {
          gte: startOfLast7Days,
          lte: endOfLast7Days,
        },
      },
      select: {
        updatedAt: true,
      },
    });

    // Agrupar por data (YYYY-MM-DD)
    ticketsLast7Days.forEach((ticket) => {
      const date = new Date(ticket.updatedAt);
      const dataString = date.toISOString().split("T")[0];
      if (faturamentoMap[dataString] !== undefined) {
        faturamentoMap[dataString] += Number(ticket.totalAmount);
      }
    });

    ordersLast7Days.forEach((order) => {
      const date = new Date(order.updatedAt);
      const dataString = date.toISOString().split("T")[0];
      if (pedidosMap[dataString] !== undefined) {
        pedidosMap[dataString] += 1;
      }
    });

    // Criar arrays finais na ordem correta (do mais antigo para o mais recente)
    const pedidosData = ultimos7Dias.map(({ nomeDia, dataString }) => ({
      dia: nomeDia,
      quantidade: pedidosMap[dataString] || 0,
    }));

    const faturamentoData = ultimos7Dias.map(({ nomeDia, dataString }) => ({
      dia: nomeDia,
      valor: faturamentoMap[dataString] || 0,
    }));

    // Calcular trend da semana (comparando com semana anterior)
    const totalPedidosSemana = pedidosData.reduce(
      (acc, item) => acc + item.quantidade,
      0
    );
    const totalFaturamentoSemana = faturamentoData.reduce(
      (acc, item) => acc + item.valor,
      0
    );

    // Dados da semana anterior para gráfico (se necessário)
    const previous7DaysStart = subDays(last7Days, 7);
    const previous7DaysEnd = subDays(today, 7);

    const previousTickets = await prisma.ticket.findMany({
      where: {
        businessId: business.id,
        status: "CLOSED",
        updatedAt: { gte: previous7DaysStart, lt: previous7DaysEnd },
      },
      select: { totalAmount: true },
    });

    const previousOrders = await prisma.order.findMany({
      where: {
        ticket: { businessId: business.id },
        status: "COMPLETED",
        updatedAt: { gte: previous7DaysStart, lt: previous7DaysEnd },
      },
      select: { updatedAt: true },
    });

    const totalPedidosSemanaAnterior = previousOrders.length;
    const totalFaturamentoSemanaAnterior = previousTickets.reduce(
      (acc, t) => acc + Number(t.totalAmount),
      0
    );

    const pedidosTrend = calculateTrend(
      totalPedidosSemana,
      totalPedidosSemanaAnterior
    );
    const faturamentoTrend = calculateTrend(
      totalFaturamentoSemana,
      totalFaturamentoSemanaAnterior
    );

    // ---------------------------------------
    // RETORNO FINAL COM TRENDS
    // ---------------------------------------
    return {
      // Métricas do dia
      pendingOrdersCount,
      completedOrdersCount,
      totalFaturado,
      ticketMedio,

      // Trends das métricas
      trends: {
        pendingOrders: Math.round(pendingOrdersTrend * 100) / 100, // Arredonda para 2 casas
        completedOrders: Math.round(completedOrdersTrend * 100) / 100,
        ticketMedio: Math.round(ticketMedioTrend * 100) / 100,
        tempoMedioAtendimento: Math.round(tempoMedioTrend * 100) / 100,
        pedidos: Math.round(pedidosTrend * 100) / 100,
        faturamento: Math.round(faturamentoTrend * 100) / 100,
      },
      tempoMedioAtendimento: tempoMedioMinutos,
      // Dados para gráficos
      pedidosData,
      faturamentoData,

      // Valores da semana atual (opcional, para exibir em tooltips)
      weeklyMetrics: {
        pendingOrdersWeek,
        completedOrdersWeek,
        totalFaturadoWeek,
        ticketMedioWeek,
      },
    };
  },

  async produtosVendidos({
    slug,
    period,
    startDate,
    endDate,
  }: ProductsSoldParams) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error("Empresa não encontrada");
    }

    // -----------------------------
    // Definir intervalo de datas
    // -----------------------------
    let dateFilter: { gte: Date; lte: Date };

    const now = new Date();

    switch (period) {
      case "DAY":
        dateFilter = {
          gte: startOfDay(now),
          lte: endOfDay(now),
        };
        break;

      case "WEEK":
        dateFilter = {
          gte: startOfWeek(now),
          lte: endOfWeek(now),
        };
        break;

      case "MONTH":
        dateFilter = {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        };
        break;

      case "CUSTOM":
        if (!startDate || !endDate) {
          throw new Error("Datas inicial e final são obrigatórias");
        }
        dateFilter = {
          gte: startDate,
          lte: endDate,
        };
        break;

      default:
        throw new Error("Período inválido");
    }

    // -----------------------------
    // Buscar produtos vendidos
    // -----------------------------
    const produtos = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        type: "PRODUCT",
        order: {
          status: "COMPLETED",
          ticket: {
            businessId: business.id,
            status: "CLOSED",
            updatedAt: dateFilter,
          },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      _count: {
        _all: true,
      },
    });

    // -----------------------------
    // Buscar dados dos produtos
    // -----------------------------
    const productIds = produtos.map((p) => p.productId!).filter(Boolean);

    const productsData = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        category: { select: { name: true } },
        imageUrl: true,
      },
    });

    const productMap = new Map(productsData.map((p) => [p.id, p]));

    // -----------------------------
    // Normalizar retorno
    // -----------------------------
    return produtos.map((item) => {
      const product = productMap.get(item.productId!);

      return {
        productId: item.productId,
        name: product?.name,
        category: product?.category?.name,
        imageUrl: product?.imageUrl,
        quantidadeVendida: item._sum.quantity || 0,
        totalFaturado: Number(item._sum.subtotal || 0),
        totalPedidos: item._count._all,
        precoAtual: product?.price,
      };
    });
  },

  async produtosMaisVendidos({
    slug,
    period,
    startDate,
    endDate,
    limit = 10,
  }: ProductsSoldParams & { limit?: number }) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) throw new Error("Empresa não encontrada");

    // -----------------------------
    // Intervalo de datas
    // -----------------------------
    let dateFilter: { gte: Date; lte: Date };
    const now = new Date();

    switch (period) {
      case "DAY":
        dateFilter = { gte: startOfDay(now), lte: endOfDay(now) };
        break;
      case "WEEK":
        dateFilter = { gte: startOfWeek(now), lte: endOfWeek(now) };
        break;
      case "MONTH":
        dateFilter = { gte: startOfMonth(now), lte: endOfMonth(now) };
        break;
      case "CUSTOM":
        if (!startDate || !endDate) throw new Error("Datas obrigatórias");
        dateFilter = { gte: startDate, lte: endDate };
        break;
      default:
        throw new Error("Período inválido");
    }

    // -----------------------------
    // Agrupamento de vendas
    // -----------------------------
    const produtos = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        type: "PRODUCT",
        order: {
          status: "COMPLETED",
          ticket: {
            businessId: business.id,
            status: "CLOSED",
            updatedAt: dateFilter,
          },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
    });

    const totalFaturamento = produtos.reduce(
      (acc, p) => acc + Number(p._sum.subtotal || 0),
      0
    );

    const productIds = produtos.map((p) => p.productId!).filter(Boolean);

    const productsData = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: { select: { name: true } },
      },
    });

    const productMap = new Map(productsData.map((p) => [p.id, p]));

    return produtos
      .sort((a, b) => Number(b._sum.quantity) - Number(a._sum.quantity))
      .slice(0, limit)
      .map((item, index) => {
        const product = productMap.get(item.productId!);
        const faturamento = Number(item._sum.subtotal || 0);

        return {
          ranking: index + 1,
          productId: item.productId,
          name: product?.name,
          category: product?.category?.name,
          imageUrl: product?.imageUrl,
          quantidadeVendida: item._sum.quantity || 0,
          faturamento,
          participacaoFaturamento:
            totalFaturamento > 0
              ? Math.round((faturamento / totalFaturamento) * 10000) / 100
              : 0,
        };
      });
  },

  async produtosMenosVendidos({ slug }: { slug: string }) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      throw new Error("Empresa não encontrada");
    }

    // ----------------------------------
    // Produtos do negócio
    // ----------------------------------
    const products = await prisma.product.findMany({
      where: { businessId: business.id },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: { select: { name: true } },
      },
    });

    // ----------------------------------
    // Quantidade vendida por produto
    // ----------------------------------
    const sales = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        type: "PRODUCT",
        productId: { not: null }, // 🔒 CRÍTICO
        order: {
          status: "COMPLETED",
          ticket: {
            businessId: business.id,
            status: "CLOSED",
          },
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const salesMap = new Map<string, number>();

    for (const s of sales) {
      if (s.productId) {
        salesMap.set(s.productId, s._sum.quantity ?? 0);
      }
    }

    // ----------------------------------
    // Última venda por produto
    // ----------------------------------
    const lastSales = await prisma.orderItem.findMany({
      where: {
        type: "PRODUCT",
        productId: { not: null }, // 🔒 CRÍTICO
        order: {
          status: "COMPLETED",
          ticket: {
            businessId: business.id,
            status: "CLOSED",
          },
        },
      },
      orderBy: {
        order: {
          updatedAt: "desc",
        },
      },
      select: {
        productId: true,
        order: {
          select: {
            updatedAt: true,
          },
        },
      },
    });

    const lastSaleMap = new Map<string, Date>();

    for (const item of lastSales) {
      if (item.productId && !lastSaleMap.has(item.productId)) {
        lastSaleMap.set(item.productId, item.order.updatedAt);
      }
    }

    // ----------------------------------
    // Normalizar retorno
    // ----------------------------------
    return products
      .map((product) => {
        const quantidadeVendida = salesMap.get(product.id) ?? 0;
        const ultimaVenda = lastSaleMap.get(product.id) ?? null;

        const status =
          quantidadeVendida === 0
            ? "SEM_VENDA"
            : quantidadeVendida < 5
            ? "BAIXO_GIRO"
            : "OK";

        return {
          productId: product.id,
          name: product.name,
          category: product.category?.name,
          imageUrl: product.imageUrl,
          quantidadeVendida,
          ultimaVenda,
          status,
        };
      })
      .filter((item) => item.status !== "OK"); // 👈 AQUI
  },

  async faturamentoPorCategoria({
    slug,
    period,
    startDate,
    endDate,
  }: ProductsSoldParams) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) throw new Error("Empresa não encontrada");

    let dateFilter: { gte: Date; lte: Date };
    const now = new Date();

    switch (period) {
      case "DAY":
        dateFilter = { gte: startOfDay(now), lte: endOfDay(now) };
        break;
      case "WEEK":
        dateFilter = { gte: startOfWeek(now), lte: endOfWeek(now) };
        break;
      case "MONTH":
        dateFilter = { gte: startOfMonth(now), lte: endOfMonth(now) };
        break;
      case "CUSTOM":
        if (!startDate || !endDate) throw new Error("Datas obrigatórias");
        dateFilter = { gte: startDate, lte: endDate };
        break;
      default:
        throw new Error("Período inválido");
    }

    const itens = await prisma.orderItem.findMany({
      where: {
        type: "PRODUCT",
        order: {
          status: "COMPLETED",
          ticket: {
            businessId: business.id,
            status: "CLOSED",
            updatedAt: dateFilter,
          },
        },
      },
      select: {
        quantity: true,
        subtotal: true,
        product: {
          select: {
            category: { select: { name: true } },
          },
        },
      },
    });

    const categoriaMap: Record<
      string,
      { faturamento: number; quantidade: number }
    > = {};

    itens.forEach((item) => {
      const categoria = item.product?.category?.name || "Sem categoria";

      if (!categoriaMap[categoria]) {
        categoriaMap[categoria] = { faturamento: 0, quantidade: 0 };
      }

      categoriaMap[categoria].faturamento += Number(item.subtotal);
      categoriaMap[categoria].quantidade += item.quantity;
    });

    const totalFaturamento = Object.values(categoriaMap).reduce(
      (acc, c) => acc + c.faturamento,
      0
    );

    return Object.entries(categoriaMap).map(([categoria, data]) => ({
      categoria,
      faturamento: data.faturamento,
      quantidadeVendida: data.quantidade,
      participacaoFaturamento:
        totalFaturamento > 0
          ? Math.round((data.faturamento / totalFaturamento) * 10000) / 100
          : 0,
    }));
  },
};
