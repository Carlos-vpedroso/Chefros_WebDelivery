"use client";

import { useSearchParams } from "next/navigation";
import HomeDashboard from "./_components/HomeDashboard";
import CardapioDashboard from "./_components/CardapioDashboard";
import ProdutosDashboard from "./_components/ProdutosDashboard";
import MesasDashboard from "./_components/MesasDashboard";
import CategoriasDashboard from "./_components/CategoriasDashboard";
import ComboAndPromo from "./_components/ComboAndPromo";
import ServicosDashboard from "./_components/ServicosDashboard";
import RelatoriosDashboard from "../relatorios/_components/RelatoriosDashboard";

// ============= COMPONENTE PRINCIPAL =============
const DashboardRestaurante = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("page");
  const renderContent = () => {
    switch (activeTab) {
      case "Mesas":
        return <MesasDashboard />;
      case "Categorias":
        return <CategoriasDashboard />;
      case "Produtos":
        return <ProdutosDashboard />;
      case "Servicos":
        return <ServicosDashboard />;
      case "ComboAndPromo":
        return <ComboAndPromo />;
      case "Catalogo":
        return <CardapioDashboard />;
      case "Relatorios":
        return <RelatoriosDashboard />;
      default:
        return <HomeDashboard />;
    }
  };

  return <>{renderContent()}</>;
};

export default DashboardRestaurante;
