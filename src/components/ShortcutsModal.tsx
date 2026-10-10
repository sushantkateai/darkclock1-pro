import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Start or Pause active Countdown Timer / Stopwatch' },
  { key: 'R', desc: 'Reset active Timer or Stopwatch' },
  { key: 'L', desc: 'Record Lap (while Stopwatch is running)' },
  { key: 'F', desc: 'Toggle Fullscreen Desk Clock Mode' },
  { key: 'Esc', desc: 'Exit Fullscreen or Close modals' },
  { key: '1', desc: 'Switch to Clock view' },
  { key: '2', desc: 'Switch to Timer view' },
  { key: '3', desc: 'Switch to Stopwatch view' },
  { key: '4', desc: 'Switch to Alarm view' },
  { key: '5', desc: 'Switch to World Clock view' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#4388FF]" />
            <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0A0A] border border-neutral-850 text-xs"
            >
              <span className="text-neutral-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[#171717] border border-neutral-700 font-mono font-bold text-white text-[11px] shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
