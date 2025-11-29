import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ModelOption } from '../types';

interface HeaderProps {
  currentModel: ModelOption;
  onOpenModelMenu: () => void;
  onNewChat: () => void;
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentModel, 
  onOpenModelMenu, 
  onNewChat, 
  onOpenSidebar,
  onOpenSettings,
  isDarkMode,
  onToggleTheme
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSettingsClick = () => {
    setIsSpinning(true);
    // Hentikan animasi setelah 500ms (sesuai durasi transition)
    setTimeout(() => {
      setIsSpinning(false);
    }, 500);
    onOpenSettings();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 z-40 flex items-center justify-between px-4 transition-colors duration-300 border-b border-transparent dark:border-gray-800">
      {/* Left: Hamburger & Settings */}
      <div className="flex items-center gap-1">
        <button 
          onClick={onOpenSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Menu"
        >
          <img 
            src="https://img.icons8.com/?size=100&id=MvxC6uE6rES2&format=png&color=000000" 
            alt="Menu" 
            className="w-7 h-7 opacity-70 dark:invert transition-all"
          />
        </button>

        <button 
          onClick={handleSettingsClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Pengaturan"
        >
          <img 
            src="https://img.icons8.com/?size=100&id=S6mp3couBHct&format=png&color=000000" 
            alt="Pengaturan" 
            className={`w-7 h-7 opacity-70 dark:invert transition-transform duration-500 ease-in-out ${isSpinning ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Center: Model Selector */}
      <button 
        onClick={onOpenModelMenu}
        className="flex flex-col items-center justify-center -space-y-0.5 px-4 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide uppercase">Model</span>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{currentModel.name}</span>
          <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
        </div>
      </button>

      {/* Right: Theme Toggle & New Chat */}
      <div className="flex items-center gap-1">
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
        >
          <div className="relative w-7 h-7">
            {/* Moon Icon (Shows in Light Mode) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
               <img 
                src="https://img.icons8.com/?size=100&id=bv1XgSVyIgCb&format=png&color=000000" 
                alt="Mode Gelap" 
                className="w-7 h-7 dark:invert opacity-80" 
              />
            </div>
            {/* Sun Icon (Shows in Dark Mode) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
              <img 
                src="https://img.icons8.com/?size=100&id=q4yXFoEnYRH7&format=png&color=000000" 
                alt="Mode Terang" 
                className="w-7 h-7 dark:invert" 
              />
            </div>
          </div>
        </button>

        <button 
          onClick={onNewChat}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Percakapan Baru"
        >
          <img 
            src="https://img.icons8.com/?size=100&id=G5iEupbhz1WS&format=png&color=000000" 
            alt="Chat Baru" 
            className="w-7 h-7 dark:invert transition-all opacity-80 hover:opacity-100" 
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
