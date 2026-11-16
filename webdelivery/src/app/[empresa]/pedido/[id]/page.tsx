"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Phone,
  Mail,
  MapPin,
  User,
  CreditCard,
  Calendar,
  Hash,
  AlertCircle,
  Loader2,
  Motorbike,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatR$ } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { ticketService } from "@/services/ticket.service";
import { useParams } from "next/navigation";
import { Order, OrderStatus, OrderType, Ticket } from "@/types/ticket&order";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Combo } from "next/font/google";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  orderType: OrderType;
}

// Configuração dos status
const statusConfig = {
  PENDING: {
    label: "Pedido Recebido",
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    description: "Seu pedido foi recebido e está aguardando confirmação",
  },
  CONFIRMED: {
    label: "Em Preparo",
    icon: ChefHat,
    color: "bg-blue-500",
    textColor: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    description: "Estamos preparando seu pedido com carinho",
  },
  READY: {
    label: "Pronto para Retirada",
    icon: Package,
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    description: "Seu pedido está pronto!",
  },
  OUT_FOR_DELIVERY: {
    label: "Saiu para Entrega",
    icon: Motorbike,
    color: "bg-purple-500",
    textColor: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    description: "Seu pedido está a caminho",
  },
  COMPLETED: {
    label: "Entregue",
    icon: CheckCircle,
    color: "bg-green-600",
    textColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    description: "Pedido concluído com sucesso!",
  },
  CANCELLED: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    description: "Este pedido foi cancelado",
  },
};

// Timeline Component
const OrderTimeline = ({ currentStatus, orderType }: OrderTimelineProps) => {
  const statuses =
    orderType === "DELIVERY"
      ? ["PENDING", "CONFIRMED", "READY", "OUT_FOR_DELIVERY", "COMPLETED"]
      : ["PENDING", "CONFIRMED", "READY", "COMPLETED"];

  if (currentStatus === "CANCELLED") {
    return (
      <div className="rounded-xl bg-red-50 p-6 dark:bg-red-950/20">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white">
            <XCircle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
              Pedido Cancelado
            </h3>
            <p className="text-sm text-red-600 dark:text-red-500">
              Este pedido foi cancelado e não será processado
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {statuses.map((status, index) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        const Icon = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              {/* Timeline Line */}
              {index < statuses.length - 1 && (
                <div className="absolute top-12 left-6 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}

              {/* Icon */}
              <div
                className={clsx(
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-all",
                  isCompleted
                    ? config.color + " text-white shadow-lg"
                    : "bg-gray-200 text-gray-400 dark:bg-gray-700",
                )}
              >
                {isCurrent && isCompleted ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div
                  className={clsx(
                    "rounded-xl border-2 p-4 transition-all",
                    isCurrent
                      ? config.bgColor + " border-current shadow-md"
                      : isCompleted
                        ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                        : "border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={clsx(
                          "font-bold",
                          isCurrent ? config.textColor : "text-texto",
                        )}
                      >
                        {config.label}
                      </h3>
                      <p className="text-texto/60 mt-1 text-sm">
                        {config.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <Badge className={config.color + " text-white"}>
                        Atual
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function PedidoConfirmado() {
  const { id } = useParams();
  const ticketId = id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await ticketService.getById(ticketId);

        if (!response.success) {
          console.error("Erro ao buscar ticket");
          return;
        }
        if (response.success && response.data) {
          setTicket(response.data);
          setOrder(response.data.orders[0]);
          return;
        }
      } catch (error) {
        console.error("Erro ao buscar ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  function getOrderItemPrices(item: any) {
    const original = Number(item.product?.price);
    const unit = Number(item.unitPrice);

    const hasPromotion = item.promotionType && unit < original;

    return {
      original,
      unit,
      hasPromotion,
    };
  }

  if (loading || !ticket || !ticket.orders.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentConfig =
    statusConfig[ticket?.orders[0].status as keyof typeof statusConfig];
  const CurrentIcon = currentConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-fundo min-h-screen py-6"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header Card */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <ShoppingBag className="text-primary h-5 w-5" />
                  <h1 className="text-texto text-2xl font-bold">
                    Status do Pedido
                  </h1>
                </div>
                <p className="text-texto/60">
                  Acompanhe o pedido em tempo real.
                </p>
              </div>
              <div className="text-left md:text-right">
                <div className="text-texto/60 mb-1 text-sm">
                  Última atualização
                </div>
                <div className="text-texto text-sm font-semibold">
                  {new Date(
                    ticket?.orders[0].updatedAt as string,
                  ).toLocaleString("pt-BR")}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Atual - Destaque */}
        <Card className={clsx("mb-6 border-2", currentConfig.bgColor)}>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div
                className={clsx(
                  "flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl",
                  currentConfig.color,
                )}
              >
                <CurrentIcon className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-texto text-2xl font-bold">
                  {currentConfig.label}
                </h2>
                <p className="text-texto/60 mt-2">
                  {currentConfig.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order?.status && order?.type && (
                  <OrderTimeline
                    currentStatus={order?.status}
                    orderType={order?.type}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo do Pedido */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order?.items.map((item) => {
                  const { original, unit, hasPromotion } =
                    getOrderItemPrices(item);

                  if (item.type === "PRODUCT") {
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.product?.imageUrl || ""}
                            alt={item.product?.name || "Imagem do Produto"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-texto line-clamp-1 text-sm font-semibold">
                            {item.quantity}x {item.product?.name}
                          </p>

                          {/* 💰 preço com promoção */}
                          {hasPromotion ? (
                            <div className="flex flex-col text-xs">
                              <span className="text-texto/40 line-through">
                                {formatR$(original)}
                              </span>
                              <span className="font-bold text-green-600">
                                {formatR$(unit)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-texto/60 text-xs">
                              {formatR$(original)}
                            </p>
                          )}

                          {item.note && (
                            <p className="text-texto/50 text-xs italic">
                              Obs: {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // ===== COMBO =====
                  return (
                    <div key={item.id} className="flex gap-3">
                      <Carousel
                        opts={{ align: "start", loop: true }}
                        plugins={[
                          Autoplay({
                            delay: 3000,
                          }),
                        ]}
                        className="h-12 w-12 shrink-0"
                      >
                        <CarouselContent>
                          {item.combo?.items.map((itemCombo) => (
                            <CarouselItem key={itemCombo.id}>
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                                <Image
                                  src={itemCombo.product?.imageUrl || ""}
                                  alt={
                                    itemCombo.product?.name ||
                                    "Imagem do Produto"
                                  }
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>

                      <div className="flex-1">
                        <p className="text-texto line-clamp-1 text-sm font-semibold">
                          {item.quantity}x {item.combo?.name}
                        </p>

                        <p className="text-texto/60 text-xs">
                          {formatR$(Number(item.combo?.price))}
                        </p>

                        {item.note && (
                          <p className="text-texto/50 text-xs italic">
                            Obs: {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Separator />
                <div className="flex items-center justify-between text-lg">
                  <span className="text-texto font-bold">Total</span>
                  <span className="font-bold text-green-600">
                    {formatR$(Number(order?.totalAmount))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Dados de Entrega */}
            {order?.type === "DELIVERY" && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="text-texto/60 mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-texto font-semibold">{ticket?.name}</p>
                      <p className="text-texto/60">{ticket?.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <MapPin className="text-texto/60 mt-0.5 h-4 w-4 shrink-0" />
                    <div className="text-texto/80">
                      <p>
                        {ticket?.address?.rua}, {ticket?.address?.numero}
                      </p>
                      {ticket?.address?.complemento && (
                        <p>{ticket?.address?.complemento}</p>
                      )}
                      <p>
                        {ticket?.address?.bairro}, {ticket?.address?.cidade}/
                        {ticket?.address?.estado}
                      </p>
                      <p>CEP: {ticket?.address?.cep}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contato */}
            <Card className="from-primary/5 to-primary/10 border-2 bg-linear-to-br">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-4 w-4" />
                  Precisa de Ajuda?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  asChild
                >
                  <a href="tel:+5535984365370">
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar para o Restaurante
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  asChild
                >
                  <a href="https://wa.me/5535984365370">
                    <FaWhatsapp className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
