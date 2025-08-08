import React, { useEffect, useState } from 'react';

interface ScreenFlickerProps {
  isActive: boolean;
  onComplete: () => void;
}

export const ScreenFlicker: React.FC<ScreenFlickerProps> = ({ isActive, onComplete }) => {
  const [flickerPhase, setFlickerPhase] = useState(0);
  const [glitchText, setGlitchText] = useState('');

  const glitchMessages = [
    'PROCESSING...',
    'REALITY GLITCH DETECTED',
    'SYSTEM OVERLOAD',
    'CONSCIOUSNESS SHIFT',
    'DOUBT INTENSIFYING...',
    'UNCERTAINTY RISING',
    'CHOICE REGISTERED',
    'MIND BENDING...'
  ];

  useEffect(() => {
    if (!isActive) return;

    let timeouts: NodeJS.Timeout[] = [];
    
    // Phase 1: Rapid intense flicker (0-1.5s)
    const flickerInterval = setInterval(() => {
      setFlickerPhase(Math.random() > 0.5 ? 1 : 2);
    }, 80);
    
    timeouts.push(setTimeout(() => {
      clearInterval(flickerInterval);
    }, 1500));

    // Phase 2: Glitch text with distortion (1.5-2.5s)
    timeouts.push(setTimeout(() => {
      setGlitchText(glitchMessages[Math.floor(Math.random() * glitchMessages.length)]);
      setFlickerPhase(3);
      
      // Change text a few times during this phase
      const textInterval = setInterval(() => {
        setGlitchText(glitchMessages[Math.floor(Math.random() * glitchMessages.length)]);
      }, 300);
      
      timeouts.push(setTimeout(() => {
        clearInterval(textInterval);
      }, 1000));
    }, 1500));

    // Phase 3: Fade out (2.5-3s)
    timeouts.push(setTimeout(() => {
      setFlickerPhase(4);
      setGlitchText('');
    }, 2500));

    // Complete the effect after exactly 3 seconds
    timeouts.push(setTimeout(() => {
      setFlickerPhase(0);
      setGlitchText('');
      onComplete();
    }, 3100)); // Slightly longer to ensure completion

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(flickerInterval);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const getFlickerStyle = () => {
    switch (flickerPhase) {
      case 1:
        return {
          filter: 'brightness(0.2) contrast(3) hue-rotate(90deg)',
          transform: 'scale(1.01) skew(0.2deg)',
        };
      case 2:
        return {
          filter: 'brightness(2) contrast(0.5) saturate(3)',
          transform: 'scale(0.99) skew(-0.1deg)',
        };
      case 3:
        return {
          filter: 'brightness(1.3) contrast(1.8) saturate(2)',
          background: 'linear-gradient(45deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1))',
        };
      case 4:
        return {
          filter: 'brightness(1) contrast(1)',
          opacity: 0.3,
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={getFlickerStyle()}
    >
      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          animation: 'scanlines 0.1s linear infinite',
        }}
      />
      
      {/* Glitch text overlay */}
      {glitchText && flickerPhase === 3 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="text-2xl md:text-4xl font-mono font-bold text-red-500 animate-pulse"
            style={{
              textShadow: '2px 2px 0px #00ff00, -2px -2px 0px #ff00ff',
              filter: 'blur(0.5px)',
            }}
          >
            {glitchText}
          </div>
        </div>
      )}

      {/* Color distortion overlay */}
      {flickerPhase >= 1 && (
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-20"
          style={{
            background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
              rgba(255,0,0,0.3), 
              rgba(0,255,0,0.3), 
              rgba(0,0,255,0.3))`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
};