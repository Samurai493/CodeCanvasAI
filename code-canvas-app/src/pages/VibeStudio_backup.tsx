import React, { useState } from 'react';
import { Palette, Download, RefreshCw } from 'lucide-react';
import { useCodeContext } from '../context/CodeContext';
import { getGeminiClient } from '../lib/gemini';

// Prompt for the "Vibe Artist"
const VIBE_PROMPT = `You are an abstract digital artist.
Analyze this code.
If valid/clean: Prompt a "Peaceful, organized Zen garden with futuristic glowing data streams, isometric 3d, unreal engine 5 render".
If messy/buggy: Prompt a "Chaotic cyberpunk city with tangled wires and glitch effects, neon red and green, high contrast".

RETURN ONLY THE PROMPT TEXT for the image generator.`;

export const VibeStudio: React.FC = () => {
  const { code } = useCodeContext();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!code) return;
    setLoading(true);
    setError(null);

    try {
      const genAI = getGeminiClient();
      
      // Step 1: Get the Prompt
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", // Using 2.0 Flash for speed 
        systemInstruction: VIBE_PROMPT 
      });
      
      const result = await model.generateContent(code);
      const generatedPrompt = result.response.text();
      setPrompt(generatedPrompt);

      // Step 2: Generate Image (Mocking Imagen for MVP as access might be limited)
      // In a real hackathon, we'd use the Imagen API here.
      // For this prototype, we'll use a placeholder service based on the prompt keywords.
      const keywords = generatedPrompt.includes('Zen') ? 'zen,garden,technology' : 'cyberpunk,glitch,neon';
      setGeneratedImage(`https://source.unsplash.com/1600x900/?${keywords}&t=${Date.now()}`);
      
    } catch (err: any) {
        console.error(err);
        setError("Failed to generate vibe. API Key might be missing or quota exceeded.");
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
