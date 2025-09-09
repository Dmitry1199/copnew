import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/sidebar";
import { PanelLeft } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TrainerPro - SaaS для персональних тренерів",
  description:
    "Професійна платформа для управління клієнтами, тренуваннями та розкладом персональних тренерів",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        <AuthProvider>
          <SidebarProvider>
            <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
              <SidebarHeader>
                <SidebarInput placeholder="Пошук..." />
              </SidebarHeader>

              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuButton>
                    <PanelLeft />
                    <span>Панель</span>
                  </SidebarMenuButton>
                  <SidebarMenuButton>
                    <PanelLeft />
                    <span>Налаштування</span>
                  </SidebarMenuButton>
                </SidebarMenu>
              </SidebarContent>

              <SidebarFooter>
                <div>Footer контент</div>
              </SidebarFooter>

              <SidebarTrigger />
            </Sidebar>

            <main className="flex-1">
              {children}
            </main>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
