import React, { useState } from 'react';
import { Palette, Image, Download, Upload, X, Check, Sparkles, Monitor } from 'lucide-react';
import { Theme, Wallpaper, THEMES, WALLPAPERS } from '../types/customization';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  currentWallpaper: Wallpaper | null;
  onThemeChange: (theme: Theme) => void;
  onWallpaperChange: (wallpaper: Wallpaper | null) => void;
  onCustomWallpaper: (file: File) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentWallpaper,
  onThemeChange,
  onWallpaperChange,
  onCustomWallpaper
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'wallpapers'>('themes');
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCustomWallpaper(file);
    }
  };

  const handleCustomUrl = () => {
    if (customImageUrl.trim()) {
      const customWallpaper: Wallpaper = {
        id: 'custom-' + Date.now(),
        name: 'Custom Image',
        type: 'image',
        url: customImageUrl.trim(),
        preview: customImageUrl.trim()
      };
      onWallpaperChange(customWallpaper);
      setCustomImageUrl('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Customize Your Experience</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'themes'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Palette size={20} />
            Themes
          </button>
          <button
            onClick={() => setActiveTab('wallpapers')}
            className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'wallpapers'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Image size={20} />
            Wallpapers
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'themes' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose a Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => onThemeChange(theme)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                      currentTheme.id === theme.id ? 'ring-4 ring-purple-500' : 'hover:shadow-lg'
                    }`}
                  >
                    <div className={`h-32 ${theme.gradient} relative`}>
                      <div className={`absolute inset-4 ${theme.cardBg} rounded-lg flex items-center justify-center`}>
                        <div className={`text-center ${theme.textColor}`}>
                          <div className="text-2xl mb-1">🤔</div>
                          <div className="text-sm font-medium">Preview</div>
                        </div>
                      </div>
                      {currentTheme.id === theme.id && (
                        <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <h4 className="font-medium text-gray-800">{theme.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wallpapers' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose a Wallpaper</h3>
              
              {/* Custom Upload Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Upload size={18} />
                  Add Custom Wallpaper
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter image URL..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleCustomUrl}
                      disabled={!customImageUrl.trim()}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="text-center">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg cursor-pointer transition-colors">
                      <Monitor size={18} />
                      Upload from Device
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Wallpaper Option */}
              <div className="mb-4">
                <button
                  onClick={() => onWallpaperChange(null)}
                  className={`w-full p-4 border-2 border-dashed rounded-xl transition-all ${
                    !currentWallpaper
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="font-medium">Use Theme Background Only</div>
                    <div className="text-sm opacity-75">No wallpaper overlay</div>
                  </div>
                </button>
              </div>

              {/* Wallpaper Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WALLPAPERS.map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    onClick={() => onWallpaperChange(wallpaper)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                      currentWallpaper?.id === wallpaper.id ? 'ring-4 ring-purple-500' : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="h-32 relative">
                      {wallpaper.type === 'gradient' ? (
                        <div className={wallpaper.gradient} style={{ background: wallpaper.preview }} />
                      ) : (
                        <img
                          src={wallpaper.preview}
                          alt={wallpaper.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {currentWallpaper?.id === wallpaper.id && (
                        <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <h4 className="font-medium text-gray-800">{wallpaper.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{wallpaper.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Customize your experience with themes and wallpapers
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};