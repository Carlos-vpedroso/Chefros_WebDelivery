import {
  maskCardNumber,
  maskCEP,
  maskCNPJ,
  maskCPF,
  maskCVV,
  maskExpiry,
  maskPhone,
  maskSlug,
} from "@/lib/masks";
import { useCallback } from "react";

export function useMask() {
  const cpf = useCallback(maskCPF, []);
  const cnpj = useCallback(maskCNPJ, []);
  const cep = useCallback(maskCEP, []);
  const slug = useCallback(maskSlug, []);
  const cardNumber = useCallback(maskCardNumber, []);
  const expiry = useCallback(maskExpiry, []);
  const cvv = useCallback(maskCVV, []);
  const phone = useCallback(maskPhone, []);

  return { cpf, cnpj, cep, slug, cardNumber, expiry, cvv, phone };
}
