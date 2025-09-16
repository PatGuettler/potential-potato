import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  {
    name: "Dashboard",
    href: "/",
    icon: "fas fa-home",
  },
  {
    name: "Science",
    href: "/category/science",
    icon: "fas fa-microscope",
    badge: "12",
  },
  {
    name: "Technology", 
    href: "/category/technology",
    icon: "fas fa-laptop-code",
    badge: "8",
  },
  {
    name: "Engineering",
    href: "/category/engineering", 
    icon: "fas fa-cogs",
    badge: "15",
  },
  {
    name: "Mathematics",
    href: "/category/mathematics",
    icon: "fas fa-calculator", 
    badge: "20",
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth() as { user: { role: string } | null };

  const toolItems = [
    ...(user && (user.role === "teacher" || user.role === "admin")
      ? [{
          name: "Create Lesson",
          href: "/lesson-creation",
          icon: "fas fa-plus-circle",
        }]
      : []),
      ...(user && (user.role === "student" || user.role === "teacher" || user.role === "admin")
      ? [{
          name: "Science Books",
          href: "/science-books",
          icon: "fas fa-plus-circle",
        },
        {
          name: "Tech Books",
          href: "/tech-books",
          icon: "fas fa-plus-circle",
        },
        {
          name: "Engineering Books",
          href: "/engineering-books",
          icon: "fas fa-plus-circle",
        },
        {
          name: "Math Books",
          href: "/math-books",
          icon: "fas fa-plus-circle",
        }]
      : [])
    // Add other tool items here if needed
  ];

  return (
    <SidebarPrimitive className="border-r-0" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-atom text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-xl font-bold">STEM Academy</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.href}
                    data-testid={`tool-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
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
      </SidebarContent>
      
      <SidebarRail />
    </SidebarPrimitive>
  );
}
