"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  Plus,
  Edit,
  Trash2,
  Sofa,
  Clock,
  Loader2,
  Grid2X2,
  MoreVertical,
  TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Table, TableStatus } from "@/types/table";
import { Business } from "@/types/business";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { tableService } from "@/services/table.service";
import { BusinessContext } from "@/contexts/BusinessContext";
import { Separator } from "@/components/ui/separator";
import { DeleteModal } from "@/components/DeleteModal";
import Link from "next/link";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface TableDialogProps {
  mode: "create" | "edit";
  token: string;
  table?: Table;
  businessInfo: Business | null;
  onSave: (data: Partial<Table>) => Promise<void>;
  trigger?: React.ReactNode;
}

const TableModal = ({
  mode,
  token,
  table,
  businessInfo,
  onSave,
  trigger,
}: TableDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Table>>({
    name: "",
    capacity: 0,
    status: "AVAILABLE",
  });
  useEffect(() => {
    if (mode === "edit" && table) {
      setFormData(table);
    }
    if (!open && mode === "create") {
      setFormData({
        name: "",
        capacity: 0,
        status: "AVAILABLE",
      });
    }
  }, [open, mode, table]);

  async function handleSubmit() {
    if (!token || !businessInfo) return;
    setLoading(true);
    try {
      if (!formData.name || formData.capacity === undefined) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setLoading(false);
        return;
      }

      let result;
      if (mode === "edit" && formData.id) {
        result = await tableService.update(
          businessInfo?.slug,
          token,
          formData.id,
          {
            name: formData.name ?? "",
            capacity: formData.capacity ?? 0,
            status: formData.status ?? "AVAILABLE",
          },
        );
      } else {
        result = await tableService.create(token, businessInfo.id, {
          name: formData.name ?? "",
          capacity: formData.capacity ?? 0,
        });
      }
      if (result.success && result.data) {
        await onSave(result.data);
        setOpen(false);
        if (mode === "edit") {
          toast.success("Mesa atualizada com Sucesso!");
        } else {
          toast.success("Mesa criada com Sucesso!");
        }
      } else {
        console.error("Erro ao salvar mesa:", result.error);
        toast.error("Erro ao salvar Mesa");
      }
    } catch (error) {
      console.error("Erro ao salvar Mesa:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Cadastrar Mesa" : "Editar Mesa"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações da nova mesa."
              : "Atualize as informações desta mesa."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-2">
              Nome da Mesa
            </Label>
            <Input
              id="name"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Mesa 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity" className="ml-2">
              Capacidade da Mesa
            </Label>
            <Input
              id="capacity"
              type="text"
              value={formData.capacity ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: Number(e.target.value.replace(/\D/g, "")),
                })
              }
              placeholder="4"
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="capacity" className="ml-2">
                Status da Mesa
              </Label>
              <Select
                value={formData.status} // ← valor inicial aparecendo no SelectTrigger
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as TableStatus })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="AVAILABLE">Disponível</SelectItem>
                  <SelectItem value="OCCUPIED">Ocupada</SelectItem>
                  <SelectItem value="CLOSED">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Cadastrar" : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ========== PÁGINA PRINCIPAL ==========
export default function MesasDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const { tables, setTables } = useAuth(DashboardContext);
  const router = useRouter();
  const total = tables.length;
  const ocupadas = tables.filter((m) => m.status === "OCCUPIED").length;
  const livres = tables.filter((m) => m.status === "AVAILABLE").length;
  const reservadas = tables.filter((m) => m.status === "CLOSED").length;

  const handleDelete = async (id: string) => {
    try {
      if (!accessToken || !businessInfo) {
        return;
      }

      const result = await tableService.delete(
        businessInfo?.slug,
        accessToken,
        id,
      );

      if (result.success) {
        setTables(tables.filter((prod) => prod.id !== id));
      }
    } catch (error) {
      console.error("Erro ao excluir mesa:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* TÍTULO */}
      <HeaderDashboard
        icon={Grid2X2}
        title="Gestão de Mesas"
        subtitle="Gerencie suas mesas e pedidos"
        btns={
          <TableModal
            mode="create"
            token={accessToken || ""}
            businessInfo={businessInfo}
            onSave={async (newTable) => {
              if (!newTable) return;
              setTables((prev) => [newTable as Table, ...prev]);
            }}
            trigger={
              <Button
                variant="outline"
                className="flex cursor-pointer items-center justify-between"
              >
                <Plus />
                Nova Mesa
              </Button>
            }
          />
        }
      />

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Sofa className="text-primary h-6 w-6" />
            <div>
              <p className="text-muted-foreground text-sm">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-muted-foreground text-sm">Livres</p>
              <p className="text-2xl font-bold">{livres}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-muted-foreground text-sm">Ocupadas</p>
              <p className="text-2xl font-bold">{ocupadas}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-muted-foreground text-sm">Reservadas</p>
              <p className="text-2xl font-bold">{reservadas}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* GRID DE MESAS */}
      <div className="grid grid-cols-1 gap-6 px-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((mesa) => (
          <Card
            key={mesa.id}
            className={clsx(
              "overflow-hidden rounded-xl border transition-all hover:scale-[1.02] hover:shadow-xl",
              mesa.status === "AVAILABLE" && "border-l-4 border-l-green-500",
              mesa.status === "OCCUPIED" && "border-l-4 border-l-red-500",
              mesa.status === "CLOSED" && "border-l-4 border-l-amber-500",
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                {/* -----------------------
              ÁREA CLICÁVEL (ESQUERDA)
              Apenas essa DIV navega ao ser clicada
              ----------------------- */}
                <Link
                  className="w-full flex-1 cursor-pointer space-y-1"
                  href={`vendas/mesa/${mesa.id}`}
                >
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    {mesa.name}
                  </CardTitle>

                  <div className="text-texto/60 flex items-center gap-2 text-sm">
                    <Sofa className="h-4 w-4" />
                    <span className="font-medium">{mesa.capacity} pessoas</span>
                  </div>
                </Link>
                <div className="shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer opacity-70 hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      {/* Trigger para editar - aqui usamos o dropdown item como trigger do modal */}
                      <TableModal
                        mode="edit"
                        token={accessToken || ""}
                        businessInfo={businessInfo}
                        table={mesa}
                        onSave={async (updatedTable) => {
                          if (!updatedTable) return;
                          setTables((prev) =>
                            prev.map((p) =>
                              p.id === updatedTable.id
                                ? (updatedTable as Table)
                                : p,
                            ),
                          );
                        }}
                        // passamos um botão simples como trigger, não um DropdownMenuItem
                        trigger={
                          <DropdownMenuItem
                            asChild
                            onSelect={(e) => e.preventDefault()}
                          >
                            <button className="flex w-full items-center text-left">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Mesa
                            </button>
                          </DropdownMenuItem>
                        }
                      />

                      {/* Delete - similar */}
                      <DeleteModal
                        onConfirm={() => handleDelete(mesa.id)}
                        trigger={
                          <DropdownMenuItem
                            asChild
                            onSelect={(e) => e.preventDefault()}
                          >
                            <button className="flex w-full items-center text-left text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir Mesa
                            </button>
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex items-center justify-between pt-2">
              <Badge
                className={clsx(
                  "rounded-lg px-3 py-1 text-xs font-semibold",
                  mesa.status === "AVAILABLE" &&
                    "bg-green-500/10 text-green-700",
                  mesa.status === "OCCUPIED" && "bg-red-500/10 text-red-700",
                  mesa.status === "CLOSED" && "bg-amber-500/10 text-amber-700",
                )}
              >
                {mesa.status === "AVAILABLE"
                  ? "DISPONÍVEL"
                  : mesa.status === "OCCUPIED"
                    ? "OCUPADA"
                    : "RESERVADA"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
