"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BusinessContext } from "@/contexts/BusinessContext";

export default function AcessoNegadoPage() {
  const { businessInfo } = useAuth(BusinessContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Você não possui permissão para acessar este módulo. Entre em contato com
        o administrador da sua empresa.
      </p>
      <Link href={`/${businessInfo?.slug}/dashboard`}>
        <Button variant="default" className="cursor-pointer">
          Voltar para o Painel
        </Button>
      </Link>
    </div>
  );
}
