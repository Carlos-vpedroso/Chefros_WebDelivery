// ================================
// Tipos Mesas
// ================================

import { Ticket } from "./ticket&order";

export interface Table {
    id: string;
    businessId: string;
    name: string;
    capacity?: number;
    status: TableStatus;
    qrCodeUrl?: string;
    activeTicket: string | null;
    ticket?: Ticket;
    tickets?: Ticket[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type TableStatus = "AVAILABLE" | "OCCUPIED" | "CLOSED";
  