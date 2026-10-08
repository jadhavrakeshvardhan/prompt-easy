export type Category = 
  | 'Writing ✍️'
  | 'Studying 📚'
  | 'Coding 💻'
  | 'Business 💼'
  | 'Ideas 💡'
  | 'Other';

export type Tone = 
  | 'Simple'
  | 'Detailed'
  | 'Friendly'
  | 'Professional';

export interface SavedPrompt {
  id: string;
  title: string;
  userIdea: string;
  category: Category;
  tone: Tone;
  generatedPrompt: string;
  createdAt: number;
}

export interface PromptTemplateItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  prefillIdea: string;
  category: Category;
  tone: Tone;
}
