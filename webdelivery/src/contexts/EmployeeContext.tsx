"use client";

import { UsuarioFuncionario } from "@/types/users";
import { ModuleType } from "@/types/modules";
import React, { createContext, ReactNode, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface EmployeeContextType {
  userInfo: UsuarioFuncionario | null;
  accessToken: string | null;
  empresaSlug: string;
  loginFuncionarioWithSlug: (
    email: string,
    senha: string,
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  logoutFuncionario: () => void;
  loading: boolean;
}

export const EmployeeContext = createContext<EmployeeContextType>({
  userInfo: null,
  accessToken: null,
  empresaSlug: "",
  loginFuncionarioWithSlug: async () => ({ success: false }),
  logoutFuncionario: () => {},
  loading: false,
});

interface EmployeeProviderProps {
  children: ReactNode;
  empresaSlug: string;
}

export const EmployeeProvider = ({
  children,
  empresaSlug,
}: EmployeeProviderProps) => {
  const [userInfo, setUserInfo] = useState<UsuarioFuncionario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // Nomes dos cookies
  const COOKIE_NAMES = {
    ACCESS_TOKEN: `employee_access_token_${empresaSlug}`,
  } as const;

  useEffect(() => {
    const storedToken = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);

    if (storedToken) {
      try {
        setAccessToken(storedToken);

        const payload = jwtDecode<{
          id: string;
          name: string;
          email: string;
          businessId: string;
          businessSlug: string;
          role: string;
          permissions: Record<string, any>;
          modules: ModuleType[];
        }>(storedToken);

        // Atualiza userInfo baseado no payload
        setUserInfo({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          businessId: payload.businessId,
          businessSlug: payload.businessSlug,
          role: payload.role,
          permissions: payload.permissions,
          modules: payload.modules,
        });
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setUserInfo(null);
        setAccessToken(null);
        Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN, { path: "/" });
      }
    }
  }, [empresaSlug]);

  const loginFuncionarioWithSlug = async (
    email: string,
    senha: string,
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password: senha,
            slug: empresaSlug,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Erro ao realizar login",
        };
      }

      Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, data.token, {
        path: "/",
        sameSite: "strict",
      });

      setUserInfo(data.employee);
      setAccessToken(data.token);

      return {
        success: true,
        message: data.message || "Login realizado com sucesso!",
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: "Erro de conexão. Tente novamente.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutFuncionario = () => {
    setUserInfo(null);
    setAccessToken(null);
    Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN, { path: "/" });
    router.push(`/login`);
  };

  return (
    <EmployeeContext.Provider
      value={{
        userInfo,
        accessToken,
        empresaSlug,
        loginFuncionarioWithSlug,
        logoutFuncionario,
        loading,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
