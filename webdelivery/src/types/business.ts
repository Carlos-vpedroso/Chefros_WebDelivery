import { ModuleType } from "./modules";
import { WorkDay } from "./workDays";
// ================================
// Tipos Da Empresa
// ================================

export interface Business {
  id: string;
  name: string;
  slug: string;
  document: string; // CNPJ ou outro tipo de documento
  segment: string; // Ex: FOOD_INDUSTRY
  address: Address;

  legalName: string | null;
  email: string | null;
  phone: string | null;

  logoUrl: string | null;
  bannerUrl: string | null;

  timezone: string;
  currency: string;
  active: boolean;
  workDays: WorkDay[];

  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  deletedAt: string | null;
}

export interface Address {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  complemento?: string;
}

export interface BusinessModule {
  id: string;
  businessId?: string;
  moduleType: ModuleType;
  active: boolean;
  config?: Record<string, any> | null;
  activatedAt?: Date;
  deactivatedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
