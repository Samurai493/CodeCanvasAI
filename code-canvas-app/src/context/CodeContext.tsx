import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  analysisResult: any | null;
  setAnalysisResult: (result: any | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  
  // Cross-Agent Intelligence
  complexityScore: number;
  setComplexityScore: (score: number) => void;
  activeModule: string | null;
  setActiveModule: (module: string | null) => void;

  // Persisted Visualization State
  chart: string;
  setChart: (chart: string) => void;
  learningPath: any | null;
  setLearningPath: (path: any | null) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // New State
  const [complexityScore, setComplexityScore] = useState<number>(0);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // New State: Persistent Visualization
  const [chart, setChart] = useState<string>('');
  const [learningPath, setLearningPath] = useState<any | null>(null);

  return (
    <CodeContext.Provider 
      value={{ 
        code, 
        setCode, 
        selectedImage, 
        setSelectedImage, 
        analysisResult, 
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        complexityScore,
        setComplexityScore,
        activeModule,
        setActiveModule,
        chart,
        setChart,
        learningPath,
        setLearningPath
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCodeContext = () => {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error('useCodeContext must be used within a CodeProvider');
  }
  return context;
};
