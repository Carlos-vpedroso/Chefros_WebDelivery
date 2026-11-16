import { Edit, Plus, Trash2 } from "lucide-react";
import { NextPage } from "next";
import { useTheme } from "next-themes";

const usuarios = [
  {
    id: 1,
    nome: "Carlos Silva",
    empresa: "Restaurante Sabor & Arte",
    status: "Ativo",
    tipo: "Admin",
  },
  {
    id: 2,
    nome: "Maria Santos",
    empresa: "Bar do João",
    status: "Ativo",
    tipo: "Gerente",
  },
  {
    id: 3,
    nome: "João Pereira",
    empresa: "Pizzaria Bella",
    status: "Ativo",
    tipo: "Admin",
  },
  {
    id: 4,
    nome: "Ana Costa",
    empresa: "Café Moments",
    status: "Inativo",
    tipo: "Usuário",
  },
];

const Usuarios:NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Usuário
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
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className={
                    darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {usuario.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {usuario.empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.status === "Ativo"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {usuario.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {usuario.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
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

export default Usuarios;
