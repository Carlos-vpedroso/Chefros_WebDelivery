import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WorkDay } from "../types/workDays";
import { Promotion } from "@/types/product&category";
import { Address } from "@/types/business";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatR$(value: number) {
  const newString = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
  return newString;
}

export function isBusinessOpen(workDays: WorkDay[]): boolean {
  if (!workDays || workDays.length === 0) return false;

  const now = new Date();
  const currentDay = now.getDay();

  const today = workDays.find((d) => d.day === currentDay && d.active);

  if (!today || !today.workHours?.length) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return today.workHours.some(({ startTime, endTime }) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
}

export async function fetchCep(cep: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
} | null> {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    const data = await response.json();

    if (data.erro) return null;

    return {
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}

export function getFirstAndLastName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function capitalizeWords(str: string): string {
  return str
    .split(" ") // separa por espaços
    .filter(Boolean) // remove espaços extras
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // maiúscula + resto minúsculo
    .join(" "); // junta tudo de volta
}

export function capitalize(value?: string) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getPromotionalPrice(
  originalPrice: number,
  promotion?: Partial<Promotion>,
) {
  if (!promotion || !promotion.type) return null;

  if (
    promotion.type === "FIXED_DISCOUNT" &&
    promotion.value !== null &&
    promotion.value !== undefined
  ) {
    return Math.max(originalPrice - Number(promotion.value), 0);
  }

  if (
    promotion.type === "PERCENTAGE" &&
    promotion.percentage !== null &&
    promotion.percentage !== undefined
  ) {
    return Math.max(originalPrice * (1 - promotion.percentage / 100), 0);
  }

  return null;
}

export function normalizeAddressInline(address?: Address | null): string {
  if (!address) return "";

  return [
    address.rua,
    address.numero && `nº ${address.numero}`,
    address.complemento,
    address.bairro,
    address.cidade,
    address.estado,
    address.cep && `CEP ${address.cep}`,
  ]
    .filter(Boolean)
    .join(", ");
}
