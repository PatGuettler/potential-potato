import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const solutionSteps = [
  {
    step: 1,
    title: "Identify coefficients",
    description: "a = 3, b = 7, c = -6"
  },
  {
    step: 2,
    title: "Apply quadratic formula",
    description: "x = (-b ± √(b² - 4ac)) / 2a"
  },
  {
    step: 3,
    title: "Calculate discriminant",
    description: "b² - 4ac = 49 + 72 = 121"
  },
  {
    step: 4,
    title: "Final solutions",
    description: "x₁ = 2/3, x₂ = -3",
    isCorrect: true
  }
];

export function Calculator() {
  const [answer, setAnswer] = useState("x = 2/3, x = -3");
  const [showSteps, setShowSteps] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleCheckAnswer = () => {
    // Simple validation logic
    const correctAnswers = ["x = 2/3, x = -3", "x = -3, x = 2/3"];
    const isAnswerCorrect = correctAnswers.some(correct => 
      answer.toLowerCase().trim() === correct.toLowerCase()
    );
    setIsCorrect(isAnswerCorrect);
    setShowSteps(true);
  };

  const handleShowSteps = () => {
    setShowSteps(true);
  };

  return (
    <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold">Interactive Math Calculator</h3>
        <p className="text-sm text-muted-foreground">Solve complex equations with step-by-step guidance</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Interface */}
          <div>
            <div className="mb-4">
              <Label className="text-sm font-medium text-foreground">Problem: Solve for x</Label>
              <div className="mt-2 p-3 bg-muted rounded text-center text-lg font-mono" data-testid="math-problem">
                3x² + 7x - 6 = 0
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Your Answer:</Label>
                <Input 
                  type="text" 
                  placeholder="Enter solution for x..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  data-testid="answer-input"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCheckAnswer}
                  data-testid="check-answer-button"
                >
                  Check Answer
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleShowSteps}
                  data-testid="show-steps-button"
                >
                  Show Steps
                </Button>
              </div>

              {isCorrect !== null && (
                <div className={`p-3 rounded border ${
                  isCorrect 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`} data-testid="answer-feedback">
                  <div className="flex items-center space-x-2">
                    <i className={`fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    <span className="font-medium">
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {isCorrect 
                      ? "Great work! Your answer is correct." 
                      : "Please check your calculation and try again."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Solution Steps */}
          <div className="bg-muted rounded-lg p-4" data-testid="solution-steps">
            <h4 className="font-semibold mb-3">Solution Steps</h4>
            <div className="space-y-3 text-sm">
              {showSteps ? solutionSteps.map((step) => (
                <div key={step.step} className="flex items-start space-x-2">
                  <div className={`w-6 h-6 ${step.isCorrect ? 'bg-green-600' : 'bg-primary'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                    {step.isCorrect ? '✓' : step.step}
                  </div>
                  <div>
                    <p className={`font-medium ${step.isCorrect ? 'text-green-700' : ''}`}>
                      {step.title}
                    </p>
                    <p className={`${step.isCorrect ? 'text-green-600' : 'text-muted-foreground'} ${step.step === 2 ? 'font-mono' : ''}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">
                  Click "Show Steps" or "Check Answer" to see the solution process
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
