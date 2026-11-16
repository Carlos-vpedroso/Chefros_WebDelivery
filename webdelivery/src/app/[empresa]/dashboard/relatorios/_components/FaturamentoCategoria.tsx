"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Filter, Loader2, Layers } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeaderDashboard } from "@/components/HeaderDashboard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { dashboardService } from "@/services/dashboard.service";
import { Period } from "@/types/dashboard";

interface FaturamentoCategoria {
  categoria: string;
  faturamento: number;
  quantidadeVendida: number;
  participacaoFaturamento: number;
}

export default function FaturamentoPorCategoriaDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);

  const [period, setPeriod] = useState<Period>("MONTH");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FaturamentoCategoria[]>([]);

  async function fetchData() {
    if (!accessToken || !businessInfo?.slug) return;

    setLoading(true);

    const result = await dashboardService.faturamentoPorCategoria(
      accessToken,
      businessInfo.slug,
      {
        period,
        startDate: period === "CUSTOM" ? startDate : undefined,
        endDate: period === "CUSTOM" ? endDate : undefined,
      },
    );

    if (result.success && result.data) {
      setData(result.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderDashboard
        title="Faturamento por Categoria"
        subtitle="Análise de participação no faturamento"
        icon={Layers}
      />

      <div className="space-y-6 p-4">
        <Card>
          <CardHeader className="flex flex-col gap-4 border-b md:flex-row md:items-center md:justify-between">
            <CardTitle>Distribuição de Faturamento</CardTitle>

            {/* FILTROS */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Select
                value={period}
                onValueChange={(v) => setPeriod(v as Period)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Hoje</SelectItem>
                  <SelectItem value="WEEK">Semana</SelectItem>
                  <SelectItem value="MONTH">Mês</SelectItem>
                  <SelectItem value="CUSTOM">Personalizado</SelectItem>
                </SelectContent>
              </Select>

              {period === "CUSTOM" && (
                <>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </>
              )}

              <Button onClick={fetchData} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="mr-2 h-4 w-4" />
                )}
                Filtrar
              </Button>
            </div>
          </CardHeader>

          {/* VISUAL DE PARTICIPAÇÃO */}
          <CardContent className="space-y-4">
            {data.map((item) => (
              <div key={item.categoria}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{item.categoria}</span>
                  <span>{item.participacaoFaturamento.toFixed(2)}%</span>
                </div>
                <div className="bg-muted h-2 w-full rounded">
                  <div
                    className="bg-primary h-2 rounded"
                    style={{
                      width: `${item.participacaoFaturamento}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TABELA */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Categoria</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Qtd Vendida</TableHead>
                  <TableHead className="text-center">Faturamento</TableHead>
                  <TableHead className="text-center">% Part.</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.length ? (
                  data.map((item) => (
                    <TableRow key={item.categoria}>
                      <TableCell className="font-medium">
                        {item.categoria}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantidadeVendida}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        R$ {item.faturamento.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {item.participacaoFaturamento.toFixed(2)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhum dado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
