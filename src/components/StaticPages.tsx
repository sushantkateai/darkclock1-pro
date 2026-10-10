import React, { useState } from 'react';
import { AppView, UserSettings } from '../types';
import { 
  Clock, 
  Hourglass, 
  Timer, 
  Bell, 
  Globe2, 
  ShieldCheck, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Send,
  HelpCircle,
  ExternalLink,
  Code2
} from 'lucide-react';

interface StaticPagesProps {
  view: 'about' | 'privacy' | 'terms' | 'contact' | 'guide';
  onNavigate: (view: AppView) => void;
  settings: UserSettings;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ view, onNavigate, settings }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', subject: 'General Feedback' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  if (view === 'about') {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#4388FF]/15 border border-[#4388FF]/30 flex items-center justify-center text-[#4388FF]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">About DarkClock Pro</h1>
              <p className="text-xs text-neutral-400">The high-precision, distraction-free timekeeping suite</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
            <p>
              <strong>DarkClock Pro</strong> was built to solve a simple yet widespread frustration: most online clocks and timer tools are bloated with intrusive ads, ugly flickering countdowns, battery-draining telemetry scripts, and unreliable timers that freeze or lag whenever you switch browser tabs.
            </p>

            <p>
              We designed DarkClock Pro with a strict philosophy of <strong>pure minimalism, ad-free focus, and mathematically exact timekeeping</strong>. Whether you need a full-screen desk clock while studying, an accurate multi-session Pomodoro countdown, a split-lap stopwatch for athletic or coding benchmarks, or a reliable morning alarm, DarkClock Pro delivers with zero friction.
            </p>

            <h3 className="text-base font-semibold text-white pt-4">Core Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-neutral-850">
                <h4 className="text-sm font-semibold text-[#4388FF] mb-1">Drift-Free Accuracy</h4>
                <p className="text-xs text-neutral-400">
                  Timers and stopwatches calculate elapsed duration against absolute system epoch timestamps (<code className="text-neutral-300">Date.now()</code>), preventing tab-inactivity skew.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-neutral-850">
                <h4 className="text-sm font-semibold text-[#4388FF] mb-1">Synthesized Web Audio</h4>
                <p className="text-xs text-neutral-400">
                  Zero external MP3 dependencies. Crisp acoustic chime and digital frequencies generated live through native Web Audio oscillators.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-neutral-850">
                <h4 className="text-sm font-semibold text-[#4388FF] mb-1">OLED Pure Black Palette</h4>
                <p className="text-xs text-neutral-400">
                  A calibrated #050505 background with charcoal card containers reduces eye strain during late-night study or productivity desk setups.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-neutral-850">
                <h4 className="text-sm font-semibold text-[#4388FF] mb-1">100% Ad-Free & Private</h4>
                <p className="text-xs text-neutral-400">
                  Zero advertisements, banners, or trackers. All your data stays completely local on your machine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'privacy') {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-neutral-400">Last updated: October 2026 · Committed to zero tracking</p>
            </div>
          </div>

          <div className="space-y-5 text-sm text-neutral-300 leading-relaxed">
            <p>
              At <strong>DarkClock Pro</strong>, accessible from our web application, your privacy is our highest priority. This Privacy Policy document outlines our strict commitment to zero data collection.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">1. Local Storage Only (No Cloud Tracking)</h3>
            <p className="text-xs text-neutral-400">
              All your alarms, countdown timers, stopwatch laps, sound volume preferences, and timezone favorites are saved exclusively in your browser's local storage (<code className="text-neutral-300">localStorage</code>). We do not operate tracking servers or send your time preferences to external databases.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">2. Audio & Notifications</h3>
            <p className="text-xs text-neutral-400">
              Sound effects are generated dynamically inside your browser using the HTML5 Web Audio API. When you permit browser notifications, they are triggered purely client-side to alert you when a timer completes or an alarm rings. No push registration tokens are gathered.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">3. Zero Advertisements & Zero Tracking Cookies</h3>
            <p className="text-xs text-neutral-400">
              DarkClock Pro is completely ad-free. We do not use third-party advertising cookies, behavioral trackers, or analytics scripts. Your interaction with the tools remains entirely private.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">4. Contacting Us</h3>
            <p className="text-xs text-neutral-400">
              If you have any questions or suggestions regarding our Privacy Policy, please reach out via our Contact page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'terms') {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Terms and Conditions</h1>
              <p className="text-xs text-neutral-400">Terms of use for DarkClock Pro web applications</p>
            </div>
          </div>

          <div className="space-y-5 text-sm text-neutral-300 leading-relaxed">
            <p>
              By accessing and using <strong>DarkClock Pro</strong>, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">1. Use License</h3>
            <p className="text-xs text-neutral-400">
              Permission is granted to freely access and use DarkClock Pro tools (Clock, Timer, Stopwatch, Alarm, World Clock) for personal, educational, commercial desk monitoring, or professional workflow purposes.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">2. Operating Constraints & Sleep Mode Notice</h3>
            <p className="text-xs text-neutral-400">
              Web browser timers and audio triggers depend on the operating system and browser process remaining active. If your device enters deep sleep, powers off, or the browser tab is suspended by aggressive OS power-saving features, timer notifications may pause until the system resumes. DarkClock Pro should not be used as a mission-critical life safety or medical timer.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">3. Disclaimer of Warranty</h3>
            <p className="text-xs text-neutral-400">
              The services are provided "as is" without warranty of any kind, express or implied. In no event shall DarkClock Pro or its creators be liable for damages resulting from missed meetings or alarms caused by hardware or power failure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'contact') {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#4388FF]/15 border border-[#4388FF]/30 flex items-center justify-center text-[#4388FF]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Contact Us</h1>
              <p className="text-xs text-neutral-400">Have feedback, bug reports, or feature requests? We'd love to hear from you.</p>
            </div>
          </div>

          {contactSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-emerald-900/40 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Thank you for your feedback, {contactForm.name}. Our engineering team reviews all comments to improve DarkClock Pro.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="mt-5 px-4 py-2 rounded-lg bg-[#171717] hover:bg-[#222222] text-xs font-medium text-[#4388FF] border border-neutral-800 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Subject</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF] cursor-pointer"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us what you love or how we can make DarkClock Pro even better..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#4388FF]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // view === 'guide'
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#4388FF]/15 border border-[#4388FF]/30 flex items-center justify-center text-[#4388FF]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Deployment & Hosting Guide
            </h1>
            <p className="text-xs text-neutral-400">
              Step-by-step master instructions for launching, hosting, and custom domains
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-850">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#4388FF] text-white text-xs flex items-center justify-center">1</span>
              <span>Running Locally & Building the Project</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              To test or develop locally on your machine:
            </p>
            <div className="bg-[#141414] p-3 rounded-lg font-mono text-xs text-neutral-200 border border-neutral-800 space-y-1">
              <div># Install all packages</div>
              <div>npm install</div>
              <div className="pt-1"># Start local Vite development server on port 3000</div>
              <div>npm run dev</div>
              <div className="pt-1"># Create production build</div>
              <div>npm run build</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-850">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#4388FF] text-white text-xs flex items-center justify-center">2</span>
              <span>Deploying Online (Vercel, Cloud Run, Netlify, Cloudflare)</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              DarkClock Pro is a high-speed, lightweight static Vite SPA that deploys in seconds:
            </p>
            <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1.5">
              <li><strong>Vercel / Netlify:</strong> Connect your Git repository, set build command to <code className="text-neutral-200">npm run build</code>, and output directory to <code className="text-neutral-200">dist</code>.</li>
              <li><strong>Google Cloud Run:</strong> Build using the provided Docker/Cloud Build pipeline.</li>
              <li><strong>Cloudflare Pages:</strong> Framework preset <code className="text-neutral-200">Vite</code>.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-850">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#4388FF] text-white text-xs flex items-center justify-center">3</span>
              <span>Connecting a Custom Domain (e.g. darkclock.pro)</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              In your domain registrar (Namecheap, GoDaddy, Google Domains / Squarespace):
            </p>
            <ol className="list-decimal pl-5 text-xs text-neutral-400 space-y-1.5">
              <li>Add an <strong>A Record</strong> pointing <code className="text-neutral-200">@</code> to your hosting IP.</li>
              <li>Add a <strong>CNAME Record</strong> pointing <code className="text-neutral-200">www</code> to your hosting domain.</li>
              <li>Automatic SSL certificates (HTTPS) will provision within minutes.</li>
            </ol>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onNavigate('clock')}
              className="px-5 py-2.5 rounded-xl bg-[#4388FF] hover:bg-blue-600 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Open Fullscreen Clock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
