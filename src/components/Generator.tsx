import React, { useState, useRef, useEffect } from 'react';
import { Category, Tone, SavedPrompt } from '../types';
import { generatePrompt, derivePromptTitle } from '../utils/promptGenerator';
import { PromptResult } from './PromptResult';
import { Sparkles, ChevronDown } from 'lucide-react';

interface GeneratorProps {
  initialIdea?: string;
  initialCategory?: Category;
  initialTone?: Tone;
  onSavePrompt: (prompt: SavedPrompt) => void;
  savedPrompts: SavedPrompt[];
}

export const Generator: React.FC<GeneratorProps> = ({
  initialIdea = '',
  initialCategory = 'Studying 📚',
  initialTone = 'Simple',
  onSavePrompt,
  savedPrompts,
}) => {
  const [userIdea, setUserIdea] = useState(initialIdea);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [tone, setTone] = useState<Tone>(initialTone);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // If initialIdea changes (e.g. from selecting a template), update state
  useEffect(() => {
    if (initialIdea) {
      setUserIdea(initialIdea);
    }
    if (initialCategory) {
      setCategory(initialCategory);
    }
    if (initialTone) {
      setTone(initialTone);
    }
  }, [initialIdea, initialCategory, initialTone]);

  // Check if current prompt is already saved
  const isCurrentSaved = Boolean(
    generatedPrompt &&
      savedPrompts.some(
        (p) => p.generatedPrompt.trim() === generatedPrompt.trim()
      )
  );

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userIdea.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generatePrompt(userIdea, category, tone);
      setGeneratedPrompt(result);
      setCurrentPromptId(Date.now().toString());

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedPrompt) return;

    const title = derivePromptTitle(userIdea, category);
    const newSaved: SavedPrompt = {
      id: currentPromptId || Date.now().toString(),
      title,
      userIdea: userIdea.trim(),
      category,
      tone,
      generatedPrompt,
      createdAt: Date.now(),
    };

    onSavePrompt(newSaved);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          What do you want AI to do?
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto font-normal">
          Tell us in simple words. We'll turn it into a better AI prompt.
        </p>

        {/* Friendly Example Clickable Hint */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setUserIdea('I want AI to help me study for my math exam.');
              setCategory('Studying 📚');
              setTone('Simple');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/60 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-indigo-200 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="text-indigo-500 font-semibold">Try example:</span>
            <span>“I want AI to help me study for my math exam.”</span>
          </button>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm transition-shadow">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Card Heading */}
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tell us your idea 💡
            </h2>
          </div>

          {/* Large Textarea */}
          <div>
            <textarea
              rows={4}
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              placeholder="Example: Help me make a study plan for my exams."
              className="w-full rounded-xl sm:rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* 2 Simple Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* 1. What is it for? */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-slate-700">
                1. What is it for?
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full appearance-none rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 pr-10 text-base text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                >
                  <option value="Writing ✍️">Writing ✍️</option>
                  <option value="Studying 📚">Studying 📚</option>
                  <option value="Coding 💻">Coding 💻</option>
                  <option value="Business 💼">Business 💼</option>
                  <option value="Ideas 💡">Ideas 💡</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. How should AI answer? */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-slate-700">
                2. How should AI answer?
              </label>
              <div className="relative">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                  className="w-full appearance-none rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 pr-10 text-base text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                >
                  <option value="Simple">Simple</option>
                  <option value="Detailed">Detailed</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Professional">Professional</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Large Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating || !userIdea.trim()}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-6 h-6 text-amber-200" />
              <span>{isGenerating ? 'Making your prompt...' : '✨ Make My Prompt'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Result Card */}
      {generatedPrompt && (
        <div ref={resultRef} className="pt-2">
          <PromptResult
            promptText={generatedPrompt}
            isSaved={isCurrentSaved}
            onSave={handleSave}
            onRegenerate={handleGenerate}
          />
        </div>
      )}
    </div>
  );
};
