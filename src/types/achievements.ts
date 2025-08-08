export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: (stats: UserStats) => boolean;
  unlocked?: boolean;
}

export interface UserStats {
  uncertaintyLevel: number;
  yesCount: number;
  noCount: number;
  totalClicks: number;
  currentStreak: number;
  maxStreak: number;
  alternatingPattern: number;
  currentPath: 'initial' | 'yes' | 'no';
  messageIndex: number;
}

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_click',
    title: 'First Steps',
    description: 'Made your first choice',
    emoji: '👶',
    condition: (stats) => stats.totalClicks >= 1
  },
  {
    id: 'mildly_confused',
    title: 'Mildly Confused',
    description: 'Reached uncertainty level 5',
    emoji: '🤔',
    condition: (stats) => stats.uncertaintyLevel >= 5
  },
  {
    id: 'doubt_apprentice',
    title: 'Doubt Apprentice',
    description: 'Reached uncertainty level 10',
    emoji: '🎓',
    condition: (stats) => stats.uncertaintyLevel >= 10
  },
  {
    id: 'confusion_scholar',
    title: 'Confusion Scholar',
    description: 'Reached uncertainty level 15',
    emoji: '📚',
    condition: (stats) => stats.uncertaintyLevel >= 15
  },
  {
    id: 'doubt_master',
    title: 'Doubt Master',
    description: 'Reached uncertainty level 25',
    emoji: '🎯',
    condition: (stats) => stats.uncertaintyLevel >= 25
  },
  {
    id: 'uncertainty_sage',
    title: 'Uncertainty Sage',
    description: 'Reached uncertainty level 50',
    emoji: '🧙‍♂️',
    condition: (stats) => stats.uncertaintyLevel >= 50
  },
  {
    id: 'yes_enthusiast',
    title: 'Yes Enthusiast',
    description: 'Clicked Yes 10 times in a row',
    emoji: '✅',
    condition: (stats) => stats.currentPath === 'yes' && stats.yesCount >= 10
  },
  {
    id: 'no_specialist',
    title: 'No Specialist',
    description: 'Clicked No 10 times in a row',
    emoji: '❌',
    condition: (stats) => stats.currentPath === 'no' && stats.noCount >= 10
  },
  {
    id: 'indecisive_champion',
    title: 'Indecisive Champion',
    description: 'Alternated Yes/No 5 times',
    emoji: '🔄',
    condition: (stats) => stats.alternatingPattern >= 5
  },
  {
    id: 'persistence_award',
    title: 'Persistence Award',
    description: 'Made 100 total clicks',
    emoji: '🏆',
    condition: (stats) => stats.totalClicks >= 100
  },
  {
    id: 'dedication_medal',
    title: 'Dedication Medal',
    description: 'Made 250 total clicks',
    emoji: '🥇',
    condition: (stats) => stats.totalClicks >= 250
  },
  {
    id: 'obsession_crown',
    title: 'Obsession Crown',
    description: 'Made 500 total clicks',
    emoji: '👑',
    condition: (stats) => stats.totalClicks >= 500
  }
];

export const getRankTitle = (level: number): { title: string; emoji: string } => {
  if (level >= 100) return { title: 'Existential Crisis Expert', emoji: '🌌' };
  if (level >= 75) return { title: 'Uncertainty Overlord', emoji: '👑' };
  if (level >= 50) return { title: 'Doubt Sage', emoji: '🧙‍♂️' };
  if (level >= 35) return { title: 'Confusion Master', emoji: '🎯' };
  if (level >= 25) return { title: 'Doubt Master', emoji: '🎓' };
  if (level >= 20) return { title: 'Uncertainty Expert', emoji: '🔬' };
  if (level >= 15) return { title: 'Confusion Scholar', emoji: '📚' };
  if (level >= 10) return { title: 'Doubt Apprentice', emoji: '🎒' };
  if (level >= 5) return { title: 'Mildly Confused', emoji: '🤔' };
  if (level >= 1) return { title: 'Uncertainty Novice', emoji: '👶' };
  return { title: 'Completely Sure', emoji: '😌' };
};