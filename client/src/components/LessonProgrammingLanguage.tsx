import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function LessonProgrammingLanguage({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="programming">Programming Language</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger data-testid="select-programming">
          <SelectValue placeholder="Select programming language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="cpp">C++</SelectItem>
          <SelectItem value="csharp">C#</SelectItem>
          <SelectItem value="arduino">Arduino</SelectItem>
          <SelectItem value="scratch">Scratch</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}