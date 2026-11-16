import { NextRequest } from "next/server";
import { employeeMiddleware } from "./middlewares/employeeMiddleware";
import { modulesMiddleware } from "./middlewares/modulesMiddleware";

export async function proxy(req: NextRequest) {
  // 1️⃣ JWT Auth (sempre roda primeiro)
  const authResponse = await employeeMiddleware(req);
  if (authResponse) return authResponse;

  // 2️⃣ Modules (só roda se path for de módulo)
  const modulesResponse = await modulesMiddleware(req);
  if (modulesResponse) return modulesResponse;

  // ✅ Caso tudo ok
  return modulesResponse || authResponse;
}

export const config = {
  matcher: ["/:empresa/dashboard/:path*"],
};
