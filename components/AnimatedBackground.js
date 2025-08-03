import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Smooth lerp function for value interpolation
function lerp(start, end, factor) {
  return start * (1 - factor) + end * factor;
}

function AnimatedStars({ isThinking, isSpeaking, audioData }) {
  const ref = useRef();
  const materialRef = useRef();
  const targetRotationSpeed = useRef({ x: 0, y: 0 });
  const currentRotationSpeed = useRef({ x: 0, y: 0 });
  
  const [sphere] = useMemo(() => {
    const sphere = new THREE.SphereGeometry(3, 64, 32);
    return [sphere];
  }, []);

  // Determine target animation state with audio influence
  useEffect(() => {
    if (isSpeaking && audioData?.isActive) {
      const audioIntensity = audioData.volume || 0.5;
      targetRotationSpeed.current = { 
        x: 0.4 + (audioIntensity * 0.6), 
        y: 0.6 + (audioIntensity * 0.8) 
      };
    } else if (isSpeaking) {
      targetRotationSpeed.current = { x: 0.8, y: 1.2 };
    } else if (isThinking) {
      targetRotationSpeed.current = { x: 0.4, y: 0.6 };
    } else {
      targetRotationSpeed.current = { x: 0.1, y: 0.15 };
    }
  }, [isThinking, isSpeaking, audioData]);

  useFrame((state, delta) => {
    if (ref.current) {
      // Smooth interpolation of rotation speeds (increased responsiveness)
      currentRotationSpeed.current.x = lerp(
        currentRotationSpeed.current.x, 
        targetRotationSpeed.current.x, 
        delta * 3 // Increased from 2 for better audio response
      );
      currentRotationSpeed.current.y = lerp(
        currentRotationSpeed.current.y, 
        targetRotationSpeed.current.y, 
        delta * 3 // Increased from 2 for better audio response
      );
      
      // Add audio waveform influence to rotation (more balanced)
      let finalRotationX = currentRotationSpeed.current.x;
      let finalRotationY = currentRotationSpeed.current.y;
      
      if (isSpeaking && audioData?.isActive && audioData.waveform) {
        // Apply enhanced waveform influence for better sync
        const waveformAvg = audioData.waveform.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.waveform.length;
        const clampedWaveform = Math.min(waveformAvg, 0.4); // Increased clamp limit
        finalRotationX += clampedWaveform * 0.12; // Increased sensitivity
        finalRotationY += clampedWaveform * 0.08; // Increased sensitivity
      }
      
      ref.current.rotation.x += delta * finalRotationX;
      ref.current.rotation.y += delta * finalRotationY;
    }

    // Update material properties manually for smooth transitions
    if (materialRef.current) {
      let targetColor = isSpeaking ? "#00ffff" : isThinking ? "#ff6b6b" : "#8b5cf6";
      let targetSize = isSpeaking ? 0.025 : isThinking ? 0.018 : 0.012;
      
      // Modulate color and size based on audio (more controlled)
      if (isSpeaking && audioData?.isActive) {
        const freqHue = (audioData.frequency / 1000) * 360;
        const audioColor = new THREE.Color().setHSL(freqHue / 360, 0.8, 0.5);
        targetColor = `#${audioColor.getHexString()}`;
        
        // Apply size modulation with smoother transitions
        const clampedVolume = Math.min(audioData.volume, 0.6); // Clamp max volume influence
        targetSize += (clampedVolume * 0.006); // Further reduced size variation
      }
      
      // Slower color and size transitions for smoother animation
      materialRef.current.color.lerp(new THREE.Color(targetColor), delta * 2); // Reduced from 3
      materialRef.current.size = lerp(materialRef.current.size || 0.012, targetSize, delta * 2); // Reduced from 3
    }
  });

  return (
    <Points ref={ref} positions={sphere.attributes.position.array} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={materialRef}
        transparent
        color="#8b5cf6"
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function CentralSphere({ isThinking, isSpeaking, audioData }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const targetPulse = useRef(1);
  const currentPulse = useRef(1);
  const targetFloat = useRef(0.1);
  const currentFloat = useRef(0.1);
  
  // Determine animation targets based on state and audio data
  useEffect(() => {
    if (isSpeaking && audioData?.isActive) {
      // Use audio volume to drive intensity
      const audioIntensity = audioData.volume || 0.5;
      targetPulse.current = 0.2 + (audioIntensity * 0.6); // Scale with audio
      targetFloat.current = 0.2 + (audioIntensity * 0.4);
    } else if (isSpeaking) {
      targetPulse.current = 0.4; // Fallback when no audio data
      targetFloat.current = 0.3;
    } else if (isThinking) {
      targetPulse.current = 0.25;
      targetFloat.current = 0.2;
    } else {
      targetPulse.current = 0.1;
      targetFloat.current = 0.08;
    }
  }, [isThinking, isSpeaking, audioData]);

  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Smooth base rotation (slightly slower)
      meshRef.current.rotation.x += delta * 0.15; // Reduced from 0.2
      meshRef.current.rotation.y += delta * 0.12; // Reduced from 0.15
      
      // Smoother interpolation of animation intensities
      currentPulse.current = lerp(currentPulse.current, targetPulse.current, delta * 3);
      currentFloat.current = lerp(currentFloat.current, targetFloat.current, delta * 1.5); // Reduced from 2
      
      // Apply audio-reactive floating motion with balanced movement
      let floatSpeed = isSpeaking ? 4 : isThinking ? 2.5 : 0.8; // Reduced all speeds
      let floatY = Math.sin(state.clock.elapsedTime * floatSpeed) * currentFloat.current;
      
      // Add audio waveform influence when speaking (increased responsiveness)
      if (isSpeaking && audioData?.isActive && audioData.waveform) {
        const clampedWaveform = Math.min(Math.abs(audioData.waveform[0]), 0.5); // Increased clamp limit
        const waveformInfluence = clampedWaveform * audioData.volume * 0.15; // Increased from 0.08
        floatY += waveformInfluence;
        
        // Add stronger frequency-based rotation speed for better sync
        const frequencyInfluence = (audioData.frequency / 1000) * 0.25; // Increased from 0.15
        meshRef.current.rotation.y += delta * frequencyInfluence;
      }
      
      meshRef.current.position.y = floatY;
      
      // Apply audio-reactive pulsing scale (more balanced)
      let pulseSpeed = isSpeaking ? 6 : isThinking ? 3.5 : 1.2; // Reduced all speeds
      let pulseScale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * currentPulse.current;
      
      // Add audio volume influence (increased responsiveness)
      if (isSpeaking && audioData?.isActive) {
        const clampedVolume = Math.min(audioData.volume, 0.8); // Increased clamp limit
        pulseScale += (clampedVolume * 0.18); // Increased from 0.12
      }
      
      meshRef.current.scale.setScalar(pulseScale);
      
      // Dynamic emissive intensity based on state and audio (smoother)
      let baseIntensity = isSpeaking ? 0.6 : isThinking ? 0.4 : 0.2;
      if (isSpeaking && audioData?.isActive) {
        const clampedVolume = Math.min(audioData.volume, 0.8);
        baseIntensity += (clampedVolume * 0.18); // Reduced from 0.2
      }
      
      const pulseIntensity = Math.sin(state.clock.elapsedTime * pulseSpeed * 1.8) * 0.25; // Reduced intensity
      materialRef.current.emissiveIntensity = baseIntensity + pulseIntensity;
      
      // Smooth color transitions with audio influence
      let targetColor = isSpeaking ? "#00ffff" : isThinking ? "#ff6b6b" : "#8b5cf6";
      let targetEmissive = isSpeaking ? "#004444" : isThinking ? "#441111" : "#2d1b69";
      let targetOpacity = isSpeaking ? 0.6 : isThinking ? 0.4 : 0.25;
      
      // Modulate colors based on audio frequency when speaking (more gradual)
      if (isSpeaking && audioData?.isActive) {
        const freqHue = (audioData.frequency / 1000) * 360;
        const audioColor = new THREE.Color().setHSL(freqHue / 360, 0.8, 0.5);
        targetColor = `#${audioColor.getHexString()}`;
        
        const clampedVolume = Math.min(audioData.volume, 0.6);
        targetOpacity += (clampedVolume * 0.12); // Reduced from 0.15
      }
      
      // Slower, smoother color and opacity transitions
      materialRef.current.color.lerp(new THREE.Color(targetColor), delta * 2.5); // Reduced from 3
      materialRef.current.emissive.lerp(new THREE.Color(targetEmissive), delta * 2.5); // Reduced from 3
      materialRef.current.opacity = lerp(materialRef.current.opacity, Math.min(targetOpacity, 1), delta * 2.5); // Reduced from 3
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.125, 3]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#8b5cf6"
        transparent
        opacity={0.25}
        wireframe={true}
        emissive="#2d1b69"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function FloatingParticles({ isThinking, isSpeaking, audioData }) {
  const particlesRef = useRef();
  const materialRef = useRef();
  const targetSpeed = useRef({ rotation: 0.1, dispersion: 1 });
  const currentSpeed = useRef({ rotation: 0.1, dispersion: 1 });
  const particleCount = 150;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Create more organic, galaxy-like distribution
      const radius = Math.pow(Math.random(), 0.7) * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  // Update target speeds based on AI state and audio
  useEffect(() => {
    if (isSpeaking && audioData?.isActive) {
      const audioIntensity = audioData.volume || 0.5;
      targetSpeed.current = { 
        rotation: 0.3 + (audioIntensity * 0.5), 
        dispersion: 1.2 + (audioIntensity * 0.8) 
      };
    } else if (isSpeaking) {
      targetSpeed.current = { rotation: 0.6, dispersion: 1.8 };
    } else if (isThinking) {
      targetSpeed.current = { rotation: 0.3, dispersion: 1.4 };
    } else {
      targetSpeed.current = { rotation: 0.08, dispersion: 1 };
    }
  }, [isThinking, isSpeaking, audioData]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      // Increased responsiveness for better audio sync
      currentSpeed.current.rotation = lerp(
        currentSpeed.current.rotation, 
        targetSpeed.current.rotation, 
        delta * 2.5 // Increased from 1.5 for better response
      );
      currentSpeed.current.dispersion = lerp(
        currentSpeed.current.dispersion, 
        targetSpeed.current.dispersion, 
        delta * 2 // Increased from 1.2 for better scaling response
      );
      
      // Apply enhanced rotation with stronger audio influence
      let rotationSpeed = currentSpeed.current.rotation;
      if (isSpeaking && audioData?.isActive && audioData.waveform) {
        // Add stronger waveform-based rotation variation for better sync
        const waveformInfluence = audioData.waveform.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.waveform.length;
        const clampedInfluence = Math.min(waveformInfluence, 0.4); // Increased clamp limit
        rotationSpeed += clampedInfluence * 0.22; // Increased from 0.15
      }
      
      particlesRef.current.rotation.y += delta * rotationSpeed;
      particlesRef.current.rotation.x += delta * rotationSpeed * 0.25; // Reduced from 0.3
      
      // Dynamic scale based on AI activity with smoother audio enhancement
      let breatheScale = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08 * currentSpeed.current.dispersion; // Reduced intensity
      
      // Add controlled audio volume influence
      if (isSpeaking && audioData?.isActive) {
        const clampedVolume = Math.min(audioData.volume, 0.7);
        breatheScale += (clampedVolume * 0.12); // Reduced from 0.15
      }
      
      particlesRef.current.scale.setScalar(breatheScale);
    }

    // Update material color for smoother transitions
    if (materialRef.current) {
      let targetColor = isSpeaking ? "#66ffff" : isThinking ? "#ffaaaa" : "#aa99ff";
      
      // Modulate color based on audio frequency (more gradual)
      if (isSpeaking && audioData?.isActive) {
        const freqHue = (audioData.frequency / 1000) * 360;
        const audioColor = new THREE.Color().setHSL(freqHue / 360, 0.7, 0.6);
        targetColor = `#${audioColor.getHexString()}`;
      }
      
      materialRef.current.color.lerp(new THREE.Color(targetColor), delta * 2); // Reduced from 3
      
      // Modulate opacity based on audio (more controlled)
      if (isSpeaking && audioData?.isActive) {
        const clampedVolume = Math.min(audioData.volume, 0.8);
        const audioOpacity = 0.5 + (clampedVolume * 0.3); // Reduced variation
        materialRef.current.opacity = lerp(materialRef.current.opacity, audioOpacity, delta * 2); // Reduced from 3
      } else {
        materialRef.current.opacity = lerp(materialRef.current.opacity, 0.7, delta * 2); // Reduced from 3
      }
    }
  });

  return (
    <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={materialRef}
        transparent
        color="#aa99ff"
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

// Energy Ring Component for enhanced AI presence
function EnergyRing({ isThinking, isSpeaking, audioData }) {
  const ringRef = useRef();
  const materialRef = useRef();
  const targetIntensity = useRef(0);
  const currentIntensity = useRef(0);
  
  useEffect(() => {
    if (isSpeaking && audioData?.isActive) {
      targetIntensity.current = 0.8 + (audioData.volume * 0.4);
    } else if (isSpeaking) {
      targetIntensity.current = 1;
    } else if (isThinking) {
      targetIntensity.current = 0.6;
    } else {
      targetIntensity.current = 0.2;
    }
  }, [isThinking, isSpeaking, audioData]);

  useFrame((state, delta) => {
    if (ringRef.current && materialRef.current) {
      currentIntensity.current = lerp(currentIntensity.current, targetIntensity.current, delta * 2.5); // Reduced from 3
      
      // Base rotation with controlled audio enhancement
      let rotationSpeed = 0.4 * currentIntensity.current; // Reduced base speed
      if (isSpeaking && audioData?.isActive) {
        const clampedVolume = Math.min(audioData.volume, 0.8);
        rotationSpeed += (clampedVolume * 0.6); // Reduced from 0.8
      }
      
      ringRef.current.rotation.z += delta * rotationSpeed;
      
      // Scale with smoother audio-reactive pulsing
      let pulseScale = 2 + Math.sin(state.clock.elapsedTime * 3.5) * 0.25 * currentIntensity.current; // Reduced pulse intensity
      
      // Add controlled audio waveform influence
      if (isSpeaking && audioData?.isActive && audioData.waveform) {
        const waveformIntensity = audioData.waveform.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.waveform.length;
        const clampedWaveform = Math.min(waveformIntensity, 0.4); // Clamp waveform peaks
        pulseScale += clampedWaveform * audioData.volume * 0.4; // Reduced from 0.5
      }
      
      ringRef.current.scale.setScalar(pulseScale);
      
      // Smoother color and opacity transitions
      let targetColor = isSpeaking ? "#00ffff" : isThinking ? "#ff6b6b" : "#8b5cf6";
      let targetOpacity = isSpeaking ? 0.8 : isThinking ? 0.5 : 0.2;
      
      // Audio-reactive color modulation (more gradual)
      if (isSpeaking && audioData?.isActive) {
        const freqHue = (audioData.frequency / 1000) * 360;
        const audioColor = new THREE.Color().setHSL(freqHue / 360, 0.9, 0.6);
        targetColor = `#${audioColor.getHexString()}`;
        
        const clampedVolume = Math.min(audioData.volume, 0.7);
        targetOpacity += (clampedVolume * 0.25); // Reduced from 0.3
      }
      
      materialRef.current.color.lerp(new THREE.Color(targetColor), delta * 2.5); // Reduced from 3
      materialRef.current.opacity = lerp(materialRef.current.opacity, Math.min(targetOpacity, 1), delta * 2.5); // Reduced from 3
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.25, 0.02, 8, 100]} />
      <meshBasicMaterial 
        ref={materialRef}
        color="#8b5cf6"
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

function DynamicLighting({ isThinking, isSpeaking, audioData }) {
  const ambientRef = useRef();
  const pointLight1Ref = useRef();
  const pointLight2Ref = useRef();
  const pointLight3Ref = useRef();

  useFrame((state, delta) => {
    // Smooth lighting transitions using refs with audio enhancement
    let targetAmbient = isSpeaking ? 0.4 : isThinking ? 0.3 : 0.2;
    let targetPointIntensity = isSpeaking ? 1.2 : isThinking ? 0.9 : 0.6;
    
    // Enhance lighting based on audio volume
    if (isSpeaking && audioData?.isActive) {
      targetAmbient += (audioData.volume * 0.3);
      targetPointIntensity += (audioData.volume * 0.5);
    }
    
    if (ambientRef.current) {
      ambientRef.current.intensity = lerp(
        ambientRef.current.intensity, 
        targetAmbient, 
        delta * 3
      );
    }
    
    if (pointLight1Ref.current) {
      pointLight1Ref.current.intensity = lerp(
        pointLight1Ref.current.intensity, 
        targetPointIntensity, 
        delta * 3
      );
      
      let targetColor = isSpeaking ? "#00ffff" : isThinking ? "#ff6b6b" : "#8b5cf6";
      
      // Modulate light color based on audio frequency
      if (isSpeaking && audioData?.isActive) {
        const freqHue = (audioData.frequency / 1000) * 360;
        const audioColor = new THREE.Color().setHSL(freqHue / 360, 0.8, 0.5);
        targetColor = `#${audioColor.getHexString()}`;
      }
      
      pointLight1Ref.current.color.lerp(new THREE.Color(targetColor), delta * 3);
    }
    
    if (pointLight2Ref.current) {
      pointLight2Ref.current.intensity = lerp(
        pointLight2Ref.current.intensity, 
        targetPointIntensity * 0.6, 
        delta * 3
      );
      
      const targetColor2 = isSpeaking ? "#004444" : isThinking ? "#441111" : "#2d1b69";
      pointLight2Ref.current.color.lerp(new THREE.Color(targetColor2), delta * 3);
    }
    
    if (pointLight3Ref.current) {
      let finalIntensity = targetPointIntensity * 0.4;
      
      // Add audio waveform flicker to accent light
      if (isSpeaking && audioData?.isActive && audioData.waveform) {
        const waveformFlicker = audioData.waveform[Math.floor(Math.random() * audioData.waveform.length)] * audioData.volume * 0.3;
        finalIntensity += Math.abs(waveformFlicker);
      }
      
      pointLight3Ref.current.intensity = lerp(
        pointLight3Ref.current.intensity, 
        finalIntensity, 
        delta * 3
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.2} />
      <pointLight 
        ref={pointLight1Ref}
        position={[10, 10, 10]} 
        intensity={0.6} 
        color="#8b5cf6" 
      />
      <pointLight 
        ref={pointLight2Ref}
        position={[-10, -10, -10]} 
        intensity={0.36} 
        color="#2d1b69" 
      />
      <pointLight 
        ref={pointLight3Ref}
        position={[0, 0, 15]} 
        intensity={0.24} 
        color="#ffffff" 
      />
    </>
  );
}

export default function AnimatedBackground({ isThinking, isSpeaking, audioData }) {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        style={{ width: '100vw', height: '100vh' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000000"]} />
        
        {/* Dynamic Lighting with smooth transitions */}
        <DynamicLighting isThinking={isThinking} isSpeaking={isSpeaking} audioData={audioData} />
        
        {/* Central AI sphere - the main focal point */}
        <CentralSphere isThinking={isThinking} isSpeaking={isSpeaking} audioData={audioData} />
        
        {/* Energy ring around the sphere */}
        <EnergyRing isThinking={isThinking} isSpeaking={isSpeaking} audioData={audioData} />
        
        {/* Surrounding star field */}
        <AnimatedStars isThinking={isThinking} isSpeaking={isSpeaking} audioData={audioData} />
        
        {/* Floating particles representing data/thoughts */}
        <FloatingParticles isThinking={isThinking} isSpeaking={isSpeaking} audioData={audioData} />
        
      </Canvas>
    </div>
  );
}
