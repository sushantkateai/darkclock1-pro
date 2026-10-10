import React, { useState, useEffect, useRef } from 'react';
import { TimerItem, UserSettings } from '../types';
import { playAlertSound, sendBrowserNotification } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Volume2, 
  Edit3, 
  Clock, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface TimerViewProps {
  settings: UserSettings;
  timers: TimerItem[];
  onUpdateTimers: (timers: TimerItem[]) => void;
  onOpenSettings: () => void;
}

const PRESETS = [
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '15m', seconds: 900 },
  { label: '25m (Pomodoro)', seconds: 1500 },
  { label: '30m', seconds: 1800 },
  { label: '60m', seconds: 3600 },
];

export const TimerView: React.FC<TimerViewProps> = ({
  settings,
  timers,
  onUpdateTimers,
  onOpenSettings,
}) => {
  const [activeTimerId, setActiveTimerId] = useState<string>(timers[0]?.id || 'timer-primary');
  
  // Custom input state for setting time
  const [inputHours, setInputHours] = useState<string>('0');
  const [inputMinutes, setInputMinutes] = useState<string>('5');
  const [inputSeconds, setInputSeconds] = useState<string>('0');
  const [inputLabel, setInputLabel] = useState<string>('Focus Session');
  const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false);

  // Completion modal state
  const [completedTimer, setCompletedTimer] = useState<TimerItem | null>(null);

  // Active timer reference
  const activeTimer = timers.find((t) => t.id === activeTimerId) || timers[0];

  // High-precision interval that recalculates remaining seconds based on Date.now()
  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      const now = Date.now();

      const updated = timers.map((timer) => {
        if (!timer.isRunning || !timer.targetEndTimeMs) return timer;

        const deltaRemaining = Math.max(0, Math.ceil((timer.targetEndTimeMs - now) / 1000));

        if (deltaRemaining === 0 && !timer.isFinished) {
          changed = true;
          // Trigger alarm & notification
          if (settings.soundEnabled) {
            playAlertSound(settings.selectedTone, settings.soundVolume);
          }
          if (settings.notificationsEnabled) {
            sendBrowserNotification(
              `Timer Finished: ${timer.label}`,
              `Your ${Math.round(timer.totalSeconds / 60)} minute timer has finished!`
            );
          }
          // Set completed timer for UI modal
          setCompletedTimer(timer);

          return {
            ...timer,
            remainingSeconds: 0,
            isRunning: false,
            isFinished: true,
            targetEndTimeMs: null,
          };
        }

        if (deltaRemaining !== timer.remainingSeconds) {
          changed = true;
          return {
            ...timer,
            remainingSeconds: deltaRemaining,
          };
        }

        return timer;
      });

      if (changed) {
        onUpdateTimers(updated);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [timers, settings, onUpdateTimers]);

  // Keyboard shortcut listener: Space to toggle, R to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (activeTimer) {
          if (activeTimer.isRunning) {
            handlePause(activeTimer.id);
          } else {
            handleStart(activeTimer.id);
          }
        }
      } else if (e.code === 'KeyR') {
        if (activeTimer) {
          handleReset(activeTimer.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTimer, timers]);

  const handleStart = (id: string) => {
    const target = timers.find((t) => t.id === id);
    if (!target) return;

    if (target.remainingSeconds <= 0) {
      // If was finished, reset first
      const resetSecs = target.totalSeconds > 0 ? target.totalSeconds : 300;
      const newEndTime = Date.now() + resetSecs * 1000;
      onUpdateTimers(
        timers.map((t) =>
          t.id === id
            ? {
                ...t,
                remainingSeconds: resetSecs,
                totalSeconds: resetSecs,
                isRunning: true,
                isPaused: false,
                isFinished: false,
                targetEndTimeMs: newEndTime,
              }
            : t
        )
      );
      return;
    }

    const newEndTime = Date.now() + target.remainingSeconds * 1000;
    onUpdateTimers(
      timers.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: true,
              isPaused: false,
              isFinished: false,
              targetEndTimeMs: newEndTime,
            }
          : t
      )
    );
  };

  const handlePause = (id: string) => {
    const target = timers.find((t) => t.id === id);
    if (!target) return;

    const now = Date.now();
    const remaining = target.targetEndTimeMs
      ? Math.max(0, Math.ceil((target.targetEndTimeMs - now) / 1000))
      : target.remainingSeconds;

    onUpdateTimers(
      timers.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: false,
              isPaused: true,
              remainingSeconds: remaining,
              targetEndTimeMs: null,
            }
          : t
      )
    );
  };

  const handleReset = (id: string) => {
    onUpdateTimers(
      timers.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: false,
              isPaused: false,
              isFinished: false,
              remainingSeconds: t.totalSeconds,
              targetEndTimeMs: null,
            }
          : t
      )
    );
  };

  const handleApplyCustomTime = () => {
    const h = parseInt(inputHours, 10) || 0;
    const m = parseInt(inputMinutes, 10) || 0;
    const s = parseInt(inputSeconds, 10) || 0;
    const total = h * 3600 + m * 60 + s;

    if (total <= 0) return;

    if (activeTimer) {
      onUpdateTimers(
        timers.map((t) =>
          t.id === activeTimer.id
            ? {
                ...t,
                label: inputLabel || 'Timer',
                totalSeconds: total,
                remainingSeconds: total,
                isRunning: false,
                isPaused: false,
                isFinished: false,
                targetEndTimeMs: null,
              }
            : t
        )
      );
    }
  };

  const handleSelectPreset = (presetSecs: number) => {
    const h = Math.floor(presetSecs / 3600);
    const m = Math.floor((presetSecs % 3600) / 60);
    const s = presetSecs % 60;
    setInputHours(h.toString());
    setInputMinutes(m.toString());
    setInputSeconds(s.toString());

    if (activeTimer) {
      onUpdateTimers(
        timers.map((t) =>
          t.id === activeTimer.id
            ? {
                ...t,
                totalSeconds: presetSecs,
                remainingSeconds: presetSecs,
                isRunning: false,
                isPaused: false,
                isFinished: false,
                targetEndTimeMs: null,
              }
            : t
        )
      );
    }
  };

  const handleAddNewTimer = () => {
    const newId = `timer-${Date.now()}`;
    const newTimer: TimerItem = {
      id: newId,
      label: `Timer ${timers.length + 1}`,
      totalSeconds: 300,
      remainingSeconds: 300,
      isRunning: false,
      isPaused: false,
      targetEndTimeMs: null,
      isFinished: false,
    };
    onUpdateTimers([...timers, newTimer]);
    setActiveTimerId(newId);
  };

  const handleDeleteTimer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (timers.length <= 1) return; // Keep at least one timer
    const filtered = timers.filter((t) => t.id !== id);
    onUpdateTimers(filtered);
    if (activeTimerId === id) {
      setActiveTimerId(filtered[0].id);
    }
  };

  // Format remaining seconds into HH:MM:SS or MM:SS
  const formatTimerDigits = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  const remaining = activeTimer ? activeTimer.remainingSeconds : 0;
  const total = activeTimer && activeTimer.totalSeconds > 0 ? activeTimer.totalSeconds : 300;
  const progressRatio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 1;

  // SVG Circular math
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Header section with active timer title and tabs */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Countdown Timer</span>
            <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal">
              {timers.length} Active
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Reliable tab-safe countdown with animated dial and sound notifications.
          </p>
        </div>

        {/* Timers tabs bar */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
          {timers.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTimerId(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                activeTimerId === t.id
                  ? 'bg-[#171717] text-white border-neutral-700 shadow-sm'
                  : 'bg-[#111111] text-neutral-400 border-neutral-850 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${t.isRunning ? 'bg-[#4388FF] animate-pulse' : 'bg-neutral-600'}`} />
              <span className="truncate max-w-[100px]">{t.label}</span>
              <span className="font-mono text-neutral-400">{formatTimerDigits(t.remainingSeconds)}</span>
              {timers.length > 1 && (
                <button
                  onClick={(e) => handleDeleteTimer(t.id, e)}
                  className="hover:text-red-400 p-0.5 rounded cursor-pointer"
                  title="Delete Timer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddNewTimer}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111111] border border-neutral-800 text-xs font-medium text-[#4388FF] hover:bg-[#171717] transition-colors cursor-pointer shrink-0"
            title="Add New Timer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Timer</span>
          </button>
        </div>
      </div>

      {/* Main Dial & Digits Display */}
      {activeTimer && (
        <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center my-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* SVG Circular Progress Bar */}
            <svg className="w-full h-full transform -rotate-90 select-none">
              {/* Background ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-neutral-850"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Active progress ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={activeTimer.isFinished ? '#EF4444' : '#4388FF'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 ease-linear"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
              {/* Timer Label */}
              <div className="flex items-center gap-1.5 mb-1 group cursor-pointer" onClick={() => setIsEditingLabel(true)}>
                <span className="text-xs sm:text-sm font-medium text-neutral-400 tracking-wide truncate max-w-[180px]">
                  {activeTimer.label}
                </span>
                <Edit3 className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400" />
              </div>

              {/* Big Digits */}
              <div className="text-5xl sm:text-6xl font-bold font-mono-numbers text-white tracking-tight my-1">
                {formatTimerDigits(activeTimer.remainingSeconds)}
              </div>

              {/* Status indication */}
              <div className="text-xs font-mono uppercase tracking-widest mt-1 text-neutral-500">
                {activeTimer.isFinished ? (
                  <span className="text-red-400 font-semibold animate-pulse">TIME UP!</span>
                ) : activeTimer.isRunning ? (
                  <span className="text-[#4388FF]">RUNNING</span>
                ) : activeTimer.isPaused ? (
                  <span className="text-amber-400">PAUSED</span>
                ) : (
                  <span>READY</span>
                )}
              </div>
            </div>
          </div>

          {/* Core Timer Controls (Large, accessible, functional) */}
          <div className="flex items-center gap-4 mt-8">
            {activeTimer.isRunning ? (
              <button
                onClick={() => handlePause(activeTimer.id)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#171717] hover:bg-[#222222] border border-neutral-700 text-white font-semibold text-base shadow-lg transition-all cursor-pointer"
              >
                <Pause className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={() => handleStart(activeTimer.id)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#4388FF] hover:bg-blue-600 text-white font-semibold text-base shadow-lg glow-accent transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{activeTimer.isPaused ? 'Resume' : 'Start'}</span>
              </button>
            )}

            <button
              onClick={() => handleReset(activeTimer.id)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#111111] hover:bg-[#171717] border border-neutral-800 text-neutral-300 hover:text-white font-medium text-base transition-all cursor-pointer"
              title="Reset Timer (R)"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 font-mono mt-3">
            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">Space</kbd> to Start/Pause, <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">R</kbd> to Reset
          </p>
        </div>
      )}

      {/* Quick Presets Section */}
      <div className="w-full max-w-2xl bg-[#111111] border border-neutral-800 rounded-2xl p-5 my-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Quick Presets
          </span>
          <span className="text-xs text-neutral-400">Click to set duration</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSelectPreset(p.seconds)}
              className="px-3 py-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 hover:border-[#4388FF]/50 text-xs font-mono font-medium text-neutral-300 hover:text-white transition-all cursor-pointer text-center"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Duration & Label Form */}
      <div className="w-full max-w-2xl bg-[#111111] border border-neutral-800 rounded-2xl p-5">
        <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-3">
          Custom Timer Settings
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          {/* Label */}
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Timer Name</label>
            <input
              type="text"
              value={inputLabel}
              onChange={(e) => setInputLabel(e.target.value)}
              placeholder="e.g. Focus"
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF]"
            />
          </div>

          {/* Hours, Minutes, Seconds */}
          <div className="sm:col-span-2 grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="99"
                value={inputHours}
                onChange={(e) => setInputHours(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-sm text-center font-mono text-white focus:outline-none focus:border-[#4388FF]"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-sm text-center font-mono text-white focus:outline-none focus:border-[#4388FF]"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={inputSeconds}
                onChange={(e) => setInputSeconds(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-sm text-center font-mono text-white focus:outline-none focus:border-[#4388FF]"
              />
            </div>
          </div>

          {/* Set Button */}
          <div>
            <button
              onClick={handleApplyCustomTime}
              className="w-full py-2 px-4 rounded-lg bg-[#171717] hover:bg-[#222222] border border-neutral-700 text-sm font-medium text-white transition-colors cursor-pointer"
            >
              Apply Time
            </button>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {completedTimer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-[#4388FF]/15 border border-[#4388FF]/40 text-[#4388FF] flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">Timer Finished!</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Your timer <span className="text-white font-medium">"{completedTimer.label}"</span> has completed.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleReset(completedTimer.id);
                  handleStart(completedTimer.id);
                  setCompletedTimer(null);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Restart Timer
              </button>
              <button
                onClick={() => {
                  handleReset(completedTimer.id);
                  setCompletedTimer(null);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#171717] hover:bg-[#222222] border border-neutral-700 text-neutral-300 font-medium text-sm transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
