import { NextPage } from "next";
import { motion, Variants } from "framer-motion";
import {
  RefreshCw,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Truck,
  Package,
  Phone,
  Map,
  Settings,
  Bell,
} from "lucide-react";
import { useState } from "react";

// Variantes de animação COM TIPOS EXPLÍCITOS
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// Dados mock
const pedidosDelivery = [
  {
    id: "DEL-001",
    cliente: "João Silva",
    telefone: "(11) 99999-9999",
    endereco: "Rua A, 123 - Centro, São Paulo - SP",
    status: "preparo" as const,
    valor: 45.9,
    tempoDecorrido: "15 min",
    urgente: false,
  },
  {
    id: "DEL-002",
    cliente: "Maria Oliveira",
    telefone: "(11) 98888-8888",
    endereco: "Av. Paulista, 1000 - Bela Vista",
    status: "aguardando" as const,
    valor: 78.5,
    tempoDecorrido: "5 min",
    urgente: true,
  },
  {
    id: "DEL-003",
    cliente: "Carlos Santos",
    telefone: "(11) 97777-7777",
    endereco: "Rua B, 456 - Vila Madalena",
    status: "entrega" as const,
    valor: 120.0,
    tempoDecorrido: "25 min",
    urgente: false,
  },
  {
    id: "DEL-004",
    cliente: "Ana Costa",
    telefone: "(11) 96666-6666",
    endereco: "Alameda Santos, 789 - Jardins",
    status: "entregue" as const,
    valor: 65.8,
    tempoDecorrido: "45 min",
    urgente: false,
  },
  {
    id: "DEL-005",
    cliente: "Pedro Alves",
    telefone: "(11) 95555-5555",
    endereco: "Rua C, 321 - Pinheiros",
    status: "cancelado" as const,
    valor: 92.3,
    tempoDecorrido: "8 min",
    urgente: false,
  },
];

const metricas = {
  pedidosAtivos: 12,
  entregadoresOnline: 3,
  tempoMedio: "28 min",
  taxaSucesso: "94%",
};

const DeliveryDashboard: NextPage = () => {
  const [isDeliveryActive, setIsDeliveryActive] = useState(true);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [pedidos] = useState(pedidosDelivery);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredPedidos =
    filterStatus === "todos"
      ? pedidos
      : pedidos.filter((pedido) => pedido.status === filterStatus);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border";

    switch (status) {
      case "aguardando":
        return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`;
      case "preparo":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case "entrega":
        return `${baseClasses} bg-orange-100 text-orange-800 border-orange-200`;
      case "entregue":
        return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
      case "cancelado":
        return `${baseClasses} bg-red-100 text-red-800 border-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aguardando":
        return "🟡 Aguardando";
      case "preparo":
        return "🔵 Em preparo";
      case "entrega":
        return "🟠 Saiu para entrega";
      case "entregue":
        return "🟢 Entregue";
      case "cancelado":
        return "🔴 Cancelado";
      default:
        return status;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Cabeçalho do Dashboard */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              🚗 Painel de Delivery
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isDeliveryActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isDeliveryActive ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </button>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDeliveryActive}
              onChange={(e) => setIsDeliveryActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </motion.div>

      {/* Cards de Métricas Rápidas */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            icon: <Package className="w-5 h-5" />,
            value: metricas.pedidosAtivos,
            label: "Pedidos Ativos",
            color: "text-blue-600",
          },
          {
            icon: <Users className="w-5 h-5" />,
            value: metricas.entregadoresOnline,
            label: "Entregadores Online",
            color: "text-green-600",
          },
          {
            icon: <Clock className="w-5 h-5" />,
            value: metricas.tempoMedio,
            label: "Tempo Médio",
            color: "text-orange-600",
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            value: metricas.taxaSucesso,
            label: "Taxa de Sucesso",
            color: "text-purple-600",
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-2xl font-bold text-card-foreground ${metric.color}`}
                >
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {metric.label}
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Painel de Pedidos em Tempo Real */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold text-card-foreground">
                Pedidos em Tempo Real
              </h3>

              {/* Filtros por Status */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "todos", label: "Todos", emoji: "📦" },
                  { key: "aguardando", label: "Aguardando", emoji: "🟡" },
                  { key: "preparo", label: "Preparo", emoji: "🔵" },
                  { key: "entrega", label: "Entrega", emoji: "🟠" },
                  { key: "entregue", label: "Entregue", emoji: "🟢" },
                  { key: "cancelado", label: "Cancelado", emoji: "🔴" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      filterStatus === filter.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {filter.emoji} {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredPedidos.map((pedido, index) => (
                <motion.div
                  key={pedido.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className={`bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
                    pedido.urgente ? "border-l-4 border-l-red-500" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-card-foreground">
                          {pedido.id}
                        </span>
                        {pedido.urgente && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={getStatusBadge(pedido.status)}>
                          {getStatusText(pedido.status)}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-card-foreground">
                            {pedido.cliente}
                          </span>
                          <Phone className="w-4 h-4 text-muted-foreground ml-2" />
                          <span className="text-muted-foreground">
                            {pedido.telefone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {pedido.endereco}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {pedido.tempoDecorrido} • R${" "}
                            {pedido.valor.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                        Editar Status
                      </button>
                      <button className="px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Coluna Lateral */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Mapa de Entregas */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Map className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">
                Mapa de Entregas
              </h3>
            </div>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <p className="text-muted-foreground">
                Integração com mapa futura
              </p>
            </div>
          </div>

          {/* Configurações Rápidas */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">
                Configurações Rápidas
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">
                  💰 Taxa de entrega
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  R$ 8,00
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground">
                    📍 Raio de atendimento
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    5 km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  defaultValue="5"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">
                  🔔 Alertas automáticos
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Alertas e Notificações */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">
                Alertas
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Pedido DEL-002 atrasado
                  </p>
                  <p className="text-xs text-red-600">
                    Excedeu o tempo estimado
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Novo pedido recebido
                  </p>
                  <p className="text-xs text-blue-600">Cliente: João Silva</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeliveryDashboard;
