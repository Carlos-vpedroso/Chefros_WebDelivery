import { Business } from "./business";
import { Permissions } from "./employee";
import { ModuleType } from "./modules";

// ================================
// Tipos Do Usuario
// ================================
export interface UsuarioFuncionario {
  id: string;
  businessId: string;
  businessSlug: string;
  name: string;
  email: string;
  role: string;
  permissions: Permissions;
  business?: Business;
  modules?: ModuleType[];
}

export type ActorType = "EMPLOYEE" | "SYSTEM" | "COURIER" | "CUSTOMER";
