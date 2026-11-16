"use client";

import { motion } from "framer-motion";
import {
  RefreshCw,
  Plus,
  Check,
  X,
  Eye,
  Clock,
  Bike,
  Package,
} from "lucide-react";
import { useState } from "react";

// Importações shadcn/ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Interfaces
interface ItemPedido {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  observacao?: string;
}

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  status: "analise" | "producao" | "pronto";
  horario: string;
  itens: ItemPedido[];
  total: number;
  observacao?: string;
}

// Dados mockados
const pedidosMock: Pedido[] = [
  {
    id: "1",
    numero: "#189",
    cliente: "João Silva",
    status: "analise",
    horario: "14:30",
    itens: [
      { id: "1", nome: "Pizza Calabresa", quantidade: 1, preco: 45.9 },
      { id: "2", nome: "Coca-Cola 2L", quantidade: 1, preco: 12.0 },
    ],
    total: 57.9,
    observacao: "Sem cebola na pizza",
  },
  {
    id: "2",
    numero: "#190",
    cliente: "Maria Santos",
    status: "analise",
    horario: "14:35",
    itens: [
      { id: "1", nome: "Pizza Margherita", quantidade: 1, preco: 42.9 },
      { id: "2", nome: "Suco de Laranja", quantidade: 2, preco: 8.0 },
    ],
    total: 58.9,
  },
  {
    id: "3",
    numero: "#191",
    cliente: "Pedro Oliveira",
    status: "producao",
    horario: "14:15",
    itens: [
      { id: "1", nome: "Pizza Frango Catupiry", quantidade: 1, preco: 48.9 },
      { id: "2", nome: "Batata Frita", quantidade: 1, preco: 15.0 },
      { id: "3", nome: "Guaraná 1L", quantidade: 1, preco: 7.5 },
    ],
    total: 71.4,
  },
  {
    id: "4",
    numero: "#192",
    cliente: "Ana Costa",
    status: "pronto",
    horario: "14:00",
    itens: [
      { id: "1", nome: "Pizza Portuguesa", quantidade: 1, preco: 47.9 },
      { id: "2", nome: "Refrigerante", quantidade: 1, preco: 6.0 },
    ],
    total: 53.9,
    observacao: "Entregar no apto 302",
  },
  {
    id: "5",
    numero: "#193",
    cliente: "Carlos Lima",
    status: "pronto",
    horario: "13:55",
    itens: [
      { id: "1", nome: "Pizza 4 Queijos", quantidade: 1, preco: 49.9 },
      { id: "2", nome: "Cerveja Heineken", quantidade: 2, preco: 9.0 },
    ],
    total: 67.9,
  },
];

// Configuração das colunas
const colunasConfig = {
  analise: {
    titulo: "🟠 Em análise",
    cor: "orange",
    badgeVariant: "outline" as const,
  },
  producao: {
    titulo: "🟡 Em produção",
    cor: "yellow",
    badgeVariant: "secondary" as const,
  },
  pronto: {
    titulo: "🟢 Prontos para entrega",
    cor: "green",
    badgeVariant: "default" as const,
  },
};

// Variantes de animação corrigidas com tipos do Framer Motion
const cardVariants = {
  hidden: { 
    scale: 0.9, 
    opacity: 0 
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    },
  },
};

const columnVariants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    },
  },
};

// Componente Card do Pedido
interface PedidoCardProps {
  pedido: Pedido;
  onMoverPedido: (pedidoId: string, novoStatus: Pedido["status"]) => void;
  onCancelarPedido: (pedidoId: string) => void;
}

const PedidoCard = ({
  pedido,
  onMoverPedido,
  onCancelarPedido,
}: PedidoCardProps) => {
  const getBorderColor = (status: Pedido["status"]) => {
    switch (status) {
      case "analise":
        return "border-orange-400";
      case "producao":
        return "border-yellow-400";
      case "pronto":
        return "border-green-400";
      default:
        return "border-gray-300";
    }
  };

  const getBgColor = (status: Pedido["status"]) => {
    switch (status) {
      case "analise":
        return "bg-orange-50";
      case "producao":
        return "bg-yellow-50";
      case "pronto":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout
    >
      <Card
        className={`${getBorderColor(pedido.status)} ${getBgColor(
          pedido.status
        )} border-l-4 shadow-sm hover:shadow-md transition-shadow`}
      >
        <CardContent className="p-4">
          {/* Cabeçalho do pedido */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">
                {pedido.numero} - {pedido.cliente}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{pedido.horario}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-white text-foreground font-semibold"
            >
              R$ {pedido.total.toFixed(2)}
            </Badge>
          </div>

          {/* Itens do pedido */}
          <div className="space-y-2 mb-3">
            {pedido.itens.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantidade}x {item.nome}
                </span>
                <span className="text-muted-foreground">
                  R$ {item.preco.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Observação */}
          {pedido.observacao && (
            <div className="mb-3 p-2 bg-white rounded border text-sm">
              <span className="font-medium">Observação: </span>
              {pedido.observacao}
            </div>
          )}

          <Separator className="mb-3" />

          {/* Ações do pedido */}
          <div className="flex flex-wrap gap-2">
            {pedido.status === "analise" && (
              <>
                <Button
                  size="sm"
                  className="flex-1 min-w-[100px]"
                  onClick={() => onMoverPedido(pedido.id, "producao")}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Aceitar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onCancelarPedido(pedido.id)}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancelar
                </Button>
              </>
            )}

            {pedido.status === "producao" && (
              <>
                <Button
                  size="sm"
                  className="flex-1 min-w-[100px]"
                  onClick={() => onMoverPedido(pedido.id, "pronto")}
                >
                  <Package className="w-3 h-3 mr-1" />
                  Finalizar
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalhes do Pedido</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <strong>Pedido:</strong> {pedido.numero}
                      </div>
                      <div>
                        <strong>Cliente:</strong> {pedido.cliente}
                      </div>
                      <div>
                        <strong>Itens:</strong>
                        <ul className="mt-1 space-y-1">
                          {pedido.itens.map((item) => (
                            <li key={item.id} className="flex justify-between">
                              <span>
                                {item.quantidade}x {item.nome}
                              </span>
                              <span>R$ {item.preco.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Total: R$ {pedido.total.toFixed(2)}</strong>
                      </div>
                      {pedido.observacao && (
                        <div>
                          <strong>Observação:</strong> {pedido.observacao}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {pedido.status === "pronto" && (
              <>
                <Button size="sm" className="flex-1 min-w-[100px]">
                  <Bike className="w-3 h-3 mr-1" />
                  Entregar
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pedido Pronto - {pedido.numero}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <strong>Cliente:</strong> {pedido.cliente}
                      </div>
                      <div>
                        <strong>Itens:</strong>
                        <ul className="mt-1 space-y-1">
                          {pedido.itens.map((item) => (
                            <li key={item.id} className="flex justify-between">
                              <span>
                                {item.quantidade}x {item.nome}
                              </span>
                              <span>R$ {item.preco.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="font-bold">
                        Total: R$ {pedido.total.toFixed(2)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente Coluna
interface ColunaProps {
  titulo: string;
  pedidos: Pedido[];
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  onMoverPedido: (pedidoId: string, novoStatus: Pedido["status"]) => void;
  onCancelarPedido: (pedidoId: string) => void;
}

const Coluna = ({
  titulo,
  pedidos,
  badgeVariant,
  onMoverPedido,
  onCancelarPedido,
}: ColunaProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 min-w-[300px]"
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>{titulo}</span>
            <Badge variant={badgeVariant}>{pedidos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] px-4 pb-4">
            <div className="space-y-3">
              {pedidos.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onMoverPedido={onMoverPedido}
                  onCancelarPedido={onCancelarPedido}
                />
              ))}
              {pedidos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum pedido</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente Principal
const PainelPedidosDelivery = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtrar pedidos por status
  const pedidosEmAnalise = pedidos.filter(
    (pedido) => pedido.status === "analise"
  );
  const pedidosEmProducao = pedidos.filter(
    (pedido) => pedido.status === "producao"
  );
  const pedidosProntos = pedidos.filter(
    (pedido) => pedido.status === "pronto"
  );

  // Função para mover pedido entre colunas
  const moverPedido = (pedidoId: string, novoStatus: Pedido["status"]) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
      )
    );
  };

  // Função para cancelar pedido
  const cancelarPedido = (pedidoId: string) => {
    setPedidos((prev) => prev.filter((pedido) => pedido.id !== pedidoId));
  };

  // Função para atualizar o painel
  const handleAtualizar = async () => {
    setIsRefreshing(true);
    // Simula uma atualização de dados
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Função para adicionar novo pedido (mock)
  const handleNovoPedido = () => {
    const novoPedido: Pedido = {
      id: Date.now().toString(),
      numero: `#${pedidos.length + 194}`,
      cliente: "Novo Cliente",
      status: "analise",
      horario: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      itens: [
        { id: "1", nome: "Pizza Teste", quantidade: 1, preco: 40.0 },
        { id: "2", nome: "Refri Teste", quantidade: 1, preco: 8.0 },
      ],
      total: 48.0,
    };
    setPedidos((prev) => [novoPedido, ...prev]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="p-6 space-y-6"
    >
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            📦 Painel de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe e gerencie os pedidos de delivery
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleNovoPedido}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
          <Button variant="outline" onClick={handleAtualizar}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Em Análise
                </p>
                <p className="text-2xl font-bold">{pedidosEmAnalise.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Em Produção
                </p>
                <p className="text-2xl font-bold">{pedidosEmProducao.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bike className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Prontos
                </p>
                <p className="text-2xl font-bold">{pedidosProntos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Colunas de Pedidos */}
      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        initial="hidden"
        animate="visible"
      >
        <Coluna
          titulo={colunasConfig.analise.titulo}
          pedidos={pedidosEmAnalise}
          badgeVariant={colunasConfig.analise.badgeVariant}
          onMoverPedido={moverPedido}
          onCancelarPedido={cancelarPedido}
        />
        <Coluna
          titulo={colunasConfig.producao.titulo}
          pedidos={pedidosEmProducao}
          badgeVariant={colunasConfig.producao.badgeVariant}
          onMoverPedido={moverPedido}
          onCancelarPedido={cancelarPedido}
        />
        <Coluna
          titulo={colunasConfig.pronto.titulo}
          pedidos={pedidosProntos}
          badgeVariant={colunasConfig.pronto.badgeVariant}
          onMoverPedido={moverPedido}
          onCancelarPedido={cancelarPedido}
        />
      </motion.div>
    </motion.div>
  );
};

export default PainelPedidosDelivery;