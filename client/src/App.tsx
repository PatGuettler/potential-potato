import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LessonView from "@/pages/LessonView";
import CategoryView from "@/pages/CategoryView";
import LessonCreation from "@/pages/LessonCreation";
import EditLessons from "@/pages/EditLessons";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {!isAuthenticated && !isLoading && (
        <Route component={Login} />
      )}
      {isAuthenticated && (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/lesson/:id" component={LessonView} />
          <Route path="/category/:category" component={CategoryView} />
          <Route path="/lesson-creation" component={LessonCreation} />
          <Route path="/lesson-edit" component={EditLessons} />
        </>
      )}
      {isLoading && (
        <Route>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </Route>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
