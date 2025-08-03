import { GoogleGenerativeAI } from "@google/generative-ai";

// Environment variable validation
if (!process.env.CAREER_CONTEXT_DATA) {
  throw new Error("CAREER_CONTEXT_DATA environment variable is not set. This should contain the AI's system prompt and Luke's professional context.");
}

// Initialize AI providers
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const AI_SYSTEM_PROMPT = process.env.CAREER_CONTEXT_DATA;

// Fallback responses for when APIs are rate limited
const fallbackResponses = process.env.FALLBACK_RESPONSES ? 
  process.env.FALLBACK_RESPONSES.split('|') : 
  [
    "Thanks for your interest in Luke's career! I'm experiencing high demand right now, but I'd love to share some highlights while you wait. Luke's a seasoned Agile Project Manager with over 20 years in tech. What specific aspect of his journey interests you most?",
    "I appreciate your patience! While I get back up to speed, Luke's expertise spans CMS implementations, game development, and enterprise project management. He's worked on everything from government platforms to blockbuster games. What would you like to know more about?",
    "Great question! I'm just catching my breath, but I'm excited to tell you about Luke's impressive career spanning gaming studios, government agencies, and cutting-edge tech companies. What draws your curiosity about his work?"
  ];

// Function to get a contextual fallback response
function getFallbackResponse(question) {
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

// OpenAI provider handler
async function handleOpenAI(question, conversationHistory = []) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  // Limit conversation history to prevent token overflow (max 4 exchanges = 8 messages)
  const limitedHistory = conversationHistory.slice(-8);

  // Convert conversation history to OpenAI format
  const messages = [
    { role: "system", content: AI_SYSTEM_PROMPT },
    ...limitedHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: "user", content: question }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 1024, // Reduced from 2048 to save quota
      temperature: 0.7,
      timeout: 20000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Gemini provider handler
async function handleGemini(question, conversationHistory = []) {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: AI_SYSTEM_PROMPT,
  });

  // Limit conversation history to prevent quota issues (max 4 exchanges = 8 messages)
  const limitedHistory = conversationHistory.slice(-8);

  // Convert conversation history to Gemini format
  const geminiHistory = limitedHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({
    history: geminiHistory,
    generationConfig: {
      maxOutputTokens: 1024, // Reduced from 2048 to save quota
      temperature: 0.7,
      topP: 0.8,
      topK: 40
    },
  });

  const result = await chat.sendMessage(question);
  const response = await result.response;
  return response.text();
}

// GitHub AI provider handler (placeholder for future implementation)
async function handleGitHubAI(question, conversationHistory = []) {
  // Future implementation for GitHub AI
  // For now, fallback to other providers
  throw new Error('GitHub AI not yet implemented');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { 
    question, 
    conversationHistory = [], 
    provider = 'auto',  // 'auto', 'openai', 'gemini', 'github'
    prompt  // Legacy support for old 'prompt' parameter
  } = req.body;

  // Support legacy 'prompt' parameter
  const userQuestion = question || prompt;

  if (!userQuestion) {
    return res.status(400).json({ error: 'Question is required' });
  }

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log("--- [LLM API] Request ---");
    console.log(`Provider: ${provider}`);
    console.log(`Question: ${userQuestion}`);
    console.log(`History length: ${conversationHistory.length}`);
    console.log("---------------------");
  }

  // Provider selection logic
  let selectedProvider = provider;
  if (provider === 'auto') {
    // Auto-select based on availability
    if (process.env.GEMINI_API_KEY) {
      selectedProvider = 'gemini';
    } else if (process.env.OPENAI_API_KEY) {
      selectedProvider = 'openai';
    } else {
      return res.status(500).json({ error: 'No AI providers configured' });
    }
  }

  try {
    let answer;

    switch (selectedProvider) {
      case 'openai':
        answer = await handleOpenAI(userQuestion, conversationHistory);
        break;
      
      case 'gemini':
        answer = await handleGemini(userQuestion, conversationHistory);
        break;
      
      case 'github':
        try {
          answer = await handleGitHubAI(userQuestion, conversationHistory);
        } catch (error) {
          console.log('GitHub AI not available, falling back to Gemini...');
          answer = await handleGemini(userQuestion, conversationHistory);
        }
        break;
      
      default:
        return res.status(400).json({ error: `Unsupported provider: ${selectedProvider}` });
    }

    // Return both 'answer' and 'reply' for compatibility
    return res.status(200).json({ 
      answer: answer,
      reply: answer,  // Legacy compatibility
      provider: selectedProvider 
    });

  } catch (error) {
    console.error(`${selectedProvider} API Error:`, error);
    
    // Enhanced rate limit detection
    const isRateLimit = error.message?.includes('429') || 
                       error.message?.includes('rate limit') ||
                       error.message?.includes('Too Many Requests') ||
                       error.status === 429;
                       
    const isQuotaExceeded = (error.message?.includes('400') && error.message?.includes('quota')) ||
                           error.message?.includes('quota exceeded') ||
                           error.message?.includes('billing');

    if (isRateLimit) {
      const fallbackAnswer = getFallbackResponse(userQuestion);
      
      return res.status(200).json({ 
        answer: fallbackAnswer,
        reply: fallbackAnswer,  // Legacy compatibility
        isRateLimitedResponse: true,
        retryAfter: 60,
        provider: selectedProvider,
        message: 'API rate limit reached, using contextual response'
      });
    }
    
    if (isQuotaExceeded) {
      const fallbackAnswer = getFallbackResponse(userQuestion);
      
      return res.status(200).json({ 
        answer: fallbackAnswer,
        reply: fallbackAnswer,  // Legacy compatibility
        isRateLimitedResponse: true,
        retryAfter: 300,
        provider: selectedProvider,
        message: 'API quota exceeded, using contextual response'
      });
    }

    // Try fallback provider if primary fails
    if (selectedProvider !== 'gemini' && genAI) {
      try {
        console.log(`${selectedProvider} failed, trying Gemini fallback...`);
        const fallbackAnswer = await handleGemini(userQuestion, conversationHistory);
        
        return res.status(200).json({ 
          answer: fallbackAnswer,
          reply: fallbackAnswer,  // Legacy compatibility
          provider: 'gemini',
          fallbackUsed: true,
          originalProvider: selectedProvider
        });
      } catch (fallbackError) {
        console.error('Gemini fallback also failed:', fallbackError);
      }
    }

    // If all else fails, return contextual fallback
    const fallbackAnswer = getFallbackResponse(userQuestion);
    return res.status(200).json({ 
      answer: fallbackAnswer,
      reply: fallbackAnswer,  // Legacy compatibility
      isRateLimitedResponse: true,
      provider: 'fallback'
    });
  }
}
