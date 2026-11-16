"use client";
import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  X,
  Loader2,
  Check,
  User,
  ChevronRight,
  Package,
  Monitor,
  Motorbike,
  ShoppingBag,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { PaymentMethod } from "@/types/payment";
import { Product } from "@/types/product&category";
import { fetchCep, formatR$, getPromotionalPrice } from "@/lib/utils";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { OrderStatus, OrderType } from "@/types/ticket&order";
import { orderService } from "@/services/order.service";
import { CartContext } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";
import { useMask } from "@/hooks/useMask";
import { Checkbox } from "@/components/ui/checkbox";
interface Payments {
  id: PaymentMethod;
  name: string;
  icon: any;
}
interface OrderTypeConfig {
  id: OrderType;
  label: string;
  icon: any;
}

const PAYMENT_METHODS: Payments[] = [
  { id: "CASH", name: "Dinheiro", icon: Banknote },
  { id: "CREDIT_CARD", name: "Crédito", icon: CreditCard },
  { id: "DEBIT_CARD", name: "Débito", icon: CreditCard },
  { id: "PIX", name: "PIX", icon: DollarSign },
];

const ORDERS_TYPE: OrderTypeConfig[] = [
  { id: "COUNTER", label: "Local", icon: ShoppingBag },
  { id: "DELIVERY", label: "Delivery", icon: Motorbike },
  { id: "TAKEOUT", label: "Retirada", icon: ShoppingCart },
  // { id: "ONLINE", label: "Online", icon: Globe },
  // { id: "APPOINTMENT", label: "Serviço Agendado", icon: Calendar },
];

export default function PDVDashboard() {
  const { products, categories, combos } = useAuth(DashboardContext);
  const { accessToken, userInfo } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setItemNotes,
    totalPrice,
  } = useAuth(CartContext);
  const { cep: cepMask, phone: phoneMask } = useMask();

  // Estados do carrinho
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Estados do cliente
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: false,
    complementoInput: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  // Estados do pagamento
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // Estado do tipo da Order
  const [orderType, setOrderType] = useState<string>("");

  // Resetar os valores do Modal
  useEffect(() => {
    setSelectedPaymentMethod("");
    setOrderType("");
    setPaymentAmount("");
  }, [showPaymentDialog]);

  useEffect(() => {
    if (address.cep.length === 9) {
      (async () => {
        const cepData = await fetchCep(address.cep);
        if (cepData) {
          setAddress((prev) => ({
            ...prev,
            rua: cepData.street,
            bairro: cepData.neighborhood,
            cidade: cepData.city,
            estado: cepData.state,
          }));
        }
      })();
    }
  }, [address.cep]);

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory && product.active;
  });

  const filteredCombos = combos.filter((combo) => {
    const search = searchTerm.toLowerCase();

    const matchesName = combo.name.toLowerCase().includes(search);

    return matchesName;
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

  const visibleCategories = categories.filter((category) => {
    if (category.type === "PRODUCT") {
      return (category._count?.products ?? 0) > 0;
    }

    if (category.type === "SERVICE") {
      return (category._count?.services ?? 0) > 0;
    }

    return false;
  });

  // Função para abrir modal de pagamento
  const handleOpenPayment = () => {
    if (cart.length === 0) {
      toast.error("Adicione itens ao carrinho");
      return;
    }
    setPaymentAmount(totalPrice.toFixed(2));
    setShowPaymentDialog(true);
  };

  // Calcular troco
  const calculateChange = () => {
    if (selectedPaymentMethod !== "CASH") return 0;
    const paid = parseFloat(paymentAmount) || 0;
    return Math.max(0, paid - totalPrice);
  };

  const handleCreateOrder = async () => {
    try {
      if (!accessToken || !businessInfo) return;
      if (cart.length === 0) {
        toast.error("Nenhum item selecionado.");
        return;
      }
      setLoading(true);

      const formattedAddress =
        orderType === "DELIVERY"
          ? {
              cep: address.cep!,
              rua: address.rua!,
              numero: address.numero!,
              bairro: address.bairro!,
              cidade: address.cidade!,
              estado: address.estado!,
              complemento: address.complementoInput || undefined,
            }
          : undefined;

      const formattedItems = cart
        .filter((item) => item.type === "PRODUCT")
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          note: item.obs || undefined,
        }));

      const formattedCombos = cart
        .filter((item) => item.type === "COMBO")
        .map((item) => ({
          comboId: item.combo.id,
          quantity: item.quantity,
          note: item.obs,
        }));

      const orderPayload = {
        paymentMethod: selectedPaymentMethod as PaymentMethod,
        type: orderType as OrderType,
        name: customerName,
        phone: customerPhone,
        address: formattedAddress,
        items: formattedItems,
        combos: formattedCombos,
        employeeId: userInfo?.id,
      };

      const result = await orderService.create(businessInfo.id, orderPayload);

      if (!result.success || !result.data) {
        toast.error(result.error || "Erro ao criar pedido.");
        return;
      }

      toast.success("Pedido criado com sucesso!");
      setCustomerName("");
      setCustomerPhone("");
      setShowPaymentDialog(false);
      clearCart();
    } catch (error) {
      toast.error("Não foi possível conectar ao servidor.");
      console.error("❌ Erro ao enviar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-fundo flex h-screen flex-col"
    >
      {/* Header */}
      <HeaderDashboard
        title="Ponto de Venda"
        subtitle="Atendimento no balcão"
        icon={Monitor}
      />

      <div className="flex flex-1 overflow-hidden md:pr-[420px]">
        {/* Lado Esquerdo - Produtos */}
        <div className="border-border flex flex-1 flex-col overflow-hidden">
          {/* Busca e Filtros */}
          <div className="border-border bg-card space-y-3 border-b p-4">
            <div className="relative">
              <Search className="text-texto/40 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="cursor-pointer whitespace-nowrap"
                size="sm"
              >
                Todos
              </Button>
              {combos.length > 0 && (
                <Button
                  variant={
                    selectedCategory === "combos" ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory("combos")}
                  className="cursor-pointer whitespace-nowrap"
                  size="sm"
                >
                  Combos
                </Button>
              )}
              {visibleCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={
                    selectedCategory === cat.name ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(cat.name)}
                  className="cursor-pointer whitespace-nowrap"
                  size="sm"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="flex-1 overflow-y-auto p-4">
            {Object.keys(productsByCategory).length === 0 &&
            filteredCombos.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Package className="text-texto/20 mb-2 h-12 w-12" />
                <p className="text-texto/60">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredCombos.length > 0 &&
                  (selectedCategory === "all" ||
                    selectedCategory === "combos") && (
                    <div key="combos" className="space-y-4">
                      <h2 className="text-texto border-l-4 border-green-600 pl-3 text-xl font-bold">
                        Combos
                      </h2>
                      <Separator />

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {filteredCombos.map((combo) => {
                          const itemInCart = cart.find(
                            (i) =>
                              i.type === "COMBO" && i.combo.id === combo.id,
                          );

                          return (
                            <div
                              key={combo.id}
                              className="bg-card border-border group flex cursor-pointer flex-col overflow-hidden rounded-lg border transition-all hover:shadow-lg"
                              onClick={() =>
                                addToCart({
                                  type: "COMBO",
                                  combo: combo,
                                  quantity: 1,
                                  unitPrice: combo.price,
                                  subtotal: combo.price,
                                })
                              }
                            >
                              <div className="relative w-full overflow-hidden">
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
                                  <CarouselContent className="m-0 select-none">
                                    {combo.items.map((item, index) => (
                                      <CarouselItem
                                        key={`${item.id}-${index}`}
                                        className="h-full p-0"
                                      >
                                        <div className="bg-fundo2 relative h-32 overflow-hidden">
                                          <Image
                                            src={
                                              item.product?.imageUrl ??
                                              "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                            }
                                            alt={
                                              item.product?.name ||
                                              "Foto do Produto"
                                            }
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            fill
                                            unoptimized
                                          />

                                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                          <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
                                            <p className="text-center text-sm font-semibold text-white drop-shadow-lg">
                                              {item.product?.name}
                                            </p>
                                          </div>
                                        </div>
                                      </CarouselItem>
                                    ))}
                                  </CarouselContent>
                                </Carousel>
                                <div className="flex flex-1 flex-col justify-between space-y-1 p-2">
                                  <h3 className="text-texto text-md line-clamp-2 font-semibold">
                                    {combo.name}
                                  </h3>
                                  <ul className="grid grid-cols-1 lg:grid-cols-2">
                                    {combo.items.map((i) => (
                                      <li
                                        key={i.product?.id}
                                        className="text-texto/60 line-clamp-2 text-xs"
                                      >
                                        {i.quantity}x {i.product?.name}
                                      </li>
                                    ))}
                                  </ul>
                                  <p className="text-lg font-bold text-green-600">
                                    {formatR$(Number(combo.price))}
                                  </p>
                                </div>

                                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="from-fundo to-fundo2 text-texto flex items-center gap-1 border-none py-1 shadow-sm backdrop-blur-sm"
                                  >
                                    <Layers size={12} />
                                    {combo?.items?.length || 0} itens
                                  </Badge>
                                </div>
                                {itemInCart && (
                                  <div className="from-cor1 to-cor2 absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br font-bold text-white shadow-lg">
                                    {itemInCart.quantity}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {Object.entries(productsByCategory).map(
                  ([categoryName, items]) => (
                    <div key={categoryName} className="space-y-4">
                      <h2 className="text-texto border-l-4 border-green-600 pl-3 text-xl font-bold">
                        {categoryName}
                      </h2>
                      <Separator />

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {items.map((product) => {
                          const itemInCart = cart.find(
                            (i) =>
                              i.type === "PRODUCT" &&
                              i.product.id === product.id,
                          );
                          const promotion =
                            product.promotionItem?.[0]?.promotion;
                          const originalPrice = Number(product.price);
                          const promotionalPrice = getPromotionalPrice(
                            originalPrice,
                            promotion,
                          );
                          const hasPromotion = promotionalPrice !== null;

                          return (
                            <div
                              key={product.id}
                              className="bg-card border-border group flex cursor-pointer flex-col overflow-hidden rounded-lg border transition-all hover:shadow-lg"
                              onClick={() =>
                                addToCart({
                                  type: "PRODUCT",
                                  product,
                                  quantity: 1,
                                  originalPrice: originalPrice,
                                  unitPrice: promotionalPrice ?? originalPrice,
                                  subtotal: promotionalPrice ?? originalPrice,
                                  promotion,
                                })
                              }
                            >
                              <div className="bg-fundo2 relative h-32 overflow-hidden">
                                <Image
                                  src={
                                    product.imageUrl ??
                                    "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                  }
                                  alt={product.name}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  unoptimized
                                />
                                {hasPromotion && (
                                  <Badge className="from-cor1 to-cor2 absolute top-2 left-2 border-none bg-linear-to-br text-xs font-bold tracking-wide text-white">
                                    {promotion?.type === "PERCENTAGE"
                                      ? `-${promotion.percentage}%`
                                      : `-${formatR$(Number(promotion?.value))}`}
                                  </Badge>
                                )}
                                {itemInCart && (
                                  <div className="from-cor1 to-cor2 absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br font-bold text-white shadow-lg">
                                    {itemInCart.quantity}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-1 flex-col justify-between space-y-1 p-2">
                                <h3 className="text-texto text-md line-clamp-2 font-semibold">
                                  {product.name}
                                </h3>
                                <p className="text-texto/60 line-clamp-2 text-xs">
                                  {product.description}
                                </p>
                                <div className="flex flex-col leading-tight">
                                  {hasPromotion && (
                                    <span className="text-texto/60 text-xs line-through">
                                      {formatR$(originalPrice)}
                                    </span>
                                  )}

                                  <span
                                    className={`text-lg font-bold ${
                                      hasPromotion
                                        ? "text-green-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {formatR$(
                                      hasPromotion
                                        ? promotionalPrice
                                        : originalPrice,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito - Carrinho */}
        <div className="bg-card fixed top-0 right-0 z-40 flex h-screen w-full flex-col border-l md:w-[420px]">
          {/* Dados do Cliente */}
          <div className="border-border space-y-3 border-b p-4">
            <h3 className="text-texto flex items-center gap-2 font-semibold">
              <User className="h-4 w-4" />
              Cliente
            </h3>
            <Input
              placeholder="Nome do cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              placeholder="Telefone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(phoneMask(e.target.value))}
            />
          </div>

          {/* Itens do Carrinho */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-texto flex items-center gap-2 font-semibold">
                <ShoppingCart className="h-4 w-4" />
                Carrinho ({cart.length})
              </h3>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="cursor-pointer text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="text-texto/20 mx-auto mb-2 h-12 w-12" />
                <p className="text-texto/60">Carrinho vazio</p>
                <p className="text-texto/40 text-sm">
                  Adicione produtos para iniciar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) =>
                  item.type === "PRODUCT" ? (
                    <Card key={item.product.id} className="border-border py-2">
                      <CardContent className="space-y-2 p-3">
                        <div className="flex gap-3">
                          <div className="bg-fundo2 h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.product.imageUrl || ""}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 text-sm font-semibold">
                              {item.product.name}
                            </h4>
                            <p className="text-texto/80 text-sm font-bold">
                              {formatR$(Number(item.product.price))}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 cursor-pointer"
                            onClick={() =>
                              removeFromCart(item.product.id, "PRODUCT")
                            }
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="border-border flex items-center gap-2 rounded-full border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  "PRODUCT",
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-3 w-3 text-red-600" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  "PRODUCT",
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3 text-green-600" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.unitPrice < item.originalPrice && (
                              <span className="text-texto/40 text-sm line-through">
                                {formatR$(item.originalPrice * item.quantity)}
                              </span>
                            )}

                            {/* Preço final */}
                            <span className="text-lg font-bold text-green-600">
                              {formatR$(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>

                        <Input
                          placeholder="Observação (opcional)"
                          value={item.obs || ""}
                          onChange={(e) =>
                            setItemNotes(
                              item.product.id,
                              "PRODUCT",
                              e.target.value,
                            )
                          }
                          className="h-8 text-xs"
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      key={item.combo.id}
                      className="border-cor1/40 bg-cor1/5 rounded-xl border p-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <Badge className="bg-cor1 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white">
                          COMBO
                        </Badge>
                        <div className="flex gap-3">
                          {/* Carousel de imagens */}
                          <Carousel
                            opts={{
                              align: "start",
                              loop: true,
                            }}
                            plugins={[
                              Autoplay({
                                delay: 5000,
                              }),
                            ]}
                            className="w-24 shrink-0"
                          >
                            <CarouselContent>
                              {item.combo.items.map((comboItem) => (
                                <CarouselItem key={comboItem.id}>
                                  <Image
                                    src={
                                      comboItem.product?.imageUrl ??
                                      "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                    }
                                    alt={comboItem.product?.name || "Produto"}
                                    width={96}
                                    height={96}
                                    unoptimized
                                    className="rounded-xl object-contain"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>

                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 text-sm font-semibold">
                              {item.combo.name}
                            </h4>

                            <ul className="text-texto/60 my-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                              {item.combo.items.slice(0, 6).map((comboItem) => (
                                <li key={comboItem.id} className="line-clamp-1">
                                  • {comboItem.quantity}x{" "}
                                  {comboItem.product?.name}
                                </li>
                              ))}

                              {item.combo.items.length > 6 && (
                                <li className="col-span-2 italic">
                                  + {item.combo.items.length - 6} itens
                                </li>
                              )}
                            </ul>

                            <p className="text-texto/80 text-sm font-bold">
                              {formatR$(Number(item.combo.price))}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 cursor-pointer"
                            onClick={() =>
                              removeFromCart(item.combo.id, "COMBO")
                            }
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="border-border flex items-center gap-2 rounded-full border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  item.combo.id,
                                  "COMBO",
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-3 w-3 text-red-600" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  item.combo.id,
                                  "COMBO",
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3 text-green-600" />
                            </Button>
                          </div>
                          <p className="font-bold text-green-600">
                            {formatR$(Number(item.combo.price) * item.quantity)}
                          </p>
                        </div>

                        <Input
                          placeholder="Observação (opcional)"
                          value={item.obs || ""}
                          onChange={(e) =>
                            setItemNotes(item.combo.id, "COMBO", e.target.value)
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Total e Finalizar */}
          <div className="border-border bg-card space-y-3 border-t p-4">
            <div className="flex justify-between text-lg">
              <span className="text-texto font-bold">Total</span>
              <span className="text-2xl font-bold text-green-600">
                {formatR$(totalPrice)}
              </span>
            </div>

            <Button
              className="h-12 w-full cursor-pointer text-base font-semibold"
              onClick={handleOpenPayment}
              disabled={cart.length === 0}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Finalizar Venda
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
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
                {formatR$(totalPrice)}
              </p>
            </div>
            {/*  Tipo da Order */}
            <div className="space-y-2">
              <Label>Tipo do Pedido</Label>
              <div className="grid grid-cols-3 gap-2">
                {ORDERS_TYPE.map((Order) => {
                  const Icon = Order.icon;
                  return (
                    <Button
                      key={Order.id}
                      variant={orderType === Order.id ? "default" : "outline"}
                      className="h-20 cursor-pointer flex-col gap-2"
                      onClick={() => setOrderType(Order.id)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm">{Order.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {orderType === "DELIVERY" && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-2"
                >
                  <Label>Endereço de Entrega</Label>

                  <div className="grid grid-cols-2 gap-2">
                    {/* CEP */}
                    <Input
                      placeholder="CEP"
                      value={address.cep}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          cep: cepMask(e.target.value),
                        }))
                      }
                    />

                    {/* Número */}
                    <Input
                      placeholder="Número"
                      value={address.numero}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          numero: e.target.value,
                        }))
                      }
                    />

                    {/* Rua */}
                    <div className="col-span-2">
                      <Input
                        placeholder="Rua"
                        value={address.rua}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            rua: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Bairro */}
                    <div className="col-span-2">
                      <Input
                        placeholder="Bairro"
                        value={address.bairro}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            bairro: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Cidade */}
                    <Input
                      placeholder="Cidade"
                      value={address.cidade}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          cidade: e.target.value,
                        }))
                      }
                    />

                    {/* Estado */}
                    <Input
                      placeholder="Estado"
                      value={address.estado}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          estado: e.target.value,
                        }))
                      }
                    />

                    {/* Complemento (animado) */}
                    <AnimatePresence>
                      {address.complemento && (
                        <motion.div
                          className="col-span-2"
                          initial={{ opacity: 0, height: 0, y: -8 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                          <Input
                            placeholder="Complemento"
                            value={address.complementoInput}
                            onChange={(e) =>
                              setAddress((prev) => ({
                                ...prev,
                                complementoInput: e.target.value,
                              }))
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Checkbox */}
                  <div className="mt-4 flex items-center gap-2">
                    <Checkbox
                      id="complemento"
                      className="cursor-pointer"
                      checked={address.complemento}
                      onCheckedChange={() =>
                        setAddress((prev) => ({
                          ...prev,
                          complemento: !prev.complemento,
                          complementoInput: !prev.complemento
                            ? prev.complementoInput
                            : "",
                        }))
                      }
                    />
                    <Label htmlFor="complemento" className="cursor-pointer">
                      Complemento
                    </Label>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

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

            {/* Valor Recebido */}
            {selectedPaymentMethod === "CASH" && (
              <div className="space-y-2">
                <Label htmlFor="payment-amount">Valor Recebido</Label>
                <div className="relative">
                  <span className="text-texto/60 absolute top-1/2 left-3 -translate-y-1/2">
                    R$
                  </span>
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-10"
                    placeholder="0,00"
                  />
                </div>
                {calculateChange() > 0 && (
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Troco: <strong>{formatR$(calculateChange())}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
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
              onClick={handleCreateOrder}
              disabled={
                loading ||
                !selectedPaymentMethod ||
                (orderType === "DELIVERY" && !address.cep) ||
                (selectedPaymentMethod === "CASH" && !paymentAmount)
              }
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
    </motion.div>
  );
}
