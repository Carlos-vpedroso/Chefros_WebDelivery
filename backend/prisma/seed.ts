import { BillingCycle, ModuleType } from "@prisma/client";
import prisma from "../src/config/prisma";
const mockPlans: {
  name: string;
  slug: string;
  price: number;
  stripePriceId: string;
  stripeProductId: string;
  billingCycle: BillingCycle;
  features: string[];
  isActive: boolean;
  modules: ModuleType[];
}[] = [
  {
    name: "Intermediário",
    slug: "nivel-1",
    price: 199,
    stripePriceId: "price_1SpCctClFpaMSjzOsN297VxU",
    stripeProductId: "prod_TmmBqsLEse5IsO",
    billingCycle: BillingCycle.MONTHLY,
    features: [
      "PDV - Sistema de Caixa",
      "Catálogo/Cardápio online",
      "Gestão de Produtos e Categorias",
      "Controle de Vendas e Faturamento",
      "Relatórios de Vendas",
      "Suporte Simples",
      "Emissão de Comprovantes",
      "Delivery e Venda Online",
    ],
    isActive: true,
    modules: ["SALES_PDV", "ONLINE_STORE"],
  },
  {
    name: "Intermediário Anual",
    slug: "nivel-1-anual",
    price: 150,
    stripePriceId: "price_1SpZnkClFpaMSjzOPw2NgouF",
    stripeProductId: "prod_TnA7ni9ADbZR0T",
    billingCycle: BillingCycle.YEARLY,
    features: [
      "PDV - Sistema de Caixa",
      "Catálogo/Cardápio online",
      "Gestão de Produtos e Categorias",
      "Controle de Vendas e Faturamento",
      "Relatórios de Vendas",
      "Suporte Simples",
      "Emissão de Comprovantes",
      "Delivery e Venda Online",
    ],
    isActive: true,
    modules: ["SALES_PDV", "ONLINE_STORE"],
  },
];
async function main() {
  console.log("🌱 Iniciando seed de planos...");

  for (const plan of mockPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: {
        price: plan.price,
        billingCycle: plan.billingCycle,
        features: plan.features,
        isActive: plan.isActive,
      },
      create: {
        name: plan.name,
        slug: plan.slug,
        price: plan.price,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
        billingCycle: plan.billingCycle,
        features: plan.features,
        isActive: plan.isActive,

        // 🔥 cria os módulos do plano
        modules: {
          create: plan.modules.map((module) => ({
            moduleType: module,
          })),
        },
      },
    });
  }

  console.log("✅ Seed de planos concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
