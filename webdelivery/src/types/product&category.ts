// ================================
// Tipos Dos Produtos

import { Service } from "./service";

// ================================
export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number | string; // depende de como o backend retorna
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
  promotionItem: PromotionItem[];
}

export type CartItem = CartProductItem | CartComboItem;

export interface CartProductItem {
  type: "PRODUCT";
  product: Product;

  quantity: number;
  obs?: string;

  // 💰 preços
  unitPrice: number; // preço FINAL unitário
  originalPrice: number; // preço original (sem desconto)
  subtotal: number; // unitPrice * quantity

  // 🏷️ snapshot da promoção
  promotion?: Partial<Promotion>;
}

export interface CartComboItem {
  type: "COMBO";
  combo: Combo;

  quantity: number;
  obs?: string;
  unitPrice: number; // preço FINAL unitário
  subtotal: number; // unitPrice * quantity
}

// ================================
// Tipos Dos Combos
// ================================

export interface Combo {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  businessId: string;
  items: ComboItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ComboItem {
  id: string;
  comboId: string;
  type: ComboItemType;
  productId?: string;
  serviceId?: string;
  quantity: number;
  product?: Product;
  service?: Service;
}

export type ComboItemType = "PRODUCT" | "SERVICE";

export interface Category {
  id: string;
  businessId: string;
  name: string;
  type: "PRODUCT" | "SERVICE";
  parentId?: string | null;
  createdAt?: string; // ou Date se você converter no fetch
  updatedAt?: string;
  _count?: {
    products: number;
    services: number;
  };
}

export interface Promotion {
  id: string;
  businessId: string;
  name: string;
  type: PromotionType;
  active: boolean;
  value?: number;
  percentage?: number;
  startDate?: string;
  endDate?: string;
  items: PromotionItem[];
  createdAt: string;
  updatedAt: string;
}

export type PromotionType = "FIXED_DISCOUNT" | "PERCENTAGE";

export interface PromotionItem {
  id: string;
  promotionId: string;
  type: PromotionItemType;
  productId?: string;
  serviceId?: string;
  product?: Partial<Product>;
  service?: Partial<Service>;

  // vem quando eu faço o get dos produtos para verificar a promoção do item.
  promotion?: Partial<Promotion>;
}

export type PromotionItemType = "PRODUCT" | "SERVICE";
