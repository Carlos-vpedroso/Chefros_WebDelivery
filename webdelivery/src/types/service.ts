// ================================
// Tipos Dos Serviços
// ================================
export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number | string;
  duration: number; // duração em minutos
  imageUrl?: string;
  categoryId?: string;
  active: boolean;
  createdAt: string; // ou Date, se você converter no fetch
  updatedAt: string; // idem
  category?: {
    id: string;
    name: string;
    type: "PRODUCT" | "SERVICE";
  };
}
