import React from 'react';
import { AppView } from '../types';
import { Clock, Keyboard, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onOpenShortcuts: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenShortcuts }) => {
  return (
    <footer className="w-full border-t border-neutral-800 bg-[#050505] text-neutral-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-850">
          {/* Brand & Mission Statement */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-[#111111] border border-neutral-800 flex items-center justify-center text-[#4388FF]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-sm font-bold text-white">DarkClock Pro</span>
                <span className="text-[10px] text-neutral-400 font-mono">v2.4</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Minimalist, high-precision digital clock, countdown timer, stopwatch & alarm tools.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenShortcuts}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#171717] border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#4388FF]" />
              <span>Keyboard Shortcuts</span>
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#171717] border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#4388FF]" />
              <span>Deployment Guide</span>
            </button>
          </div>
        </div>

        {/* Links & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('clock')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Online Clock
            </button>
            <button
              onClick={() => onNavigate('timer')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Free Online Timer
            </button>
            <button
              onClick={() => onNavigate('stopwatch')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Stopwatch Online
            </button>
            <button
              onClick={() => onNavigate('alarm')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Online Alarm Clock
            </button>
            <button
              onClick={() => onNavigate('world')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              World Clock
            </button>
          </div>

          <div className="text-neutral-400 text-center sm:text-right">
            © {new Date().getFullYear()} DarkClock Pro. All rights reserved. Zero cookies, pure performance.
          </div>
        </div>
      </div>
    </footer>
  );
};
