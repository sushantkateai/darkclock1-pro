import React, { useState, useEffect } from 'react';
import { AlarmItem, SoundTone, UserSettings } from '../types';
import { playAlertSound, sendBrowserNotification } from '../utils/audio';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Volume2, 
  AlertTriangle, 
  Check, 
  Clock, 
  Calendar, 
  Repeat, 
  X,
  Play
} from 'lucide-react';

interface AlarmViewProps {
  settings: UserSettings;
  alarms: AlarmItem[];
  onUpdateAlarms: (alarms: AlarmItem[]) => void;
  onTriggerAlarmModal: (alarm: AlarmItem) => void;
}

const WEEKDAYS = [
  { day: 0, label: 'S', name: 'Sunday' },
  { day: 1, label: 'M', name: 'Monday' },
  { day: 2, label: 'T', name: 'Tuesday' },
  { day: 3, label: 'W', name: 'Wednesday' },
  { day: 4, label: 'T', name: 'Thursday' },
  { day: 5, label: 'F', name: 'Friday' },
  { day: 6, label: 'S', name: 'Saturday' },
];

const TONES: { id: SoundTone; label: string }[] = [
  { id: 'chime', label: 'Ascending Chime (Default)' },
  { id: 'beep', label: 'Digital Beep' },
  { id: 'bell', label: 'Acoustic Bell' },
  { id: 'pulse', label: 'Electro Pulse' },
  { id: 'marimba', label: 'Wooden Marimba' },
];

export const AlarmView: React.FC<AlarmViewProps> = ({
  settings,
  alarms,
  onUpdateAlarms,
  onTriggerAlarmModal,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTime, setNewTime] = useState<string>('08:00');
  const [newLabel, setNewLabel] = useState<string>('Wake Up');
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
  const [newTone, setNewTone] = useState<SoundTone>('chime');

  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Request browser notification
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setNotificationStatus(res);
    }
  };

  const previewTone = (tone: SoundTone) => {
    playAlertSound(tone, settings.soundVolume);
  };

  // Check alarms every 500ms to see if any matches current time and day
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentSeconds = now.getSeconds();
      const currentDay = now.getDay();
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      // Only check on 0 seconds of the minute to avoid retriggering repeatedly
      if (currentSeconds === 0) {
        alarms.forEach((alarm) => {
          if (!alarm.isEnabled) return;

          // Check time match
          if (alarm.time === currentTimeString) {
            // Check day match
            const matchesDay = alarm.daysOfWeek.length === 0 || alarm.daysOfWeek.includes(currentDay);
            if (matchesDay) {
              // Trigger alarm
              playAlertSound(alarm.soundTone, settings.soundVolume);
              sendBrowserNotification(
                `Alarm: ${alarm.label}`,
                `It's ${alarm.time}! Time for your scheduled alarm.`
              );
              onTriggerAlarmModal(alarm);

              // If it's a one-time alarm, disable it
              if (alarm.daysOfWeek.length === 0) {
                onUpdateAlarms(
                  alarms.map((a) => (a.id === alarm.id ? { ...a, isEnabled: false } : a))
                );
              }
            }
          }
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [alarms, settings, onTriggerAlarmModal, onUpdateAlarms]);

  const toggleAlarm = (id: string) => {
    onUpdateAlarms(
      alarms.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
  };

  const deleteAlarm = (id: string) => {
    onUpdateAlarms(alarms.filter((a) => a.id !== id));
  };

  const toggleDaySelection = (day: number) => {
    if (newDays.includes(day)) {
      setNewDays(newDays.filter((d) => d !== day));
    } else {
      setNewDays([...newDays, day].sort());
    }
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AlarmItem = {
      id: `alarm-${Date.now()}`,
      time: newTime,
      label: newLabel || 'Alarm',
      daysOfWeek: newDays,
      isEnabled: true,
      soundTone: newTone,
      snoozeCount: 0,
    };
    onUpdateAlarms([...alarms, created]);
    setShowAddModal(false);
    setNewLabel('');
  };

  // Format 24h string into 12h or 24h for UI
  const formatDisplayTime = (time24: string) => {
    if (settings.is24Hour) return time24;
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${mStr} ${period}`;
  };

  const formatDaysSummary = (days: number[]) => {
    if (days.length === 0) return 'Once';
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every((d) => [1, 2, 3, 4, 5].includes(d))) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days.map((d) => WEEKDAYS.find((w) => w.day === d)?.name.slice(0, 3)).join(', ');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Online Alarm Clock</span>
            <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal">
              {alarms.filter((a) => a.isEnabled).length} Active
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Custom schedules, recurring weekdays, and reliable synthesized tones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-sm shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Alarm</span>
        </button>
      </div>

      {/* Device Sleep Constraint Advisory Banner */}
      <div className="w-full bg-[#111111] border border-amber-900/40 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-300">
          <span className="font-semibold text-white">Browser Alarm Advisory: </span>
          Web alarms operate smoothly while this browser tab stays open. If your computer sleeps, locks completely, or the browser is quit, audio alarms may be delayed until the system wakes up.
          {notificationStatus !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="ml-2 text-[#4388FF] underline font-medium hover:text-blue-400 cursor-pointer"
            >
              Enable Browser Notifications for wake alerts
            </button>
          )}
        </div>
      </div>

      {/* Alarms List */}
      <div className="w-full space-y-3">
        {alarms.length === 0 ? (
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-10 text-center">
            <Bell className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No alarms scheduled</h3>
            <p className="text-xs text-neutral-400 mt-1 mb-4">
              Create your first alarm to start waking up with DarkClock Pro.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-[#4388FF] text-white text-xs font-medium cursor-pointer"
            >
              Set an Alarm
            </button>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`w-full bg-[#111111] border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                alarm.isEnabled
                  ? 'border-neutral-700/80 shadow-md'
                  : 'border-neutral-850 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Bell Icon / Tone badge */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    alarm.isEnabled
                      ? 'bg-[#171717] border-neutral-700 text-[#4388FF]'
                      : 'bg-neutral-900 border-neutral-850 text-neutral-600'
                  }`}
                >
                  <Bell className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold font-mono-numbers text-white tracking-tight">
                      {formatDisplayTime(alarm.time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span className="font-medium text-neutral-300">{alarm.label}</span>
                    <span>·</span>
                    <span className="text-[#4388FF]">{formatDaysSummary(alarm.daysOfWeek)}</span>
                    <span>·</span>
                    <span className="capitalize">{alarm.soundTone} tone</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => previewTone(alarm.soundTone)}
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Test Sound Tone"
                >
                  <Play className="w-4 h-4" />
                </button>

                {/* Custom Toggle Switch */}
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                    alarm.isEnabled ? 'bg-[#4388FF]' : 'bg-neutral-800'
                  }`}
                  aria-label="Toggle alarm on or off"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      alarm.isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>

                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-red-950/40 border border-neutral-800 hover:border-red-800 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete alarm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Alarm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#4388FF]" />
                <span>New Alarm</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlarm} className="space-y-4">
              {/* Time Picker */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1.5">Alarm Time</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-700 text-2xl font-mono text-center text-white focus:outline-none focus:border-[#4388FF]"
                />
              </div>

              {/* Label */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1.5">Alarm Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Daily Standup"
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF]"
                />
              </div>

              {/* Repeat Days */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1.5">Repeat on Days</label>
                <div className="grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((w) => {
                    const isSelected = newDays.includes(w.day);
                    return (
                      <button
                        type="button"
                        key={w.day}
                        onClick={() => toggleDaySelection(w.day)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#4388FF] text-white shadow-sm'
                            : 'bg-[#171717] text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  {newDays.length === 0 ? 'Will ring once' : `Repeats: ${formatDaysSummary(newDays)}`}
                </div>
              </div>

              {/* Sound Tone */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1.5">Alarm Sound</label>
                <div className="flex gap-2">
                  <select
                    value={newTone}
                    onChange={(e) => setNewTone(e.target.value as SoundTone)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF] cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#111111]">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => previewTone(newTone)}
                    className="px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                    title="Preview tone"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#171717] border border-neutral-800 text-neutral-300 hover:text-white text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  Save Alarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
