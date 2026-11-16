import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import SidebarMenu from "./_components/SideBarMenu";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";

interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ empresa: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { empresa } = await params;
  return (
    <EmployeeProvider empresaSlug={empresa}>
      <DashboardProvider empresaSlug={empresa}>
        <div className="bg-fundo text-texto min-h-screen">
          {/* Sidebar é client component */}
          <SidebarMenu />

          {/* Conteúdo principal */}
          <div className="transition-all duration-300 lg:ml-64">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>
        </div>
      </DashboardProvider>
    </EmployeeProvider>
  );
}
