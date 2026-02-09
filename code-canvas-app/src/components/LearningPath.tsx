import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Module {
  title: string;
  description: string;
  quiz_question: string;
  options: string[];
  correct_answer: number;
}

interface LearningPathData {
  title: string;
  summary: string;
  modules: Module[];
  difficulty_rating: number;
}

interface LearningPathProps {
  data: LearningPathData | null;
}

export const LearningPath: React.FC<LearningPathProps> = ({ data }) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});

  if (!data) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center border-2 border-gray-700 rounded-xl">
        <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
        <p>Your personalized learning path will appear here after analysis.</p>
    </div>
  );

  const handleAnswerSelect = (moduleIndex: number, optionIndex: number) => {
      setSelectedAnswers(prev => ({...prev, [moduleIndex]: optionIndex}));
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl overflow-hidden h-full flex flex-col">
       <div className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                {data.title}
            </h2>
            <span className="px-3 py-1 bg-black/30 rounded-full text-xs font-semibold text-purple-200 border border-purple-500/30">
                Difficulty: {data.difficulty_rating}/5
            </span>
          </div>
          <p className="text-purple-100/80 text-sm leading-relaxed">{data.summary}</p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {data.modules.map((module, idx) => {
              const isExpanded = expandedModule === idx;
              const isCompleted = selectedAnswers[idx] === module.correct_answer;
              
              return (
                  <div key={idx} className={`bg-gray-800 rounded-lg border transition-all duration-300 ${isExpanded ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-gray-700 hover:border-gray-600'}`}>
                      <button 
                        onClick={() => setExpandedModule(isExpanded ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                              </div>
                              <div>
                                  <h3 className={`font-semibold ${isCompleted ? 'text-green-400' : 'text-gray-200'}`}>{module.title}</h3>
                              </div>
                          </div>
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                      </button>

                      {isExpanded && (
                          <div className="px-4 pb-4 pl-14 animation-slide-down">
                              <div className="prose prose-invert prose-sm mb-6 text-gray-300">
                                  <ReactMarkdown>{module.description}</ReactMarkdown>
                              </div>

                              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                                  <h4 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">Pop Quiz</h4>
                                  <p className="text-gray-200 mb-4 font-medium">{module.quiz_question}</p>
                                  <div className="space-y-2">
                                      {module.options.map((option, optIdx) => {
                                          const isSelected = selectedAnswers[idx] === optIdx;
                                          const isCorrect = module.correct_answer === optIdx;
                                          const showResult = selectedAnswers[idx] !== undefined;
                                          
                                          let btnClass = "w-full text-left p-3 rounded-md text-sm transition-all border ";
                                          if (showResult && isCorrect) btnClass += "bg-green-500/20 border-green-500 text-green-300";
                                          else if (showResult && isSelected && !isCorrect) btnClass += "bg-red-500/20 border-red-500 text-red-300";
                                          else if (isSelected) btnClass += "bg-purple-600 border-purple-500 text-white";
                                          else btnClass += "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700";

                                          return (
                                              <button
                                                key={optIdx}
                                                onClick={() => handleAnswerSelect(idx, optIdx)}
                                                disabled={showResult}
                                                className={btnClass}
                                              >
                                                  {option}
                                              </button>
                                          )
                                      })}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )
          })}
       </div>
    </div>
  );
};
