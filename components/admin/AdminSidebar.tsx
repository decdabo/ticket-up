"use client";

import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptTextIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDaysIcon },
  { href: "/admin/ordenes", label: "Órdenes", icon: ReceiptTextIcon },
  { href: "/admin/asistentes", label: "Asistentes", icon: UsersIcon },
];

export function AdminSidebar({ user }: { user: { name: string; role: string } }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const close = () => setOpenMobile(false);

  // El borde lo agrega shadcn con un prefijo group-data: se pinta del color del panel.
  return (
    <Sidebar className="border-sidebar">
      <SidebarHeader className="px-4 pt-6 pb-4">
        <Link href="/admin" onClick={close} className="flex items-center gap-2.5 min-h-11">
          <span className="font-display font-bold text-xl tracking-[-1px] text-gold-500 border border-gold-700 px-1.5 leading-none py-0.5">
            DC
          </span>
          <span className="font-display font-semibold text-lg text-ivory">Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      size="lg"
                      className="h-11 px-3 text-base data-active:border-l-[3px] data-active:border-gold-500 data-active:font-semibold"
                    >
                      <Link href={href} onClick={close} aria-current={active ? "page" : undefined}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                {/* Pantalla pendiente de diseño (no entra en las 13 de la maqueta). */}
                <SidebarMenuButton size="lg" className="h-11 px-3 text-base" aria-disabled="true">
                  <UserCogIcon />
                  <span>Usuarios</span>
                  <Badge variant="outline" className="ml-auto border-sidebar-border text-on-ink-muted text-[10px] tracking-[1px]">
                    PRONTO
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border px-4 py-4 text-[13px] text-on-ink-muted">
        <span className="text-ivory">{user.name}</span>
        <span>{user.role === "owner" ? "Owner" : "Staff"}</span>
        <Link href="/admin/login" className="mt-1.5 inline-flex items-center gap-1.5 text-gold-300 underline">
          <LogOutIcon className="size-3.5" aria-hidden />
          Cerrar sesión
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
