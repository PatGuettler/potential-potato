import { useState } from "react";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultCode = {
  cpp: `#include <iostream>
#include <memory>

int main() {
    int* ptr = new int(42);
    std::cout << *ptr << std::endl;
    delete ptr;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  csharp: `using System;

class Program 
{
    static void Main() 
    {
        Console.WriteLine("Hello, World!");
    }
}`
};

export function CodeEditor() {
  const [code, setCode] = useState(defaultCode.cpp);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("Click 'Compile & Run' to execute your code");
  const [isCompiling, setIsCompiling] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage as keyof typeof defaultCode] || "");
  };

  const handleCompileAndRun = async () => {
    setIsCompiling(true);
    
    // Simulate compilation process
    setTimeout(() => {
      setOutput(`✓ Compilation successful
Program output:
42
Process finished with exit code 0`);
      setIsCompiling(false);
    }, 2000);
  };

  return (
    <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Integrated Code Editor</h3>
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32" data-testid="language-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleCompileAndRun}
              disabled={isCompiling}
              data-testid="compile-run-button"
            >
              <i className="fas fa-play mr-1"></i>
              {isCompiling ? "Compiling..." : "Compile & Run"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-96">
        {/* Code Editor */}
        <div className="p-4">
          <div className="text-xs text-muted-foreground mb-2">
            main.{language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'cs'}
          </div>
          <MonacoEditor
            value={code}
            onChange={setCode}
            language={language === 'cpp' ? 'cpp' : language === 'csharp' ? 'csharp' : 'java'}
            height="350px"
          />
        </div>
        
        {/* Output Panel */}
        <div className="bg-muted p-4 border-l border-border">
          <div className="text-xs text-muted-foreground mb-2">Console Output</div>
          <div className="bg-background rounded p-3 font-mono text-sm min-h-32" data-testid="code-output">
            <pre className="whitespace-pre-wrap text-green-600">{output}</pre>
          </div>
          
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Lesson Feedback</div>
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm" data-testid="lesson-feedback">
              <div className="flex items-start space-x-2">
                <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                <div>
                  <p className="text-green-800 font-medium">Great work!</p>
                  <p className="text-green-700">You correctly implemented dynamic memory allocation and deallocation. This prevents memory leaks in your program.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
