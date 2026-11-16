export interface Vendas {
  pendingOrdersCount: number;
  completedOrdersCount: number;
  totalFaturado: string;
  ticketMedio: number;
  tempoMedioAtendimento: number;
  trends: {
    pendingOrders: number;
    completedOrders: number;
    ticketMedio: number;
    tempoMedioAtendimento: number;
    pedidos: number;
    faturamento: number;
  };
  pedidosData: { dia: string; quantidade: number }[];
  faturamentoData: { dia: string; valor: number }[];
  weeklyMetrics?: {
    pendingOrdersWeek: number;
    completedOrdersWeek: number;
    totalFaturadoWeek: string;
    ticketMedioWeek: number;
  };

  
}
export interface ProdutoMaisVendido {
  ranking: number;
  productId: string;
  name: string;
  category?: string;
  imageUrl?: string;
  quantidadeVendida: number;
  faturamento: number;
  participacaoFaturamento: number;
}
export interface FaturamentoCategoria {
  categoria: string;
  faturamento: number;
  quantidadeVendida: number;
  participacaoFaturamento: number;
}

export interface ProdutoMenosVendido {
  productId: string;
  name: string;
  category?: string;
  imageUrl?: string;
  quantidadeVendida: number;
  ultimaVenda: string | null;
  status: "SEM_VENDA" | "BAIXO_GIRO";
}
export interface ProdutoVendido {
  productId: string;
  name?: string;
  category?: string;
  imageUrl?: string;
  quantidadeVendida: number;
  totalFaturado: number;
  totalPedidos: number;
  precoAtual?: number;
}



export type Period = "DAY" | "WEEK" | "MONTH" | "CUSTOM";
