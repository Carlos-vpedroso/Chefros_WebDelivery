export const Colors = {
  // Tema escuro
  dark: {
    background: "#0F1115", // Gunmetal — Fundo base
    surface: "#181B20", // Charcoal — Camadas, cards, painéis
    border: "#272A31", // Graphite — Bordas e divisores
    textPrimary: "#F8FAFC", // Branco gelo — Texto principal
    textSecondary: "#A1A1AA", // Cinza suave — Texto secundário
    primary: "#06B6D4", // Ciano tech — Ação primária
    secondary: "#A3E635", // Verde-lima — Ação secundária
    success: "#16A34A", // Verde folha — Sucesso
    error: "#EF4444", // Vermelho tomate — Erro
    warning: "#FACC15", // Amarelo quente — Aviso
    accent: "#FB923C", // Laranja queimado — Brand Accent
  },

  // Tema claro
  light: {
    background: "#F9FAFB", // Branco gelo — Fundo base
    surface: "#FFFFFF", // Branco puro — Cards, painéis
    border: "#E5E7EB", // Cinza claro — Bordas e linhas
    textPrimary: "#111827", // Preto suave — Texto principal
    textSecondary: "#6B7280", // Cinza médio — Texto secundário
    primary: "#06B6D4", // Ciano tech — Ação primária
    secondary: "#84CC16", // Verde-lima — Ação secundária
    success: "#16A34A", // Verde folha — Sucesso
    error: "#DC2626", // Vermelho tomate — Erro
    warning: "#FBBF24", // Amarelo quente — Aviso
    accent: "#FB923C", // Laranja suave — Brand Accent
  },

  // Cores fixas (independem do tema)
  shared: {
    transparent: "transparent",
    black: "#000000",
    white: "#FFFFFF",
  },
};

export type ThemeMode = keyof typeof Colors;
