import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


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
         <span className="text-xs text-gray-500"> Scroll to Zoom • Drag to Pan</span>
      </div>

      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing bg-gray-900/50">
        {!chart ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic">Waiting for analysis...</p>
          </div>
        ) : (
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            wheel={{ step: 0.1}}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  <button onClick={() => zoomIn()} className="bg-gray-800 p-2 rounded hover:bg-gray-700 text-white" title="Zoom In">+</button>
                  <button onClick={() => zoomOut()} className="bg-gray-800 p-2 rounded hover:bg-gray-700 text-white" title="Zoom Out">-</button>
                  <button onClick={() => resetTransform()} className="bg-gray-800 p-2 rounded hover:bg-gray-700 text-white" title="Reset">↺</button>
                </div>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                  <div
                    ref={containerRef}
                    className="w-full h-full flex item-center justify-center p-8 min-h-{500px}"
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        )}
      </div>
    </div>
  );
};
