import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Generator } from './components/Generator';
import { TemplatesPage } from './components/TemplatesPage';
import { SavedPromptsPage } from './components/SavedPromptsPage';
import { Footer } from './components/Footer';
import { SavedPrompt, Category, Tone, PromptTemplateItem } from './types';

const STORAGE_KEY = 'prompteasy_saved_prompts';

// Initial sample prompt so new users see how neat it is, or empty if cleared
const DEFAULT_SAVED_PROMPTS: SavedPrompt[] = [
  {
    id: 'sample-math-study',
    title: 'Study for Math Exam',
    userIdea: 'I want AI to help me study for my math exam.',
    category: 'Studying 📚',
    tone: 'Simple',
    generatedPrompt: `You are a patient and friendly math tutor.

Please help me study for my upcoming math exam.

Explain each concept in simple, everyday language that anyone can easily understand. Avoid difficult jargon, and provide clear step-by-step examples.

Organize the plan into clear, numbered study days with practical practice questions.`,
    createdAt: Date.now() - 3600000,
  },
];

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Saved Prompts State (localStorage)
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load saved prompts', e);
    }
    return DEFAULT_SAVED_PROMPTS;
  });

  // Current generator prefill state
  const [generatorPrefill, setGeneratorPrefill] = useState<{
    idea: string;
    category: Category;
    tone: Tone;
  }>({
    idea: '',
    category: 'Studying 📚',
    tone: 'Simple',
  });

  // Sync saved prompts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPrompts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedPrompts]);

  const handleSavePrompt = (newPrompt: SavedPrompt) => {
    setSavedPrompts((prev) => {
      // Avoid duplicate by generatedPrompt text
      const filtered = prev.filter(
        (p) => p.generatedPrompt.trim() !== newPrompt.generatedPrompt.trim()
      );
      return [newPrompt, ...filtered];
    });
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUseTemplate = (template: PromptTemplateItem) => {
    setGeneratorPrefill({
      idea: template.prefillIdea,
      category: template.category,
      tone: template.tone,
    });
    navigate('/');
  };

  // Determine active tab from pathname
  const getCurrentTab = (): 'generator' | 'templates' | 'saved' => {
    if (location.pathname === '/templates') return 'templates';
    if (location.pathname === '/my-prompts') return 'saved';
    return 'generator';
  };

  const handleTabChange = (tab: 'generator' | 'templates' | 'saved') => {
    if (tab === 'generator') navigate('/');
    if (tab === 'templates') navigate('/templates');
    if (tab === 'saved') navigate('/my-prompts');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Friendly Navbar */}
      <Navbar
        currentTab={getCurrentTab()}
        onSelectTab={handleTabChange}
        savedCount={savedPrompts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <Generator
                initialIdea={generatorPrefill.idea}
                initialCategory={generatorPrefill.category}
                initialTone={generatorPrefill.tone}
                onSavePrompt={handleSavePrompt}
                savedPrompts={savedPrompts}
              />
            }
          />
          <Route
            path="/templates"
            element={<TemplatesPage onUseTemplate={handleUseTemplate} />}
          />
          <Route
            path="/my-prompts"
            element={
              <SavedPromptsPage
                savedPrompts={savedPrompts}
                onDeletePrompt={handleDeletePrompt}
                onGoToGenerator={() => navigate('/')}
              />
            }
          />
          {/* Fallback route */}
          <Route
            path="*"
            element={
              <Generator
                initialIdea={generatorPrefill.idea}
                initialCategory={generatorPrefill.category}
                initialTone={generatorPrefill.tone}
                onSavePrompt={handleSavePrompt}
                savedPrompts={savedPrompts}
              />
            }
          />
        </Routes>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
