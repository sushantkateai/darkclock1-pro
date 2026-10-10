import React, { useState } from 'react';
import { UserSettings, ClockStyle, SoundTone } from '../types';
import { playAlertSound } from '../utils/audio';
import { DEFAULT_SETTINGS } from '../utils/storage';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Bell, 
  Sun, 
  Moon, 
  Keyboard, 
  Check, 
  Play
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenShortcuts: () => void;
}

const TONES: { id: SoundTone; label: string }[] = [
  { id: 'chime', label: 'Ascending Chime (Soothing)' },
  { id: 'beep', label: 'Digital Beep (High Tech)' },
  { id: 'bell', label: 'Acoustic Bell (Classic)' },
  { id: 'pulse', label: 'Electro Pulse (Modern)' },
  { id: 'marimba', label: 'Wooden Marimba (Natural)' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onOpenShortcuts,
}) => {
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      onUpdateSettings({ notificationsEnabled: res === 'granted' });
      triggerToast();
    }
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTestSound = () => {
    playAlertSound(settings.selectedTone, settings.soundVolume);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all DarkClock Pro preferences to factory defaults?')) {
      onUpdateSettings(DEFAULT_SETTINGS);
      triggerToast();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-[#4388FF]" />
            <span>Preferences & Configuration</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Customize clock styles, synthesized audio, and system behaviors.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50 text-emerald-400 text-xs font-medium animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Appearance & Display */}
        <section className="bg-[#111111] border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#4388FF]" />
            <span>Appearance & Display</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
              <div>
                <span className="text-sm font-medium text-white block">Theme Mode</span>
                <span className="text-xs text-neutral-400">Pure black is the signature theme</span>
              </div>
              <div className="flex items-center bg-[#171717] rounded-lg p-1 border border-neutral-800">
                <button
                  onClick={() => onUpdateSettings({ theme: 'dark' })}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    settings.theme === 'dark' ? 'bg-[#4388FF] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => onUpdateSettings({ theme: 'light' })}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    settings.theme === 'light' ? 'bg-[#4388FF] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
              <div>
                <span className="text-sm font-medium text-white block">Time Format</span>
                <span className="text-xs text-neutral-400">12-hour AM/PM or 24-hour military</span>
              </div>
              <div className="flex items-center bg-[#171717] rounded-lg p-1 border border-neutral-800">
                <button
                  onClick={() => onUpdateSettings({ is24Hour: false })}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    !settings.is24Hour ? 'bg-[#4388FF] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  12H
                </button>
                <button
                  onClick={() => onUpdateSettings({ is24Hour: true })}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    settings.is24Hour ? 'bg-[#4388FF] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  24H
                </button>
              </div>
            </div>

            {/* Default Clock Style */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
              <div>
                <span className="text-sm font-medium text-white block">Clock Style</span>
                <span className="text-xs text-neutral-400">Default visual presentation</span>
              </div>
              <select
                value={settings.clockStyle}
                onChange={(e) => onUpdateSettings({ clockStyle: e.target.value as ClockStyle })}
                className="px-3 py-1.5 rounded-lg bg-[#171717] border border-neutral-800 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="digital">Digital LED</option>
                <option value="minimal">Minimal Modern</option>
                <option value="flip">Retro Flip Card</option>
              </select>
            </div>

            {/* Show Seconds & Date */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
              <div>
                <span className="text-sm font-medium text-white block">Display Seconds & Date</span>
                <span className="text-xs text-neutral-400">Toggle live elements</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateSettings({ showSeconds: !settings.showSeconds })}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium border cursor-pointer ${
                    settings.showSeconds
                      ? 'bg-[#4388FF]/15 text-[#4388FF] border-[#4388FF]/40'
                      : 'bg-[#171717] text-neutral-400 border-neutral-800'
                  }`}
                >
                  Sec: {settings.showSeconds ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => onUpdateSettings({ showDate: !settings.showDate })}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium border cursor-pointer ${
                    settings.showDate
                      ? 'bg-[#4388FF]/15 text-[#4388FF] border-[#4388FF]/40'
                      : 'bg-[#171717] text-neutral-400 border-neutral-800'
                  }`}
                >
                  Date: {settings.showDate ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Audio & Synthesized Notifications */}
        <section className="bg-[#111111] border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#4388FF]" />
            <span>Audio & Web Alerts</span>
          </h2>

          <div className="space-y-4">
            {/* Master Sound Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#4388FF]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-neutral-500" />
                )}
                <div>
                  <span className="text-sm font-medium text-white block">Master Sound Effects</span>
                  <span className="text-xs text-neutral-400">Web Audio API tones for timers and alarms</span>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                  settings.soundEnabled ? 'bg-[#4388FF]' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider & Tone selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-300 font-medium">Alert Volume</span>
                  <span className="text-xs font-mono text-[#4388FF]">{settings.soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.soundVolume}
                  onChange={(e) => onUpdateSettings({ soundVolume: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#4388FF] cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <span className="text-xs text-neutral-300 font-medium block">Default Tone</span>
                  <select
                    value={settings.selectedTone}
                    onChange={(e) => onUpdateSettings({ selectedTone: e.target.value as SoundTone })}
                    className="w-full mt-1 px-2.5 py-1 rounded bg-[#171717] border border-neutral-800 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#111111]">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleTestSound}
                  className="mt-4 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#222222] border border-neutral-800 text-xs text-[#4388FF] font-medium transition-colors cursor-pointer shrink-0"
                  title="Test Sound Tone"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Tone</span>
                </button>
              </div>
            </div>

            {/* Browser Notifications Request */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-neutral-850">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#4388FF]" />
                <div>
                  <span className="text-sm font-medium text-white block">System Push Notifications</span>
                  <span className="text-xs text-neutral-400">
                    Status: <strong className="text-neutral-300 capitalize">{notificationPermission}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#222222] border border-neutral-800 text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                {notificationPermission === 'granted' ? 'Permission Granted' : 'Request Permission'}
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Keyboard Shortcuts & Reset */}
        <section className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-[#4388FF]" />
            <div>
              <span className="text-sm font-medium text-white block">Keyboard Hotkeys</span>
              <span className="text-xs text-neutral-400">Control timer and stopwatch without clicking</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenShortcuts}
              className="px-4 py-2 rounded-lg bg-[#171717] hover:bg-[#222222] border border-neutral-800 text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
            >
              View Shortcuts (Cheat Sheet)
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-lg bg-[#171717] hover:bg-red-950/40 border border-neutral-800 hover:border-red-800 text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Reset All Defaults
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

