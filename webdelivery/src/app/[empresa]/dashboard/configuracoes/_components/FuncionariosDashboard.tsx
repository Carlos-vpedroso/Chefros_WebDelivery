"use client";

import { NextPage } from "next";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Shield,
  Crown,
  Briefcase,
  Edit,
  Trash2,
  Plus,
  ShoppingCart,
  LayoutGrid,
  ClipboardList,
  Monitor,
  Loader2,
  SquareChartGantt,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { DashboardContext } from "@/contexts/DashboardContext";
import { roleService } from "@/services/employeeRole.service";
import { Employee, Permissions, Role } from "@/types/employee";
import { toast } from "sonner";
import { employeeService } from "@/services/employee.service";
import { capitalizeWords } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Business } from "@/types/business";
import { DeleteModal } from "@/components/DeleteModal";

type EmployeeForm = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
};
type PermissionChildren = Record<string, string>;
interface PermissionMenuItem {
  label: string;
  icon: React.ComponentType<any>;
  children?: PermissionChildren;
}
type PermissionMenu = Record<string, PermissionMenuItem>;

/* ----------------------------------
 * PERMISSÕES (SIDEBAR)
 * ---------------------------------- */
const PERMISSION_MENU: PermissionMenu = {
  pdv: {
    label: "PDV",
    icon: Monitor,
  },

  pedidos: {
    label: "Pedidos",
    icon: ClipboardList,
  },

  vendas: {
    label: "Vendas",
    icon: ShoppingCart,
    children: {
      dashboard: "Visão Geral",
      mesas: "Mesas",
      categorias: "Categorias",
      produtos: "Produtos",
      servicos: "Serviços",
      combos: "Combos & Promoções",
      catalogo: "Catálogo",
    },
  },
  relatorios: {
    label: "Relatórios",
    icon: SquareChartGantt,
    children: {
      vendas: "Vendas",
      maisvendidos: "Mais Vendidos",
      menosvendidos: "Menos Vendidos",
      faturamentocategoria: "Faturamento Categoria",
    },
  },

  configuracoes: {
    label: "Configurações",
    icon: LayoutGrid,
    children: {
      home: "Home",
      funcionarios: "Funcionários",
      horarios: "Horários",
      assinatura: "Assinatura"
    },
  },
};

function getRolePermissionLabels(role: Role): string[] {
  if (role.permissions?.fullaccess) {
    return ["Acesso total"];
  }

  if (!role.permissions) return [];

  return Object.keys(role.permissions)
    .filter((key) => key !== "fullaccess")
    .map((key) => PERMISSION_MENU[key]?.label)
    .filter(Boolean) as string[];
}

function isAdminRole(role: any) {
  return role.name.toLowerCase() === "administrador";
}

interface EmployeeDialogProps {
  mode: "create" | "edit";
  token: string;
  business: Business | null;
  employee?: Employee;
  roles: Role[];
  onSave: (employee: Employee) => Promise<void>;
  trigger: React.ReactNode;
}

const EmployeeModal = ({
  mode,
  token,
  business,
  employee,
  roles,
  onSave,
  trigger,
}: EmployeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EmployeeForm>({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  /* ----------------------------------
   * RESET (CREATE)
   * ---------------------------------- */
  useEffect(() => {
    if (!open && mode === "create") {
      setFormData({
        name: "",
        email: "",
        password: "",
        roleId: "",
      });
    }
  }, [open, mode]);

  /* ----------------------------------
   * PRELOAD (EDIT)
   * ---------------------------------- */
  useEffect(() => {
    if (mode === "edit" && employee) {
      setFormData({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        password: "",
        roleId: employee.roleId,
      });
    }
  }, [mode, employee]);

  /* ----------------------------------
   * SUBMIT
   * ---------------------------------- */
  async function handleSubmit() {
    if (!token || !business) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      (!formData.password && mode === "create") ||
      !formData.roleId
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (mode === "edit" && formData.id) {
        result = await employeeService.update(
          token,
          business.slug,
          formData.id,
          {
            name: formData.name,

            email: formData.email,
            roleId: formData.roleId,
            ...(formData.password ? { password: formData.password } : {}),
          },
        );
      } else {
        result = await employeeService.create(token, business.slug, {
          name: formData.name,

          email: formData.email,
          password: formData.password!,
          roleId: formData.roleId,
          businessId: business.id,
        });
      }

      if (result.success && result.data) {
        await onSave(result.data);
        setOpen(false);
        toast.success(
          mode === "create"
            ? "Funcionário criado com sucesso!"
            : "Funcionário atualizado com sucesso!",
        );
      } else {
        toast.error(result.error || "Erro ao salvar funcionário");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar funcionário");
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------
   * RENDER
   * ---------------------------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Cadastrar Funcionário" : "Editar Funcionário"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            type="password"
            placeholder={mode === "edit" ? "Nova senha (opcional)" : "Senha"}
            value={formData.password ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* PERFIL */}
          <Select
            value={formData.roleId}
            onValueChange={(value) =>
              setFormData({ ...formData, roleId: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>

            <SelectContent>
              {roles
                .filter((role) => {
                  if (mode === "create") {
                    return !isAdminRole(role);
                  }
                  return true;
                })
                .map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {capitalizeWords(role.name)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Salvando..."
              : mode === "create"
                ? "Cadastrar"
                : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface RoleDialogProps {
  mode: "create" | "edit";
  token: string;
  business: Business | null;
  role?: Role;
  onSave: (data: Partial<Role>) => Promise<void>;
  trigger?: React.ReactNode;
}

const RolesModal = ({
  mode,
  token,
  business,
  role,
  onSave,
  trigger,
}: RoleDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: "",
    permissions: {},
  });
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!open && mode === "create") {
      setFormData({
        name: "",
        permissions: {},
      });
    }
  }, [open, mode]);

  useEffect(() => {
    if (mode === "edit" && role) {
      setFormData(role);
    }
  }, [mode, role]);

  function toggleRootPermission(
    permissions: Permissions,
    key: string,
    checked: boolean,
  ): Permissions {
    const updated = { ...permissions };

    if (checked) {
      updated[key] = true;
    } else {
      delete updated[key];
    }

    return updated;
  }

  function toggleChildPermission(
    permissions: Permissions,
    parent: string,
    child: string,
    checked: boolean,
  ): Permissions {
    const updated: Permissions = { ...permissions };

    const currentParent =
      typeof updated[parent] === "object"
        ? { ...(updated[parent] as Record<string, boolean>) }
        : {};

    if (checked) {
      currentParent[child] = true;
    } else {
      delete currentParent[child];
    }

    if (Object.keys(currentParent).length === 0) {
      delete updated[parent];
    } else {
      updated[parent] = currentParent;
    }

    return updated;
  }

  const handleSubmit = async () => {
    if (!token || !business) return;

    if (!formData.name?.trim()) {
      toast.error("Informe o nome do perfil.");
      return;
    }

    if (
      !formData.permissions ||
      Object.keys(formData.permissions).length === 0
    ) {
      toast.error("Selecione ao menos uma permissão.");
      return;
    }

    setLoading(true);

    try {
      let result;

      const payload = {
        name: formData.name.trim(),
        permissions: formData.permissions,
        businessId: business.id,
      };

      if (mode === "edit" && role?.id) {
        result = await roleService.update(
          token,
          role.id,
          business.slug,
          payload,
        );
      } else {
        result = await roleService.create(token, business.slug, payload);
      }

      if (result.success && result.data) {
        await onSave(result.data);
        setOpen(false);

        toast.success(
          mode === "create"
            ? "Perfil criado com sucesso!"
            : "Perfil atualizado com sucesso!",
        );
      } else {
        toast.error(result.error || "Erro ao salvar perfil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Cadastrar Perfil" : "Editar Perfil"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações do novo perfil."
              : "Atualize as informações deste perfil."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-2">
              Nome do Perfil
            </Label>
            <Input
              id="name"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Financeiro"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <Checkbox
            id="full-access"
            checked={formData.permissions?.fullaccess === true}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                permissions: checked ? { fullaccess: true } : {},
              }))
            }
          />
          <Label htmlFor="full-access" className="cursor-pointer">
            Acesso total ao sistema
          </Label>
        </div>
        {!formData.permissions?.fullaccess && (
          <Accordion
            type="multiple"
            className="max-h-[350px] space-y-2 overflow-y-auto"
          >
            {Object.entries(PERMISSION_MENU).map(([key, module]) => {
              const Icon = module.icon;
              const hasChildren = Boolean(module.children);

              return (
                <AccordionItem
                  key={key}
                  value={key}
                  className="rounded-lg border px-2"
                >
                  <AccordionTrigger
                    id={`trigger-${key}`}
                    className="flex cursor-pointer gap-2 hover:no-underline"
                  >
                    <Label
                      htmlFor={`trigger-${key}`}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{module.label}</span>
                    </Label>
                  </AccordionTrigger>

                  <AccordionContent className="space-y-2 pl-6">
                    {/* MÓDULO SEM FILHOS */}
                    {!hasChildren && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`Checkbox-${key}`}
                          checked={formData.permissions?.[key] === true}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              permissions: toggleRootPermission(
                                prev.permissions || {},
                                key,
                                Boolean(checked),
                              ),
                            }))
                          }
                        />
                        <Label
                          htmlFor={`Checkbox-${key}`}
                          className="cursor-pointer"
                        >
                          Acessar {module.label}
                        </Label>
                      </div>
                    )}

                    {/* MÓDULO COM FILHOS */}
                    {hasChildren &&
                      Object.entries(module.children as any).map(
                        ([childKey, label]) => {
                          const path = `${key}.${childKey}`;
                          const checked =
                            typeof formData.permissions?.[key] === "object" &&
                            formData.permissions?.[key]?.[childKey] === true;

                          return (
                            <div key={path} className="flex items-center gap-2">
                              <Checkbox
                                id={`Checkbox-${childKey}`}
                                checked={checked}
                                onCheckedChange={(checked) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    permissions: toggleChildPermission(
                                      prev.permissions || {},
                                      key,
                                      childKey,
                                      Boolean(checked),
                                    ),
                                  }))
                                }
                              />
                              <Label
                                htmlFor={`Checkbox-${childKey}`}
                                className="cursor-pointer"
                              >
                                {label as string}
                              </Label>
                            </div>
                          );
                        },
                      )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            {/*  Div Apenas para dar espaçamento no final */}
            <div />
          </Accordion>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Cadastrar" : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------------------------
 * PAGE
 * ---------------------------------- */
const FuncionariosDashboard: NextPage = () => {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo } = useAuth(BusinessContext);
  const { employees, setEmployees, employeeRoles, setEmployeeRoles } =
    useAuth(DashboardContext);
  const [loading, setLoading] = useState(false);

  const handleDeleteEmployee = async (id: string) => {
    try {
      if (!accessToken || !businessInfo?.slug) {
        return;
      }

      const result = await employeeService.delete(
        accessToken,
        businessInfo.slug,
        id,
      );

      if (result.success) {
        // remove da lista local sem precisar refazer o fetch
        setEmployees(employees.filter((employee) => employee.id !== id));
        toast.success("Funcionario excluído com sucesso.");
        return;
      }
      toast.info("Este funcionário não pode ser excluído");
    } catch (error) {
      console.error("Erro ao excluir funcionario:", error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      if (!accessToken || !businessInfo?.slug) {
        return;
      }

      const result = await roleService.remove(
        accessToken,
        id,
        businessInfo?.slug,
      );

      if (result.success) {
        // remove da lista local sem precisar refazer o fetch
        setEmployeeRoles(employeeRoles.filter((role) => role.id !== id));
        toast.success("Perfil excluído com sucesso.");
        return;
      }
      toast.info(
        "Este perfil não pode ser excluído pois está vinculado a um funcionário.",
      );
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <HeaderDashboard
        icon={Users}
        title="Gestão de Funcionários"
        subtitle="Perfis de permissão e colaboradores"
        btns={
          <div className="flex flex-col gap-2 md:flex-row">
            {accessToken && businessInfo && (
              <RolesModal
                mode="create"
                token={accessToken}
                business={businessInfo}
                onSave={async (newRole) => {
                  setEmployeeRoles((prev) => [...prev, newRole as Role]);
                }}
                trigger={
                  <Button variant="outline" className="gap-2">
                    <Plus />
                    Novo Perfil de Permissão
                  </Button>
                }
              />
            )}
            {/* NOVO FUNCIONÁRIO (modal) */}
            {accessToken && businessInfo && (
              <EmployeeModal
                mode="create"
                token={accessToken}
                business={businessInfo}
                roles={employeeRoles}
                onSave={async (newEmployee) => {
                  // adiciona na lista sem recarregar
                  setEmployees((prev) => [...prev, newEmployee]);
                }}
                trigger={
                  <Button variant="outline" className="gap-2">
                    <UserPlus />
                    Novo Funcionário
                  </Button>
                }
              />
            )}
          </div>
        }
      />

      {/* PERFIS */}
      <div className="px-4">
        <h2 className="mb-4 text-lg font-semibold">
          Perfis de Permissão ({employeeRoles.length})
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {employeeRoles.map((role) => (
            <div
              key={role.id}
              className="bg-card border-border rounded-xl border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {role.permissions?.fullaccess ? (
                    <Shield className="text-primary mt-1 h-5 w-5" />
                  ) : (
                    <Briefcase className="text-muted-foreground mt-1 h-5 w-5" />
                  )}

                  <div className="flex flex-col">
                    <h3 className="leading-tight font-semibold">
                      {capitalizeWords(role.name)}
                    </h3>

                    <div className="text-muted-foreground mt-1 flex flex-wrap gap-1 text-xs">
                      {getRolePermissionLabels(role).map((permission) => (
                        <span
                          key={permission}
                          className="bg-muted rounded-md px-2 py-0.5"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {!isAdminRole(role) && (
                  <div>
                    {accessToken && businessInfo && (
                      <RolesModal
                        mode="edit"
                        token={accessToken}
                        business={businessInfo}
                        role={role}
                        onSave={async (updatedRole) => {
                          setEmployeeRoles((prev) =>
                            prev.map((r) =>
                              r.id === updatedRole.id
                                ? (updatedRole as Role)
                                : r,
                            ),
                          );
                        }}
                        trigger={
                          <Button
                            variant="ghost"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                        }
                      />
                    )}

                    <DeleteModal
                      onConfirm={() => handleDeleteRole(role.id)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FUNCIONÁRIOS*/}
      <div className="bg-card border-border mx-4 overflow-hidden rounded-lg border">
        <div className="border-b p-6">
          <h2 className="font-semibold">Funcionários ({employees.length})</h2>
        </div>

        {employees.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8">Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="pr-8 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="pl-8">
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {employee.email}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Briefcase className="mr-2 inline h-4 w-4" />
                    {capitalizeWords(employee.role?.name ?? "sem perfil")}
                  </TableCell>

                  <TableCell className="pr-8 text-right">
                    {!isAdminRole(employee.role) && (
                      <div>
                        {accessToken && businessInfo && (
                          <EmployeeModal
                            mode="edit"
                            token={accessToken}
                            business={businessInfo}
                            employee={employee}
                            roles={employeeRoles}
                            onSave={async (editedEmployee) =>
                              console.log(editedEmployee)
                            }
                            trigger={
                              <Button
                                variant="ghost"
                                className="h-8 w-8 cursor-pointer"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                            }
                          />
                        )}
                        <DeleteModal
                          onConfirm={() => handleDeleteEmployee(employee.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default FuncionariosDashboard;
