import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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
    <aside className="w-64 bg-card border-r border-border shadow-sm hidden lg:block">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-atom text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-xl font-bold">STEM Academy</h1>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <i className={`${item.icon} text-sm`}></i>
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Tools</h3>
          <nav className="space-y-2">
            {toolItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  data-testid={`tool-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span>{item.name}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
