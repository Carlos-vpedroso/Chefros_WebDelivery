"use client";
import { useEffect, useState } from "react";
import {
  Grid3x3,
  Palette,
  Plus,
  Info,
  Share2,
  BookOpen,
  ShoppingCart,
  Sun,
  Moon,
  Gift,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, formatR$, isBusinessOpen } from "@/lib/utils";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProductCard from "@/app/[empresa]/cardapio/_components/ProductCard";
import { useTheme } from "next-themes";

function BrowserPreview({
  children,
  className,
  url = "",
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={clsx(
        "bg-card overflow-hidden rounded-xl border shadow-lg",
        className,
      )}
    >
      {/* Top bar estilo Safari */}
      <div className="bg-muted flex items-center gap-2 border-b px-4 py-2">
        {/* Botões do navegador */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        {/* Barra de URL */}
        <div className="flex flex-1 justify-center">
          <div className="bg-background text-muted-foreground w-2/3 truncate rounded-md border px-3 py-1 text-sm">
            {url || "https://meu.site.com"}
          </div>
        </div>
      </div>

      {/* Conteúdo (seu JSX aparece aqui) */}
      <div className="bg-background h-full overflow-auto">{children}</div>
    </div>
  );
}

function SmartphonePreview({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative mx-auto overflow-hidden rounded-[2.5rem] border-[6px] border-neutral-800 bg-black shadow-2xl",
        // MOBILE FIRST
        "h-[760px] w-full max-w-[390px]",
        className,
      )}
    >
      {/* Barra de Status */}
      <div className="text-texto absolute top-0 z-30 flex w-full items-center justify-between bg-gray-500/20 px-6 py-1 text-xs backdrop-blur-sm">
        {/* Horário */}
        <span className="font-semibold">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* Status Icons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-90">
            <svg
              width="18"
              height="18"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="text-texto"
            >
              <path d="M2 8.82A15.91 15.91 0 0112 4c3.98 0 7.6 1.48 10 3.82M5 12.5A10.94 10.94 0 0112 10c2.7 0 5.2.96 7 2.5M8.5 16.15A7 7 0 0112 15a7 7 0 013.48.87" />
            </svg>
          </div>

          <svg
            width="18"
            height="18"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="text-texto"
          >
            <path d="M2 10l10-7 10 7v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
          </svg>

          {/* Bateria */}
          <div className="flex items-center gap-1">
            <div className="border-texto relative h-3 w-5 rounded-sm border">
              <div className="bg-texto absolute inset-0 w-[70%] rounded-sm" />
            </div>
            <div className="bg-texto h-2 w-0.5" />
          </div>
        </div>
      </div>

      {/* Tela */}
      <div className="bg-background relative z-10 h-full w-full overflow-auto rounded-4xl pt-6">
        {children}
      </div>

      {/* Borda interna */}
      <div className="pointer-events-none absolute inset-0 rounded-[2.3rem] border border-neutral-700" />
    </div>
  );
}

export default function CatalogoDashboard() {
  const { businessInfo } = useAuth(BusinessContext);
  const { categories, products } = useAuth(DashboardContext);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("preview");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const productsByCategory = products.reduce(
    (acc, product) => {
      const categoryName = product.category?.name || "Sem Categoria";

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    },
    {} as Record<string, typeof products>,
  );

  const isOpen = businessInfo ? isBusinessOpen(businessInfo.workDays) : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen space-y-6"
    >
      {/* Cabeçalho */}
      <HeaderDashboard
        title="Catálogo / Cardápio"
        subtitle="Gerencie aparência do seu catálogo/cardápio"
        icon={BookOpen}
      />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="col-span-2 w-full">
          <BrowserPreview
            url={`chefros.com/${businessInfo?.slug}/cardapio`}
            className="hidden h-[750px] w-full lg:block"
          >
            <div className="bg-fundo flex min-h-screen flex-col items-center">
              <div className="mx-auto w-full max-w-5xl">
                {businessInfo && (
                  <header className="max-w-full overflow-hidden">
                    {/* 1. Contêiner do Banner: Adicionado 'h-40' (10rem) para definir altura */}
                    <div className="relative h-48 w-full md:h-64">
                      <Image
                        src={
                          businessInfo?.bannerUrl ||
                          "https://placehold.co/1920x400/858585/ffffff?text=Banner"
                        }
                        alt="Banner da Empresa"
                        fill
                        className="object-fill"
                        priority
                        sizes="100vw"
                      />

                      {/* Logo flutuante */}
                      <div className="absolute bottom-0 left-10 flex h-24 w-24 translate-y-1/2 transform items-center justify-center rounded-sm bg-white shadow-lg md:h-32 md:w-32">
                        <Image
                          src={
                            businessInfo?.logoUrl ||
                            "https://placehold.co/500x500/858585/ffffff?text=Logo"
                          }
                          alt="Logo da Empresa"
                          fill
                          className="rounded-sm object-contain p-1"
                          priority
                          sizes="(max-width: 768px) 96px, 128px"
                        />
                      </div>
                    </div>

                    {/* 3. Área de Conteúdo abaixo do Banner (Nome, Badge, Botões) */}
                    {/* Ajustado o padding esquerdo para desviar do logo */}
                    <div className="mt-2 mb-6 ml-33 flex flex-col px-4 md:mb-8 md:ml-40 md:flex-row md:items-center md:justify-between">
                      <h1 className="text-2xl font-bold">
                        {businessInfo?.name || "Nome da Empresa"}
                      </h1>
                      <div className="flex items-center justify-between">
                        {/* Badge de Aberto/Fechado */}
                        {businessInfo ? (
                          <Badge
                            variant="secondary"
                            className="flex border-green-500/20 bg-green-500/10 text-green-600"
                          >
                            <div className="h-1 w-1 rounded-full bg-green-500" />
                            <h1>Aberto</h1>
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="border-red-500/20 bg-red-500/10 text-red-600"
                          >
                            <div className="h-1 w-1 rounded-full bg-red-500" />
                            <h1>Fechado</h1>
                          </Badge>
                        )}

                        {/* Botões de Ação */}
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            className="mr-2 cursor-pointer"
                          >
                            <Info className="mr-1 h-4 w-4" />
                            <span className="hidden sm:inline">
                              Perfil da Loja
                            </span>
                          </Button>

                          <Button size="icon" variant="outline">
                            {theme === "dark" ? (
                              <Sun className="text-yellow-400" />
                            ) : (
                              <Moon className="text-cor1" />
                            )}
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            className="cursor-pointer"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <div className="group relative cursor-pointer">
                            <Button
                              size="icon"
                              variant="outline"
                              className="from-cor1 to-cor2 cursor-pointer bg-linear-to-br text-white transition-all duration-200 group-hover:brightness-110"
                            >
                              <ShoppingCart className="group-hover:text-texto h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>
                )}

                <div className="bg-card sticky top-0 z-20 border-b shadow-sm">
                  {/* 2. ScrollArea: Substitui a div com overflow-x-scroll */}
                  {/* className="w-full" garante que ele ocupe toda a largura */}
                  <ScrollArea className="w-full whitespace-nowrap">
                    {/* O conteúdo rolável deve ser um flex container */}
                    <div className="flex space-x-2 px-4 pb-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant="ghost"
                          // Usamos flex-shrink-0 para garantir que o botão não seja espremido
                          className={cn(
                            "h-auto shrink-0 rounded-none px-3 py-2 text-sm font-semibold",

                            // ESTILO CONDICIONAL DE DESTAQUE
                            selectedCategory === category.name.toLowerCase()
                              ? "border-b-2 border-orange-700 text-orange-700 hover:bg-transparent"
                              : "text-gray-500 hover:bg-gray-100 dark:hover:text-white",
                          )}
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>

                    {/* 3. ScrollBar: Adiciona a barra de rolagem horizontal customizada do Shadcn */}
                    <ScrollBar orientation="horizontal" className="h-2" />
                  </ScrollArea>
                </div>

                <div className="space-y-10 px-4 py-10">
                  {Object.entries(productsByCategory).map(
                    ([category, categoryProducts]) => (
                      <section
                        key={category}
                        className="scroll-mt-20 space-y-6"
                      >
                        {/* Header da categoria */}
                        <div className="flex items-baseline justify-between">
                          <h2 className="text-texto text-xl font-bold md:text-xl">
                            {category}
                          </h2>
                          <span className="text-texto/60 text-sm">
                            {categoryProducts.length} item
                            {categoryProducts.length > 1 && "s"}
                          </span>
                        </div>
                        <Separator />

                        {/* Grid de produtos */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                          {categoryProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              isOpen={isOpen}
                            />
                          ))}
                        </div>
                      </section>
                    ),
                  )}
                </div>
              </div>
            </div>
          </BrowserPreview>
        </div>
        <div>
          <SmartphonePreview>
            <div className="bg-fundo flex min-h-screen flex-col items-center">
              <div className="container min-h-screen w-full max-w-7xl">
                {businessInfo && (
                  <header className="max-w-full overflow-hidden">
                    {/* 1. Contêiner do Banner: Adicionado 'h-40' (10rem) para definir altura */}
                    <div className="relative h-48 w-full">
                      <Image
                        src={
                          businessInfo?.bannerUrl ||
                          "https://placehold.co/1920x400/858585/ffffff?text=Banner"
                        }
                        alt="Banner da Empresa"
                        fill
                        className="object-fill"
                        priority
                        sizes="100vw"
                      />

                      {/* Logo flutuante */}
                      <div className="absolute bottom-0 left-10 flex h-24 w-24 translate-y-1/2 transform items-center justify-center rounded-sm bg-white shadow-lg md:h-32 md:w-32">
                        <Image
                          src={
                            businessInfo?.logoUrl ||
                            "https://placehold.co/500x500/858585/ffffff?text=Logo"
                          }
                          alt="Logo da Empresa"
                          fill
                          className="rounded-sm object-contain p-1"
                          priority
                          sizes="(max-width: 768px) 96px, 128px"
                        />
                      </div>
                    </div>

                    {/* 3. Área de Conteúdo abaixo do Banner (Nome, Badge, Botões) */}
                    {/* Ajustado o padding esquerdo para desviar do logo */}
                    <div className="mt-2 mb-6 ml-33 flex flex-col px-4 md:mb-8 md:ml-40 md:flex-row md:items-center md:justify-between">
                      <h1 className="text-2xl font-bold">
                        {businessInfo?.name || "Nome da Empresa"}
                      </h1>
                    </div>
                    <div className="mt-1 flex items-center justify-between px-4">
                      <div className="flex items-center gap-2">
                        {/* Badge de Aberto/Fechado */}
                        {businessInfo ? (
                          <Badge
                            variant="secondary"
                            className="flex border-green-500/20 bg-green-500/10 text-green-600"
                          >
                            <div className="h-1 w-1 rounded-full bg-green-500" />
                            <h1>Aberto</h1>
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="border-red-500/20 bg-red-500/10 text-red-600"
                          >
                            <div className="h-1 w-1 rounded-full bg-red-500" />
                            <h1>Fechado</h1>
                          </Badge>
                        )}
                        <Button variant="ghost" className="mr-2 cursor-pointer">
                          <Info className="mr-1 h-4 w-4" />
                          <span className="">Perfil da Loja</span>
                        </Button>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex space-x-2">
                        <Button size="icon" variant="outline">
                          {theme === "dark" ? (
                            <Sun className="text-yellow-400" />
                          ) : (
                            <Moon className="text-cor1" />
                          )}
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          className="cursor-pointer"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <div className="group relative cursor-pointer">
                          <Button
                            size="icon"
                            variant="outline"
                            className="from-cor1 to-cor2 cursor-pointer bg-linear-to-br text-white transition-all duration-200 group-hover:brightness-110"
                          >
                            <ShoppingCart className="group-hover:text-texto h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </header>
                )}

                <div className="bg-card sticky top-0 z-20 border-b shadow-sm">
                  {/* 2. ScrollArea: Substitui a div com overflow-x-scroll */}
                  {/* className="w-full" garante que ele ocupe toda a largura */}
                  <ScrollArea className="w-full whitespace-nowrap">
                    {/* O conteúdo rolável deve ser um flex container */}
                    <div className="flex space-x-2 px-4 pb-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant="ghost"
                          // Usamos flex-shrink-0 para garantir que o botão não seja espremido
                          className={cn(
                            "h-auto shrink-0 rounded-none px-3 py-2 text-sm font-semibold",

                            // ESTILO CONDICIONAL DE DESTAQUE
                            selectedCategory === category.name.toLowerCase()
                              ? "border-b-2 border-orange-700 text-orange-700 hover:bg-transparent"
                              : "text-gray-500 hover:bg-gray-100 dark:hover:text-white",
                          )}
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>

                    {/* 3. ScrollBar: Adiciona a barra de rolagem horizontal customizada do Shadcn */}
                    <ScrollBar orientation="horizontal" className="h-2" />
                  </ScrollArea>
                </div>

                <div className="space-y-10 px-4 py-10">
                  {Object.entries(productsByCategory).map(
                    ([category, categoryProducts]) => (
                      <section
                        key={category}
                        className="scroll-mt-20 space-y-6"
                      >
                        {/* Header da categoria */}
                        <div className="flex items-baseline justify-between">
                          <h2 className="text-texto text-xl font-bold md:text-xl">
                            {category}
                          </h2>
                          <span className="text-texto/60 text-sm">
                            {categoryProducts.length} item
                            {categoryProducts.length > 1 && "s"}
                          </span>
                        </div>
                        <Separator />

                        {/* Grid de produtos */}
                        <div className="grid grid-cols-1 gap-6">
                          {categoryProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              isOpen={isOpen}
                            />
                          ))}
                        </div>
                      </section>
                    ),
                  )}
                </div>
              </div>
            </div>
          </SmartphonePreview>
        </div>
      </div>
    </motion.div>
  );
}
