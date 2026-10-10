import React from 'react';
import { AppView, UserSettings } from '../types';
import { ClockView } from './ClockView';
import { 
  Hourglass, 
  Timer as StopwatchIcon, 
  Bell, 
  Globe2, 
  ArrowRight, 
  CheckCircle,
  Sliders
} from 'lucide-react';

interface HomeViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onNavigate: (view: AppView) => void;
  selectedTimezone: string;
  onTimezoneChange: (tz: string) => void;
  activeTimersCount: number;
  activeAlarmsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  onUpdateSettings,
  isFullscreen,
  onToggleFullscreen,
  onNavigate,
  selectedTimezone,
  onTimezoneChange,
  activeTimersCount,
  activeAlarmsCount,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Live Digital Clock Centered */}
      <section className="w-full">
        <ClockView
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          selectedTimezone={selectedTimezone}
          onTimezoneChange={onTimezoneChange}
        />
      </section>

      {/* Quick-Access Feature Cards (Timer, Stopwatch, Alarm, World Clock) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Timekeeping Suite</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Precision utilities engineered for study, productivity, and athletes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Tools</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Countdown Timer */}
          <div
            onClick={() => onNavigate('timer')}
            className="group bg-[#111111] hover:bg-[#161616] border border-neutral-800 hover:border-[#4388FF]/50 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4388FF]/10 border border-[#4388FF]/25 flex items-center justify-center text-[#4388FF] mb-4 group-hover:scale-105 transition-transform">
              <Hourglass className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-[#4388FF] transition-colors">
                  Countdown Timer
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">
                  {activeTimersCount} active
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Circular progress dial with presets, custom tags, and tab-safe intervals.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
              <span>Launch Timer</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#4388FF] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Stopwatch */}
          <div
            onClick={() => onNavigate('stopwatch')}
            className="group bg-[#111111] hover:bg-[#161616] border border-neutral-800 hover:border-[#4388FF]/50 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <StopwatchIcon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Precision Stopwatch
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">0.01s res</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Millisecond splits, fastest/slowest lap comparison, and text export.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
              <span>Open Stopwatch</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Alarm Clock */}
          <div
            onClick={() => onNavigate('alarm')}
            className="group bg-[#111111] hover:bg-[#161616] border border-neutral-800 hover:border-[#4388FF]/50 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                  Online Alarm Clock
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">
                  {activeAlarmsCount} active
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Recurring weekday alerts, snooze controls, and multi-tone sound synthesis.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
              <span>Set Alarms</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: World Clock */}
          <div
            onClick={() => onNavigate('world')}
            className="group bg-[#111111] hover:bg-[#161616] border border-neutral-800 hover:border-[#4388FF]/50 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Globe2 className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  World Clock
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">Global</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                50+ searchable international metropolises with automatic DST offsets.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white">
              <span>Explore Cities</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-10">
        <div className="bg-[#111111]/80 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-2">
            Why Professionals Choose DarkClock Pro
          </h2>
          <p className="text-xs text-neutral-400 mb-6 max-w-2xl leading-relaxed">
            Engineered for engineers, students, traders, and desk setups who need an ultra-clean, accurate online clock with zero advertisements and zero distraction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle className="w-4 h-4 text-[#4388FF]" />
                <span>Zero Inactivity Drift</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Built-in delta timestamp synchronization ensures timers never slow down when browser tabs are placed in the background.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle className="w-4 h-4 text-[#4388FF]" />
                <span>Distraction-Free Desk Mode</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Full-screen OLED black display is ideal for dual-monitor desk setups, study sessions, and ambient room timekeeping.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle className="w-4 h-4 text-[#4388FF]" />
                <span>100% Client-Side Privacy</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No user accounts or tracking cookies. Your alarms, presets, and customized cities remain stored locally on your device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

