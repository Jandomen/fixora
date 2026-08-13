"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Package,
  PackagePlus,
  Smartphone,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import { logout } from "@/actions/auth.actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { Session } from "@/lib/auth";

const menuItems = [
  {
    group: "General",
    items: [
      { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
      { href: "/ordenes", label: "Órdenes", icon: ClipboardList },
      { href: "/ordenes/nueva", label: "Nueva orden", icon: FilePlus2 },
    ],
  },
  {
    group: "Clientes y equipos",
    items: [
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/clientes/nuevo", label: "Nuevo cliente", icon: UserPlus },
      { href: "/equipos", label: "Equipos", icon: Smartphone },
      { href: "/equipos/nuevo", label: "Nuevo equipo", icon: Wrench },
    ],
  },
  {
    group: "Inventario",
    items: [
      { href: "/inventario", label: "Productos", icon: Package },
      { href: "/inventario/nuevo", label: "Nuevo producto", icon: PackagePlus },
    ],
  },
];

export function AppSidebar({ session }: { session: Session }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="size-4" />
          </div>
          <span className="font-heading text-base font-semibold">Fixora</span>
        </div>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive(item.href)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold">
            {session.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{session.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {session.email}
            </p>
          </div>
        </div>
        <form action={logout}>
          <SidebarMenuButton type="submit" variant="outline">
            <LogOut />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
