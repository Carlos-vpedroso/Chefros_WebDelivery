"use client";
import React, { useState } from "react";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardContext } from "@/contexts/DashboardContext";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  ClipboardList,
  Motorbike,
  Store,
  List,
  CheckCircle,
  Clock,
  Eye,
  Printer,
  MoreVertical,
  ArrowRight,
  XCircle,
  Timer,
  Grid2x2,
  User2,
  Loader2,
  Phone,
} from "lucide-react";
import { Order, OrderStatus, OrderType } from "@/types/ticket&order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatR$,
  getFirstAndLastName,
  normalizeAddressInline,
} from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BusinessContext } from "@/contexts/BusinessContext";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FaWhatsapp } from "react-icons/fa";

const statusConfig = {
  PENDING: {
    label: "Pendente",
    color: "bg-yellow-500",
    icon: Clock,
    textColor: "text-yellow-700 dark:text-yellow-400",
    bgColor:
      "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
  },
  CONFIRMED: {
    label: "Em Preparo",
    color: "bg-blue-500",
    icon: ChefHat,
    textColor: "text-blue-700 dark:text-blue-400",
    bgColor:
      "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
  },
  READY: {
    label: "Pronto",
    color: "bg-green-500",
    icon: CheckCircle,
    textColor: "text-green-700 dark:text-green-400",
    bgColor:
      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
  },
  OUT_FOR_DELIVERY: {
    label: "Em Entrega",
    color: "bg-purple-500",
    icon: Motorbike,
    textColor: "text-purple-700 dark:text-purple-400",
    bgColor:
      "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
  },
  COMPLETED: {
    label: "Concluído",
    color: "bg-gray-500",
    icon: CheckCircle,
    textColor: "text-gray-700 dark:text-gray-400",
    bgColor:
      "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800",
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-red-500",
    icon: XCircle,
    textColor: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
  },
};

interface OrderCardProps {
  order: Order;
  onStatusChange: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onViewDetails,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  function getNextLabel(nextStatus: OrderStatus) {
    const labels: Partial<Record<OrderStatus, string>> = {
      PENDING: "Iniciar preparo",
      CONFIRMED: "Pronto",
      READY: "Concluído",
      OUT_FOR_DELIVERY: "Marcar como entregue",
    };

    return labels[nextStatus];
  }

  const paymentMethodTicket = {
    PIX: "PIX",
    CREDIT_CARD: "CRÉDITO",
    DEBIT_CARD: "DÉBITO",
    CASH: "DINHEIRO",
    BANK_TRANSFER: "TRANSFERÊNCIA BANCÁRIA",
  };
  const config = statusConfig[order.status as keyof typeof statusConfig];
  const orderTime = new Date(order.createdAt as string);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000);

  return (
    <Card
      className={clsx(
        "group relative flex w-[320px] min-w-[320px] shrink-0 justify-between gap-2 overflow-hidden border-2 transition-all hover:shadow-lg",
        config.bgColor,
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="space-y-2">
              <CardTitle>
                {order?.ticket?.table && (
                  <div className="flex items-center gap-2 text-xs">
                    <Grid2x2 className="text-texto/60 h-4 w-4" />
                    <span className="text-texto text-base font-bold">
                      {order.ticket.table.name}
                    </span>
                  </div>
                )}
                {order?.ticket?.name && (
                  <div className="flex items-center gap-2 text-xs">
                    <User2 className="text-texto/60 h-4 w-4" />
                    <span className="text-texto line-clamp-2 text-base font-bold">
                      {getFirstAndLastName(order.ticket.name)}
                    </span>
                  </div>
                )}
              </CardTitle>
              {order.ticket?.phone && (
                <div className="text-texto/60 flex items-center gap-2 text-xs">
                  <Phone className="h-4 w-4" />
                  <span>{order.ticket?.phone}</span>
                </div>
              )}

              <div className="text-texto/60 flex items-center gap-2 text-xs">
                <Timer className="h-4 w-4" />
                <span>
                  {diffMinutes < 60
                    ? `${diffMinutes} min atrás`
                    : `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m atrás`}
                </span>
              </div>
              {/* Table Info */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <FaWhatsapp className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Printer className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onViewDetails(order)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </DropdownMenuItem>
                {order.status === "PENDING" && (
                  <DropdownMenuItem
                    onClick={() => console.log("Cancel")}
                    className="cursor-pointer text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Items Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            {order.ticket?.paymentMethod && (
              <p className="text-texto/60 text-sm font-medium">
                {paymentMethodTicket[order.ticket?.paymentMethod]}
              </p>
            )}

            <p className="text-sm font-bold text-green-600">
              {formatR$(Number(order.ticket?.totalAmount))}
            </p>
          </div>
        </div>
        {/* Action Button */}
        {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
          <div className="mt-2 space-y-2">
            <Separator />
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  await onStatusChange(order);
                } catch (error) {
                  console.log("Error:", error);
                  toast.error("Erro de conexão com o servidor.");
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full cursor-pointer"
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {getNextLabel(order.status)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SectionOrdersProps {
  title: string;
  orders: Order[];
  status: string;
  onStatusChange: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

const SectionOrders: React.FC<SectionOrdersProps> = ({
  title,
  orders,
  status,
  onStatusChange,
  onViewDetails,
}) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-lg text-white",
              config.color,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-texto text-lg font-bold">{title}</h2>
            <p className="text-texto/60 text-sm">{orders.length} pedidos</p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <AnimatePresence mode="popLayout">
        {orders.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-texto/5 mb-4 rounded-full p-4">
                <Icon className="text-texto/40 h-8 w-8" />
              </div>
              <p className="text-texto/60 text-sm">
                Nenhum pedido {title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="w-full overflow-x-auto">
            <div className="flex gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={onStatusChange}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </AnimatePresence>
    </div>
  );
};

interface PedidosLayoutProps {
  orders: Order[];
  delivery?: boolean;
  onStatusChange: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

const PedidosLayout: React.FC<PedidosLayoutProps> = ({
  orders,
  delivery = false,
  onStatusChange,
  onViewDetails,
}) => {
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED",
  );
  const readyOrders = orders.filter((order) => order.status === "READY");
  const deliveryOrders = orders.filter(
    (order) => order.status === "OUT_FOR_DELIVERY",
  );
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED",
  );

  return (
    <div className="space-y-4">
      <SectionOrders
        title="Pendentes"
        orders={pendingOrders}
        status="PENDING"
        onStatusChange={onStatusChange}
        onViewDetails={onViewDetails}
      />
      <SectionOrders
        title="Em Preparo"
        orders={confirmedOrders}
        status="CONFIRMED"
        onStatusChange={onStatusChange}
        onViewDetails={onViewDetails}
      />
      <SectionOrders
        title="Prontos"
        orders={readyOrders}
        status="READY"
        onStatusChange={onStatusChange}
        onViewDetails={onViewDetails}
      />
      {delivery && (
        <SectionOrders
          title="Saiu para Entrega"
          orders={deliveryOrders}
          status="OUT_FOR_DELIVERY"
          onStatusChange={onStatusChange}
          onViewDetails={onViewDetails}
        />
      )}
      <SectionOrders
        title="Concluídos"
        orders={completedOrders}
        status="COMPLETED"
        onStatusChange={onStatusChange}
        onViewDetails={onViewDetails}
      />
    </div>
  );
};

const NotificationBubble: React.FC<{
  list: Order[];
  filter: OrderStatus;
  style: string;
}> = ({ list, filter, style }) => {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full font-semibold text-black ${style} text-xs`}
    >
      {list.filter((item) => item.status === filter).length}
    </span>
  );
};

// Modal de Detalhes do Pedido
interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;

  const config = statusConfig[order.status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full text-white",
                config.color,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            Detalhes do Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Info Básica */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-texto/60 text-sm">Status</p>
              <Badge className={clsx(config.color, "mt-1 text-white")}>
                {config.label}
              </Badge>
            </div>
            <div>
              <p className="text-texto/60 text-sm">Data/Hora</p>
              <p className="text-texto mt-1 font-medium">
                {new Date(order.createdAt as string).toLocaleString("pt-BR")}
              </p>
            </div>
            {order.ticket?.address && (
              <div className="col-span-2">
                <p className="text-texto/60 text-sm">Endereço</p>
                <p className="text-texto mt-1 font-medium">
                  {normalizeAddressInline(order.ticket?.address)}
                </p>
              </div>
            )}
          </div>

          {/* Mesa */}
          {order?.ticket?.table && (
            <div>
              <p className="text-texto mb-2 text-sm font-semibold">Mesa</p>
              <div className="bg-fundo2 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Store className="text-texto/60 h-4 w-4" />
                  <span className="text-texto">{order.ticket.table.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Itens */}
          <div>
            <p className="text-texto mb-2 text-sm font-semibold">
              Itens do Pedido
            </p>
            <div className="bg-fundo space-y-2 rounded-lg p-4">
              {order.items.map((item) =>
                item.type === "PRODUCT" ? (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex flex-1 items-start gap-3">
                      {item.product?.imageUrl && (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                          unoptimized
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-texto font-medium">
                          {item.quantity}x {item.product?.name}
                        </p>
                        {item.note && (
                          <p className="text-texto/60 mt-1 text-xs italic">
                            Obs: {item.note}
                          </p>
                        )}
                        <p className="text-texto/60 mt-1 text-sm">
                          {formatR$(Number(item.product?.price))} un.
                        </p>
                      </div>
                    </div>
                    <p className="text-texto font-semibold">
                      {formatR$(Number(item.subtotal))}
                    </p>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex flex-1 items-start gap-3">
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
                        className="h-12 w-12 shrink-0"
                      >
                        <CarouselContent>
                          {item.combo?.items.map((itemCombo) => (
                            <CarouselItem key={itemCombo.id}>
                              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                                <Image
                                  src={itemCombo.product?.imageUrl || ""}
                                  alt={
                                    itemCombo.product?.name ||
                                    "Imagem do Produto"
                                  }
                                  fill
                                  className="rounded-md object-cover"
                                  unoptimized
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                      <div className="flex-1">
                        <p className="text-texto font-medium">
                          {item.quantity}x {item.combo?.name}
                        </p>
                        {item.note && (
                          <p className="text-texto/60 mt-1 text-xs italic">
                            Obs: {item.note}
                          </p>
                        )}
                        <p className="text-texto/60 mt-1 text-sm">
                          {formatR$(Number(item.combo?.price))} un.
                        </p>
                      </div>
                    </div>
                    <p className="text-texto font-semibold">
                      {formatR$(Number(item.subtotal))}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
            <span className="text-texto text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-green-600">
              {formatR$(Number(order.totalAmount))}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Fechar
          </Button>
          <Button className="cursor-pointer">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function PedidosDashboard() {
  const { businessInfo } = useAuth(BusinessContext);
  const { accessToken } = useAuth(EmployeeContext);
  const { orders } = useAuth(DashboardContext);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const localOrders = orders.filter(
    (order) =>
      order.type === "COUNTER" ||
      order.type === "TABLE" ||
      order.type === "TAKEOUT",
  );
  const deliveryOrders = orders.filter(
    (order) => order.type === "DELIVERY" || order.type === "ONLINE",
  );
  const allOrders = [...orders];
  function getNextStatus(
    currentStatus: OrderStatus,
    typeOrder: OrderType,
  ): OrderStatus {
    if (typeOrder !== "DELIVERY" && typeOrder !== "ONLINE") {
      switch (currentStatus) {
        case "PENDING":
          return "CONFIRMED";
        case "CONFIRMED":
          return "READY";
        case "READY":
          return "COMPLETED";
        default:
          return currentStatus;
      }
    }

    // Para DELIVERY e ONLINE
    switch (currentStatus) {
      case "PENDING":
        return "CONFIRMED";
      case "CONFIRMED":
        return "READY";
      case "READY":
        return "OUT_FOR_DELIVERY";
      case "OUT_FOR_DELIVERY":
        return "COMPLETED";
      default:
        return currentStatus;
    }
  }
  const handleStatusChange = async (order: Order) => {
    if (!accessToken || !businessInfo) return;
    try {
      const result = await orderService.changeStatus(
        businessInfo.slug,
        accessToken,
        order.id,
        getNextStatus(order.status, order.type),
      );
      if (!result.success) {
        toast.error("Não foi possível alterar o status do pedido.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro de conexão ao atualizar status do pedido");
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <HeaderDashboard
        title="Gestão de Pedidos"
        subtitle="Acompanhe, organize e gerencie todos os pedidos em tempo real"
        icon={ClipboardList}
      />
      <div className="px-4 pb-4">
        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-fundo3 flex h-full w-full flex-col items-start md:grid md:grid-cols-3">
            <TabsTrigger
              value="local"
              className="flex w-full cursor-pointer items-center justify-between gap-2"
            >
              <div className="flex w-full items-center justify-center gap-2">
                <Store className="h-4 w-4" />
                <h1>Local</h1>
              </div>
              <div className="flex w-full items-center justify-center gap-2">
                <NotificationBubble
                  list={localOrders}
                  filter="PENDING"
                  style="bg-yellow-400"
                />
                <NotificationBubble
                  list={localOrders}
                  filter="CONFIRMED"
                  style="bg-blue-400"
                />
                <NotificationBubble
                  list={localOrders}
                  filter="READY"
                  style="bg-green-400"
                />
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="flex w-full cursor-pointer items-center justify-between gap-2"
            >
              <div className="flex w-full items-center justify-center gap-2">
                <Motorbike className="h-4 w-4" />
                <h1>Delivery</h1>
              </div>
              <div className="flex w-full items-center justify-center gap-2">
                <NotificationBubble
                  list={deliveryOrders}
                  filter="PENDING"
                  style="bg-yellow-400"
                />
                <NotificationBubble
                  list={deliveryOrders}
                  filter="CONFIRMED"
                  style="bg-blue-400"
                />
                <NotificationBubble
                  list={deliveryOrders}
                  filter="OUT_FOR_DELIVERY"
                  style="bg-purple-400"
                />
                <NotificationBubble
                  list={deliveryOrders}
                  filter="READY"
                  style="bg-green-400"
                />
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex w-full cursor-pointer items-center justify-between gap-2"
            >
              <div className="flex w-full items-center justify-center gap-2">
                <List className="h-4 w-4" />
                <h1>Todos</h1>
              </div>
              <div className="flex w-full items-center justify-center gap-2">
                <NotificationBubble
                  list={allOrders}
                  filter="PENDING"
                  style="bg-yellow-400"
                />
                <NotificationBubble
                  list={allOrders}
                  filter="CONFIRMED"
                  style="bg-blue-400"
                />
                <NotificationBubble
                  list={allOrders}
                  filter="OUT_FOR_DELIVERY"
                  style="bg-purple-400"
                />
                <NotificationBubble
                  list={allOrders}
                  filter="READY"
                  style="bg-green-400"
                />
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="mt-6">
            <PedidosLayout
              orders={localOrders}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <PedidosLayout
              orders={deliveryOrders}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              delivery={true}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <PedidosLayout
              orders={allOrders}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              delivery={true}
            />
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes */}
        <OrderDetailsModal
          order={selectedOrder}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </motion.div>
  );
}
