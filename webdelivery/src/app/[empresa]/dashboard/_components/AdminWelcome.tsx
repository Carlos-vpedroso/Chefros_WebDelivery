"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BusinessContext } from "@/contexts/BusinessContext";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import {
  ClipboardList,
  Settings,
  Smile,
  LayoutDashboard,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Play,
  Book,
  Zap,
  Target,
  Gift,
  Users,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import clsx from "clsx";
import { DashboardContext } from "@/contexts/DashboardContext";

export default function AdminWelcome() {
  const { businessInfo } = useAuth(BusinessContext);
  const { userInfo } = useAuth(EmployeeContext);
  const { categories, products } = useAuth(DashboardContext);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Dados de acesso rápido
  const quickAccess = [
    {
      url: `/${businessInfo?.slug}/dashboard/vendas`,
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Visão geral",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      url: `/${businessInfo?.slug}/dashboard/vendas?page=PDV`,
      icon: ShoppingCart,
      label: "PDV",
      description: "Vendas rápidas",
      color: "bg-green-500",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      url: `/${businessInfo?.slug}/dashboard/delivery?page=Pedidos`,
      icon: ClipboardList,
      label: "Pedidos",
      description: "Acompanhe",
      color: "bg-orange-500",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      url: `/${businessInfo?.slug}/dashboard/configuracoes`,
      icon: Settings,
      label: "Configurações",
      description: "Personalize",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-pink-500",
    },
  ];
  const visualIdentityFields = [
    businessInfo?.logoUrl,
    businessInfo?.bannerUrl,
    businessInfo?.name,
    businessInfo?.phone,
    businessInfo?.email,
    businessInfo?.address?.rua,
    businessInfo?.address?.cidade,
    businessInfo?.address?.estado,
  ];

  function calculateProgress(fields: any[]) {
    const total = fields.length;
    const filled = fields.filter(
      (f) => f !== null && f !== undefined && f !== "",
    ).length;

    return Math.round((filled / total) * 100);
  }
  const menuProgress = (() => {
    let score = 0;

    if ((categories?.length ?? 0) > 0) score += 50;
    if ((products?.length ?? 0) > 0) score += 50;

    return score;
  })();

  // Guia de negócio
  const guideBusiness = [
    {
      id: 1,
      icon: Settings,
      title: "Configure sua identidade visual",
      description: "Personalize sua marca e crie uma experiência única",
      steps: [
        "Adicione logo e cores da empresa",
        "Configure contato e endereço",
        "Defina taxas e políticas",
        "Personalize mensagens aos clientes",
      ],
      cta: "Configurar agora",
      url: `/${businessInfo?.slug}/dashboard/configuracoes`,
      color: "blue",
      progress: calculateProgress(visualIdentityFields),
    },
    {
      id: 2,
      icon: ClipboardList,
      title: "Organize seu cardápio",
      description: "Estruture produtos e comece a vender",
      steps: [
        "Crie categorias organizadas",
        "Cadastre produtos com imagens",
        "Defina preços e variações",
        "Gerencie estoque e disponibilidade",
      ],
      cta: "Cadastrar produtos",
      url: `/${businessInfo?.slug}/dashboard/categorias`,
      color: "green",
      progress: menuProgress,
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: "Inicie as vendas",
      description: "Comece a faturar e monitore resultados",
      steps: [
        "Use o PDV para vendas presenciais",
        "Acompanhe pedidos em tempo real",
        "Visualize relatórios de faturamento",
        "Monitore métricas no dashboard",
      ],
      cta: "Ver dashboard",
      url: `/${businessInfo?.slug}/dashboard/vendas`,
      color: "purple",
      progress: 100,
    },
    {
      id: 4,
      icon: Users,
      title: "Otimize sua operação",
      description: "Automatize processos e tenha controle total",
      steps: [
        "Configure horários de funcionamento",
        "Cadastre funcionários e equipe",
        "Defina perfis e permissões",
        "Configure pagamentos e entrega",
      ],
      cta: "Gerenciar operação",
      url: `/${businessInfo?.slug}/dashboard/configuracoes?tab=team`,
      color: "orange",
      progress: 100,
    },
    {
      id: 5,
      icon: TrendingUp,
      title: "Escale seu sucesso",
      description: "Maximize faturamento com ferramentas avançadas",
      steps: [
        "Analise relatórios de desempenho",
        "Configure promoções especiais",
        "Integre com delivery",
        "Expanda para múltiplos canais",
      ],
      cta: "Ver relatórios",
      url: `/${businessInfo?.slug}/dashboard/vendas?page=Relatorios`,
      color: "pink",
      progress: 100,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-400",
      icon: "bg-blue-500",
      hover: "hover:border-blue-300 dark:hover:border-blue-700",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-400",
      icon: "bg-green-500",
      hover: "hover:border-green-300 dark:hover:border-green-700",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-400",
      icon: "bg-purple-500",
      hover: "hover:border-purple-300 dark:hover:border-purple-700",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-700 dark:text-orange-400",
      icon: "bg-orange-500",
      hover: "hover:border-orange-300 dark:hover:border-orange-700",
    },
    pink: {
      bg: "bg-pink-50 dark:bg-pink-950/20",
      border: "border-pink-200 dark:border-pink-800",
      text: "text-pink-700 dark:text-pink-400",
      icon: "bg-pink-500",
      hover: "hover:border-pink-300 dark:hover:border-pink-700",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-fundo flex min-h-screen flex-col"
    >
      {/* Header */}
      <HeaderDashboard
        title={`Bem-vindo, ${userInfo?.name}!`}
        subtitle={
          userInfo?.role ? `Você está logado como ${userInfo.role}` : ""
        }
        icon={Smile}
      />

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Hero Section */}
        <div className="from-primary/10 via-primary/5 relative overflow-hidden rounded-2xl bg-linear-to-br to-transparent p-6 md:p-8">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Novo
                </Badge>
                <Badge variant="outline">5 etapas para o sucesso</Badge>
              </div>
              <h1 className="text-texto text-2xl font-bold md:text-3xl">
                Configure seu negócio em minutos
              </h1>
              <p className="text-texto/60 max-w-2xl text-sm md:text-base">
                Siga nosso guia passo a passo e comece a vender hoje mesmo.
                Configure, personalize e veja seus resultados crescerem!
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="cursor-pointer" asChild>
                <Link href={`/${businessInfo?.slug}/dashboard/configuracoes`}>
                  <Play className="mr-2 h-4 w-4" />
                  Começar agora
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                <Book className="mr-2 h-4 w-4" />
                Ver tutorial
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
          <div className="bg-primary/5 pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl" />
        </div>

        {/* Quick Access Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-texto text-lg font-bold">Acesso Rápido</h2>
              <p className="text-texto/60 text-sm">
                Atalhos para áreas principais
              </p>
            </div>
            <Zap className="text-primary h-5 w-5" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {quickAccess.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.url}>
                    <Card className="group h-full cursor-pointer border-2 transition-all hover:-translate-y-1 hover:shadow-xl">
                      <CardContent className="flex flex-col items-start gap-3 p-4">
                        <div
                          className={`bg-linear-to-br ${item.gradient} rounded-xl p-2.5 text-white shadow-lg transition-transform group-hover:scale-110`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-texto text-sm font-bold md:text-base">
                            {item.label}
                          </h3>
                          <p className="text-texto/60 text-xs">
                            {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Guide Steps */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-texto text-lg font-bold">
                Guia para o Sucesso
              </h2>
              <p className="text-texto/60 text-sm">
                Siga cada etapa para configurar seu negócio
              </p>
            </div>
            <Gift className="text-primary h-5 w-5" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guideBusiness.map((item, index) => {
              const Icon = item.icon;
              const colors =
                colorClasses[item.color as keyof typeof colorClasses];
              const isExpanded = activeStep === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={clsx(
                      "group h-full cursor-pointer border-2 transition-all",
                      colors.border,
                      colors.hover,
                    )}
                    onClick={() => setActiveStep(isExpanded ? null : item.id)}
                  >
                    <CardContent className="space-y-4 p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.icon} text-white shadow-lg`}
                          >
                            <span className="text-sm font-bold">{item.id}</span>
                          </div>
                          <Icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.progress}%
                        </Badge>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-texto mb-1 text-base font-bold">
                          {item.title}
                        </h3>
                        <p className="text-texto/60 text-sm">
                          {item.description}
                        </p>
                      </div>

                      {/* Progress */}
                      <Progress value={item.progress} className="h-2" />

                      {/* Steps - Expandable */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ul className="space-y-2 border-t pt-4">
                              {item.steps.map((step, i) => (
                                <li
                                  key={i}
                                  className="text-texto/80 flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* CTA */}
                      <Link href={item.url}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={clsx("w-full cursor-pointer", colors.text)}
                        >
                          {item.cta}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

 
