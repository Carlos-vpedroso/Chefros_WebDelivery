"use client";

import { useSearchParams } from "next/navigation";
import FuncionariosDashboard from "./_components/FuncionariosDashboard";
import ConfiguracoesDashboard from "./_components/ConfiguracoesDashboard";
import HorariosDashboard from "./_components/HorariosDashboard";
import SubscriptionDashboard from "./_components/SubscriptionDashboard";
// ============= COMPONENTE PRINCIPAL =============
const DashboardConfiguracao = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("page");

  const renderContent = () => {
    switch (activeTab) {
      case "Horarios":
        return <HorariosDashboard />;
      case "Funcionarios":
        return <FuncionariosDashboard />;
      case "Assinatura":
        return <SubscriptionDashboard />;
      default:
        return <ConfiguracoesDashboard />;
    }
  };

  return <>{renderContent()}</>;
};

export default DashboardConfiguracao;
