"use client";

import { useSearchParams } from "next/navigation";
import RelatoriosDashboard from "./_components/RelatoriosDashboard";
import ProdutosMaisVendidosDashboard from "./_components/MaisVendidos";
import ProdutosMenosVendidosDashboard from "./_components/MenosVendidos";
import FaturamentoPorCategoriaDashboard from "./_components/FaturamentoCategoria";

// ============= COMPONENTE PRINCIPAL =============
const DashboardRestaurante = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("page");
  const renderContent = () => {
    switch (activeTab) {
      case "Vendas":
        return <RelatoriosDashboard />;
      case "MaisVendidos":
        return <ProdutosMaisVendidosDashboard />;
      case "MenosVendidos":
        return <ProdutosMenosVendidosDashboard />;
      case "FaturamentoCategoria":
        return <FaturamentoPorCategoriaDashboard />;
      default:
        return <h1>ola</h1>;
    }
  };

  return <>{renderContent()}</>;
};

export default DashboardRestaurante;
