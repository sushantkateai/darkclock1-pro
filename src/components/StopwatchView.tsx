import React, { useState, useEffect, useRef } from 'react';
import { LapItem, UserSettings } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Trash2, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Clock 
} from 'lucide-react';

interface StopwatchViewProps {
  settings: UserSettings;
}

export const StopwatchView: React.FC<StopwatchViewProps> = ({ settings }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const [laps, setLaps] = useState<LapItem[]>([]);

  // Time tracking refs to prevent tab throttle inaccuracies
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Timer loop using requestAnimationFrame + Date.now()
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      const update = () => {
        const now = Date.now();
        const currentElapsed = accumulatedTimeRef.current + (now - startTimeRef.current);
        setElapsedTimeMs(currentElapsed);
        animationFrameRef.current = requestAnimationFrame(update);
      };
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  // Keyboard shortcut listener: Space (start/pause), L (lap), R (reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleStartPause();
      } else if (e.code === 'KeyL') {
        if (isRunning) {
          recordLap();
        }
      } else if (e.code === 'KeyR') {
        resetStopwatch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const toggleStartPause = () => {
    if (isRunning) {
      // Pause
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      setIsRunning(false);
    } else {
      // Start/Resume
      setIsRunning(true);
    }
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    setElapsedTimeMs(0);
    setLaps([]);
  };

  const recordLap = () => {
    const currentTotal = isRunning
      ? accumulatedTimeRef.current + (Date.now() - startTimeRef.current)
      : elapsedTimeMs;

    const previousTotal = laps.length > 0 ? laps[0].totalTimeMs : 0;
    const lapTime = currentTotal - previousTotal;

    const newLap: LapItem = {
      lapNumber: laps.length + 1,
      lapTimeMs: lapTime,
      totalTimeMs: currentTotal,
    };

    // Store newest lap first
    setLaps([newLap, ...laps]);
  };

  const clearLaps = () => {
    setLaps([]);
  };

  const exportLaps = () => {
    if (laps.length === 0) return;
    const rows = laps
      .map(
        (l) =>
          `Lap ${l.lapNumber},Lap Time: ${formatMilliseconds(l.lapTimeMs)},Total: ${formatMilliseconds(l.totalTimeMs)}`
      )
      .join('\n');
    const blob = new Blob([`DarkClock Pro - Stopwatch Laps\n${rows}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stopwatch_laps_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper formatting: mm:ss.ms
  const formatMilliseconds = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // 2-digit 00-99

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  };

  // Calculate fastest and slowest laps if there are at least 2 laps
  let fastestLapNumber = -1;
  let slowestLapNumber = -1;

  if (laps.length >= 2) {
    let minTime = Infinity;
    let maxTime = -Infinity;

    laps.forEach((l) => {
      if (l.lapTimeMs < minTime) {
        minTime = l.lapTimeMs;
        fastestLapNumber = l.lapNumber;
      }
      if (l.lapTimeMs > maxTime) {
        maxTime = l.lapTimeMs;
        slowestLapNumber = l.lapNumber;
      }
    });
  }

  // Split formatted string into large main digits and smaller milliseconds
  const totalSecs = Math.floor(elapsedTimeMs / 1000);
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;
  const centiseconds = Math.floor((elapsedTimeMs % 1000) / 10);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Title */}
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Precision Stopwatch</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Millisecond accuracy with lap analysis and drift-free background execution.
        </p>
      </div>

      {/* Main Big Stopwatch Display */}
      <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center my-6">
        <div className="relative flex items-center justify-center bg-[#111111] border border-neutral-800 rounded-3xl px-8 py-8 sm:px-14 sm:py-12 shadow-2xl backdrop-blur-xl select-none">
          <div className="flex items-baseline font-mono-numbers">
            <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-white tracking-tight">
              {pad(minutes)}:{pad(seconds)}
            </span>
            <span className="text-3xl sm:text-5xl md:text-6xl font-light text-[#4388FF] ml-2">
              .{pad(centiseconds)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 mt-8">
          {isRunning ? (
            <button
              onClick={toggleStartPause}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#171717] hover:bg-[#222222] border border-neutral-700 text-white font-semibold text-base shadow-lg transition-all cursor-pointer"
            >
              <Pause className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={toggleStartPause}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#4388FF] hover:bg-blue-600 text-white font-semibold text-base shadow-lg glow-accent transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{elapsedTimeMs > 0 ? 'Resume' : 'Start'}</span>
            </button>
          )}

          {/* Lap Button */}
          <button
            onClick={recordLap}
            disabled={!isRunning}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border text-base font-medium transition-all ${
              isRunning
                ? 'bg-[#111111] hover:bg-[#171717] border-neutral-700 text-white cursor-pointer'
                : 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed opacity-50'
            }`}
          >
            <Flag className="w-4 h-4 text-[#4388FF]" />
            <span>Lap</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={resetStopwatch}
            disabled={elapsedTimeMs === 0 && laps.length === 0}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-base font-medium transition-all ${
              elapsedTimeMs > 0 || laps.length > 0
                ? 'bg-[#111111] hover:bg-[#171717] border-neutral-800 text-neutral-300 hover:text-white cursor-pointer'
                : 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed opacity-50'
            }`}
            title="Reset Stopwatch (R)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <p className="text-[11px] text-neutral-400 font-mono mt-3">
          Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">Space</kbd> Start/Pause, <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">L</kbd> Lap, <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">R</kbd> Reset
        </p>
      </div>

      {/* Laps Table & Analysis */}
      {laps.length > 0 && (
        <div className="w-full max-w-2xl bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden mt-6">
          {/* Laps Header */}
          <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Recorded Laps ({laps.length})
              </span>
              {laps.length >= 2 && (
                <div className="flex items-center gap-3 text-[11px] text-neutral-400 ml-4 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3 h-3" /> Fastest: Lap {fastestLapNumber}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <TrendingDown className="w-3 h-3" /> Slowest: Lap {slowestLapNumber}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportLaps}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#171717] hover:bg-[#222222] border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Export laps as text file"
              >
                <Download className="w-3 h-3 text-[#4388FF]" />
                <span>Export</span>
              </button>
              <button
                onClick={clearLaps}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#171717] hover:bg-red-950/40 border border-neutral-800 hover:border-red-800 text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Clear all recorded laps"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-850">
            <div className="grid grid-cols-3 px-5 py-2 text-[11px] font-mono uppercase text-neutral-400 bg-[#0A0A0A]">
              <span>Lap #</span>
              <span className="text-center">Split Time</span>
              <span className="text-right">Overall Time</span>
            </div>

            {laps.map((lap) => {
              const isFastest = lap.lapNumber === fastestLapNumber;
              const isSlowest = lap.lapNumber === slowestLapNumber;

              return (
                <div
                  key={lap.lapNumber}
                  className={`grid grid-cols-3 px-5 py-2.5 text-xs font-mono items-center transition-colors ${
                    isFastest
                      ? 'bg-emerald-950/20 text-emerald-300'
                      : isSlowest
                      ? 'bg-amber-950/20 text-amber-300'
                      : 'text-neutral-300 hover:bg-[#151515]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Lap {lap.lapNumber.toString().padStart(2, '0')}</span>
                    {isFastest && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Fastest
                      </span>
                    )}
                    {isSlowest && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Slowest
                      </span>
                    )}
                  </div>

                  <span className="text-center font-medium">
                    +{formatMilliseconds(lap.lapTimeMs)}
                  </span>

                  <span className="text-right text-neutral-400">
                    {formatMilliseconds(lap.totalTimeMs)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
