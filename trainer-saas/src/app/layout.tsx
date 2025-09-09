import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
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
} from "@/components/ui/sidebar"; // Додано імпорти всіх компонентів Sidebar
import { AppContent } from "@/components/AppContent";
import { PanelLeft } from "lucide-react"; // Імпортуємо іконку PanelLeft

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TrainerPro - SaaS для персональних тренерів",
  description:
    "Професійна платформа для управління клієнтами, тренуваннями та розкладом персональних тренерів",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        <AuthProvider>
          <SidebarProvider>
            {/* Весь контент вашого макета, включаючи бічну панель та основну частину,
              має бути тут, всередині SidebarProvider. 
            */}
            <div className="flex">
              <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
                <SidebarHeader>
                  {/* Перевірте, чи SidebarInput існує, інакше використовуйте <Input /> */}
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
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}              </SidebarHeader>

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
