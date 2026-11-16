"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Wallet,
  Star,
  RefreshCw,
  TrendingUp,
  Clock,
  Package,
  AlertCircle,
  UserCheck,
  CreditCard,
  ClipboardList,
  ShoppingCart,
  ChartLine,
  Trash,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { HeaderDashboard } from "@/components/HeaderDashboard";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { formatR$ } from "@/lib/utils";
import { ActivityLog } from "@/types/activityLog";
import { activityLogService } from "@/services/activityLog.service";
import { BusinessContext } from "@/contexts/BusinessContext";
import { EmployeeContext } from "@/contexts/EmployeeContext";

const activityTypeConfig: Record<string, { icon: any; color: string }> = {
  ORDER_CREATED: {
    icon: ShoppingCart,
    color: "text-blue-600 bg-blue-100",
  },
  ORDER_COMPLETED: {
    icon: ClipboardList,
    color: "text-green-600 bg-green-100",
  },
  PAYMENT_RECEIVED: {
    icon: CreditCard,
    color: "text-emerald-600 bg-emerald-100",
  },
  PRODUCT_CREATED: {
    icon: Package,
    color: "text-purple-600 bg-purple-100",
  },
  EMPLOYEE_LOGIN: {
    icon: UserCheck,
    color: "text-orange-600 bg-orange-100",
  },
  SYSTEM_EVENT: {
    icon: AlertCircle,
    color: "text-gray-600 bg-gray-100",
  },
  PRODUCT_DELETED: {
    icon: Trash,
    color: "text-red-600 bg-red-100",
  },
  SERVICE_DELETED: {
    icon: Trash,
    color: "text-red-600 bg-red-100",
  },
};

const HomeDashboard = () => {
  const { businessInfo } = useAuth(BusinessContext);
  const { accessToken } = useAuth(EmployeeContext);
  const { infoVendas, fetchAnalytics, loadingAnalytics } =
    useAuth(DashboardContext);

  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);

  const faturamentoFormated = formatR$(Number(infoVendas?.totalFaturado));
  const ticketFormated = formatR$(Number(infoVendas?.ticketMedio));
  const tempoFormatado = `${Math.floor(infoVendas?.tempoMedioAtendimento as number)} min`;

  function formatDate(date: string) {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const fetchLogs = async () => {
    if (!businessInfo?.slug || !accessToken) return;

    try {
      const result = await activityLogService.getRecord(
        businessInfo.slug,
        accessToken,
        10,
      );

      if (!result.success) {
        console.error("Erro ao buscar logs", result.error);
        return;
      }
      if (result.data) {
        setActivityLog(result.data);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar logs:", error);
    }
  };

  useEffect(() => {
    if (!businessInfo?.slug || !accessToken) return;

    fetchLogs();
  }, [businessInfo?.slug, accessToken]);

  const statsCards = [
    {
      title: "Faturamento do dia",
      value: faturamentoFormated,
      trend: infoVendas?.trends.faturamento,
      icon: Wallet,
      iconColor: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Pedidos em andamento",
      value: infoVendas?.pendingOrdersCount,
      trend: infoVendas?.trends.pendingOrders,
      icon: Loader2,
      iconColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Pedidos finalizados hoje",
      value: infoVendas?.completedOrdersCount,
      trend: infoVendas?.trends.completedOrders,
      icon: CheckCircle2,
      iconColor: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },

    {
      title: "Ticket médio",
      value: ticketFormated,
      trend: infoVendas?.trends.ticketMedio,
      icon: TrendingUp,
      iconColor: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      title: "Tempo médio",
      value: tempoFormatado,
      trend: infoVendas?.trends.tempoMedioAtendimento,
      icon: Clock,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Avaliação média",
      value: "4.8",
      icon: Star,
      iconColor: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <HeaderDashboard
        title="Visão Geral Vendas"
        subtitle="Funcionamento diário"
        icon={ChartLine}
        btns={
          <Button
            variant="outline"
            className="flex cursor-pointer items-center gap-2"
            disabled={loadingAnalytics}
            onClick={() => fetchAnalytics()}
          >
            <RefreshCw
              className={`h-4 w-4 ${loadingAnalytics ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        }
      />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-3 px-4 select-none sm:grid-cols-3 lg:grid-cols-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              className="h-full transition-all hover:shadow-md sm:hover:-translate-y-1"
            >
              <CardContent className="flex flex-col p-4 sm:p-6">
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div
                    className={`h-10 w-10 sm:h-12 sm:w-12 ${card.bgColor} flex items-center justify-center rounded-xl sm:rounded-2xl`}
                  >
                    <IconComponent
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`}
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <p className="text-muted-foreground text-xs leading-tight font-medium sm:text-sm">
                    {card.title}
                  </p>
                  <p className="text-card-foreground text-2xl leading-none font-bold sm:text-3xl">
                    {card.value}
                  </p>
                </div>

                {/* Badge de crescimento/decrescimento para mobile */}
                <div className="mt-3">
                  {card.trend !== undefined &&
                    card.trend !== null &&
                    card.trend !== 0 && (
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                          card.trend > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {card.trend > 0 ? "↗" : "↘"}
                        <span>
                          {Math.abs(Math.round(card.trend * 10) / 10)}%
                        </span>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos de Desempenho */}
      <div className="flex flex-col gap-6 px-4 lg:flex-row">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Faturamento dos últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={infoVendas?.faturamentoData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="dia" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  formatter={(value) =>
                    `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ fill: "var(--chart-1)", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Quantidade de pedidos (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={infoVendas?.pedidosData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="dia" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="quantidade"
                  fill="var(--chart-2)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 px-4 pb-4 lg:grid-cols-2">
        <Card className="col-span-2 border-2">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>

          <CardContent className="h-[280px] space-y-4 overflow-y-auto">
            {activityLog.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma atividade registrada ainda.
              </p>
            )}

            {activityLog.map((log) => {
              const config = activityTypeConfig[log.type];
              const Icon = config?.icon;

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  {/* Ícone */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${config?.color}`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{log.title}</p>

                    {log.description && (
                      <p className="text-muted-foreground text-xs">
                        {log.description}
                      </p>
                    )}

                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      {log.createdAt && (
                        <span>{formatDate(log.createdAt)}</span>
                      )}

                      {log.employee?.name && (
                        <>
                          <span>•</span>
                          <span>{log.employee.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default HomeDashboard;
