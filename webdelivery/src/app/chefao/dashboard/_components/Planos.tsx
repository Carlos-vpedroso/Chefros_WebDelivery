import { CheckCircle2 } from "lucide-react";
import { NextPage } from "next";
import { useTheme } from "next-themes";

const planos = [
  {
    nome: "Gratuito",
    preco: 0,
    usuarios: 1,
    modulos: 2,
    limite: "100 pedidos/mês",
  },
  {
    nome: "Básico",
    preco: 99,
    usuarios: 3,
    modulos: 5,
    limite: "500 pedidos/mês",
  },
  {
    nome: "Premium",
    preco: 199,
    usuarios: 10,
    modulos: 10,
    limite: "Ilimitado",
  },
  {
    nome: "Enterprise",
    preco: 499,
    usuarios: "Ilimitado",
    modulos: "Todos",
    limite: "Ilimitado",
  },
];

const Planos: NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Planos e Assinaturas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planos.map((plano, idx) => (
          <div
            key={idx}
            className={`${
              darkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            } p-6 rounded-xl border shadow-sm hover:shadow-lg transition-shadow`}
          >
            <h3 className="text-xl font-bold mb-2">{plano.nome}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">R$ {plano.preco}</span>
              <span
                className={`${darkMode ? "text-slate-400" : "text-slate-600"}`}
              >
                /mês
              </span>
            </div>
            <div
              className={`space-y-2 mb-6 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {plano.usuarios} usuários
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {plano.modulos} módulos
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {plano.limite}
              </p>
            </div>
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Editar Plano
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planos;
