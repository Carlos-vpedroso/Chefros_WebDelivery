import {
  Building2,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { NextPage } from "next";
import { useTheme } from "next-themes";

const faturamentoData = [
  { mes: "Jan", valor: 45000 },
  { mes: "Fev", valor: 52000 },
  { mes: "Mar", valor: 48000 },
  { mes: "Abr", valor: 61000 },
  { mes: "Mai", valor: 55000 },
  { mes: "Jun", valor: 67000 },
];

const planosDistribuicao = [
  { name: "Gratuito", value: 35, color: "#94a3b8" },
  { name: "Básico", value: 45, color: "#3b82f6" },
  { name: "Premium", value: 15, color: "#8b5cf6" },
  { name: "Enterprise", value: 5, color: "#ec4899" },
];

const empresasRecentes = [
  { nome: "Restaurante Sabor & Arte", plano: "Premium", data: "20/10/2025" },
  { nome: "Bar do João", plano: "Básico", data: "19/10/2025" },
  { nome: "Pizzaria Bella", plano: "Premium", data: "18/10/2025" },
  { nome: "Café Moments", plano: "Gratuito", data: "17/10/2025" },
];

const suporteTickets = [
  {
    id: 1,
    empresa: "Restaurante Sabor & Arte",
    assunto: "Problema com impressora",
    status: "aberto",
    data: "23/10/2025",
  },
  {
    id: 2,
    empresa: "Bar do João",
    assunto: "Dúvida sobre relatórios",
    status: "em análise",
    data: "22/10/2025",
  },
  {
    id: 3,
    empresa: "Pizzaria Bella",
    assunto: "Solicitação de módulo",
    status: "resolvido",
    data: "21/10/2025",
  },
];

const Dashboard: NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Empresas Ativas
              </p>
              <p className="text-3xl font-bold mt-2">127</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">+12%</span>
            <span
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Usuários Registrados
              </p>
              <p className="text-3xl font-bold mt-2">3.452</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">+8%</span>
            <span
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Faturamento Mensal
              </p>
              <p className="text-3xl font-bold mt-2">R$ 67.000</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">+22%</span>
            <span
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              vs mês anterior
            </span>
          </div>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Módulos Ativos
              </p>
              <p className="text-3xl font-bold mt-2">892</p>
            </div>
            <div className="p-3 bg-pink-500/10 rounded-lg">
              <Package className="w-6 h-6 text-pink-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-500">+5%</span>
            <span
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              vs mês anterior
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Evolução do Faturamento
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={faturamentoData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="mes" stroke={darkMode ? "#94a3b8" : "#64748b"} />
              <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1e293b" : "#fff",
                  border: `1px solid ${darkMode ? "#334155" : "#e5e7eb"}`,
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <h3 className="text-lg font-semibold mb-4">Distribuição de Planos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planosDistribuicao}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planosDistribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <h3 className="text-lg font-semibold mb-4">Empresas Recentes</h3>
          <div className="space-y-3">
            {empresasRecentes.map((empresa, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? "bg-slate-700/50" : "bg-slate-50"
                }`}
              >
                <div>
                  <p className="font-medium">{empresa.nome}</p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {empresa.data}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    empresa.plano === "Premium"
                      ? "bg-purple-500/10 text-purple-500"
                      : empresa.plano === "Básico"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {empresa.plano}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } p-6 rounded-xl border shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Suporte Pendente</h3>
            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-medium">
              2 abertos
            </span>
          </div>
          <div className="space-y-3">
            {suporteTickets
              .filter((t) => t.status !== "resolvido")
              .map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-3 rounded-lg border ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{ticket.empresa}</p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        } mt-1`}
                      >
                        {ticket.assunto}
                      </p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
