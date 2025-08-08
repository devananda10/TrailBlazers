import React from 'react';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { Achievement, getRankTitle } from '../types/achievements';

interface AchievementPanelProps {
  achievements: Achievement[];
  uncertaintyLevel: number;
  totalClicks: number;
  yesCount: number;
  noCount: number;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({
  achievements,
  uncertaintyLevel,
  totalClicks,
  yesCount,
  noCount
}) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const rank = getRankTitle(uncertaintyLevel);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-sm">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">{rank.emoji}</div>
        <h3 className="font-bold text-lg text-gray-800">{rank.title}</h3>
        <p className="text-sm text-gray-600">Level {uncertaintyLevel}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-blue-100 rounded-lg p-2 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-blue-600" />
          <div className="font-semibold text-blue-800">{totalClicks}</div>
          <div className="text-blue-600 text-xs">Total Clicks</div>
        </div>
        <div className="bg-green-100 rounded-lg p-2 text-center">
          <Star className="w-4 h-4 mx-auto mb-1 text-green-600" />
          <div className="font-semibold text-green-800">{yesCount}</div>
          <div className="text-green-600 text-xs">Yes Count</div>
        </div>
        <div className="bg-red-100 rounded-lg p-2 text-center">
          <Award className="w-4 h-4 mx-auto mb-1 text-red-600" />
          <div className="font-semibold text-red-800">{noCount}</div>
          <div className="text-red-600 text-xs">No Count</div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-2 text-center">
          <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
          <div className="font-semibold text-yellow-800">{unlockedAchievements.length}</div>
          <div className="text-yellow-600 text-xs">Achievements</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Trophy size={16} />
          Recent Achievements
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {unlockedAchievements.slice(-5).reverse().map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-lg">{achievement.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">
                  {achievement.title}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {achievement.description}
                </div>
              </div>
            </div>
          ))}
          {unlockedAchievements.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-2">
              No achievements yet. Keep clicking!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};