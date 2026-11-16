import React, { ReactNode } from "react";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { CartProvider } from "@/contexts/CartContext";

interface LoginLayoutProps {
  children: ReactNode;
  params: Promise<{ empresa: string }>;
}

export default async function EmpresaLayout({
  children,
  params,
}: LoginLayoutProps) {
  const { empresa } = await params;
  return (
    <BusinessProvider empresaSlug={empresa}>
      <CartProvider empresaSlug={empresa}>{children}</CartProvider>
    </BusinessProvider>
  );
}
