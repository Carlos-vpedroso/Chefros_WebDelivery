"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  Check,
  X,
  DoorClosed,
  DoorOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { BusinessContext } from "@/contexts/BusinessContext";
import { WorkDay } from "@/types/workDays";
import { workDaysService } from "@/services/workDays.service";
import { HeaderDashboard } from "@/components/HeaderDashboard";

const dayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const MetricCard = ({
  title,
  value,
  icon: Icon,
  variant = "success",
}: {
  title: string;
  value: number | string;
  icon: any;
  variant: "success" | "warning";
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className={clsx(
          variant === "success" &&
            "border-green-300 bg-green-50/70 text-green-600 dark:bg-green-900/30",
          variant === "warning" &&
            "border-yellow-300 bg-yellow-50/70 text-yellow-600 dark:bg-yellow-900/30",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon
                className={clsx(
                  "h-5 w-5",
                  variant === "success" && "text-green-600",
                  variant === "warning" && "text-yellow-600",
                )}
              />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function HorariosDashboard() {
  const { accessToken } = useAuth(EmployeeContext);
  const { businessInfo, setBusinessInfo } = useAuth(BusinessContext);
  const [loading, setLoading] = useState(false);
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);

  useEffect(() => {
    if (businessInfo?.workDays && businessInfo.workDays != workDays) {
      setWorkDays(businessInfo.workDays);
    }
  }, [businessInfo]);

  const activeDays = workDays.filter((s) => s.active).length;

  const openAll = () => {
    setWorkDays((prev) =>
      prev.map((workDay) => ({
        ...workDay,
        active: true,
      })),
    );
  };

  const closeAll = () => {
    setWorkDays((prev) =>
      prev.map((workDay) => ({
        ...workDay,
        active: false,
      })),
    );
  };

  const toggleDayActive = (day: number) => {
    setWorkDays((prev) =>
      prev.map((workDay) =>
        workDay.day === day ? { ...workDay, active: !workDay.active } : workDay,
      ),
    );
  };

  const addTimeSlot = (day: number) => {
    setWorkDays((prev) =>
      prev.map((workDay) =>
        workDay.day === day
          ? {
              ...workDay,
              workHours: [
                ...workDay.workHours,
                {
                  id: Date.now().toString(),
                  startTime: "09:00",
                  endTime: "18:00",
                },
              ],
            }
          : workDay,
      ),
    );
  };

  const removeTimeSlot = (day: number, slotId: string) => {
    setWorkDays((prev) =>
      prev.map((workDay) =>
        workDay.day === day
          ? {
              ...workDay,
              workHours: workDay.workHours.filter((slot) => slot.id !== slotId),
            }
          : workDay,
      ),
    );
  };

  const updateTimeSlot = (
    day: number,
    slotId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setWorkDays((prev) =>
      prev.map((workDay) =>
        workDay.day === day
          ? {
              ...workDay,
              workHours: workDay.workHours.map((slot) =>
                slot.id === slotId ? { ...slot, [field]: value } : slot,
              ),
            }
          : workDay,
      ),
    );
  };

  const handleSubmitWorkDays = async () => {
    if (!businessInfo?.id || !accessToken) return;

    const invalidDays = workDays.filter(
      (day) => day.active && day.workHours.length === 0,
    );

    if (invalidDays.length > 0) {
      toast.error("Dias abertos precisam ter pelo menos um horário");
      return;
    }

    setLoading(true);

    try {
      const result = await workDaysService.updateWorkDays(
        businessInfo.slug,
        accessToken,
        workDays,
      );

      if (!result.success || !result.data) {
        toast.error(result.error || "Erro ao salvar dias de funcionamento");
        return;
      }

      setBusinessInfo((prev) =>
        prev ? { ...prev, workDays: result.data || [] } : prev,
      );

      setWorkDays(result.data);
      toast.success("Dias de funcionamento atualizados com sucesso!");
    } catch (err) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const copyToAllDays = (sourceDay: number) => {
    const source = workDays.find((s) => s.day === sourceDay);
    if (!source) return;

    setWorkDays((prev) =>
      prev.map((workDay) =>
        workDay.day !== sourceDay
          ? {
              ...workDay,
              workHours: source.workHours.map((slot) => ({
                ...slot,
                id: Date.now().toString() + Math.random(),
              })),
            }
          : workDay,
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* CABEÇALHO */}
      <HeaderDashboard
        icon={Calendar}
        title="Horários de Funcionamento"
        subtitle="Defina os horários de abertura do restaurante"
        btns={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={openAll}>
              <DoorOpen className="mr-2 h-4 w-4" />
              Abrir Tudo
            </Button>

            <Button variant="outline" onClick={closeAll}>
              <DoorClosed className="mr-2 h-4 w-4" />
              Fechar Tudo
            </Button>

            <Button
              onClick={handleSubmitWorkDays}
              disabled={loading}
              className="flex gap-2"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        }
      />

      <div className="space-y-6 px-4">
        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MetricCard
            title="Dias Ativos"
            value={`${activeDays}/7`}
            icon={Calendar}
            variant="success"
          />
          <MetricCard
            title="Dias Fechados"
            value={7 - activeDays}
            icon={X}
            variant="warning"
          />
        </div>

        <Separator />

        {/* LISTA DE DIAS */}
        <div className="space-y-4">
          {workDays.map((workDay) => (
            <Card
              key={workDay.day}
              className={clsx(
                "transition-all",
                workDay.active
                  ? "border-green-300"
                  : "border-red-300 opacity-60",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-xl">
                      {dayNames[workDay.day]}
                    </CardTitle>
                    <Badge
                      className={clsx(
                        "px-2 py-1",
                        workDay.active
                          ? "bg-green-500/10 text-green-700"
                          : "bg-red-500/10 text-red-700",
                      )}
                    >
                      {workDay.active ? "ABERTO" : "FECHADO"}
                    </Badge>
                  </div>

                  <Button
                    variant={workDay.active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleDayActive(workDay.day)}
                    className="gap-2"
                  >
                    {workDay.active ? (
                      <DoorClosed className="h-4 w-4" />
                    ) : (
                      <DoorOpen className="h-4 w-4" />
                    )}

                    {workDay.active ? "Fechar" : "Abrir"}
                  </Button>
                </div>
              </CardHeader>

              <AnimatePresence>
                {workDay.active && (
                  <CardContent className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      {workDay.workHours.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center text-sm">
                          Nenhum horário definido para este dia
                        </p>
                      ) : (
                        workDay.workHours.map((slot) => (
                          <div
                            key={slot.id}
                            className="bg-card flex items-center gap-3 rounded-lg border p-3"
                          >
                            <div className="flex flex-1 flex-col items-end gap-3 md:flex-row">
                              <div className="w-full space-y-1">
                                <Label className="text-muted-foreground text-xs">
                                  Abertura
                                </Label>
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      workDay.day,
                                      slot.id,
                                      "startTime",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="w-full space-y-1">
                                <Label className="text-muted-foreground text-xs">
                                  Fechamento
                                </Label>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      workDay.day,
                                      slot.id,
                                      "endTime",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeTimeSlot(workDay.day, slot.id)
                                }
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}

                      <div className="flex flex-col gap-2 pt-2 md:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(workDay.day)}
                          className="flex-1 py-1"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Horário
                        </Button>
                        {workDay.workHours.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToAllDays(workDay.day)}
                            className="flex-1 py-1"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Copiar para Todos
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </CardContent>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
