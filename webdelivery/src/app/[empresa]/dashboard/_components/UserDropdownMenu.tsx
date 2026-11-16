"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Zap, ChevronDown, User2 } from "lucide-react";
import { Business } from "@/types/business";
import { UsuarioFuncionario } from "@/types/users";
import { useTheme } from "next-themes";
import { capitalize, capitalizeWords } from "@/lib/utils";

export default function UserDropdownMenu({
  handleLogout,
  employee,
}: {
  handleLogout: () => void;
  employee: UsuarioFuncionario;
  business: Business | null;
}) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-texto hover:bg-sidebar-accent/50 flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="from-cor1 to-cor2 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white">
              <User2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {employee?.name || "Administrador"}
              </span>
              <span className="text-xs text-texto/60">{capitalize(employee.role)}</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="ml-4 w-56">
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" /> Perfil
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          <Zap className="mr-2 h-4 w-4" /> Alterar Tema
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
