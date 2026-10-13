import React, { useState } from 'react';
import { DepartmentData, Language } from '../types';
import { TRANSLATIONS } from '../data/manpowerData';
import { BarChart3, PieChart, Layers, HelpCircle } from 'lucide-react';

interface VisualAnalyticsProps {
  data: DepartmentData[];
  language: Language;
}

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({ data, language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'comparison' | 'waterfall' | 'distribution'>('comparison');
  const [hoveredDept, setHoveredDept] = useState<DepartmentData | null>(null);

  // Compute metrics
  const totalDoubleShift = data.reduce((acc, d) => acc + d.doubleShiftQuota, 0);
  const totalReduce = data.reduce((acc, d) => acc + d.reduceManpower, 0);
  const maxQuota = Math.max(...data.map((d) => d.doubleShiftQuota), 1);

  // Department colors for visual mapping
  const processColors: Record<string, string> = {
    Assembly: '#2563eb', // Blue
    'Press & Door': '#0284c7', // Sky
    Thermoforming: '#0d9488', // Teal
    Molding: '#7c3aed', // Purple
    'Quality QC': '#ea580c', // Orange
    'Internal Logistics': '#4f46e5', // Indigo
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      {/* Header and Chart Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-700" />
            <span>
              {language === 'th'
                ? 'การวิเคราะห์โครงสร้างกำลังคนเชิงภาพ (Workforce Visual Analytics)'
                : language === 'zh'
                ? '定编结构与减员效能多维分析'
                : 'Headcount Structure & Rationalization Analytics'}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'th'
              ? 'เปรียบเทียบสัดส่วนยอดคน ยอดลด และการกระจายตัวของกำลังคนตามสายการผลิต'
              : language === 'zh'
              ? '对比基准定编、减员贡献度与车间工段占比'
              : 'Compare pre/post reduction quotas and distribution across production lines'}
          </p>
        </div>

        {/* Tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'comparison' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'th' ? 'ก่อน/หลังลดคน' : language === 'zh' ? '定编增减对比' : 'Pre vs Post'}
          </button>
          <button
            onClick={() => setActiveTab('waterfall')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'waterfall' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'th' ? 'น้ำตกการลดคน (Waterfall)' : language === 'zh' ? '减员贡献瀑布' : 'Reduction Waterfall'}
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'distribution' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'th' ? 'สัดส่วนตามแผนก' : language === 'zh' ? '工段结构占比' : 'Workforce Share'}
          </button>
        </div>
      </div>

      {/* Active Chart View */}
      <div className="pt-6">
        {/* VIEW 1: Pre vs Post Comparison Bar Chart */}
        {activeTab === 'comparison' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-600 rounded-xs inline-block"></span>
                  <span>{language === 'th' ? 'ฐานเดิม 2 กะ (Double Shift Baseline)' : language === 'zh' ? '双班基准' : 'Baseline'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-emerald-600 rounded-xs inline-block"></span>
                  <span>{language === 'th' ? 'คงเหลือหลังลดคน (Remain MP)' : language === 'zh' ? '优化后留存' : 'Remain MP'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-rose-500 rounded-xs inline-block"></span>
                  <span>{language === 'th' ? 'จำนวนที่ลด (Reduced)' : language === 'zh' ? '减员人数' : 'Reduced'}</span>
                </span>
              </div>
              <span className="hidden sm:inline text-slate-400">
                {language === 'th' ? 'ชี้เมาส์เพื่อดูรายละเอียด' : 'Hover for details'}
              </span>
            </div>

            {/* Bars List */}
            <div className="space-y-3">
              {data.map((dept) => {
                const basePct = (dept.doubleShiftQuota / maxQuota) * 100;
                const remainPct = (dept.remainManpower / maxQuota) * 100;
                const reduceRate = ((dept.reduceManpower / dept.doubleShiftQuota) * 100).toFixed(1);
                const shareOfTotal = ((dept.doubleShiftQuota / totalDoubleShift) * 100).toFixed(1);

                return (
                  <div
                    key={dept.id}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                    onMouseEnter={() => setHoveredDept(dept)}
                    onMouseLeave={() => setHoveredDept(null)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 mb-1.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{dept.deptCn}</span>
                        <span className="text-slate-500 font-normal hidden md:inline">({dept.deptEn})</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-normal">
                          {dept.processType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 text-right">
                        <span className="tabular-nums">
                          {dept.doubleShiftQuota} <span className="text-slate-400">→</span> <span className="font-bold text-emerald-700">{dept.remainManpower}</span>
                        </span>
                        <span className="text-rose-600 font-bold tabular-nums">
                          -{dept.reduceManpower} ({reduceRate}%)
                        </span>
                        <span className="text-slate-400 tabular-nums hidden sm:inline">
                          ({shareOfTotal}% ของโรงงาน)
                        </span>
                      </div>
                    </div>

                    {/* Dual comparative bar */}
                    <div className="space-y-1">
                      {/* Baseline */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-600 h-full rounded-l-full transition-all duration-300"
                          style={{ width: `${remainPct}%` }}
                          title={`Remain: ${dept.remainManpower}`}
                        />
                        <div
                          className="bg-rose-500 h-full rounded-r-full transition-all duration-300"
                          style={{ width: `${basePct - remainPct}%` }}
                          title={`Reduce: ${dept.reduceManpower}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Waterfall Breakdown of the 240 Reduced Headcount */}
        {activeTab === 'waterfall' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
              <span>
                {language === 'th'
                  ? 'น้ำตกแสดงการกระจายตัวของเป้าหมายลดกำลังคนรวม 240 คน (Reduction Contribution)'
                  : language === 'zh'
                  ? '全厂240名减员总目标工段贡献拆解 (Waterfall Analysis)'
                  : 'Total 240 Headcount Reduction Contribution by Department'}
              </span>
              <span className="font-bold tabular-nums">รวมลด 240 คน (100%)</span>
            </div>

            <div className="space-y-2.5">
              {[...data]
                .sort((a, b) => b.reduceManpower - a.reduceManpower)
                .map((dept, idx) => {
                  const contributionPct = ((dept.reduceManpower / totalReduce) * 100).toFixed(1);
                  const barWidth = (dept.reduceManpower / 68) * 100; // 68 is max (Line B)

                  return (
                    <div key={dept.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-slate-500 font-mono text-[11px]">{idx + 1}.</span>
                          <span className="font-semibold text-slate-800">{dept.deptCn}</span>
                          <span className="text-slate-500 text-[11px] hidden sm:inline">({dept.deptEn})</span>
                        </div>
                        <div className="flex items-center gap-3 tabular-nums">
                          <span className="font-bold text-rose-600">-{dept.reduceManpower} คน</span>
                          <span className="text-slate-600 font-medium w-16 text-right">
                            {contributionPct}% share
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* VIEW 3: Department Workforce Share Distribution */}
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual breakdown list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">
                {language === 'th' ? 'สัดส่วนกำลังคนตามสายการผลิตหลัก' : language === 'zh' ? '全厂一线用人比重分布' : 'Production Workforce Distribution'}
              </h4>
              <div className="space-y-2 text-xs">
                {data.map((dept) => {
                  const pct = ((dept.doubleShiftQuota / totalDoubleShift) * 100).toFixed(1);
                  const color = processColors[dept.processType] || '#3b82f6';

                  return (
                    <div key={dept.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="font-medium text-slate-800 truncate">{dept.deptCn}</span>
                        <span className="text-slate-500 text-[11px] truncate">({dept.deptEn})</span>
                      </div>
                      <div className="flex items-center gap-2 tabular-nums shrink-0">
                        <span className="font-semibold text-slate-900">{dept.doubleShiftQuota} คน</span>
                        <span className="text-slate-500 w-12 text-right">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dominance Spotlight Card */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Layers className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {language === 'th' ? 'จุดสังเกตสำคัญด้านโครงสร้างแรงงาน' : language === 'zh' ? '核心用工结构洞察' : 'Workforce Concentration Insight'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'th'
                  ? 'สายการผลิตหลัก A Line และ B Line รวมกันใช้กำลังคนถึง 1,322 คน (53.3% ของโรงงาน) และเป็นเป้าหมายลดกำลังคนหลักรวม 128 คน (53.3% ของเป้าหมายทั้งหมด 240 คน)'
                  : language === 'zh'
                  ? 'A线与B线合计用工1,322人（占全厂53.3%），两线合计承担减员128人（占总减员目标240人的53.3%），是全厂自动化技改的重中之重。'
                  : 'A Line & B Line together represent 1,322 operators (53.3% of plant) and contribute 128 reductions (53.3% of the 240 person target). They form the focal point of the automation program.'}
              </p>

              {/* Progress bar of concentration */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-700">Line A + Line B (53.3%)</span>
                  <span className="text-slate-500">Other 7 Depts (46.7%)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: '53.3%' }}></div>
                  <div className="bg-slate-400 h-full" style={{ width: '46.7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
