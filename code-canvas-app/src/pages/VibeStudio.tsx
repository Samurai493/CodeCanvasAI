import React, { useState, useEffect } from 'react';
import { Palette, Download, RefreshCw } from 'lucide-react';
import { useCodeContext } from '../context/CodeContext';
import { getGeminiClient } from '../lib/gemini';

// Prompt for the "Vibe Artist"
export const VibeStudio: React.FC = () => {
  const { code, complexityScore } = useCodeContext();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate when code changes
  useEffect(() => {
     if (code) {
        handleGenerate();
     }
  }, [code]);

  const handleGenerate = async () => {
    if (!code) return;
    setLoading(true);
    setError(null);

    try {
      const genAI = getGeminiClient();
      
      // Reactive Prompt based on Architect's Complexity Score
      const vibeStyle = complexityScore > 50 
        ? "chaotic, cyberpunk, glitch art, neon cables, high contrast, stressful"
        : "peaceful, zen garden, minimal, glassmorphism, floating geometry, calm";

      const REACTIVE_PROMPT = `You are a digital artist. 
      Analyze this code. 
      Based on its structural complexity (Score: ${complexityScore}/100), generate an abstract image prompt.
      Style Direction: ${vibeStyle}
      
      RETURN ONLY THE PROMPT TEXT.`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview", 
        systemInstruction: REACTIVE_PROMPT 
      });
      
      const result = await model.generateContent(code);
      const generatedPrompt = result.response.text();
      setPrompt(generatedPrompt);

      // Generating Image (Mock)
      const keyword = complexityScore > 50 ? 'cyberpunk' : 'zen';
      setGeneratedImage(`https://source.unsplash.com/1600x900/?${keyword}&t=${Date.now()}`);
      
    } catch (err: any) {
        console.error(err);
        setError("AI Service unavailable. Please check settings.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-950">
      <div className="flex items-center justify-between mb-6">
         <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <Palette className="w-6 h-6 text-pink-500" />
               Vibe Studio
            </h2>
            <p className="text-gray-400 text-sm">Visualize your code's "feeling"</p>
         </div>
         {generatedImage && (
             <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                <Download className="w-4 h-4" /> Download
             </button>
         )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative group">
          
          {!generatedImage && !loading && (
             <div className="text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Palette className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 mb-6">Ready to visualize your code?</p>
                <button 
                  onClick={handleGenerate}
                  disabled={!code}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {code ? "Generate Art" : "No Code Loaded"}
                </button>
             </div>
          )}

          {loading && (
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                <p className="text-pink-400 animate-pulse">Dreaming...</p>
             </div>
          )}

          {generatedImage && !loading && (
             <>
               <img src={generatedImage} alt="Code Vibe" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <p className="text-white font-medium mb-1">Generated Prompt:</p>
                  <p className="text-gray-300 text-sm italic">"{prompt}"</p>
                  <button 
                     onClick={handleGenerate}
                     className="mt-4 self-start flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300"
                  >
                     <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
               </div>
             </>
          )}

          {error && (
              <div className="text-red-400 text-center p-4">
                  <p>{error}</p>
                  <button onClick={() => setError(null)} className="mt-2 text-sm underline">Dismiss</button>
              </div>
          )}
      </div>
    </div>
  );
};
