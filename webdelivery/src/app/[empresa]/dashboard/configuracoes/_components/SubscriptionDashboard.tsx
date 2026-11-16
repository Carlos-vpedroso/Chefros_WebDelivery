"use client";

import { HeaderDashboard } from "@/components/HeaderDashboard";
import { motion } from "framer-motion";
import {
    FileSignature,
    CreditCard,
    CalendarClock,
    BadgeCheck,
    XCircle,
    Crown,
    Zap,
    TrendingUp,
    Shield,
    ArrowUpRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { formatR$ } from "@/lib/utils";

export default function SubscriptionDashboard() {
    // Dados mockados
    const proximaCobranca = "15/02/2025";
    const diasRestantes = 26;
    const progresso = (26 / 30) * 100;
    const { subscription, setSubscription } = useAuth(DashboardContext);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen space-y-8 pb-8"
        >
            <HeaderDashboard
                icon={FileSignature}
                title="Minha Assinatura"
                subtitle="Gerencie sua assinatura da Chefros"
            />
            <div className="space-y-6 p-4">

                {/* Banner Principal do Plano */}
                <div>
                    <Card className="relative overflow-hidden border-0 bg-cor1 text-white shadow-2xl">
                        {/* Efeito de fundo decorativo */}
                        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

                        <CardContent className="relative p-8">
                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                            <Crown className="h-7 w-7 text-yellow-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-100">Seu Plano Atual</p>
                                            <h2 className="text-3xl font-bold">{subscription?.plan?.name}</h2>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className="gap-1 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                                            <BadgeCheck className="h-4 w-4" />
                                            Ativo
                                        </Badge>
                                        <Badge className="gap-1 bg-green-500/30 text-white backdrop-blur-sm hover:bg-green-500/40">
                                            <Zap className="h-4 w-4" />
                                            Todos os recursos desbloqueados
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-2 md:items-end">
                                    <div className="text-right">
                                        <p className="text-sm text-blue-100">{subscription?.plan?.billingCycle === "MONTHLY" ? "Valor mensal" : "Valor anual"}</p>
                                        <p className="text-4xl font-bold">{formatR$(Number(subscription?.plan?.price))}</p>
                                    </div>
                                    <p className="text-sm text-blue-200">cobrado mensalmente</p>
                                </div>
                            </div>

                            {/* Progresso do ciclo */}
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-100">Próximo ciclo em {diasRestantes} dias</span>
                                    <span className="font-medium">{diasRestantes}/30 dias</span>
                                </div>
                                <Progress value={progresso} className="h-2 bg-white/20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Detalhes e Ações */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Detalhes Expandidos */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Detalhes da Assinatura
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Informações completas sobre seu plano
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="text-sm font-medium text-muted-foreground">Plano Contratado</span>
                                        <span className="font-semibold">{subscription?.plan?.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="text-sm font-medium text-muted-foreground">Status da Conta</span>
                                        <Badge variant="outline" className="gap-1">
                                            <BadgeCheck className={`h-4 w-4 ${subscription?.isActive ? "text-green-600" : "text-red-600"}`} />
                                            {subscription?.isActive ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="text-sm font-medium text-muted-foreground">Ciclo de Cobrança</span>
                                        <span className="font-semibold">{subscription?.plan?.billingCycle === "MONTHLY" ? "Mensal" : "Anual"}(Renovação Automática)</span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <span className="text-sm font-medium text-muted-foreground">Valor por Ciclo</span>
                                        <span className="text-lg font-bold text-blue-600">{formatR$(Number(subscription?.plan?.price))}</span>
                                    </div>
                                    {subscription?.currentPeriodStart &&
                                        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                            <span className="text-sm font-medium text-muted-foreground">Data de Início</span>
                                            <span className="font-semibold">{subscription?.currentPeriodStart}</span>
                                        </div>
                                    }

                                    {subscription?.currentPeriodEnd &&
                                        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                            <span className="text-sm font-medium text-muted-foreground">Próxima Renovação</span>
                                            <span className="font-semibold">{subscription?.currentPeriodEnd}</span>
                                        </div>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="space-y-6">
                        {/* Card de Ações */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Gerenciar Assinatura</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Atualize ou cancele sua assinatura
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="group w-full justify-between gap-2 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                                >
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Atualizar Método de Pagamento
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Button>

                                <Button
                                    variant="outline"
                                    className="group w-full justify-between gap-2 transition-all hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
                                >
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4" />
                                        Fazer Upgrade de Plano
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Button>

                                <Separator className="my-4" />

                                <Button
                                    variant="outline"
                                    className="group w-full justify-between gap-2 border-red-200 text-red-600 transition-all hover:border-red-500 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4" />
                                        Cancelar Assinatura
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Card de Benefícios */}
                        <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 dark:border-blue-900 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                    <Zap className="h-5 w-5" />
                                    Recursos Ativos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    {subscription?.plan?.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}