import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioAnalyzer = () => {
  const [audioData, setAudioData] = useState({
    volume: 0,
    frequency: 0,
    waveform: new Array(32).fill(0),
    isActive: false
  });
  
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const dataArrayRef = useRef(null);
  const frequencyDataRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sourceRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize audio context and analyzer
  const initializeAnalyzer = useCallback(() => {
    if (!isClient) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (!analyzerRef.current) {
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
        analyzerRef.current.smoothingTimeConstant = 0.8;
        
        const bufferLength = analyzerRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        frequencyDataRef.current = new Uint8Array(bufferLength);
      }
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
    }
  }, [isClient]);

  // Analyze audio data from the analyzer
  const analyzeAudio = useCallback(() => {
    if (!analyzerRef.current || !dataArrayRef.current) return;

    // Get frequency data (for volume and dominant frequency)
    analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Get time domain data (for waveform)
    analyzerRef.current.getByteTimeDomainData(frequencyDataRef.current);
    
    // Calculate volume (RMS of frequency data)
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i] * dataArrayRef.current[i];
    }
    const volume = Math.sqrt(sum / dataArrayRef.current.length) / 255;
    
    // Find dominant frequency
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      if (dataArrayRef.current[i] > maxValue) {
        maxValue = dataArrayRef.current[i];
        maxIndex = i;
      }
    }
    const frequency = (maxIndex / dataArrayRef.current.length) * (audioContextRef.current.sampleRate / 2);
    
    // Create simplified waveform data (32 points)
    const waveform = [];
    const step = Math.floor(frequencyDataRef.current.length / 32);
    for (let i = 0; i < 32; i++) {
      const index = i * step;
      waveform.push((frequencyDataRef.current[index] - 128) / 128);
    }
    
    setAudioData({
      volume,
      frequency,
      waveform,
      isActive: volume > 0.01 // Consider active if volume is above threshold
    });
    
    // Continue analyzing
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  // Connect to an audio element
  const connectToAudio = useCallback((audioElement) => {
    if (!isClient || !audioElement || !audioContextRef.current) return;

    try {
      // Disconnect existing source
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      // Create new source from audio element
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);
      
      // Start analyzing
      if (!animationFrameRef.current) {
        analyzeAudio();
      }
    } catch (error) {
      console.error('Failed to connect audio element:', error);
    }
  }, [analyzeAudio, isClient]);

  // Connect to a media stream (for speech synthesis)
  const connectToStream = useCallback((stream) => {
    if (!isClient || !stream || !audioContextRef.current) return;

    try {
      // Disconnect existing source
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      // Create source from stream
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyzerRef.current);
      
      // Start analyzing
      if (!animationFrameRef.current) {
        analyzeAudio();
      }
    } catch (error) {
      console.error('Failed to connect audio stream:', error);
    }
  }, [analyzeAudio, isClient]);

  // Connect to Web Audio API speech synthesis
  const connectToSpeechSynthesis = useCallback(() => {
    if (!isClient || !audioContextRef.current) return;

    try {
      // For speech synthesis, we'll use a different approach
      // since we can't directly connect to speechSynthesis
      // We'll use the destination and monitor it
      const gainNode = audioContextRef.current.createGain();
      gainNode.connect(audioContextRef.current.destination);
      
      // Start analyzing even without direct connection
      if (!animationFrameRef.current) {
        analyzeAudio();
      }
    } catch (error) {
      console.error('Failed to setup speech synthesis monitoring:', error);
    }
  }, [analyzeAudio, isClient]);

  // Start monitoring (for browser speech synthesis)
  const startMonitoring = useCallback(() => {
    if (!isClient) return;
    
    initializeAnalyzer();
    
    // Enhanced audio simulation with more pronounced variations for better sync
    let timeOffset = 0;
    let lastVolume = 0.4;
    let lastFrequency = 150;
    const baseFrequency = 150;
    const baseVolume = 0.4;
    const smoothing = 0.18; // Reduced smoothing for more responsiveness
    
    const simulateAudioData = () => {
      timeOffset += 0.015; // Slightly faster for more dynamic changes
      
      // Create more pronounced speech patterns with better variation
      const volumeVariation = 
        Math.sin(timeOffset * 3.2) * 0.25 +     // Increased primary rhythm
        Math.sin(timeOffset * 6.8) * 0.15 +     // More secondary variation
        Math.sin(timeOffset * 11.5) * 0.08;     // Enhanced detail layer
      
      const frequencyVariation = 
        Math.sin(timeOffset * 2.1) * 60 +       // Increased frequency range
        Math.sin(timeOffset * 5.2) * 35 +       // More modulation
        Math.sin(timeOffset * 8.7) * 15;        // Better fine detail
      
      const targetVolume = Math.max(0.15, Math.min(0.9, baseVolume + volumeVariation));
      const targetFrequency = Math.max(80, Math.min(400, baseFrequency + frequencyVariation));
      
      // Apply moderate smoothing for responsive but not jittery movement
      lastVolume = lastVolume * (1 - smoothing) + targetVolume * smoothing;
      lastFrequency = lastFrequency * (1 - smoothing) + targetFrequency * smoothing;
      
      // Generate more dynamic waveform with stronger amplitude variations
      const waveform = Array.from({ length: 32 }, (_, i) => {
        const phase = (timeOffset * 2.2) + (i * 0.18);
        const primaryWave = Math.sin(phase) * 0.35;           // Increased amplitude
        const secondaryWave = Math.sin(phase * 2.7) * 0.22;  // More secondary
        const tertiaryWave = Math.sin(phase * 4.1) * 0.12;   // Enhanced tertiary
        
        // Combine waves with more pronounced peaks and valleys
        const combinedAmplitude = (primaryWave + secondaryWave + tertiaryWave);
        return combinedAmplitude * lastVolume; // Full volume scaling for better sync
      });
      
      setAudioData({
        volume: lastVolume,
        frequency: lastFrequency,
        waveform,
        isActive: true
      });
      
      animationFrameRef.current = requestAnimationFrame(simulateAudioData);
    };
    
    simulateAudioData();
  }, [initializeAnalyzer, isClient]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setAudioData({
      volume: 0,
      frequency: 0,
      waveform: new Array(32).fill(0),
      isActive: false
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopMonitoring]);

  // Initialize on mount
  useEffect(() => {
    initializeAnalyzer();
  }, [initializeAnalyzer]);

  return {
    audioData,
    connectToAudio,
    connectToStream,
    connectToSpeechSynthesis,
    startMonitoring,
    stopMonitoring,
    isSupported: isClient && !!(window.AudioContext || window.webkitAudioContext)
  };
};
