"use client";
import { useEffect, useState } from "react";
import {
  Package,
  Grid3x3,
  Plus,
  Search,
  Check,
  X,
  Trash2,
  Edit,
  ArrowUpDown,
  Loader2,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  flexRender,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import Image from "next/image";
import { Category } from "@/types/product&category";
import { Service } from "@/types/service";
import { Business } from "@/types/business";

import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { serviceService } from "@/services/service.service";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { DeleteModal } from "@/components/DeleteModal";
import { toast } from "sonner";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { Switch } from "@/components/ui/switch";

interface ServiceDialogProps {
  mode: "create" | "edit";
  token: string;
  service?: Service;
  business: Business | null;
  categories: Category[];
  onSave: (data: Partial<Service>) => Promise<void>;
  trigger?: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: any;
  variant?: "default" | "destructive" | "secondary";
}) => {
  const variantClasses: Record<string, string> = {
    default: "bg-card border-border text-card-foreground",
    destructive: "bg-red-50 border-red-200 text-red-800",
    secondary: "bg-yellow-50 border-yellow-200 text-yellow-800 ",
  };

  return (
    <motion.div>
      <Card className={variantClasses[variant]}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon
                className={clsx(
                  "h-5 w-5",
                  variant === "default" && "text-primary",
                  variant === "destructive" && "text-red-500",
                  variant === "secondary" && "text-yellow-500",
                )}
              />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ServiceModal = ({
  mode,
  token,
  service,
  business,
  categories,
  onSave,
  trigger,
}: ServiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<
    Partial<Service> & { imageFile?: File }
  >({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    duration: 0,
    active: true,
    imageFile: undefined,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open && mode === "create") {
      setFormData({
        categoryId: "",
        name: "",
        description: "",
        price: "",
        duration: 0,
        active: true,
        imageFile: undefined,
      });
      setPreviewUrl(null);
    }
  }, [open, mode]);

  useEffect(() => {
    if (mode === "edit" && service) {
      setFormData(service);

      if (service.imageUrl) {
        setPreviewUrl(service.imageUrl);
      }
    }
    // 🧹 limpa o preview ao fechar o modal
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [mode, service]);

  async function handleSubmit() {
    if (!token || !business) return;

    if (
      !formData.name?.trim() ||
      !formData.description?.trim() ||
      !formData.price ||
      !formData.categoryId
    ) {
      toast.error("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === "edit" && formData.id) {
        result = await serviceService.update(
          business.slug,
          token,
          formData.id,
          {
            name: formData.name ?? "",
            description: formData.description ?? "",
            price: String(formData.price ?? "0"),
            duration: formData.duration ?? 0,
            categoryId: formData.categoryId ?? "",
            imageFile: formData.imageFile,
            slug: business.slug,
          },
        );
      } else {
        result = await serviceService.create(token, business?.id, {
          name: formData.name ?? "",
          description: formData.description ?? "",
          price: String(formData.price ?? "0"),
          duration: formData.duration ?? 0,
          categoryId: formData.categoryId ?? "",
          imageFile: formData.imageFile!,
          slug: business.slug,
        });
      }
      if (result.success && result.data) {
        await onSave(result.data);
        setOpen(false);
        if (mode === "edit") {
          toast.success("Serviço atualizado com Sucesso!");
        } else {
          toast.success("Serviço criado com Sucesso!");
        }
      } else {
        console.error("Erro ao salvar serviço:", result.error);
        toast.error("Erro ao salvar serviço");
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
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
            {mode === "create" ? "Cadastrar Serviço" : "Editar Serviço"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações do novo serviço."
              : "Atualize as informações deste serviço."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-2">
              Nome do Serviço
            </Label>
            <Input
              id="name"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Corte de Cabelo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="ml-2">
              Descrição do Serviço
            </Label>
            <Input
              id="description"
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ex: Corte de cabelo com finalização"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="price" className="mb-2">
                Preço
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price?.toString() ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Ex: 49.90"
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="duration" className="mb-2">
                Duração (minutos)
              </Label>
              <Input
                id="duration"
                type="number"
                step="1"
                value={formData.duration ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="Ex: 50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories" className="ml-2">
              Categoria
            </Label>
            <Select
              value={formData.categoryId ?? ""}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger id="categories" className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="ml-2">Imagem do Serviço</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                  setFormData({ ...formData, imageFile: file });
                }
              }}
            />

            {/* Preview da imagem */}
            {previewUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Pré-visualização"
                  className="border-border h-40 w-40 rounded-md border object-cover"
                />
              </div>
            )}
          </div>
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

export default function ServicosDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const { services, categories, setServices } = useAuth(DashboardContext);

  const servicesCategories = categories.filter((cat) => cat.type === "SERVICE");
  const activeServicesCount = services.filter((s) => s.active === true).length;

  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "imageUrl",
      header: () => <div className="text-start">Imagem</div>,
      cell: ({ row }) => (
        <div className="flex justify-start">
          <Image
            src={
              row.original.imageUrl ??
              "https://placehold.co/500x500/858585/ffffff?text=Serviço"
            }
            alt={row.original.name}
            width={65}
            height={65}
            className="h-16 w-16 rounded-md object-cover"
            unoptimized
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer p-0 font-semibold"
          >
            Serviço
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-foreground text-left font-medium">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer p-0 font-semibold"
          >
            Preço
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const price = Number(row.original.price) || 0;
        return (
          <div className="text-center font-medium">R$ {price.toFixed(2)}</div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer p-0 font-semibold"
          >
            Duração (min)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const duration = Number(row.original.duration) || 0;
        return (
          <div className="text-center font-medium">{duration} minutos</div>
        );
      },
    },
    {
      id: "category.name",
      accessorFn: (row) => row.category?.id,
      header: () => <div className="text-center">Categoria</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="secondary">{row.original.category?.name}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const isActive = row.original.active;

        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={() =>
                changeStatus(row.original as Service, accessToken)
              }
              className={clsx(
                "data-[state=checked]:bg-green-500",
                "data-[state=unchecked]:bg-red-500",
              )}
            />

            <span
              className={clsx(
                "text-xs font-medium",
                isActive ? "text-green-600" : "text-red-600",
              )}
            >
              {isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        const servico = row.original;

        return (
          <div className="flex justify-center gap-2">
            {/* Botão de editar */}
            <ServiceModal
              mode="edit"
              token={accessToken || ""}
              categories={servicesCategories}
              business={businessInfo}
              onSave={async (updatedService) => {
                if (!updatedService) return;
                setServices((prev) =>
                  prev.map((s) =>
                    s.id === updatedService.id
                      ? (updatedService as Service)
                      : s,
                  ),
                );
              }}
              service={servico}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
              }
            />

            {/* Botão de excluir */}
            <DeleteModal
              onConfirm={() => handleDelete(servico.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              }
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: services ?? [],
    columns,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (categoryFilter === "all") {
      table.getColumn("category.name")?.setFilterValue(undefined);
    } else {
      table.getColumn("category.name")?.setFilterValue(categoryFilter);
    }
  }, [categoryFilter, table]);

  useEffect(() => {
    if (statusFilter === "all") {
      table.getColumn("active")?.setFilterValue(undefined);
    } else {
      table.getColumn("active")?.setFilterValue(statusFilter === "active");
    }
  }, [statusFilter, table]);

  async function changeStatus(service: Service, accessToken: string | null) {
    if (!service || !accessToken || !businessInfo?.slug) return;
    try {
      const result = await serviceService.update(
        businessInfo?.slug,
        accessToken,
        service.id,
        {
          name: service.name,
          description: service.description ?? "",
          price: String(service.price),
          duration: service.duration ?? 0,
          categoryId: service.categoryId ?? service.category?.id ?? "",
          slug: businessInfo?.slug ?? "",
          active: !service.active,
        },
      );

      if (!result.success || !result.data) {
        if (result.error) {
          toast.info(result.error);
          return;
        }
        toast.error("Erro ao atualizar status do serviço");
        return;
      }

      setServices((prev) =>
        prev.map((p) => (p.id === result.data!.id ? result.data! : p)),
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro inesperado ao alterar status do serviço");
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!accessToken || !businessInfo?.slug) {
        return;
      }

      const result = await serviceService.delete(
        businessInfo?.slug,
        accessToken,
        id,
      );

      if (result.success) {
        // remove da lista local sem precisar refazer o fetch
        setServices(services.filter((servico) => servico.id !== id));
        toast.success("Serviço excluído com sucesso.");
        return;
      }
      toast.info(
        "Este serviço não pode ser excluído pois está vinculado a um combo, promoção ou pedido.",
      );
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cabeçalho */}
      <HeaderDashboard
        title="Gestão de Serviços"
        subtitle="Gerencie seu catálogo de serviços e disponibilidade"
        icon={Wrench}
        btns={
          <ServiceModal
            mode="create"
            token={accessToken || ""}
            categories={servicesCategories}
            business={businessInfo}
            onSave={async (newService) => {
              if (!newService) return;
              setServices((prev) => [newService as Service, ...prev]);
            }}
            trigger={
              <Button variant="outline" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Novo Serviço
              </Button>
            }
          />
        }
      />
      <div className="space-y-6 p-4">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Serviços"
            value={services.length}
            icon={Package}
          />
          <MetricCard
            title="Categorias"
            value={servicesCategories.length}
            icon={Grid3x3}
          />
          <MetricCard
            title="Serviços Ativos"
            value={activeServicesCount}
            icon={Check}
          />
          <MetricCard
            title="Serviços Inativos"
            value={services.length - activeServicesCount}
            icon={X}
            variant="destructive"
          />
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader className="flex flex-col items-center justify-between border-b lg:flex-row">
            <CardTitle className="text-xl">Serviços</CardTitle>
            <div className="flex w-full flex-col gap-4 lg:w-3xl lg:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  placeholder="Buscar serviço..."
                  className="pl-10"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Todas Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {servicesCategories.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Todos Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : header.column.columnDef.header &&
                                header.column.columnDef.header instanceof
                                  Function
                              ? header.column.columnDef.header(
                                  header.getContext(),
                                )
                              : header.column.columnDef.header}
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
                      <TableCell
                        colSpan={columns.length}
                        className="text-muted-foreground py-6 text-center"
                      >
                        Nenhum serviço encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-muted-foreground text-sm">
                  Página {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<<"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Próxima
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {">>"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
