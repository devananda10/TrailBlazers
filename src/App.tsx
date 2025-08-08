import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, Trophy, Palette } from 'lucide-react';
import { supabase, UserProgress } from './lib/supabase';
import { AuthModal } from './components/AuthModal';
import { AchievementPopup } from './components/AchievementPopup';
import { AchievementPanel } from './components/AchievementPanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { ScreenFlicker } from './components/ScreenFlicker';
import { ACHIEVEMENTS, Achievement, UserStats } from './types/achievements';
import { Theme, Wallpaper, THEMES } from './types/customization';

function App() {
  // Core game state
  const [currentPath, setCurrentPath] = useState<'initial' | 'yes' | 'no'>('initial');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Achievement system state
  const [uncertaintyLevel, setUncertaintyLevel] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(
    ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  );
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [alternatingPattern, setAlternatingPattern] = useState(0);
  const [lastChoice, setLastChoice] = useState<'yes' | 'no' | null>(null);

  // UI state
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [triggerFlicker, setTriggerFlicker] = useState(false);
  
  // Customization state
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(null);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);
  
  // Hack popup state
  const [showHackPopup, setShowHackPopup] = useState(false);
  const [hackClickCount, setHackClickCount] = useState(0);

  const yesQuestions = [
    "But... are you REALLY sure?",
    "This is serious. Are you 100% certain?",
    "Think carefully... are you absolutely, positively sure?",
    "I mean, REALLY sure? Like, stake your life on it sure?",
    "Are you prepared to bet your entire existence on this decision?",
    "Have you consulted with your inner demons? Are you SURE sure?",
    "What if I told you this is irreversible? Still sure?",
    "Your ancestors are watching. Are you making them proud with this sureness?",
    "On a scale of 1 to universe-exploding, how sure are you?",
    "Fine, but are you sure you're not just pretending to be sure?",
    "What if 'sure' doesn't mean what you think it means?",
    "Are you sure about being sure about being sure?",
    "This is your final chance to not be sure. Are you STILL sure?",
    "Okay but seriously though... are you actually sure?",
    "I'm running out of ways to ask... but ARE YOU SURE?"
  ];

  const noQuestions = [
    "So you're NOT sure?",
    "Are you sure you're not sure?",
    "Certain about being uncertain?",
    "How can you be so confident about your lack of confidence?",
    "Are you positively uncertain?",
    "100% maybe?",
    "Definitely unsure, or unsurely definite?",
    "Is your uncertainty certain, or is it uncertain?",
    "Are you sure about this whole 'not being sure' thing?",
    "What if you're wrong about being unsure?",
    "Could it be that you're uncertain about your uncertainty?",
    "Are you absolutely positive about your complete lack of certainty?",
    "Is there a chance you might be sure but just don't know it?",
    "How sure are you that you're not sure?",
    "Wait... are you now unsure about being unsure?"
  ];

  // Initialize auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsGuest(!session?.user);
      if (session?.user) {
        loadUserProgress(session.user.id);
      } else {
        loadGuestProgress();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsGuest(!session?.user);
      if (session?.user) {
        loadUserProgress(session.user.id);
      }
    });

    // Load customization settings
    loadCustomizationSettings();

    return () => subscription.unsubscribe();
  }, []);

  const loadGuestProgress = () => {
    const saved = localStorage.getItem('areYouSureProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCurrentPath(progress.currentPath || 'initial');
      setMessageIndex(progress.messageIndex || 0);
      setUncertaintyLevel(progress.uncertaintyLevel || 0);
      setYesCount(progress.yesCount || 0);
      setNoCount(progress.noCount || 0);
      setTotalClicks(progress.totalClicks || 0);
      setAlternatingPattern(progress.alternatingPattern || 0);
      setLastChoice(progress.lastChoice || null);
      setHackClickCount(progress.hackClickCount || 0);
      
      const savedAchievements = progress.achievements || [];
      setAchievements(ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: savedAchievements.includes(a.id)
      })));
    }
  };

  const loadCustomizationSettings = () => {
    const saved = localStorage.getItem('customizationSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      const theme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];
      setCurrentTheme(theme);
      
      if (settings.wallpaper) {
        setCurrentWallpaper(settings.wallpaper);
      }
      
      if (settings.customWallpaperUrl) {
        setCustomWallpaperUrl(settings.customWallpaperUrl);
      }
    }
  };

  const saveCustomizationSettings = () => {
    const settings = {
      themeId: currentTheme.id,
      wallpaper: currentWallpaper,
      customWallpaperUrl
    };
    localStorage.setItem('customizationSettings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveCustomizationSettings();
  }, [currentTheme, currentWallpaper, customWallpaperUrl]);

  const loadUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading progress:', error);
        return;
      }

      if (data) {
        setCurrentPath(data.current_path);
        setMessageIndex(data.message_index);
        setUncertaintyLevel(data.uncertainty_level);
        setYesCount(data.yes_count);
        setNoCount(data.no_count);
        setTotalClicks(data.yes_count + data.no_count);
        
        setAchievements(ACHIEVEMENTS.map(a => ({
          ...a,
          unlocked: data.achievements.includes(a.id)
        })));
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const saveProgress = async () => {
    const progressData = {
      currentPath,
      messageIndex,
      uncertaintyLevel,
      yesCount,
      noCount,
      totalClicks,
      alternatingPattern,
      lastChoice,
      hackClickCount,
      achievements: achievements.filter(a => a.unlocked).map(a => a.id)
    };

    if (isGuest) {
      localStorage.setItem('areYouSureProgress', JSON.stringify(progressData));
    } else if (user) {
      try {
        const userProgress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          uncertainty_level: uncertaintyLevel,
          yes_count: yesCount,
          no_count: noCount,
          achievements: achievements.filter(a => a.unlocked).map(a => a.id),
          current_path: currentPath,
          message_index: messageIndex,
          hack_click_count: hackClickCount
        };

        const { error } = await supabase
          .from('user_progress')
          .upsert(userProgress);

        if (error) {
          console.error('Error saving progress:', error);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  useEffect(() => {
    saveProgress();
  }, [currentPath, messageIndex, uncertaintyLevel, yesCount, noCount, totalClicks, alternatingPattern, lastChoice, hackClickCount, achievements]);

  const checkAchievements = (stats: UserStats) => {
    const newUnlocked: Achievement[] = [];
    
    setAchievements(prev => prev.map(achievement => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        newUnlocked.push(achievement);
        return { ...achievement, unlocked: true };
      }
      return achievement;
    }));

    if (newUnlocked.length > 0) {
      setNewAchievement(newUnlocked[0]);
    }
  };

  const getCurrentMessage = () => {
    if (currentPath === 'initial') {
      return "Are you sure?";
    } else if (currentPath === 'yes') {
      return yesQuestions[messageIndex % yesQuestions.length];
    } else {
      return noQuestions[messageIndex % noQuestions.length];
    }
  };

  const animateTransition = (callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const handleYes = () => {
    // Trigger screen flicker immediately
    setTriggerFlicker(true);
    
    // Increment hack click count
    const newHackClickCount = hackClickCount + 1;
    setHackClickCount(newHackClickCount);
    
    // Check if we should show hack popup (every 10 clicks)
    if (newHackClickCount % 10 === 0) {
      // Show hack popup after flicker completes (3 seconds)
      setTimeout(() => {
        setShowHackPopup(true);
      }, 3000);
    }
    
    animateTransition(() => {
      const newYesCount = yesCount + 1;
      const newTotalClicks = totalClicks + 1;
      const newUncertaintyLevel = Math.floor(newTotalClicks / 2) + 1;
      
      // Check for alternating pattern
      let newAlternatingPattern = alternatingPattern;
      if (lastChoice === 'no') {
        newAlternatingPattern += 1;
      } else if (lastChoice === 'yes') {
        newAlternatingPattern = 0;
      }

      setYesCount(newYesCount);
      setTotalClicks(newTotalClicks);
      setUncertaintyLevel(newUncertaintyLevel);
      setAlternatingPattern(newAlternatingPattern);
      setLastChoice('yes');

      if (currentPath === 'initial') {
        setCurrentPath('yes');
        setMessageIndex(0);
      } else {
        setMessageIndex(prev => prev + 1);
      }

      // Check achievements
      const stats: UserStats = {
        uncertaintyLevel: newUncertaintyLevel,
        yesCount: newYesCount,
        noCount,
        totalClicks: newTotalClicks,
        currentStreak: currentPath === 'yes' ? messageIndex + 1 : 1,
        maxStreak: Math.max(messageIndex + 1, 0),
        alternatingPattern: newAlternatingPattern,
        currentPath: currentPath === 'initial' ? 'yes' : currentPath,
        messageIndex: currentPath === 'initial' ? 0 : messageIndex + 1
      };
      
      checkAchievements(stats);
    });
  };

  const handleNo = () => {
    // Trigger screen flicker immediately
    setTriggerFlicker(true);
    
    // Increment hack click count
    const newHackClickCount = hackClickCount + 1;
    setHackClickCount(newHackClickCount);
    
    // Check if we should show hack popup (every 10 clicks)
    if (newHackClickCount % 10 === 0) {
      // Show hack popup after flicker completes (3 seconds)
      setTimeout(() => {
        setShowHackPopup(true);
      }, 3000);
    }
    
    animateTransition(() => {
      const newNoCount = noCount + 1;
      const newTotalClicks = totalClicks + 1;
      const newUncertaintyLevel = Math.floor(newTotalClicks / 2) + 1;
      
      // Check for alternating pattern
      let newAlternatingPattern = alternatingPattern;
      if (lastChoice === 'yes') {
        newAlternatingPattern += 1;
      } else if (lastChoice === 'no') {
        newAlternatingPattern = 0;
      }

      setNoCount(newNoCount);
      setTotalClicks(newTotalClicks);
      setUncertaintyLevel(newUncertaintyLevel);
      setAlternatingPattern(newAlternatingPattern);
      setLastChoice('no');

      if (currentPath === 'initial') {
        setCurrentPath('no');
        setMessageIndex(0);
      } else {
        setMessageIndex(prev => prev + 1);
      }

      // Check achievements
      const stats: UserStats = {
        uncertaintyLevel: newUncertaintyLevel,
        yesCount,
        noCount: newNoCount,
        totalClicks: newTotalClicks,
        currentStreak: currentPath === 'no' ? messageIndex + 1 : 1,
        maxStreak: Math.max(messageIndex + 1, 0),
        alternatingPattern: newAlternatingPattern,
        currentPath: currentPath === 'initial' ? 'no' : currentPath,
        messageIndex: currentPath === 'initial' ? 0 : messageIndex + 1
      };
      
      checkAchievements(stats);
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Reset to guest mode but keep current progress
    setIsGuest(true);
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const handleWallpaperChange = (wallpaper: Wallpaper | null) => {
    setCurrentWallpaper(wallpaper);
    if (!wallpaper) {
      setCustomWallpaperUrl(null);
    }
  };

  const handleCustomWallpaper = (file: File) => {
    const url = URL.createObjectURL(file);
    setCustomWallpaperUrl(url);
    const customWallpaper: Wallpaper = {
      id: 'custom-file',
      name: 'Custom Upload',
      type: 'image',
      url,
      preview: url
    };
    setCurrentWallpaper(customWallpaper);
  };

  const getBackgroundStyle = () => {
    if (currentWallpaper) {
      if (currentWallpaper.type === 'gradient') {
        return { background: currentWallpaper.gradient || currentWallpaper.preview };
      } else {
        return {
          backgroundImage: `url(${currentWallpaper.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
    }
    return {};
  };

  return (
    <div 
      className={`min-h-screen ${currentWallpaper ? '' : currentTheme.gradient} flex items-center justify-center p-4 relative`}
      style={getBackgroundStyle()}
    >
      {/* Overlay for better readability when using wallpapers */}
      {currentWallpaper && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      )}
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 w-full p-4 flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 hover:bg-white transition-all duration-200 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-gray-800">Achievements</span>
          </button>

          <button
            onClick={() => setShowCustomization(true)}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 hover:bg-white transition-all duration-200 flex items-center gap-2"
          >
            <Palette className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-800">Customize</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isGuest ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 hover:bg-white transition-all duration-200 flex items-center gap-2"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-800">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 hover:bg-white transition-all duration-200"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Panel */}
      {showAchievements && (
        <div className="fixed top-20 left-4 z-45">
          <AchievementPanel
            achievements={achievements}
            uncertaintyLevel={uncertaintyLevel}
            totalClicks={totalClicks}
            yesCount={yesCount}
            noCount={noCount}
          />
        </div>
      )}

      {/* Main Dialog */}
      <div className={`${currentTheme.cardBg} backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto border border-white/20 relative z-10`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤔
          </h1>
          
          <div 
            className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          >
            <p className={`text-2xl md:text-3xl font-bold ${currentTheme.textColor} mb-8 leading-tight min-h-[120px] flex items-center justify-center`}>
              {getCurrentMessage()}
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleYes}
                disabled={isAnimating}
                className={`${currentTheme.buttonColors.yes} disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xl`}
              >
                Yes
              </button>
              
              <button
                onClick={handleNo}
                disabled={isAnimating}
                className={`${currentTheme.buttonColors.no} disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xl`}
              >
                No
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${currentTheme.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
              {currentPath === 'initial' && "Choose wisely... or don't 😈"}
              {currentPath === 'yes' && `Certainty level: ${Math.floor(messageIndex / 3) + 1} 📈`}
              {currentPath === 'no' && `Uncertainty level: ${Math.floor(messageIndex / 3) + 1} 🌪️`}
            </p>
            {isGuest && totalClicks > 5 && (
              <p className="text-xs text-purple-600 mt-2 font-medium">
                💾 Sign in to save your progress!
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 text-white/90 text-sm font-medium z-10 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 m-4">
        <p>There is no escape... 👻</p>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsGuest(false);
          setShowAuthModal(false);
        }}
      />

      <CustomizationPanel
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        currentTheme={currentTheme}
        currentWallpaper={currentWallpaper}
        onThemeChange={handleThemeChange}
        onWallpaperChange={handleWallpaperChange}
        onCustomWallpaper={handleCustomWallpaper}
      />

      <AchievementPopup
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      <ScreenFlicker
        isActive={triggerFlicker}
        onComplete={() => setTriggerFlicker(false)}
      />
    </div>
  );
}

export default App;