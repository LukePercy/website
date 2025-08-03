import { GoogleGenerativeAI } from "@google/generative-ai";

// Optional GitHub AI integration
// This endpoint can be used to integrate with GitHub's AI services
// Currently using Gemini as primary, but this can be extended

// Initialize Gemini AI (fallback for now)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const AI_SYSTEM_PROMPT = process.env.CAREER_CONTEXT_DATA;

// Fallback responses for when API is rate limited
const fallbackResponses = process.env.FALLBACK_RESPONSES ? 
  process.env.FALLBACK_RESPONSES.split('|') : 
  [
    "Thanks for your interest in Luke's career! I'm experiencing high demand right now, but I'd love to share some highlights while you wait. Luke's a seasoned Agile Project Manager with over 20 years in tech. What specific aspect of his journey interests you most?",
    "I appreciate your patience! While I get back up to speed, Luke's expertise spans CMS implementations, game development, and enterprise project management. He's worked on everything from government platforms to blockbuster games. What would you like to know more about?",
    "Great question! I'm just catching my breath, but I'm excited to tell you about Luke's impressive career spanning gaming studios, government agencies, and cutting-edge tech companies. What draws your curiosity about his work?"
  ];

// Function to get a contextual fallback response
function getFallbackResponse(question) {
  // Simple keyword-based selection for more relevant fallback
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('game') || lowerQuestion.includes('gaming')) {
    return "I'm experiencing high demand right now, but I'd love to tell you about Luke's gaming experience! He's worked on major titles like Jonah Lomu Rugby Challenge, Shatter, and Star Wars: Clone Wars across multiple platforms. His gaming portfolio spans over a decade at studios like Sidhe (now PikPok) and Synty Studios. What specific aspect of his game development work interests you?";
  }
  
  if (lowerQuestion.includes('cms') || lowerQuestion.includes('content') || lowerQuestion.includes('drupal') || lowerQuestion.includes('umbraco')) {
    return "Thanks for your patience! While I get back online, here's what makes Luke special in the CMS world: He has extensive experience with Umbraco, Drupal, Silverstripe, and Squiz DXP platforms. He led the government's Common Web Platform project and has managed everything from small business sites to multimillion-dollar enterprise implementations. Which CMS platform interests you most?";
  }
  
  if (lowerQuestion.includes('government') || lowerQuestion.includes('project')) {
    return "I appreciate your patience! Luke's government project experience is impressive - he led the NZTA Security Development Lifecycle Tool saving significant vendor costs, and delivered the Department of Internal Affairs Common Web Platform. His project management expertise spans 15+ years with certifications from Scrum Alliance, ICAgile, and Scrum.org. What type of projects interest you most?";
  }
  
  if (lowerQuestion.includes('book') || lowerQuestion.includes('author') || lowerQuestion.includes('writing')) {
    return "While I'm catching up on demand, let me tell you about Luke's creative side! He's the author of 'The Dark That Dwells Beneath Te Aro' - a critically acclaimed book with 4.5 stars on Amazon, available as both print and audiobook on Spotify and Audible. It's a fascinating blend of his creative and technical talents. Would you like to know more about his writing or where to find the book?";
  }
  
  // Default fallback - rotate through the general responses
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question, conversationHistory = [], useGitHubAI = false } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    if (useGitHubAI && process.env.GITHUB_TOKEN) {
      // Future implementation for GitHub AI
      // This would require GitHub's AI API integration
      // For now, fallback to Gemini directly
      
      if (!genAI || !AI_SYSTEM_PROMPT) {
        throw new Error('AI configuration not available');
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: AI_SYSTEM_PROMPT,
      });

      // Convert conversation history to Gemini format
      const geminiHistory = conversationHistory.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: geminiHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        },
      });

      const result = await chat.sendMessage(question);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({ answer: text });
    } else {
      // Default to Gemini implementation
      if (!genAI || !AI_SYSTEM_PROMPT) {
        throw new Error('AI configuration not available');
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: AI_SYSTEM_PROMPT,
      });

      // Convert conversation history to Gemini format
      const geminiHistory = conversationHistory.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: geminiHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        },
      });

      const result = await chat.sendMessage(question);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({ answer: text });
    }
  } catch (error) {
    console.error('GitHub AI API Error:', error);
    
    // Handle rate limit errors specifically
    if (error.status === 429) {
      console.error('Rate limit exceeded. Retry delay:', error.errorDetails?.find(d => d['@type']?.includes('RetryInfo'))?.retryDelay);
      
      // Return a contextual fallback response instead of just an error
      const fallbackAnswer = getFallbackResponse(question);
      
      return res.status(200).json({ 
        answer: fallbackAnswer,
        isRateLimitedResponse: true, // Flag to indicate this is a fallback
        retryAfter: 60 // Suggest 60 seconds wait for full AI response
      });
    }
    
    // Handle quota exceeded errors
    if (error.status === 400 && error.message?.includes('quota')) {
      console.error('API quota exceeded');
      
      // Return a contextual fallback response instead of just an error
      const fallbackAnswer = getFallbackResponse(question);
      
      return res.status(200).json({ 
        answer: fallbackAnswer,
        isRateLimitedResponse: true, // Flag to indicate this is a fallback
        retryAfter: 300 // Suggest 5 minutes wait for full AI response
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}
