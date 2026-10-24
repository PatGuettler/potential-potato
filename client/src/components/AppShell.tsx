import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, setSignedInUser } from "@/lib/queryClient";
import { fullName, initials } from "@/lib/format";
import { isDemo, resetDemo } from "@/demo/backend";
import type { Role } from "@shared/core/types";

type NavItem = { name: string; href: string; icon: string; badge?: number };

const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
};

function useNav(role: Role | undefined) {
  const staff = role === "teacher" || role === "admin";
  const { data: subs = [] } = useQuery<{ status: string }[]>({
    queryKey: ["/api/teacher/submissions"],
    enabled: staff,
  });
  const pending = subs.filter((s) => s.status === "pending").length;

  const main: NavItem[] = [{ name: role === "parent" ? "My children" : "Dashboard", href: "/", icon: "fas fa-home" }];
  if (staff) main.push({ name: "Review queue", href: "/reviews", icon: "fas fa-inbox", badge: pending || undefined });
  if (role === "admin") main.push({ name: "Users & families", href: "/admin/users", icon: "fas fa-users-cog" });
  if (role === "student") main.push({ name: "My report", href: "/me/report", icon: "fas fa-chart-line" });
  main.push({ name: "Course catalog", href: "/courses", icon: "fas fa-graduation-cap" });

  const content: NavItem[] = staff
    ? [
        { name: "All lessons", href: "/library", icon: "fas fa-book-open" },
        { name: "New lesson", href: "/lesson-creation", icon: "fas fa-plus-circle" },
      ]
    : [];
  return { main, content };
}

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const [location] = useLocation();
  if (items.length === 0) return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={item.href === "/" ? location === "/" : location.startsWith(item.href)} tooltip={item.name}>
                <Link href={item.href} data-testid={`nav-${item.name.toLowerCase().replace(/\W+/g, "-")}`}>
                  <i className={`${item.icon} w-4 text-center text-sm`} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              {item.badge ? <SidebarMenuBadge className="bg-primary text-primary-foreground rounded-full">{item.badge}</SidebarMenuBadge> : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppShell({ title, subtitle, actions, children }: { title: string; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { main, content } = useNav(user?.role);
  const { data: org } = useQuery<{ organizationName: string }>({ queryKey: ["/api/org"], staleTime: Infinity });

  const logout = async () => {
    await apiRequest("POST", "/api/logout").catch(() => undefined);
    setSignedInUser(null);
    navigate("/");
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-atom text-primary-foreground text-sm" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="font-bold leading-tight truncate">{org?.organizationName ?? "STEM Academy"}</div>
              <div className="text-xs text-muted-foreground">{user ? roleLabel[user.role] : ""}</div>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <NavGroup label="Overview" items={main} />
          <NavGroup label="Content" items={content} />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
            <div className="w-8 h-8 shrink-0 bg-primary/15 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
              {initials(user ?? undefined)}
            </div>
            <Link href="/account" className="min-w-0 flex-1 hover:underline" title="My account">
              <div className="text-sm font-medium truncate" data-testid="user-full-name">{fullName(user ?? undefined)}</div>
              <div className="text-xs text-muted-foreground truncate">@{user?.username}</div>
            </Link>
            <Button variant="ghost" size="icon" onClick={logout} title="Sign out" data-testid="logout-button">
              <i className="fas fa-sign-out-alt" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0">
        {isDemo && (
          <div className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-xs sm:text-sm px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
            <span>
              <i className="fas fa-flask mr-1.5" />
              Demo mode: data lives only in this browser.
            </span>
            <span className="flex gap-3">
              <button className="underline" onClick={logout} data-testid="switch-account">Switch account</button>
              <button className="underline" onClick={resetDemo} data-testid="reset-demo">Reset demo data</button>
            </span>
          </div>
        )}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center gap-3">
          <SidebarTrigger data-testid="sidebar-toggle" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold truncate" data-testid="page-title">{title}</h1>
            {subtitle && <div className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl w-full mx-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
