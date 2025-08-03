import { useState, useRef, useCallback } from 'react';

export const useStreamingSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioQueueRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  const playNextAudio = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift();
    
    try {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioData), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioRef.current = new Audio(audioUrl);
      
      currentAudioRef.current.oncanplaythrough = () => {
        if (!isSpeaking) setIsSpeaking(true);
        
        // Attempt to play with error handling for autoplay restrictions
        currentAudioRef.current.play().catch(error => {
          console.warn('Audio autoplay blocked:', error);
          // For now, we'll still set speaking state for visual feedback
          // User will need to interact with the page first
        });
      };
      
      currentAudioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        isPlayingRef.current = false;
        
        // Play next chunk if available
        if (audioQueueRef.current.length > 0) {
          playNextAudio();
        } else {
          setIsSpeaking(false);
          setIsLoading(false);
        }
      };
      
      currentAudioRef.current.onerror = (error) => {
        console.error('Audio playback error:', error);
        URL.revokeObjectURL(audioUrl);
        isPlayingRef.current = false;
        setIsSpeaking(false);
        setIsLoading(false);
      };
      
      currentAudioRef.current.preload = 'auto';
      currentAudioRef.current.load();
      
    } catch (error) {
      console.error('Audio playback error:', error);
      isPlayingRef.current = false;
      setIsSpeaking(false);
      setIsLoading(false);
    }
  }, [isSpeaking]);

  const speakChunked = useCallback(async (text, options = {}) => {
    if (!text || isSpeaking) return;

    const {
      provider = 'openai',
      voice = 'alloy',
      chunkSize = 200, // Characters per chunk
      fallbackToExisting = true
    } = options;

    setIsLoading(true);
    audioQueueRef.current = [];
    
    // Split text into chunks at sentence boundaries
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    let chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    try {
      // Process chunks in parallel but maintain order
      const audioPromises = chunks.map(async (chunk, index) => {
        const response = await fetch('/api/speech/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: chunk,
            voice,
            provider
          }),
        });

        const data = await response.json();
        
        // Log fallback information if available
        if (data.fallbackUsed) {
          console.log(`Chunk ${index}: ${data.message}`);
        }
        
        return { index, audioData: data.audioData, fallback: data.fallback };
      });

      // Process results as they come in
      const results = await Promise.all(audioPromises);
      
      // Sort by index and add to queue
      results
        .sort((a, b) => a.index - b.index)
        .forEach(result => {
          if (result.audioData) {
            audioQueueRef.current.push(result.audioData);
          }
        });

      // Start playing if we have audio
      if (audioQueueRef.current.length > 0) {
        playNextAudio();
      } else if (fallbackToExisting) {
        // Fallback to browser speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.15;
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
      }
    } catch (error) {
      console.error('Chunked speech error:', error);
      setIsSpeaking(false);
      setIsLoading(false);

      // Fallback to browser speech if AI fails
      if (fallbackToExisting && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.15;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSpeaking, playNextAudio]);

  const stop = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  return {
    speak: speakChunked,
    stop,
    isSpeaking,
    isLoading,
    isSupported: true
  };
};
