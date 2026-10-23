import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentAdmin } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Divercity" },
  robots: { index: false },
};

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  // TODO(Fase 3): verifySession() de la DAL; redirige a /admin/login sin sesión.
  const user = await getCurrentAdmin();

  // `defaultOpen` fijo: leer la cookie del estado del sidebar volvería dinámico el layout.
  return (
    <SidebarProvider defaultOpen className="flex-1">
      <AdminSidebar user={user} />
      <SidebarInset className="bg-admin min-w-0">
        <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 bg-ink px-2 py-1.5">
          <SidebarTrigger className="size-11 text-ivory hover:bg-ink-soft hover:text-gold-300" />
          <span className="font-display font-semibold text-ivory">Divercity Admin</span>
        </header>
        <div className="p-4 md:p-8 flex flex-col gap-5 md:gap-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
