"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Check,
  ChevronDown,
  Menu,
  X,
  Store,
  Dog,
  ArrowRight,
  Star,
  ForkKnife,
  MessageCircle,
  Lock,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Image from "next/image";
import { RainbowButton } from "@/components/ui/rainbow-button";
import clsx from "clsx";
import { AnimatedList } from "@/components/ui/animated-list";
import { Separator } from "@/components/ui/separator";
import depoimentosBg from "../../public/images/testimonials-bg2.png";
import { Marquee } from "@/components/ui/marquee";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TypingAnimation } from "@/components/ui/typing-animation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Ínicio", href: "#hero" },
    { name: "Benefícios", href: "#benefits" },
    { name: "Soluções", href: "#solucoes" },
    { name: "Depoimentos", href: "#depoimentos" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="bg-fundo/80 sticky top-0 z-50 w-full border-b border-gray-200/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="#hero" className="relative block h-16 w-16">
              <Image
                src="/images/Logotipo_nobg.png"
                alt="Chefros"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>
          <div className="hidden md:items-center md:space-x-8 lg:flex">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                className="relative"
                whileHover="hover"
                initial="initial"
              >
                <Link
                  href={item.href}
                  className="text-texto relative font-medium"
                >
                  {item.name}
                  <motion.span
                    className="bg-cor1 absolute bottom-[-2] left-0 h-0.5 w-full"
                    variants={{
                      initial: { scaleX: 0 },
                      hover: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="hidden space-x-2 md:flex">
            <Link href="/login">
              <Button variant="outline" className="cursor-pointer">
                Entrar
              </Button>
            </Link>
            <Link href="/checkout">
              <RainbowButton className="cursor-pointer items-center justify-center text-white dark:text-black">
                Teste Grátis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </RainbowButton>
            </Link>
            <AnimatedThemeToggler className="cursor-pointer" />
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <AnimatedThemeToggler />
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cor1 inline-flex items-center justify-center rounded-md p-2"
              aria-label="Menu principal"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
          >
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-texto hover:bg-fundo2 block rounded-md px-3 py-2 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full cursor-pointer">
                    Entrar
                  </Button>
                </Link>
                <RainbowButton className="cursor-pointer items-center justify-center text-white dark:text-black">
                  Teste Grátis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </RainbowButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-[95vh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={"/images/restaurant.jpeg"}
        alt="Imagem de Fundo"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/90" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
          <h1 className="mt-6 text-4xl leading-tight font-extrabold md:text-6xl">
            Controle seus pedidos, vendas e faturamento
            <span className="from-cor1 to-cor2 block bg-linear-to-r bg-clip-text text-transparent">
              em tempo real
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-300">
            PDV inteligente, dashboard em tempo real, controle de mesas e
            analytics avançados para o seu negócio crescer sem complicação.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={"/checkout"} prefetch={true}>
              <Button className="bg-cor1 hover:bg-cor2 w-48 cursor-pointer rounded-xl px-10 py-6 font-semibold text-white transition-all hover:scale-105">
                Começar agora
              </Button>
            </Link>
            <Link href={"/checkout"}>
              <Button className="w-48 cursor-pointer rounded-xl border border-white/30 bg-white/40 px-10 py-6 font-semibold text-white backdrop-blur transition-all hover:bg-white/10">
                Ver demonstração
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 h-32 w-full bg-linear-to-t from-black to-transparent" />
    </section>
  );
};

const PricingSection = () => {
  type Benefit = {
    label: string;
    image: string;
    features: string[];
  };

  const benefits: Benefit[] = [
    {
      label: "Venda Online",
      image: "/images/cardapio.png",
      features: [
        "Cardápio digital",
        "Pedidos via WhatsApp",
        "Link de vendas",
        "Atualização em tempo real",
      ],
    },
    {
      label: "Gestão",
      image: "/images/gestao.jpg",
      features: [
        "Controle de pedidos",
        "Gestão de produtos",
        "Relatórios de vendas",
        "Histórico completo",
      ],
    },
    {
      label: "PDV",
      image: "/images/pdv.png",
      features: [
        "PDV rápido e intuitivo",
        "Pedidos por mesa",
        "Comandas",
        "Integração com caixa",
      ],
    },
    {
      label: "Delivery",
      image: "/images/delivery.png",
      features: [
        "Gestão de entregas",
        "Status do pedido",
        "Motoboy",
        "Notificações automáticas",
      ],
    },
  ];

  const FlipCard = ({ benefit }: { benefit: Benefit }) => {
    const [flipped, setFlipped] = useState(false);

    return (
      <div
        className="group relative h-100 w-full cursor-pointer perspective-distant"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 transform-3d ${flipped ? "transform-[rotateY(180deg)]" : ""} group-hover:transform-[rotateY(180deg)]`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg backface-hidden">
            <Image
              src={benefit.image}
              alt={benefit.label}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/60 to-black/80" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <h3 className="text-xl font-semibold text-white">
                {benefit.label}
              </h3>
            </div>
          </div>

          {/* BACK */}
          <div className="bg-card text-texto absolute inset-0 transform-[rotateY(180deg)] rounded-2xl px-6 py-8 shadow-lg backface-hidden">
            <h3 className="mb-4 text-lg font-semibold">{benefit.label}</h3>

            <ul className="space-y-3">
              {benefit.features.map((feature) => (
                <li
                  key={feature}
                  className="text-texto/70 flex items-center gap-3 text-sm"
                >
                  <Check className="text-primary h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="benefits" className="bg-fundo2 py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-texto text-3xl font-extrabold sm:text-4xl">
            Conheça nosso diferencial
          </h2>
          <p className="text-texto/60 mt-4 text-lg">
            Módulos pensados para cada etapa do crescimento do seu negócio.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <FlipCard key={benefit.label} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

const InfoDashboardSection = () => {
  interface DashboardInfo {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
  }

  interface NotificationItem {
    name: string;
    description: string;
    icon: string;
    color: string;
    time: string;
  }

  const dashboardInfo: DashboardInfo[] = [
    {
      icon: ForkKnife,
      title: "Restaurante",
      description:
        "Atendimento e delivery automatizado. Gestão de mesas e pedidos sincronizados.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Dog,
      title: "Petshop",
      description:
        "Controle de agendamentos, clientes e serviços. Lembretes automáticos por IA.",
      gradient: "from-green-500 to-blue-500",
    },
    {
      icon: Store,
      title: "Lojas (Varejo)",
      description:
        "Gestão de estoque, PDV rápido e automações de campanhas digitais e CRM.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: ForkKnife,
      title: "Bar & Lounge",
      description:
        "Controle de comandas, estoque de bebidas e eventos especiais.",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  let notifications: NotificationItem[] = [
    // RESTAURANTE
    {
      name: "Pedido recebido",
      description: "Novo pedido #2841 - Mesa 02",
      time: "2min atrás",
      icon: "🍽️",
      color: "#00C9A7",
    },
    {
      name: "Reserva confirmada",
      description: "Mesa 04 - 4 pessoas, 20:00",
      time: "15min atrás",
      icon: "📅",
      color: "#3B82F6",
    },
    {
      name: "Delivery a caminho",
      description: "Pedido #2842 - 15min para entrega",
      time: "25min atrás",
      icon: "🚗",
      color: "#10B981",
    },
    {
      name: "Avaliação recebida",
      description: "⭐️⭐️⭐️⭐️⭐️ - Comida excelente!",
      time: "1h atrás",
      icon: "⭐",
      color: "#F59E0B",
    },
    {
      name: "Item esgotado",
      description: "Filé Mignon - Reposição amanhã",
      time: "2h atrás",
      icon: "⚠️",
      color: "#EF4444",
    },

    // PETSHOP
    {
      name: "Agendamento confirmado",
      description: "Banho e tosa - Luna, 14:30",
      time: "30min atrás",
      icon: "🛁",
      color: "#8B5CF6",
    },
    {
      name: "Vacina vencendo",
      description: "Rex - V10 vence em 5 dias",
      time: "45min atrás",
      icon: "💉",
      color: "#EC4899",
    },
    {
      name: "Cliente cadastrado",
      description: "Novo pet - Thor (Golden Retriever)",
      time: "1h atrás",
      icon: "👤",
      color: "#06B6D4",
    },
    {
      name: "Produto popular",
      description: "Ração Premier - 20 vendas hoje",
      time: "3h atrás",
      icon: "📊",
      color: "#84CC16",
    },
    {
      name: "Lembrete de retorno",
      description: "Bella - Retorno em 30 dias",
      time: "4h atrás",
      icon: "🔔",
      color: "#F97316",
    },

    // LOJAS (VAREJO)
    {
      name: "Venda realizada",
      description: "R$ 289,90 - Cartão crédito",
      time: "5min atrás",
      icon: "💸",
      color: "#10B981",
    },
    {
      name: "Estoque crítico",
      description: "Tênis Nike Air - 2 unidades",
      time: "20min atrás",
      icon: "📦",
      color: "#DC2626",
    },
    {
      name: "Cliente fidelizado",
      description: "João completou 10 compras",
      time: "1h atrás",
      icon: "🎉",
      color: "#7C3AED",
    },
    {
      name: "Promoção ativa",
      description: "Black Friday - 30% desconto",
      time: "2h atrás",
      icon: "🎯",
      color: "#1E86FF",
    },
    {
      name: "Fornecedor confirmado",
      description: "Entrega amanhã - 08:00",
      time: "3h atrás",
      icon: "🚚",
      color: "#14B8A6",
    },

    // BAR & LOUNGE
    {
      name: "Comanda aberta",
      description: "Mesa 03 - R$ 156,80",
      time: "10min atrás",
      icon: "🍻",
      color: "#F59E0B",
    },
    {
      name: "Evento especial",
      description: "Happy Hour - 50% drinks",
      time: "40min atrás",
      icon: "🎉",
      color: "#EC4899",
    },
    {
      name: "Bebida esgotada",
      description: "Whisky Jack Daniels",
      time: "1h atrás",
      icon: "🥃",
      color: "#DC2626",
    },
    {
      name: "Reserva grupo",
      description: "15 pessoas - Sexta 21:00",
      time: "2h atrás",
      icon: "👥",
      color: "#3B82F6",
    },
    {
      name: "Pagamento online",
      description: "R$ 89,90 - PIX aprovado",
      time: "3h atrás",
      icon: "📱",
      color: "#059669",
    },

    // OPERACIONAIS (TODOS OS NEGÓCIOS)
    {
      name: "Relatório gerado",
      description: "Vendas do dia - R$ 3.847,50",
      time: "6h atrás",
      icon: "📊",
      color: "#6366F1",
    },
    {
      name: "Manutenção sistema",
      description: "Backup automático realizado",
      time: "8h atrás",
      icon: "🔧",
      color: "#6B7280",
    },
    {
      name: "Meta batida",
      description: "Vendas semanais +25%",
      time: "12h atrás",
      icon: "🎯",
      color: "#84CC16",
    },
    {
      name: "Novo funcionário",
      description: "Carlos - Início segunda-feira",
      time: "1d atrás",
      icon: "👨‍💼",
      color: "#0EA5E9",
    },
    {
      name: "Aniversário cliente",
      description: "Maria faz aniversário hoje",
      time: "1d atrás",
      icon: "🎂",
      color: "#EC4899",
    },
  ];

  notifications = Array.from({ length: 3 }, () => notifications).flat();

  const Notification = ({
    name,
    description,
    icon,
    color,
    time,
  }: NotificationItem) => {
    return (
      <figure
        className={clsx(
          "relative mx-auto w-full max-w-[400px] cursor-pointer overflow-hidden rounded-xl p-4",
          "transition-all duration-300 ease-in-out hover:scale-[102%] hover:shadow-lg",
          "bg-card/80 border-border border backdrop-blur-sm",
          "shadow-sm hover:shadow-xl",
          "dark:bg-card/80 dark:border-border dark:shadow-none",
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl shadow-md transition-transform duration-300 hover:scale-110"
            style={{ backgroundColor: color }}
          >
            <span className="text-xl">{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-texto truncate text-sm font-semibold">
                {name}
              </span>
              <span className="text-texto/40">·</span>
              <span className="text-texto/40 text-xs whitespace-nowrap">
                {time}
              </span>
            </div>
            <p className="text-texto/80 line-clamp-2 text-sm">{description}</p>
          </div>
        </div>
      </figure>
    );
  };

  return (
    <section id="solucoes" className="bg-fundo py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Tudo que você precisa para{" "}
            <span className="from-cor1 to-cor2 bg-linear-to-r bg-clip-text text-transparent">
              vender e crescer
            </span>{" "}
            em um único lugar
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            Soluções completas para diferentes tipos de negócios, com automação
            e inteligência artificial
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Dashboard Info Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {dashboardInfo.map((item, index) => (
                <Card
                  key={index}
                  className="group bg-card border-border border transition-all duration-300 hover:border-gray-300 hover:shadow-xl dark:hover:border-gray-600"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-12 rounded-xl bg-linear-to-br ${item.gradient} items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-texto text-lg font-bold">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-texto/60 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="relative">
            <div className="relative flex h-[500px] w-full flex-col overflow-hidden rounded-2xl">
              <div className="via-fundo/50 to-fundo pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-transparent" />
              <div className="h-full overflow-y-hidden">
                <div className="space-y-4">
                  <AnimatedList delay={1500}>
                    {notifications.map((item, idx) => (
                      <Notification {...item} key={idx} />
                    ))}
                  </AnimatedList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const reviews = [
    {
      name: "Carlos",
      company: "Pedroso Tecnologia",
      comment: "Eu nunca vi nada assim antes, que plataforma incrível",
      imgCompany: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Mariana",
      company: "Restaurante Sabor & Arte",
      comment:
        "A plataforma revolucionou nosso delivery, vendas aumentaram 40% em um mês",
      imgCompany: "https://avatar.vercel.sh/mariana",
    },
    {
      name: "Ricardo",
      company: "PetLove Center",
      comment:
        "O sistema de agendamentos automatizou nossa rotina, agora temos tempo para focar no atendimento",
      imgCompany: "https://avatar.vercel.sh/ricardo",
    },
    {
      name: "Fernanda",
      company: "Moda Elegante Store",
      comment:
        "Integração perfeita entre PDV e e-commerce, estoque sempre sincronizado",
      imgCompany: "https://avatar.vercel.sh/fernanda",
    },
    {
      name: "Roberto",
      company: "Bar do Roberto",
      comment:
        "As automações de marketing trouxeram clientes novos toda semana, resultado surpreendente",
      imgCompany: "https://avatar.vercel.sh/roberto",
    },
    {
      name: "Juliana",
      company: "Doceria da Jú",
      comment:
        "A IA sugere combinações de produtos que os clientes amam, vendas cruzadas dispararam",
      imgCompany: "https://avatar.vercel.sh/juliana",
    },
    {
      name: "Paulo",
      company: "TechShop Gadgets",
      comment:
        "Relatórios em tempo real nos ajudam a tomar decisões rápidas e precisas",
      imgCompany: "https://avatar.vercel.sh/paulo",
    },
    {
      name: "Camila",
      company: "Beleza & Cia Petshop",
      comment:
        "CRM integrado fez nossa taxa de retenção de clientes saltar de 30% para 75%",
      imgCompany: "https://avatar.vercel.sh/camila",
    },
    {
      name: "Diego",
      company: "Pizzaria Forno Italiano",
      comment:
        "Sistema de delivery com rastreamento em tempo real eliminou 90% dos problemas de entrega",
      imgCompany: "https://avatar.vercel.sh/diego",
    },
    {
      name: "Larissa",
      company: "Boutique Fashion",
      comment:
        "App mobile personalizado aumentou nossas vendas online em 3x, os clientes adoram a experiência",
      imgCompany: "https://avatar.vercel.sh/larissa",
    },
  ];
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);
  const ReviewCard = ({
    imgCompany,
    name,
    company,
    comment,
  }: {
    imgCompany: string;
    name: string;
    company: string;
    comment: string;
  }) => {
    return (
      <figure
        className={clsx(
          "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          // light styles
          "border-border/1 bg-white/30 hover:bg-white/40",
          // dark styles
          "border-border dark:bg-gray-50/10 dark:hover:bg-gray-50/15",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="rounded-full"
            width="32"
            height="32"
            alt=""
            src={imgCompany}
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{company}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm">{comment}</blockquote>
      </figure>
    );
  };

  return (
    <section id="depoimentos" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 z-0">
        <Image
          src={depoimentosBg}
          alt="Imagem de Fundo"
          priority
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay com blur condicional - transparente no light */}
        <div className="absolute inset-0 bg-white/0 backdrop-blur-sm dark:bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl">
            Quem usa, cresce e recomenda
          </h2>
          <p className="mt-4 text-lg text-white/80 drop-shadow-md">
            Veja como negócios reais estão usando nossa plataforma para inovar e
            vender mais.
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>

        {/* Gradientes condicionais para os lados */}
        <div className="dark:from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent"></div>
        <div className="dark:from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-transparent"></div>
      </div>
    </section>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      question: 'O que é uma plataforma "modular"?',
      answer:
        'Significa que você paga apenas pelo que usa. Você começa com o Nível 1 (PDV) e pode "conectar" novos módulos como Delivery, CRM ou IA (Níveis 2, 3, 4) conforme seu negócio cresce, sem precisar trocar de sistema.',
    },
    {
      question: "Como funciona o White Label?",
      answer:
        "Com nosso plano White Label, você pode remover totalmente nossa marca, usar seu próprio domínio (ex: app.suaagencia.com), seu logo e suas cores. Você revende a plataforma como se fosse sua.",
    },
    {
      question: 'O que é "multi-tenant"?',
      answer:
        'É a arquitetura que nos permite operar vários "inquilinos" (empresas) em uma única instalação do software, mantendo os dados de cada um totalmente isolados e seguros. Isso nos dá escalabilidade e reduz custos para você.',
    },
    {
      question: "Preciso de um desenvolvedor para usar?",
      answer:
        "De forma alguma. A plataforma é projetada para o usuário final (lojistas, gerentes). A configuração é simples e intuitiva. A sessão técnica é voltada para nossos parceiros White Label.",
    },
    {
      question: "A IA realmente ajuda a vender?",
      answer:
        "Sim. Nossa IA analisa seu histórico de vendas para sugerir promoções, identificar clientes em risco (churn), automatizar o atendimento e até otimizar suas campanhas de tráfego pago para atrair clientes mais lucrativos.",
    },
  ];
  const FaqItem = ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-gray-200">
        <button
          className="flex w-full items-center justify-between py-5 text-left"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-texto text-lg font-medium">{question}</span>
          <ChevronDown
            className={`text-texto h-6 w-6 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pr-12 pb-5"
            >
              <p className="text-texto/60 text-base">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      id="faq"
      className="bg-fundo grid grid-cols-1 py-20 sm:py-28 lg:grid-cols-2"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-texto text-center text-3xl font-extrabold sm:text-4xl">
          Dúvidas Frequentes
        </h2>
        <div className="mt-12">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
      <div className="relative hidden lg:block">
        {/* Floating Cards - Decorative */}
        <div className="border-border bg-card absolute top-8 left-8 z-10 rounded-xl border p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-texto/60 text-xs">Vendas hoje</p>
              <p className="text-texto text-lg font-bold">R$ 12.450</p>
            </div>
          </div>
        </div>

        <div className="border-border bg-card absolute right-6 bottom-6 z-10 rounded-xl border p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-texto/60 text-xs">Novos pedidos</p>
              <p className="text-texto text-lg font-bold">+47</p>
            </div>
          </div>
        </div>

        <Image
          src="/images/hero_section_image.png"
          alt="Dashboard do sistema"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="from-cor1 to-cor2 bg-linear-to-r py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {/* Lado Esquerdo - Texto sobre a plataforma */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-4xl leading-tight font-bold text-white lg:text-5xl">
                Pronto para <br />
                <TypingAnimation
                  words={["transformar", "aumentar", "maximizar", "expandir"]}
                  loop
                />{" "}
                <br /> seu negócio?
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-white/90">
                Junte-se a mais de{" "}
                <span className="font-bold text-white">500 empresas</span> que
                já estão usando nossa plataforma para automatizar processos,
                aumentar vendas e oferecer a melhor experiência para seus
                clientes.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Seja um restaurante, petshop, loja ou bar, temos a solução
                perfeita para o seu tipo de negócio. Preencha o formulário e em
                breve nossa equipe entrará em contato para apresentar a
                plataforma.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-white/90">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">
                    Configuração rápida e suporte especializado
                  </span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">
                    Primeiros 30 dias gratuitos para teste
                  </span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">
                    Planos que crescem com seu negócio
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lado Direito - Formulário de Contato */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:shadow-3xl border-0 shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6 text-center">
                <div className="bg-cor1/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <MessageCircle className="text-cor1 h-6 w-6" />
                </div>
                <h1 className="text-texto text-2xl font-bold lg:text-3xl">
                  Solicite uma Demonstração
                </h1>
                <p className="text-texto/60 mt-2">
                  Preencha os dados e nossa equipe entrará em contato
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Nome */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    className="focus:border-cor1 focus:ring-cor1 border-gray-300 bg-white text-gray-900 transition-colors placeholder:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label
                    htmlFor="whatsapp"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    WhatsApp *
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    className="focus:border-cor1 focus:ring-cor1 border-gray-300 bg-white text-gray-900 transition-colors placeholder:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                  />
                </div>

                {/* Nome da Empresa */}
                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nome da Empresa *
                  </Label>
                  <Input
                    id="company"
                    placeholder="Nome do seu estabelecimento"
                    className="focus:border-cor1 focus:ring-cor1 border-gray-300 bg-white text-gray-900 transition-colors placeholder:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="focus:border-cor1 focus:ring-cor1 border-gray-300 bg-white text-gray-900 transition-colors placeholder:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                  />
                </div>

                {/* Por onde conheceu? */}
                <div className="space-y-2">
                  <Label
                    htmlFor="source"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Por onde conheceu a Chefros? *
                  </Label>
                  <Select>
                    <SelectTrigger className="focus:border-cor1 focus:ring-cor1 w-full border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <span className="text-gray-500 dark:text-gray-400">
                        Selecione uma opção
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                      <SelectItem
                        value="REDES"
                        className="focus:bg-cor1/10 focus:text-cor1"
                      >
                        Anúncio nas redes sociais
                      </SelectItem>
                      <SelectItem
                        value="CONHECIDO"
                        className="focus:bg-cor1/10 focus:text-cor1"
                      >
                        Indicação de um conhecido
                      </SelectItem>
                      <SelectItem
                        value="OPERACAO"
                        className="focus:bg-cor1/10 focus:text-cor1"
                      >
                        Já utilizo em outra operação
                      </SelectItem>
                      <SelectItem
                        value="OUTRO"
                        className="focus:bg-cor1/10 focus:text-cor1"
                      >
                        Outro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkbox Termos */}
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    className="data-[state=checked]:bg-cor1 data-[state=checked]:border-cor1 dark:data-[state=checked]:bg-cor1 border-gray-300 dark:border-gray-600"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                  >
                    Concordo com os{" "}
                    <Link
                      href="#"
                      className="text-cor1 hover:text-cor2 underline transition-colors"
                    >
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link
                      href="#"
                      className="text-cor1 hover:text-cor2 underline transition-colors"
                    >
                      Política de Privacidade
                    </Link>{" "}
                    *
                  </Label>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="bg-cor1 hover:bg-cor2 h-12 w-full cursor-pointer py-3 text-base font-semibold tracking-wider text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                  Solicitar Demonstração
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-muted/30 py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href="#hero" className="relative block h-16 w-16">
                <Image
                  src="/images/Logotipo_nobg.png"
                  alt="Chefros"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>
              <h3 className="text-xl font-bold">
                <span className="from-cor1 to-cor2 bg-linear-to-tr bg-clip-text text-transparent">
                  Chefros
                </span>
                Platform
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              A plataforma completa para transformar seu negócio físico em
              digital.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Produto</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Planos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Segurança
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  White Label
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">Empresa</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Suporte</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Ajuda
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="from-cor1 to-cor2 bg-linear-to-tr bg-clip-text text-transparent">
              Chefros
            </span>
            Platform. Todos os direitos reservados.
          </p>
          {/* <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-smooth">
              Privacidade
            </a>
            <a href="#" className="hover:text-foreground transition-smooth">
              Termos
            </a>
            <a href="#" className="hover:text-foreground transition-smooth">
              Cookies
            </a>
          </div> */}

          <Link href="https://www.teczed.com.br">
            <Image
              src="/images/TecZed_Triangle+TECZED.svg"
              alt="TecZed Solutions"
              width={48}
              height={48}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

// --- Componente Principal da Aplicação ---

export default function App() {
  return (
    <div className="bg-fundo text-texto antialiased">
      <Header />
      <main>
        <HeroSection />
        <PricingSection />
        <InfoDashboardSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
