import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Check } from 'lucide-react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dbatu_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth entrance animation
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('dbatu_cookie_consent', 'accepted_all');
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('dbatu_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside aria-label="Cookie Privacy Consent Notice" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/95 text-slate-100 p-5 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md transition-all duration-300">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl mt-0.5">
          <Cookie className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
            Privacy & Cookie Preferences
          </h4>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            We use essential cookies to provide site security, analytics, and non-intrusive operational functions in compliance with India's DPDP Act 2023.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Accept All
            </button>
            <button
              onClick={handleAcceptEssential}
              className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 focus:ring-2 focus:ring-slate-400 focus:outline-none"
            >
              Essential Only
            </button>
            <a
              href="/privacy-policy"
              className="text-xs text-blue-400 hover:text-blue-300 underline ml-auto font-medium"
            >
              Read Policy
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
