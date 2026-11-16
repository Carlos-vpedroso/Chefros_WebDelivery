import { ModuleType } from "./modules";

export interface Subscription {
    id: string;
    businessId: string;
    status: SubscriptionStatus;
    isActive: boolean;
    planId: number;
    stripeSubscriptionId?: string
    trialEndsAt?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    canceledAt?: string;
    createdAt: string;
    updatedAt: string; 
  
    plan?: SubscriptionPlan;
  }

  export interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: string;
    billingCycle: BillingCycle;
    features: string[];
    isActive: boolean;
    
    stripePriceId?: string;
    stripeProductId?: string;

    createdAt?: string;
    updatedAt?: string;
  
    modules: PlanModule[];
  }

  export interface PlanModule {
    moduleType: ModuleType;
  }

export type BillingCycle = 
"MONTHLY" |
"YEARLY"

export type SubscriptionStatus = 
| "ACTIVE"
| "CANCELED"
| "UNPAID"
| "INCOMPLETE"
| "PENDING_PAYMENT"
| "PAST_DUE"