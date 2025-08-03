import { useState, useEffect, useRef } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  };
};

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices when they become available
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const getBestVoice = () => {
    if (availableVoices.length === 0) return null;

    // Priority order for natural-sounding voices
    const voicePreferences = [
      // Google voices (usually highest quality)
      (voice) => voice.name.includes('Google') && voice.lang.startsWith('en'),
      // Microsoft voices (good quality on Windows)
      (voice) => voice.name.includes('Microsoft') && voice.lang.startsWith('en'),
      // Apple voices (good on macOS/iOS)
      (voice) => voice.name.includes('Alex') || voice.name.includes('Samantha'),
      // Premium/Natural voices
      (voice) => voice.name.toLowerCase().includes('premium') || voice.name.toLowerCase().includes('natural'),
      // Enhanced voices
      (voice) => voice.name.toLowerCase().includes('enhanced') || voice.name.toLowerCase().includes('neural'),
      // Female voices tend to sound more pleasant for AI assistants
      (voice) => voice.name.toLowerCase().includes('female') || 
                 voice.name.includes('Zira') || 
                 voice.name.includes('Hazel') ||
                 voice.name.includes('Karen'),
      // Any English voice
      (voice) => voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB'),
      // Fallback to any English variant
      (voice) => voice.lang.startsWith('en')
    ];

    for (const preference of voicePreferences) {
      const voice = availableVoices.find(preference);
      if (voice) return voice;
    }

    return availableVoices[0]; // Fallback to first available voice
  };

  const speak = (text, rate = 0.9, selectedVoice = null) => {
    if (isSupported && text) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice settings for more natural sound
      utterance.rate = Math.max(0.7, Math.min(1.2, rate)); // Clamp rate between 0.7-1.2
      utterance.pitch = 1.0; // Neutral pitch sounds more natural
      utterance.volume = 0.9; // Slightly higher volume for clarity

      // Use selected voice or find the best available voice
      const voice = selectedVoice || getBestVoice();
      if (voice) {
        utterance.voice = voice;
        console.log(`Using voice: ${voice.name} (${voice.lang})`);
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    availableVoices,
    getBestVoice,
  };
};
