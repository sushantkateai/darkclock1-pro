import React, { useState, useEffect } from 'react';
import { UserSettings, ClockStyle } from '../types';
import { 
  Maximize2, 
  Minimize2, 
  Calendar, 
  Globe, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Clock as ClockIcon, 
  Sliders
} from 'lucide-react';

interface ClockViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  selectedTimezone?: string;
  onTimezoneChange?: (tz: string) => void;
}

export const COMMON_TIMEZONES = [
  { label: 'Local Device Time', value: '' },
  { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
  { label: 'New York (EST/EDT)', value: 'America/New_York' },
  { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
  { label: 'Chicago (CST/CDT)', value: 'America/Chicago' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris / Berlin (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Singapore / Hong Kong (SGT)', value: 'Asia/Singapore' },
  { label: 'Sydney / Melbourne (AEST/AEDT)', value: 'Australia/Sydney' },
  { label: 'Auckland (NZST/NZDT)', value: 'Pacific/Auckland' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'Mumbai (IST)', value: 'Asia/Kolkata' },
];

export const ClockView: React.FC<ClockViewProps> = ({
  settings,
  onUpdateSettings,
  isFullscreen,
  onToggleFullscreen,
  selectedTimezone = '',
  onTimezoneChange,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [activeTz, setActiveTz] = useState<string>(selectedTimezone);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Sync internal tz with prop
  useEffect(() => {
    setActiveTz(selectedTimezone);
  }, [selectedTimezone]);

  // Accurate real-time clock update (every 100ms to stay crisp with system clock)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleTzChange = (tz: string) => {
    setActiveTz(tz);
    if (onTimezoneChange) onTimezoneChange(tz);
  };

  // Time calculations based on active timezone
  const tzOptions: Intl.DateTimeFormatOptions = activeTz ? { timeZone: activeTz } : {};

  // Formatted parts
  const formatHourMinSec = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      ...tzOptions,
      hour12: !settings.is24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const parts = formatter.formatToParts(now);
    const hour = parts.find((p) => p.type === 'hour')?.value || '00';
    const minute = parts.find((p) => p.type === 'minute')?.value || '00';
    const second = parts.find((p) => p.type === 'second')?.value || '00';
    const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || '';
    return { hour, minute, second, dayPeriod };
  };

  const { hour, minute, second, dayPeriod } = formatHourMinSec();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    ...tzOptions,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const secondsNumeric = parseInt(second, 10);
  const secondsProgress = (secondsNumeric / 60) * 100;

  // Single flip digit card component
  const FlipCard: React.FC<{ value: string; label?: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative bg-[#111111] border border-neutral-800 rounded-xl px-4 py-3 sm:px-8 sm:py-6 md:px-10 md:py-8 shadow-2xl flip-card-split overflow-hidden group">
        <div className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-mono-numbers text-white tracking-wider flex items-center justify-center">
          {value}
        </div>
        {/* Subtle highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      </div>
      {label && (
        <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest mt-2 font-mono">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#050505] p-6 sm:p-12 overflow-hidden'
          : 'py-8 px-4 sm:px-6'
      }`}
    >
      {/* Top Floating Controls Bar */}
      <div
        className={`w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-8 transition-opacity duration-300 ${
          isFullscreen && !showControls ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
      >
        {/* Timezone Dropdown */}
        <div className="flex items-center gap-2 bg-[#111111] border border-neutral-800 rounded-lg px-3 py-1.5">
          <Globe className="w-4 h-4 text-[#4388FF] shrink-0" />
          <select
            value={activeTz}
            onChange={(e) => handleTzChange(e.target.value)}
            className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer"
            aria-label="Select Timezone"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-[#111111] text-white">
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Style selector */}
          <div className="flex items-center bg-[#111111] border border-neutral-800 rounded-lg p-0.5">
            {(['digital', 'minimal', 'flip'] as ClockStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => onUpdateSettings({ clockStyle: style })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                  settings.clockStyle === style
                    ? 'bg-[#171717] text-white border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* 12h / 24h toggle */}
          <button
            onClick={() => onUpdateSettings({ is24Hour: !settings.is24Hour })}
            className="px-2.5 py-1.5 rounded-lg bg-[#111111] border border-neutral-800 text-xs font-mono font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle 12h / 24h format"
          >
            {settings.is24Hour ? '24H' : '12H'}
          </button>

          {/* Toggle Seconds */}
          <button
            onClick={() => onUpdateSettings({ showSeconds: !settings.showSeconds })}
            className={`p-1.5 rounded-lg bg-[#111111] border border-neutral-800 text-xs transition-colors cursor-pointer ${
              settings.showSeconds ? 'text-[#4388FF]' : 'text-neutral-400'
            }`}
            title={settings.showSeconds ? 'Hide Seconds' : 'Show Seconds'}
            aria-label="Toggle Seconds"
          >
            {settings.showSeconds ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg bg-[#111111] border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Desk Mode (F)'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Clock Display Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-6 sm:py-12">
        {/* Style: FLIP CLOCK */}
        {settings.clockStyle === 'flip' && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 my-4 select-none">
            <FlipCard value={hour} label="Hours" />
            <span className="text-3xl sm:text-6xl md:text-7xl font-mono text-neutral-500 pb-6">:</span>
            <FlipCard value={minute} label="Minutes" />
            {settings.showSeconds && (
              <>
                <span className="text-3xl sm:text-6xl md:text-7xl font-mono text-neutral-500 pb-6">:</span>
                <FlipCard value={second} label="Seconds" />
              </>
            )}
            {!settings.is24Hour && dayPeriod && (
              <div className="ml-2 sm:ml-4 self-center">
                <span className="px-3 py-1.5 rounded-lg bg-[#111111] border border-neutral-800 text-xs sm:text-base font-mono font-bold text-[#4388FF] tracking-widest uppercase">
                  {dayPeriod}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Style: MINIMAL CLOCK */}
        {settings.clockStyle === 'minimal' && (
          <div className="flex flex-col items-center justify-center my-6 select-none text-center">
            <div className="flex items-baseline justify-center tracking-tight">
              <span className="text-6xl sm:text-8xl md:text-9xl font-light font-mono-numbers text-white">
                {hour}:{minute}
              </span>
              {settings.showSeconds && (
                <span className="text-3xl sm:text-5xl md:text-6xl font-light font-mono-numbers text-neutral-400 ml-2">
                  .{second}
                </span>
              )}
              {!settings.is24Hour && dayPeriod && (
                <span className="text-lg sm:text-2xl font-mono text-[#4388FF] ml-3 font-medium">
                  {dayPeriod}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Style: DIGITAL CLOCK (Default) */}
        {settings.clockStyle === 'digital' && (
          <div className="relative flex flex-col items-center justify-center my-4 sm:my-8 select-none">
            {/* Subtle glow backdrop */}
            <div className="absolute inset-0 bg-[#4388FF]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative flex items-center justify-center bg-[#111111]/70 border border-neutral-800 rounded-3xl px-6 py-6 sm:px-12 sm:py-10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-baseline font-mono-numbers tracking-tight">
                <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-white tracking-normal">
                  {hour}
                </span>
                <span className="text-5xl sm:text-7xl md:text-8xl font-light text-[#4388FF] mx-1 sm:mx-2 animate-pulse">
                  :
                </span>
                <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-white tracking-normal">
                  {minute}
                </span>

                {settings.showSeconds && (
                  <>
                    <span className="text-4xl sm:text-6xl md:text-7xl font-light text-neutral-400 mx-1">
                      :
                    </span>
                    <span className="text-4xl sm:text-6xl md:text-7xl font-medium text-[#4388FF] tracking-normal">
                      {second}
                    </span>
                  </>
                )}

                {!settings.is24Hour && dayPeriod && (
                  <span className="text-lg sm:text-3xl font-mono font-semibold text-neutral-400 ml-3 sm:ml-5 uppercase tracking-wider">
                    {dayPeriod}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Seconds Indicator Line */}
        {settings.showSeconds && (
          <div className="w-full max-w-xl mx-auto my-4 px-4 flex flex-col items-center">
            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
              <div
                className="h-full bg-gradient-to-r from-[#4388FF] to-blue-400 transition-all duration-150 ease-out"
                style={{ width: `${secondsProgress}%` }}
              />
            </div>
            <div className="w-full flex items-center justify-between text-[11px] text-neutral-400 font-mono mt-1.5">
              <span>00s</span>
              <span className="text-[#4388FF] font-medium">{second}s</span>
              <span>60s</span>
            </div>
          </div>
        )}

        {/* Date Display */}
        {settings.showDate && (
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#111111]/80 border border-neutral-800 text-sm sm:text-base text-neutral-300 font-medium">
            <Calendar className="w-4 h-4 text-[#4388FF]" />
            <span>{formattedDate}</span>
          </div>
        )}

        {/* Active Timezone indicator */}
        <div className="mt-3 text-xs text-neutral-400 font-mono flex items-center gap-1.5">
          <span>Zone:</span>
          <span className="text-neutral-300">
            {activeTz || Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </div>
      </div>

      {/* Fullscreen Desk Mode Hint */}
      {isFullscreen && (
        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center text-xs text-neutral-400 font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">F</kbd> to exit fullscreen</span>
        </div>
      )}
    </div>
  );
};
