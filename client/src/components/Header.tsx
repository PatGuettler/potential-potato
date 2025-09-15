import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@shared/schema";

export function Header() {
  const { user } = useAuth() as { user: User | null };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getFullName = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "User";
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <SidebarTrigger className="lg:hidden" data-testid="mobile-menu" />
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold truncate">
              Welcome back, <span data-testid="user-first-name">{user?.firstName || "Student"}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Continue your STEM journey</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 rounded-lg hover:bg-secondary relative hidden sm:block" data-testid="notifications">
            <i className="fas fa-bell text-muted-foreground"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-medium">
              <span data-testid="user-initials">{getInitials(user?.firstName, user?.lastName)}</span>
            </div>
            <span className="text-sm font-medium hidden sm:inline" data-testid="user-full-name">
              {getFullName(user?.firstName, user?.lastName)}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/api/logout'}
            data-testid="logout-button"
            className="hidden sm:inline-flex"
          >
            Logout
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/api/logout'}
            data-testid="logout-button-mobile"
            className="sm:hidden"
          >
            <i className="fas fa-sign-out-alt"></i>
          </Button>
        </div>
      </div>
    </header>
  );
}
