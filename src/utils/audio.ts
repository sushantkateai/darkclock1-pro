import { SoundTone } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play synthesized sound using the Web Audio API
 */
export function playAlertSound(tone: SoundTone = 'chime', volume: number = 80): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const normalizedVol = Math.max(0, Math.min(1, volume / 100)) * 0.4;
    masterGain.gain.setValueAtTime(normalizedVol, now);
    masterGain.connect(ctx.destination);

    switch (tone) {
      case 'beep': {
        // High-tech digital beep pattern: double sharp beep
        const playBeep = (startTime: number, freq: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(startTime);
          osc.stop(startTime + 0.12);
        };
        playBeep(now, 880);
        playBeep(now + 0.15, 1174.66);
        playBeep(now + 0.35, 1760);
        break;
      }

      case 'bell': {
        // Resonant acoustic bell with overtone decay
        const freqs = [520, 1040, 1560, 2600];
        const decays = [1.2, 0.8, 0.5, 0.3];
        const gains = [0.6, 0.3, 0.15, 0.08];

        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(gains[idx], now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + decays[idx]);
        });
        break;
      }

      case 'pulse': {
        // Futuristic electro pulse
        [0, 0.14, 0.28].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          const freq = 650 + idx * 220;
          osc.frequency.setValueAtTime(freq, now + offset);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + offset + 0.1);
          gain.gain.setValueAtTime(0.4, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + offset);
          osc.stop(now + offset + 0.11);
        });
        break;
      }

      case 'marimba': {
        // Warm wooden strike chords
        const notes = [440, 554.37, 659.25]; // A major
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.7, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.45);
        });
        break;
      }

      case 'chime':
      default: {
        // Soothing ascending ambient arpeggio: C5 -> E5 -> G5 -> C6
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const start = now + idx * 0.12;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.6, start);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(start);
          osc.stop(start + 0.85);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio playback not supported or interaction needed:', err);
  }
}

/**
 * Triggers browser notification if permission granted
 */
export function sendBrowserNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'darkclock-alert',
      });
    } catch {
      // Fallback if ServiceWorker context is strictly needed
    }
  }
}
