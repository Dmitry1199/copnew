import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppContent } from "@/components/AppContent";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInput,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { PanelLeft, Users, Calendar } from "lucide-react";

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
            <div className="flex min-h-screen">
              <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
                <SidebarHeader>
                  <SidebarInput placeholder="Пошук..." />
                </SidebarHeader>

                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuButton href="/">
                      <PanelLeft />
                      <span>Панель</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton href="/clients">
                      <Users />
                      <span>Клієнти</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton href="/calendar">
                      <Calendar />
                      <span>Календар</span>
                    </SidebarMenuButton>
                  </SidebarMenu>
                </SidebarContent>

                <SidebarFooter>
                  <SidebarTrigger />
                  <div className="p-2 text-center text-xs text-gray-500">
                    Footer контент
                  </div>
                </SidebarFooter>
              </Sidebar>
              <main className="flex-1">
                <AppContent>
                  {children}
                </AppContent>
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
