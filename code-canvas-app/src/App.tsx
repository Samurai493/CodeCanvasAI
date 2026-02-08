import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { CodeProvider, useCodeContext } from './context/CodeContext';
import { MainLayout } from './layouts/MainLayout';
import { CodeInput } from './components/CodeInput';
import { Visualizer } from './components/Visualizer';
import { LearningPath } from './components/LearningPath';
import { VibeStudio } from './pages/VibeStudio';
import { LiveSession } from './pages/LiveSession';
import { SettingsPage } from './pages/SettingsPage';
import { initializeGemini, getGeminiClient, ARCHITECT_PROMPT, PROFESSOR_PROMPT, parseGeminiError } from './lib/gemini';

// --- Workspace Component (The "Canvas") ---
const CanvasWorkspace = () => {
    const { code, setCode, isAnalyzing, setIsAnalyzing, setAnalysisResult, setComplexityScore } = useCodeContext();
    const [chart, setChart] = useState('');
    const [learningPath, setLearningPath] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);
        setChart('');
        setLearningPath(null);
    
        try {
          const genAI = getGeminiClient();
    
          // 1. Call The Architect (Parallel)
          const architectModel = genAI.getGenerativeModel({ 
            model: "gemini-3-pro-preview", 
            systemInstruction: ARCHITECT_PROMPT 
          });
    
          // 2. Call The Professor (Parallel)
          const professorModel = genAI.getGenerativeModel({ 
            model: "gemini-3-pro-preview", 
            systemInstruction: PROFESSOR_PROMPT,
            generationConfig: { responseMimeType: "application/json" }
          });
    
          const [architectRes, professorRes] = await Promise.all([
            architectModel.generateContent(code),
            professorModel.generateContent(`Code:\n${code}\nUser Level: Intermediate`)
          ]);
    
          const chartText = architectRes.response.text();
          // Cleanup mermaid text if it contains markdown blocks
          const cleanChart = chartText.replace(/```mermaid/g, '').replace(/```/g, '').trim();
          setChart(cleanChart);
          
          // Calculate Complexity Score (Connective Tissue)
          const complexity = Math.min(100, cleanChart.split('\n').length * 2);
          setComplexityScore(complexity);
    
          const pathJson = JSON.parse(professorRes.response.text());
          setLearningPath(pathJson);
          setAnalysisResult({ chart: cleanChart, path: pathJson });
    
        } catch (err: any) {
          console.error(err);
          setError(parseGeminiError(err));
        } finally {
          setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full p-8 bg-gray-950 overflow-hidden">
             
             {/* API Error Toast */}
             {/* API Error Modal */}
             {error && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
                    style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)' }}
                >
                    <div 
                        className="bg-gray-900 border border-red-500/50 text-white p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4 relative"
                        style={{ backgroundColor: '#111827', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    >
                        <div className="flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <h3 className="text-lg font-bold">Analysis Error</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            {error}
                        </p>
                        <div className="flex justify-end gap-3 mt-2">
                             <button 
                                onClick={() => setError(null)} 
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                                style={{ backgroundColor: '#dc2626', color: 'white' }}
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left: Code Input */}
            <div className="lg:col-span-4 flex flex-col min-h-0">
                <CodeInput 
                    code={code} 
                    setCode={setCode} 
                    onAnalyze={handleAnalyze} 
                    isAnalyzing={isAnalyzing} 
                />
            </div>

            {/* Center: Visualizer */}
            <div className="lg:col-span-5 flex flex-col min-h-0">
                 <Visualizer chart={chart} />
            </div>

            {/* Right: Learning Path */}
            <div className="lg:col-span-3 flex flex-col min-h-0">
                 <LearningPath data={learningPath} />
            </div>
        </div>
    );
};

// --- Main App Wrapper ---
function AppContent() {
  const [activeTab, setActiveTab] = useState('canvas');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      initializeGemini(storedKey);
    }
  }, []);

  return (
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
           {activeTab === 'canvas' && <CanvasWorkspace />}
           {activeTab === 'vibe' && <VibeStudio />}
           {activeTab === 'live' && <LiveSession />}
           {activeTab === 'settings' && <SettingsPage />}
      </MainLayout>
  );
}

export default function App() {
    return (
        <CodeProvider>
            <AppContent />
        </CodeProvider>
    );
}
