import React, { useState, useMemo, useEffect } from 'react';
import { MonthlyMpUphData, Language } from '../types';
import { MONTHLY_MP_UPH_DATA } from '../data/manpowerData';
import { MonthlyEditModal } from './MonthlyEditModal';
import {
  TrendingUp,
  Users,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Download,
  CheckCircle2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';

interface MonthlyMpUphChartProps {
  language: Language;
  onNotification?: (msg: string) => void;
}

const LOCAL_STORAGE_KEY = 'thailand_factory_monthly_mp_uph_2026';

export const MonthlyMpUphChart: React.FC<MonthlyMpUphChartProps> = ({ language, onNotification }) => {
  // Load initial data from localStorage if available, otherwise baseline
  const [dataList, setDataList] = useState<MonthlyMpUphData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 12) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved monthly data', e);
    }
    return MONTHLY_MP_UPH_DATA;
  });

  const [shiftMode, setShiftMode] = useState<'double' | 'single'>('double');
  const [selectedQuarter, setSelectedQuarter] = useState<'ALL' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('ALL');
  const [uphMultiplier, setUphMultiplier] = useState<number>(1.0);
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

  // Editing state
  const [editingModalItem, setEditingModalItem] = useState<MonthlyMpUphData | null>(null);
  const [isInlineEditMode, setIsInlineEditMode] = useState<boolean>(false);
  const [inlineDraft, setInlineDraft] = useState<MonthlyMpUphData[]>(dataList);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  // Sync inline draft when dataList changes
  useEffect(() => {
    setInlineDraft(dataList);
  }, [dataList]);

  // Compute dynamic data based on uphMultiplier and active editing draft
  const currentWorkingData = isInlineEditMode ? inlineDraft : dataList;

  const monthlyData = useMemo(() => {
    return currentWorkingData.map((item) => {
      const adjustedTargetUph = Math.round(item.targetUph * uphMultiplier);
      const mpToUse = shiftMode === 'double' ? item.plannedMpDoubleShift : item.plannedMpSingleShift;
      const singleShiftMp = item.plannedMpSingleShift;
      const adjustedUpph = singleShiftMp > 0 ? Number((adjustedTargetUph / singleShiftMp).toFixed(3)) : 0;
      const adjustedVolume = Math.round(item.productionVolumeTarget * uphMultiplier);

      return {
        ...item,
        adjustedTargetUph,
        displayMp: mpToUse,
        adjustedUpph,
        adjustedVolume,
      };
    });
  }, [currentWorkingData, shiftMode, uphMultiplier]);

  // Save to localStorage & state
  const saveAllData = (newData: MonthlyMpUphData[]) => {
    setDataList(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);

    const msg =
      language === 'th'
        ? 'บันทึกเป้าหมาย MP และ UPH รายเดือนปี 2026 เรียบร้อยแล้ว'
        : 'Monthly MP & UPH targets saved successfully!';
    if (onNotification) {
      onNotification(msg);
    }
  };

  // Reset to default baseline
  const handleResetToBaseline = () => {
    if (
      window.confirm(
        language === 'th'
          ? 'ต้องการคืนค่าเป้าหมายรายเดือนกลับสู่แผนทางการเริ่มต้นหรือไม่?'
          : 'Reset monthly targets to official baseline plan?'
      )
    ) {
      setDataList(MONTHLY_MP_UPH_DATA);
      setInlineDraft(MONTHLY_MP_UPH_DATA);
      setIsInlineEditMode(false);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        // ignore
      }
      const msg =
        language === 'th'
          ? 'คืนค่าเริ่มต้นตามแผนทางการ 2026 สำเร็จ'
          : 'Reset to official 2026 baseline';
      if (onNotification) onNotification(msg);
    }
  };

  // Save from modal
  const handleSaveModalItem = (updated: MonthlyMpUphData) => {
    const nextList = dataList.map((item) => (item.monthIndex === updated.monthIndex ? updated : item));
    saveAllData(nextList);
  };

  // Save from inline edit
  const handleSaveInlineChanges = () => {
    // Recalculate single shift, reduction, and upph for each
    const cleaned = inlineDraft.map((item) => {
      const single = Math.round(item.plannedMpDoubleShift / 2);
      const reduction = Math.max(0, 2480 - item.plannedMpDoubleShift);
      const upph = single > 0 ? Number((item.targetUph / single).toFixed(3)) : 0;
      return {
        ...item,
        plannedMpSingleShift: single,
        cumulativeReduction: reduction,
        upph,
      };
    });
    saveAllData(cleaned);
    setIsInlineEditMode(false);
  };

  // Cancel inline edits
  const handleCancelInline = () => {
    setInlineDraft(dataList);
    setIsInlineEditMode(false);
  };

  // Inline field update
  const handleInlineChange = (index: number, field: keyof MonthlyMpUphData, value: any) => {
    setInlineDraft((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] };
      (target as any)[field] = value;

      if (field === 'plannedMpDoubleShift') {
        const double = parseInt(value) || 0;
        target.plannedMpDoubleShift = double;
        target.plannedMpSingleShift = Math.round(double / 2);
        target.cumulativeReduction = Math.max(0, 2480 - double);
        if (target.plannedMpSingleShift > 0) {
          target.upph = Number((target.targetUph / target.plannedMpSingleShift).toFixed(3));
        }
      } else if (field === 'targetUph') {
        const uph = parseInt(value) || 0;
        target.targetUph = uph;
        if (target.plannedMpSingleShift > 0) {
          target.upph = Number((uph / target.plannedMpSingleShift).toFixed(3));
        }
      }

      copy[index] = target;
      return copy;
    });
  };

  // Overall KPIs
  const startMp = monthlyData[0].displayMp;
  const endMp = monthlyData[monthlyData.length - 1].displayMp;
  const mpDelta = endMp - startMp;
  const mpDeltaPct = startMp > 0 ? ((mpDelta / startMp) * 100).toFixed(1) : '0';

  const startUph = monthlyData[0].adjustedTargetUph;
  const endUph = monthlyData[monthlyData.length - 1].adjustedTargetUph;
  const uphDelta = endUph - startUph;
  const uphDeltaPct = startUph > 0 ? (((endUph - startUph) / startUph) * 100).toFixed(1) : '0';

  const startUpph = monthlyData[0].adjustedUpph;
  const endUpph = monthlyData[monthlyData.length - 1].adjustedUpph;
  const productivityLift = startUpph > 0 ? (((endUpph - startUpph) / startUpph) * 100).toFixed(1) : '0';

  // SVG Chart Dimensions
  const svgWidth = 840;
  const svgHeight = 320;
  const padding = { top: 35, right: 65, bottom: 45, left: 65 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Scales
  const allDisplayMp = monthlyData.map((d) => d.displayMp);
  const minMpVal = Math.min(...allDisplayMp);
  const maxMpVal = Math.max(...allDisplayMp);
  const minMp = Math.max(0, Math.floor(minMpVal * 0.96));
  const maxMp = Math.ceil(maxMpVal * 1.04);

  const allUphVal = monthlyData.map((d) => d.adjustedTargetUph);
  const minUphVal = Math.min(...allUphVal);
  const maxUphVal = Math.max(...allUphVal);
  const minUph = Math.max(0, Math.floor(minUphVal * 0.95));
  const maxUph = Math.ceil(maxUphVal * 1.05);

  const getX = (idx: number) => {
    return padding.left + (idx / (monthlyData.length - 1)) * chartWidth;
  };

  const getYMp = (mp: number) => {
    if (maxMp === minMp) return padding.top + chartHeight / 2;
    const clamped = Math.max(minMp, Math.min(maxMp, mp));
    return padding.top + chartHeight - ((clamped - minMp) / (maxMp - minMp)) * chartHeight;
  };

  const getYUph = (uph: number) => {
    if (maxUph === minUph) return padding.top + chartHeight / 2;
    const clamped = Math.max(minUph, Math.min(maxUph, uph));
    return padding.top + chartHeight - ((clamped - minUph) / (maxUph - minUph)) * chartHeight;
  };

  // Generate SVG path strings
  const mpPoints = monthlyData.map((d, i) => `${getX(i)},${getYMp(d.displayMp)}`).join(' ');
  const uphPoints = monthlyData.map((d, i) => `${getX(i)},${getYUph(d.adjustedTargetUph)}`).join(' ');

  // Area under MP curve
  const mpAreaPath = `M ${getX(0)},${padding.top + chartHeight} L ${mpPoints} L ${getX(
    monthlyData.length - 1
  )},${padding.top + chartHeight} Z`;

  // Hovered item
  const hoveredItem = hoveredMonthIndex !== null ? monthlyData[hoveredMonthIndex] : null;

  // Export CSV function
  const handleExportMonthlyCsv = () => {
    const headers = [
      'Month',
      'Quarter',
      'Manpower (Double Shift)',
      'Manpower (Single Shift)',
      'Cumulative MP Reduction',
      'Target UPH (Units/Hour)',
      'Baseline UPH',
      'Labor Productivity UPPH (Units/Person-Hour)',
      'Target Monthly Volume',
      'Milestone & Kaizen Project',
    ];

    const rows = monthlyData.map((d) => [
      `"${d.month}"`,
      `"${d.quarter}"`,
      d.plannedMpDoubleShift,
      d.plannedMpSingleShift,
      d.cumulativeReduction,
      d.adjustedTargetUph,
      d.baselineUph,
      d.adjustedUpph,
      d.adjustedVolume,
      `"${d.milestoneTh.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Thailand_2026_Monthly_MP_vs_UPH_Outlook_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>
                  {language === 'th'
                    ? 'กราฟเปรียบเทียบกำลังคน (MP) รายเดือน กับเป้าหมายผลผลิต (UPH Target)'
                    : language === 'zh'
                    ? '2026年月度用人定编 (MP) 与产出节拍 (UPH Target) 对比走势'
                    : 'Monthly Manpower (MP) vs UPH Production Target Outlook'}
                </span>
                {justSaved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-in fade-in">
                    <Check className="w-3 h-3" />
                    <span>บันทึกแล้ว</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'th'
                  ? 'สามารถคลิกปุ่ม "แก้ไขตาราง" หรือกดไอคอนดินสอในแต่ละเดือนเพื่อปรับเปลี่ยนและบันทึกข้อมูลได้ตามจริง'
                  : 'Click "Edit Table" or row edit icon to customize and save monthly targets'}
              </p>
            </div>
          </div>
        </div>

        {/* Action & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Shift Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setShiftMode('double')}
              className={`px-2.5 py-1 rounded transition-colors ${
                shiftMode === 'double' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              {language === 'th' ? 'โหมด 2 กะ (Double Shift)' : '2 Shifts'}
            </button>
            <button
              onClick={() => setShiftMode('single')}
              className={`px-2.5 py-1 rounded transition-colors ${
                shiftMode === 'single' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              {language === 'th' ? 'โหมด 1 กะ (Single Shift)' : '1 Shift'}
            </button>
          </div>

          {/* Inline Edit Toggle Button */}
          {!isInlineEditMode ? (
            <button
              onClick={() => setIsInlineEditMode(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'แก้ไขตาราง (Edit Table)' : 'Edit Table'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSaveInlineChanges}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'บันทึกข้อมูล (Save)' : 'Save All'}</span>
              </button>
              <button
                onClick={handleCancelInline}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg transition-colors"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={handleResetToBaseline}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="คืนค่าเริ่มต้นตามแผนทางการ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Export Monthly CSV */}
          <button
            onClick={handleExportMonthlyCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Download Monthly MP vs UPH Data CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Manpower Trend */}
        <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-blue-900">
              {language === 'th' ? 'กำลังคน (MP) ม.ค. → ธ.ค.' : 'Manpower (Jan → Dec)'}
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 tabular-nums flex items-baseline gap-2">
              <span>{startMp} → {endMp}</span>
              <span className="text-xs font-bold text-rose-600 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {mpDelta} ({mpDeltaPct}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {shiftMode === 'double' ? `ฐาน 2 กะ (ลด ${Math.abs(mpDelta)} คน)` : `ฐาน 1 กะ (ลด ${Math.abs(mpDelta)} คน)`}
            </p>
          </div>
        </div>

        {/* 2. UPH Target */}
        <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-emerald-900">
              {language === 'th' ? 'เป้าหมายผลผลิต (UPH Target)' : 'Production UPH Target'}
            </span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums flex items-baseline gap-2">
              <span>{startUph} → {endUph}</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{uphDelta} (+{uphDeltaPct}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'th' ? 'ยกระดับ Takt Time สิ้นปี' : 'Speed increased to 275 UPH'}
            </p>
          </div>
        </div>

        {/* 3. Labor Productivity (UPPH) */}
        <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-amber-900">
              {language === 'th' ? 'ผลิตภาพแรงงาน (UPPH)' : 'Labor UPPH (Units/Man-Hr)'}
            </span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-700 tabular-nums flex items-baseline gap-2">
              <span>{startUpph} → {endUpph}</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{productivityLift}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'th' ? 'ชิ้นผลิตต่องาน 1 คน/ชม.' : 'Output per operator hour'}
            </p>
          </div>
        </div>

        {/* 4. Target Annual Volume */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">
              {language === 'th' ? 'เป้ายอดผลิตรวม 2026' : '2026 Planned Volume'}
            </span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">
              {(monthlyData.reduce((acc, d) => acc + d.adjustedVolume, 0) / 1000).toFixed(1)}k ชิ้น
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'th' ? 'รองรับยอดขายปี 2026' : 'Full year production volume'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Dual-Axis SVG Chart */}
      <div className="space-y-2">
        {/* Chart Legend & Takt Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pb-1">
          <div className="flex items-center gap-5">
            {/* MP Line Legend */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-blue-700 rounded-full inline-block"></span>
              <span className="font-semibold text-blue-900">
                {language === 'th' ? 'กำลังคน (MP Headcount)' : 'Manpower (MP)'}
              </span>
              <span className="text-[11px] text-slate-600">(แกนซ้าย)</span>
            </div>

            {/* UPH Line Legend */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-emerald-600 rounded-full inline-block"></span>
              <span className="font-semibold text-emerald-800">
                {language === 'th' ? 'เป้าหมายผลิตภาพ (Target UPH)' : 'Target UPH'}
              </span>
              <span className="text-[11px] text-slate-600">(แกนขวา)</span>
            </div>

            {/* Baseline UPH reference */}
            <div className="hidden md:flex items-center gap-2 text-slate-600">
              <span className="w-3 h-0.5 border-b border-dashed border-slate-500 inline-block"></span>
              <span>Baseline 240 UPH</span>
            </div>
          </div>

          {/* UPH Multiplier simulation slider */}
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-[11px] text-slate-600 font-medium">
              {language === 'th' ? 'จำลองปรับเป้า UPH:' : 'UPH Target Scale:'}
            </span>
            <input
              type="range"
              min="0.9"
              max="1.2"
              step="0.05"
              value={uphMultiplier}
              onChange={(e) => setUphMultiplier(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="font-bold tabular-nums text-emerald-700 text-xs w-10 text-right">
              {Math.round(uphMultiplier * 100)}%
            </span>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative w-full bg-slate-50/60 rounded-xl border border-slate-200 p-2 overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] overflow-visible select-none"
          >
            <defs>
              <linearGradient id="mpAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = padding.top + chartHeight * ratio;
              const mpVal = Math.round(maxMp - (maxMp - minMp) * ratio);
              const uphVal = Math.round(maxUph - (maxUph - minUph) * ratio);

              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="3,3"
                    strokeWidth="1"
                  />
                  {/* Left Axis label (MP) */}
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-blue-700 font-medium font-mono"
                  >
                    {mpVal}
                  </text>
                  {/* Right Axis label (UPH) */}
                  <text
                    x={padding.left + chartWidth + 10}
                    y={y + 4}
                    textAnchor="start"
                    className="text-[10px] fill-emerald-700 font-medium font-mono"
                  >
                    {uphVal}
                  </text>
                </g>
              );
            })}

            {/* Left Axis Title */}
            <text
              x={padding.left - 8}
              y={padding.top - 12}
              textAnchor="end"
              className="text-[10px] font-bold fill-blue-900"
            >
              MP (คน)
            </text>

            {/* Right Axis Title */}
            <text
              x={padding.left + chartWidth + 8}
              y={padding.top - 12}
              textAnchor="start"
              className="text-[10px] font-bold fill-emerald-800"
            >
              UPH (ชิ้น/ชม.)
            </text>

            {/* Baseline 240 UPH guideline */}
            <line
              x1={padding.left}
              y1={getYUph(Math.round(240 * uphMultiplier))}
              x2={padding.left + chartWidth}
              y2={getYUph(Math.round(240 * uphMultiplier))}
              stroke="#94a3b8"
              strokeDasharray="4,4"
              strokeWidth="1.2"
            />

            {/* MP Area fill */}
            <path d={mpAreaPath} fill="url(#mpAreaGradient)" />

            {/* MP Trend Line (Downward) */}
            <polyline
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={mpPoints}
            />

            {/* UPH Target Line (Upward) */}
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={uphPoints}
            />

            {/* Data Points and Interactivity */}
            {monthlyData.map((d, i) => {
              const x = getX(i);
              const yMp = getYMp(d.displayMp);
              const yUph = getYUph(d.adjustedTargetUph);
              const isHovered = hoveredMonthIndex === i;

              return (
                <g key={d.monthIndex}>
                  {/* Vertical hover guide */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartHeight}
                      stroke="#64748b"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Month Label (X Axis) */}
                  <text
                    x={x}
                    y={padding.top + chartHeight + 20}
                    textAnchor="middle"
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? 'fill-slate-950 font-bold' : 'fill-slate-500'
                    }`}
                  >
                    {language === 'th' ? d.monthNameTh : language === 'zh' ? d.monthNameZh : d.month}
                  </text>

                  {/* MP Dot */}
                  <circle
                    cx={x}
                    cy={yMp}
                    r={isHovered ? 6 : 4}
                    fill="#1d4ed8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-150"
                  />

                  {/* UPH Dot */}
                  <circle
                    cx={x}
                    cy={yUph}
                    r={isHovered ? 6 : 4}
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-150"
                  />

                  {/* Transparent hover capture column */}
                  <rect
                    x={x - (chartWidth / 11) / 2}
                    y={padding.top}
                    width={chartWidth / 11}
                    height={chartHeight + 30}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredMonthIndex(i)}
                    onMouseLeave={() => setHoveredMonthIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip Box */}
          {hoveredItem && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {language === 'th' ? hoveredItem.monthNameTh : hoveredItem.month}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {hoveredItem.quarter}
                </span>
                <span className="text-slate-600 hidden sm:inline">
                  • {language === 'th' ? hoveredItem.milestoneTh : hoveredItem.milestoneEn}
                </span>
              </div>

              <div className="flex items-center gap-6 tabular-nums">
                <div>
                  <span className="text-slate-500 mr-1.5">MP:</span>
                  <span className="font-bold text-blue-700">{hoveredItem.displayMp} คน</span>
                  <span className="text-rose-600 text-[11px] ml-1">
                    (-{shiftMode === 'double' ? hoveredItem.cumulativeReduction : Math.round(hoveredItem.cumulativeReduction / 2)})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 mr-1.5">UPH Target:</span>
                  <span className="font-bold text-emerald-700">{hoveredItem.adjustedTargetUph} UPH</span>
                </div>
                <div>
                  <span className="text-slate-500 mr-1.5">UPPH:</span>
                  <span className="font-bold text-amber-700">{hoveredItem.adjustedUpph}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Detailed Breakdown Table with Direct Edit and Save */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>
                {language === 'th'
                  ? 'ตารางแจกแจงเป้าหมาย MP และ UPH ประจำเดือนปี 2026'
                  : language === 'zh'
                  ? '2026年月度定编与UPH推进明细表'
                  : '2026 Monthly Manpower & UPH Progression Table'}
              </span>
              {isInlineEditMode && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  กำลังอยู่ในโหมดแก้ไข (Editing)
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'th'
                ? 'สามารถแก้ไขตัวเลขในตารางได้โดยตรง หรือกดปุ่มแก้ไขรายแถวเพื่อระบุข้อมูล'
                : 'Directly modify monthly values below and click Save'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isInlineEditMode ? (
              <button
                onClick={handleSaveInlineChanges}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'บันทึกการแก้ไขทั้งหมด' : 'Save Changes'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsInlineEditMode(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'แก้ไขตารางนี้' : 'Edit Table'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                <th className="py-2.5 px-3 border-r border-slate-200">เดือน (Month)</th>
                <th className="py-2.5 px-2 text-center border-r border-slate-200">กะ</th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200">
                  {shiftMode === 'double' ? 'MP (2 กะ)' : 'MP (1 กะ)'}
                </th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200 text-rose-600">
                  ลดสะสม (คน)
                </th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200 text-emerald-700">
                  UPH Target
                </th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200 text-amber-700">
                  UPPH ผลิตภาพ
                </th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200 hidden md:table-cell">
                  เป้ายอดผลิต/เดือน
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">แผนงานสำคัญ / Kaizen Milestone</th>
                <th className="py-2.5 px-2 text-center w-14">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(isInlineEditMode ? inlineDraft : monthlyData).map((item, idx) => {
                const isQuarterEnd = item.monthIndex % 3 === 0;

                return (
                  <tr
                    key={item.monthIndex}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      isQuarterEnd ? 'bg-slate-50/70 font-medium' : 'bg-white'
                    }`}
                  >
                    {/* Month Name */}
                    <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-slate-900 whitespace-nowrap">
                      {language === 'th' ? item.monthNameTh : item.month}
                    </td>

                    {/* Quarter */}
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 text-slate-500 text-[11px]">
                      {item.quarter}
                    </td>

                    {/* MP Quota Input / Display */}
                    <td className="py-2 px-3 border-r border-slate-200 text-right tabular-nums">
                      {isInlineEditMode ? (
                        <input
                          type="number"
                          value={item.plannedMpDoubleShift}
                          onChange={(e) =>
                            handleInlineChange(idx, 'plannedMpDoubleShift', e.target.value)
                          }
                          className="w-20 px-2 py-1 text-right font-bold text-blue-900 border border-blue-300 rounded focus:ring-1 focus:ring-blue-600 bg-blue-50/30"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900">
                          {shiftMode === 'double'
                            ? item.plannedMpDoubleShift.toLocaleString()
                            : item.plannedMpSingleShift.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Cumulative reduction */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right tabular-nums font-bold text-rose-600">
                      -{shiftMode === 'double' ? item.cumulativeReduction : Math.round(item.cumulativeReduction / 2)}
                    </td>

                    {/* Target UPH Input / Display */}
                    <td className="py-2 px-3 border-r border-slate-200 text-right tabular-nums">
                      {isInlineEditMode ? (
                        <input
                          type="number"
                          value={item.targetUph}
                          onChange={(e) => handleInlineChange(idx, 'targetUph', e.target.value)}
                          className="w-16 px-2 py-1 text-right font-bold text-emerald-700 border border-emerald-300 rounded focus:ring-1 focus:ring-emerald-600 bg-emerald-50/30"
                        />
                      ) : (
                        <span className="font-bold text-emerald-700">
                          {(item as any).adjustedTargetUph ?? item.targetUph}
                        </span>
                      )}
                    </td>

                    {/* UPPH */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right tabular-nums font-semibold text-amber-700">
                      {(item as any).adjustedUpph ?? item.upph}
                    </td>

                    {/* Monthly Volume */}
                    <td className="py-2 px-3 border-r border-slate-200 text-right tabular-nums text-slate-600 hidden md:table-cell">
                      {isInlineEditMode ? (
                        <input
                          type="number"
                          value={item.productionVolumeTarget}
                          onChange={(e) =>
                            handleInlineChange(idx, 'productionVolumeTarget', parseInt(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 text-right text-slate-800 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                        />
                      ) : (
                        <span>{((item as any).adjustedVolume ?? item.productionVolumeTarget).toLocaleString()}</span>
                      )}
                    </td>

                    {/* Milestone Note */}
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-600 text-[11px]">
                      {isInlineEditMode ? (
                        <input
                          type="text"
                          value={item.milestoneTh}
                          onChange={(e) => handleInlineChange(idx, 'milestoneTh', e.target.value)}
                          className="w-full px-2 py-1 text-slate-800 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 text-xs"
                        />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {isQuarterEnd && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          <span>{language === 'th' ? item.milestoneTh : item.milestoneEn}</span>
                        </span>
                      )}
                    </td>

                    {/* Row Edit Action */}
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => setEditingModalItem(item)}
                        className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        title="แก้ไขเดือนนี้"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action bar when in inline edit mode */}
        {isInlineEditMode && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {language === 'th'
                  ? 'คุณได้ทำการปรับเปลี่ยนข้อมูลในตารางแล้ว อย่าลืมกดปุ่ม "บันทึกข้อมูล" เพื่ออัปเดตกราฟและบันทึกลงระบบ'
                  : 'You have unsaved changes. Click Save Changes to update the graph and persist data.'}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelInline}
                className="px-3 py-1 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveInlineChanges}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'บันทึกข้อมูล' : 'Save'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Row Edit Modal */}
      <MonthlyEditModal
        monthItem={editingModalItem}
        isOpen={Boolean(editingModalItem)}
        onClose={() => setEditingModalItem(null)}
        onSave={handleSaveModalItem}
        language={language}
        baselineMp={2480}
      />
    </div>
  );
};
