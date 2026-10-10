import { AlarmItem, TimerItem, UserSettings, WorldCity } from '../types';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  is24Hour: false,
  showSeconds: true,
  showDate: true,
  clockStyle: 'digital',
  soundEnabled: true,
  soundVolume: 85,
  selectedTone: 'chime',
  defaultTimerMinutes: 5,
  notificationsEnabled: false,
};

export const INITIAL_WORLD_CITIES: WorldCity[] = [
  { id: '1', city: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { id: '2', city: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { id: '3', city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { id: '4', city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { id: '5', city: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { id: '6', city: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
];

export const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: 'default-alarm-1',
    label: 'Morning Focus',
    time: '07:30',
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    isEnabled: true,
    soundTone: 'chime',
    snoozeCount: 0,
  },
  {
    id: 'default-alarm-2',
    label: 'Afternoon Break',
    time: '15:00',
    daysOfWeek: [], // Once
    isEnabled: false,
    soundTone: 'pulse',
    snoozeCount: 0,
  },
];

const SETTINGS_KEY = 'darkclock_settings_v1';
const ALARMS_KEY = 'darkclock_alarms_v1';
const TIMERS_KEY = 'darkclock_timers_v1';
const CITIES_KEY = 'darkclock_cities_v1';

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadAlarms(): AlarmItem[] {
  try {
    const raw = localStorage.getItem(ALARMS_KEY);
    if (!raw) return INITIAL_ALARMS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALARMS;
  }
}

export function saveAlarms(alarms: AlarmItem[]): void {
  try {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
  } catch (e) {
    console.error('Failed to save alarms:', e);
  }
}

export function loadTimers(): TimerItem[] {
  try {
    const raw = localStorage.getItem(TIMERS_KEY);
    if (!raw) {
      return [
        {
          id: 'timer-primary',
          label: 'Focus Session',
          totalSeconds: 300,
          remainingSeconds: 300,
          isRunning: false,
          isPaused: false,
          targetEndTimeMs: null,
          isFinished: false,
        },
      ];
    }
    const list: TimerItem[] = JSON.parse(raw);
    // When rehydrating, pause active timers if end timestamp has passed or adjust remaining
    const now = Date.now();
    return list.map((t) => {
      if (t.isRunning && t.targetEndTimeMs) {
        const remaining = Math.max(0, Math.round((t.targetEndTimeMs - now) / 1000));
        return {
          ...t,
          remainingSeconds: remaining,
          isRunning: remaining > 0,
          isFinished: remaining <= 0,
        };
      }
      return t;
    });
  } catch {
    return [
      {
        id: 'timer-primary',
        label: 'Focus Session',
        totalSeconds: 300,
        remainingSeconds: 300,
        isRunning: false,
        isPaused: false,
        targetEndTimeMs: null,
        isFinished: false,
      },
    ];
  }
}

export function saveTimers(timers: TimerItem[]): void {
  try {
    localStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
  } catch (e) {
    console.error('Failed to save timers:', e);
  }
}

export function loadWorldCities(): WorldCity[] {
  try {
    const raw = localStorage.getItem(CITIES_KEY);
    if (!raw) return INITIAL_WORLD_CITIES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_WORLD_CITIES;
  }
}

export function saveWorldCities(cities: WorldCity[]): void {
  try {
    localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
  } catch (e) {
    console.error('Failed to save world cities:', e);
  }
}
