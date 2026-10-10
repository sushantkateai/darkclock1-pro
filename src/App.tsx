import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserSettings, TimerItem, AlarmItem, WorldCity } from './types';
import { 
  loadSettings, 
  saveSettings, 
  loadAlarms, 
  saveAlarms, 
  loadTimers, 
  saveTimers, 
  loadWorldCities, 
  saveWorldCities,
  DEFAULT_SETTINGS
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ClockView } from './components/ClockView';
import { TimerView } from './components/TimerView';
import { StopwatchView } from './components/StopwatchView';
import { AlarmView } from './components/AlarmView';
import { WorldClockView } from './components/WorldClockView';
import { SettingsView } from './components/SettingsView';
import { StaticPages } from './components/StaticPages';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AlarmTriggerModal } from './components/AlarmTriggerModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [timers, setTimers] = useState<TimerItem[]>(loadTimers);
  const [alarms, setAlarms] = useState<AlarmItem[]>(loadAlarms);
  const [worldCities, setWorldCities] = useState<WorldCity[]>(loadWorldCities);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [activeAlarmModal, setActiveAlarmModal] = useState<AlarmItem | null>(null);

  // Sync theme class to document body
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.remove('bg-[#050505]', 'text-[#FAFAFA]');
      document.body.classList.add('bg-[#F4F5F7]', 'text-[#121214]');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('bg-[#F4F5F7]', 'text-[#121214]');
      document.body.classList.add('bg-[#050505]', 'text-[#FAFAFA]');
    }
  }, [settings.theme]);

  // Persist settings changes
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      saveSettings(merged);
      return merged;
    });
  }, []);

  // Persist timers
  const updateTimers = useCallback((newTimers: TimerItem[]) => {
    setTimers(newTimers);
    saveTimers(newTimers);
  }, []);

  // Persist alarms
  const updateAlarms = useCallback((newAlarms: AlarmItem[]) => {
    setAlarms(newAlarms);
    saveAlarms(newAlarms);
  }, []);

  // Persist world cities
  const updateWorldCities = useCallback((newCities: WorldCity[]) => {
    setWorldCities(newCities);
    saveWorldCities(newCities);
  }, []);

  // Toggle Fullscreen via standard browser Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback to internal fullscreen styling if browser blocks API
        setIsFullscreen(!isFullscreen);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // Listen to fullscreen changes from browser (e.g. Esc press)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Global Keyboard Shortcuts (1-5 for views, F for fullscreen, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'Digit1') {
        setCurrentView('clock');
      } else if (e.code === 'Digit2') {
        setCurrentView('timer');
      } else if (e.code === 'Digit3') {
        setCurrentView('stopwatch');
      } else if (e.code === 'Digit4') {
        setCurrentView('alarm');
      } else if (e.code === 'Digit5') {
        setCurrentView('world');
      } else if (e.code === 'Escape') {
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (activeAlarmModal) setActiveAlarmModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcutsModal, activeAlarmModal, isFullscreen]);

  // Handle Alarm Snooze
  const handleSnoozeAlarm = (minutes: number) => {
    if (!activeAlarmModal) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const snoozedAlarm: AlarmItem = {
      ...activeAlarmModal,
      id: `snooze-${Date.now()}`,
      label: `${activeAlarmModal.label} (Snoozed)`,
      time: snoozeTime,
      daysOfWeek: [], // One-off trigger
      isEnabled: true,
      snoozeCount: (activeAlarmModal.snoozeCount || 0) + 1,
    };

    updateAlarms([...alarms, snoozedAlarm]);
    setActiveAlarmModal(null);
  };

  const handleSelectClockTimezone = (tz: string) => {
    setSelectedTimezone(tz);
    setCurrentView('clock');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#FAFAFA] transition-colors selection:bg-[#4388FF]/30 selection:text-white">
      {/* Top Navigation */}
      {!isFullscreen && (
        <Navbar
          currentView={currentView}
          onNavigate={setCurrentView}
          settings={settings}
          onUpdateSettings={updateSettings}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        {currentView === 'home' && (
          <HomeView
            settings={settings}
            onUpdateSettings={updateSettings}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onNavigate={setCurrentView}
            selectedTimezone={selectedTimezone}
            onTimezoneChange={setSelectedTimezone}
            activeTimersCount={timers.filter((t) => t.isRunning).length}
            activeAlarmsCount={alarms.filter((a) => a.isEnabled).length}
          />
        )}

        {currentView === 'clock' && (
          <div className="w-full flex flex-col items-center">
            <ClockView
              settings={settings}
              onUpdateSettings={updateSettings}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              selectedTimezone={selectedTimezone}
              onTimezoneChange={setSelectedTimezone}
            />
          </div>
        )}

        {currentView === 'timer' && (
          <div className="w-full flex flex-col items-center">
            <TimerView
              settings={settings}
              timers={timers}
              onUpdateTimers={updateTimers}
              onOpenSettings={() => setCurrentView('settings')}
            />
          </div>
        )}

        {currentView === 'stopwatch' && (
          <div className="w-full flex flex-col items-center">
            <StopwatchView settings={settings} />
          </div>
        )}

        {currentView === 'alarm' && (
          <div className="w-full flex flex-col items-center">
            <AlarmView
              settings={settings}
              alarms={alarms}
              onUpdateAlarms={updateAlarms}
              onTriggerAlarmModal={setActiveAlarmModal}
            />
          </div>
        )}

        {currentView === 'world' && (
          <div className="w-full flex flex-col items-center">
            <WorldClockView
              settings={settings}
              cities={worldCities}
              onUpdateCities={updateWorldCities}
              onSelectClockTimezone={handleSelectClockTimezone}
            />
          </div>
        )}

        {currentView === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={updateSettings}
            onOpenShortcuts={() => setShowShortcutsModal(true)}
          />
        )}

        {(currentView === 'about' ||
          currentView === 'privacy' ||
          currentView === 'terms' ||
          currentView === 'contact' ||
          currentView === 'guide') && (
          <StaticPages
            view={currentView}
            onNavigate={setCurrentView}
            settings={settings}
          />
        )}
      </main>

      {/* Footer */}
      {!isFullscreen && (
        <Footer
          onNavigate={setCurrentView}
          onOpenShortcuts={() => setShowShortcutsModal(true)}
        />
      )}

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Active Alarm Trigger Modal */}
      <AlarmTriggerModal
        alarm={activeAlarmModal}
        onDismiss={() => setActiveAlarmModal(null)}
        onSnooze={handleSnoozeAlarm}
      />
    </div>
  );
}
