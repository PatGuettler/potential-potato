import { useAuth } from "@/hooks/useAuth";
import StudentHome from "./home/StudentHome";
import TeacherHome from "./home/TeacherHome";
import ParentHome from "./home/ParentHome";
import AdminHome from "./home/AdminHome";

export default function Home() {
  const { user } = useAuth();
  switch (user?.role) {
    case "admin":
      return <AdminHome />;
    case "teacher":
      return <TeacherHome />;
    case "parent":
      return <ParentHome />;
    default:
      return <StudentHome />;
  }
}
