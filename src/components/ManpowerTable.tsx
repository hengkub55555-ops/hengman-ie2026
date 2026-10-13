import React, { useState, useMemo } from 'react';
import { DepartmentData, Language } from '../types';
import { TRANSLATIONS } from '../data/manpowerData';
import { ArrowUpDown, Search, Filter, Edit2, RotateCcw, Download, Info } from 'lucide-react';

interface ManpowerTableProps {
  data: DepartmentData[];
  language: Language;
  onEditDept: (dept: DepartmentData) => void;
  onResetAll: () => void;
  onExportCsv: () => void;
}

type SortField = 'deptCn' | 'deptEn' | 'singleShiftQuota' | 'doubleShiftQuota' | 'reduceManpower' | 'remainManpower' | 'reductionRate';
type SortOrder = 'asc' | 'desc';

export const ManpowerTable: React.FC<ManpowerTableProps> = ({
  data,
  language,
  onEditDept,
  onResetAll,
  onExportCsv,
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('doubleShiftQuota');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter and sort
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch =
          item.deptCn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.deptEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.deptTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProcess = selectedProcess === 'ALL' || item.processType === selectedProcess;
        return matchesSearch && matchesProcess;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        if (sortField === 'reductionRate') {
          valA = a.doubleShiftQuota > 0 ? a.reduceManpower / a.doubleShiftQuota : 0;
          valB = b.doubleShiftQuota > 0 ? b.reduceManpower / b.doubleShiftQuota : 0;
        } else {
          valA = a[sortField];
          valB = b[sortField];
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, selectedProcess, sortField, sortOrder]);

  // Aggregate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        singleShift: acc.singleShift + item.singleShiftQuota,
        doubleShift: acc.doubleShift + item.doubleShiftQuota,
        reduce: acc.reduce + item.reduceManpower,
        remain: acc.remain + item.remainManpower,
      }),
      { singleShift: 0, doubleShift: 0, reduce: 0, remain: 0 }
    );
  }, [filteredData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const processTypes = ['ALL', 'Assembly', 'Press & Door', 'Thermoforming', 'Molding', 'Quality QC', 'Internal Logistics'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{language === 'th' ? 'ตารางสรุปจัดสรรกำลังคน (Manpower Allotment)' : language === 'zh' ? '用人汇总与减员定编明细表' : 'Staffing Allotment & Reduction Breakdown'}</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-700 mt-0.5">
            <span>{language === 'th' ? 'แรงงานสายตรง (Direct Labor)' : language === 'zh' ? '一线生产操作工人' : 'Direct Production Labor'}</span>
            <span aria-hidden="true">·</span>
            <span>{filteredData.length} {language === 'th' ? 'แผนก/สายงาน' : language === 'zh' ? '个部门工段' : 'Workstations'}</span>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
            />
          </div>

          {/* Process filter */}
          <select
            value={selectedProcess}
            onChange={(e) => setSelectedProcess(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {processTypes.map((proc) => (
              <option key={proc} value={proc}>
                {proc === 'ALL'
                  ? language === 'th'
                    ? 'ทุกกระบวนการ (All)'
                    : language === 'zh'
                    ? '全工序工段'
                    : 'All Processes'
                  : proc}
              </option>
            ))}
          </select>

          {/* Export CSV button */}
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportCsv}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Reset to Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.resetDefault}</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header with exact visual styling of production sheet */}
          <thead>
            {/* Top Multi-column grouping header */}
            <tr className="bg-blue-800 text-white border-b border-blue-900">
              <th className="py-2.5 px-3 font-semibold border-r border-blue-700 text-center w-24">
                分类 (Category)
              </th>
              <th className="py-2.5 px-3 font-semibold border-r border-blue-700">
                部门 (Department)
              </th>
              <th className="py-2.5 px-3 font-semibold border-r border-blue-700">
                English Name
              </th>
              <th className="py-2.5 px-3 font-semibold border-r border-blue-700 hidden lg:table-cell">
                ภาษาไทย (Thai)
              </th>
              <th
                colSpan={2}
                className="py-1 px-3 font-semibold border-r border-blue-700 text-center bg-blue-900"
              >
                (26年) 定编 Quota
              </th>
              <th
                colSpan={2}
                className="py-1 px-3 font-semibold border-r border-blue-700 text-center bg-sky-950"
              >
                Reduce Manpower (ลดกำลังคน)
              </th>
              <th className="py-2.5 px-3 font-semibold text-center w-20">
                Action
              </th>
            </tr>
            {/* Sub-header row */}
            <tr className="bg-blue-700 text-white text-[11px] border-b border-slate-300">
              <th className="py-2 px-3 text-center border-r border-blue-600 font-medium">一线 Direct</th>
              <th className="py-2 px-3 border-r border-blue-600 font-medium cursor-pointer hover:bg-blue-600/70" onClick={() => handleSort('deptCn')}>
                <div className="flex items-center gap-1">
                  <span>中文</span>
                  <ArrowUpDown className="w-3 h-3 opacity-70" />
                </div>
              </th>
              <th className="py-2 px-3 border-r border-blue-600 font-medium cursor-pointer hover:bg-blue-600/70" onClick={() => handleSort('deptEn')}>
                <div className="flex items-center gap-1">
                  <span>English</span>
                  <ArrowUpDown className="w-3 h-3 opacity-70" />
                </div>
              </th>
              <th className="py-2 px-3 border-r border-blue-600 font-medium hidden lg:table-cell">
                คำอธิบายงาน
              </th>
              <th className="py-2 px-3 text-right border-r border-blue-600 font-medium cursor-pointer hover:bg-blue-600/70" onClick={() => handleSort('singleShiftQuota')}>
                <div className="flex items-center justify-end gap-1">
                  <span>单班定编 (Per Shift)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-70" />
                </div>
              </th>
              <th className="py-2 px-3 text-right border-r border-blue-600 font-medium cursor-pointer hover:bg-blue-600/70" onClick={() => handleSort('doubleShiftQuota')}>
                <div className="flex items-center justify-end gap-1">
                  <span>双班定编 (Per Day)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-70" />
                </div>
              </th>
              <th className="py-2 px-3 text-right border-r border-sky-800 font-medium cursor-pointer hover:bg-blue-600/70 bg-sky-900" onClick={() => handleSort('reduceManpower')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Person (คน)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-70" />
                </div>
              </th>
              <th className="py-2 px-3 text-right border-r border-sky-800 font-medium cursor-pointer hover:bg-blue-600/70 bg-sky-900" onClick={() => handleSort('remainManpower')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Remain MP (คงเหลือ)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-70" />
                </div>
              </th>
              <th className="py-2 px-2 text-center font-medium">Edit</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 font-normal">
            {filteredData.map((dept, index) => {
              const reduceRate = dept.doubleShiftQuota > 0 ? (dept.reduceManpower / dept.doubleShiftQuota) * 100 : 0;
              const isMajorLine = dept.id === 'dept-1' || dept.id === 'dept-2';

              return (
                <tr
                  key={dept.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    isMajorLine ? 'bg-slate-50/70' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  {/* Category Column (spanned conceptually) */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center text-slate-500 font-medium text-[11px] whitespace-nowrap">
                    {index === 0 ? (
                      <span className="font-semibold text-slate-800">一线 Direct Labor</span>
                    ) : (
                      <span className="text-slate-500 font-bold">″</span>
                    )}
                  </td>

                  {/* Dept CN */}
                  <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{dept.deptCn}</span>
                      {isMajorLine && (
                        <span className="text-[10px] text-blue-700 bg-blue-100 px-1 py-0.2 rounded font-medium">
                          Main
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Dept EN */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700">
                    {dept.deptEn}
                  </td>

                  {/* Dept TH */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 hidden lg:table-cell">
                    <span className="truncate block max-w-xs" title={dept.deptTh}>
                      {dept.deptTh}
                    </span>
                  </td>

                  {/* Single shift quota */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-right tabular-nums text-slate-700 font-medium">
                    {dept.singleShiftQuota.toLocaleString()}
                  </td>

                  {/* Double shift quota */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-right tabular-nums font-semibold text-slate-900">
                    {dept.doubleShiftQuota.toLocaleString()}
                  </td>

                  {/* Reduced Manpower (with soft red indicator) */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-right tabular-nums font-bold text-rose-600 bg-rose-50/30">
                    <div className="flex items-center justify-end gap-1">
                      <span>-{dept.reduceManpower.toLocaleString()}</span>
                      <span className="text-[10px] text-rose-700 font-medium">({reduceRate.toFixed(1)}%)</span>
                    </div>
                  </td>

                  {/* Remain MP */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-right tabular-nums font-bold text-emerald-700 bg-emerald-50/20">
                    {dept.remainManpower.toLocaleString()}
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => onEditDept(dept)}
                      className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      title="Adjust Quota"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer / Summary Row (Matches original document with Yellow Highlight) */}
          <tfoot>
            <tr className="border-t-2 border-slate-800 bg-slate-900 text-white font-bold text-xs">
              <td className="py-3 px-3 text-center border-r border-slate-800">/</td>
              <td className="py-3 px-3 border-r border-slate-800">
                <span className="text-sm">总计 (Total)</span>
              </td>
              <td className="py-3 px-3 border-r border-slate-800 text-slate-300">
                Direct Labor Quota
              </td>
              <td className="py-3 px-3 border-r border-slate-800 text-slate-300 hidden lg:table-cell">
                รวมแรงงานฝ่ายผลิตทุกสาย
              </td>
              {/* Single shift total: 1,240 */}
              <td className="py-3 px-3 text-right border-r border-slate-800 tabular-nums text-white text-sm">
                {totals.singleShift.toLocaleString()}
              </td>
              {/* Double shift baseline: 2,480 */}
              <td className="py-3 px-3 text-right border-r border-slate-800 tabular-nums text-amber-300 text-sm">
                {totals.doubleShift.toLocaleString()}
              </td>
              {/* Reduced Manpower total: 240 (Highlighted in Vivid Yellow as in original sheet!) */}
              <td className="py-3 px-3 text-right border-r border-slate-800 tabular-nums text-slate-950 bg-yellow-400 font-extrabold text-sm">
                {totals.reduce.toLocaleString()}
              </td>
              {/* Remain MP total: 2,240 (Highlighted in Vivid Yellow as in original sheet!) */}
              <td className="py-3 px-3 text-right border-r border-slate-800 tabular-nums text-slate-950 bg-yellow-400 font-extrabold text-sm">
                {totals.remain.toLocaleString()}
              </td>
              <td className="py-3 px-2 text-center text-slate-400">
                -
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Explanatory Banner Below Table */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {t.topTwoShareNote} (1,322 / 2,480 คน)
          </span>
        </div>
        <div className="text-[11px] text-slate-500 italic">
          {t.noteFormula}
        </div>
      </div>
    </div>
  );
};
