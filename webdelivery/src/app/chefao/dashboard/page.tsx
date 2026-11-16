"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Package,
  DollarSign,
  HeadphonesIcon,
  Settings,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import Configuracoes from "./_components/Configuracoes";
import Suporte from "./_components/Suporte";
import Faturamento from "./_components/Faturamento";
import Modulos from "./_components/Modulos";
import Planos from "./_components/Planos";
import Dashboard from "./_components/Dashboard";
import Usuarios from "./_components/Usuarios";
import Empresas from "./_components/Empresas";
import { Button } from "@/components/ui/button";

const PedrosoDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const darkMode = theme === "dark";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "empresas", icon: Building2, label: "Empresas" },
    { id: "usuarios", icon: Users, label: "Usuários" },
    { id: "planos", icon: CreditCard, label: "Planos" },
    { id: "modulos", icon: Package, label: "Módulos" },
    { id: "faturamento", icon: DollarSign, label: "Faturamento" },
    { id: "suporte", icon: HeadphonesIcon, label: "Suporte" },
    { id: "configuracoes", icon: Settings, label: "Configurações" },
  ];

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Função para fechar a sidebar no mobile ao clicar em um item
  const handleMenuItemClick = (id: string) => {
    setActiveSection(id);
    // Fecha a sidebar apenas se não estivermos em telas grandes (onde ela é fixa)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "empresas":
        return <Empresas />;
      case "usuarios":
        return <Usuarios />;
      case "planos":
        return <Planos />;
      case "modulos":
        return <Modulos />;
      case "faturamento":
        return <Faturamento />;
      case "suporte":
        return <Suporte />;
      case "configuracoes":
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
      } transition-colors duration-200`}
    >
      {/* **NOVO**: Overlay para fechar a sidebar no mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-white"
        } z-40 transform border-r transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarOpen ? "lg:w-64" : "lg:w-20"} w-64`}
      >
        <div className="flex items-center justify-between p-4 py-6 lg:px-4">
          {/* Logo - agora só aparece se a sidebar estiver aberta */}
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-cyan-500 to-green-600"></div>
              <span className="text-lg font-bold">Pedroso Tech</span>
            </div>
          )}
          {/* Botão de Toggle/Fechar */}
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-4 rounded-lg${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
            } ${!sidebarOpen && "lg:w-full"} `}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="outline"
                onClick={() => handleMenuItemClick(item.id)}
                className={`mb-2 flex w-full items-center justify-start gap-3 rounded-lg px-3 py-3 transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-slate-700 hover:bg-slate-100"
                } ${!sidebarOpen && "lg:justify-center"} `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </aside>
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <header
          className={`${
            darkMode
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
          } sticky top-0 z-20 border-b`}
        >
          {/* **MUDANÇA**: Padding responsivo (menor no mobile) */}
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              {/* **NOVO**: Botão Hamburguer para abrir a sidebar no mobile */}
              <Button
                onClick={() => setSidebarOpen(true)}
                className={`rounded-lg p-2 lg:hidden ${
                  darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                }`}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* **MUDANÇA**: Search bar agora é responsiva */}
              <div
                className={`hidden items-center gap-3 rounded-lg px-4 py-2 sm:flex ${
                  darkMode ? "bg-slate-700" : "bg-slate-100"
                }`}
              >
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className={`w-full bg-transparent outline-none sm:w-64 ${
                    darkMode ? "placeholder-slate-400" : "placeholder-slate-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setTheme(darkMode ? "light" : "dark")}
                className={`rounded-lg p-2 ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-100 hover:bg-slate-200"
                } transition-colors`}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                className={`relative rounded-lg p-2 ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-100 hover:bg-slate-200"
                } transition-colors`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600"></div>
                {/* **MUDANÇA**: Esconde nome/título em telas pequenas */}
                <div className="hidden md:block">
                  <p className="font-medium">Admin Pedroso</p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Administrador
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        {/* **MUDANÇA**: Padding responsivo (menor no mobile) */}
        <main className="p-4 lg:p-8">{renderContent()}</main>
      </div>

      {/* Modal Example (Já está responsivo, mas adicionei botões empilháveis) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-white"
            } w-full max-w-2xl rounded-xl p-6 shadow-xl`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Nova Empresa</h3>
              <button
                onClick={() => setShowModal(false)}
                className={`rounded-lg p-2 ${
                  darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Restaurante XYZ"
                  className={`w-full rounded-lg border px-4 py-2 ${
                    darkMode
                      ? "border-slate-600 bg-slate-700 text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Plano
                </label>
                <select
                  className={`w-full rounded-lg border px-4 py-2 ${
                    darkMode
                      ? "border-slate-600 bg-slate-700 text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                >
                  <option>Gratuito</option>
                  <option>Básico</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
              </div>

              {/* **MUDANÇA**: Botões empilhados no mobile (flex-col) e lado a lado (sm:flex-row) */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 rounded-lg border px-4 py-2 ${
                    darkMode
                      ? "border-slate-600 hover:bg-slate-700"
                      : "border-slate-300 hover:bg-slate-50"
                  } transition-colors`}
                >
                  Cancelar
                </button>
                <button className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
                  Criar Empresa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedrosoDashboard;
