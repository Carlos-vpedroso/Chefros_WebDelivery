"use client";

import { Business, BusinessModule } from "@/types/business";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface BusinessContextType {
  businessInfo: Business | null;
  setBusinessInfo: React.Dispatch<React.SetStateAction<Business | null>>;
  loading: boolean;
  modules: BusinessModule[];
}

export const BusinessContext = createContext<BusinessContextType>({
  businessInfo: null,
  setBusinessInfo: () => undefined,
  loading: false,
  modules: [],
});

interface BusinessProviderProps {
  children: ReactNode;
  empresaSlug: string;
}

export const BusinessProvider = ({
  children,
  empresaSlug,
}: BusinessProviderProps) => {
  const [businessInfo, setBusinessInfo] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modules, setModules] = useState<BusinessModule[]>([]);

  useEffect(() => {
    const fetchDadosEmpresa = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/business/getinfo/${empresaSlug}`,
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar empresa (${response.status})`);
        }

        const data = await response.json();
        const { modules, ...dataSemModules } = data;
        setBusinessInfo(dataSemModules);
        setModules(modules);
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    if (empresaSlug) {
      fetchDadosEmpresa();
    }
  }, [empresaSlug]);

  return (
    <BusinessContext.Provider
      value={{
        businessInfo,
        setBusinessInfo,
        loading,
        modules,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
