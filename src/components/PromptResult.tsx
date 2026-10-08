import React, { useState } from 'react';
import { Copy, Check, Star, CheckCheck, RefreshCw } from 'lucide-react';

interface PromptResultProps {
  promptText: string;
  isSaved: boolean;
  onSave: () => void;
  onRegenerate?: () => void;
}

export const PromptResult: React.FC<PromptResultProps> = ({
  promptText,
  isSaved,
  onSave,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = promptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm transition-all duration-300">
      {/* Result Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>Your Prompt</span>
          <span className="text-2xl" role="img" aria-label="party popper">🎉</span>
        </h2>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Try again"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      {/* Clean Prompt Content Box */}
      <div className="relative bg-slate-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-slate-200/80 mb-6">
        <div className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal font-sans">
          {promptText}
        </div>
      </div>

      {/* Action Buttons: Copy Prompt & Save */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Copy Prompt Button */}
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.99] shadow-indigo-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Copied! ✓</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 text-indigo-100" />
              <span>📋 Copy Prompt</span>
            </>
          )}
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold border transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-amber-50 text-amber-700 border-amber-200 cursor-default'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 active:scale-[0.99]'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCheck className="w-5 h-5 text-amber-600" />
              <span>Saved! ⭐</span>
            </>
          ) : (
            <>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              <span>⭐ Save</span>
            </>
          )}
        </button>
      </div>

      {/* Helpful beginner tip */}
      <p className="mt-4 text-center text-xs sm:text-sm text-slate-500">
        💡 <span className="font-medium text-slate-600">How to use:</span> Click Copy, then open ChatGPT, Gemini, or Claude and paste it!
      </p>
    </div>
  );
};
