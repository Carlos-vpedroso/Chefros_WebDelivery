"use client";

import { useSearchParams } from "next/navigation";
import PainelPedidosDelivery from "./_components/Pedidos";
import DeliveryDashboard from "./_components/DeliveryDashboard";

// ============= COMPONENTE PRINCIPAL =============
const DashboardDelivery = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("page");

  const renderContent = () => {
    switch (activeTab) {
      case "Pedidos":
        return <PainelPedidosDelivery />;
      default:
        return <DeliveryDashboard />;
    }
  };

  return <>{renderContent()}</>;
};

export default DashboardDelivery;
