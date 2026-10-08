import React, { useState } from 'react';
import { SavedPrompt } from '../types';
import { Copy, Check, Trash2, Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SavedPromptsPageProps {
  savedPrompts: SavedPrompt[];
  onDeletePrompt: (id: string) => void;
  onGoToGenerator: () => void;
}

export const SavedPromptsPage: React.FC<SavedPromptsPageProps> = ({
  savedPrompts,
  onDeletePrompt,
  onGoToGenerator,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopy = async (prompt: SavedPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.generatedPrompt);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = prompt.generatedPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>My Saved Prompts</span>
          <span className="text-amber-500">⭐</span>
        </h1>
        <p className="text-lg text-slate-600 font-normal">
          Here are the prompts you saved.
        </p>
      </div>

      {/* Empty State */}
      {savedPrompts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-3xl mx-auto mb-4">
            ⭐
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            No saved prompts yet.
          </h2>
          <p className="text-slate-600 text-base mb-6">
            Create a prompt and save it here.
          </p>
          <button
            onClick={onGoToGenerator}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>Create a Prompt</span>
          </button>
        </div>
      ) : (
        /* Saved Prompts List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedPrompts.map((item) => {
            const isCopied = copiedId === item.id;
            const isExpanded = expandedId === item.id;
            
            // Format a clean preview
            const previewText = item.generatedPrompt.length > 160 && !isExpanded
              ? `${item.generatedPrompt.slice(0, 160)}...`
              : item.generatedPrompt;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Title & Tag */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600 shrink-0">
                      {item.category.split(' ')[0]}
                    </span>
                  </div>

                  {/* Prompt Text Preview */}
                  <div className="bg-slate-50 rounded-xl p-4 my-3 text-sm sm:text-base text-slate-700 leading-relaxed font-sans whitespace-pre-line border border-slate-100">
                    “{previewText}”
                  </div>

                  {item.generatedPrompt.length > 160 && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-4 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Show Full Prompt</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Card Actions: Copy & Delete */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied! ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeletePrompt(item.id)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                    title="Delete prompt"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
