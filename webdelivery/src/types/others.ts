// ================================
// Tipos Dos Planos
// ================================
export interface PlanMockData {
  id: string | null;
  level: number;
  name: string;
  features: string[];
  price?: number;
}
// ================================
// Tipos Dos Segmentos
// ================================
export interface SegmentsMockData {
  label: string;
  value: "FOOD_INDUSTRY" | "RETAIL" | "SERVICES" | "AUTOMOTIVE" | "OTHER" | "";
}
