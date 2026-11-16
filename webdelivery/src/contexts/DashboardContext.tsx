"use client";
import { useAuth } from "@/hooks/useAuth";
import { Category, Combo, Product, Promotion } from "@/types/product&category";
import { Service } from "@/types/service";
import { Table, TableStatus } from "@/types/table";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { serviceService } from "@/services/service.service";
import { categoryService } from "@/services/category.service";
import { EmployeeContext } from "./EmployeeContext";
import { tableService } from "@/services/table.service";
import { dashboardService } from "@/services/dashboard.service";
import { Vendas } from "@/types/dashboard";
import { comboAndPromoService } from "@/services/comboAndPromo.service";
import { Order } from "@/types/ticket&order";
import { orderService } from "@/services/order.service";
import { Employee, Role } from "@/types/employee";
import { employeeService } from "@/services/employee.service";
import { roleService } from "@/services/employeeRole.service";
import { getSocket } from "@/lib/socket";
import { Subscription } from "@/types/subscription";
import { subscriptionService } from "@/services/subscription.service";

interface DashboardContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  combos: Combo[];
  setCombos: React.Dispatch<React.SetStateAction<Combo[]>>;
  promos: Promotion[];
  setPromos: React.Dispatch<React.SetStateAction<Promotion[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  employeeRoles: Role[];
  setEmployeeRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  subscription: Subscription | null;
  setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>;
  loading: boolean;
  fetchAnalytics: () => Promise<void>;
  infoVendas: Vendas | null;
  loadingAnalytics: boolean;
}

export const DashboardContext = createContext<DashboardContextType>({
  products: [],
  setProducts: () => undefined,
  services: [],
  setServices: () => undefined,
  categories: [],
  setCategories: () => undefined,
  tables: [],
  setTables: () => undefined,
  combos: [],
  setCombos: () => undefined,
  promos: [],
  setPromos: () => undefined,
  orders: [],
  setOrders: () => undefined,
  employees: [],
  setEmployees: () => undefined,
  employeeRoles: [],
  setEmployeeRoles: () => undefined,
  subscription: null,
  setSubscription: () => undefined,
  loading: false,
  fetchAnalytics: async () => {},
  infoVendas: null,
  loadingAnalytics: false,
});

interface DashboardProviderProps {
  children: ReactNode;
  empresaSlug: string;
}

export const DashboardProvider = ({
  children,
  empresaSlug,
}: DashboardProviderProps) => {
  const { accessToken } = useAuth(EmployeeContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeRoles, setEmployeeRoles] = useState<Role[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [infoVendas, setInfoVendas] = useState<Vendas | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);

  const fetchAll = async () => {
    if (!accessToken || !empresaSlug) return;
    setLoading(true);
    try {
      const [
        productRes,
        serviceRes,
        categoryRes,
        tableRes,
        comboRes,
        promoRes,
        orderRes,
        employeeRes,
        roleRes,
        subscriptionRes
      ] = await Promise.all([
        productService.getAll(empresaSlug),
        serviceService.getAll(empresaSlug),
        categoryService.getAll(empresaSlug),
        tableService.getAll(accessToken, empresaSlug),
        comboAndPromoService.getCombos(empresaSlug),
        comboAndPromoService.getPromos(empresaSlug, accessToken),
        orderService.getAll(empresaSlug, accessToken),
        employeeService.getBySlug(empresaSlug, accessToken),
        roleService.getAllBySlug(empresaSlug, accessToken),
        subscriptionService.getByBusinessSlug(empresaSlug, accessToken),
      ]);

      if (productRes.success && productRes.data) {
        setProducts(productRes.data);
      }
      if (serviceRes.success && serviceRes.data) {
        setServices(serviceRes.data);
      }
      if (categoryRes.success && categoryRes.data) {
        setCategories(categoryRes.data);
      }
      if (tableRes.success && tableRes.data) {
        setTables(tableRes.data);
      }
      if (comboRes.success && comboRes.data) {
        setCombos(comboRes.data);
      }
      if (promoRes.success && promoRes.data) {
        setPromos(promoRes.data);
      }
      if (orderRes.success && orderRes.data) {
        setOrders(orderRes.data);
      }
      if (employeeRes.success && employeeRes.data) {
        setEmployees(employeeRes.data);
      }
      if (roleRes.success && roleRes.data) {
        setEmployeeRoles(roleRes.data);
      }
      if (subscriptionRes.success && subscriptionRes.data) {
        setSubscription(subscriptionRes.data)
      }
    } catch (error) {
      console.error("Erro no fetchAll:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!accessToken || !empresaSlug) return;
    setLoadingAnalytics(true);
    try {
      const [vendasRes] = await Promise.all([
        dashboardService.analyticsVenda(accessToken, empresaSlug),
      ]);

      if (vendasRes.success && vendasRes.data) {
        setInfoVendas(vendasRes.data);
      }
    } catch (error) {
      console.error("Erro no fetchAnalytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (accessToken && empresaSlug) {
      fetchAll();
      fetchAnalytics();
    }
  }, [accessToken, empresaSlug]);

  useEffect(() => {
    if (!accessToken || !empresaSlug) return;
    const socket = getSocket();

    // 1️⃣ Enviar token no handshake
    socket.auth = {
      token: accessToken,
    };

    // 2️⃣ Conectar
    socket.connect();

    // 3️⃣ Quando conectar, entrar na room da empresa
    socket.on("connect", () => {
      socket.emit("join_room", empresaSlug);
    });

    // 4️⃣ Cleanup
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [accessToken, empresaSlug]);

  //Pega os Eventos emitidos do backend via WebSocket
  useEffect(() => {
    const socket = getSocket();

    socket.on("order:new", (order: Order) => {
      setOrders((prev) => [...prev, order]);
    });

    socket.on("order:updateStatus", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );
    });

    socket.on(
      "table:updateStatus",
      (updatedTable: {
        id: string;
        status: TableStatus;
        activeTicket: string | null;
      }) => {
        setTables((prev) =>
          prev.map((table) =>
            table.id === updatedTable.id
              ? {
                  ...table,
                  status: updatedTable.status,
                  activeTicket: updatedTable.activeTicket,
                }
              : table,
          ),
        );
      },
    );

    return () => {
      socket.off("order:new");
      socket.off("order:updateStatus");
    };
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        products,
        setProducts,
        services,
        setServices,
        categories,
        setCategories,
        tables,
        setTables,
        combos,
        setCombos,
        promos,
        setPromos,
        orders,
        setOrders,
        employees,
        setEmployees,
        employeeRoles,
        setEmployeeRoles,
        subscription,
        setSubscription,
        loading,
        fetchAnalytics,
        infoVendas,
        loadingAnalytics,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
