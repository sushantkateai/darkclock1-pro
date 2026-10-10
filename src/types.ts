export type AppView = 
  | 'home'
  | 'clock'
  | 'timer'
  | 'stopwatch'
  | 'alarm'
  | 'world'
  | 'settings'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'guide';

export type ClockStyle = 'digital' | 'minimal' | 'flip';

export type SoundTone = 'beep' | 'bell' | 'chime' | 'pulse' | 'marimba';

export interface UserSettings {
  theme: 'dark' | 'light';
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  clockStyle: ClockStyle;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 100
  selectedTone: SoundTone;
  defaultTimerMinutes: number;
  notificationsEnabled: boolean;
}

export interface TimerItem {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  targetEndTimeMs: number | null; // For background tab accuracy
  isFinished: boolean;
}

export interface LapItem {
  lapNumber: number;
  lapTimeMs: number;
  totalTimeMs: number;
}

export interface AlarmItem {
  id: string;
  label: string;
  time: string; // "HH:MM" 24h internal format
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat, empty = once
  isEnabled: boolean;
  soundTone: SoundTone;
  snoozeCount: number;
}

export interface WorldCity {
  id: string;
  city: string;
  country: string;
  timeZone: string;
  isUserAdded?: boolean;
}
