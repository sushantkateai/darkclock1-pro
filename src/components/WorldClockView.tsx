import React, { useState, useEffect } from 'react';
import { UserSettings, WorldCity } from '../types';
import { 
  Globe2, 
  Search, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  MapPin, 
  Sun, 
  Moon,
  ArrowRight
} from 'lucide-react';

interface WorldClockViewProps {
  settings: UserSettings;
  cities: WorldCity[];
  onUpdateCities: (cities: WorldCity[]) => void;
  onSelectClockTimezone: (tz: string) => void;
}

// Extensive pre-curated global city directory with accurate IANA timezones
export const POPULAR_WORLD_CITIES = [
  { city: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { city: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { city: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { city: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { city: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { city: 'Hong Kong', country: 'China', timeZone: 'Asia/Hong_Kong' },
  { city: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles' },
  { city: 'Chicago', country: 'United States', timeZone: 'America/Chicago' },
  { city: 'Toronto', country: 'Canada', timeZone: 'America/Toronto' },
  { city: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin' },
  { city: 'Rome', country: 'Italy', timeZone: 'Europe/Rome' },
  { city: 'Madrid', country: 'Spain', timeZone: 'Europe/Madrid' },
  { city: 'Amsterdam', country: 'Netherlands', timeZone: 'Europe/Amsterdam' },
  { city: 'Zürich', country: 'Switzerland', timeZone: 'Europe/Zurich' },
  { city: 'Stockholm', country: 'Sweden', timeZone: 'Europe/Stockholm' },
  { city: 'Cairo', country: 'Egypt', timeZone: 'Africa/Cairo' },
  { city: 'Johannesburg', country: 'South Africa', timeZone: 'Africa/Johannesburg' },
  { city: 'Nairobi', country: 'Kenya', timeZone: 'Africa/Nairobi' },
  { city: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul' },
  { city: 'Shanghai', country: 'China', timeZone: 'Asia/Shanghai' },
  { city: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata' },
  { city: 'Bangkok', country: 'Thailand', timeZone: 'Asia/Bangkok' },
  { city: 'Jakarta', country: 'Indonesia', timeZone: 'Asia/Jakarta' },
  { city: 'Istanbul', country: 'Turkey', timeZone: 'Europe/Istanbul' },
  { city: 'São Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { city: 'Buenos Aires', country: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires' },
  { city: 'Mexico City', country: 'Mexico', timeZone: 'America/Mexico_City' },
  { city: 'Auckland', country: 'New Zealand', timeZone: 'Pacific/Auckland' },
  { city: 'Honolulu', country: 'United States', timeZone: 'Pacific/Honolulu' },
  { city: 'Reykjavik', country: 'Iceland', timeZone: 'Atlantic/Reykjavik' },
];

export const WorldClockView: React.FC<WorldClockViewProps> = ({
  settings,
  cities,
  onUpdateCities,
  onSelectClockTimezone,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddDrawer, setShowAddDrawer] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCity = (cityItem: { city: string; country: string; timeZone: string }) => {
    if (cities.some((c) => c.timeZone === cityItem.timeZone && c.city === cityItem.city)) {
      return;
    }
    const newCity: WorldCity = {
      id: `city-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      city: cityItem.city,
      country: cityItem.country,
      timeZone: cityItem.timeZone,
      isUserAdded: true,
    };
    onUpdateCities([...cities, newCity]);
    setShowAddDrawer(false);
    setSearchQuery('');
  };

  const handleRemoveCity = (id: string) => {
    onUpdateCities(cities.filter((c) => c.id !== id));
  };

  // Filter available cities for add drawer
  const availableCities = POPULAR_WORLD_CITIES.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.city.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      item.timeZone.toLowerCase().includes(query);
    const notAlreadyAdded = !cities.some(
      (c) => c.timeZone === item.timeZone && c.city === item.city
    );
    return matchesSearch && notAlreadyAdded;
  });

  // Calculate time difference between local and target timezone
  const getTimeDifferenceString = (targetTz: string) => {
    try {
      const localDate = new Date();
      // Format both in ISO-like parts
      const targetStr = new Intl.DateTimeFormat('en-US', {
        timeZone: targetTz,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).format(localDate);

      const targetDate = new Date(targetStr);
      const diffHours = Math.round((targetDate.getTime() - localDate.getTime()) / (1000 * 60 * 60));

      if (diffHours === 0) return 'Same time';
      if (diffHours > 0) return `+${diffHours} hrs ahead`;
      return `${diffHours} hrs behind`;
    } catch {
      return 'DST active';
    }
  };

  const getCityDetails = (tz: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour12: !settings.is24Hour,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const parts = formatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '00';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const second = parts.find((p) => p.type === 'second')?.value || '00';
      const period = parts.find((p) => p.type === 'dayPeriod')?.value || '';

      const dateFormatted = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(now);

      // Determine day or night
      const h24 = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(now),
        10
      );
      const isDaytime = h24 >= 6 && h24 < 18;

      return {
        timeString: `${hour}:${minute}`,
        second,
        period,
        dateFormatted,
        isDaytime,
      };
    } catch {
      return {
        timeString: '--:--',
        second: '00',
        period: '',
        dateFormatted: 'Invalid TZ',
        isDaytime: true,
      };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>World Clock</span>
            <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal">
              {cities.length} Cities
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time worldwide cities with automatic daylight saving calculations.
          </p>
        </div>

        <button
          onClick={() => setShowAddDrawer(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-sm shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add City</span>
        </button>
      </div>

      {/* Cities Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((item) => {
          const { timeString, second, period, dateFormatted, isDaytime } = getCityDetails(
            item.timeZone
          );
          const diffString = getTimeDifferenceString(item.timeZone);

          return (
            <div
              key={item.id}
              className="bg-[#111111] border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden shadow-lg"
            >
              {/* Card Top: City & Day/Night Indicator */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{item.city}</span>
                    {isDaytime ? (
                      <span title="Daytime"><Sun className="w-4 h-4 text-amber-400 shrink-0" /></span>
                    ) : (
                      <span title="Nighttime"><Moon className="w-4 h-4 text-blue-400 shrink-0" /></span>
                    )}
                  </h3>
                  <span className="text-xs text-neutral-400 block mt-0.5">{item.country}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectClockTimezone(item.timeZone)}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-[#171717] text-neutral-400 hover:text-[#4388FF] transition-colors cursor-pointer"
                    title="Open on Main Fullscreen Clock"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveCity(item.id)}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/40 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove City"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Middle: Large Digital Time */}
              <div className="my-5 flex items-baseline font-mono-numbers">
                <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  {timeString}
                </span>
                {settings.showSeconds && (
                  <span className="text-xl sm:text-2xl font-light text-[#4388FF] ml-1">
                    .{second}
                  </span>
                )}
                {!settings.is24Hour && period && (
                  <span className="text-xs sm:text-sm font-mono font-semibold text-neutral-400 ml-2 uppercase">
                    {period}
                  </span>
                )}
              </div>

              {/* Card Bottom: Date & Relative Difference */}
              <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-medium text-neutral-300">{dateFormatted}</span>
                <span className="font-mono text-[#4388FF] bg-[#4388FF]/10 px-2 py-0.5 rounded border border-[#4388FF]/20 text-[11px]">
                  {diffString}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add City Modal */}
      {showAddDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#4388FF]" />
                <span>Add World City</span>
              </h3>
              <button
                onClick={() => setShowAddDrawer(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search by city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF]"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 divide-y divide-neutral-850">
              {availableCities.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No matching cities found or already added.
                </div>
              ) : (
                availableCities.map((item) => (
                  <button
                    key={`${item.city}-${item.timeZone}`}
                    onClick={() => handleAddCity(item)}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-[#171717] rounded-lg transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="text-sm font-semibold text-white group-hover:text-[#4388FF] transition-colors block">
                        {item.city}
                      </span>
                      <span className="text-xs text-neutral-400">{item.country} · {item.timeZone}</span>
                    </div>
                    <Plus className="w-4 h-4 text-neutral-500 group-hover:text-[#4388FF] shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
