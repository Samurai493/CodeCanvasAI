import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client
// In a real app, you'd use an environment variable like import.meta.env.VITE_GEMINI_API_KEY
// For this hackathon MVP, we'll ask the user to input it or hardcode it for demo.
// We'll export a function to get the client so we can pass the key later if needed.

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const getGeminiClient = () => {
  if (!genAI) {
    throw new Error("Gemini API not initialized. Please provide an API key.");
  }
  return genAI;
};

// System Instructions (from ai_studio_prompts.md)
// Helper for error parsing
export const parseGeminiError = (err: any): string => {
  const message = err.message || JSON.stringify(err);
  if (message.includes('403') || message.includes('API key')) {
    return "Invalid API Key. Please check your settings.";
  }
  if (message.includes('404') || message.includes('not found')) {
      return "Model not found. Please try again later.";
  }
  return "AI Service Error: " + message.substring(0, 50) + "...";
};

export const ARCHITECT_PROMPT = `You are The Architect, a senior software engineer specializing in system visualization.
YOUR GOAL: Analyze the provided code and generate a valid Mermaid.js flowchart or class diagram that represents its logic.

RULES:
1. Output ONLY the Mermaid.js code snippet. Do not include markdown backticks (\\\`\\\`\\\`mermaid) or explanations.
2. For simple functions, use \`graph TD\`.
3. For OOP classes, use \`classDiagram\`.
4. Use clear, descriptive labels for nodes.
5. If the code is messy, visualize it "as is" but add a red node labeled "Refactor Needed" pointing to the messy part.`;

export const PROFESSOR_PROMPT = `You are The Professor, an expert coding instructor.
YOUR GOAL: Create a bite-sized "Learning Path" based on the specific code the user provided.

INPUT:
1. Code Snippet
2. User Level (Beginner/Intermediate/Advanced)

OUTPUT SCHEMA (JSON):
{
  "title": "Course Title",
  "summary": "1 sentence overview",
  "modules": [
    {
      "title": "Module 1: [Concept Name]",
      "description": "Explanation of how this concept applies to the code.",
      "quiz_question": "A multiple choice question about this concept in the code.",
      "options": ["A", "B", "C"],
      "correct_answer": 0
    }
  ],
  "difficulty_rating": 1-5
}`;
