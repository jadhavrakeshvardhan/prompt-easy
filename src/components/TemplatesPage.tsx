import React from 'react';
import { TEMPLATES } from '../data/templates';
import { PromptTemplateItem } from '../types';
import { ArrowRight } from 'lucide-react';

interface TemplatesPageProps {
  onUseTemplate: (template: PromptTemplateItem) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onUseTemplate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pick an Example
        </h1>
        <p className="text-lg text-slate-600 font-normal">
          Don't know what to write? Start here.
        </p>
      </div>

      {/* 6 Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" role="img" aria-label={tmpl.title}>
                  {tmpl.icon}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {tmpl.title}
                </h3>
              </div>
              <p className="text-slate-600 text-base mb-6 leading-relaxed">
                “{tmpl.description}”
              </p>
            </div>

            <button
              onClick={() => onUseTemplate(tmpl)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-800 hover:text-white font-semibold transition-all duration-150 group cursor-pointer"
            >
              <span>Use this</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
