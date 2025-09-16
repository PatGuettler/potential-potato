import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GraduationCap, Users, BookOpen } from "lucide-react";

type Props = {
  isRegistering: boolean;
  formData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "student" | "teacher" | "admin";
  };
  handleInputChange: (field: string, value: string) => void;
};

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export function CreateUser({ isRegistering }: Props) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isRegistering) return null;

  return (
    <>
      <FormField
        id="email"
        label="Email (optional)"
        type="email"
        value={formData.email}
        onChange={(value: string) => handleInputChange("email", value)}
        placeholder="Enter your email"
        dataTestId="input-email"
      />

      <div className="grid grid-cols-2 gap-2">
        <FormField
          id="firstName"
          label="First Name (optional)"
          value={formData.firstName}
          onChange={(value: string) => handleInputChange("firstName", value)}
          placeholder="First name"
          dataTestId="input-firstName"
        />

        <FormField
          id="lastName"
          label="Last Name (optional)"
          value={formData.lastName}
          onChange={(value: string) => handleInputChange("lastName", value)}
          placeholder="Last name"
          dataTestId="input-lastName"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: string) => handleInputChange("role", value)}
        >
          <SelectTrigger data-testid="select-role">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student" data-testid="role-student">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>Student</span>
              </div>
            </SelectItem>
            <SelectItem value="teacher" data-testid="role-teacher">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Teacher</span>
              </div>
            </SelectItem>
            <SelectItem value="admin" data-testid="role-admin">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Administrator</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}