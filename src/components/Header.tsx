import React from 'react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../data/manpowerData';
import { Download, Globe } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currency,
  setCurrency,
  onOpenReport,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
              MP
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                Thailand MP Outlook 2026
              </span>
              <span className="text-[11px] text-slate-700 hidden sm:inline leading-none font-medium">
                泰国26年用人汇总 · 减员版
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation / Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-slate-600 hidden sm:inline" />
              <button
                onClick={() => setLanguage('th')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'th' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
                title="ไทย"
              >
                ไทย
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'zh' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
                title="中文"
              >
                中文
              </button>
            </div>

            {/* Currency selector */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setCurrency('THB')}
                className={`px-2 py-1 rounded transition-colors ${
                  currency === 'THB' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                THB (฿)
              </button>
              <button
                onClick={() => setCurrency('CNY')}
                className={`px-2 py-1 rounded transition-colors ${
                  currency === 'CNY' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                CNY (¥)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded transition-colors ${
                  currency === 'USD' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'พิมพ์รายงานผู้บริหาร' : language === 'zh' ? '高管决策报告' : 'Executive Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
