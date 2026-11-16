"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpDown, Box, Filter, Loader2 } from "lucide-react";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

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
import { Period, ProdutoMaisVendido } from "@/types/dashboard";

export default function ProdutosMaisVendidosDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);

  const [period, setPeriod] = useState<Period>("MONTH");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProdutoMaisVendido[]>([]);

  async function fetchData() {
    if (!accessToken || !businessInfo?.slug) return;

    setLoading(true);

    const result = await dashboardService.produtosMaisVendidos(
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

  // -----------------------------
  // COLUNAS DA TABELA
  // -----------------------------
  const columns: ColumnDef<ProdutoMaisVendido>[] = [
    {
      accessorKey: "ranking",
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold">{row.original.ranking}°</div>
      ),
    },
    {
      accessorKey: "imageUrl",
      header: "Imagem",
      cell: ({ row }) => (
        <Image
          src={
            row.original.imageUrl ?? "https://placehold.co/100x100?text=Produto"
          }
          alt={row.original.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-md object-cover"
          unoptimized
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-semibold"
        >
          Produto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">Categoria</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="secondary">{row.original.category ?? "—"}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "quantidadeVendida",
      header: () => <div className="text-center">Qtd. Vendida</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.quantidadeVendida}
        </div>
      ),
    },
    {
      accessorKey: "faturamento",
      header: () => <div className="text-center">Faturamento</div>,
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          R$ {row.original.faturamento.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "participacaoFaturamento",
      header: () => <div className="text-center">% Part.</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline">
            {row.original.participacaoFaturamento.toFixed(2)}%
          </Badge>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderDashboard
        title="Produtos Mais Vendidos"
        subtitle="Ranking de desempenho dos produtos"
        icon={Box}
      />

      <div className="space-y-6 p-4">
        {/* TABELA */}
        <Card>
          <CardHeader className="flex flex-col gap-4 border-b md:flex-row md:items-center md:justify-between">
            <CardTitle>Ranking de Produtos</CardTitle>

            {/* FILTROS (lado direito) */}
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

          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id}>
                    {group.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
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
