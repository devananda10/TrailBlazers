export interface Theme {
  id: string;
  name: string;
  gradient: string;
  cardBg: string;
  textColor: string;
  buttonColors: {
    yes: string;
    no: string;
  };
}

export interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'video';
  url?: string;
  gradient?: string;
  preview: string;
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Cosmic Purple',
    gradient: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    cardBg: 'bg-white/90',
    textColor: 'text-gray-800',
    buttonColors: {
      yes: 'bg-green-500 hover:bg-green-600',
      no: 'bg-red-500 hover:bg-red-600'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    gradient: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500',
    cardBg: 'bg-white/90',
    textColor: 'text-gray-800',
    buttonColors: {
      yes: 'bg-emerald-500 hover:bg-emerald-600',
      no: 'bg-rose-500 hover:bg-rose-600'
    }
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    gradient: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500',
    cardBg: 'bg-white/90',
    textColor: 'text-gray-800',
    buttonColors: {
      yes: 'bg-green-500 hover:bg-green-600',
      no: 'bg-red-500 hover:bg-red-600'
    }
  },
  {
    id: 'forest',
    name: 'Mystic Forest',
    gradient: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    cardBg: 'bg-white/90',
    textColor: 'text-gray-800',
    buttonColors: {
      yes: 'bg-lime-500 hover:bg-lime-600',
      no: 'bg-red-500 hover:bg-red-600'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    gradient: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
    cardBg: 'bg-gray-800/90',
    textColor: 'text-white',
    buttonColors: {
      yes: 'bg-green-600 hover:bg-green-700',
      no: 'bg-red-600 hover:bg-red-700'
    }
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    gradient: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
    cardBg: 'bg-black/80 border border-cyan-400/30',
    textColor: 'text-cyan-100',
    buttonColors: {
      yes: 'bg-cyan-500 hover:bg-cyan-400 text-black',
      no: 'bg-pink-500 hover:bg-pink-400 text-black'
    }
  }
];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'gradient1',
    name: 'Aurora',
    type: 'gradient',
    gradient: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    preview: 'linear-gradient(135deg, #a855f7, #ec4899, #ef4444)'
  },
  {
    id: 'gradient2',
    name: 'Ocean Waves',
    type: 'gradient',
    gradient: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500',
    preview: 'linear-gradient(135deg, #60a5fa, #06b6d4, #14b8a6)'
  },
  {
    id: 'space1',
    name: 'Nebula',
    type: 'image',
    url: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
    preview: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'nature1',
    name: 'Mountain Lake',
    type: 'image',
    url: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg',
    preview: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'abstract1',
    name: 'Liquid Colors',
    type: 'image',
    url: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png',
    preview: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'city1',
    name: 'Neon City',
    type: 'image',
    url: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
    preview: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];