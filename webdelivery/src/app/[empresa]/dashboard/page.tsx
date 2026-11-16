"use client"
import { useAuth } from "@/hooks/useAuth";
import AdminWelcome from "./_components/AdminWelcome";
import EmployeeWelcome from "./_components/EmployeeWelcome";
import { EmployeeContext } from "@/contexts/EmployeeContext";

export default function WelcomePage() {
  const { userInfo } = useAuth(EmployeeContext); 

  
  if (userInfo?.role === 'administrador') {
    return <AdminWelcome />;
  } else {
    return <EmployeeWelcome userInfo={userInfo} />;
  }
}