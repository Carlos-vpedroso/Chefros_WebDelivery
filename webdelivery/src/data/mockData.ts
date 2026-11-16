import { PlanMockData, SegmentsMockData } from "@/types/others";
// Mock data para PLANOS (IMPORTANTE NÃO APAGAR)
export const plansData: PlanMockData[] = [
  {
    id: "1",
    level: 1,
    name: "Intermediário",
    features: [
      "PDV - Sistema de Caixa",
      "Catálogo/Cardápio online",
      "Gestão de Produtos e Categorias",
      "Controle de Vendas e Faturamento",
      "Relatórios Básicos de Vendas",
      "Suporte Simples",
      "Emissão de Comprovantes",
    ],
    price: 199.0,
  },
  {
    id: "2",
    level: 2,
    name: "Intermediário",
    features: [
      "Incluso Básico +",
      "Plataforma de Delivery Completa",
      "Pagamento PIX Automático",
      "Rastreamento de Pedidos",
      "Analytics de Vendas e Entregas",
      "Até 5 usuários no sistema",
      "Suporte Prioritário por Chat",
    ],
    price: 150,
  },
  {
    id: null,
    level: 5,
    name: "Personalizado",
    features: [
      "Escolha os módulos que precisa",
      "Integração com marketplaces",
      "Consultoria especializada",
      "Treinamento para sua equipe",
      "App mobile personalizado",
      "Contrato e valores negociáveis",
    ],
  },
];

/* Importante não Apagar */
export const segments: SegmentsMockData[] = [
  { label: "Alimentício", value: "FOOD_INDUSTRY" },
  { label: "Lojístico/Varejo", value: "RETAIL" },
  { label: "Serviços", value: "SERVICES" },
  { label: "Automotivo", value: "AUTOMOTIVE" },
  { label: "Outro", value: "OTHER" },
];

