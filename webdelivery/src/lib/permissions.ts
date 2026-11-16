import { Permissions } from "@/types/employee";

// Para a SIDEBAR
export function canAccessUI(
  permissions: Permissions | undefined,
  permission?: string,
): boolean {
  if (!permissions) return false;

  // 🔑 acesso total
  if (permissions.fullaccess) return true;

  // 🔓 item sem permissão → visível
  if (!permission) return true;

  const value = permission
    .split(".")
    .reduce<any>((acc, key) => acc?.[key], permissions);

  // ✅ true → permitido
  if (value === true) return true;

  // ✅ objeto → módulo pai permitido
  if (typeof value === "object" && value !== null) return true;

  return false;
}

// Para o EMPLOYEE MIDDLEWARE
export function hasPermission(
  permissions: Permissions | undefined,
  permission: string,
): boolean {
  if (!permissions) return false;

  if (permissions.fullaccess) return true;

  const parts = permission.split("."); //["pedidos"] || ["vendas"]

  let current: Permissions | undefined | boolean = permissions;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return false;
    }

    current = current[part];
  }

  return current === true || typeof current === "object";
}
