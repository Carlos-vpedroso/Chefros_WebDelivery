"use client";

import { HeaderDashboard } from "@/components/HeaderDashboard";
import { motion } from "framer-motion";
import {
  Tag,
  Gift,
  Percent,
  Plus,
  Trash,
  Check,
  Loader2,
  Minus,
  Info,
  AlertCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { comboAndPromoService } from "@/services/comboAndPromo.service";
import { BusinessContext } from "@/contexts/BusinessContext";
import { EmployeeContext } from "@/contexts/EmployeeContext";
import { toast } from "sonner";
import { cn, formatR$ } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";
import {
  Combo,
  ComboItemType,
  Promotion,
  PromotionItemType,
  PromotionType,
} from "@/types/product&category";
import { Badge } from "@/components/ui/badge";

type ComboFormItem = {
  type: ComboItemType;
  productId?: string;
  serviceId?: string;
  quantity: number;
};

type PromoFormItems = {
  type: PromotionItemType;
  productId?: string;
  serviceId?: string;
};

export default function ComboAndPromo() {
  const { businessInfo } = useAuth(BusinessContext);
  const { accessToken } = useAuth(EmployeeContext);
  const { products, combos, setCombos, promos, setPromos } =
    useAuth(DashboardContext);
  const [tab, setTab] = useState<"combos" | "promocoes">("combos");
  const [newComboOrPromo, setNewComboOrPromo] = useState<
    "Combo" | "Promo" | ""
  >("");
  const [comboEditing, setComboEditing] = useState<Combo | null>(null);
  const [formDataCombo, setFormDataCombo] = useState<{
    name: string;
    description: string;
    price: number;
  }>({
    name: "",
    description: "",
    price: 0,
  });
  const [promoEditing, setPromoEditing] = useState<Promotion | null>(null);
  const [formDataPromo, setFormDataPromo] = useState<{
    name: string;
    type: PromotionType;
    value: number;
  }>({ name: "", type: "PERCENTAGE", value: 0 });
  const [itemsPromo, setItemsPromo] = useState<PromoFormItems[]>([]);
  const [items, setItems] = useState<ComboFormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateNewPrice = (originalPrice: number) => {
    if (!formDataPromo.value || originalPrice <= 0) return originalPrice;

    let newPrice = originalPrice;

    if (formDataPromo.type === "PERCENTAGE") {
      newPrice = originalPrice - (originalPrice * formDataPromo.value) / 100;
    }

    if (formDataPromo.type === "FIXED_DISCOUNT") {
      newPrice = originalPrice - formDataPromo.value;
    }

    return Math.max(newPrice, 0);
  };

  // Adicionar produto à lista
  const addItem = (
    type: ComboItemType,
    productId?: string,
    serviceId?: string,
  ) => {
    // Validação por tipo
    if (type === "PRODUCT" && !productId) {
      console.error("productId é obrigatório para PRODUCT");
      return;
    }

    if (type === "SERVICE" && !serviceId) {
      console.error("serviceId é obrigatório para SERVICE");
      return;
    }

    // Evitar duplicidade
    const alreadyExists = items.some((item) => {
      if (type === "PRODUCT") {
        return item.type === "PRODUCT" && item.productId === productId;
      }

      if (type === "SERVICE") {
        return item.type === "SERVICE" && item.serviceId === serviceId;
      }

      return false;
    });

    if (alreadyExists) return;

    // Adiciona item corretamente
    setItems((prev) => [
      ...prev,
      {
        type,
        productId: type === "PRODUCT" ? productId : undefined,
        serviceId: type === "SERVICE" ? serviceId : undefined,
        quantity: 1,
      },
    ]);
  };
  const addItemPromo = (
    type: PromotionItemType,
    productId?: string,
    serviceId?: string,
  ) => {
    // Validação por tipo
    if (type === "PRODUCT" && !productId) {
      console.error("productId é obrigatório para PRODUCT");
      return;
    }

    if (type === "SERVICE" && !serviceId) {
      console.error("serviceId é obrigatório para SERVICE");
      return;
    }

    // Evitar duplicidade
    const alreadyExists = itemsPromo.some((item) => {
      if (type === "PRODUCT") {
        return item.type === "PRODUCT" && item.productId === productId;
      }

      if (type === "SERVICE") {
        return item.type === "SERVICE" && item.serviceId === serviceId;
      }

      return false;
    });

    if (alreadyExists) return;

    // Adiciona item corretamente
    setItemsPromo((prev) => [
      ...prev,
      {
        type,
        productId: type === "PRODUCT" ? productId : undefined,
        serviceId: type === "SERVICE" ? serviceId : undefined,
      },
    ]);
  };

  // Alterar quantidade
  const updateQuantity = (
    type: ComboItemType,
    id: string | undefined,
    quantity: number,
  ) => {
    if (!id) return;
    setItems((prev) =>
      prev.map((item) => {
        if (
          (type === "PRODUCT" &&
            item.type === "PRODUCT" &&
            item.productId === id) ||
          (type === "SERVICE" &&
            item.type === "SERVICE" &&
            item.serviceId === id)
        ) {
          return { ...item, quantity };
        }

        return item;
      }),
    );
  };

  // Remover item
  const removeItem = (type: ComboItemType, id: string | undefined) => {
    if (!id) return;
    setItems((prev) =>
      prev.filter((i) => {
        if (type === "PRODUCT" && i.type === "PRODUCT") {
          return i.productId !== id;
        }

        if (type === "SERVICE" && i.type === "SERVICE") {
          return i.serviceId !== id;
        }

        return true;
      }),
    );
  };
  const removeItemPromo = (type: PromotionItemType, id: string | undefined) => {
    if (!id) return;
    setItemsPromo((prev) =>
      prev.filter((i) => {
        if (type === "PRODUCT" && i.type === "PRODUCT") {
          return i.productId !== id;
        }

        if (type === "SERVICE" && i.type === "SERVICE") {
          return i.serviceId !== id;
        }

        return true;
      }),
    );
  };

  //Submit
  const handleSubmitCombo = async () => {
    if (!businessInfo?.id || !accessToken) return;

    setLoading(true);

    try {
      const payload = {
        name: formDataCombo.name,
        description: formDataCombo.description,
        price: formDataCombo.price,
        items,
      };

      const result = comboEditing
        ? await comboAndPromoService.updateCombo(
            businessInfo.slug,
            accessToken,
            comboEditing.id,
            payload,
          )
        : await comboAndPromoService.createCombo(
            businessInfo.id,
            accessToken,
            payload,
          );

      if (!result.success || !result.data) {
        toast.error(result.error || "Erro ao salvar combo");
        return;
      }

      if (comboEditing) {
        setCombos((prev) =>
          prev.map((c) =>
            c.id === comboEditing.id ? (result.data as Combo) : c,
          ),
        );
        toast.success("Combo atualizado com sucesso!");
      } else {
        setCombos([...combos, result.data]);
        toast.success("Combo criado com sucesso!");
      }

      // reset
      setItems([]);
      setFormDataCombo({ name: "", description: "", price: 0 });
      setComboEditing(null);
      setNewComboOrPromo("");
    } catch (err) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPromo = async () => {
    if (!businessInfo?.slug || !businessInfo?.id || !accessToken) return;

    setLoading(true);
    try {
      const payload = {
        name: formDataPromo.name,
        type: formDataPromo.type,
        value: formDataPromo.value,
        items: itemsPromo,
      };

      const result = promoEditing
        ? await comboAndPromoService.updatePromo(
            businessInfo.slug,
            accessToken,
            promoEditing.id,
            payload,
          )
        : await comboAndPromoService.createPromo(
            businessInfo.id,
            accessToken,
            payload,
          );

      if (!result.success || !result.data) {
        toast.error(result.error || "Erro ao salvar promoção");
        return;
      }

      if (promoEditing) {
        setPromos((prev) =>
          prev.map((c) =>
            c.id === promoEditing.id ? (result.data as Promotion) : c,
          ),
        );
        toast.success("Promoção atualizada com sucesso!");
      } else {
        setPromos([...promos, result.data]);
        toast.success("Promoção criada com sucesso!");
      }
      //reset
      setItemsPromo([]);
      setFormDataPromo({ name: "", type: "PERCENTAGE", value: 0 });
      setPromoEditing(null);
      setNewComboOrPromo("");
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCombo = async (id: string) => {
    if (!accessToken || !businessInfo) return;
    try {
      const result = await comboAndPromoService.deleteCombo(
        businessInfo?.slug,
        accessToken,
        id,
      );
      if (!result.success) {
        toast.error("Não foi possível deletar o Combo.");
      }
      setCombos(combos.filter((combo) => combo.id !== id));
      // reset
      setItems([]);
      setFormDataCombo({ name: "", description: "", price: 0 });
      setComboEditing(null);
      setNewComboOrPromo("");
      toast.success("Combo deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar combo:", error);
      toast.error("Erro de conexão ao deletar combo");
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!accessToken || !businessInfo) return;
    try {
      const result = await comboAndPromoService.deletePromo(
        businessInfo?.slug,
        accessToken,
        id,
      );
      if (!result.success) {
        toast.error("Não foi possível deletar a Promoção.");
      }
      setPromos(promos.filter((promo) => promo.id !== id));
      // reset
      setItemsPromo([]);
      setFormDataPromo({ name: "", type: "PERCENTAGE", value: 0 });
      setPromoEditing(null);
      setNewComboOrPromo("");
      toast.success("Promoção deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar Promoção:", error);
      toast.error("Erro de conexão ao deletar Promoção");
    }
  };

  const handleEdit = (type: "PROMO" | "COMBO", data: Combo | Promotion) => {
    if (type === "COMBO") {
      const combo = data as Combo;

      setFormDataCombo({
        name: combo.name,
        description: combo.description ?? "",
        price: Number(combo.price),
      });

      setItems(
        combo.items.map((item) => ({
          type: item.type,
          productId: item.productId ?? undefined,
          serviceId: item.serviceId ?? undefined,
          quantity: item.quantity,
        })),
      );

      setComboEditing(combo);
      setPromoEditing(null);
      setItemsPromo([]);
      setNewComboOrPromo("Combo");
      return;
    }

    // ---------------- PROMO ----------------
    const promo = data as Promotion;

    setFormDataPromo({
      name: promo.name,
      type: promo.type,
      value: promo.value ?? 0,
    });

    setItemsPromo(
      promo.items.map((item) => ({
        type: item.type,
        productId: item.productId ?? undefined,
        serviceId: item.serviceId ?? undefined,
      })),
    );

    setPromoEditing(promo);
    setComboEditing(null);
    setItems([]);
    setNewComboOrPromo("Promo");
  };

  // ---------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <HeaderDashboard
        title="Combos & Promoções"
        subtitle="Gerencie ofertas especiais, descontos e combos disponíveis no seu estabelecimento."
        icon={Tag}
        btns={
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setNewComboOrPromo("Combo")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Combo
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setNewComboOrPromo("Promo")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Promoção
            </Button>
          </div>
        }
      />
      {/* Novo Combo */}
      {newComboOrPromo === "Combo" && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4"
        >
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {!comboEditing ? "Cadastrar Novo Combo" : "Editar Combo"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* DADOS DO COMBO */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Nome do Combo</Label>
                  <Input
                    placeholder="Ex: Combo Burger Deluxe"
                    value={formDataCombo.name}
                    onChange={(e) =>
                      setFormDataCombo({
                        ...formDataCombo,
                        name: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Preço (R$)</Label>
                  <Input
                    placeholder="39.90"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formDataCombo.price === 0 ? "" : formDataCombo.price}
                    onChange={(e) =>
                      setFormDataCombo({
                        ...formDataCombo,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Ex: Combo especial com burger artesanal e bebida."
                  value={formDataCombo.description}
                  onChange={(e) =>
                    setFormDataCombo({
                      ...formDataCombo,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              {/* PRODUTOS DISPONÍVEIS */}
              <div>
                <Label>Adicionar Produtos</Label>

                <div className="mt-2 grid max-h-[320px] grid-cols-1 gap-3 overflow-y-auto rounded-md border p-3 sm:grid-cols-2">
                  {products?.map((p) => {
                    const selected = items.some((i) => i.productId === p.id);

                    return (
                      <div
                        key={p.id}
                        onClick={() => addItem("PRODUCT", p.id)}
                        className={`group hover:border-primary flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-md ${selected ? "border-primary bg-primary/5" : "bg-background"} `}
                      >
                        {/* IMAGEM */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={
                              p.imageUrl ??
                              "https://placehold.co/500x500/858585/ffffff?text=Produto"
                            }
                            alt={p.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        {/* CONTEÚDO */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="leading-tight font-medium">
                              {p.name}
                            </p>

                            {p.category && (
                              <p className="text-muted-foreground text-xs">
                                {p.category.name}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {selected ? (
                              <span className="text-primary text-xs font-medium">
                                Adicionado ao combo
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                Clique para adicionar
                              </span>
                            )}

                            <Plus
                              size={16}
                              className={`transition ${selected ? "text-primary" : "text-muted-foreground"} group-hover:text-primary`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LISTA DE ITENS DO COMBO */}
              {items.length > 0 && (
                <div>
                  <Label>Itens Selecionados</Label>
                  <div className="mt-3 space-y-3">
                    {items.map((item) => {
                      const product = products.find(
                        (p: any) => p.id === item.productId,
                      );

                      return (
                        <div
                          key={item.productId}
                          className="group bg-background flex items-center justify-between gap-4 rounded-xl border p-3 transition hover:shadow-md"
                        >
                          {/* ESQUERDA — Imagem + Infos */}
                          <div className="flex items-center gap-3">
                            {/* Imagem */}
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                              <Image
                                src={
                                  product?.imageUrl ??
                                  "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                }
                                alt={product?.name || "Foto do Produto"}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>

                            {/* Infos */}
                            <div className="space-y-0.5">
                              <p className="text-sm leading-tight font-semibold">
                                {product?.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {product?.category?.name}
                              </p>
                            </div>
                          </div>

                          {/* DIREITA — Quantidade + Ações */}
                          <div className="flex items-center gap-2">
                            {/* Quantidade */}
                            <div className="flex items-center rounded-lg border">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    "PRODUCT",
                                    item.productId,
                                    Math.max(1, item.quantity - 1),
                                  )
                                }
                              >
                                <Minus className="h-3 w-3 text-red-600" />
                              </Button>

                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    "PRODUCT",
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <Plus className="h-3 w-3 text-green-600" />
                              </Button>
                            </div>

                            {/* Remover */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                removeItem("PRODUCT", item.productId)
                              }
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AÇÕES */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    //reset do form
                    setItems([]);
                    setFormDataCombo({ name: "", description: "", price: 0 });
                    setComboEditing(null);
                    setNewComboOrPromo("");
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleSubmitCombo}
                  className="flex min-w-[120px] items-center bg-green-600 hover:bg-green-700"
                  disabled={loading}
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
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/*  Nova Promo */}
      {newComboOrPromo === "Promo" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="px-4"
        >
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {promoEditing ? "Editar Promoção" : "Nova Promoção"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="container mx-auto w-full">
                <div className="space-y-4">
                  <div>
                    <Label>Nome da Promoção</Label>
                    <Input
                      placeholder="Ex: Black Friday"
                      value={formDataPromo.name}
                      onChange={(e) =>
                        setFormDataPromo({
                          ...formDataPromo,
                          name: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tipo de Desconto</Label>
                    <div className="mt-1 flex gap-4">
                      <Button
                        variant={
                          formDataPromo.type === "PERCENTAGE"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setFormDataPromo({
                            ...formDataPromo,
                            type: "PERCENTAGE",
                          })
                        }
                      >
                        Porcentagem (%)
                      </Button>
                      <Button
                        variant={
                          formDataPromo.type === "FIXED_DISCOUNT"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setFormDataPromo({
                            ...formDataPromo,
                            type: "FIXED_DISCOUNT",
                          })
                        }
                      >
                        Valor Fixo (R$)
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>
                        {formDataPromo.type === "PERCENTAGE"
                          ? "% à ser aplicada"
                          : "Valor do Desconto"}
                      </Label>
                      <Input
                        type="number"
                        placeholder={
                          formDataPromo.type === "PERCENTAGE" ? "5" : "10,00"
                        }
                        value={formDataPromo.value || ""}
                        onChange={(e) =>
                          setFormDataPromo({
                            ...formDataPromo,
                            value:
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Badge className="from-cor1 to-cor2 text-texto flex items-start gap-2 rounded-lg border-none bg-linear-to-br p-2 text-xs">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>O desconto será aplicado no carrinho.</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label>Aplicar aos Produtos ({itemsPromo.length})</Label>
                <div className="grid max-h-[300px] grid-cols-1 gap-2 overflow-y-auto rounded-xl border p-2 md:grid-cols-2">
                  {products.map((p) => {
                    const isSelected = itemsPromo.some(
                      (item) =>
                        item.type === "PRODUCT" && item.productId === p.id,
                    );
                    return (
                      <div
                        key={p.id}
                        onClick={() => addItemPromo("PRODUCT", p.id)}
                        className={`group hover:border-primary flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-md ${isSelected ? "border-primary bg-primary/5" : "bg-background"} `}
                      >
                        {/* IMAGEM */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={
                              p.imageUrl ??
                              "https://placehold.co/500x500/858585/ffffff?text=Produto"
                            }
                            alt={p.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        {/* CONTEÚDO */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="leading-tight font-medium">
                              {p.name}
                            </p>

                            {p.category && (
                              <p className="text-muted-foreground text-xs">
                                {p.category.name}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {isSelected ? (
                              <span className="text-primary text-xs font-medium">
                                Adicionado a Promoção
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                Clique para adicionar
                              </span>
                            )}

                            <Plus
                              size={16}
                              className={`transition ${isSelected ? "text-primary" : "text-muted-foreground"} group-hover:text-primary`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* LISTA DE ITENS DA PROMO */}
              {itemsPromo.length > 0 && (
                <div>
                  <Label>Itens Selecionados</Label>
                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {itemsPromo.map((item) => {
                      const product = products.find(
                        (p: any) => p.id === item.productId,
                      );

                      const originalPrice = Number(product?.price);
                      const newPrice = calculateNewPrice(originalPrice);

                      return (
                        <div
                          key={item.productId}
                          className="group bg-background flex items-center justify-between gap-4 rounded-xl border p-4 transition hover:shadow-md"
                        >
                          {/* ESQUERDA — Imagem + Infos */}
                          <div className="flex items-center gap-3">
                            {/* Imagem */}
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                              <Image
                                src={
                                  product?.imageUrl ??
                                  "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                }
                                alt={product?.name || "Foto do Produto"}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>

                            {/* Infos */}
                            <div className="space-y-0.5">
                              <p className="text-sm leading-tight font-semibold">
                                {product?.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {product?.category?.name}
                              </p>

                              {/* Preço original */}
                              <p className="text-muted-foreground text-xs line-through">
                                {formatR$(originalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* DIREITA — Preço novo + ação */}
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                              <span className="text-muted-foreground text-xs">
                                Novo preço
                              </span>

                              <span className="text-lg font-bold text-green-600">
                                {formatR$(newPrice)}
                              </span>

                              {/* Badge de desconto */}
                              {formDataPromo.value > 0 && (
                                <span className="text-xs font-medium text-green-700">
                                  {formDataPromo.type === "PERCENTAGE"
                                    ? `-${formDataPromo.value}%`
                                    : `-${formatR$(formDataPromo.value)}`}
                                </span>
                              )}
                            </div>

                            {/* Remover */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeItemPromo("PRODUCT", item.productId)
                              }
                            >
                              <Trash className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    //reset do form
                    setItemsPromo([]);
                    setFormDataPromo({
                      name: "",
                      type: "PERCENTAGE",
                      value: 0,
                    });
                    setPromoEditing(null);
                    setNewComboOrPromo("");
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleSubmitPromo}
                  className="flex min-w-[120px] items-center bg-green-600 hover:bg-green-700"
                  disabled={loading}
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
            </CardContent>
          </Card>
        </motion.div>
      )}
      <div className={`space-y-6 px-4 ${newComboOrPromo ? "hidden" : "block"}`}>
        {/* TABS -------------------------------------------------------------- */}
        <div className="flex gap-3 border-b">
          <Button
            onClick={() => setTab("combos")}
            variant="ghost"
            className={cn(
              "cursor-pointer rounded-none",
              `${tab === "combos" ? "text-cor1 border-cor1 border-b-2" : "text-texto/60"}`,
            )}
          >
            <Gift size={18} /> Combos
          </Button>

          <Button
            onClick={() => setTab("promocoes")}
            variant="ghost"
            className={cn(
              "cursor-pointer rounded-none",
              `${tab === "promocoes" ? "text-cor1 border-cor1 border-b-2" : "text-texto/60"}`,
            )}
          >
            <Percent size={18} /> Promoções
          </Button>
        </div>

        {/* LISTAGEM --------------------------------------------------------- */}
        <div
          key={tab}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {tab === "combos" &&
            (combos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="col-span-full"
              >
                <Card className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                  <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <Gift className="text-muted-foreground h-8 w-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      Nenhum combo cadastrado
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Crie combos para atrair mais clientes e aumentar suas
                      vendas.
                    </p>
                  </div>

                  <Button
                    className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => setNewComboOrPromo("Combo")}
                  >
                    Criar Combo
                  </Button>
                </Card>
              </motion.div>
            ) : (
              combos.map((combo) => (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                  key={combo.id}
                >
                  <Card className="flex h-full flex-1 transition hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {combo.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {combo.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <p className="text-primary text-xl font-bold">
                        {formatR$(Number(combo.price))}
                      </p>

                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground font-medium">
                          Produtos incluídos
                        </p>

                        <div className="grid max-h-85 grid-cols-2 gap-2 overflow-y-auto">
                          {combo.items.map((p, i) => (
                            <div
                              key={i}
                              className="group border-border bg-background flex flex-col gap-2 rounded-xl border p-2 transition hover:shadow-sm"
                            >
                              {/* Imagem */}
                              <div className="relative aspect-square max-h-30 overflow-hidden rounded-md border">
                                <Image
                                  src={
                                    p.product?.imageUrl ??
                                    "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                  }
                                  alt={p.product?.name || "Foto do Produto"}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  unoptimized
                                />
                              </div>

                              {/* Info */}
                              <div className="flex items-center justify-between gap-2">
                                <p className="line-clamp-2 font-medium">
                                  {p.product?.name}
                                </p>

                                <span className="bg-muted rounded-md px-2 py-0.5 text-xs font-semibold">
                                  x{p.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex w-full flex-1 items-end justify-between gap-2">
                      <DeleteModal
                        trigger={
                          <Button className="bg-red-500 text-white hover:bg-red-900">
                            <Trash className="mr-1 h-4 w-4" />
                            Excluir
                          </Button>
                        }
                        onConfirm={() => handleDeleteCombo(combo.id)}
                      />

                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => handleEdit("COMBO", combo)}
                      >
                        Editar Combo
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ))}

          {tab === "promocoes" &&
            (promos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="col-span-full"
              >
                <Card className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                  <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <Percent className="text-muted-foreground h-8 w-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      Nenhuma promoção cadastrada
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Crie promoções para atrair mais clientes e aumentar suas
                      vendas.
                    </p>
                  </div>

                  <Button
                    className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => setNewComboOrPromo("Promo")}
                  >
                    Criar promoção
                  </Button>
                </Card>
              </motion.div>
            ) : (
              promos.map((promo) => (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                  key={promo.id}
                >
                  <Card className="group relative flex flex-col justify-between overflow-hidden transition hover:shadow-md">
                    {/* HEADER */}
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight font-semibold">
                          {promo.name}
                        </CardTitle>

                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {promo.type === "PERCENTAGE"
                            ? "Porcentagem"
                            : "Valor fixo"}
                        </Badge>
                      </div>

                      {/* VALOR DO DESCONTO */}
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-green-600">
                          {promo.type === "PERCENTAGE"
                            ? `${promo.percentage}%`
                            : formatR$(Number(promo.value))}
                        </span>

                        <span className="text-muted-foreground text-sm">
                          de desconto
                        </span>
                      </div>
                    </CardHeader>

                    {/* CONTEÚDO */}
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Aplicado em
                        </span>
                        <span className="font-medium">
                          {promo.items.length} produto(s)
                        </span>
                      </div>

                      {/* PRODUTOS */}
                      <div className="flex flex-wrap gap-2">
                        {promo.items.slice(0, 4).map((item, i) => (
                          <div
                            key={i}
                            className="relative h-10 w-10 overflow-hidden rounded-lg border"
                          >
                            <Image
                              src={
                                item.product?.imageUrl ??
                                "https://placehold.co/500x500/858585/ffffff?text=Produto"
                              }
                              alt={item.product?.name || "Produto"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ))}

                        {promo.items.length > 4 && (
                          <div className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-medium">
                            +{promo.items.length - 4}
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* FOOTER */}
                    <CardFooter className="flex w-full flex-1 items-end justify-between gap-2">
                      <DeleteModal
                        trigger={
                          <Button className="bg-red-500 text-white hover:bg-red-900">
                            <Trash className="mr-1 h-4 w-4" />
                            Excluir
                          </Button>
                        }
                        onConfirm={() => handleDeletePromo(promo.id)}
                      />

                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => handleEdit("PROMO", promo)}
                      >
                        Editar Promoção
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ))}
        </div>
      </div>
    </motion.div>
  );
}
