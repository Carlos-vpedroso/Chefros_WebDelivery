import type { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chefros",
  description: "Chefros é uma plataforma SaaS completa que integra PDV, gestão, vendas online, catálogo de produtos e delivery para simplificar a operação do seu negócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${workSans.variable} antialiased`}>
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
