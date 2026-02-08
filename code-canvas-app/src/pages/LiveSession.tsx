import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Wifi, BookOpen } from 'lucide-react';
import { useCodeContext } from '../context/CodeContext';

export const LiveSession: React.FC = () => {
    const { activeModule } = useCodeContext();
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const toggleConnection = () => {
        setIsConnected(!isConnected);
    };

    return (
        <div className="h-full flex flex-col bg-gray-950 p-6">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Mic className="w-6 h-6 text-green-500" />
                    Code Companion
                    </h2>
                    <p className="text-gray-400 text-sm">Real-time mentorship & pair programming</p>
                </div>
                {activeModule && (
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm animate-pulse">
                        <BookOpen className="w-4 h-4" />
                        <span>Focus: {activeModule}</span>
                    </div>
                )}
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isConnected ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-red-500/10 text-red-400 border-red-500/50'}`}>
                    {isConnected ? 'LIVE' : 'OFFLINE'}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Video Feed Placeholder */}
                <div className="bg-black rounded-xl border border-gray-800 relative overflow-hidden flex items-center justify-center group">
                    {isConnected ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                            <span className="text-gray-500">Screen Share Active</span>
                            {/* Fake waveform */}
                            <div className="absolute bottom-6 left-6 right-6 h-12 flex items-center gap-1 z-20">
                                {[...Array(20)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-1 bg-green-500 rounded-full animate-bounce"
                                        style={{ 
                                            height: `${Math.random() * 100}%`,
                                            animationDelay: `${i * 0.05}s` 
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <VideoOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Start session to enable screen sharing</p>
                        </div>
                    )}
                </div>

                {/* Controls & Chat */}
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-950 border-4 border-gray-800 flex items-center justify-center mb-6 relative">
                            {isConnected && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                            )}
                            <Wifi className={`w-10 h-10 ${isConnected ? 'text-green-500' : 'text-gray-600'}`} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">
                            {isConnected ? 'Session Active' : 'Ready to Connect'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">
                            {isConnected 
                                ? "Gemini is listening. Ask any question about your code." 
                                : "Connect to start a real-time voice session with your AI mentor."}
                        </p>

                        <button
                            onClick={toggleConnection}
                            className={`w-full max-w-xs py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-xl
                                ${isConnected 
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                                    : 'bg-green-600 text-white hover:bg-green-500 shadow-green-500/20'
                                }`}
                        >
                            {isConnected ? 'End Session' : 'Start Session'}
                        </button>
                    </div>

                    {isConnected && (
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsMuted(!isMuted)}
                                className={`flex-1 py-3 rounded-lg border font-medium flex items-center justify-center gap-2
                                    ${isMuted 
                                        ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>
                            <button className="flex-1 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 font-medium flex items-center justify-center gap-2">
                                <Video className="w-4 h-4" /> Camera
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
