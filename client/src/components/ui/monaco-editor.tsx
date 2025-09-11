import { useEffect, useRef } from 'react';
import { loader } from '@monaco-editor/react';

// Configure Monaco Editor to load from CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  theme?: string;
  readOnly?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  language,
  height = "400px",
  theme = "vs-dark",
  readOnly = false
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initEditor = async () => {
      const monaco = await loader.init();
      
      if (editorRef.current) {
        editorRef.current.dispose();
      }

      editorRef.current = monaco.editor.create(containerRef.current!, {
        value,
        language,
        theme,
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      });

      editorRef.current.onDidChangeModelContent(() => {
        const newValue = editorRef.current.getValue();
        onChange(newValue);
      });
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        loader.init().then(monaco => {
          monaco.editor.setModelLanguage(model, language);
        });
      }
    }
  }, [language]);

  return (
    <div 
      ref={containerRef} 
      style={{ height }} 
      className="border border-border rounded-lg overflow-hidden"
    />
  );
}
