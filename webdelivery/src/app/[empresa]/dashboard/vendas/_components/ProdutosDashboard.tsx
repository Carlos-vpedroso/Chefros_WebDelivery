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
  Box,
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
import { Category, Product } from "@/types/product&category";
import { Business } from "@/types/business";

import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { productService } from "@/services/product.service";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { DeleteModal } from "@/components/DeleteModal";
import { toast } from "sonner";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { Switch } from "@/components/ui/switch";

interface ProductDialogProps {
  mode: "create" | "edit";
  token: string;
  product?: Product;
  business: Business | null;
  categories: Category[];
  onSave: (data: Partial<Product>) => Promise<void>;
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

const ProductModal = ({
  mode,
  token,
  product,
  business,
  categories,
  onSave,
  trigger,
}: ProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<
    Partial<Product> & { imageFile?: File }
  >({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    active: true,
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
        active: true,
        imageFile: undefined,
      });
      setPreviewUrl(null);
    }
  }, [open, mode]);
  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData(product);

      // 🖼️ Se o produto já tem imagem, define como preview inicial
      if (product.imageUrl) {
        setPreviewUrl(product.imageUrl);
      }
    }
    // 🧹 limpa o preview ao fechar o modal
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [mode, product]);

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
        result = await productService.update(
          business.slug,
          token,
          formData.id,
          {
            name: formData.name ?? "",
            description: formData.description ?? "",
            price: String(formData.price ?? "0"),
            categoryId: formData.categoryId ?? "",
            imageFile: formData.imageFile,
            slug: business.slug,
          },
        );
      } else {
        result = await productService.create(token, business?.id, {
          name: formData.name ?? "",
          description: formData.description ?? "",
          price: String(formData.price ?? "0"),
          categoryId: formData.categoryId ?? "",
          imageFile: formData.imageFile!,
          slug: business.slug,
        });
      }
      if (result.success && result.data) {
        await onSave(result.data);
        setOpen(false);
        if (mode === "edit") {
          toast.success("Produto atualizado com Sucesso!");
        } else {
          toast.success("Produto criado com Sucesso!");
        }
      } else {
        console.error("Erro ao salvar produto:", result.error);
        toast.error("Erro ao salvar produto");
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
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
            {mode === "create" ? "Cadastrar Produto" : "Editar Produto"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações do novo produto."
              : "Atualize as informações deste produto."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-2">
              Nome do Produto
            </Label>
            <Input
              id="name"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Pizza Margherita"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="ml-2">
              Descrição do Produto
            </Label>
            <Input
              id="description"
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ex: Molho de tomate, mussarela, manjericão fresco"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="ml-2">
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
            <Label className="ml-2">Imagem do Produto</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const localUrl = URL.createObjectURL(file);
                  setPreviewUrl(localUrl);

                  // guarda o arquivo em formData para upload posterior
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

export default function ProdutosDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const { products, categories, setProducts } = useAuth(DashboardContext);

  const productsCategories = categories.filter((cat) => cat.type === "PRODUCT");
  const activeProductsCount = products.filter((p) => p.active === true).length;

  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "imageUrl",
      header: () => <div className="text-start">Imagem</div>,
      cell: ({ row }) => (
        <div className="flex justify-start">
          <Image
            src={
              row.original.imageUrl ??
              "https://placehold.co/500x500/858585/ffffff?text=Produto"
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
            Produto
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
                changeStatus(row.original as Product, accessToken)
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
        const produto = row.original;

        return (
          <div className="flex justify-center gap-2">
            {/* Botão de editar */}
            <ProductModal
              mode="edit"
              token={accessToken || ""}
              categories={productsCategories}
              business={businessInfo}
              onSave={async (updatedProduct) => {
                if (!updatedProduct) return;
                setProducts((prev) =>
                  prev.map((p) =>
                    p.id === updatedProduct.id
                      ? (updatedProduct as Product)
                      : p,
                  ),
                );
              }}
              product={produto}
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
              onConfirm={() => handleDelete(produto.id)}
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
    data: products ?? [],
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

  async function changeStatus(product: Product, accessToken: string | null) {
    if (!product || !accessToken || !businessInfo?.slug) return;
    try {
      const result = await productService.update(
        businessInfo?.slug,
        accessToken,
        product.id,
        {
          name: product.name,
          description: product.description ?? "",
          price: String(product.price),
          categoryId: product.categoryId ?? product.category?.id ?? "",
          slug: businessInfo?.slug ?? "",
          active: !product.active,
        },
      );

      if (!result.success || !result.data) {
        if (result.error) {
          toast.info(result.error);
          return;
        }
        toast.error("Erro ao atualizar status do produto");
        return;
      }

      // Atualiza lista de produtos no estado
      setProducts((prev) =>
        prev.map((p) => (p.id === result.data!.id ? result.data! : p)),
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);

      toast.error("Erro inesperado ao alterar status do produto");
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!accessToken || !businessInfo?.slug) {
        return;
      }

      const result = await productService.delete(
        businessInfo?.slug,
        accessToken,
        id,
      );

      if (result.success) {
        // remove da lista local sem precisar refazer o fetch
        setProducts(products.filter((prod) => prod.id !== id));
        toast.success("Produto excluído com sucesso.");
        return;
      }
      toast.info(
        "Este produto não pode ser excluído pois está vinculado a um combo, promoção ou pedido.",
      );
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
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
        title="Gestão de Produtos"
        subtitle="Gerencie seu cardápio, estoque e disponibilidade"
        icon={Box}
        btns={
          <ProductModal
            mode="create"
            token={accessToken || ""}
            categories={productsCategories}
            business={businessInfo}
            onSave={async (newProduct) => {
              if (!newProduct) return;
              setProducts((prev) => [newProduct as Product, ...prev]);
            }}
            trigger={
              <Button variant="outline" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            }
          />
        }
      />
      <div className="space-y-6 p-4">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Produtos"
            value={products.length}
            icon={Package}
          />
          <MetricCard
            title="Categorias"
            value={productsCategories.length}
            icon={Grid3x3}
          />
          <MetricCard
            title="Produtos Ativos"
            value={activeProductsCount}
            icon={Check}
          />
          <MetricCard
            title="Produtos Inativos"
            value={products.length - activeProductsCount}
            icon={X}
            variant="destructive"
          />
        </div>

        {/* Tabela (mock visual) */}
        <Card>
          <CardHeader className="flex flex-col items-center justify-between border-b lg:flex-row">
            <CardTitle className="text-xl">Produtos</CardTitle>
            <div className="flex w-full flex-col gap-4 lg:w-3xl lg:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  placeholder="Buscar produto..."
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
                  {productsCategories.map((categoria) => (
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
                        Nenhum produto encontrado.
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
