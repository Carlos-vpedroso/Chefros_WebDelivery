import { NextPage } from "next";
import { useTheme } from "next-themes";

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

const Suporte: NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Suporte e Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            Tickets Abertos
          </p>
          <p className="text-3xl font-bold mt-2 text-orange-500">8</p>
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
            Em Análise
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-500">12</p>
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
            Resolvidos Hoje
          </p>
          <p className="text-3xl font-bold mt-2 text-green-500">5</p>
        </div>
      </div>

      <div className="space-y-4">
        {suporteTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`${
              darkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            } p-6 rounded-xl border shadow-sm`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{ticket.empresa}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "aberto"
                        ? "bg-orange-500/10 text-orange-500"
                        : ticket.status === "em análise"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  {ticket.assunto}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Aberto em {ticket.data}
                </p>
              </div>
              {ticket.status !== "resolvido" && (
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Responder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suporte;
