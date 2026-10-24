import type { ComponentType } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { isDemo } from "@/demo/backend";
import { Loading } from "@/components/widgets";
import type { Role } from "@shared/core/types";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import LessonView from "@/pages/LessonView";
import CategoryView from "@/pages/CategoryView";
import Library from "@/pages/Library";
import LessonEditor from "@/pages/LessonEditor";
import ClassroomDetail from "@/pages/ClassroomDetail";
import StudentReport from "@/pages/StudentReport";
import ReviewQueue from "@/pages/ReviewQueue";
import UserManagement from "@/pages/UserManagement";
import ResetPassword from "@/pages/ResetPassword";
import Account from "@/pages/Account";
import CourseCatalog from "@/pages/CourseCatalog";
import CourseDetail from "@/pages/CourseDetail";
import FamilyPage from "@/pages/FamilyPage";
import AttendancePage from "@/pages/records/AttendancePage";
import TranscriptPage from "@/pages/records/TranscriptPage";
import PortfolioPage from "@/pages/records/PortfolioPage";
import CoopPage from "@/pages/CoopPage";
import CalendarPage from "@/pages/CalendarPage";

const STAFF: Role[] = ["teacher", "admin"];
const TEACHING: Role[] = ["teacher", "admin", "parent"];

/** Renders the page only for the given roles; everyone else gets the not-found page. */
function only(roles: Role[], Page: ComponentType<any>) {
  return function Guarded(props: any) {
    const { user } = useAuth();
    return user && roles.includes(user.role) ? <Page {...props} /> : <NotFound />;
  };
}

const guarded = {
  library: only(TEACHING, Library),
  editor: only(TEACHING, LessonEditor),
  classroom: only(TEACHING, ClassroomDetail),
  reviews: only(TEACHING, ReviewQueue),
  family: only(["parent", "admin"], FamilyPage),
  attendance: only(["parent", "admin", "teacher"], AttendancePage),
  transcript: only(["parent", "admin", "teacher"], TranscriptPage),
  portfolio: only(["parent", "admin", "teacher"], PortfolioPage),
  users: only(["admin"], UserManagement),
  report: only(["teacher", "admin", "parent"], StudentReport),
  myReport: only(["student"], StudentReport),
};

function Routes() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Reset links must work whether or not someone is already signed in on this device.
  if (location.startsWith("/reset/")) return <Route path="/reset/:token" component={ResetPassword} />;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  if (!isAuthenticated) return <Login />;

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lesson/:id" component={LessonView} />
      <Route path="/category/:category" component={CategoryView} />
      <Route path="/courses" component={CourseCatalog} />
      <Route path="/courses/:courseId/units/:unitId/new-lesson" component={guarded.editor} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/library" component={guarded.library} />
      <Route path="/lesson-creation" component={guarded.editor} />
      <Route path="/lesson-edit/:id" component={guarded.editor} />
      <Route path="/classes/:id" component={guarded.classroom} />
      <Route path="/students/:id" component={guarded.report} />
      <Route path="/me/report" component={guarded.myReport} />
      <Route path="/reviews" component={guarded.reviews} />
      <Route path="/admin/users" component={guarded.users} />
      <Route path="/account" component={Account} />
      <Route path="/family" component={guarded.family} />
      <Route path="/records/attendance/:studentId?" component={guarded.attendance} />
      <Route path="/records/transcript/:studentId?" component={guarded.transcript} />
      <Route path="/records/portfolio/:studentId?" component={guarded.portfolio} />
      <Route path="/coop" component={CoopPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* GitHub Pages has no SPA fallback, so the static demo routes through the URL hash. */}
        <WouterRouter hook={isDemo ? useHashLocation : undefined}>
          <Routes />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
