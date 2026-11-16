/**
 * Valida formato de email
 * @param email - Email a ser validado
 * @returns boolean - True se o email é válido
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
}

/**
 * Remove caracteres não numéricos
 */
function cleanDocument(doc: string): string {
  return doc.replace(/\D/g, "");
}

/**
 * Valida CPF
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns boolean - True se o CPF é válido
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanDocument(cpf);

  // Deve ter 11 dígitos e não ser uma sequência repetida
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let remainder;

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ
 * @param cnpj - CNPJ a ser validado (com ou sem formatação)
 * @returns boolean - True se o CNPJ é válido
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cleanDocument(cnpj);

  // Deve ter 14 dígitos e não ser uma sequência repetida
  if (cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;

  // Valida primeiro dígito verificador
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Valida segundo dígito verificador
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ automaticamente
 * @param document - CPF ou CNPJ a ser validado
 * @returns boolean - True se o documento é válido
 */
export function validateCPFOrCNPJ(document: string): boolean {
  const cleaned = cleanDocument(document);

  if (cleaned.length === 11) {
    return validateCPF(document);
  } else if (cleaned.length === 14) {
    return validateCNPJ(document);
  }

  return false;
}

/**
 * Detecta o tipo de documento (CPF ou CNPJ)
 */
export function getDocumentType(document: string): "CPF" | "CNPJ" | "INVALID" {
  const cleaned = cleanDocument(document);

  if (cleaned.length === 11) return "CPF";
  if (cleaned.length === 14) return "CNPJ";
  return "INVALID";
}
/**
 * Verifica se a empresa está aberta naquele momento
 */
export function isBusinessOpen(
  workDays: {
    day: number;
    active: boolean;
    workHours: { startTime: string; endTime: string }[];
  }[]
): boolean {
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

    const res = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    return res;
  });
}

/**
 * Normaliza o número tranforma string para number.
 */
export function normalizeNumber(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value === "string") {
    const normalized = value.replace(",", ".");
    const parsed = Number(normalized);
    return isNaN(parsed) ? undefined : parsed;
  }

  return Number(value);
}
