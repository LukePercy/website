import { useState, useRef, useCallback } from 'react';

export const useAISpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const speak = useCallback(async (text, options = {}) => {
    if (!text || isSpeaking) return;

    const {
      provider = 'openai', // 'openai' or 'google'
      voice = 'onyx',     // OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
      fallbackToExisting = true
    } = options;

    setIsLoading(true);

    try {
      const response = await fetch('/api/speech/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          provider
        }),
      });

      const data = await response.json();

      // Log fallback information if available
      if (data.fallbackUsed) {
        console.log(`AI Speech: ${data.message}`);
      }

      if (data.fallback && fallbackToExisting) {
        // Fall back to browser speech synthesis
        console.log('Falling back to browser speech synthesis');
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => {
            setIsSpeaking(false);
            setIsLoading(false);
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            setIsLoading(false);
          };
          
          window.speechSynthesis.speak(utterance);
          return;
        }
      } else if (data.audioData) {
        // Play AI-generated audio immediately
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
          { type: data.mimeType }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioUrl);
        
        // Start playing immediately when audio is ready
        audioRef.current.oncanplaythrough = () => {
          setIsSpeaking(true);
          audioRef.current.play();
        };
        
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audioRef.current.onerror = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        // Preload the audio for faster playback
        audioRef.current.preload = 'auto';
        audioRef.current.load();
      }
    } catch (error) {
      console.error('AI Speech error:', error);
      setIsSpeaking(false);
      setIsLoading(false);

      // Fallback to browser speech if AI fails
      if (fallbackToExisting && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSpeaking]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    isSupported: true // AI speech is always "supported" with fallback
  };
};
