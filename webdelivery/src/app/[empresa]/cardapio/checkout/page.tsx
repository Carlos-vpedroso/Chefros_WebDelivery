"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "@/contexts/CartContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  CreditCard,
  DollarSign,
  Motorbike,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatR$ } from "@/lib/utils";
import { PaymentMethod } from "@/types/payment";
import { OrderType } from "@/types/ticket&order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMask } from "@/hooks/useMask";
import clsx from "clsx";
import Link from "next/link";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ScrollArea } from "@/components/ui/scroll-area";

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Nome obrigatório"),
  customerPhone: z.string().min(1, "Telefone obrigatório"),

  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional(),

  observations: z.string().optional(),
});

type DeliveryFormData = z.infer<typeof checkoutSchema>;

interface Payments {
  id: PaymentMethod;
  name: string;
  icon: any;
  color: string;
}

interface OrderTypeConfig {
  id: OrderType;
  label: string;
  icon: any;
  color: string;
}

const PAYMENT_METHODS: Payments[] = [
  { id: "CASH", name: "Dinheiro", icon: Banknote, color: "green" },
  { id: "CREDIT_CARD", name: "Crédito", icon: CreditCard, color: "blue" },
  { id: "DEBIT_CARD", name: "Débito", icon: CreditCard, color: "purple" },
  { id: "PIX", name: "PIX", icon: DollarSign, color: "teal" },
];

const ORDERS_TYPE: OrderTypeConfig[] = [
  { id: "DELIVERY", label: "Delivery", icon: Motorbike, color: "orange" },
  { id: "TAKEOUT", label: "Retirada", icon: ShoppingCart, color: "blue" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { businessInfo } = useAuth(BusinessContext);
  const { cart, totalPrice, itemCount, clearCart, setItemNotes } =
    useAuth(CartContext);

  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("TAKEOUT");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cep: cepMask, phone: phoneMask } = useMask();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      observations: "",
    },
  });

  const cepValue = watch("cep");

  // Buscar CEP na API do ViaCEP
  useEffect(() => {
    const fetchCep = async () => {
      const cleanCep = cepValue?.replace(/\D/g, "");

      if (cleanCep && cleanCep.length === 8) {
        setIsLoadingCep(true);
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${cleanCep}/json/`,
          );
          const data = await response.json();

          if (!data.erro) {
            setValue("street", data.logradouro || "");
            setValue("neighborhood", data.bairro || "");
            setValue("city", data.localidade || "");
            setValue("state", data.uf || "");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        } finally {
          setIsLoadingCep(false);
        }
      }
    };

    fetchCep();
  }, [cepValue, setValue]);

  const onSubmit = async (data: DeliveryFormData) => {
    if (!businessInfo) return;
    if (!selectedPayment) {
      toast.info("Selecione um método de pagamento");
      return;
    }
    if (selectedOrderType === "DELIVERY") {
      if (
        !data.cep ||
        !data.street ||
        !data.number ||
        !data.city ||
        !data.state
      ) {
        toast.error("Endereço completo é obrigatório");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const address =
        selectedOrderType === "DELIVERY"
          ? {
              cep: data.cep!,
              rua: data.street!,
              numero: data.number!,
              bairro: data.neighborhood!,
              cidade: data.city!,
              estado: data.state!,
              complemento: data.complement || undefined,
            }
          : undefined;

      // Preparar dados do pedido
      const orderData = {
        paymentMethod: selectedPayment as PaymentMethod,
        type: selectedOrderType as OrderType,
        name: data.customerName,
        phone: data.customerPhone,
        address,
        items: cart
          .filter((item) => item.type === "PRODUCT")
          .map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            note: item.obs || undefined,
          })),
        combos: cart
          .filter((item) => item.type === "COMBO")
          .map((item) => ({
            comboId: item.combo.id,
            quantity: item.quantity,
            note: item.obs,
          })),
      };

      const result = await orderService.create(businessInfo?.id, orderData);

      if (!result.success) {
        toast.error(result.error || "Erro ao finalizar pedido");
        return;
      }
      // Limpar carrinho e redirecionar
      clearCart();
      router.push(`/${businessInfo?.slug}/pedido/${result.data?.ticket.id}`);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toast.error("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-fundo flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <ShoppingCart className="text-texto/20 mx-auto mb-4 h-16 w-16" />
            <h2 className="text-texto mb-2 text-2xl font-bold">
              Carrinho Vazio
            </h2>
            <p className="text-texto/60 mb-6">
              Adicione produtos ao carrinho para continuar
            </p>
            <Link href={`/${businessInfo?.slug}/cardapio`}>
              <Button className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Cardápio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-fundo min-h-screen py-6"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/${businessInfo?.slug}/cardapio`}>
            <Button variant="ghost" className="mb-4 cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Cardápio
            </Button>
          </Link>
          <h1 className="text-texto text-3xl font-bold">Finalizar Pedido</h1>
          <p className="text-texto/60">
            Confirme os detalhes e finalize seu pedido
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna Esquerda - Itens do Carrinho */}
            <div className="space-y-6 lg:col-span-2">
              {/* Itens do Carrinho */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Seu Pedido
                    </span>
                    <Badge variant="secondary">{itemCount} itens</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-110 space-y-4 overflow-y-auto">
                    {cart.map((item) =>
                      item.type === "PRODUCT" ? (
                        <div key={item.product.id} className="space-y-2">
                          <div className="flex gap-3">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={
                                  item.product.imageUrl ||
                                  "https://placehold.co/100x100/858585/ffffff?text=Produto"
                                }
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-texto line-clamp-1 font-semibold">
                                {item.product.name}
                              </h4>
                              <p className="text-texto/60 line-clamp-3 text-sm">
                                {item.product.description}
                              </p>
                              <div className="flex flex-row items-center gap-1">
                                {/* Preço antigo (se houver promoção) */}
                                {item.unitPrice < item.originalPrice && (
                                  <span className="text-texto/40 text-xs line-through">
                                    {formatR$(
                                      item.originalPrice * item.quantity,
                                    )}
                                  </span>
                                )}

                                {/* Preço final */}
                                <span className="text-md font-bold text-green-600">
                                  {formatR$(item.unitPrice * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Input
                            placeholder="Observação do item (opcional)"
                            value={item.obs || ""}
                            onChange={(e) =>
                              setItemNotes(
                                item.product.id,
                                "PRODUCT",
                                e.target.value,
                              )
                            }
                            className="text-xs"
                          />
                          <Separator />
                        </div>
                      ) : (
                        <div key={item.combo.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-texto line-clamp-1 font-semibold">
                                {item.combo.name}
                              </h4>
                              <p className="font-bold text-green-600">
                                {formatR$(Number(item.combo.price))}
                              </p>
                            </div>
                            <Badge className="from-cor1 to-cor2 border-none bg-linear-to-br font-bold tracking-widest text-white">
                              COMBO
                            </Badge>
                          </div>
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
                            className="w-full select-none"
                          >
                            <CarouselContent className="-ml-2">
                              {item.combo.items.map((itemCombo) => (
                                <CarouselItem
                                  key={itemCombo.id}
                                  className="flex w-10 basis-[85%] gap-4 pl-2 sm:basis-[60%] md:basis-[48%]"
                                >
                                  <div className="relative h-20 w-20 shrink-0 rounded-md">
                                    <Image
                                      src={
                                        itemCombo.product?.imageUrl ||
                                        "https://placehold.co/100x100/858585/ffffff?text=Produto"
                                      }
                                      alt={
                                        itemCombo.product?.name ||
                                        "Foto do Produto"
                                      }
                                      fill
                                      className="rounded-md object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-texto line-clamp-2 font-semibold">
                                      {itemCombo.product?.name}
                                    </h4>
                                    <ScrollArea className="h-12">
                                      <p className="text-texto/60 text-xs">
                                        {itemCombo.product?.description}
                                      </p>
                                    </ScrollArea>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>
                          <Input
                            placeholder="Observação do combo (opcional)"
                            value={item.obs || ""}
                            onChange={(e) =>
                              setItemNotes(
                                item.combo.id,
                                "COMBO",
                                e.target.value,
                              )
                            }
                            className="text-xs"
                          />
                          <Separator />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Dados do Cliente */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Nome Completo *</Label>
                      <Input
                        id="customerName"
                        placeholder="Seu nome"
                        {...register("customerName")}
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-600">
                          {errors.customerName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Telefone *</Label>
                      <Input
                        id="customerPhone"
                        placeholder="(00) 00000-0000"
                        {...register("customerPhone")}
                        onChange={(e) =>
                          setValue("customerPhone", phoneMask(e.target.value))
                        }
                      />
                      {errors.customerPhone && (
                        <p className="text-sm text-red-600">
                          {errors.customerPhone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço de Entrega - Apenas se for Delivery */}
              {selectedOrderType === "DELIVERY" && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <div className="relative">
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            {...register("cep")}
                            onChange={(e) =>
                              setValue("cep", cepMask(e.target.value))
                            }
                          />
                          {isLoadingCep && (
                            <Loader2 className="text-primary absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
                          )}
                        </div>
                        {errors.cep && (
                          <p className="text-sm text-red-600">
                            {errors.cep.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="street">Rua *</Label>
                        <Input
                          id="street"
                          placeholder="Nome da rua"
                          {...register("street")}
                        />
                        {errors.street && (
                          <p className="text-sm text-red-600">
                            {errors.street.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          placeholder="123"
                          {...register("number")}
                        />
                        {errors.number && (
                          <p className="text-sm text-red-600">
                            {errors.number.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          placeholder="Apto, bloco, etc"
                          {...register("complement")}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro *</Label>
                        <Input
                          id="neighborhood"
                          placeholder="Bairro"
                          {...register("neighborhood")}
                        />
                        {errors.neighborhood && (
                          <p className="text-sm text-red-600">
                            {errors.neighborhood.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          placeholder="Cidade"
                          {...register("city")}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          placeholder="UF"
                          maxLength={2}
                          {...register("state")}
                        />
                        {errors.state && (
                          <p className="text-sm text-red-600">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Coluna Direita - Resumo */}
            <div className="space-y-6">
              {/* Tipo de Pedido */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Tipo de Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {ORDERS_TYPE.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          type="button"
                          variant={
                            selectedOrderType === type.id
                              ? "default"
                              : "outline"
                          }
                          className="h-auto cursor-pointer flex-col gap-2 py-4"
                          onClick={() => setSelectedOrderType(type.id)}
                        >
                          <Icon className="h-6 w-6" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {/* Método de Pagamento */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <Button
                          key={method.id}
                          type="button"
                          variant={
                            selectedPayment === method.id
                              ? "default"
                              : "outline"
                          }
                          className="h-auto cursor-pointer flex-col gap-2 py-3"
                          onClick={() => setSelectedPayment(method.id)}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{method.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                  {!selectedPayment && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Selecione um método de pagamento
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Total e Finalizar */}
              <Card className="border-2 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-texto font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatR$(totalPrice)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full cursor-pointer text-base font-semibold"
                    disabled={isSubmitting || !selectedPayment}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Finalizando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Finalizar Pedido
                      </>
                    )}
                  </Button>

                  <p className="text-texto/60 text-center text-xs">
                    Ao finalizar, você concorda com nossos termos de serviço
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
