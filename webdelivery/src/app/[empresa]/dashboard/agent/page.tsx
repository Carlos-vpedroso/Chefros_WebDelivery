"use client";

import { useSearchParams } from "next/navigation";

// ============= COMPONENTE PRINCIPAL =============
const AgentPage = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("page");

  const renderContent = () => {
    switch (activeTab) {
      
      default:
        return <h1>Agent IA</h1>;
    }
  };

  return <>{renderContent()}</>;
};

export default AgentPage;
