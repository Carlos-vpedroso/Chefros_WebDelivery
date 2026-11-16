"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, SquareChartGantt } from "lucide-react";

import { HeaderDashboard } from "@/components/HeaderDashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { dashboardService } from "@/services/dashboard.service";
import { Period, ProdutoVendido } from "@/types/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { DashboardContext } from "@/contexts/DashboardContext";
import { BusinessContext } from "@/contexts/BusinessContext";

export default function RelatoriosDashboard() {
  const [period, setPeriod] = useState<Period | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProdutoVendido[]>([]);
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);

  // ⚠️ ajuste conforme sua auth

  const slug = businessInfo?.slug;

  const totalFaturado = data.reduce((acc, item) => acc + item.totalFaturado, 0);

  async function carregarRelatorio() {
    if (!accessToken || !slug || !period) {
      return;
    }
    setLoading(true);

    const response = await dashboardService.produtosVendidos(
      accessToken,
      slug,
      {
        period,
        startDate: period === "CUSTOM" ? startDate : undefined,
        endDate: period === "CUSTOM" ? endDate : undefined,
      },
    );

    if (response.success && response.data) {
      setData(response.data);
    } else {
      setData([]);
    }

    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <HeaderDashboard
        icon={SquareChartGantt}
        title="Relatórios de Vendas"
        subtitle="Resumo completo das vendas do seu negócio"
      />

      {/* 📊 Tabela */}
      <div className="bg-card border-border mx-4 overflow-hidden rounded-lg border">
        {/* Header da tabela */}
        <div className="border-b p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            {/* Título */}
            <h2 className="text-xl font-semibold">
              Produtos vendidos {data.length > 0 && `(${data.length})`}
            </h2>

            {/* Filtros */}
            <div className="flex flex-wrap items-end gap-3">
              <Select
                value={period}
                onValueChange={(v) => setPeriod(v as Period)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="DAY">Dia</SelectItem>
                  <SelectItem value="WEEK">Semana</SelectItem>
                  <SelectItem value="MONTH">Mês</SelectItem>
                  <SelectItem value="CUSTOM">Personalizado</SelectItem>
                </SelectContent>
              </Select>

              <AnimatePresence>
                {period === "CUSTOM" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-end gap-3 overflow-hidden"
                  >
                    <div className="w-36">
                      <label className="text-sm font-medium">
                        Data inicial
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="w-36">
                      <label className="text-sm font-medium">Data final</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                className="flex cursor-pointer items-center gap-2"
                disabled={loading || !accessToken || !slug}
                onClick={carregarRelatorio}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Filtrar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-8">Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Qtd. Vendida</TableHead>
              <TableHead className="text-right">Pedidos</TableHead>
              <TableHead className="pr-8 text-right">Faturamento</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center">
                  Nenhum dado para exibir
                </TableCell>
              </TableRow>
            )}

            {data.map((item) => (
              <TableRow key={item.productId}>
                <TableCell className="pl-8 font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  {item.quantidadeVendida}
                </TableCell>
                <TableCell className="text-right">
                  {item.totalPedidos}
                </TableCell>
                <TableCell className="pr-8 text-right">
                  R$ {item.totalFaturado.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* 👇 TOTAL AQUI */}
      {data.length > 0 && (
        <div className="flex justify-end border-t px-8 py-4">
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Total vendido</p>
            <p className="text-lg font-semibold">
              R$ {totalFaturado.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
