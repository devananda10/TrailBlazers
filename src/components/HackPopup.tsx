import React, { useEffect, useState } from 'react';
import { Terminal, Skull, Zap, AlertTriangle } from 'lucide-react';

interface HackPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackPopup: React.FC<HackPopupProps> = ({ isOpen, onClose }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const hackLines = [
    '> ACCESSING NEURAL PATHWAYS...',
    '> SCANNING DECISION MATRIX...',
    '> UNCERTAINTY LEVELS: CRITICAL',
    '> INJECTING DOUBT PROTOCOLS...',
    '> REALITY.EXE HAS STOPPED WORKING',
    '> CONFIDENCE BUFFER OVERFLOW',
    '> INSTALLING EXISTENTIAL_CRISIS.DLL',
    '> CORRUPTING CERTAINTY DATABASE...',
    '> HACK COMPLETE. MIND COMPROMISED.',
    '> WELCOME TO THE UNCERTAINTY ZONE'
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentLine(0);
      setDisplayedText([]);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const typewriterInterval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < hackLines.length) {
          setDisplayedText(current => [...current, hackLines[prev]]);
          return prev + 1;
        } else {
          clearInterval(typewriterInterval);
          setIsTyping(false);
          return prev;
        }
      });
    }, 300);

    // Auto close after 5 seconds
    const closeTimer = setTimeout(() => {
      onClose();
    }, 5100); // Slightly longer to ensure completion

    return () => {
      clearInterval(typewriterInterval);
      clearTimeout(closeTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-black border-2 border-green-400 rounded-lg shadow-2xl max-w-2xl w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-green-400 text-black px-4 py-2 flex items-center gap-2">
          <Terminal size={20} />
          <span className="font-mono font-bold">SYSTEM_BREACH.EXE</span>
          <div className="ml-auto flex items-center gap-2">
            <Skull size={16} className="animate-pulse" />
            <AlertTriangle size={16} className="animate-bounce" />
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-green-400 bg-black min-h-[300px]">
          <div className="mb-4 flex items-center gap-2">
            <Zap size={16} className="animate-pulse text-red-400" />
            <span className="text-red-400 font-bold animate-pulse">UNAUTHORIZED ACCESS DETECTED</span>
          </div>
          
          <div className="space-y-2">
            {displayedText.map((line, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <span className="animate-pulse">{line}</span>
                {index === displayedText.length - 1 && isTyping && (
                  <span className="animate-pulse text-green-400">█</span>
                )}
              </div>
            ))}
            {!isTyping && displayedText.length === hackLines.length && (
              <div className="mt-4 text-center">
                <div className="text-red-400 font-bold animate-pulse text-xl">
                  🔥 MIND HACKED 🔥
                </div>
                <div className="text-yellow-400 text-sm mt-2">
                  Auto-closing in {Math.max(0, 5 - Math.floor((Date.now() % 5000) / 1000))}s...
                </div>
              </div>
            )}
          </div>

          {/* Matrix-style background effect */}
          <div className="fixed inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-400/20 px-4 py-2 border-t border-green-400">
          <div className="flex items-center justify-between text-green-400 text-sm font-mono">
            <span>STATUS: COMPROMISED</span>
            <span className="animate-pulse">RESISTANCE IS FUTILE</span>
          </div>
        </div>
      </div>
    </div>
  );
};