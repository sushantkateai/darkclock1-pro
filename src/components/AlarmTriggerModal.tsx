import React, { useEffect } from 'react';
import { AlarmItem } from '../types';
import { Bell, Clock, RotateCcw, XCircle } from 'lucide-react';
import { playAlertSound } from '../utils/audio';

interface AlarmTriggerModalProps {
  alarm: AlarmItem | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

export const AlarmTriggerModal: React.FC<AlarmTriggerModalProps> = ({
  alarm,
  onDismiss,
  onSnooze,
}) => {
  if (!alarm) return null;

  // Repeat sound every 3 seconds while active
  useEffect(() => {
    const interval = setInterval(() => {
      playAlertSound(alarm.soundTone, 90);
    }, 3000);

    return () => clearInterval(interval);
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#4388FF]/50 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative glow-accent">
        {/* Pulsing Bell */}
        <div className="w-20 h-20 rounded-full bg-[#4388FF]/20 border border-[#4388FF]/60 text-[#4388FF] flex items-center justify-center mx-auto mb-5 animate-bounce">
          <Bell className="w-10 h-10 animate-pulse" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-[#4388FF] font-semibold">
          Alarm Ringing
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono-numbers">
          {alarm.time}
        </h2>
        <p className="text-base text-neutral-300 font-medium mb-6">
          "{alarm.label}"
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onDismiss}
            className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Dismiss Alarm</span>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => onSnooze(5)}
              className="py-2.5 px-3 rounded-xl bg-[#171717] hover:bg-[#222222] border border-neutral-700 text-neutral-300 hover:text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Snooze (5m)</span>
            </button>
            <button
              onClick={() => onSnooze(10)}
              className="py-2.5 px-3 rounded-xl bg-[#171717] hover:bg-[#222222] border border-neutral-700 text-neutral-300 hover:text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Snooze (10m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
