import { NextPage } from "next";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const Configuracoes: NextPage = () => {
  const { theme, setTheme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações</h2>

      <div
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } p-6 rounded-xl border shadow-sm`}
      >
        <h3 className="text-lg font-semibold mb-4">Dados da Conta</h3>
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Nome
            </label>
            <input
              type="text"
              defaultValue="Admin Pedroso"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              defaultValue="admin@pedrosotecnologia.com"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } p-6 rounded-xl border shadow-sm`}
      >
        <h3 className="text-lg font-semibold mb-4">Preferências</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Tema Escuro</p>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Alternar entre modo claro e escuro
            </p>
          </div>
          <button
            onClick={() => setTheme(darkMode ? "light" : "dark")}
            className={`p-2 rounded-lg ${
              darkMode ? "bg-slate-700" : "bg-slate-100"
            } hover:opacity-80 transition-opacity`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } p-6 rounded-xl border shadow-sm`}
      >
        <h3 className="text-lg font-semibold mb-4 text-red-500">
          Zona de Perigo
        </h3>
        <p
          className={`text-sm mb-4 ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Ações irreversíveis que afetam toda a plataforma
        </p>
        <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Resetar Sistema
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
