"use client";

import { ReactNode } from "react";

interface HeaderProps {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  btns?: ReactNode;
}

export function HeaderDashboard({ icon, title, subtitle, btns }: HeaderProps) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-fundo2/80 text-texto rounded-lg p-2 ">
              <Icon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-texto">{title}</h1>
              <p className="text-texto/60 text-sm">{subtitle}</p>
            </div>
          </div>
          {btns}
        </div>
      </div>
    </div>
  );
}
