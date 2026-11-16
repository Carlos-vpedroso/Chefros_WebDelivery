import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { ModuleType } from "@/types/modules";

const protectedModules: Record<string, ModuleType> = {
  vendas: "SALES_PDV",
  delivery: "DELIVERY",
  gestao: "INVENTORY_MGMT",
  marketing: "MARKETING",
  insights: "BUSINESS_INTEL",
  crm: "CRM",
  agent: "IA_AGENT",
};

export async function modulesMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathParts = pathname.split("/").filter(Boolean);
  const empresaSlug = pathParts[0];
  const section = pathParts[2];
  const token = req.cookies.get(`employee_access_token_${empresaSlug}`)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const requiredModule = protectedModules[section];
  if (!requiredModule) return null; // rota livre

  try {
    const secret = new TextEncoder().encode(process.env.EMPLOYEE_TOKEN);
    const { payload } = await jose.jwtVerify(token, secret);
    const modules = payload.modules as ModuleType[] | undefined;

    if (!modules?.includes(requiredModule)) {
      return NextResponse.redirect(
        new URL(`/${empresaSlug}/dashboard/acesso-negado`, req.url),
      );
    }

    return null;
  } catch {
    return NextResponse.redirect(
      new URL(`/${empresaSlug}/dashboard/acesso-negado`, req.url),
    );
  }
}
