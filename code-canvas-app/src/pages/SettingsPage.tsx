import React, { useState, useEffect } from 'react';
import { Key, Save, Check } from 'lucide-react';
import { initializeGemini } from '../lib/gemini';

export const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    if (apiKey.trim().startsWith('AIza')) {
      localStorage.setItem('gemini_api_key', apiKey);
      initializeGemini(apiKey);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } else {
        alert("Invalid API Key format. Starts with 'AIza'");
    }
  };

  return (
    <div className="h-full bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">Settings</h2>
        
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                 <h3 className="text-lg font-semibold text-white">Gemini API Configuration</h3>
                 <p className="text-gray-400 text-sm">Required to power the AI agents.</p>
              </div>
           </div>

           <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">Google AI Studio Key</label>
              <div className="flex gap-4">
                 <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                 />
                 <button 
                    onClick={handleSave}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
                        ${isSaved 
                            ? 'bg-green-500 text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                 >
                    {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaved ? 'Saved' : 'Save Key'}
                 </button>
              </div>
              <p className="text-xs text-gray-500">
                 Keys are stored locally in your browser. Get one at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 hover:underline">aistudio.google.com</a>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
