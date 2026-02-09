import React, { useRef } from 'react';
import { Upload, Code, Play } from 'lucide-react';
const ACCEPTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rs', '.php', '.rb', '.html', '.css', '.json', '.md', '.txt'];

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, onAnalyze, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;
    
    //check extension
    const fileName = file.name.toLowerCase();
    const isValid = ACCEPTED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if(!isValid) {
      alert(`Invalid file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      //Reset input
      event.target.value='';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
    };
    reader.readAsText(file);
    //Reset value so same file can be selected again
    event.target.value = '';
  };
  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl relative">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-100 font-medium">
          <Code className="w-5 h-5 text-blue-400" />
          <span>Code Editor</span>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={ACCEPTED_EXTENSIONS.join(',')}
            onChange={handleFileUpload}
          />
           <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={() => fileInputRef.current?.click()} 
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste your code here..."
          className="w-full h-full p-4 bg-gray-900 text-gray-300 font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className={`flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white rounded-lg transition-all
            ${isAnalyzing || !code.trim() 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25'
            }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Analyze Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};
