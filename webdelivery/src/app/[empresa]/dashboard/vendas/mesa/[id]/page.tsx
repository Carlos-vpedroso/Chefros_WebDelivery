"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  NotebookPen,
  ArrowLeft,
  Utensils,
  ShoppingCart,
  ChefHat,
  CheckCircle2,
  Loader2,
  Printer,
  Clock,
  CreditCard,
  DollarSign,
  Banknote,
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { ticketService } from "@/services/ticket.service";
import Image from "next/image";
import { formatR$, getPromotionalPrice } from "@/lib/utils";
import { Order, OrderStatus, OrderType, Ticket } from "@/types/ticket&order";
import { PaymentMethod } from "@/types/payment";
import { CartItem, Combo, Product } from "@/types/product&category";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";
import Link from "next/link";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Payments {
  id: PaymentMethod;
  name: string;
  icon: React.ComponentType<any>;
}

const PAYMENT_METHODS: Payments[] = [
  { id: "CASH", name: "Dinheiro", icon: Banknote },
  { id: "CREDIT_CARD", name: "Crédito", icon: CreditCard },
  { id: "DEBIT_CARD", name: "Débito", icon: CreditCard },
  { id: "PIX", name: "PIX", icon: DollarSign },
];

interface ProductCardProps {
  product: Product;
  quantity: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (
    id: string,
    type: "PRODUCT" | "COMBO",
    quantity: number,
  ) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  addItem,
  updateQuantity,
}) => {
  const promotion = product.promotionItem?.[0]?.promotion;

  const originalPrice = Number(product.price);

  const promotionalPrice = getPromotionalPrice(originalPrice, promotion);

  const hasPromotion = promotionalPrice !== null;

  return (
    <Card className="border-border flex justify-between rounded-xl border shadow-md transition-all hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 xl:flex-row">
        {/* IMAGEM */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex h-[90px] max-w-[90px] min-w-[90px] overflow-hidden rounded-lg border">
            <Image
              src={
                product.imageUrl ??
                "https://placehold.co/500x500/858585/ffffff?text=Produto"
              }
              alt={product.name}
              height={500}
              width={500}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center justify-center md:hidden">
            <div className="flex items-center rounded-full border bg-transparent">
              <Button
                variant="ghost"
                className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
                onClick={() =>
                  updateQuantity(product.id, "PRODUCT", quantity - 1)
                }
              >
                <Minus className="h-4 w-4 text-red-700" />
              </Button>

              <span className="text-texto px-2 text-sm font-semibold">
                {quantity}
              </span>

              <Button
                variant="ghost"
                className="cursor-pointer rounded-full p-1 transition hover:bg-gray-100"
                onClick={() => {
                  addItem({
                    type: "PRODUCT",
                    product,
                    quantity: 1,
                    unitPrice: promotionalPrice ?? originalPrice,
                    originalPrice,
                    subtotal: promotionalPrice ?? originalPrice,
                    promotion: promotion ?? undefined,
                  });
                }}
              >
                <Plus className="h-4 w-4 text-green-700" />
              </Button>
            </div>
          </div>
        </div>

        {/* TEXTO */}
        <div className="flex flex-1 flex-col items-start gap-2">
          <div>
            <h1 className="line-clamp-2 text-lg leading-tight font-semibold">
              {product.name}
            </h1>

            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {product.description}
            </p>
          </div>

          <div className="flex flex-row items-center gap-1 leading-tight">
            {hasPromotion && (
              <span className="text-texto/60 text-xs line-through">
                {formatR$(originalPrice)}
              </span>
            )}

            <span
              className={`text-lg font-bold ${
                hasPromotion ? "text-green-600" : "text-green-600"
              }`}
            >
              {formatR$(hasPromotion ? promotionalPrice : originalPrice)}
            </span>
          </div>
        </div>

        {/* CONTADOR */}
        <div className="hidden flex-col items-center justify-center md:flex">
          <div className="flex items-center rounded-full border bg-transparent">
            <Button
              variant="ghost"
              className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
              onClick={() =>
                updateQuantity(product.id, "PRODUCT", quantity - 1)
              }
            >
              <Minus className="h-4 w-4 text-red-700" />
            </Button>

            <span className="text-texto px-2 text-sm font-semibold">
              {quantity}
            </span>

            <Button
              variant="ghost"
              className="cursor-pointer rounded-full p-1 transition hover:bg-gray-100"
              onClick={() => {
                addItem({
                  type: "PRODUCT",
                  product,
                  quantity: 1,
                  unitPrice: promotionalPrice ?? originalPrice,
                  originalPrice,
                  subtotal: promotionalPrice ?? originalPrice,
                  promotion: promotion ?? undefined,
                });
              }}
            >
              <Plus className="h-4 w-4 text-green-700" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="-mt-4">
        <Input placeholder="Adicionar Observação" className="h-8 text-xs" />
      </CardFooter>
    </Card>
  );
};

interface ComboCardProps {
  combo: Combo;
  quantity: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (
    id: string,
    type: "PRODUCT" | "COMBO",
    quantity: number,
  ) => void;
}
const ComboCard: React.FC<ComboCardProps> = ({
  combo,
  quantity,
  addItem,
  updateQuantity,
}) => {
  return (
    <Card className="border-border flex justify-between rounded-xl border shadow-md transition-all hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 xl:flex-row">
        {/* IMAGEM */}
        <div className="flex flex-row items-center justify-between">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 8000,
              }),
            ]}
          >
            <CarouselContent className="select-none">
              {combo.items.map((item) => (
                <CarouselItem key={item.id} className="w-8 basis-[75%]">
                  <div className="relative flex h-[90px] max-w-[90px] min-w-[90px] overflow-hidden rounded-lg border">
                    <Image
                      src={
                        item.product?.imageUrl ??
                        "https://placehold.co/500x500/858585/ffffff?text=Produto"
                      }
                      alt={item.product?.name ?? "Foto do Produto"}
                      height={500}
                      width={500}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex justify-center">
                      <p className="line-clamp-2 text-center text-xs font-medium text-white drop-shadow-lg">
                        {item.product?.name}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex flex-col items-center justify-center md:hidden">
            <div className="flex items-center rounded-full border bg-transparent">
              <Button
                variant="ghost"
                className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
                onClick={() => updateQuantity(combo.id, "COMBO", quantity - 1)}
              >
                <Minus className="h-4 w-4 text-red-700" />
              </Button>

              <span className="text-texto px-2 text-sm font-semibold">
                {quantity}
              </span>

              <Button
                variant="ghost"
                className="cursor-pointer rounded-full p-1 transition hover:bg-gray-100"
                onClick={() => {
                  addItem({
                    type: "COMBO",
                    combo,
                    quantity: 1,
                    unitPrice: Number(combo.price),
                    subtotal: Number(combo.price),
                  });
                }}
              >
                <Plus className="h-4 w-4 text-green-700" />
              </Button>
            </div>
          </div>
        </div>

        {/* TEXTO */}
        <div className="flex flex-1 flex-col items-start justify-between gap-2">
          <div>
            <h1 className="line-clamp-2 text-lg leading-tight font-semibold">
              {combo.name}
            </h1>

            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {combo.description}
            </p>
          </div>

          <h2 className="text-lg font-bold text-green-600">
            {formatR$(Number(combo.price))}
          </h2>
        </div>

        {/* CONTADOR */}
        <div className="hidden flex-col items-center justify-center md:flex">
          <div className="flex items-center rounded-full border bg-transparent">
            <Button
              variant="ghost"
              className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
              onClick={() => updateQuantity(combo.id, "COMBO", quantity - 1)}
            >
              <Minus className="h-4 w-4 text-red-700" />
            </Button>

            <span className="text-texto px-2 text-sm font-semibold">
              {quantity}
            </span>

            <Button
              variant="ghost"
              className="cursor-pointer rounded-full p-1 transition hover:bg-gray-100"
              onClick={() => {
                addItem({
                  type: "COMBO",
                  combo,
                  quantity: 1,
                  unitPrice: Number(combo.price),
                  subtotal: Number(combo.price),
                });
              }}
            >
              <Plus className="h-4 w-4 text-green-700" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="-mt-4">
        <Input placeholder="Adicionar Observação" className="h-8 text-xs" />
      </CardFooter>
    </Card>
  );
};

interface ItemsGridProps {
  productsByCategory: Record<string, Product[]>;
  combos: Combo[];
  addItem: (item: CartItem) => void;
  updateQuantity: (
    id: string,
    type: "PRODUCT" | "COMBO",
    quantity: number,
  ) => void;
  getQuantity: (id: string, type: "PRODUCT" | "COMBO") => number;
}

const ItemsGrid: React.FC<ItemsGridProps> = ({
  productsByCategory,
  combos,
  addItem,
  updateQuantity,
  getQuantity,
}) => {
  return (
    <div className="space-y-6">
      {combos && combos.length > 0 && (
        <div className="space-y-4">
          {/* Título da Categoria */}
          <h2 className="text-texto/80 border-l-4 border-green-600 pl-3 text-2xl font-bold">
            Combos
          </h2>

          {/* Lista de Produtos da Categoria */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {combos.map((combo) => (
              <ComboCard
                key={combo.id}
                combo={combo}
                addItem={addItem}
                updateQuantity={updateQuantity}
                quantity={getQuantity(combo.id, "COMBO")}
              />
            ))}
          </div>
        </div>
      )}
      {Object.keys(productsByCategory).length === 0 && (
        <p className="text-center text-sm text-gray-500">
          Nenhum produto encontrado.
        </p>
      )}
      {Object.entries(productsByCategory).map(([categoryName, items]) => (
        <div key={categoryName} className="space-y-4">
          {/* Título da Categoria */}
          <h2 className="text-texto/80 border-l-4 border-green-600 pl-3 text-2xl font-bold">
            {categoryName}
          </h2>

          {/* Lista de Produtos da Categoria */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addItem={addItem}
                updateQuantity={updateQuantity}
                quantity={getQuantity(product.id, "PRODUCT")}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function OrderMesaDashboard() {
  const { id } = useParams();
  const mesaId = id as string;
  const { products, categories, combos, tables } = useAuth(DashboardContext);
  const { accessToken, userInfo } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const [ticket, setTicket] = useState<Ticket[]>([]);
  const [ordersTable, setOrdersTable] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openCommand, setOpenCommand] = useState<boolean>(false);
  //states para a primeira TAB
  const [productSearch, setProductSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]); // Mesma situação do Cart. porém não podemos utilizar o Context Aqui
  const getItemId = (item: CartItem) =>
    item.type === "PRODUCT" ? item.product.id : item.combo.id;
  const addItem = (item: CartItem) => {
    setSelectedItems((prev) => {
      const itemId = getItemId(item);

      const exists = prev.find(
        (i) => getItemId(i) === itemId && i.type === item.type,
      );

      if (exists) {
        return prev.map((i) =>
          getItemId(i) === itemId && i.type === item.type
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                subtotal: i.unitPrice * (i.quantity + item.quantity),
              }
            : i,
        );
      }

      return [...prev, item];
    });
  };
  const removeItem = (id: string, type: "PRODUCT" | "COMBO") => {
    setSelectedItems((prev) =>
      prev.filter((item) => !(getItemId(item) === id && item.type === type)),
    );
  };
  const updateQuantity = (
    id: string,
    type: "PRODUCT" | "COMBO",
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }

    setSelectedItems((prev) =>
      prev.map((item) =>
        getItemId(item) === id && item.type === type
          ? {
              ...item,
              quantity,
              subtotal: item.unitPrice * quantity,
            }
          : item,
      ),
    );
  };
  const getQuantity = (id: string, type: "PRODUCT" | "COMBO") =>
    selectedItems.find((item) => {
      if (item.type === "PRODUCT" && type === "PRODUCT") {
        return item.product.id === id;
      }

      if (item.type === "COMBO" && type === "COMBO") {
        return item.combo.id === id;
      }

      return false;
    })?.quantity ?? 0;

  // states para pagamento
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const mesa = tables.find((t) => t.id === mesaId);

  const filteredProducts = products.filter((product) => {
    const matchesName =
      product.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      product.active === true;

    const matchesCategory =
      !selectedCategory || product.category?.name === selectedCategory;

    return matchesName && matchesCategory;
  });

  // Agrupar produtos por categoria
  const productsByCategory = filteredProducts.reduce(
    (acc, product) => {
      const categoryName = product.category?.name || "Outros";

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  async function fetchMesaOrder() {
    try {
      setLoading(true);

      if (!accessToken || !businessInfo) return;
      const result = await ticketService.getAll(
        accessToken,
        businessInfo?.slug,
        {
          tableId: mesaId,
          status: "OPEN",
        },
      );

      if (!result.success || !result.data || result.data.length === 0) {
        setTicket([]);
        return;
      }

      setTicket(result.data);
      if (result.data[0]?.orders) {
        setOrdersTable(result.data[0].orders);
      } else {
        setOrdersTable([]);
      }
    } catch (err) {
      console.error("❌ Erro ao carregar pedidos da mesa:", err);
      setTicket([]);
    } finally {
      setLoading(false);
    }
  }

  // Buscar itens da mesa
  useEffect(() => {
    // Só executa quando accessToken e businessInfo EXISTIREM
    if (!accessToken || !businessInfo) return;
    fetchMesaOrder();
  }, [mesaId, accessToken, businessInfo]);

  async function handleCreateOrder() {
    try {
      if (!accessToken || !businessInfo) return;

      if (selectedItems.length === 0) {
        toast.error("Nenhum item selecionado.");
        return;
      }

      setLoading(true);

      // Prepara itens enviados para API
      const formattedItems = selectedItems
        .filter((item) => item.type === "PRODUCT")
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          note: item.obs ?? undefined,
        }));

      const formattedCombos = selectedItems
        .filter((item) => item.type === "COMBO")
        .map((item) => ({
          comboId: item.combo.id,
          quantity: item.quantity,
          note: item.obs ?? undefined,
        }));

      const orderPayload = {
        tableId: mesaId,
        employeeId: userInfo?.id,
        status: "PENDING" as OrderStatus,
        type: "TABLE" as OrderType,
        items: formattedItems,
        combos: formattedCombos,
      };

      const result = await orderService.create(businessInfo.id, orderPayload);

      if (!result.success || !result.data) {
        toast.error(result.error || "Erro ao criar pedido.");
        return;
      }

      const { order, ticket: updatedTicket } = result.data;

      toast.success("Pedido criado com sucesso!");

      setOrdersTable((prev) => [...prev, order]);

      setTicket((prev) => {
        if (!prev || prev.length === 0) {
          return [updatedTicket];
        }

        return prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
      });

      setSelectedItems([]);
    } catch (error) {
      toast.error("Não foi possível conectar ao servidor.");
      console.error("❌ Erro ao enviar pedido:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCheckout = async () => {
    try {
      if (
        !accessToken ||
        !businessInfo ||
        !ticket[0] ||
        !selectedPaymentMethod
      ) {
        toast.error("Dados incompletos para finalizar pagamento.");
        return;
      }

      setLoading(true);

      // Dados para o checkout
      const checkoutData = {
        paymentMethod: selectedPaymentMethod as PaymentMethod,
        employeeId: userInfo?.id ?? "",
        tableId: mesaId,
      };

      // Chamar o service de checkout
      const result = await ticketService.checkout(
        accessToken,
        businessInfo.slug,
        ticket[0].id,
        checkoutData,
      );

      if (!result.success) {
        console.error("Erro no checkout:", result.error);
        toast.error(result.error || "Erro ao processar pagamento.");
        return;
      }

      // Sucesso!
      toast.success("Pagamento realizado com sucesso!");

      // Fechar o dialog de pagamento
      setShowPaymentDialog(false);

      // Resetar o método de pagamento selecionado
      setSelectedPaymentMethod("");

      // Atualizar a comanda (agora esta vazia/fechada)
      setTicket([]);
      setOrdersTable([]);
    } catch (error) {
      console.error("❌ Erro no checkout:", error);
      toast.error("Erro inesperado ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const orderTotal = selectedItems.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  const ticketTotal = ordersTable?.reduce(
    (acc, order) => acc + Number(order.totalAmount),
    0,
  );

  return (
    <>
      {/* TITULO */}
      <div className="bg-card border-border border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${businessInfo?.slug}/dashboard/vendas?page=Mesas`}>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-texto flex items-center gap-2 text-2xl font-bold">
                  <Utensils className="text-primary h-6 w-6" />
                  {mesa?.name}
                </h1>
                <p className="text-texto/60 text-sm">
                  Capacidade: {mesa?.capacity} pessoas
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 md:flex-row">
              <Badge
                className={clsx(
                  "px-3 py-1 text-sm",
                  mesa?.status === "AVAILABLE" &&
                    "border-green-500/20 bg-green-500/10 text-green-700",
                  mesa?.status === "OCCUPIED" &&
                    "border-red-500/20 bg-red-500/10 text-red-700",
                  mesa?.status === "CLOSED" &&
                    "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
                )}
              >
                {mesa?.status === "AVAILABLE"
                  ? "Disponível"
                  : mesa?.status === "OCCUPIED"
                    ? "Ocupada"
                    : "Reservada"}
              </Badge>
              {ordersTable?.length > 0 && (
                <div className="text-right">
                  <p className="text-texto/60 text-sm">Total da Conta</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatR$(ticketTotal)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="produtos" className="w-full">
          {/* Tabs */}
          <TabsList className="bg-fundo3 grid w-full grid-cols-3">
            <TabsTrigger
              value="produtos"
              className="flex cursor-pointer items-center gap-2"
            >
              <ChefHat className="h-4 w-4" />
              Cardápio
            </TabsTrigger>
            <TabsTrigger
              value="resumo"
              className="flex cursor-pointer items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Resumo ({selectedItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="comanda"
              className="flex cursor-pointer items-center gap-2"
            >
              <NotebookPen className="h-4 w-4" />
              Comanda ({ordersTable?.length})
            </TabsTrigger>
          </TabsList>

          {/* ============================================================
              🟢 TAB 1 — ADICIONAR PRODUTOS
        ============================================================ */}
          <TabsContent value="produtos">
            {/* Buscar produtos */}
            <div className="mb-6 flex w-full gap-4">
              <Command className="w-full rounded-lg border">
                <CommandInput
                  className="w-full"
                  placeholder="Buscar produto ou categoria..."
                  value={productSearch}
                  onFocus={() => setOpenCommand(true)}
                  onValueChange={(value) => {
                    setProductSearch(value);
                    setSelectedCategory(null); // reset categoria se digitar
                  }}
                />

                {openCommand && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CommandList className="z-50 w-full rounded-md border shadow-lg">
                      {/* 🔹 Exibir categorias como sugestões */}
                      <CommandGroup heading="Categorias">
                        {combos.length > 0 && (
                          <CommandItem
                            value="Combos"
                            onSelect={(value) => {
                              setSelectedCategory(value);
                              setProductSearch("");
                              setOpenCommand(false);
                            }}
                          >
                            Combos
                          </CommandItem>
                        )}
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={(value) => {
                              setSelectedCategory(value);
                              setProductSearch("");
                              setOpenCommand(false);
                            }}
                          >
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </motion.div>
                )}
              </Command>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setProductSearch("");
                  setSelectedCategory("");
                  setOpenCommand(false);
                }}
              >
                Limpar Filtros
              </Button>
            </div>

            <ItemsGrid
              productsByCategory={productsByCategory}
              combos={combos}
              addItem={addItem}
              updateQuantity={updateQuantity}
              getQuantity={getQuantity}
            />
          </TabsContent>

          {/* ============================================================
              🔵 TAB 2 — RESUMO DO PEDIDO
        ============================================================ */}
          <TabsContent value="resumo">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Itens Selecionados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedItems.length === 0 ? (
                      <div className="py-12 text-center">
                        <ShoppingCart className="text-texto/20 mx-auto mb-2 h-12 w-12" />
                        <p className="text-texto/60">Nenhum item selecionado</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedItems.map((item) => {
                          const isProduct = item.type === "PRODUCT";

                          const name = isProduct
                            ? item.product.name
                            : item.combo.name;

                          return (
                            <div
                              key={`${item.type}-${isProduct ? item.product.id : item.combo.id}`}
                              className="flex gap-4 p-4"
                            >
                              {/* IMAGEM */}
                              {isProduct ? (
                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                                  <Image
                                    src={
                                      item.product.imageUrl ??
                                      "https://placehold.co/500x500/858585/ffffff?text=Item"
                                    }
                                    alt={name}
                                    width={500}
                                    height={500}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <Carousel
                                  opts={{
                                    align: "start",
                                    loop: true,
                                  }}
                                  plugins={[
                                    Autoplay({
                                      delay: 8000,
                                    }),
                                  ]}
                                >
                                  <CarouselContent className="select-none">
                                    {item.combo.items.map((item) => (
                                      <CarouselItem
                                        key={item.id}
                                        className="w-8 basis-[75%]"
                                      >
                                        <div className="relative flex h-[90px] max-w-[90px] min-w-[90px] overflow-hidden rounded-lg border">
                                          <Image
                                            src={
                                              item.product?.imageUrl ??
                                              "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                            }
                                            alt={
                                              item.product?.name ??
                                              "Foto do Produto"
                                            }
                                            height={500}
                                            width={500}
                                            unoptimized
                                            className="h-full w-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                          <div className="absolute inset-x-0 bottom-0 flex justify-center">
                                            <p className="line-clamp-2 text-center text-xs font-medium text-white drop-shadow-lg">
                                              {item.product?.name}
                                            </p>
                                          </div>
                                        </div>
                                      </CarouselItem>
                                    ))}
                                  </CarouselContent>
                                </Carousel>
                              )}

                              {/* INFO */}
                              <div className="flex-1 space-y-2">
                                <h3 className="line-clamp-2 text-base font-semibold">
                                  {item.quantity}x {name}
                                </h3>

                                <p className="text-sm font-semibold text-green-600">
                                  {formatR$(item.unitPrice)} × {item.quantity} ={" "}
                                  {formatR$(item.subtotal)}
                                </p>

                                {item.obs && (
                                  <p className="text-texto/60 text-xs italic">
                                    Obs: {item.obs}
                                  </p>
                                )}

                                {/* CONTADOR */}
                                <div className="flex w-fit items-center gap-2 rounded-full border">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(
                                        isProduct
                                          ? item.product.id
                                          : item.combo.id,
                                        item.type,
                                        item.quantity - 1,
                                      )
                                    }
                                  >
                                    <Minus className="h-4 w-4 text-red-600" />
                                  </Button>

                                  <span className="w-6 text-center text-sm font-semibold">
                                    {item.quantity}
                                  </span>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(
                                        isProduct
                                          ? item.product.id
                                          : item.combo.id,
                                        item.type,
                                        item.quantity + 1,
                                      )
                                    }
                                  >
                                    <Plus className="h-4 w-4 text-green-600" />
                                  </Button>
                                </div>

                                <Separator />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-texto/60">Itens</span>
                        <span className="font-semibold">
                          {selectedItems.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-texto/60">Subtotal</span>
                        <span className="font-semibold">
                          {formatR$(orderTotal)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatR$(orderTotal)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateOrder}
                      disabled={loading || selectedItems.length === 0}
                      className="h-12 w-full cursor-pointer text-base font-semibold"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Enviar para Cozinha
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ============================================================
              🔵 TAB 3 — COMANDA
        ============================================================ */}
          <TabsContent value="comanda">
            <div className="space-y-6">
              {ordersTable?.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <NotebookPen className="text-texto/20 mx-auto mb-2 h-12 w-12" />
                    <p className="text-texto/60 text-lg">
                      Nenhum pedido ativo nesta mesa
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ordersTable?.map((order, orderIndex) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: orderIndex * 0.1 }}
                      >
                        <div className="border-border overflow-hidden rounded-xl border">
                          <div className="border-border border-b bg-orange-100 px-4 py-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-black">
                                Pedido #{orderIndex + 1}
                              </CardTitle>
                              <Badge variant="secondary">
                                <Clock className="mr-1 h-3 w-3" />
                                {order.items.length} itens
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-0">
                            <div className="divide-border divide-y bg-orange-50">
                              {order?.items?.map((item) =>
                                item.type === "PRODUCT" ? (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between px-4 py-3"
                                  >
                                    <div className="space-y-1">
                                      <p className="text-sm font-semibold text-black">
                                        {item?.product?.name}
                                      </p>
                                      <p className="text-xs text-black/60">
                                        {item.quantity}x{" "}
                                        {formatR$(Number(item?.product?.price))}
                                      </p>
                                      {item.note && (
                                        <p className="text-xs text-black/60">
                                          Obs.: {item.note}
                                        </p>
                                      )}
                                    </div>
                                    <p className="font-semibold text-green-600">
                                      {formatR$(Number(item?.subtotal))}
                                    </p>
                                  </div>
                                ) : (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between px-4 py-3"
                                  >
                                    <div className="space-y-1">
                                      <p className="text-sm font-semibold text-black">
                                        {item.combo?.name}
                                      </p>
                                      <p className="text-xs text-black/60">
                                        {item.quantity}x{" "}
                                        {formatR$(Number(item?.combo?.price))}
                                      </p>
                                      {item.note && (
                                        <p className="text-xs text-black/60">
                                          Obs.: {item.note}
                                        </p>
                                      )}
                                    </div>
                                    <p className="font-semibold text-green-600">
                                      {formatR$(Number(item?.subtotal))}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </CardContent>

                          <div className="border-border border-t bg-orange-50 px-4 py-4">
                            <div className="flex w-full items-center justify-between">
                              <span className="font-bold text-black">
                                Total
                              </span>
                              <span className="text-xl font-bold text-green-600">
                                {formatR$(Number(order?.totalAmount))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Ações da Comanda */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div>
                          <p className="text-texto/60 mb-1 text-sm">
                            Total da Conta
                          </p>
                          <p className="text-3xl font-bold text-green-600">
                            {formatR$(ticketTotal)}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => window.print()}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                          </Button>
                          <Button
                            className="cursor-pointer bg-green-600 hover:bg-green-700"
                            onClick={() => setShowPaymentDialog(true)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Finalizar Conta
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Dialog de Pagamento */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Pagamento</DialogTitle>
            <DialogDescription>
              Selecione o método de pagamento e confirme a venda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Total */}
            <div className="rounded-lg border bg-transparent p-4">
              <p className="text-texto/60 mb-1 text-sm">Total a pagar</p>
              <p className="text-3xl font-bold text-green-600">
                {formatR$(ticketTotal)}
              </p>
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Button
                      key={method.id}
                      variant={
                        selectedPaymentMethod === method.id
                          ? "default"
                          : "outline"
                      }
                      className="h-20 cursor-pointer flex-col gap-2"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm">{method.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={loading || !selectedPaymentMethod}
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmar Pagamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
