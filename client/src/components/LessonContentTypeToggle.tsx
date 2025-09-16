import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = {
  useQuizBuilder: boolean;
  setUseQuizBuilder: (checked: boolean) => void;
};

export function LessonContentTypeToggle({ useQuizBuilder, setUseQuizBuilder }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label htmlFor="quiz-builder-toggle">Content Type</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose between traditional content or structured quiz format
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${!useQuizBuilder ? 'font-medium' : 'text-gray-500'}`}>
          Simple Content
        </span>
        <Switch
          id="quiz-builder-toggle"
          data-testid="switch-quiz-builder"
          checked={useQuizBuilder}
          onCheckedChange={setUseQuizBuilder}
        />
        <span className={`text-sm ${useQuizBuilder ? 'font-medium' : 'text-gray-500'}`}>
          Quiz Builder
        </span>
      </div>
    </div>
  );
}