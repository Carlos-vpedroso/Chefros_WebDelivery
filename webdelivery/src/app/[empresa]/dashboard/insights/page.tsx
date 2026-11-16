"use client";

import { useSearchParams } from "next/navigation";

// ============= COMPONENTE PRINCIPAL =============
const InsightsPage = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("page");

  const renderContent = () => {
    switch (activeTab) {
      default:
        return <h1>Insights</h1>;
    }
  };

  return <>{renderContent()}</>;
};

export default InsightsPage;
