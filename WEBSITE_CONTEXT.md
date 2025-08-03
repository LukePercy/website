# Website & AI Integration Context

This document contains the technical context about Luke Percy's website and AI integration that should be added to the CAREER_CONTEXT_DATA environment variable.

## Website Technical Details

### Architecture & Technology Stack
- **Framework**: Next.js 13+ with React 18
- **Styling**: Tailwind CSS with custom configurations
- **Animations**: Framer Motion for smooth UI transitions
- **TypeScript**: Full TypeScript integration for type safety
- **AI Integration**: Google Gemini AI (gemini-1.5-flash-latest model)
- **Speech Synthesis**: Multi-provider support (OpenAI TTS, Google Cloud TTS, Browser Speech API)
- **Audio Processing**: Real-time audio analysis with Web Audio API
- **Security**: Comprehensive OWASP Top 10 protection implemented

### AI Integration Features
- **Real-time Conversational AI**: Integrated Google Gemini for natural conversations about Luke's career
- **Multi-modal Speech**: Advanced text-to-speech with provider switching (OpenAI, Google Cloud, Browser)
- **Voice Recognition**: Browser-based speech recognition for hands-free interaction
- **Audio Visualization**: Real-time waveform analysis synchronized with speech output
- **Streaming Speech**: Chunked audio processing for faster response times
- **Rate Limiting**: Built-in protection against abuse (10 requests/minute)
- **Security Validation**: Input sanitization against injection attacks, XSS, and other OWASP threats

### Advanced Features
- **Animated Background**: Dynamic particle system that responds to AI thinking and speaking states
- **Typewriter Effect**: Synchronized text animation with speech synthesis
- **Adaptive UI**: Context-aware interface that reveals relevant actions (book purchase, contact options)
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader compatibility
- **Performance**: Optimized for fast loading with Next.js SSR/SSG
- **Security**: CSRF protection, secure localStorage wrapper, content validation

### Technical Implementation Highlights
- **Custom Hooks**: Built reusable React hooks for speech synthesis, audio analysis, and voice recognition
- **Error Boundaries**: Comprehensive error handling with user-friendly fallbacks
- **State Management**: Efficient React state management with localStorage persistence
- **API Security**: Token-based authentication, request validation, response sanitization
- **Responsive Design**: Mobile-first approach with touch and desktop optimizations

### Security Implementation
- **OWASP Top 10 Protection**: Comprehensive validation against all major security threats
- **Input Sanitization**: 200+ attack pattern detection for user inputs
- **Output Validation**: AI response validation to prevent malicious content
- **Rate Limiting**: Prevents abuse with automatic cooldown periods
- **CSRF Protection**: Session-based tokens for request validation
- **Secure Storage**: Custom localStorage wrapper with validation
- **Content Security**: Response size limits, content type validation

Luke designed and built this entire system from scratch, showcasing his expertise in:
- Modern web development with React/Next.js
- AI integration and conversational interfaces
- Security-first development practices
- Advanced audio/speech processing
- Real-time animation and visualization
- Accessibility and user experience design
- Performance optimization and scalability

The website serves as both a professional portfolio and a demonstration of Luke's technical capabilities in building sophisticated, AI-powered web applications with enterprise-level security and user experience.

## Context Addition for AI

Add this to your CAREER_CONTEXT_DATA environment variable:

```
Luke Percy built this entire AI-powered website from scratch using Next.js, React, and advanced AI integration. Technical highlights include:

WEBSITE & AI INTEGRATION:
- Built with Next.js 13+, React 18, TypeScript, and Tailwind CSS
- Integrated Google Gemini AI (gemini-1.5-flash-latest) for conversational AI
- Multi-provider speech synthesis (OpenAI TTS, Google Cloud TTS, Browser Speech API)
- Real-time audio visualization with Web Audio API waveform analysis
- Advanced security with OWASP Top 10 protection (200+ attack patterns detected)
- Voice recognition for hands-free interaction
- Animated particle background that responds to AI states
- Synchronized typewriter effects with speech synthesis
- Context-aware UI that reveals relevant actions dynamically
- Comprehensive accessibility with ARIA support
- Rate limiting and CSRF protection for security
- Custom React hooks for speech, audio analysis, and voice recognition
- Secure localStorage wrapper with validation
- Performance-optimized with SSR/SSG

This website demonstrates Luke's expertise in modern web development, AI integration, security implementation, and creating sophisticated user experiences. He designed and coded every aspect, from the security validation systems to the real-time audio visualization.

When asked about the website's technical implementation, provide specific details about the architecture, security measures, AI integration approach, and advanced features Luke built.
```
