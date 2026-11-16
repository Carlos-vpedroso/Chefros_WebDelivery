import { NextPage } from "next";
import { useTheme } from "next-themes";

const Faturamento: NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Faturamento e Pagamentos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Total Acumulado
          </p>
          <p className="text-3xl font-bold mt-2">R$ 328.000</p>
        </div>
        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Mês Atual
          </p>
          <p className="text-3xl font-bold mt-2">R$ 67.000</p>
        </div>
        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Comparativo
          </p>
          <p className="text-3xl font-bold mt-2 text-green-500">+22%</p>
        </div>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        } p-6 rounded-xl border shadow-sm`}
      >
        <h3 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-slate-700/50" : "bg-slate-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr
                className={
                  darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  Restaurante Sabor & Arte
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Premium</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  R$ 199,00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">20/10/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                    Pago
                  </span>
                </td>
              </tr>
              <tr
                className={
                  darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">Bar do João</td>
                <td className="px-6 py-4 whitespace-nowrap">Básico</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  R$ 99,00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">19/10/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                    Pago
                  </span>
                </td>
              </tr>
              <tr
                className={
                  darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">Pizzaria Bella</td>
                <td className="px-6 py-4 whitespace-nowrap">Premium</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  R$ 199,00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">18/10/2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
                    Pendente
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Faturamento;
