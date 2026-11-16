import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { NextPage } from "next";
import { useTheme } from "next-themes";

const empresas = [
  {
    id: 1,
    nome: "Restaurante Sabor & Arte",
    status: "Ativa",
    plano: "Premium",
    data: "15/08/2024",
  },
  {
    id: 2,
    nome: "Bar do João",
    status: "Ativa",
    plano: "Básico",
    data: "22/09/2024",
  },
  {
    id: 3,
    nome: "Pizzaria Bella",
    status: "Ativa",
    plano: "Premium",
    data: "03/10/2024",
  },
  {
    id: 4,
    nome: "Café Moments",
    status: "Inativa",
    plano: "Gratuito",
    data: "12/07/2024",
  },
];

const Empresas: NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestão de Empresas</h2>
        <button
          onClick={() => console.log(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Empresa
        </button>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } rounded-xl border shadow-sm overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-slate-700/50" : "bg-slate-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Nome da Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {empresas.map((empresa) => (
                <tr
                  key={empresa.id}
                  className={
                    darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{empresa.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        empresa.status === "Ativa"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {empresa.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {empresa.plano}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {empresa.data}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Empresas;
