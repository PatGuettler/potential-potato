import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSync } from "@/components/ThemeSync";
import { useAuth } from "@/hooks/useAuth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LessonView from "@/pages/LessonView";
import CategoryView from "@/pages/CategoryView";
import TeacherDashboard from "@/pages/TeacherDashboard";
import AdminPanel from "@/pages/AdminPanel";
import LessonCreation from "@/pages/LessonCreation";
import ProposalDetails from "@/pages/ProposalDetails";
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
          <Route path="/teacher" component={TeacherDashboard} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/lesson-creation" component={LessonCreation} />
          <Route path="/proposals/:id" component={ProposalDetails} />
          <Route path="/lesson-edit" component={EditLessons} />
          <Route path="/profile" component={Profile} />
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
      <ThemeProvider>
        <TooltipProvider>
          <ThemeSync />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
