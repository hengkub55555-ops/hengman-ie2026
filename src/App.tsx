/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DepartmentData, Language, Currency, SimulationState, ScenarioPreset } from './types';
import { INITIAL_MANPOWER_DATA, TRANSLATIONS, SCENARIO_PRESETS } from './data/manpowerData';
import { Header } from './components/Header';
import { KpiMetrics } from './components/KpiMetrics';
import { ManpowerTable } from './components/ManpowerTable';
import { SimulationSandbox } from './components/SimulationSandbox';
import { VisualAnalytics } from './components/VisualAnalytics';
import { QuarterlyRoadmap } from './components/QuarterlyRoadmap';
import { StrategicInsights } from './components/StrategicInsights';
import { DepartmentEditModal } from './components/DepartmentEditModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { MonthlyMpUphChart } from './components/MonthlyMpUphChart';
import { Table, Sliders, BarChart3, Calendar, Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('th');
  const [currency, setCurrency] = useState<Currency>('THB');
  const [data, setData] = useState<DepartmentData[]>(INITIAL_MANPOWER_DATA);
  const [activeTab, setActiveTab] = useState<'table' | 'monthly-uph' | 'simulation' | 'analytics' | 'roadmap' | 'insights'>('table');
  const [editingDept, setEditingDept] = useState<DepartmentData | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulationState>({
    shiftCount: 2,
    globalReductionPercent: 9.68,
    monthlySalaryPerPerson: 18500,
    productionVolumeFactor: 1.0,
    overtimeHoursPerMonth: 20,
    currency: 'THB',
    activeScenarioName: 'target-2026',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute live totals from data
  const totalSingleShift = useMemo(() => {
    return data.reduce((acc, d) => acc + d.singleShiftQuota, 0);
  }, [data]);

  const baselineDoubleShift = useMemo(() => {
    return data.reduce((acc, d) => acc + d.doubleShiftQuota, 0);
  }, [data]);

  const totalReduced = useMemo(() => {
    return data.reduce((acc, d) => acc + d.reduceManpower, 0);
  }, [data]);

  const totalRemaining = useMemo(() => {
    return data.reduce((acc, d) => acc + d.remainManpower, 0);
  }, [data]);

  // Simulated metrics
  const simulatedBaseline = useMemo(() => {
    return totalSingleShift * simulationState.shiftCount * simulationState.productionVolumeFactor;
  }, [totalSingleShift, simulationState.shiftCount, simulationState.productionVolumeFactor]);

  const simulatedReduce = useMemo(() => {
    return Math.round((simulatedBaseline * simulationState.globalReductionPercent) / 100);
  }, [simulatedBaseline, simulationState.globalReductionPercent]);

  const simulatedRemain = useMemo(() => {
    return Math.max(0, Math.round(simulatedBaseline - simulatedReduce));
  }, [simulatedBaseline, simulatedReduce]);

  // Apply scenario preset
  const handleApplyPreset = (preset: ScenarioPreset) => {
    setSimulationState((prev) => ({
      ...prev,
      shiftCount: preset.shiftCount,
      globalReductionPercent: preset.globalReductionPercent,
      productionVolumeFactor: preset.volumeFactor,
      activeScenarioName: preset.id,
    }));
    showToast(
      language === 'th'
        ? `ปรับใช้แบบจำลอง: ${preset.nameTh}`
        : language === 'zh'
        ? `已切换至：${preset.nameZh}`
        : `Switched to preset: ${preset.nameEn}`
    );
  };

  // Reset to original document data
  const handleResetData = () => {
    setData(INITIAL_MANPOWER_DATA);
    setSimulationState({
      shiftCount: 2,
      globalReductionPercent: 9.68,
      monthlySalaryPerPerson: 18500,
      productionVolumeFactor: 1.0,
      overtimeHoursPerMonth: 20,
      currency: 'THB',
      activeScenarioName: 'target-2026',
    });
    showToast(
      language === 'th'
        ? 'คืนค่าข้อมูลทั้งหมดกลับสู่ฉบับตั้งต้นทางการ'
        : language === 'zh'
        ? '已恢复至官方核准基准数据'
        : 'Reset to original baseline data'
    );
  };

  // Update a single department
  const handleSaveDepartment = (updatedDept: DepartmentData) => {
    setData((prev) => prev.map((item) => (item.id === updatedDept.id ? updatedDept : item)));
    showToast(
      language === 'th'
        ? `อัปเดตข้อมูล ${updatedDept.deptEn} สำเร็จ`
        : language === 'zh'
        ? `已更新 ${updatedDept.deptCn} 定编`
        : `Updated ${updatedDept.deptEn}`
    );
  };

  // Export CSV with UTF-8 BOM
  const handleExportCsv = () => {
    const headers = [
      'Category (分类)',
      'Department (部门)',
      'English Name',
      'Thai Name (ภาษาไทย)',
      'Per Shift Quota (单班定编)',
      '2-Shift Quota (双班定编)',
      'Reduced Manpower (减员人数)',
      'Remain Manpower (留存定编)',
      'Reduction % (减员比例)',
      'Process Type',
      'Kaizen Focus',
    ];

    const rows = data.map((dept) => {
      const rate = dept.doubleShiftQuota > 0 ? ((dept.reduceManpower / dept.doubleShiftQuota) * 100).toFixed(1) : '0';
      return [
        `"${dept.category}"`,
        `"${dept.deptCn}"`,
        `"${dept.deptEn}"`,
        `"${dept.deptTh}"`,
        dept.singleShiftQuota,
        dept.doubleShiftQuota,
        dept.reduceManpower,
        dept.remainManpower,
        `"${rate}%"`,
        `"${dept.processType}"`,
        `"${dept.automationFocusTh.replace(/"/g, '""')}"`,
      ].join(',');
    });

    // Summary row
    const summaryRate = baselineDoubleShift > 0 ? ((totalReduced / baselineDoubleShift) * 100).toFixed(1) : '0';
    const totalRow = [
      '"Total / 总计"',
      '"全厂总计"',
      '"Total Plant"',
      '"รวมทั้งโรงงาน"',
      totalSingleShift,
      baselineDoubleShift,
      totalReduced,
      totalRemaining,
      `"${summaryRate}%"`,
      '""',
      '""',
    ].join(',');

    const csvContent = '\uFEFF' + [headers.join(','), ...rows, totalRow].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Thailand_Manpower_Outlook_2026_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(language === 'th' ? 'ส่งออกไฟล์ CSV สำเร็จ' : 'CSV exported successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar */}
      <Header
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-1">
              <span>Thailand Plant · Operations 2026</span>
              <span aria-hidden="true">·</span>
              <span>Headcount Rationalization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight text-balance">
              {t.appTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {t.appSubtitle} · <span className="font-medium text-slate-800">{t.sourceRef}</span>
            </p>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <KpiMetrics
          language={language}
          currency={currency}
          totalSingleShift={totalSingleShift}
          totalBaseline={simulationState.shiftCount === 2 ? baselineDoubleShift : Math.round(simulatedBaseline)}
          totalReduced={simulationState.shiftCount === 2 && simulationState.globalReductionPercent === 9.68 ? totalReduced : simulatedReduce}
          totalRemaining={simulationState.shiftCount === 2 && simulationState.globalReductionPercent === 9.68 ? totalRemaining : simulatedRemain}
          monthlySalary={simulationState.monthlySalaryPerPerson}
          shiftCount={simulationState.shiftCount}
        />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('table')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'table'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>{t.tabDepartmentDetails}</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly-uph')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'monthly-uph'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.tabMonthlyMpUph}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'simulation'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.tabSimulation}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'th' ? 'กราฟวิเคราะห์ (Analytics)' : language === 'zh' ? '图表分析' : 'Visual Analytics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.tabRoadmap}</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'insights'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{t.tabAiAnalysis}</span>
          </button>
        </div>

        {/* Tab Views */}
        <div className="space-y-6">
          {activeTab === 'table' && (
            <div className="space-y-6">
              <ManpowerTable
                data={data}
                language={language}
                onEditDept={(dept) => setEditingDept(dept)}
                onResetAll={handleResetData}
                onExportCsv={handleExportCsv}
              />
              {/* Monthly MP vs UPH Chart featured directly on overview */}
              <MonthlyMpUphChart language={language} onNotification={showToast} />
              <VisualAnalytics data={data} language={language} />
            </div>
          )}

          {activeTab === 'monthly-uph' && (
            <div className="space-y-6">
              <MonthlyMpUphChart language={language} onNotification={showToast} />
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <SimulationSandbox
                simulationState={simulationState}
                setSimulationState={setSimulationState}
                language={language}
                onApplyPreset={handleApplyPreset}
                onResetSimulation={handleResetData}
                baselineTotal={baselineDoubleShift}
                simulatedTotalRemain={simulatedRemain}
                simulatedTotalReduce={simulatedReduce}
              />
              <VisualAnalytics data={data} language={language} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <VisualAnalytics data={data} language={language} />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <QuarterlyRoadmap language={language} />
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <StrategicInsights data={data} language={language} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Thailand Manufacturing Plant</span>
            <span aria-hidden="true">·</span>
            <span>Industrial Engineering & HR Manpower Planning Division</span>
          </div>
          <div>
            <span>ข้อมูลสรุปอัตรากำลังคนปี 2026 · อัปเดตล่าสุดตามเอกสารการลดกำลังคน</span>
          </div>
        </div>
      </footer>

      {/* Edit Department Modal */}
      <DepartmentEditModal
        dept={editingDept}
        isOpen={Boolean(editingDept)}
        onClose={() => setEditingDept(null)}
        onSave={handleSaveDepartment}
        language={language}
      />

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        data={data}
        language={language}
        currency={currency}
        monthlySalary={simulationState.monthlySalaryPerPerson}
        shiftCount={simulationState.shiftCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
