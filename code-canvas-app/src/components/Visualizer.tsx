import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter',
});

interface VisualizerProps {
  chart: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      containerRef.current.innerHTML = ''; // Clear previous
      const id = `mermaid-${Date.now()}`;
      // Mermaid render is async
      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      }).catch(err => {
         console.error("Mermaid failed to render", err);
         if (containerRef.current) {
             containerRef.current.innerHTML = `<div class="text-red-400 p-4">Failed to render diagram. Raw output:<pre class="mt-2 text-xs">${chart}</pre></div>`;
         }
      });
    }
  }, [chart]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
         <h3 className="text-gray-100 font-medium">Architecture Visualization</h3>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 p-4 overflow-auto flex items-center justify-center bg-gray-900/50"
      >
        {!chart && <p className="text-gray-500 italic">Waiting for analysis...</p>}
      </div>
    </div>
  );
};
