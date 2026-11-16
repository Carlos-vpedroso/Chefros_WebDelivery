"use client";
import { useEffect, useState } from "react";
import {
  Grid3x3,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Package,
  Boxes,
} from "lucide-react";
import { motion } from "framer-motion";
import { Category } from "@/types/product&category";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { categoryService } from "@/services/category.service";
import { DeleteModal } from "@/components/DeleteModal";
import { toast } from "sonner";
import { HeaderDashboard } from "@/components/HeaderDashboard";

interface CategoryModalProps {
  mode: "create" | "edit";
  category?: Category;
  onSave: (data: Partial<Category>) => Promise<void>;
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
    secondary: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`${variantClasses[variant]} rounded-lg border shadow-sm`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon
                className={`h-5 w-5 ${
                  variant === "default" && "text-primary"
                } ${variant === "destructive" && "text-red-500"} ${
                  variant === "secondary" && "text-green-500"
                }`}
              />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryModal = ({
  mode,
  category,
  onSave,
  trigger,
}: CategoryModalProps) => {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    type: "PRODUCT",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData(category);
    }
  }, [mode, category]);

  const handleSubmit = async () => {
    if (!accessToken || !businessInfo) return;
    setLoading(true);
    try {
      let result;
      if (mode === "edit" && formData.id) {
        result = await categoryService.update(
          businessInfo?.slug,
          accessToken,
          formData.id,
          {
            name: formData.name ?? "",
            type: formData.type ?? "PRODUCT",
          },
        );
      } else {
        result = await categoryService.create(accessToken, businessInfo?.id, {
          name: formData.name ?? "",
          type: formData.type ?? "PRODUCT",
        });
      }
      if (result.success && result.data) {
        await onSave(result.data);
        setOpen(false);
        toast.success(
          mode === "create"
            ? "Categoria criada com sucesso!"
            : "Categoria atualizada com sucesso!",
        );
      } else {
        toast.error("Erro ao salvar ou atualizar categoria.");
        console.error("Erro ao salvar categoria:", result.error);
      }
    } catch (error) {
      toast.error("Falha ao conectar ao servidor.");
      console.error("Erro ao salvar categoria:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Cadastrar Categoria" : "Editar Categoria"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações da nova Categoria."
              : "Atualize as informações desta Categoria."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-2">
              Nome
            </Label>
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              id="name"
              placeholder="Ex.: Pizzas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="ml-2">
              Selecione o tipo
            </Label>
            <Select
              key={formData.type}
              value={formData.type || ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as "PRODUCT" | "SERVICE",
                })
              }
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCT">Produto</SelectItem>
                <SelectItem value="SERVICE">Serviço</SelectItem>
              </SelectContent>
            </Select>
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

export default function CategoriasDashboard() {
  const { businessInfo } = useAuth(BusinessContext);
  const { accessToken } = useAuth(EmployeeContext);
  const { categories, setCategories } = useAuth(DashboardContext);
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const [selectedType, setSelectedType] = useState<string | "">("");
  const [filteredCategories, setFilteredCategories] =
    useState<Category[]>(categories);
  const totalProdutos = categories.reduce(
    (acc, item) => acc + (item?._count?.products ?? 0),
    0,
  );

  const totalServicos = categories.reduce(
    (acc, item) => acc + (item?._count?.services ?? 0),
    0,
  );

  const applyFilters = () => {
    let filtered = categories;

    if (selectedCategory) {
      filtered = filtered.filter((cat) => cat.name === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter((cat) => cat.type === selectedType);
    }

    setFilteredCategories(filtered);
  };

  // Função de limpar filtros
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setFilteredCategories(categories);
  };

  // Atualiza automaticamente se "categories" mudar (ex: fetch novo)
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleDelete = async (id: string) => {
    try {
      if (!accessToken || !businessInfo?.slug) {
        return;
      }

      const result = await categoryService.delete(
        businessInfo?.slug,
        accessToken,
        id,
      );

      if (result.success) {
        // remove da lista local sem precisar refazer o fetch
        toast.success("Categoria excluída com sucesso!");
        setCategories(categories.filter((cat) => cat.id !== id));
        return;
      }

      toast.error("Falha ao excluir categoria.");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Falha ao conectar ao servidor.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <HeaderDashboard
        icon={Boxes}
        title="Gestão de Categorias"
        subtitle="Gerencie suas categorias, estoque e disponibilidade"
        btns={
          <CategoryModal
            mode="create"
            onSave={async (newCategory) => {
              if (!newCategory) return;
              setCategories((prev) => [newCategory as Category, ...prev]);
            }}
            trigger={
              <Button variant="outline" className="cursor-pointer">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            }
          />
        }
      />

      <div className="space-y-6 px-4">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total de Categorias"
            value={categories.length}
            icon={Grid3x3}
          />
          <MetricCard
            title="Total de Produtos"
            value={totalProdutos}
            icon={Package}
          />
          <MetricCard
            title="Total de Serviços"
            value={totalServicos}
            icon={Package}
          />
        </div>

        {/* TABELA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card rounded-lg border shadow-sm"
        >
          <div className="flex flex-col items-center justify-between border-b p-6 lg:flex-row">
            <h2 className="text-xl font-semibold">Categorias</h2>
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              {/* Select Tipo */}
              <Select
                value={selectedType}
                onValueChange={(val) => setSelectedType(val)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="PRODUCT">Produto</SelectItem>
                    <SelectItem value="SERVICE">Serviço</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Botões */}
              <div className="flex gap-2">
                <Button
                  onClick={applyFilters}
                  className="bg-primary hover:bg-primary/90"
                >
                  Aplicar Filtro
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="hover:bg-gray-50"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nome</TableHead>
                  <TableHead className="text-center">Tipo</TableHead>
                  <TableHead className="text-center">Itens Atrelados</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">{item.name}</TableCell>
                      <TableCell className="text-center">
                        {item.type === "PRODUCT" ? "Produto" : "Serviço"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.type === "PRODUCT"
                          ? item._count?.products
                          : item._count?.services}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2 text-center">
                        <CategoryModal
                          mode="edit"
                          category={item}
                          onSave={async (updatedCategory) => {
                            if (!updatedCategory) return;
                            setCategories((prev) =>
                              prev.map((p) =>
                                p.id === updatedCategory.id
                                  ? (updatedCategory as Category)
                                  : p,
                              ),
                            );
                          }}
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
                        <DeleteModal
                          onConfirm={() => handleDelete(item.id)}
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-6 text-center">
                      Nenhuma categoria encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
