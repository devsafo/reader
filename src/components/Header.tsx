import React from 'react';
import { BookOpen, Sparkles, HelpCircle, BookMarked, Mic } from 'lucide-react';

interface HeaderProps {
  activeTab: 'story' | 'vocab' | 'practice' | 'quiz';
  setActiveTab: (tab: 'story' | 'vocab' | 'practice' | 'quiz') => void;
  vocabCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, vocabCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* App Title & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                A Good Day in the Village
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                A2 Learner Level
              </span>
            </div>
            <p className="text-xs text-stone-600 flex items-center gap-1.5">
              <span>Warm English Teacher Narration</span>
              <span className="text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Gemini 3.8 Flash TTS
              </span>
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'story'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Story</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'vocab'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Vocabulary</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'vocab' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-stone-700'
              }`}
            >
              {vocabCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'practice'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Speak</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
