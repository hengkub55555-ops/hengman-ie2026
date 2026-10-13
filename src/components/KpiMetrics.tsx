import React from 'react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../data/manpowerData';
import { Users, UserMinus, UserCheck, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface KpiMetricsProps {
  language: Language;
  currency: Currency;
  totalSingleShift: number;
  totalBaseline: number;
  totalReduced: number;
  totalRemaining: number;
  monthlySalary: number;
  shiftCount: number;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({
  language,
  currency,
  totalSingleShift,
  totalBaseline,
  totalReduced,
  totalRemaining,
  monthlySalary,
  shiftCount,
}) => {
  const t = TRANSLATIONS[language];

  // Currency multiplier relative to THB
  const rateToCurrency = currency === 'THB' ? 1 : currency === 'CNY' ? 1 / 5.05 : 1 / 36.5;
  const currencySymbol = currency === 'THB' ? '฿' : currency === 'CNY' ? '¥' : '$';

  const monthlySavingsRaw = totalReduced * monthlySalary * rateToCurrency;
  const annualSavingsRaw = monthlySavingsRaw * 12;

  const reductionPercentage = totalBaseline > 0 ? (totalReduced / totalBaseline) * 100 : 0;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : language === 'th' ? 'th-TH' : 'en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  };

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(2)}M`;
    }
    return formatNumber(val);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Single Shift Quota */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium truncate">{t.kpiSingleShift}</span>
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatNumber(totalSingleShift)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'th' ? '1 กะ / 8 ชั่วโมง' : language === 'zh' ? '单班标配 8h' : '1 shift / 8 hours'}
          </p>
        </div>
      </div>

      {/* 2. Total Baseline */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium truncate">
            {shiftCount === 2 ? t.kpiDoubleShift : `${shiftCount} ${language === 'th' ? 'กะการผลิต' : language === 'zh' ? '班基准' : 'Shifts Base'}`}
          </span>
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-blue-900 tabular-nums">
            {formatNumber(totalBaseline)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'th' ? 'ฐานคำนวณเดิม' : language === 'zh' ? '优化前核定基准' : 'Pre-reduction baseline'}
          </p>
        </div>
      </div>

      {/* 3. Reduced Manpower */}
      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-rose-50/40">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold text-rose-700 truncate">{t.kpiTotalReduction}</span>
          <UserMinus className="w-4 h-4 text-rose-600 shrink-0" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-rose-600 tabular-nums flex items-baseline gap-1.5">
            <span>-{formatNumber(totalReduced)}</span>
            <span className="text-xs font-medium text-rose-700">({reductionPercentage.toFixed(1)}%)</span>
          </div>
          <p className="text-[11px] text-rose-600/80 mt-0.5">
            {language === 'th' ? 'ลดคนผ่านระบบอัตโนมัติ' : language === 'zh' ? '自动化及精益减编' : 'Automation & Kaizen'}
          </p>
        </div>
      </div>

      {/* 4. Remaining Manpower */}
      <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold text-emerald-800 truncate">{t.kpiRemainingMP}</span>
          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
            {formatNumber(totalRemaining)}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">
            {language === 'th' ? 'กำลังคงเหลือเป้าหมาย' : language === 'zh' ? '留存上岗核心定编' : 'Post-rationalization'}
          </p>
        </div>
      </div>

      {/* 5. Monthly Savings */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium truncate">{t.kpiCostSavingMonthly}</span>
          <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums flex items-baseline">
            <span className="text-base text-slate-500 mr-0.5">{currencySymbol}</span>
            <span>{formatCurrency(monthlySavingsRaw)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'th' ? '/ เดือน (Est.)' : language === 'zh' ? '每月节约' : '/ month'}
          </p>
        </div>
      </div>

      {/* 6. Annual Savings */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium truncate">{t.kpiCostSavingAnnual}</span>
          <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-blue-700 tabular-nums flex items-baseline">
            <span className="text-base text-slate-500 mr-0.5">{currencySymbol}</span>
            <span>{formatCurrency(annualSavingsRaw)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'th' ? '/ ปี (ROI สูงสุด)' : language === 'zh' ? '全年累计效益' : '/ year (cumulative)'}
          </p>
        </div>
      </div>
    </div>
  );
};
