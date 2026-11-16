"use client";

import { useSearchParams } from "next/navigation";

// ============= COMPONENTE PRINCIPAL =============
const MarketingPage = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("page");

  const renderContent = () => {
    switch (activeTab) {
      default:
        return <h1>Marketing</h1>;
    }
  };

  return <>{renderContent()}</>;
};

export default MarketingPage;
