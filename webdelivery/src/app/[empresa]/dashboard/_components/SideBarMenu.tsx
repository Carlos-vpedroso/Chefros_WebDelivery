"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Truck,
  ClipboardList,
  Package,
  Users,
  DollarSign,
  Heart,
  Bot,
  Zap,
  Megaphone,
  FileText,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Settings,
  FolderKanban,
  X,
  Menu,
  House,
  Folders,
  IdCardLanyard,
  Table,
  Motorbike,
  Clock,
  Building2,
  Tag,
  Boxes,
  Box,
  Wrench,
  Monitor,
  Grid2X2,
  ChartLine,
  SquareChartGantt,
  TrendingDown,
  Layers,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDropdownMenu from "./UserDropdownMenu";
import { useAuth } from "@/hooks/useAuth";
import { BusinessContext } from "@/contexts/BusinessContext";
import { capitalizeWords } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { ModuleType } from "@/types/modules";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { canAccessUI } from "@/lib/permissions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  url: string;
  icon: any;
  label: string;
  refModule: ModuleType | "ALL";
  refPermission: string;
  submenu?: SubMenuItem[];
}
interface SubMenuItem {
  url?: string;
  icon: any;
  label: string;
  refPermission: string;
  submenu?: SubSubMenuItem[];
}

interface SubSubMenuItem {
  url: string;
  icon: any;
  label: string;
  refPermission: string;
}

export default function SidebarMenu() {
  const { businessInfo, modules } = useAuth(BusinessContext);
  const { logoutFuncionario, userInfo } = useAuth(EmployeeContext);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      url: `/${businessInfo?.slug}/dashboard/pdv`,
      icon: Monitor,
      label: "PDV",
      refModule: "SALES_PDV",
      refPermission: "pdv",
    },
    {
      url: `/${businessInfo?.slug}/dashboard/pedidos`,
      icon: ClipboardList,
      label: "Pedidos",
      refModule: "ALL",
      refPermission: "pedidos",
    },
    {
      url: `/${businessInfo?.slug}/dashboard/vendas`,
      icon: ShoppingCart,
      label: "Vendas",
      refModule: "SALES_PDV",
      refPermission: "vendas",
      submenu: [
        {
          url: `/${businessInfo?.slug}/dashboard/vendas`,
          icon: ChartLine,
          label: "Visão Geral",
          refPermission: "vendas.dashboard",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/vendas?page=Mesas`,
          icon: Grid2X2,
          label: "Mesas",
          refPermission: "vendas.mesas",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/vendas?page=Categorias`,
          icon: Boxes,
          label: "Categorias",
          refPermission: "vendas.categorias",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/vendas?page=Produtos`,
          icon: Box,
          label: "Produtos",
          refPermission: "vendas.produtos",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/vendas?page=Servicos`,
          icon: Wrench,
          label: "Serviços",
          refPermission: "vendas.servicos",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/vendas?page=ComboAndPromo`,
          icon: Tag,
          label: "Combos & Promoções",
          refPermission: "vendas.combos",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/vendas?page=Catalogo`,
          icon: BookOpen,
          label: "Catálogo",
          refPermission: "vendas.catalogo",
        },
      ],
    },
    {
      url: `/${businessInfo?.slug}/dashboard/delivery`,
      icon: Motorbike,
      label: "Delivery",
      refModule: "DELIVERY",
      refPermission: "delivery",
      submenu: [
        {
          url: `/${businessInfo?.slug}/dashboard/delivery`,
          icon: ChartLine,
          label: "Visão Geral",
          refPermission: "delivery.dashboard",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/delivery?page=Pedidos`,
          icon: ClipboardList,
          label: "Pedidos",
          refPermission: "delivery.pedidos",
        },
      ],
    },
    {
      url: `/${businessInfo?.slug}/dashboard/gestao`,
      icon: Package,
      label: "Gestão",
      refModule: "INVENTORY_MGMT",
      refPermission: "gestao",
      submenu: [
        {
          url: `/${businessInfo?.slug}/dashboard/gestao?page=Estoque`,
          icon: Package,
          label: "Estoque",
          refPermission: "gestao.estoque",
        },
      ],
    },
    {
      url: `/${businessInfo?.slug}/dashboard/relatorios`,
      icon: SquareChartGantt,
      label: "Relatórios",
      refModule: "ALL",
      refPermission: "relatorios",
      submenu: [
        {
          url: `/${businessInfo?.slug}/dashboard/relatorios?page=Vendas`,
          icon: SquareChartGantt,
          label: "Vendas",
          refPermission: "relatorios.vendas",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/relatorios?page=MaisVendidos`,
          icon: Box,
          label: "Mais Vendidos",
          refPermission: "relatorios.maisvendidos",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/relatorios?page=MenosVendidos`,
          icon: TrendingDown,
          label: "Menos Vendidos",
          refPermission: "relatorios.menosvendidos",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/relatorios?page=FaturamentoCategoria`,
          icon: Layers,
          label: "Faturamento Categoria",
          refPermission: "relatorios.faturamentocategoria",
        },
      ],
    },
    {
      url: `/${businessInfo?.slug}/dashboard/configuracoes`,
      icon: Settings,
      label: "Configurações",
      refModule: "ALL",
      refPermission: "configuracoes",
      submenu: [
        {
          url: `/${businessInfo?.slug}/dashboard/configuracoes`,
          icon: Building2,
          label: "Perfil da Empresa",
          refPermission: "configuracoes.home",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/configuracoes?page=Funcionarios`,
          icon: IdCardLanyard,
          label: "Funcionários",
          refPermission: "configuracoes.funcionarios",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/configuracoes?page=Horarios`,
          icon: Clock,
          label: "Horários",
          refPermission: "configuracoes.horarios",
        },
        {
          url: `/${businessInfo?.slug}/dashboard/configuracoes?page=Assinatura`,
          icon: FileSignature,
          label: "Assinatura",
          refPermission: "configuracoes.assinatura",
        },
      ],
    },
  ];

  // Função para verificar se um módulo está ativo
  const isModuleActive = (refModule: ModuleType | "ALL"): boolean => {
    if (refModule === "ALL") {
      return true; // Sempre mostra itens com refModule "ALL"
    }

    // Verifica se existe um módulo ativo com o moduleType correspondente
    return modules.some(
      (module) => module.moduleType === refModule && module.active === true,
    );
  };

  // Filtra os menuItems baseado nos módulos ativos
  const filteredMenuItems = menuItems.filter((item) => {
    return (
      isModuleActive(item.refModule) &&
      canAccessUI(userInfo?.permissions, item.refPermission)
    );
  });

  return (
    <>
      {/* Botão mobile */}
      <header className="bg-card border-border sticky top-0 z-30 flex justify-between border-b px-4 py-2 lg:hidden">
        <div className="flex items-center gap-2">
          {businessInfo?.logoUrl ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <Image
                src={
                  businessInfo?.logoUrl ||
                  "https://placehold.co/500x500/ef4444/ffffff?text=Logo"
                }
                alt="Icone da Empresa"
                width={50}
                height={50}
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="from-cor1 to-cor2 flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br text-sm font-bold text-white">
              <Building2 />
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-texto font-semibold">
              {businessInfo?.name ?? "Nome da Empresa"}
            </span>
            <span className="text-texto/60 text-xs">Dashboard Empresarial</span>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          className="text-texto cursor-pointer rounded-lg bg-transparent p-2"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`bg-fundo border-sidebar-border fixed top-0 left-0 z-40 flex h-full w-2/3 transform flex-col border-r transition-transform duration-300 md:w-1/2 lg:w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-2">
          {businessInfo?.name ? (
            <div className="flex w-full flex-1 items-center justify-start gap-4">
              <div className="h-12 w-12 rounded-md">
                <Image
                  src={
                    businessInfo.logoUrl ||
                    "https://placehold.co/500x500/ef4444/ffffff?text=Logo"
                  }
                  alt="Logo da Empresa"
                  width={500}
                  height={500}
                  className="rounded-md object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-texto line-clamp-1 text-lg font-bold">
                  {capitalizeWords(businessInfo.name)}
                </h1>
                <p className="text-texto/60 text-xs">Dashboard Empresarial</p>
              </div>
            </div>
          ) : (
            // Skeleton loading elegante
            <div>
              <Skeleton className="bg-sidebar-accent/30 h-5 w-3/4 rounded"></Skeleton>
              <Skeleton className="bg-sidebar-accent/20 h-3 w-1/2 rounded"></Skeleton>
            </div>
          )}
        </div>

        {/* Menu principal */}
        <ScrollArea className="flex-1 overflow-y-auto p-4">
          <Accordion type="multiple" className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.submenu?.length;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.label}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-fundo2 text-texto flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 hover:no-underline"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              }

              return (
                <AccordionItem
                  key={item.label}
                  value={item.label}
                  className="border-none"
                >
                  <AccordionTrigger className="hover:bg-fundo2 text-texto flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-sidebar-border mt-1 ml-4 space-y-1 border-l-2 pl-2">
                    {/* SUBMENU */}
                    <Accordion type="multiple" className="space-y-1">
                      {item.submenu
                        ?.filter((sub) =>
                          canAccessUI(userInfo?.permissions, sub.refPermission),
                        )
                        .map((sub) => {
                          const SubIcon = sub.icon;
                          const hasUrl = !!sub.url;
                          const hasChildren = !!sub.submenu;

                          return (
                            <AccordionItem
                              key={sub.label}
                              value={sub.label}
                              className="border-none"
                            >
                              {/* Se tiver URL e não tiver submenu, vira um Link direto */}

                              {hasUrl && !hasChildren ? (
                                <Link
                                  href={sub.url as string}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <div className="hover:bg-fundo2 text-texto/80 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm">
                                    <SubIcon className="h-4 w-4" />
                                    <span>{sub.label}</span>
                                  </div>
                                </Link>
                              ) : (
                                <>
                                  {/* Trigger do submenu */}
                                  <AccordionTrigger className="hover:bg-fundo2 text-texto flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm hover:no-underline">
                                    <div className="flex items-center gap-3">
                                      <SubIcon className="h-4 w-4" />
                                      <span>{sub.label}</span>
                                    </div>
                                  </AccordionTrigger>

                                  {/* SUB-SUBMENU */}
                                  {hasChildren && (
                                    <AccordionContent className="border-sidebar-border mt-1 ml-4 space-y-1 border-l pl-2">
                                      {sub.submenu?.map((subsub) => (
                                        <Link
                                          key={subsub.label}
                                          href={subsub.url}
                                        >
                                          <div className="text-sidebar-foreground/70 hover:bg-sidebar-accent/20 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-xs">
                                            <subsub.icon className="h-4 w-4" />
                                            <span>{subsub.label}</span>
                                          </div>
                                        </Link>
                                      ))}
                                    </AccordionContent>
                                  )}
                                </>
                              )}
                            </AccordionItem>
                          );
                        })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>

        {/* Menu do usuário */}
        <div className="border-sidebar-border bg-sidebar shrink-0 border-t p-4">
          {userInfo && (
            <UserDropdownMenu
              handleLogout={logoutFuncionario}
              employee={userInfo}
              business={businessInfo}
            />
          )}
        </div>
      </aside>
    </>
  );
}
