"use client";

import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import { CartItem } from "@/types/product&category";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, type: "PRODUCT" | "COMBO") => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  updateQuantity: (
    id: string,
    type: "PRODUCT" | "COMBO",
    quantity: number,
  ) => void;
  setItemNotes: (id: string, type: "PRODUCT" | "COMBO", obs?: string) => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalPrice: 0,
  updateQuantity: () => {},
  setItemNotes: () => {},
});

interface CartProviderProps {
  children: ReactNode;
  empresaSlug: string;
}

export const CartProvider = ({ children, empresaSlug }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const getItemId = (item: CartItem) =>
    item.type === "PRODUCT" ? item.product.id : item.combo.id;

  // Persistência no localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem(`cart_${empresaSlug}`);
    if (storedCart) {
      const parsed: CartItem[] = JSON.parse(storedCart);

      const normalized = parsed.map((item) =>
        item.type === "PRODUCT"
          ? {
              ...item,
              unitPrice: Number(item.unitPrice),
              originalPrice: Number(item.originalPrice),
              subtotal: Number(item.subtotal),
            }
          : {
              ...item,
              subtotal: Number(item.subtotal),
            },
      );

      setCart(normalized);
    }
  }, [empresaSlug]);

  useEffect(() => {
    localStorage.setItem(`cart_${empresaSlug}`, JSON.stringify(cart));
  }, [cart, empresaSlug]);

  // Funções do carrinho
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const itemId = getItemId(item);

      const exists = prev.find(
        (i) => getItemId(i) === itemId && i.type === item.type,
      );

      if (exists) {
        return prev.map((i) =>
          getItemId(i) === itemId && i.type === item.type
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                subtotal: i.unitPrice * (i.quantity + item.quantity),
              }
            : i,
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, type: "PRODUCT" | "COMBO") => {
    setCart((prev) =>
      prev.filter((item) => !(getItemId(item) === id && item.type === type)),
    );
  };

  const clearCart = () => setCart([]);

  // Calcula o número total de itens
  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Calcula o preço total
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  }, [cart]);

  const updateQuantity = (
    id: string,
    type: "PRODUCT" | "COMBO",
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        getItemId(item) === id && item.type === type
          ? {
              ...item,
              quantity,
              subtotal: item.unitPrice * quantity,
            }
          : item,
      ),
    );
  };

  const setItemNotes = (
    id: string,
    type: "PRODUCT" | "COMBO",
    obs?: string,
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        getItemId(item) === id && item.type === type ? { ...item, obs } : item,
      ),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        itemCount,
        totalPrice,
        updateQuantity,
        setItemNotes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
