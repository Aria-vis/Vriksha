import React from 'react';
import { Trees, Compass, Sparkles, MapPin } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-brand-cream text-stone-900">
      {/* Header */}
      <header className="h-16 px-4 bg-brand-green text-white flex items-center justify-between shadow-md z-20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-inner">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-sans tracking-tight leading-tight flex items-center gap-1.5">
              <span>Vriksha</span>
              <span className="text-brand-saffron text-base font-normal">(वृक्ष)</span>
            </h1>
            <p className="text-xs text-emerald-200">Community Map of Useful Plants</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-saffron hover:bg-brand-saffron-light text-white text-xs font-semibold rounded-full shadow transition-colors"
            title="Locate nearest puja & medicinal plants"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Near Me</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-6 bg-white rounded-2xl shadow-xl border border-stone-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 text-brand-green rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-emerald-700 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Google Maps for Trees & Plants</h2>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Find the nearest Neem, Bael, Tulsi, Shami, Peepal, or Durva grass for everyday home remedies, pujas, and festivals across India.
          </p>

          <div className="w-full bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3 text-left mb-4 text-xs text-emerald-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-brand-saffron" />
              <span>Milestone 0: Scaffold Initialized</span>
            </div>
            <p className="text-emerald-700">TypeScript strict, Tailwind CSS, Vitest, and PostGIS architecture configured.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
