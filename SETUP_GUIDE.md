# Environment Variable Setup

## Adding Website & AI Integration Context

To add the comprehensive context about your website and AI integration to your environment variables, follow these steps:

### 1. Update CAREER_CONTEXT_DATA Environment Variable

Add the content from `AI_SYSTEM_PROMPT.md` to your `CAREER_CONTEXT_DATA` environment variable. This can be done in several ways:

#### Option A: Using .env.local file (for local development)
```bash
# Create or update .env.local in your project root
CAREER_CONTEXT_DATA="[paste the entire content from AI_SYSTEM_PROMPT.md here]"
```

#### Option B: Using your hosting provider's environment variables
- **Vercel**: Add in your Vercel dashboard under Settings > Environment Variables
- **Netlify**: Add in your Netlify dashboard under Site settings > Environment variables
- **Other hosting**: Follow your provider's documentation for setting environment variables

### 2. Key Environment Variables Required

Ensure you have these environment variables set:

```bash
# Required for AI functionality
GEMINI_API_KEY=your_google_gemini_api_key_here
CAREER_CONTEXT_DATA=your_complete_system_prompt_here
YOUR_NAME_AI=Luke

# Optional for enhanced features
GITHUB_TOKEN=your_github_token_here (for future GitHub AI integration)
OPENAI_API_KEY=your_openai_api_key_here (for TTS features)
```

### 3. Testing the Integration

After updating the environment variables:

1. Restart your development server: `npm run dev`
2. Test by asking the AI about the website: "How did you build this website?"
3. The AI should now provide detailed technical information about your implementation

### 4. What This Adds to Your AI Assistant

With this context, your AI assistant can now:

- Explain the technical architecture of your website
- Discuss the AI integration approach you used
- Detail the security measures you implemented
- Describe the advanced features you built (speech synthesis, audio visualization, etc.)
- Highlight your expertise in modern web development
- Showcase your ability to build enterprise-level applications

### 5. Example Questions Users Can Ask

Your AI can now answer questions like:
- "How did Luke build this website?"
- "What technologies power this AI integration?"
- "What security measures are implemented?"
- "How does the speech synthesis work?"
- "What makes this website technically impressive?"

This enhancement will significantly improve how your AI assistant represents your technical capabilities and the sophistication of your work.
