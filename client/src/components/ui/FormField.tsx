import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  dataTestId?: string;
};

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  dataTestId,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        data-testid={dataTestId}
      />
    </div>
  );
}