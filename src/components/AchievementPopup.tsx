import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { Achievement } from '../types/achievements';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-2xl border-2 border-yellow-300 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">
            {achievement.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} className="text-yellow-200" />
              <span className="font-bold text-sm">Achievement Unlocked!</span>
              <Sparkles size={16} className="text-yellow-200 animate-pulse" />
            </div>
            <h3 className="font-bold text-lg">{achievement.title}</h3>
            <p className="text-sm text-yellow-100">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};