import React from 'react';
import { Layout as LayoutIcon, Mic, Palette, Code2, Settings } from 'lucide-react';
import { useCodeContext } from '../context/CodeContext';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { code } = useCodeContext();

  const navItems = [
    { id: 'canvas', label: 'Canvas', icon: LayoutIcon },
    { id: 'vibe', label: 'Vibe Studio', icon: Palette },
    { id: 'live', label: 'Live Session', icon: Mic },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-600 p-2 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            CodeCanvas AI
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${activeTab === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
           <div className="px-4 py-3 bg-gray-900 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                 <Settings className="w-3 h-3" />
                 <span>Context Status</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-400">Code Loaded</span>
                 <span className={code ? "text-green-400" : "text-gray-600"}>
                    {code ? "Yes" : "No"}
                 </span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
         {children}
      </main>
    </div>
  );
};
