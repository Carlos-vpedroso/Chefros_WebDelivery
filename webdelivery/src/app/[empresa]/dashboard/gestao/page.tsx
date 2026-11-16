"use client"

import { useSearchParams } from "next/navigation";
// import HomeDashboard from "./_components/_sales/_delivery/HomeDashboard";


// ============= COMPONENTE PRINCIPAL =============
const DashboardGestao = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("page");
  const renderContent = () => {
    switch (activeTab) {
      case "Estoque":
        return <h1>estoque</h1>
      default:
        return <h1>estoque</h1>;
    }
  };

  return <>{renderContent()}</>;
};

export default DashboardGestao;
