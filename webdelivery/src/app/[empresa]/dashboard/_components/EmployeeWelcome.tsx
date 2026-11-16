"use client";

import { motion } from "framer-motion";
import { Smile, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { UsuarioFuncionario } from "@/types/users";
import { useAuth } from "@/hooks/useAuth";
import { BusinessContext } from "@/contexts/BusinessContext";
import Image from "next/image";

interface EmployeeWelcomeProps {
  userInfo: UsuarioFuncionario | null;
}

export default function EmployeeWelcome({ userInfo }: EmployeeWelcomeProps) {
  const { businessInfo } = useAuth(BusinessContext);

  return (
    <div className="min-h-screen bg-fundo">
      {/* Header mantido */}
      <HeaderDashboard
        title={`Bem-vindo, ${userInfo?.name}!`}
        subtitle={
          userInfo?.role ? `Você está logado como ${userInfo.role}` : ""
        }
        icon={Smile}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
        {/* Hero institucional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          {businessInfo?.logoUrl && (
            <div className="mb-6 flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-white shadow-md">
                <Image
                  src={businessInfo.logoUrl}
                  alt={businessInfo.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-texto md:text-3xl">
            Bem-vindo ao sistema da{" "}
            <span className="text-primary">{businessInfo?.name}</span>
          </h1>

          <p className="mt-3 text-texto/60">
            Este ambiente foi preparado para apoiar sua rotina de trabalho.
          </p>
        </motion.div>

        {/* Card de orientação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="border-slate-200 shadow-lg dark:border-slate-800">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <Info className="h-6 w-6 text-primary" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-texto">
                    Acesso baseado em permissões
                  </h2>

                  <p className="leading-relaxe text-texto/60">
                    Utilize o menu lateral para acessar as funcionalidades
                    disponíveis para o seu perfil de permissão.
                  </p>

                  <p className="leading-relaxed text-texto/60">
                    Caso precise de acesso a outras áreas do sistema, solicite ao
                    administrador responsável.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-texto/60">
            Sistema seguro • Acesso controlado • Ambiente corporativo
          </p>
        </motion.div>
      </div>
    </div>
  );
}
