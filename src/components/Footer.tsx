import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 text-center text-sm text-slate-500">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>PromptEasy</span>
          <span className="text-slate-400 font-normal">— Tell us what you want, get a prompt, copy it.</span>
        </div>
        <p className="text-xs text-slate-400">
          Designed for simplicity & beginner-friendly AI use.
        </p>
      </div>
    </footer>
  );
};
