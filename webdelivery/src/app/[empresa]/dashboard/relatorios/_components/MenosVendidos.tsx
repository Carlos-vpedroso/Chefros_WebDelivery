"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Box, Loader2, TrendingDown } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { HeaderDashboard } from "@/components/HeaderDashboard";

import { useAuth } from "@/hooks/useAuth";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { dashboardService } from "@/services/dashboard.service";
import { ProdutoMenosVendido } from "@/types/dashboard";


export default function ProdutosMenosVendidosDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);

  const [data, setData] = useState<ProdutoMenosVendido[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    if (!accessToken || !businessInfo?.slug) return;

    setLoading(true);

    const result = await dashboardService.produtosMenosVendidos(
      accessToken,
      businessInfo.slug
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
  const columns: ColumnDef<ProdutoMenosVendido>[] = [
    {
      id: "ranking",
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold">
          {row.index + 1}°
        </div>
      ),
    },
    {
      accessorKey: "imageUrl",
      header: "Imagem",
      cell: ({ row }) => (
        <Image
          src={
            row.original.imageUrl ??
            "https://placehold.co/100x100?text=Produto"
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
      header: "Produto",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">Categoria</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="secondary">
            {row.original.category ?? "—"}
          </Badge>
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
      accessorKey: "ultimaVenda",
      header: () => <div className="text-center">Última Venda</div>,
      cell: ({ row }) => (
        <div className="text-center text-sm">
          {row.original.ultimaVenda
            ? new Date(row.original.ultimaVenda).toLocaleDateString("pt-BR")
            : "—"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            variant={
              row.original.status === "SEM_VENDA"
                ? "destructive"
                : "outline"
            }
          >
            {row.original.status === "SEM_VENDA"
              ? "Sem Venda"
              : "Baixo Giro"}
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
        title="Produtos Menos Vendidos"
        subtitle="Produtos com baixo desempenho ou sem vendas"
        icon={TrendingDown}
      />

      <div className="space-y-6 p-4">
        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle>Produtos com Baixo Giro</CardTitle>

            {loading && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
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
                          header.getContext()
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
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      Nenhum produto encontrado.
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
