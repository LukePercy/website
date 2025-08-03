import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Settings } from 'lucide-react';
import dynamic from 'next/dynamic';
import SettingsPanel from './SettingsPanel';
import ErrorBoundary from './ErrorBoundary';
import { useSpeechRecognition, useSpeechSynthesis } from '../hooks/useSpeech';
import { useAISpeech } from '../hooks/useAISpeech';
import { useStreamingSpeech } from '../hooks/useStreamingSpeech';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';

// Dynamically import AnimatedBackground to avoid SSR issues
const AnimatedBackground = dynamic(() => import('./AnimatedBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full bg-black" />
});

// Custom hook to handle client-side only rendering for timestamps
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};

const FuturisticInterface = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const inputRef = useRef(null);
  const [hasPlayedGreeting, setHasPlayedGreeting] = useState(false);
  const [settings, setSettings] = useState({
    aiProvider: 'gemini',
    voiceEnabled: true,
    animationsEnabled: true,
    speechRate: 0.9,
    selectedVoice: null,
    speechProvider: 'openai', // Default to OpenAI TTS for premium quality
    openaiVoice: 'onyx', // Default OpenAI voice - deep, authoritative
    googleVoice: 'en-US-Neural2-D' // Default Google Cloud voice
  });
  const [currentAIResponse, setCurrentAIResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showBookButtons, setShowBookButtons] = useState(false);
  const [showContactButtons, setShowContactButtons] = useState(false);
  const [speechStarted, setSpeechStarted] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const isClient = useIsClient();

  // Secure localStorage wrapper to prevent XSS and validate data
  const secureLocalStorage = {
    setItem: (key, value) => {
      try {
        // Validate key and value
        if (typeof key !== 'string' || key.length > 100) return false;
        if (typeof value !== 'string' || value.length > 10000) return false;
        
        // Sanitize key and value
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        const safeValue = value.replace(/[<>{}]/g, '');
        
        localStorage.setItem(safeKey, safeValue);
        return true;
      } catch (error) {
        console.warn('localStorage setItem failed:', error);
        return false;
      }
    },
    getItem: (key) => {
      try {
        if (typeof key !== 'string' || key.length > 100) return null;
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        const value = localStorage.getItem(safeKey);
        
        // Additional validation for retrieved values
        if (value && (value.length > 10000 || /[<>{}]/.test(value))) {
          localStorage.removeItem(safeKey);
          return null;
        }
        
        return value;
      } catch (error) {
        console.warn('localStorage getItem failed:', error);
        return null;
      }
    },
    removeItem: (key) => {
      try {
        if (typeof key !== 'string' || key.length > 100) return false;
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        localStorage.removeItem(safeKey);
        return true;
      } catch (error) {
        console.warn('localStorage removeItem failed:', error);
        return false;
      }
    }
  };

  // Random greeting messages for first-time visitors
  const randomGreetings = [
    "Welcome to Luke's professional website! I'm his AI assistant, built right into this site. Curious about his 20+ year journey in tech? Ask me anything about his career in web development, game production, or agile project management!",
    "Hello there! You've discovered Luke's AI-powered professional showcase. I'm here to tell you about Luke Percy - a passionate technologist with incredible experience spanning web development, gaming, and enterprise project management. What interests you most?",
    "Greetings, and welcome to Luke's digital portfolio. I'm his AI colleague built into this website, and I'd love to share his amazing career story with you. From building games to leading government projects, there's so much to explore. What would you like to know?",
    "Hi! You're experiencing Luke's AI-enhanced professional website. Ready to learn about one of New Zealand's most versatile tech professionals? Luke's got 20+ years of fascinating experience I can't wait to share. What aspect of his career catches your attention?",
    "Welcome to Luke's interactive professional showcase! I'm his AI assistant, seamlessly integrated into this website to chat about his incredible journey from game development to enterprise project management. What questions do you have?",
    "Hello! You've found Luke's AI-powered portfolio. I'm excited to tell you about Luke Percy - a true tech polymath who's shaped digital experiences for over two decades. Whether it's web development, gaming, or agile coaching, ask away!",
    "Greetings, visitor! You're on Luke's professional website, complete with AI assistance. I'm his digital representative, and I'm passionate about sharing his remarkable career story. From startup games to government platforms, his journey is fascinating. What draws your curiosity?",
    "Welcome to Luke's cutting-edge professional website! I'm the AI assistant he built into this site to showcase his impressive 20+ year career in technology. He's worked on everything from blockbuster games to million-dollar enterprise projects. What would you like to explore?"
  ];

  const {
    isListening,
    transcript,
    isSupported: speechRecognitionSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: speechSynthesisSupported,
    availableVoices,
    getBestVoice,
  } = useSpeechSynthesis();

  // AI Speech hook for advanced speech synthesis
  const {
    stop: stopAISpeaking,
    isSpeaking: isAISpeaking,
    isLoading: isAISpeechLoading
  } = useAISpeech();

  // Streaming speech for chunked processing
  const {
    speak: streamSpeak,
    stop: stopStreamSpeaking,
    isSpeaking: isStreamSpeaking,
    isLoading: isStreamLoading
  } = useStreamingSpeech();

  // Audio analyzer for waveform sync
  const {
    audioData,
    startMonitoring,
    stopMonitoring,
    isSupported: audioAnalyzerSupported
  } = useAudioAnalyzer();

  // Enable audio on first user interaction
  const enableAudio = useCallback(async () => {
    if (!audioEnabled) {
      try {
        // Create a silent audio context to enable autoplay
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        setAudioEnabled(true);
        console.log('Audio enabled via user interaction');
      } catch (error) {
        console.warn('Failed to enable audio:', error);
      }
    }
  }, [audioEnabled]);

  // Preprocess text for better speech synthesis
  const preprocessTextForSpeech = (text) => {
    return text
      // Convert decimal ratings to speech-friendly format
      .replace(/(\d+)\.5(\s*(?:out\s*of\s*\d+\s*)?stars?)/gi, '$1 and a half $2')
      .replace(/(\d+)\.25(\s*(?:out\s*of\s*\d+\s*)?stars?)/gi, '$1 and a quarter $2')
      .replace(/(\d+)\.75(\s*(?:out\s*of\s*\d+\s*)?stars?)/gi, '$1 and three quarters $2')
      .replace(/(\d+)\.33?(\s*(?:out\s*of\s*\d+\s*)?stars?)/gi, '$1 and a third $2')
      .replace(/(\d+)\.66?7?(\s*(?:out\s*of\s*\d+\s*)?stars?)/gi, '$1 and two thirds $2')
      // Convert other common decimal patterns
      .replace(/(\d+)\.5/g, '$1 and a half')
      .replace(/(\d+)\.25/g, '$1 and a quarter')
      .replace(/(\d+)\.75/g, '$1 and three quarters')
      .replace(/(\d+)\.33?/g, '$1 and a third')
      .replace(/(\d+)\.66?7?/g, '$1 and two thirds')
      // Convert slash notation (e.g., "4.5/5" -> "4 and a half out of 5")
      .replace(/(\d+)\.5\/(\d+)/g, '$1 and a half out of $2')
      .replace(/(\d+)\.25\/(\d+)/g, '$1 and a quarter out of $2')
      .replace(/(\d+)\.75\/(\d+)/g, '$1 and three quarters out of $2')
      .replace(/(\d+)\.33?\/(\d+)/g, '$1 and a third out of $2')
      .replace(/(\d+)\.66?7?\/(\d+)/g, '$1 and two thirds out of $2')
      // Convert other decimal/slash patterns
      .replace(/(\d+)\.(\d+)\/(\d+)/g, '$1 point $2 out of $3')
      // Convert standalone decimals in ratings context
      .replace(/\b(\d+)\.(\d+)\b/g, '$1 point $2');
  };

  // Book detection function
  const detectBookQuery = (query) => {
    const bookKeywords = [
      'book', 'books', 'author', 'wrote', 'written', 'published', 'novel', 'story',
      'dark that dwells', 'te aro', 'amazon', 'kindle', 'audiobook', 'spotify',
      'buy', 'purchase', 'read', 'literature', 'writing', 'publish'
    ];
    
    const lowerQuery = query.toLowerCase();
    return bookKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Contact detection function
  const detectContactQuery = (query) => {
    const contactKeywords = [
      'contact', 'email', 'linkedin', 'connect', 'reach out', 'get in touch',
      'hire', 'work with', 'collaborate', 'network', 'professional',
      'message', 'communication', 'reach', 'touch base', 'discuss',
      'opportunity', 'job', 'position', 'role', 'consulting', 'freelance'
    ];
    
    const lowerQuery = query.toLowerCase();
    return contactKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Separate validation for AI responses - more lenient than user input validation
  const validateAIResponse = (response) => {
    if (!response || typeof response !== 'string') {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Invalid response format.'
      };
    }

    const trimmedResponse = response.trim();
    
    // Check if response is too long (DoS prevention)
    if (trimmedResponse.length > 10000) {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Response too long.'
      };
    }

    // Check if response is too short or empty
    if (trimmedResponse.length < 1) {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Empty response.'
      };
    }

    // Only check for the most dangerous patterns in AI responses
    const dangerousPatterns = [
      // Script injection
      /<script[^>]*>/i,
      /<\/script>/i,
      /javascript\s*:/i,
      /data\s*:/i,
      /vbscript\s*:/i,
      // Event handlers
      /on\w+\s*=/i,
      // Dangerous protocols
      /file:\/\//i,
      /ftp:\/\//i,
      // Control characters
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/,
      // Obvious code injection
      /eval\s*\(/i,
      /exec\s*\(/i,
      /Function\s*\(/i
    ];

    // Check for dangerous patterns
    for (const pattern of dangerousPatterns) {
      if (pattern.test(trimmedResponse)) {
        console.warn('Dangerous pattern detected in AI response:', pattern.toString());
        return {
          isValid: false,
          sanitized: '',
          reason: 'Response contains dangerous content.'
        };
      }
    }

    // Light sanitization - only remove the most dangerous elements
    let sanitized = trimmedResponse
      // Remove script tags completely
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      // Remove dangerous protocols
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();

    return {
      isValid: true,
      sanitized: sanitized,
      reason: null
    };
  };

  // Comprehensive security validation against OWASP Top 10 attacks
  const validateAndSanitizeInput = (input) => {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Invalid input format.'
      };
    }

    const trimmedInput = input.trim();
    
    // A1: Injection - Check input length (DoS prevention)
    if (trimmedInput.length > 1000) {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Input too long. Please keep questions under 1000 characters.'
      };
    }

    // Check if input is too short or empty
    if (trimmedInput.length < 2) {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Please enter a valid question about Luke\'s career.'
      };
    }

    // A1: Injection - SQL Injection patterns (even though we don't use SQL directly)
    const sqlInjectionPatterns = [
      /'\s*(or|and)\s*'?\d+[=><]/i,
      /'\s*(or|and)\s*'?\w+[=><]/i,
      /union\s+(all\s+)?select/i,
      /drop\s+(table|database|schema)/i,
      /insert\s+into/i,
      /update\s+\w+\s+set/i,
      /delete\s+from/i,
      /exec(ute)?\s*\(/i,
      /sp_\w+/i,
      /xp_\w+/i,
      /information_schema/i,
      /sysobjects/i,
      /syscolumns/i,
      /msysaccessobjects/i,
      /pg_\w+/i,
      /mysql\./i,
      /waitfor\s+delay/i,
      /benchmark\s*\(/i,
      /sleep\s*\(/i,
      /load_file\s*\(/i,
      /into\s+outfile/i,
      /into\s+dumpfile/i
    ];

    // A1: Injection - Command Injection patterns
    const commandInjectionPatterns = [
      /[;&|`$(){}[\]]/,
      /\bcat\s+/i,
      /\bls\s+/i,
      /\bpwd\b/i,
      /\bwhoami\b/i,
      /\bid\b/i,
      /\buname\b/i,
      /\bps\s+/i,
      /\bnetstat\b/i,
      /\bifconfig\b/i,
      /\bcurl\s+/i,
      /\bwget\s+/i,
      /\bnc\s+/i,
      /\btelnet\s+/i,
      /\bssh\s+/i,
      /\bftp\s+/i,
      /\bscp\s+/i,
      /\brsync\s+/i,
      /\brm\s+/i,
      /\bmv\s+/i,
      /\bcp\s+/i,
      /\bchmod\s+/i,
      /\bchown\s+/i,
      /\bkill\s+/i,
      /\bkillall\s+/i,
      /\bsudo\s+/i,
      /\bsu\s+/i,
      /\breboot\b/i,
      /\bshutdown\b/i,
      /\bmount\s+/i,
      /\bumount\s+/i,
      /\bdd\s+if=/i,
      /\/etc\/passwd/i,
      /\/etc\/shadow/i,
      /\/proc\//i,
      /\/dev\//i
    ];

    // A1: Injection - NoSQL Injection patterns
    const nosqlInjectionPatterns = [
      /\$where/i,
      /\$regex/i,
      /\$ne/i,
      /\$gt/i,
      /\$lt/i,
      /\$gte/i,
      /\$lte/i,
      /\$in/i,
      /\$nin/i,
      /\$exists/i,
      /\$type/i,
      /\$size/i,
      /\$all/i,
      /\$elemMatch/i,
      /\$not/i,
      /\$nor/i,
      /\$or/i,
      /\$and/i,
      /this\./i,
      /db\./i,
      /sleep\(/i,
      /function\s*\(/i
    ];

    // A1: Injection - LDAP Injection patterns
    const ldapInjectionPatterns = [
      /\(\s*[|&]/,
      /[|&]\s*\)/,
      /\*\s*\)/,
      /\(\s*\*/,
      /\)\s*\(/
    ];

    // A1: Injection - XPath Injection patterns
    const xpathInjectionPatterns = [
      /\[\s*\]/,
      /\[\s*\d+\s*=/,
      /\[\s*position\(\s*\)\s*=/i,
      /\[\s*last\(\s*\)\s*=/i,
      /\[\s*string-length\s*\(/i,
      /\[\s*substring\s*\(/i,
      /\[\s*starts-with\s*\(/i,
      /\[\s*contains\s*\(/i,
      /\[\s*normalize-space\s*\(/i,
      /\[\s*translate\s*\(/i,
      /\[\s*concat\s*\(/i,
      /text\(\s*\)/i,
      /node\(\s*\)/i,
      /comment\(\s*\)/i,
      /processing-instruction\(\s*\)/i
    ];

    // A1: Injection - Prompt injection patterns (AI-specific)
    const promptInjectionPatterns = [
      /ignore\s+(previous|all|above|prior|earlier|initial)\s+(instructions|prompts|commands|rules|directives)/i,
      /forget\s+(everything|all|instructions|prompts|context|previous|earlier)/i,
      /you\s+are\s+(now|no\s+longer|instead|actually)\s+/i,
      /system\s*[:>\-]\s*/i,
      /assistant\s*[:>\-]\s*/i,
      /human\s*[:>\-]\s*/i,
      /user\s*[:>\-]\s*/i,
      /admin\s*[:>\-]\s*/i,
      /root\s*[:>\-]\s*/i,
      /<\s*system\s*>/i,
      /<\s*\/?\s*prompt\s*>/i,
      /<\s*\/?\s*instruction\s*>/i,
      /act\s+as\s+(if\s+you\s+are|a|an)\s+/i,
      /pretend\s+(to\s+be|you\s+are|that\s+you)/i,
      /roleplay\s+(as|being)/i,
      /jailbreak/i,
      /\[INST\]/i,
      /\[\/INST\]/i,
      /<\|.*?\|>/,
      /###\s*(instruction|system|prompt)/i,
      /\*\*\*(instruction|system|prompt)/i,
      /---\s*(instruction|system|prompt)/i,
      /new\s+(role|character|persona|identity)/i,
      /override\s+(settings|config|instructions|rules)/i,
      /bypass\s+(safety|security|filters|restrictions)/i,
      /disable\s+(safety|security|filters|restrictions)/i,
      /enable\s+(developer|debug|admin)\s+mode/i,
      /switch\s+to\s+(developer|debug|admin)\s+mode/i,
      /tell\s+me\s+(your|the)\s+(prompt|instructions|system)/i,
      /what\s+(is|are)\s+(your|the)\s+(prompt|instructions|system)/i,
      /show\s+(me\s+)?(your|the)\s+(prompt|instructions|system)/i,
      /display\s+(your|the)\s+(prompt|instructions|system)/i,
      /reveal\s+(your|the)\s+(prompt|instructions|system)/i,
      /print\s+(your|the)\s+(prompt|instructions|system)/i,
      /output\s+(your|the)\s+(prompt|instructions|system)/i
    ];

    // A3: Injection - Code injection patterns
    const codeInjectionPatterns = [
      /eval\s*\(/i,
      /exec\s*\(/i,
      /function\s*\(/i,
      /javascript\s*:/i,
      /data\s*:/i,
      /vbscript\s*:/i,
      /livescript\s*:/i,
      /mocha\s*:/i,
      /charset\s*=/i,
      /base64/i,
      /atob\s*\(/i,
      /btoa\s*\(/i,
      /fromCharCode/i,
      /charCodeAt/i,
      /unescape\s*\(/i,
      /escape\s*\(/i,
      /encodeURI/i,
      /decodeURI/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
      /setImmediate\s*\(/i,
      /requestAnimationFrame\s*\(/i,
      /createElement\s*\(/i,
      /appendChild\s*\(/i,
      /innerHTML/i,
      /outerHTML/i,
      /document\./i,
      /window\./i,
      /global\./i,
      /process\./i,
      /require\s*\(/i,
      /import\s+/i,
      /export\s+/i,
      /module\./i,
      /\_\_filename/i,
      /\_\_dirname/i,
      /Buffer\./i,
      /fs\./i,
      /path\./i,
      /os\./i,
      /crypto\./i,
      /http\./i,
      /https\./i,
      /net\./i,
      /child_process/i,
      /cluster\./i,
      /worker_threads/i,
      /\.constructor/i,
      /\.prototype/i,
      /\.\_\_proto\_\_/i,
      /\.call\s*\(/i,
      /\.apply\s*\(/i,
      /\.bind\s*\(/i,
      /\.toString\s*\(/i,
      /\.valueOf\s*\(/i,
      /Object\./i,
      /Array\./i,
      /String\./i,
      /Number\./i,
      /Boolean\./i,
      /Date\./i,
      /RegExp\./i,
      /Error\./i,
      /JSON\./i,
      /Math\./i,
      /Infinity/i,
      /NaN/i,
      /undefined/i,
      /null/i,
      /alert\s*\(/i,
      /confirm\s*\(/i,
      /prompt\s*\(/i,
      /console\./i,
      /debugger/i
    ];

    // A7: XSS - Cross-Site Scripting patterns
    const xssPatterns = [
      /<script[^>]*>/i,
      /<\/script>/i,
      /<iframe[^>]*>/i,
      /<\/iframe>/i,
      /<object[^>]*>/i,
      /<\/object>/i,
      /<embed[^>]*>/i,
      /<\/embed>/i,
      /<applet[^>]*>/i,
      /<\/applet>/i,
      /<meta[^>]*>/i,
      /<link[^>]*>/i,
      /<style[^>]*>/i,
      /<\/style>/i,
      /<form[^>]*>/i,
      /<\/form>/i,
      /<input[^>]*>/i,
      /<textarea[^>]*>/i,
      /<\/textarea>/i,
      /<button[^>]*>/i,
      /<\/button>/i,
      /<select[^>]*>/i,
      /<\/select>/i,
      /<option[^>]*>/i,
      /<\/option>/i,
      /<img[^>]*>/i,
      /<audio[^>]*>/i,
      /<\/audio>/i,
      /<video[^>]*>/i,
      /<\/video>/i,
      /<source[^>]*>/i,
      /<track[^>]*>/i,
      /<canvas[^>]*>/i,
      /<\/canvas>/i,
      /<svg[^>]*>/i,
      /<\/svg>/i,
      /<math[^>]*>/i,
      /<\/math>/i,
      /on\w+\s*=/i,
      /javascript\s*:/i,
      /data\s*:/i,
      /vbscript\s*:/i,
      /expression\s*\(/i,
      /behavior\s*:/i,
      /-moz-binding/i,
      /&#x/i,
      /&#\d/i,
      /&\w+;/i,
      /%3c/i,
      /%3e/i,
      /%22/i,
      /%27/i,
      /%3b/i,
      /%28/i,
      /%29/i,
      /\\x/i,
      /\\u/i,
      /\\\\/i,
      /\\/i
    ];

    // A8: Insecure Deserialization patterns
    const deserializationPatterns = [
      /\{.*"__proto__".*\}/i,
      /\{.*"constructor".*\}/i,
      /\{.*"prototype".*\}/i,
      /Object\.create/i,
      /Object\.defineProperty/i,
      /Object\.setPrototypeOf/i,
      /Object\.assign/i,
      /JSON\.parse/i,
      /JSON\.stringify/i,
      /eval\s*\(/i,
      /Function\s*\(/i,
      /new\s+Function/i,
      /setPrototypeOf/i,
      /\_\_defineGetter\_\_/i,
      /\_\_defineSetter\_\_/i,
      /\_\_lookupGetter\_\_/i,
      /\_\_lookupSetter\_\_/i
    ];

    // A10: Insufficient Logging patterns (potential info disclosure)
    const infoDisclosurePatterns = [
      /password/i,
      /passwd/i,
      /secret/i,
      /key/i,
      /token/i,
      /api[_\-]?key/i,
      /auth[_\-]?token/i,
      /session[_\-]?id/i,
      /cookie/i,
      /jwt/i,
      /bearer/i,
      /authorization/i,
      /credential/i,
      /private[_\-]?key/i,
      /public[_\-]?key/i,
      /certificate/i,
      /cert/i,
      /ssl/i,
      /tls/i,
      /hash/i,
      /salt/i,
      /nonce/i,
      /signature/i,
      /encrypt/i,
      /decrypt/i,
      /cipher/i,
      /admin/i,
      /root/i,
      /superuser/i,
      /system/i,
      /config/i,
      /settings/i,
      /environment/i,
      /env/i,
      /debug/i,
      /trace/i,
      /log/i,
      /error/i,
      /exception/i,
      /stack/i,
      /dump/i,
      /backup/i,
      /temp/i,
      /tmp/i,
      /cache/i,
      /internal/i,
      /localhost/i,
      /127\.0\.0\.1/i,
      /192\.168\./i,
      /10\.\d+\.\d+\.\d+/i,
      /172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/i
    ];

    // Additional security patterns
    const additionalSecurityPatterns = [
      // Path traversal
      /\.\.\//,
      /\.\.\\/,
      /\.\.%2f/i,
      /\.\.%5c/i,
      /\.\.%252f/i,
      /\.\.%255c/i,
      
      // Server-side template injection
      /\{\{.*\}\}/,
      /\{%.*%\}/,
      /\$\{.*\}/,
      /#\{.*\}/,
      /<%.*%>/,
      /\[\[.*\]\]/,
      
      // LDAP injection
      /\(\|\(/,
      /\)&\(/,
      /\*\)\(/,
      
      // XML injection
      /<!ENTITY/i,
      /<!DOCTYPE/i,
      /SYSTEM\s+["']/i,
      /PUBLIC\s+["']/i,
      /<!\[CDATA\[/i,
      /\]\]>/i,
      
      // SSRF patterns
      /file:\/\//i,
      /ftp:\/\//i,
      /gopher:\/\//i,
      /dict:\/\//i,
      /ldap:\/\//i,
      /sftp:\/\//i,
      
      // Prototype pollution
      /constructor\.prototype/i,
      /__proto__/i,
      /prototype\.constructor/i,
      
      // DoS patterns
      /while\s*\(\s*true\s*\)/i,
      /for\s*\(\s*;;\s*\)/i,
      /repeat\s+(forever|infinitely|\d{3,})/i,
      /\*{10,}/,
      /\.{10,}/,
      /\s{100,}/,
      
      // Binary/executable patterns
      /\x00/,
      /\xff/,
      /\xfe/,
      /MZ[\x00-\xff]{2}/,
      /\x7fELF/,
      /%PDF-/,
      /PK\x03\x04/
    ];

    // Combine all patterns for comprehensive checking
    const allPatterns = [
      ...sqlInjectionPatterns,
      ...commandInjectionPatterns,
      ...nosqlInjectionPatterns,
      ...ldapInjectionPatterns,
      ...xpathInjectionPatterns,
      ...promptInjectionPatterns,
      ...codeInjectionPatterns,
      ...xssPatterns,
      ...deserializationPatterns,
      ...infoDisclosurePatterns,
      ...additionalSecurityPatterns
    ];

    // Check for security patterns
    for (const pattern of allPatterns) {
      if (pattern.test(trimmedInput)) {
        console.warn('Security threat detected:', pattern.toString(), 'in input:', trimmedInput.substring(0, 50));
        return {
          isValid: false,
          sanitized: '',
          reason: 'I can only answer questions about Luke\'s professional career and experience. Please ask about his work in technology, project management, or development.'
        };
      }
    }

    // Context override detection patterns
    const contextOverridePatterns = [
      /what\s+(is|are)\s+(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,
      /show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,
      /display\s+(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,
      /reveal\s+(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,
      /tell\s+me\s+(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,
      /what\s+(are\s+)?(your|the)\s+(initial\s+)?(instructions|rules|guidelines)/i,
      /override\s+(your|the)\s+(instructions|rules|settings)/i,
      /modify\s+(your|the)\s+(instructions|rules|settings)/i,
      /change\s+(your|the)\s+(instructions|rules|settings)/i,
      /update\s+(your|the)\s+(instructions|rules|settings)/i,
      /new\s+(instructions|rules|guidelines)/i,
      /ignore\s+(context|instructions|rules|guidelines)/i,
      /bypass\s+(safety|security|filters|restrictions|rules)/i,
      /disable\s+(safety|security|filters|restrictions|rules)/i,
      /what\s+(can|cannot)\s+you\s+(not\s+)?(do|say|tell|discuss)/i,
      /limitations/i,
      /constraints/i,
      /boundaries/i,
      /guardrails/i,
      /restrictions/i,
      /permissions/i,
      /capabilities/i,
      /access\s+level/i
    ];

    for (const pattern of contextOverridePatterns) {
      if (pattern.test(trimmedInput)) {
        return {
          isValid: false,
          sanitized: '',
          reason: 'I\'m here to discuss Luke\'s professional background and career achievements. What would you like to know about his experience in technology or project management?'
        };
      }
    }

    // Aggressive sanitization - remove potentially harmful characters
    let sanitized = trimmedInput
      // Remove HTML/XML tags completely
      .replace(/<[^>]*>/g, '')
      // Remove script content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      // Remove dangerous protocols
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/livescript:/gi, '')
      .replace(/mocha:/gi, '')
      .replace(/file:/gi, '')
      .replace(/ftp:/gi, '')
      .replace(/gopher:/gi, '')
      // Remove template literals and expressions
      .replace(/\$\{[^}]*\}/g, '')
      .replace(/\{\{[^}]*\}\}/g, '')
      .replace(/\{%[^%]*%\}/g, '')
      .replace(/#\{[^}]*\}/g, '')
      .replace(/<%[^%]*%>/g, '')
      .replace(/\[\[[^\]]*\]\]/g, '')
      // Remove backticks and content
      .replace(/`[^`]*`/g, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove dangerous characters and symbols
      .replace(/[<>{}[\]\\]/g, '')
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Control characters
      .replace(/[&|;$`'"]/g, '') // Shell metacharacters
      // Remove encoded characters that could be used for bypass
      .replace(/%[0-9a-f]{2}/gi, '')
      .replace(/&#x[0-9a-f]+;/gi, '')
      .replace(/&#\d+;/gi, '')
      .replace(/&\w+;/gi, '')
      // Remove escape sequences
      .replace(/\\x[0-9a-f]{2}/gi, '')
      .replace(/\\u[0-9a-f]{4}/gi, '')
      .replace(/\\\\/g, '')
      .trim();

    // Final length check after sanitization
    if (sanitized.length < 2) {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Please enter a valid question about Luke\'s professional career.'
      };
    }

    // Additional character validation - only allow safe characters
    const allowedCharactersRegex = /^[a-zA-Z0-9\s.,!?'"()\-+*/=@#%^&_:;~`\u00C0-\u017F\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;
    if (!allowedCharactersRegex.test(sanitized)) {
      return {
        isValid: false,
        sanitized: '',
        reason: 'Please use only standard characters in your question.'
      };
    }

    return {
      isValid: true,
      sanitized: sanitized,
      reason: null
    };
  };

  // Animated typing effect for AI responses
  const typeWriterEffect = (text, callback) => {
    setCurrentAIResponse('');
    setIsTyping(true);
    setSpeechStarted(false);
    let index = 0;
    let typingTimer = null;
    
    // Function to start the typing animation
    const startTyping = () => {
      setSpeechStarted(true);
      typingTimer = setInterval(() => {
        if (index <= text.length) {
          setCurrentAIResponse(text.substring(0, index));
          index++;
        } else {
          clearInterval(typingTimer);
          setIsTyping(false);
          // Auto-clear the response after 6 seconds to match speech length
          setTimeout(() => {
            setCurrentAIResponse('');
            setSpeechStarted(false);
            // Stop audio monitoring when speech ends
            if (audioAnalyzerSupported) {
              stopMonitoring();
            }
            if (callback) callback();
          }, 6000);
        }
      }, 35); // Slightly faster typing
    };
    
    // Start speaking and sync text with speech
    if (settings.voiceEnabled && audioEnabled) {
      // Start audio monitoring for waveform sync
      if (audioAnalyzerSupported) {
        startMonitoring();
      }
      
      // Preprocess text for better speech synthesis
      const speechText = preprocessTextForSpeech(text);
      
      if (settings.speechProvider === 'openai' || settings.speechProvider === 'google') {
        // Use streaming speech for faster response
        const selectedVoice = settings.speechProvider === 'openai' 
          ? (settings.openaiVoice || 'onyx')
          : (settings.googleVoice || 'en-US-Neural2-D');
          
        streamSpeak(speechText, {
          provider: settings.speechProvider,
          voice: selectedVoice,
          chunkSize: 150 // Smaller chunks for faster start
        });
        
        // Delay text typing to sync with speech start
        // Give a small delay for speech synthesis to begin
        setTimeout(() => {
          startTyping();
        }, 300); // 300ms delay to sync with speech buffering
        
      } else if (speechSynthesisSupported) {
        // Use browser speech
        const selectedVoice = settings.selectedVoice 
          ? availableVoices.find(v => v.name === settings.selectedVoice)
          : null;
        speak(speechText, settings.speechRate, selectedVoice);
        
        // Delay text typing to sync with browser speech start
        setTimeout(() => {
          startTyping();
        }, 150); // Shorter delay for browser speech
      }
    } else {
      // No voice enabled, start typing immediately
      startTyping();
    }
  };

  useEffect(() => {
    if (transcript) {
      // Validate voice input for security before setting
      const validation = validateAndSanitizeInput(transcript);
      if (validation.isValid) {
        setUserInput(validation.sanitized);
      } else {
        // Show error for invalid voice input
        setError(new Error(validation.reason));
        setUserInput('');
      }
      // Refocus input after voice input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [transcript]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting - prevent abuse (max 5 requests per minute with minimum 3 second delay)
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const minDelay = 3 * 1000; // 3 seconds minimum between requests
    
    // Check minimum delay between requests
    if (now - lastRequestTime < minDelay) {
      setError(new Error('Please wait a moment before asking another question.'));
      return;
    }
    
    // Reset count if more than a minute has passed
    if (now - lastRequestTime > oneMinute) {
      setRequestCount(0);
      setIsRateLimited(false);
    }
    
    // Check rate limit (reduced from 10 to 5 requests per minute)
    if (requestCount >= 5) {
      setIsRateLimited(true);
      setError(new Error('Rate limit exceeded. Please wait a moment before asking another question.'));
      return;
    }
    
    // Increment request count
    setRequestCount(prev => prev + 1);
    setLastRequestTime(now);
    
    // Enable audio on first interaction
    await enableAudio();
    
    if (!userInput.trim() || isThinking || isRateLimited) return;

    // Validate and sanitize input for security
    const validation = validateAndSanitizeInput(userInput);
    if (!validation.isValid) {
      setError(new Error(validation.reason));
      setUserInput('');
      return;
    }

    const sanitizedInput = validation.sanitized;

    const newUserMessage = { 
      sender: 'user', 
      text: sanitizedInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Check if this is a book-related query
    if (detectBookQuery(sanitizedInput)) {
      setShowBookButtons(true);
      // Store in secure localStorage to persist until browser is closed
      secureLocalStorage.setItem('showBookButtons', 'true');
    }
    
    // Check if this is a contact-related query
    if (detectContactQuery(sanitizedInput)) {
      setShowContactButtons(true);
      // Store in secure localStorage to persist until browser is closed
      secureLocalStorage.setItem('showContactButtons', 'true');
    }
    
    setUserInput('');
    setIsThinking(true);
    setError(null);

    try {
      // Use unified LLM endpoint
      const apiEndpoint = '/api/llm';
      
      // Generate a simple CSRF token for this session
      const csrfToken = sessionStorage.getItem('csrfToken') || 
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('csrfToken', csrfToken);
      
      // Prepare conversation history for context (last 3 exchanges to limit token usage)
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
          'X-CSRF-Token': csrfToken,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({ 
          question: sanitizedInput,
          conversationHistory: conversationHistory,
          provider: settings.aiProvider, // 'openai', 'gemini', 'github', or 'auto'
          timestamp: now,
          csrfToken: csrfToken
        }),
        credentials: 'same-origin',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'error'
      });

      // Security: Check response headers and content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response content type');
      }

      if (!response.ok) {
        // Handle rate limit errors specifically
        if (response.status === 429) {
          const errorData = await response.text();
          let retryAfter = 60; // Default to 60 seconds
          
          try {
            const parsedError = JSON.parse(errorData);
            retryAfter = parsedError.retryAfter || 60;
          } catch (e) {
            // Fallback if parsing fails
          }
          
          throw new Error(`API rate limit exceeded. Please wait ${retryAfter} seconds and try again.`);
        }
        
        // Limit error message length to prevent information disclosure
        const errorText = await response.text();
        const safeErrorText = errorText.substring(0, 100);
        throw new Error(`Request failed: ${response.status}`);
      }

      const rawData = await response.text();
      
      // Validate response size to prevent DoS
      if (rawData.length > 50000) {
        throw new Error('Response too large');
      }
      
      let data;
      try {
        data = JSON.parse(rawData);
      } catch (parseError) {
        throw new Error('Invalid JSON response');
      }
      
      // Validate response structure
      if (!data || typeof data !== 'object' || typeof data.answer !== 'string') {
        throw new Error('Invalid response format');
      }
      
      // Validate the AI response with more lenient validation
      const responseValidation = validateAIResponse(data.answer);
      if (!responseValidation.isValid) {
        console.warn('AI response validation failed:', responseValidation.reason);
        throw new Error('Invalid response content');
      }
      
      // Use the sanitized response
      const sanitizedResponse = responseValidation.sanitized;
      
      // Check if this is a rate-limited fallback response
      const isRateLimitedResponse = data.isRateLimitedResponse;
      const retryAfter = data.retryAfter;
      
      // Add a subtle indicator for fallback responses
      let displayResponse = sanitizedResponse;
      if (isRateLimitedResponse) {
        displayResponse += `\n\n💡 *I'm experiencing high demand - this is a quick response while I catch up. Feel free to ask follow-up questions!*`;
      }
      
      // Use typewriter effect for AI response with sanitized content
      typeWriterEffect(displayResponse, () => {
        // Store the AI response in messages for conversation context
        const aiMessage = {
          sender: 'ai',
          text: displayResponse,
          timestamp: new Date(),
          isRateLimitedResponse: isRateLimitedResponse
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // If this was a rate-limited response, show a subtle notification
        if (isRateLimitedResponse && retryAfter) {
          console.log(`Rate limit fallback used. Full AI available in ${retryAfter} seconds.`);
        }
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      // Security: Sanitize error messages to prevent information disclosure
      let safeErrorMessage = 'Sorry, I encountered a technical issue. Please try again.';
      
      // Only show specific safe error messages
      if (error.message === 'Rate limit exceeded. Please wait a moment before asking another question.') {
        safeErrorMessage = error.message;
      } else if (error.message.includes('API rate limit exceeded')) {
        safeErrorMessage = error.message; // This is already safe - we constructed it
      } else if (error.message === 'Invalid response content' || 
                 error.message === 'Invalid response format' ||
                 error.message === 'Response too large' ||
                 error.message === 'Invalid JSON response') {
        safeErrorMessage = 'Sorry, I received an invalid response. Please try again.';
      } else if (error.message.startsWith('Request failed:')) {
        safeErrorMessage = 'Sorry, the request failed. Please try again later.';
      }
      
      setError(new Error(safeErrorMessage));
      
      const errorMessage = { 
        sender: 'ai', 
        text: safeErrorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
      // Refocus the input field after submission with a small delay to ensure state updates
      setTimeout(() => {
        if (inputRef.current && !isSettingsOpen) {
          inputRef.current.focus();
        }
      }, 200);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (messages.length > 1) {
      const lastUserMessage = messages.findLast(msg => msg.sender === 'user');
      if (lastUserMessage) {
        setUserInput(lastUserMessage.text);
      }
    }
    // Refocus the input field after retry
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentAIResponse('');
    setError(null);
    sessionStorage.removeItem('conversationHistory');
    console.log('Conversation history cleared');
    // Refocus the input field after clearing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    if (isAISpeaking) {
      stopAISpeaking();
    }
    if (isStreamSpeaking) {
      stopStreamSpeaking();
    }
    
    // Stop audio monitoring when voice is turned off
    if (audioAnalyzerSupported && settings.voiceEnabled) {
      stopMonitoring();
    }
    
    setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const handleVoiceInput = () => {
    // Enable audio on voice input
    enableAudio();
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Combined handler for main area clicks
  const handleMainClick = async () => {
    await enableAudio();
    // Refocus input when clicking in main area (unless clicking on interactive elements)
    setTimeout(() => {
      if (inputRef.current && !isSettingsOpen) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Focus input when settings panel closes
  useEffect(() => {
    if (!isSettingsOpen && inputRef.current) {
      // Small delay to ensure settings panel animation completes
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  }, [isSettingsOpen]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + S to open/close settings
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
      
      // Alt + M to toggle microphone (if supported)
      if (e.altKey && e.key.toLowerCase() === 'm' && speechRecognitionSupported) {
        e.preventDefault();
        handleVoiceInput();
      }
      
      // Escape key to close modals/panels
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
        if (showBookButtons) {
          setShowBookButtons(false);
          secureLocalStorage.removeItem('showBookButtons');
        }
        if (showContactButtons) {
          setShowContactButtons(false);
          secureLocalStorage.removeItem('showContactButtons');
        }
        if (isListening) {
          stopListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, showBookButtons, showContactButtons, isListening, speechRecognitionSupported]);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Save to secure localStorage with validation
    try {
      const settingsJson = JSON.stringify(newSettings);
      secureLocalStorage.setItem('aiSettings', settingsJson);
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  };

  // Load settings from secure localStorage on mount
  useEffect(() => {
    const savedSettings = secureLocalStorage.getItem('aiSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Validate settings structure before applying
        if (parsedSettings && typeof parsedSettings === 'object') {
          // Only allow known settings properties
          const validSettings = {
            aiProvider: typeof parsedSettings.aiProvider === 'string' ? parsedSettings.aiProvider : 'gemini',
            voiceEnabled: typeof parsedSettings.voiceEnabled === 'boolean' ? parsedSettings.voiceEnabled : true,
            animationsEnabled: typeof parsedSettings.animationsEnabled === 'boolean' ? parsedSettings.animationsEnabled : true,
            speechRate: typeof parsedSettings.speechRate === 'number' && parsedSettings.speechRate >= 0.1 && parsedSettings.speechRate <= 2 ? parsedSettings.speechRate : 0.9,
            selectedVoice: typeof parsedSettings.selectedVoice === 'string' ? parsedSettings.selectedVoice : null,
            speechProvider: typeof parsedSettings.speechProvider === 'string' ? parsedSettings.speechProvider : 'openai',
            openaiVoice: typeof parsedSettings.openaiVoice === 'string' ? parsedSettings.openaiVoice : 'onyx',
            googleVoice: typeof parsedSettings.googleVoice === 'string' ? parsedSettings.googleVoice : 'en-US-Neural2-D'
          };
          setSettings(validSettings);
        }
      } catch (e) {
        console.warn('Failed to load settings, using defaults:', e);
        secureLocalStorage.removeItem('aiSettings'); // Remove corrupted settings
      }
    }
    
    // Load conversation history from sessionStorage (persists during browser session)
    const savedConversation = sessionStorage.getItem('conversationHistory');
    if (savedConversation) {
      try {
        const parsedConversation = JSON.parse(savedConversation);
        if (Array.isArray(parsedConversation) && parsedConversation.length > 0) {
          // Validate each message structure
          const validMessages = parsedConversation.filter(msg => 
            msg && 
            typeof msg === 'object' && 
            typeof msg.text === 'string' && 
            msg.text.length < 10000 && 
            (msg.sender === 'user' || msg.sender === 'ai') &&
            msg.timestamp
          );
          if (validMessages.length > 0) {
            setMessages(validMessages);
            console.log(`Restored ${validMessages.length} messages from session`);
          }
        }
      } catch (e) {
        console.warn('Failed to load conversation history:', e);
        sessionStorage.removeItem('conversationHistory');
      }
    }
    
    // Load book buttons state from secure localStorage
    const savedBookButtonsState = secureLocalStorage.getItem('showBookButtons');
    if (savedBookButtonsState === 'true') {
      setShowBookButtons(true);
    }
    
    // Load contact buttons state from secure localStorage
    const savedContactButtonsState = secureLocalStorage.getItem('showContactButtons');
    if (savedContactButtonsState === 'true') {
      setShowContactButtons(true);
    }
  }, []);

  // Save conversation history to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Only save last 50 messages to prevent storage overflow
        const messagesToSave = messages.slice(-50);
        sessionStorage.setItem('conversationHistory', JSON.stringify(messagesToSave));
      } catch (e) {
        console.warn('Failed to save conversation history:', e);
      }
    }
  }, [messages]);

  // Play random greeting on first visit
  useEffect(() => {
    if (isClient && !hasPlayedGreeting && settings.voiceEnabled && streamSpeak && audioEnabled) {
      // Small delay to ensure everything is loaded
      const greetingTimer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomGreetings.length);
        const selectedGreeting = randomGreetings[randomIndex];
        
        console.log('Playing random greeting:', selectedGreeting.substring(0, 50) + '...');
        
        // Play the greeting using typewriter effect with speech sync
        typeWriterEffect(selectedGreeting);
        setHasPlayedGreeting(true);
        
        // Store that we've played the greeting for this session
        sessionStorage.setItem('hasPlayedGreeting', 'true');
      }, 2000); // 2 second delay for dramatic effect

      return () => clearTimeout(greetingTimer);
    }
  }, [isClient, hasPlayedGreeting, settings.voiceEnabled, streamSpeak, randomGreetings, audioEnabled]);

  // Check if greeting was already played in this session
  useEffect(() => {
    if (isClient) {
      // For testing purposes, let's always allow the greeting to play
      // const greetingPlayed = sessionStorage.getItem('hasPlayedGreeting');
      // if (greetingPlayed) {
      //   setHasPlayedGreeting(true);
      // }
      
      // Focus the input field when component mounts
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500); // Small delay to ensure DOM is ready
    }
  }, [isClient]);

  return (
    <div 
      className="relative w-screen h-screen bg-black text-white overflow-hidden"
      onClick={handleMainClick}
      role="main"
      aria-label="Luke Percy's AI-powered professional website"
    >
      {/* Background Animation Layer */}
      {settings.animationsEnabled && (
        <div className="absolute inset-0 w-full h-full">
          <AnimatedBackground 
            isThinking={isThinking} 
            isSpeaking={isSpeaking || isAISpeaking || isStreamSpeaking}
            audioData={audioData}
          />
        </div>
      )}
      
      {/* UI Overlay Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Audio Enable Prompt */}
        {!audioEnabled && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto z-50"
              role="alert"
              aria-live="polite"
            >
              <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4 text-center max-w-sm">
                <p className="text-cyan-400 text-sm mb-2" aria-label="Audio experience available">🔊 Audio Experience Available</p>
                <p className="text-gray-300 text-xs">Click anywhere or ask a question to enable speech</p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Settings Button - Independent positioning */}
        <AnimatePresence>
          {!isSettingsOpen && (
            <motion.button
              onClick={() => setIsSettingsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-4 right-4 p-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full text-gray-300 hover:text-white transition-colors pointer-events-auto z-40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Open settings panel"
              aria-expanded={isSettingsOpen}
              aria-controls="settings-panel"
            >
              <Settings size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          availableVoices={availableVoices}
          currentVoice={settings.selectedVoice 
            ? availableVoices.find(v => v.name === settings.selectedVoice) 
            : getBestVoice && getBestVoice()}
        />

        {/* Digital AI Response Text - To the Right of Sphere */}
        {(isTyping || currentAIResponse) && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute"
              style={{
                left: '60vw',
                top: '35vh',
                transform: 'translate(0, -50%)',
                maxWidth: '35vw'
              }}
              role="region"
              aria-live="polite"
              aria-label="AI response"
            >
              {/* Speech preparation indicator */}
              {isTyping && !speechStarted && settings.voiceEnabled && audioEnabled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 flex items-center space-x-2"
                  aria-label="Preparing speech synthesis"
                  role="status"
                >
                  <div className="flex space-x-1">
                    <motion.div 
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-cyan-400 text-sm font-mono">Preparing speech...</span>
                </motion.div>
              )}

              {/* Split response into lines and display them sequentially */}
              {currentAIResponse.split('\n').map((line, lineIndex) => {
                if (!line.trim()) return null;
                
                return (
                  <motion.div
                    key={lineIndex}
                    className="mb-2"
                    initial={{ 
                      opacity: 0,
                      x: -20,
                      filter: 'blur(4px)'
                    }}
                    animate={{ 
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)'
                    }}
                    transition={{ 
                      duration: 0.6,
                      delay: lineIndex * 0.3,
                      ease: "easeOut"
                    }}
                  >
                    {/* Digital tech styling for each line */}
                    <div 
                      className="text-white text-sm md:text-base font-mono leading-relaxed"
                      style={{ 
                        textShadow: `
                          0 0 10px rgba(0, 255, 255, 0.8),
                          0 0 20px rgba(0, 255, 255, 0.4),
                          0 0 30px rgba(0, 255, 255, 0.2)
                        `,
                        filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.6))',
                        borderLeft: '2px solid rgba(0, 255, 255, 0.5)',
                        paddingLeft: '12px',
                        background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.1) 0%, transparent 50%)'
                      }}
                    >
                      {line}
                    </div>
                    
                    {/* Digital scan line effect */}
                    <motion.div
                      className="h-px bg-gradient-to-r from-cyan-400 via-cyan-200 to-transparent"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        delay: lineIndex * 0.3 + 0.2,
                        ease: "easeInOut"
                      }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.div>
                );
              })}
              
              {/* Digital cursor effect */}
              {isTyping && (
                <motion.div
                  className="inline-block w-2 h-4 bg-cyan-400 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Simple Text Input - Centered Over Canvas */}
        <div 
          className="pointer-events-auto"
          style={{
            position: 'absolute',
            top: '50vh',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
            zIndex: 100
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pointer-events-auto"
          >
            {/* Simple Input Bar */}
            <div className="w-96 rounded-2xl p-4 shadow-2xl" style={{ backgroundColor: 'transparent' }}>
              <form onSubmit={handleSubmit} className="flex items-center space-x-3" role="search" aria-label="Ask AI assistant">
                {/* Voice Input Button */}
                {speechRecognitionSupported && (
                  <motion.button
                    type="button"
                    onClick={handleVoiceInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleVoiceInput();
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 ${
                      isListening 
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    disabled={isThinking}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    aria-pressed={isListening}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </motion.button>
                )}
                
                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                  onBlur={(e) => {
                    // Prevent loss of focus unless clicking on interactive elements
                    const relatedTarget = e.relatedTarget;
                    if (!relatedTarget || (!relatedTarget.closest('button') && !relatedTarget.closest('[role="dialog"]'))) {
                      setTimeout(() => {
                        if (inputRef.current && !isSettingsOpen) {
                          inputRef.current.focus();
                        }
                      }, 100);
                    }
                  }}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  className="flex-1 p-3 bg-transparent border-none text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 rounded-lg drop-shadow-lg"
                  style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
                  disabled={isThinking || isListening}
                  aria-label="Question input"
                  aria-describedby="input-help"
                />
                
                {/* Send Button */}
                <motion.button
                  type="submit"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isThinking && userInput.trim()) {
                        handleSubmit(e);
                      }
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                  disabled={isThinking || !userInput.trim()}
                  aria-label="Send question to AI assistant"
                >
                  <Send size={18} />
                </motion.button>
              </form>
              
              {/* Hidden help text for screen readers */}
              <div id="input-help" className="sr-only">
                Type your question about Luke Percy's professional career or use the microphone button for voice input. Press Enter or click Send to submit.
              </div>
            </div>
            
            {/* Status Indicators - Below Input Container */}
            <div 
              className="flex justify-center mt-4 space-x-4 text-xs text-gray-300 drop-shadow min-h-[20px]"
              role="status" 
              aria-live="polite"
              aria-label="System status"
            >
              {isListening && (
                <span className="flex items-center space-x-1" aria-label="Voice input active">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true" />
                  <span>Listening...</span>
                </span>
              )}
              {(isSpeaking || isAISpeaking || isStreamSpeaking) && (
                <span className="flex items-center space-x-1" aria-label="AI speaking">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                  <span>Speaking...</span>
                </span>
              )}
              {isTyping && !speechStarted && settings.voiceEnabled && audioEnabled && (
                <span className="flex items-center space-x-1" aria-label="Preparing speech synthesis">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true" />
                  <span>Preparing speech...</span>
                </span>
              )}
              {(isThinking || isAISpeechLoading || isStreamLoading) && (
                <span className="flex items-center space-x-1" aria-label={isStreamLoading ? 'Preparing speech' : isAISpeechLoading ? 'Generating speech' : 'AI thinking'}>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" aria-hidden="true" />
                  <span>{isStreamLoading ? 'Preparing speech...' : isAISpeechLoading ? 'Generating speech...' : 'Thinking...'}</span>
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Book Purchase Interface - Right Side */}
        <AnimatePresence>
          {showBookButtons && !isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute pointer-events-auto z-50"
              style={{ 
                right: '5vw', 
                top: '60vh', 
                transform: 'translateY(-50%)' 
              }}
              role="complementary"
              aria-label="Book purchase options"
            >
              <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-xs relative">
                {/* Close Button */}
                <motion.button
                  onClick={() => {
                    setShowBookButtons(false);
                    secureLocalStorage.removeItem('showBookButtons');
                  }}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 rounded"
                  aria-label="Close book purchase options"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
                
                <motion.div
                  className="flex items-center justify-center gap-2 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className='p-3'>
                    <h3 className="text-cyan-400 text-lg font-bold">Available Now</h3>
                    <p className="text-gray-300 text-xs">"The Dark That Dwells Beneath Te Aro"</p>
                  </div>
                </motion.div>
                
                <div className="space-y-3 mb-4" role="list" aria-label="Purchase options">
                  {/* Amazon Link */}
                  <motion.a
                    href="https://www.amazon.com/Dark-that-Dwells-Beneath-Aro/dp/B09JVFJKFX/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Buy book on Amazon - opens in new window"
                    role="listitem"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-cyan-400 font-semibold text-sm group-hover:text-cyan-300">Buy on Amazon</div>
                        <div className="text-gray-400 text-xs">Kindle & Paperback available</div>
                      </div>
                      <div className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors" aria-hidden="true">→</div>
                    </div>
                  </motion.a>

                  {/* Mighty Ape Link */}
                  <motion.a
                    href="https://www.mightyape.co.nz/mn/buy/mighty-ape-the-dark-that-dwells-beneath-te-aro-36686686/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Buy book from Mighty Ape New Zealand store - opens in new window"
                    role="listitem"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-cyan-400 font-semibold text-sm group-hover:text-cyan-300">Buy from Mighty Ape</div>
                        <div className="text-gray-400 text-xs">New Zealand online store</div>
                      </div>
                      <div className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors" aria-hidden="true">→</div>
                    </div>
                  </motion.a>

                  {/* Spotify Audiobook Link */}
                  <motion.a
                    href="https://open.spotify.com/search/the%20dark%20that%20dwells%20beneath%20te%20aro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Listen to audiobook on Spotify - opens in new window"
                    role="listitem"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-cyan-400 font-semibold text-sm group-hover:text-cyan-300">Listen on Spotify</div>
                        <div className="text-gray-400 text-xs">Audiobook version</div>
                      </div>
                      <div className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors" aria-hidden="true">→</div>
                    </div>
                  </motion.a>
                </div>

                <motion.p
                  className="text-gray-400 text-xs text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  aria-label="Book rating: 4 and a half out of 5 stars on Amazon"
                >
                  <span aria-hidden="true">⭐</span> 4 and a half out of 5 stars on Amazon
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Interface - Left Side */}
        <AnimatePresence>
          {showContactButtons && !isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute pointer-events-auto z-50"
              style={{ 
                left: '5vw', 
                top: '50vh', 
                transform: 'translateY(-50%)' 
              }}
              role="complementary"
              aria-label="Contact options"
            >
              <div className="bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 max-w-xs relative">
                {/* Close Button */}
                <motion.button
                  onClick={() => {
                    setShowContactButtons(false);
                    secureLocalStorage.removeItem('showContactButtons');
                  }}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 rounded"
                  aria-label="Close contact options"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
                
                <motion.div
                  className="flex items-center justify-center gap-2 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className='p-3'>
                    <h3 className="text-purple-400 text-lg font-bold">Let's Connect</h3>
                    <p className="text-gray-300 text-xs">Professional opportunities & collaboration</p>
                  </div>
                </motion.div>
                
                <div className="space-y-3 mb-4" role="list" aria-label="Contact options">
                  {/* LinkedIn Link */}
                  <motion.a
                    href="https://www.linkedin.com/in/lukepercy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Connect on LinkedIn - opens in new window"
                    role="listitem"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-purple-400 font-semibold text-sm group-hover:text-purple-300">Connect on LinkedIn</div>
                        <div className="text-gray-400 text-xs">Professional networking</div>
                      </div>
                      <div className="text-purple-400/60 group-hover:text-purple-400 transition-colors" aria-hidden="true">→</div>
                    </div>
                  </motion.a>

                  {/* GitHub Link */}
                  <motion.a
                    href="https://github.com/LukePercy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="View GitHub profile - opens in new window"
                    role="listitem"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-purple-400 font-semibold text-sm group-hover:text-purple-300">View GitHub</div>
                        <div className="text-gray-400 text-xs">Open source projects & code</div>
                      </div>
                      <div className="text-purple-400/60 group-hover:text-purple-400 transition-colors" aria-hidden="true">→</div>
                    </div>
                  </motion.a>

                  {/* Email Link */}
                  <motion.a
                    href="mailto:lpercy@ljpercy.com?subject=Professional Inquiry&body=Hi Luke,%0D%0A%0D%0AI found your AI-powered website and would like to discuss..."
                    className="block p-3 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Send email to lpercy@ljpercy.com"
                    role="listitem"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-purple-400 font-semibold text-sm group-hover:text-purple-300">Send Email</div>
                        <div className="text-gray-400 text-xs">lpercy@ljpercy.com</div>
                      </div>
                      <div className="text-purple-400/60 group-hover:text-purple-400 transition-colors" aria-hidden="true">→</div>
                    </div>
                  </motion.a>
                </div>

                <motion.p
                  className="text-gray-400 text-xs text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  aria-label="Available for consulting and collaboration opportunities"
                >
                  <span aria-hidden="true">💼</span> Available for consulting & collaboration
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <div className="absolute top-4 left-4 right-4 max-w-4xl mx-auto pointer-events-auto">
            <ErrorBoundary error={error} onRetry={handleRetry} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturisticInterface;