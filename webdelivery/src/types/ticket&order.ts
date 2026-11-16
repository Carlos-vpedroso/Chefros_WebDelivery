// ================================
// Tipos Order
// ================================

import { Address } from "./business";
import { PaymentMethod } from "./payment";
import { Combo, Product } from "./product&category";
import { Service } from "./service";
import { Table } from "./table";

export interface Ticket {
  id: string;
  businessId: string;
  tableId?: string;
  customerId?: string;
  userId?: string;
  employeeId?: string;
  name?: string;
  phone?: string;
  address?: Address;
  status: TicketStatus;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  orders: Order[];
  createdAt?: string;
  updatedAt?: string;
  table: Partial<Table>;
}

export interface Order {
  id: string;
  ticketId: string;
  status: OrderStatus;
  type: OrderType;
  totalAmount: number;
  items: OrderItem[];
  services: OrderService[];
  createdAt?: string;
  updatedAt?: string;

  //Relação com o Ticket, só vem quando faço fetch no getOrders para tela de Pedidos
  ticket?: Partial<Ticket>;
}

export interface OrderItem {
  id: string;
  type: OrderItemType;
  orderId: string;
  comboId?: string;
  combo?: Combo;
  productId?: string;
  product?: Product;
  quantity: number;
  note?: string;
  subtotal: number;
}

export type OrderItemType = "PRODUCT" | "COMBO";

export interface OrderService {
  id: string;
  orderId: string;
  serviceId: string;
  quantity: number;
  subtotal: number;
  note?: string;
  service?: Service;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export type OrderType = "TABLE" | "COUNTER" | "DELIVERY" | "TAKEOUT" | "ONLINE";

export type TicketStatus = "OPEN" | "CLOSED" | "CANCELLED";
