"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { plansData, segments } from "@/data/mockData";
import {
  ArrowLeftRight,
  Building2,
  Check,
  CreditCard,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatR$, normalizeAddressInline } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMask } from "@/hooks/useMask";
import { useDebounce } from "@/hooks/useDebounce";
import { validateCPFOrCNPJ } from "@/lib/helpers";
import { Checkbox } from "@/components/ui/checkbox";
import { businessService } from "@/services/business.service";
import { loadStripe } from "@stripe/stripe-js";
import stripeService from "@/services/stripe.service";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { subscriptionService } from "@/services/subscription.service";

interface MetaData {
  businessId: string;
  subscriptionId: string;
  employeeId: string;
}

interface BusinessData {
  name: string;
  phone: string;
  slug: string;
  document: string;
  segment: string;
  address: {
    cep: string;
    numero: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
  };
}

interface EmployeeData {
  name: string;
  email: string;
  password: string;
}

const businessSchema = z.object({
  name: z.string().min(2, "O nome é obrigatório"),
  phone: z.string().min(8, "Telefone inválido"),
  slug: z.string().min(2, "Slug é obrigatório"),
  document: z.string().min(11, "Documento inválido"),
  segment: z.string().nonempty("Selecione um segmento"),

  address: z.object({
    cep: z.string().min(8, "CEP inválido"),
    numero: z.string().min(1, "Informe o número"),
    rua: z.string().min(2, "Rua obrigatória"),
    bairro: z.string().min(2, "Bairro obrigatório"),
    cidade: z.string().min(2, "Cidade obrigatória"),
    estado: z.string().min(2, "Estado obrigatório"),
    complemento: z.string().optional(),
  }),
});

const employeeSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome precisa ter pelo menos 3 caracteres")
      .max(100, "O nome não pode ultrapassar 100 caracteres"),

    email: z
      .string()
      .email("Informe um e-mail válido")
      .min(5, "O e-mail é muito curto")
      .max(120, "O e-mail é muito longo"),

    password: z
      .string()
      .min(6, "A senha precisa ter no mínimo 6 caracteres")
      .max(50, "A senha pode ter no máximo 50 caracteres"),

    confirmPassword: z
      .string()
      .min(6, "A senha precisa ter no mínimo 6 caracteres")
      .max(50, "A senha pode ter no máximo 50 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem!", // Mensagem de erro personalizada
    path: ["confirmPassword"], // O erro será anexado ao campo confirmPassword
  });

type BusinessFormSchema = z.infer<typeof businessSchema>;
type EmployeeFormSchema = z.infer<typeof employeeSchema>;

const PlanoComponent = ({
  setStatePlano,
  setStateStep,
}: {
  setStatePlano: React.Dispatch<React.SetStateAction<string | null>>;
  setStateStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const plans = plansData;

  return (
    <div className="bg-fundo3 container mt-6 min-h-10/12 rounded-md px-4 py-10 shadow-md">
      <div className="text-center">
        <h1 className="text-texto text-3xl font-bold">Escolha o plano ideal</h1>
        <p className="text-texto/60">Selecione e clique em próximo.</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:px-40">
        {plans.slice(0, 2).map((plan) => {
          const isPopular = plan.level === 2;
          return (
            <Card key={plan.level} className="bg-fundo/60 relative h-full">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-texto text-2xl font-extrabold">
                    Nível {plan.level}
                  </h1>
                  {isPopular && (
                    <Badge className="flex items-center justify-between px-2 py-1">
                      <Star />
                      <h1>Mais Popular</h1>
                    </Badge>
                  )}
                </div>
                <h1 className="text-texto/60 text-lg font-semibold">
                  {plan.name}
                </h1>
                {plan.price ? (
                  <h1 className="text-texto text-2xl font-extrabold">
                    {formatR$(plan.price)}
                    <span className="text-texto/60 text-sm">/mes</span>
                  </h1>
                ) : (
                  <h1 className="text-texto text-2xl font-extrabold">
                    Sob consulta
                  </h1>
                )}
                <Separator className="my-2 bg-gray-300" />
              </CardHeader>

              <CardContent className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <h2 className="text-sm">{feature}</h2>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-1 items-end">
                <Button
                  variant="default"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    setStatePlano(plan.id);
                    setStateStep((prev) => prev + 1);
                  }}
                >
                  Selecione o plano
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const EmpresaComponent = ({
  formData,
  setStateFormData,
  planoId,
  setStatePlanId,
  setStateStep,
}: {
  formData: BusinessData;
  setStateFormData: React.Dispatch<React.SetStateAction<BusinessData>>;
  planoId: string;
  setStatePlanId: React.Dispatch<React.SetStateAction<string | null>>;
  setStateStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { cpf, cnpj, cep, slug, phone } = useMask();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<BusinessFormSchema>({
    resolver: zodResolver(businessSchema),
    defaultValues: formData,
  });
  const [haveComplement, setHaveComplement] = useState<boolean>(false);
  const [complemento, setComplemento] = useState<string>("");
  const [documentError, setDocumentError] = useState<string | null>(null);
  const selectedPlan = plansData.find((plan) => plan.id === planoId);

  const slugValue = watch("slug");
  const debouncedSlug = useDebounce(slugValue, 500);

  const onSubmit = (data: BusinessFormSchema) => {
    setDocumentError(null);

    // Valida o documento (CPF/CNPJ)
    const isDocumentValid = validateCPFOrCNPJ(data.document);

    if (!isDocumentValid) {
      if (data.document.length - 3 === 11) {
        setDocumentError("CPF inválido");
      } else if (data.document.length - 4 === 14) {
        setDocumentError("CNPJ inválido");
      } else {
        setDocumentError("Documento inválido");
      }
      return;
    }

    const businessDataToSave: BusinessData = {
      ...data,
      address: {
        ...data.address,
        cep: data.address.cep.replace(/\D/g, ""),
        complemento:
          haveComplement && complemento.trim() !== ""
            ? complemento.trim()
            : undefined,
      },
    };

    setStateFormData(businessDataToSave);

    setStateStep((prev) => prev + 1);
  };

  const handleComplementToggle = () => {
    const newHaveComplement = !haveComplement;
    setHaveComplement(newHaveComplement);

    // Se estiver desativando, limpa o complemento
    if (!newHaveComplement) {
      setComplemento("");
    }
  };

  useEffect(() => {
    if (!debouncedSlug) {
      clearErrors("slug");
      return;
    }

    let isCancelled = false;

    async function checkSlug() {
      const result = await businessService.getBySlug(debouncedSlug);

      if (isCancelled) return;

      if (!result.success || !result.data) {
        clearErrors("slug");
      } else {
        setError("slug", {
          type: "manual",
          message: "Esta URL já está em uso",
        });
      }
    }

    checkSlug();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSlug]);

  useEffect(() => {
    const cep = watch("address.cep");

    // Limpa caracteres não numéricos
    const cleanCep = cep?.replace(/\D/g, "");

    // Só busca quando tiver 8 dígitos
    if (cleanCep && cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) return;

          // Preenche automaticamente
          setValue("address.rua", data.logradouro || "");
          setValue("address.bairro", data.bairro || "");
          setValue("address.cidade", data.localidade || "");
          setValue("address.estado", data.uf || "");
        })
        .catch((err) => console.error("Erro ao buscar CEP:", err));
    }
  }, [watch("address.cep")]);

  useEffect(() => {
    reset(formData);
  }, [reset, formData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Container principal - Ajustado para melhor visualização em telas grandes */}
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3 lg:gap-8">
        {/* FORM - Coluna de Dados da Empresa - Visual mais clean e profissional */}
        <div className="bg-fundo3 rounded-xl p-6 shadow-lg md:col-span-2 md:p-10">
          <h1 className="text-texto border-texto/10 mb-10 border-b pb-3 text-center text-3xl font-extrabold">
            Complete os dados da Empresa
          </h1>

          <div className="space-y-6">
            {/* Nome e Slug */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full space-y-2">
                <Label className="text-texto/80 font-semibold">Nome</Label>
                <Input
                  placeholder="Ex.: Pizzaria Andrade"
                  className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label className="text-texto/80 font-semibold">
                  Nº de Telefone
                </Label>
                <Input
                  placeholder="(35) 99999-9999"
                  className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                  {...register("phone")}
                  onChange={(e) => setValue("phone", phone(e.target.value))}
                />
                {errors.phone && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label className="text-texto/80 font-semibold">
                Sua URL Personalizada
              </Label>
              <Input
                placeholder="pizzaria-andrade"
                className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                {...register("slug")}
                onChange={(e) => setValue("slug", slug(e.target.value))}
                value={watch("slug")}
              />

              <div className="flex items-center gap-2">
                <span className="text-texto/60 text-xs">
                  🔗 chefros.com/{watch("slug") || "pizzaria-andrade"}
                </span>

                {errors.slug && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            {/* Documento e Segmento */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full space-y-2">
                <Label className="text-texto/80 font-semibold">
                  CNPJ / CPF
                </Label>
                <Input
                  placeholder="76.509.567/0001-50"
                  className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                  {...register("document")}
                  onChange={(e) => {
                    const value = e.target.value;

                    const masked =
                      value.replace(/\D/g, "").length <= 11
                        ? cpf(value)
                        : cnpj(value);

                    setValue("document", masked);
                  }}
                />
                {documentError && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    {documentError}
                  </p>
                )}
                {errors.document && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    {errors.document.message}
                  </p>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label className="text-texto/80 font-semibold">Segmento</Label>

                <Select
                  onValueChange={(value) => setValue("segment", value)}
                  defaultValue=""
                >
                  <SelectTrigger className="bg-fundo border-fundo/50 h-12 w-full border-2 transition-colors focus:border-green-500">
                    {" "}
                    {/* Altura e estilo ajustados */}
                    {watch("segment")
                      ? segments.find((s) => s.value === watch("segment"))
                          ?.label
                      : "Selecione o segmento"}
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.segment && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    {errors.segment.message}
                  </p>
                )}
              </div>
            </div>

            {/* ENDEREÇO - Agrupamento visual */}
            <div className="border-texto/10 flex flex-col gap-6 border-t pt-4">
              <h2 className="text-texto/90 text-2xl font-bold">Endereço</h2>
              {/* CEP + Numero */}
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full space-y-2">
                  <Label className="text-texto/80 font-semibold">CEP</Label>
                  <Input
                    placeholder="35950-000"
                    className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                    {...register("address.cep")}
                    onChange={(e) =>
                      setValue("address.cep", cep(e.target.value))
                    }
                  />
                  {errors.address?.cep && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      {errors.address.cep.message}
                    </p>
                  )}
                </div>

                <div className="w-full space-y-2">
                  <Label className="text-texto/80 font-semibold">Número</Label>
                  <Input
                    placeholder="123"
                    className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                    {...register("address.numero")}
                  />
                  {errors.address?.numero && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      {errors.address.numero.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Rua + Bairro */}
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full space-y-2">
                  <Label className="text-texto/80 font-semibold">Rua</Label>
                  <Input
                    placeholder="Rua João Teodoro"
                    className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                    {...register("address.rua")}
                  />
                  {errors.address?.rua && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      {errors.address.rua.message}
                    </p>
                  )}
                </div>

                <div className="w-full space-y-2">
                  <Label className="text-texto/80 font-semibold">Bairro</Label>
                  <Input
                    placeholder="São Gonçalves"
                    className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                    {...register("address.bairro")}
                  />
                  {errors.address?.bairro && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      {errors.address.bairro.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Cidade + Estado */}
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full space-y-2">
                  <Label className="text-texto/80 font-semibold">Cidade</Label>
                  <Input
                    placeholder="São Paulo"
                    className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                    {...register("address.cidade")}
                  />
                  {errors.address?.cidade && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      {errors.address.cidade.message}
                    </p>
                  )}
                </div>

                <div className="w-full space-y-2">
                  <Label className="text-texto/80 font-semibold">Estado</Label>
                  <Input
                    placeholder="SP"
                    className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                    {...register("address.estado")}
                  />
                  {errors.address?.estado && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      {errors.address.estado.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Complemento */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="haveComplement"
                    checked={haveComplement}
                    onCheckedChange={handleComplementToggle}
                    className="border-texto/60 data-[state=checked]:bg-green-500"
                  />
                  <Label
                    htmlFor="haveComplement"
                    className="text-texto/80 cursor-pointer font-medium"
                  >
                    Adicionar complemento ao endereço
                  </Label>
                </div>

                {haveComplement && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label className="text-texto/80 font-semibold">
                      Complemento
                    </Label>
                    <Input
                      placeholder="Ex: Apartamento 123, Bloco B, Sala 4"
                      className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                    />
                    <p className="text-texto/60 text-xs">
                      {complemento
                        ? `Complemento: ${complemento}`
                        : "Opcional - para apartamento, sala, etc."}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Botões - Ações mais destacadas e alinhadas à direita */}
          <div className="border-texto/10 mt-10 flex justify-end gap-3 border-t pt-4">
            <Button
              type="submit"
              className="cursor-pointer rounded-lg bg-green-600 px-8 py-3 font-semibold shadow-md transition-colors hover:bg-green-700"
            >
              Próximo
            </Button>
          </div>
        </div>
        {/* LADO DIREITO - Card do Plano - Mais visual e informativo */}
        <div className="bg-fundo dark:bg-fundo3 text-texto sticky top-8 self-start rounded-xl border border-green-500/30 p-6 shadow-lg">
          {" "}
          {/* self-start e sticky para fixar o card */}
          <h1 className="text-texto border-b border-green-500/50 pb-3 text-center text-2xl font-extrabold">
            Detalhes do Plano
          </h1>
          {selectedPlan ? (
            <div className="mt-6 space-y-6">
              <h2 className="text-center text-3xl font-bold text-green-800">
                {selectedPlan.name}
              </h2>

              {/* Preço — somente se existir */}
              {"price" in selectedPlan && selectedPlan.price !== undefined && (
                <p className="text-texto text-center text-4xl font-extrabold">
                  R$ {selectedPlan.price.toFixed(2)}
                </p>
              )}

              <div className="border-t border-green-500/30 pt-4">
                <h3 className="text-texto/90 mb-3 text-lg font-semibold">
                  Incluso:
                </h3>
                <ul className="space-y-3 border-b border-green-500/50 pb-3">
                  {selectedPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-base">
                      <span className="text-xl font-bold text-green-600">
                        ✓
                      </span>{" "}
                      {/* Ícone de check mais destacado */}
                      <span className="text-texto/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-1 justify-between">
                  {Number(planoId) > 1 && (
                    <Button
                      type="button"
                      variant="link"
                      className="text-texto/50 hover:text-cor1 cursor-pointer"
                      onClick={() =>
                        setStatePlanId((prev) => String(Number(prev) - 1))
                      }
                    >
                      <ArrowLeftRight />
                      {plansData.find(
                        (p) => p.id === String(Number(planoId) - 1),
                      )?.name || "Anterior"}
                    </Button>
                  )}

                  {Number(planoId) < 2 && (
                    <Button
                      type="button"
                      variant="link"
                      className="text-texto/50 hover:text-cor1 cursor-pointer"
                      onClick={() =>
                        setStatePlanId((prev) => String(Number(prev) + 1))
                      }
                    >
                      <ArrowLeftRight />
                      {plansData.find(
                        (p) => p.id === String(Number(planoId) + 1),
                      )?.name || "Próximo"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-center font-semibold text-red-500">
              Plano não encontrado. Por favor, volte e selecione um plano.
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

const AccessComponent = ({
  formData,
  setStateFormData,
  setStateStep,
  planoId,
  businessData,
  onFinish,
}: {
  formData: EmployeeData;
  setStateFormData: React.Dispatch<React.SetStateAction<EmployeeData>>;
  setStateStep: React.Dispatch<React.SetStateAction<number>>;
  planoId: string;
  businessData: BusinessData;
  onFinish: (employee: EmployeeData) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: formData,
  });

  const selectedPlan = plansData.find((plan) => plan.id === planoId);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: EmployeeFormSchema) => {
    // Exclui confirmPassword antes de salvar, pois é apenas para validação
    const { confirmPassword, ...dataToSave } = data;
    setStateFormData(dataToSave);
    await onFinish(dataToSave);
  };

  // Garante que o formulário é resetado se os dados iniciais mudarem
  useEffect(() => {
    reset(formData);
  }, [reset, formData]);

  // Função auxiliar para formatar os dados de endereço
  const formatAddress = (address: BusinessData["address"]) => {
    const { rua, numero, bairro, cidade, estado, cep, complemento } = address;
    if (!rua) return "Endereço não preenchido.";
    if (complemento) {
      return `${rua}, ${numero}, ${complemento} - ${bairro}, ${cidade}/${estado} (${cep})`;
    }
    return `${rua}, ${numero} - ${bairro}, ${cidade}/${estado} (${cep})`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Container principal */}
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3 lg:gap-8">
        {/* FORM - Coluna de Dados de Acesso (Mantida) */}
        <div className="bg-fundo3 rounded-xl p-6 shadow-lg md:col-span-2 md:p-10">
          <h1 className="text-texto border-texto/10 mb-10 border-b pb-3 text-center text-3xl font-extrabold">
            Crie seu Acesso de Administrador
          </h1>

          <div className="space-y-6">
            {/* Nome */}
            <div className="w-full space-y-2">
              <Label className="text-texto/80 font-semibold">
                Nome Completo
              </Label>
              <Input
                placeholder="Seu Nome"
                className="bg-fundo border-fundo/50 focus:border-cor1 border-2 p-3 transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="w-full space-y-2">
              <Label className="text-texto/80 font-semibold">E-mail</Label>
              <Input
                type="email"
                placeholder="email@suaempresa.com"
                className="bg-fundo border-fundo/50 focus:border-cor1 border-2 p-3 transition-colors"
                {...register("email")}
              />
              <span className="text-texto/60 block text-xs">
                Este será seu login de administrador.
              </span>
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="w-full space-y-2">
              <Label className="text-texto/80 font-semibold">Senha</Label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="bg-fundo border-fundo/50 focus:border-cor1 border-2 p-3 transition-colors"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Confirme sua Senha */}
            <div className="w-full space-y-2">
              <Label className="text-texto/80 font-semibold">
                Confirme sua senha
              </Label>
              <Input
                type="password"
                placeholder="Repita a senha acima"
                className="bg-fundo border-fundo/50 border-2 p-3 transition-colors focus:border-green-500"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Botões - Ações */}
          <div className="border-texto/10 mt-10 flex justify-between gap-3 border-t pt-4">
            <Button
              type="button"
              onClick={() => setStateStep((prev) => prev - 1)}
              className="cursor-pointer rounded-lg bg-gray-400 px-6 py-3 text-white transition-colors hover:bg-gray-800/50"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer rounded-lg bg-green-600 px-8 py-3 font-semibold shadow-md transition-colors hover:bg-green-700"
            >
              Próximo
            </Button>
          </div>
        </div>

        {/* LADO DIREITO - MINI RESUMO DO CHECKOUT 🚀 */}
        <div className="bg-fundo3 border-texto/10 sticky top-8 space-y-6 self-start rounded-xl border p-6 shadow-lg">
          <h2 className="text-texto border-texto/10 border-b pb-3 text-center text-xl font-bold">
            Resumo do Cadastro
          </h2>

          {/* Informações do Plano */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-green-700">
              <Sparkles className="h-5 w-5" /> Plano
            </h3>
            {selectedPlan ? (
              <>
                <p className="text-texto ml-7 text-xl font-bold">
                  {selectedPlan.name}
                </p>
                {"price" in selectedPlan &&
                  selectedPlan.price !== undefined && (
                    <p className="text-texto/80 ml-7 text-sm">
                      {formatR$(selectedPlan.price)} / mês
                    </p>
                  )}
              </>
            ) : (
              <p className="ml-7 text-sm text-red-500">Plano não encontrado.</p>
            )}
          </div>

          <Separator className="bg-texto/10" />

          {/* Informações da Empresa */}
          <div className="space-y-2">
            <h3 className="text-texto flex items-center gap-2 text-lg font-semibold">
              <Building2 className="text-texto/80 h-5 w-5" /> Empresa
            </h3>
            <ul className="text-texto/90 ml-7 space-y-1 text-sm">
              <li>
                <span className="font-semibold">Nome:</span>{" "}
                {businessData.name || "N/A"}
              </li>
              <li>
                <span className="font-semibold">URL:</span>{" "}
                {businessData.slug ? `chefros.com/${businessData.slug}` : "N/A"}
              </li>
              <li>
                <span className="font-semibold">Doc:</span>{" "}
                {businessData.document || "N/A"}
              </li>
              <li>
                <span className="font-semibold">Segmento:</span>{" "}
                {segments.find((s) => s.value === businessData.segment)
                  ?.label || "N/A"}
              </li>
              <li className="pt-2">
                <span className="font-semibold">Endereço:</span>
                <p className="text-texto/70 mt-1 text-xs wrap-break-word">
                  {formatAddress(businessData.address)}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

const PaymentComponent = ({
  stripe,
  stripeInfo,
  metaData,
}: {
  stripe: any;
  stripeInfo: { id: string; client_secret: string } | null;
  metaData: MetaData | {};
}) => {
  return (
    <>
      {stripeInfo && (
        <div className="bg-fundo mt-2 flex items-start justify-center">
          <div className="w-full overflow-hidden rounded-xl">
            <EmbeddedCheckoutProvider
              stripe={stripe}
              options={{ clientSecret: stripeInfo.client_secret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const params = use(searchParams);
  const [planoId, setPlanoId] = useState<string | null>(params.plano || null);
  const [stripeInfo, setStripeInfo] = useState<{
    id: string;
    client_secret: string;
  } | null>(null);
  const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
  const steps = [
    {
      id: 0,
      label: "Plano",
      icon: Sparkles,
    },
    {
      id: 1,
      label: "Empresa",
      icon: Building2,
    },
    {
      id: 2,
      label: "Acesso",
      icon: User,
    },
    {
      id: 3,
      label: "Pagamento",
      icon: CreditCard,
    },
  ];
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    phone: "",
    slug: "",
    document: "",
    segment: "",
    address: {
      cep: "",
      numero: "",
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    name: "",
    email: "",
    password: "",
  });
  const [metaData, setMetaData] = useState<MetaData | {}>({});

  useEffect(() => {
    if (planoId) {
      setCurrentStep(1);
    }
  }, [planoId]);

  const handlePartialCheckout = async (employee: EmployeeData) => {
    if (!planoId || !businessData || !employee) return;
    try {
      const result = await subscriptionService.partialCheckout(
        planoId,
        businessData,
        employee,
      );
      if (result.success && result.data) {
        const { businessId, subscriptionId, employeeId } = result.data;

        setMetaData(result.data);

        const stripeResult = await stripeService.createSession(planoId, {
          businessId,
          subscriptionId,
          employeeId,
        });
        if (stripeResult.success && stripeResult.data) {
          setStripeInfo(stripeResult.data);
          setCurrentStep(3); // vai para pagamento
          return;
        }
      }
      toast.error("Erro ao prosseguir para pagamento.");
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao finalizar cadastro");
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PlanoComponent
            setStatePlano={setPlanoId}
            setStateStep={setCurrentStep}
          />
        );
      case 1:
        return (
          <EmpresaComponent
            formData={businessData}
            setStateFormData={setBusinessData}
            planoId={planoId || "2"}
            setStatePlanId={setPlanoId}
            setStateStep={setCurrentStep}
          />
        );
      case 2:
        return (
          <AccessComponent
            formData={employeeData}
            setStateFormData={setEmployeeData}
            setStateStep={setCurrentStep}
            planoId={planoId || "2"}
            businessData={businessData}
            onFinish={handlePartialCheckout}
          />
        );
      case 3:
        return (
          <PaymentComponent
            stripe={stripe}
            stripeInfo={stripeInfo}
            metaData={metaData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-fundo flex flex-1">
      <main className="container mx-auto min-h-screen max-w-7xl px-2 py-4">
        <header className="bg-fundo3 rounded-md shadow-md">
          {/* Mobile View - Stepper Compacto */}
          <div className="block px-4 py-4 md:hidden">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-texto/80 text-xs font-semibold">
                  Etapa {currentStep + 1} de {steps.length}
                </span>
                <span className="text-texto/60 text-xs font-medium">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="from-cor1 to-cor2 h-full bg-linear-to-r transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Step Info */}
            <div className="flex items-center gap-3">
              <div className="bg-cor1 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg">
                {React.createElement(steps[currentStep].icon, {
                  className: "h-5 w-5",
                })}
              </div>
              <div>
                <p className="text-texto text-sm font-bold">
                  {steps[currentStep].label}
                </p>
                <p className="text-texto/60 text-xs">
                  {currentStep === 0 && "Escolha seu plano"}
                  {currentStep === 1 && "Dados da sua empresa"}
                  {currentStep === 2 && "Crie seu acesso"}
                  {currentStep === 3 && "Finalize o pagamento"}
                  {currentStep === 4 && "Tudo pronto!"}
                </p>
              </div>
            </div>

            {/* Mini Steps Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;

                return (
                  <div
                    key={step.id}
                    className={`h-2 rounded-full transition-all ${
                      isCompleted
                        ? "w-8 bg-green-600"
                        : isActive
                          ? "bg-cor1 w-12"
                          : "w-2 bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                );
              })}
            </div>
          </div>
          {/* Desktop View - Stepper Completo */}
          <div className="hidden px-12 py-4 md:block">
            <div className="flex w-full items-center">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Circle */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                          isCompleted
                            ? "bg-green-600 text-white shadow-md"
                            : isActive
                              ? "bg-cor1 ring-cor1/20 text-white shadow-lg ring-4"
                              : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium whitespace-nowrap ${
                          isActive
                            ? "text-texto font-bold"
                            : isCompleted
                              ? "text-green-600"
                              : "text-texto/60"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Linha conectora (exceto para o último step) */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`mx-2 mb-4 flex h-1 w-full rounded transition-all ${
                          isCompleted
                            ? "bg-green-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
    </section>
  );
}
