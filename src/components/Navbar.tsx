import React, { useState } from 'react';
import { AppView, UserSettings } from '../types';
import { 
  Clock, 
  Hourglass, 
  Timer as StopwatchIcon, 
  Bell, 
  Globe2, 
  Settings as SettingsIcon, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Menu, 
  X 
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  settings,
  onUpdateSettings,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: AppView; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Clock', view: 'clock', icon: Clock },
    { label: 'Timer', view: 'timer', icon: Hourglass },
    { label: 'Stopwatch', view: 'stopwatch', icon: StopwatchIcon },
    { label: 'Alarm', view: 'alarm', icon: Bell },
    { label: 'World Clock', view: 'world', icon: Globe2 },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#050505]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#111111] border border-neutral-800 flex items-center justify-center text-[#4388FF] group-hover:border-[#4388FF]/50 transition-colors">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors whitespace-nowrap">
              DarkClock
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#4388FF]/15 text-[#4388FF] border border-[#4388FF]/30 tracking-wider uppercase">
              Pro
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(({ label, view, icon: Icon }) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => handleNavClick(view)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#171717] text-white border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#4388FF]' : 'text-neutral-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="w-9 h-9 rounded-lg bg-[#111111] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            aria-label="Toggle fullscreen display"
            className="hidden sm:flex w-9 h-9 rounded-lg bg-[#111111] border border-neutral-800 items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Desk Fullscreen Mode (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => handleNavClick('settings')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'settings'
                ? 'bg-[#4388FF] text-white border-[#4388FF]'
                : 'bg-[#111111] text-white border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-[#111111] border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#0A0A0A] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(({ label, view, icon: Icon }) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => handleNavClick(view)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#171717] text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#4388FF]' : 'text-neutral-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 px-3">
            <span>Theme: {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            <button
              onClick={onToggleFullscreen}
              className="flex items-center gap-1 text-[#4388FF] hover:underline"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
