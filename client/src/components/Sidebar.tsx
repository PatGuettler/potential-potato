import { Link, useLocation } from "wouter";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: "fas fa-home" },
  { name: "Science", href: "/category/science", icon: "fas fa-microscope" },
  { name: "Technology", href: "/category/technology", icon: "fas fa-laptop-code" },
  { name: "Engineering", href: "/category/engineering", icon: "fas fa-cogs" },
  { name: "Mathematics", href: "/category/mathematics", icon: "fas fa-calculator" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth() as { user: { role: string } | null };

  const toolItems = [
    ...(user && (user.role === "teacher" || user.role === "admin")
      ? [
          { name: "Create Lesson", href: "/lesson-creation", icon: "fas fa-plus-circle" },
          { name: "Edit Lessons", href: "/lesson-edit", icon: "fas fa-edit" },
        ]
      : []),
    ...(user?.role === "teacher"
      ? [{ name: "Teacher Dashboard", href: "/teacher", icon: "fas fa-chalkboard-teacher" }]
      : []),
    ...(user?.role === "admin"
      ? [{ name: "Admin Panel", href: "/admin", icon: "fas fa-user-shield" }]
      : []),
  ];

  return (
    <SidebarPrimitive className="border-r-0" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-atom text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-xl font-bold">StemGenius</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learn</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href || (item.href !== "/" && location.startsWith(item.href))}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.href}>
                      <i className={`${item.icon} text-sm`}></i>
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location === "/profile"}
                    data-testid="nav-profile"
                  >
                    <Link href="/profile">
                      <i className="fas fa-user-cog text-sm"></i>
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

        {toolItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {toolItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === item.href}
                      data-testid={`tool-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.href}>
                        <i className={`${item.icon} text-sm`}></i>
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarRail />
    </SidebarPrimitive>
  );
}
