import React from 'react';
import { Sparkles, Bookmark, Lightbulb, Wand2 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'generator' | 'templates' | 'saved';
  onSelectTab: (tab: 'generator' | 'templates' | 'saved') => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectTab('generator')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
          aria-label="PromptEasy Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            PromptEasy
          </span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('generator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentTab === 'generator'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate</span>
          </button>

          <button
            onClick={() => onSelectTab('templates')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentTab === 'templates'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => onSelectTab('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentTab === 'saved'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>My Prompts</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white leading-none">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
