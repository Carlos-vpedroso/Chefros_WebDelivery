import { Package } from "lucide-react";
import { NextPage } from "next";
import { useTheme } from "next-themes";

const modulos = [
  "Consumo no local",
  "Pedidos por QR Code",
  "Dashboard de gestão",
  "Controle de garçons",
  "Gestão de mesas",
  "Relatórios avançados",
  "Integração delivery",
  "App mobile",
];

const Modulos: NextPage = () => {
  const { theme } = useTheme();

  const darkMode = theme === "dark";
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Módulos Disponíveis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modulos.map((modulo, idx) => (
          <div
            key={idx}
            className={`${
              darkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            } p-6 rounded-xl border shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-medium">{modulo}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={idx < 5}
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modulos;
