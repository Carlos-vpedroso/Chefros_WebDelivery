"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Phone,
  Mail,
  Upload,
  Globe,
  Loader2,
  UploadCloud,
  MapPin,
  X,
  Check,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { BusinessContext } from "@/contexts/BusinessContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { businessService } from "@/services/business.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { success, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMask } from "@/hooks/useMask";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { HeaderDashboard } from "@/components/HeaderDashboard";

// =====================
//    ZOD SCHEMAS
// =====================
const enderecoSchema = z.object({
  cep: z.string().min(9, "CEP deve ter 9 dígitos").max(9),
  numero: z.string().min(1, "Número é obrigatório"),
  rua: z.string().min(1, "Rua é obrigatória"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "UF inválida").max(2),
});

const businessSchema = z.object({
  legalName: z.string().min(2, "Nome fantasia é obrigatório"),
  phone: z.string().min(8, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  address: enderecoSchema,
});

type BusinessFormData = z.infer<typeof businessSchema>;

interface ImageModalProps {
  type: "logo" | "banner";
  token: string;
  onSave: (type: "logo" | "banner", imageUrl: string) => Promise<void>;
  trigger?: React.ReactNode;
  id: string;
}

const ImageModal = ({ type, token, id, onSave, trigger }: ImageModalProps) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [open]);

  const handleFileChange = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido! Envie uma imagem PNG ou JPG.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageFile || !token || !id) return;

    setLoading(true);
    try {
      let result;
      result = await businessService.updateImage(token, id, type, imageFile);

      if (result.success && result.imageUrl) {
        await onSave(type, result.imageUrl);
        setOpen(false);
        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
          } atualizado com Sucesso!`,
        );
      } else {
        setOpen(false);
        console.error(`Erro ao salvar ${type}:`, result.error);
        toast.error(
          `Erro ao atualizar ${
            type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
          }!`,
        );
      }
    } catch (error) {
      toast.error(`Erro ao fazer upload da imagem`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setImageFile(null);
  };

  const handleUploadAreaClick = () => {
    document.getElementById("imageUpload")?.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="border-border/50 shadow-2xl sm:max-w-2xl">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="bg-primary/10 rounded-lg p-2">
              <ImageIcon className="text-primary h-6 w-6" />
            </div>
            {type === "logo" ? "Atualizar Logo" : "Atualizar Banner"}
          </DialogTitle>

          <DialogDescription className="text-muted-foreground text-base">
            {type === "logo"
              ? "Envie uma imagem quadrada de alta qualidade (recomendado: 500×500px)"
              : "Envie um banner em formato panorâmico (recomendado: 1920×600px)"}
          </DialogDescription>
        </DialogHeader>

        {/* Zona de Upload Melhorada */}
        <div
          onClick={handleUploadAreaClick}
          className="border-border/50 group hover:border-primary/50 hover:bg-accent/30 relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300"
        >
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {previewUrl ? (
            <div
              className="animate-in fade-in zoom-in relative w-full max-w-md duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-border/50 relative overflow-hidden rounded-xl border shadow-2xl">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={type === "logo" ? 300 : 600}
                  height={type === "logo" ? 300 : 200}
                  className={clsx(
                    "w-full cursor-default object-cover",
                    type === "logo" ? "aspect-square" : "aspect-3/1",
                  )}
                  unoptimized
                />
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(e);
                }}
                className="bg-destructive absolute -top-2 -right-2 cursor-pointer rounded-full p-1.5 text-white shadow-lg transition-transform hover:scale-110"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="bg-primary/10 border-primary/20 rounded-2xl border p-5 transition-all">
                <UploadCloud className="text-primary h-12 w-12" />
              </div>

              <div className="space-y-2">
                <p className="text-foreground text-base font-semibold">
                  <span className="text-primary">Clique para selecionar</span>{" "}
                  sua imagem
                </p>
                <p className="text-muted-foreground text-sm">
                  JPG, PNG, WebP — até 5MB
                </p>
              </div>
            </div>
          )}

          {/* input escondido */}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />
        </div>

        {/* Botões */}
        <div className="border-border/50 flex justify-end gap-3 border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="hover:bg-accent"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleUpload}
            disabled={!imageFile || loading}
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =====================
//  ANIMAÇÕES
// =====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

export default function ConfiguracoesDashboard() {
  const { businessInfo, setBusinessInfo } = useAuth(BusinessContext);
  const { accessToken } = useAuth(EmployeeContext);
  const { phone, cep } = useMask();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      legalName: "",
      phone: "",
      email: "",
      address: {
        cep: "",
        numero: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    },
  });

  useEffect(() => {
    if (!businessInfo) return;

    setValue("legalName", businessInfo.legalName ?? "");
    setValue("phone", phone(businessInfo.phone as string) ?? "");
    setValue("email", businessInfo.email ?? "");
    setValue("address.cep", cep(businessInfo.address?.cep) ?? "");
    setValue("address.numero", businessInfo.address?.numero ?? "");
    setValue("address.rua", businessInfo.address?.rua ?? "");
    setValue("address.bairro", businessInfo.address?.bairro ?? "");
    setValue("address.cidade", businessInfo.address?.cidade ?? "");
    setValue("address.estado", businessInfo.address?.estado ?? "");
  }, [businessInfo, setValue]);

  const cepValue = watch("address.cep");

  useEffect(() => {
    if (cepValue && cepValue.length === 9) {
      buscarCep(cepValue.replace(/\D/g, ""));
    }
  }, [cepValue]);

  const buscarCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setValue("address.rua", data.logradouro || "");
      setValue("address.bairro", data.bairro || "");
      setValue("address.cidade", data.localidade || "");
      setValue("address.estado", data.uf || "");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    if (!accessToken || !businessInfo) return;

    setLoading(true);

    const formattedData = {
      ...data,
      address: {
        ...data.address,
        cep: data.address.cep.replace(/\D/g, ""),
      },
    };

    try {
      const result = await businessService.update(
        accessToken,
        businessInfo.id,
        formattedData,
      );

      if (result.success && result.data) {
        setBusinessInfo(result.data);
        toast.success("Informações atualizadas com sucesso");
      } else {
        toast.error("Erro ao editar informações");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Melhorado */}
      <HeaderDashboard
        title="Informações da Empresa"
        subtitle="Gerencie os dados gerais e a identidade visual da sua empresa"
        icon={Building}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl space-y-6"
      >
        {/* Card de Imagens */}
        <Card className="border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <ImageIcon className="text-primary h-5 w-5" />
              <h2 className="text-foreground text-2xl font-bold">
                Identidade Visual
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* LOGO */}
              <motion.div
                variants={itemVariants}
                className="group border-border/50 bg-lienar-to-br from-background to-accent/30 hover:border-primary/50 relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl"
              >
                <Label className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-primary h-2 w-2 rounded-full" />
                  Logo da Empresa
                </Label>

                <div className="space-y-4">
                  <div className="bg-muted/50 border-border/50 group-hover:border-primary/30 relative mx-auto h-48 w-48 overflow-hidden rounded-2xl border-2 shadow-lg transition-all">
                    <Image
                      src={
                        businessInfo?.logoUrl ||
                        "https://placehold.co/500x500/ef4444/ffffff?text=Logo"
                      }
                      alt="Logo da Empresa"
                      width={500}
                      height={500}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex justify-center gap-2">
                    <ImageModal
                      type="logo"
                      token={accessToken || ""}
                      id={businessInfo?.id || ""}
                      trigger={
                        <Button
                          variant="outline"
                          className="hover:text-cor1 cursor-pointer gap-2 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Alterar Logo
                        </Button>
                      }
                      onSave={async (type, imageUrl) => {
                        if (!imageUrl) return;
                        setBusinessInfo((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            [type === "logo" ? "logoUrl" : "bannerUrl"]:
                              imageUrl,
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* BANNER */}
              <motion.div
                variants={itemVariants}
                className="group border-border/50 from-background to-accent/30 hover:border-primary/50 relative rounded-2xl border-2 bg-linear-to-br p-6 transition-all duration-300 hover:shadow-xl"
              >
                <Label className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-primary h-2 w-2 rounded-full" />
                  Banner da Empresa
                </Label>

                <div className="space-y-4">
                  <div className="bg-muted/50 border-border/50 group-hover:border-primary/30 relative h-48 w-full overflow-hidden rounded-2xl border-2 shadow-lg transition-all">
                    <Image
                      src={
                        businessInfo?.bannerUrl ||
                        "https://placehold.co/1920x600/858585/ffffff?text=Banner"
                      }
                      alt="Banner da Empresa"
                      width={1920}
                      height={600}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex justify-center gap-2">
                    <ImageModal
                      type="banner"
                      token={accessToken || ""}
                      id={businessInfo?.id || ""}
                      trigger={
                        <Button
                          variant="outline"
                          className="hover:text-cor1 cursor-pointer gap-2 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Alterar Banner
                        </Button>
                      }
                      onSave={async (type, imageUrl) => {
                        if (!imageUrl) return;
                        setBusinessInfo((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            [type === "logo" ? "logoUrl" : "bannerUrl"]:
                              imageUrl,
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Dados */}
        <Card className="border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Building className="text-primary h-5 w-5" />
              <h2 className="text-foreground text-2xl font-bold">
                Dados da Empresa
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Nome */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Building className="text-muted-foreground h-4 w-4" />
                    Nome da Empresa
                  </Label>
                  <Input
                    type="text"
                    value={businessInfo?.name || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </motion.div>

                {/* Nome Fantasia */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-sm font-medium">Nome Fantasia</Label>
                  <Input
                    {...register("legalName")}
                    className={errors.legalName && "border-destructive"}
                  />
                  {errors.legalName && (
                    <p className="text-destructive flex items-center gap-1 text-xs">
                      <X className="h-3 w-3" />
                      {errors.legalName.message}
                    </p>
                  )}
                </motion.div>

                {/* CNPJ */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-sm font-medium">Documento</Label>
                  <Input
                    type="text"
                    value={businessInfo?.document || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </motion.div>

                {/* URL */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="text-muted-foreground h-4 w-4" />
                    URL Personalizada
                  </Label>
                  <Input
                    type="text"
                    value={`chefros.com/${businessInfo?.slug}` || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </motion.div>

                {/* Telefone */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    Telefone
                  </Label>
                  <Input
                    {...register("phone")}
                    className={errors.phone && "border-destructive"}
                    onChange={(e) => setValue("phone", phone(e.target.value))}
                  />
                  {errors.phone && (
                    <p className="text-destructive flex items-center gap-1 text-xs">
                      <X className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    className={errors.email && "border-destructive"}
                  />
                  {errors.email && (
                    <p className="text-destructive flex items-center gap-1 text-xs">
                      <X className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Endereço */}
              <div className="border-border/50 border-t pt-6">
                <div className="mb-6 flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <h3 className="text-foreground text-xl font-bold">
                    Endereço
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* CEP */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-sm font-medium">CEP</Label>
                    <Input
                      maxLength={9}
                      {...register("address.cep", {
                        onChange: (e) => {
                          setValue("address.cep", cep(e.target.value));
                        },
                      })}
                      className={errors.address?.cep && "border-destructive"}
                      placeholder="00000000"
                    />
                    {errors.address?.cep && (
                      <p className="text-destructive flex items-center gap-1 text-xs">
                        <X className="h-3 w-3" />
                        {errors.address.cep.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Rua */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-2 md:col-span-2"
                  >
                    <Label className="text-sm font-medium">Rua</Label>
                    <Input
                      {...register("address.rua")}
                      className={errors.address?.rua && "border-destructive"}
                    />
                    {errors.address?.rua && (
                      <p className="text-destructive flex items-center gap-1 text-xs">
                        <X className="h-3 w-3" />
                        {errors.address.rua.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Número */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-sm font-medium">Número</Label>
                    <Input
                      {...register("address.numero")}
                      className={errors.address?.numero && "border-destructive"}
                    />
                    {errors.address?.numero && (
                      <p className="text-destructive flex items-center gap-1 text-xs">
                        <X className="h-3 w-3" />
                        {errors.address.numero.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Bairro */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-sm font-medium">Bairro</Label>
                    <Input
                      {...register("address.bairro")}
                      className={errors.address?.bairro && "border-destructive"}
                    />
                    {errors.address?.bairro && (
                      <p className="text-destructive flex items-center gap-1 text-xs">
                        <X className="h-3 w-3" />
                        {errors.address.bairro.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Cidade */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-sm font-medium">Cidade</Label>
                    <Input
                      {...register("address.cidade")}
                      className={errors.address?.cidade && "border-destructive"}
                    />
                    {errors.address?.cidade && (
                      <p className="text-destructive flex items-center gap-1 text-xs">
                        <X className="h-3 w-3" />
                        {errors.address.cidade.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Estado */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-sm font-medium">Estado (UF)</Label>
                    <Input
                      maxLength={2}
                      {...register("address.estado")}
                      className={`uppercase ${
                        errors.address?.estado && "border-destructive"
                      }`}
                      placeholder="MG"
                    />
                    {errors.address?.estado && (
                      <p className="text-destructive flex items-center gap-1 text-xs">
                        <X className="h-3 w-3" />
                        {errors.address.estado.message}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Botão de Salvar */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="bg-green-600 px-8 font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Salvando alterações...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
