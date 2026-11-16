import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { Permissions } from "@/types/employee";
import { hasPermission } from "@/lib/permissions";

// Mapeamento de rotas para permissões
export const routePermissions: Record<string, string> = {
  "/dashboard/pdv": "pdv",
  "/dashboard/pedidos": "pedidos",
  "/dashboard/vendas": "vendas",
  "/dashboard/vendas/mesa": "vendas.mesas",
  "/dashboard/delivery": "delivery",
  "/dashboard/gestao": "gestao",
  "/dashboard/relatorios": "relatorios",
  "/dashboard/configuracoes": "configuracoes",

  // Permissões específicas para subrotas (para melhor granularidade)
  "/dashboard/vendas?page=Mesas": "vendas.mesas",
  "/dashboard/vendas?page=Categorias": "vendas.categorias",
  "/dashboard/vendas?page=Produtos": "vendas.produtos",
  "/dashboard/vendas?page=Servicos": "vendas.servicos",
  "/dashboard/vendas?page=ComboAndPromo": "vendas.combos",
  "/dashboard/vendas?page=Catalogo": "vendas.catalogo",
  "/dashboard/delivery?page=Pedidos": "delivery.pedidos",
  "/dashboard/gestao?page=Estoque": "gestao.estoque",
  "/dashboard/relatorios?page=Vendas": "relatorios.vendas",
  "/dashboard/relatorios?page=MaisVendidos": "relatorios.maisvendidos",
  "/dashboard/relatorios?page=MenosVendidos": "relatorios.menosvendidos",
  "/dashboard/relatorios?page=FaturamentoCategoria":
    "relatorios.faturamentocategoria",
  "/dashboard/configuracoes?page=Funcionarios": "configuracoes.funcionarios",
  "/dashboard/configuracoes?page=Horarios": "configuracoes.horarios",
  "/dashboard/configuracoes?page=Assinatura": "configuracoes.assinatura",
};

function getRequiredPermission(
  req: NextRequest,
  empresaSlug: string,
): string | null {
  const { pathname, search } = req.nextUrl;

  // Remove o slug da empresa do caminho
  const cleanPath = pathname.replace(`/${empresaSlug}`, "");

  // Cria a chave completa (path + query params)
  const fullPath = search ? `${cleanPath}${search}` : cleanPath;

  // Tenta encontrar uma correspondência exata primeiro
  if (routePermissions[fullPath]) {
    return routePermissions[fullPath];
  }

  // Se não encontrar, procura pelo caminho base (sem query params)
  const matchedRoute = Object.keys(routePermissions)
    .sort((a, b) => b.length - a.length)
    .find((route) => {
      const [routePath] = route.split("?");
      return cleanPath.startsWith(routePath);
    });

  return matchedRoute ? routePermissions[matchedRoute] : null;
}

export async function employeeMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathParts = pathname.split("/").filter(Boolean);
  const empresaSlug = pathParts[0];
  const token = req.cookies.get(`employee_access_token_${empresaSlug}`)?.value;

  if (!token) {
    return NextResponse.redirect(new URL(`/${empresaSlug}/login`, req.url));
  }
  try {
    const secret = new TextEncoder().encode(process.env.EMPLOYEE_TOKEN);
    const { payload } = await jose.jwtVerify(token, secret);
    const permissions = payload.permissions as Permissions;
    const role = payload.role as string;

    // 🔓 admin ou fullaccess
    if (role === "administrador" || permissions?.fullaccess) {
      return null;
    }
    const requiredPermission = getRequiredPermission(req, empresaSlug);

    // rota pública
    if (!requiredPermission) {
      return null;
    }

    // 🚫 não tem permissão
    if (!hasPermission(permissions, requiredPermission)) {
      return NextResponse.redirect(
        new URL(`/${empresaSlug}/dashboard/acesso-negado`, req.url),
      );
    }

    return null;
  } catch {
    return NextResponse.redirect(new URL(`/${empresaSlug}/login`, req.url));
  }
}
