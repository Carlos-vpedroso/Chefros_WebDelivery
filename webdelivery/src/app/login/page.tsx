"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Meteors } from "@/components/ui/meteors";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { employeeService } from "@/services/employee.service";

const companyLoginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  // Você poderia adicionar um campo para 'código da empresa' ou 'CNPJ' aqui se fosse necessário.
  // Ex: companyCode: z.string().min(3, { message: "Código da empresa inválido." }),
});

type CompanyLoginFormValues = z.infer<typeof companyLoginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CompanyLoginFormValues>({
    resolver: zodResolver(companyLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: CompanyLoginFormValues) => {
    setIsLoading(true);
    try {
      const login = await employeeService.login(values.email, values.password);

      if (!login.success) {
        toast.error("Email ou senha incorretos.");
        return;
      }
      if (login.data) {
        router.push(login.data.route);
      }
    } catch (err) {
      toast.error("Falha de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-fundo relative flex min-h-screen flex-col overflow-hidden">
      {/* Meteors Background */}
      <Meteors number={20} />

      {/* Header */}
      <header className="bg-fundo/80 sticky top-0 z-50 w-full border-b border-gray-200/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="from-cor1 to-cor2 bg-linear-to-tr bg-clip-text text-2xl font-bold text-transparent"
            >
              Chefros<span className="text-texto">Platform</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/checkout">
                <Button variant="ghost" className="cursor-pointer">
                  Criar Conta
                </Button>
              </Link>
              <AnimatedThemeToggler />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden space-y-6 lg:block"
          >
            <div className="space-y-4">
              <h1 className="text-texto text-5xl leading-tight font-bold">
                Bem-vindo de volta à{" "}
                <span className="from-cor1 to-cor2 bg-linear-to-r bg-clip-text text-transparent">
                  Chefros
                </span>
              </h1>
              <p className="text-texto/60 text-xl leading-relaxed">
                Acesse sua conta e continue gerenciando seu negócio com a
                plataforma mais completa do mercado.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                {
                  title: "Gestão Completa",
                  desc: "PDV, estoque, finanças e muito mais",
                },
                {
                  title: "Delivery Integrado",
                  desc: "Gerencie entregas em tempo real",
                },
                {
                  title: "IA Personalizada",
                  desc: "Insights e automações inteligentes",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  className="bg-fundo2 border-border hover:border-cor1/50 flex items-start gap-4 rounded-xl border p-4 transition-colors"
                >
                  <div className="bg-cor1 mt-2 h-2 w-2 rounded-full" />
                  <div>
                    <h3 className="text-texto font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-texto/60 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border bg-card/95 shadow-2xl backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6 text-center">
                <h2 className="text-texto text-3xl font-bold">
                  Acesse sua conta
                </h2>
                <p className="text-texto/60">
                  Digite suas credenciais para continuar
                </p>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-5">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="email"
                            className="text-texto text-sm font-medium"
                          >
                            E-mail da Empresa
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="text-texto/40 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...field}
                                className="bg-fundo border-border text-texto placeholder:text-texto/40 focus:border-cor1 focus:ring-cor1 h-12 pl-10 transition-colors"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />{" "}
                          {/* Exibe mensagens de erro de validação */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="password"
                            className="text-texto text-sm font-medium"
                          >
                            Senha
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="text-texto/40 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="bg-fundo border-border text-texto placeholder:text-texto/40 focus:border-cor1 focus:ring-cor1 h-12 pr-10 pl-10 transition-colors"
                                disabled={isLoading}
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-texto/40 hover:text-texto absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                                disabled={isLoading}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />{" "}
                          {/* Exibe mensagens de erro de validação */}
                        </FormItem>
                      )}
                    />

                    {/* Remember Me & Forgot Password */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                          className="data-[state=checked]:bg-cor1 data-[state=checked]:border-cor1"
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-texto/70 cursor-pointer text-sm"
                        >
                          Lembrar-me
                        </Label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-cor1 hover:text-cor2 text-sm font-medium transition-colors"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4">
                    {/* Login Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="from-cor1 to-cor2 h-12 w-full cursor-pointer bg-linear-to-r text-base font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          Entrar
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="border-border w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card text-texto/60 px-2">
                          Ou continue com
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        className="border-border hover:bg-fundo2 h-12 cursor-pointer"
                      >
                        <FaGoogle />
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        className="border-border hover:bg-fundo2 h-12 cursor-pointer"
                      >
                        <FaFacebook />
                        Facebook
                      </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="pt-4 text-center">
                      <p className="text-texto/60 text-sm">
                        Não tem uma conta?{" "}
                        <Link
                          href="/checkout"
                          className="text-cor1 hover:text-cor2 font-semibold transition-colors"
                        >
                          Criar conta
                        </Link>
                      </p>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-texto/60 mt-6 text-center text-sm"
            >
              <p>
                Ao continuar, você concorda com nossos{" "}
                <Link href="#" className="text-cor1 hover:text-cor2 underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="#" className="text-cor1 hover:text-cor2 underline">
                  Política de Privacidade
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border bg-fundo/80 relative z-10 border-t py-6 backdrop-blur-md">
        <div className="text-texto/60 container mx-auto px-4 text-center text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="from-cor1 to-cor2 bg-linear-to-tr bg-clip-text font-semibold text-transparent">
              Chefros
            </span>
            Platform. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
