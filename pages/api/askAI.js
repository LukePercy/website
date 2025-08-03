import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure all required environment variables are set
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}
// CAREER_CONTEXT_DATA should contain the full system prompt: persona, instructions, and Luke's details.
if (!process.env.CAREER_CONTEXT_DATA) {
  throw new Error("CAREER_CONTEXT_DATA environment variable is not set. This should contain the AI's system prompt and Luke's professional context.");
}
// YOUR_NAME_AI is checked for completeness, though it might not be directly substituted 
// into CAREER_CONTEXT_DATA if the name "Luke" is already hardcoded there.
if (!process.env.YOUR_NAME_AI) {
  throw new Error("YOUR_NAME_AI environment variable is not set (e.g., 'Luke').");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This environment variable holds the complete system prompt,
// including the AI's persona, instructions, and all of Luke's professional details.
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

  const { question, conversationHistory = [] } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  // --- Debugging: Log the loaded system prompt when the handler is called ---
  // This will help verify if the environment variable is being loaded correctly.
  // You'll see this in your Next.js server console, not the browser console.
  if (process.env.NODE_ENV === 'development') { // Only log in development
    console.log("--- [askAI API] System Prompt Loaded ---");
    console.log(AI_SYSTEM_PROMPT ? `First 300 chars: ${AI_SYSTEM_PROMPT.substring(0, 300)}...` : "AI_SYSTEM_PROMPT is UNDEFINED or EMPTY!");
    console.log("--- [askAI API] User Question ---");
    console.log(question);
    console.log("--- [askAI API] Conversation History Length ---");
    console.log(`${conversationHistory.length} messages`);
    console.log("------------------------------------");
  }
  // --- End Debugging ---

  try {
    // Provide the system prompt directly when getting the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: AI_SYSTEM_PROMPT,
    });

    // Convert conversation history to Gemini format
    const geminiHistory = conversationHistory.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Use startChat with conversation history for context
    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7, // Slight creativity while maintaining accuracy
        topP: 0.8,
        topK: 40
      },
    });

    // Send the current question
    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ answer: text });
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    
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
    
    // Log more details if available, especially for API errors
    if (error.response && error.response.data) {
        console.error('Gemini API Error Details:', error.response.data);
    }
    
    res.status(500).json({ error: 'Failed to get response from AI. Please try again later.' });
  }
}