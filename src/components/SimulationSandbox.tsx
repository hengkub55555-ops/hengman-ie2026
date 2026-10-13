import React from 'react';
import { SimulationState, Language, Currency, ScenarioPreset } from '../types';
import { TRANSLATIONS, SCENARIO_PRESETS } from '../data/manpowerData';
import { Sliders, RotateCcw, Zap, DollarSign, Users, Sparkles } from 'lucide-react';

interface SimulationSandboxProps {
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
  language: Language;
  onApplyPreset: (preset: ScenarioPreset) => void;
  onResetSimulation: () => void;
  baselineTotal: number;
  simulatedTotalRemain: number;
  simulatedTotalReduce: number;
}

export const SimulationSandbox: React.FC<SimulationSandboxProps> = ({
  simulationState,
  setSimulationState,
  language,
  onApplyPreset,
  onResetSimulation,
  baselineTotal,
  simulatedTotalRemain,
  simulatedTotalReduce,
}) => {
  const t = TRANSLATIONS[language];
  const { shiftCount, globalReductionPercent, monthlySalaryPerPerson, currency, productionVolumeFactor } = simulationState;

  const rateToCurrency = currency === 'THB' ? 1 : currency === 'CNY' ? 1 / 5.05 : 1 / 36.5;
  const currencySymbol = currency === 'THB' ? '฿' : currency === 'CNY' ? '¥' : '$';

  const monthlySavings = simulatedTotalReduce * monthlySalaryPerPerson * rateToCurrency;
  const annualSavings = monthlySavings * 12;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(2)}M`;
    }
    return formatNumber(val);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {t.simulationTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.simulationSubtitle}
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={onResetSimulation}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetDefault}</span>
        </button>
      </div>

      {/* Preset Scenario Tabs */}
      <div className="pt-4 pb-5">
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          {language === 'th' ? 'เลือกแบบจำลองสถานการณ์สำเร็จรูป (Presets)' : language === 'zh' ? '预设推演方案场景 (Presets)' : 'Quick Scenario Presets'}
        </label>
        <div className="flex flex-wrap gap-2">
          {SCENARIO_PRESETS.map((preset) => {
            const isSelected = simulationState.activeScenarioName === preset.id;
            const name = language === 'th' ? preset.nameTh : language === 'zh' ? preset.nameZh : preset.nameEn;
            return (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
        {/* 1. Shift Mode */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>{t.shiftMode}</span>
            <span className="font-bold text-blue-700 tabular-nums">
              {shiftCount} {language === 'th' ? 'กะ/วัน' : language === 'zh' ? '班次/天' : 'Shifts/day'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
            {[1, 2, 3].map((shift) => (
              <button
                key={shift}
                onClick={() => setSimulationState((prev) => ({ ...prev, shiftCount: shift, activeScenarioName: 'custom' }))}
                className={`py-1.5 font-medium rounded transition-colors text-center ${
                  shiftCount === shift
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {shift} {language === 'th' ? 'กะ' : language === 'zh' ? '班' : 'Shift'}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {shiftCount === 1
              ? language === 'th' ? 'กะเดียว 8 ชม. (Single shift standard)' : 'Single shift 8-hr operation'
              : shiftCount === 2
              ? language === 'th' ? '2 กะเช้า/ดึก 16 ชม. (เกณฑ์มาตรฐานตามเอกสาร)' : 'Double shift 16-hr baseline'
              : language === 'th' ? '3 กะ 24 ชม. เต็มศักยภาพโรงงาน' : 'Continuous 24-hr 3-shift peak'}
          </p>
        </div>

        {/* 2. Reduction Target % Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>{t.reductionSlider}</span>
            <span className="font-bold text-rose-600 tabular-nums text-sm">
              {globalReductionPercent.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="0.5"
            value={globalReductionPercent}
            onChange={(e) =>
              setSimulationState((prev) => ({
                ...prev,
                globalReductionPercent: parseFloat(e.target.value),
                activeScenarioName: 'custom',
              }))
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="flex justify-between text-[10px] text-slate-600 tabular-nums">
            <span>0% (No cut)</span>
            <span className="font-semibold text-rose-700">9.7% (2026 Target)</span>
            <span>25% (High Auto)</span>
          </div>
        </div>

        {/* 3. Production Volume Factor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>{language === 'th' ? 'เป้าหมายยอดผลิต (Volume Index)' : language === 'zh' ? '产量负荷系数 (Volume)' : 'Production Volume Factor'}</span>
            <span className="font-bold text-slate-900 tabular-nums text-sm">
              {Math.round(productionVolumeFactor * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.6"
            max="1.4"
            step="0.05"
            value={productionVolumeFactor}
            onChange={(e) =>
              setSimulationState((prev) => ({
                ...prev,
                productionVolumeFactor: parseFloat(e.target.value),
                activeScenarioName: 'custom',
              }))
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
          />
          <div className="flex justify-between text-[10px] text-slate-600 tabular-nums">
            <span>60% (Low)</span>
            <span>100% (Normal)</span>
            <span>140% (Peak)</span>
          </div>
        </div>

        {/* 4. Average Monthly Labor Cost Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>{t.avgSalary}</span>
            <span className="text-[11px] text-slate-600">({currency})</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
              {currencySymbol}
            </span>
            <input
              type="number"
              value={Math.round(monthlySalaryPerPerson * rateToCurrency)}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setSimulationState((prev) => ({
                  ...prev,
                  monthlySalaryPerPerson: val / rateToCurrency,
                }));
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
            />
          </div>
          <p className="text-[10px] text-slate-600">
            {language === 'th'
              ? 'คำนวณฐานเงินเดือน + สวัสดิการ + ประกันสังคม'
              : 'Includes base wages + welfare + statutory benefits'}
          </p>
        </div>
      </div>

      {/* Real-Time Outcome Summary Strip */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {language === 'th' ? 'ผลลัพธ์การประหยัดต้นทุนจากการจำลอง (Simulated Savings)' : language === 'zh' ? '当前推演情景测算综合效益' : 'Simulated Cost Benefit Impact'}
            </div>
            <div className="text-base font-bold text-slate-900 tabular-nums flex items-baseline gap-2 mt-0.5">
              <span className="text-emerald-700">
                +{currencySymbol}{formatCurrency(annualSavings)} / {language === 'th' ? 'ปี' : language === 'zh' ? '年' : 'yr'}
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({currencySymbol}{formatCurrency(monthlySavings)} / {language === 'th' ? 'เดือน' : language === 'zh' ? '月' : 'mo'})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-500 block">{language === 'th' ? 'กำลังคนที่ลดได้' : language === 'zh' ? '测算减少人数' : 'Reduced MP'}</span>
            <span className="font-bold text-rose-600 text-sm tabular-nums">
              -{formatNumber(simulatedTotalReduce)} {language === 'th' ? 'คน' : language === 'zh' ? '人' : 'pax'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{language === 'th' ? 'ยอดคนคงเหลือใช้งาน' : language === 'zh' ? '在册留存编制' : 'Simulated Active MP'}</span>
            <span className="font-bold text-blue-700 text-sm tabular-nums">
              {formatNumber(simulatedTotalRemain)} {language === 'th' ? 'คน' : language === 'zh' ? '人' : 'pax'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
