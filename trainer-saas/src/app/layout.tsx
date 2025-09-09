// src/app/layout.tsx
"use client"; // Client Component, бо ми використовуємо useState

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppContent } from "@/components/AppContent";
import { PanelLeft } from "lucide-react";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("panel"); // вкладки Sidebar

  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        <AuthProvider>
          <SidebarProvider>
            <div className="flex h-screen">
              <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
                <SidebarHeader>
                  <input placeholder="Пошук..." className="w-full p-2 border rounded" />
                </SidebarHeader>

                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuButton onClick={() => setActiveTab("panel")}>
                      <PanelLeft />
                      <span>Панель</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton onClick={() => setActiveTab("settings")}>
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

              <main className="flex-1 p-4 overflow-auto">
                {activeTab === "panel" && <div>Контент Панелі</div>}
                {activeTab === "settings" && <div>Контент Налаштувань</div>}
                <AppContent>{children}</AppContent>
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
