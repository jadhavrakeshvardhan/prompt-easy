import { Category, Tone } from '../types';

/**
 * Cleans user phrasing to find core action and topic
 */
function extractCoreTopic(input: string): string {
  let cleaned = input.trim();
  // Strip trailing punctuation
  cleaned = cleaned.replace(/[.!?]+$/, '');

  // Strip common conversational openers
  const openers = [
    /^i want (ai to help me|to learn|to know how to|to create|to write|to make|to)?\s*/i,
    /^i need (help with|to learn|to write|to make|a)?\s*/i,
    /^help me (with|to understand|to learn|to write|to make|to)?\s*/i,
    /^can you (help me|write|explain|show me)?\s*/i,
    /^please (help me|write|explain|make)?\s*/i,
    /^tell me (how to|about)?\s*/i,
    /^give me (ideas for|a)?\s*/i,
    /^how (to|do i|can i)\s*/i,
  ];

  for (const regex of openers) {
    cleaned = cleaned.replace(regex, '').trim();
  }

  // Capitalize first letter
  if (cleaned.length > 0) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return input.trim();
}

/**
 * Derives a short, clean title for the prompt card
 */
export function derivePromptTitle(userIdea: string, category: Category): string {
  const core = extractCoreTopic(userIdea);
  if (!core) {
    return category.split(' ')[0] + ' Prompt';
  }
  // If short enough, use it
  if (core.length <= 36) {
    return core;
  }
  // Otherwise truncate cleanly
  const words = core.split(' ');
  const title = words.slice(0, 5).join(' ');
  return title.length < core.length ? `${title}...` : title;
}

/**
 * Builds a prompt following the strict structure:
 * Role + Task + Details + Output Format
 */
export function generatePromptMock(userIdea: string, category: Category, tone: Tone): string {
  const trimmed = userIdea.trim();
  const core = extractCoreTopic(trimmed) || 'complete this task';
  const lowerIdea = trimmed.toLowerCase();

  // 1. Role determination
  let role = '';
  const toneWord = tone.toLowerCase();

  if (category.includes('Studying')) {
    if (lowerIdea.includes('math')) {
      role = `You are a ${toneWord === 'professional' ? 'certified' : 'patient and friendly'} math tutor.`;
    } else if (lowerIdea.includes('english') || lowerIdea.includes('spanish') || lowerIdea.includes('language')) {
      role = `You are an encouraging and fluent language teacher.`;
    } else if (lowerIdea.includes('history') || lowerIdea.includes('science')) {
      role = `You are an engaging educator who loves making learning fun and easy.`;
    } else {
      role = `You are a helpful and knowledgeable teacher.`;
    }
  } else if (category.includes('Coding')) {
    if (lowerIdea.includes('python')) {
      role = `You are an experienced Python programmer and mentor.`;
    } else if (lowerIdea.includes('java')) {
      role = `You are a friendly Java teacher and software engineer.`;
    } else if (lowerIdea.includes('javascript') || lowerIdea.includes('react') || lowerIdea.includes('web')) {
      role = `You are a supportive web developer and coding instructor.`;
    } else {
      role = `You are a senior software developer who excels at explaining code simply.`;
    }
  } else if (category.includes('Writing')) {
    if (lowerIdea.includes('email')) {
      role = `You are an expert communication and email writing specialist.`;
    } else if (lowerIdea.includes('essay') || lowerIdea.includes('story') || lowerIdea.includes('blog')) {
      role = `You are a creative writing coach and editor.`;
    } else {
      role = `You are a skilled writer and editor.`;
    }
  } else if (category.includes('Business')) {
    role = `You are a practical business advisor and strategist.`;
  } else if (category.includes('Ideas')) {
    role = `You are a creative brainstorm partner full of inspiring ideas.`;
  } else {
    // Other
    role = `You are a helpful and versatile AI assistant.`;
  }

  // 2. Task determination
  let task = '';
  if (lowerIdea.startsWith('help me')) {
    task = `Please ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}.`;
  } else if (lowerIdea.startsWith('i want') || lowerIdea.startsWith('i need')) {
    task = `Your goal is to help me: ${trimmed}.`;
  } else {
    task = `Your goal is to help me with the following: ${trimmed}.`;
  }

  // 3. Details determination (aligned with chosen Tone)
  let details = '';
  switch (tone) {
    case 'Simple':
      details = `Explain everything in simple, everyday language that anyone can easily understand. Avoid difficult jargon, and provide clear examples or analogies whenever helpful.`;
      break;
    case 'Detailed':
      details = `Provide a comprehensive and in-depth response. Include key concepts, practical real-world examples, step-by-step explanations, and any important tips or caveats.`;
      break;
    case 'Friendly':
      details = `Keep the tone warm, welcoming, and encouraging. Be supportive and positive, making the experience enjoyable and easy to follow.`;
      break;
    case 'Professional':
      details = `Maintain a polished, objective, and executive tone. Focus on clear insights, high standards, efficiency, and actionable recommendations.`;
      break;
    default:
      details = `Keep explanations clear, straightforward, and easy to apply.`;
  }

  // 4. Output Format determination
  let outputFormat = '';
  if (category.includes('Studying')) {
    outputFormat = `Organize the explanation into clear, numbered sections or bullet points with practical takeaways so it is easy to read and review.`;
  } else if (category.includes('Coding')) {
    outputFormat = `Include clean, well-commented code snippets along with a brief explanation of how each part works.`;
  } else if (category.includes('Writing')) {
    outputFormat = `Provide the final text clearly formatted, along with a couple of quick suggestions or alternative variations.`;
  } else if (category.includes('Business')) {
    outputFormat = `Structure the advice into actionable steps, bullet points, and key takeaways for quick execution.`;
  } else if (category.includes('Ideas')) {
    outputFormat = `Present the ideas as a numbered list with a catchy title and a 2-sentence description for each idea.`;
  } else {
    outputFormat = `Organize the answer into clear steps and bullet points so it is easy to read and follow.`;
  }

  // Combine into standard 4-block layout
  return `${role}

${task}

${details}

${outputFormat}`;
}

/**
 * Main prompt generator entry point
 * Built so an AI API (e.g. Gemini) can easily replace or enhance this.
 */
export async function generatePrompt(
  userIdea: string,
  category: Category,
  tone: Tone
): Promise<string> {
  // Simulate a brief natural generation moment (350ms) for delightful UX
  await new Promise((resolve) => setTimeout(resolve, 350));
  return generatePromptMock(userIdea, category, tone);
}
