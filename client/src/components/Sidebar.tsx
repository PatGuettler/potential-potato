import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
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

const toolItems = [
  {
    name: "Create Lesson",
    href: "/lesson-creation",
    icon: "fas fa-plus-circle",
  },
  {
    name: "Code Editor",
    href: "/tools/editor",
    icon: "fas fa-code",
  },
  {
    name: "Calculator",
    href: "/tools/calculator", 
    icon: "fas fa-calculator",
  },
  {
    name: "Progress",
    href: "/progress",
    icon: "fas fa-chart-line",
  },
];

export function Sidebar() {
  const [location] = useLocation();

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

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
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.href}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    <Link href={item.href}>
                      <i className={`${item.icon} text-sm`}></i>
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
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
