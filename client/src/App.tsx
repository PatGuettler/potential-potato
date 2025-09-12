import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import LessonView from "@/pages/LessonView";
import CategoryView from "@/pages/CategoryView";
import TeacherDashboard from "@/pages/TeacherDashboard";
import AdminPanel from "@/pages/AdminPanel";
import LessonCreation from "@/pages/LessonCreation";
import ProposalDetails from "@/pages/ProposalDetails";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/lesson/:id" component={LessonView} />
          <Route path="/category/:category" component={CategoryView} />
          <Route path="/teacher" component={TeacherDashboard} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/lesson-creation" component={LessonCreation} />
          <Route path="/proposals/:id" component={ProposalDetails} />
        </>
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
