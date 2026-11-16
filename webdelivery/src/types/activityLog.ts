import { ActorType } from "./users";

export interface ActivityLog {
  id: string;
  businessId: string;
  type: ActivityType;
  title: string;
  description?: string;
  actorType: ActorType;
  employeeId: string;
  customerId: string;
  userId: string;
  employee: { id: string; name: string };
  customer: { id: string; name: string };
  user: { id: string; name: string };
  createdAt?: string;
}

export type ActivityType =
  | "ORDER_CREATED"
  | "ORDER_COMPLETED"
  | "ORDER_CANCELLED"
  | "PAYMENT_RECEIVED"
  | "PRODUCT_CREATED"
  | "SERVICE_CREATED"
  | "APPOINTMENT_SCHEDULED"
  | "CUSTOMER_CREATED"
  | "STOCK_UPDATED"
  | "EMPLOYEE_LOGIN"
  | "SUBSCRIPTION_UPDATED"
  | "SYSTEM_EVENT";
