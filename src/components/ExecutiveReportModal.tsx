import React, { useState } from 'react';
import { DepartmentData, Language, Currency } from '../types';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DepartmentData[];
  language: Language;
  currency: Currency;
  monthlySalary: number;
  shiftCount: number;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  data,
  language,
  currency,
  monthlySalary,
  shiftCount,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalSingle = data.reduce((acc, d) => acc + d.singleShiftQuota, 0);
  const totalDouble = data.reduce((acc, d) => acc + d.doubleShiftQuota, 0);
  const totalReduce = data.reduce((acc, d) => acc + d.reduceManpower, 0);
  const totalRemain = data.reduce((acc, d) => acc + d.remainManpower, 0);

  const rate = currency === 'THB' ? 1 : currency === 'CNY' ? 1 / 5.05 : 1 / 36.5;
  const symbol = currency === 'THB' ? '฿' : currency === 'CNY' ? '¥' : '$';

  const monthlySavings = totalReduce * monthlySalary * rate;
  const annualSavings = monthlySavings * 12;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `
=== THAILAND MANPOWER OUTLOOK 2026 (REDUCTION SUMMARY) ===
泰国26年用人汇总 (减员版 / ฉบับลดกำลังคน)
- วันที่รายงาน: ${new Date().toLocaleDateString('th-TH')}
- สถานะกะการทำงาน: ${shiftCount} กะ
- โควตาต่อกะ (Per Shift): ${totalSingle.toLocaleString()} คน
- ฐานเดิม 2 กะ (Double Shift Base): ${totalDouble.toLocaleString()} คน
- เป้าหมายลดกำลังคน (Reduce Manpower): -${totalReduce.toLocaleString()} คน (-${((totalReduce / totalDouble) * 100).toFixed(2)}%)
- กำลังคนคงเหลือเป้าหมาย (Remain MP): ${totalRemain.toLocaleString()} คน

[การประเมินมูลค่าประหยัดต้นทุน]
- ประหยัดต่อเดือน: ${symbol}${new Intl.NumberFormat().format(Math.round(monthlySavings))}
- ประหยัดต่อปี: ${symbol}${new Intl.NumberFormat().format(Math.round(annualSavings))}

[เป้าหมายผลผลิตรายชั่วโมง UPH & ผลิตภาพแรงงาน UPPH]
- ยอดผลิตต่อชั่วโมง (UPH Target): เริ่มต้น 240 UPH -> สิ้นปี 275 UPH (+14.6%)
- ผลิตภาพแรงงาน (UPPH): 0.194 -> 0.246 ชิ้น/คน-ชม. (+26.8% Efficiency Lift)

[สรุปรายสายการผลิตหลัก]
1. Line A: 620 -> 560 (-60 คน)
2. Line B: 702 -> 634 (-68 คน)
3. Door A group: 264 -> 238 (-26 คน)
4. Door C group: 196 -> 177 (-19 คน)
5. Door B group: 90 -> 81 (-9 คน)
6. Vacuum Forming: 104 -> 94 (-10 คน)
7. Injection + IH: 200 -> 181 (-19 คน)
8. Inspection: 178 -> 161 (-17 คน)
9. Material Delivery: 126 -> 114 (-12 คน)
===================================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-auto overflow-hidden animate-in fade-in duration-200">
        {/* Controls Bar (Not printed) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-sm">
              {language === 'th' ? 'รายงานสรุปสำหรับผู้บริหาร (Executive Brief Preview)' : 'Executive Brief Preview'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความสรุป'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-white text-slate-900">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
                MANUFACTURING OPERATIONS & HUMAN RESOURCES REPORT
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                泰国26年用人汇总 (减员版 / ฉบับลดกำลังคน)
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Thailand Factory 2026 Direct Labor Headcount Rationalization Outlook
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>วันที่จัดพิมพ์: {new Date().toLocaleDateString('th-TH')}</div>
              <div>สถานะเอกสาร: <span className="font-semibold text-emerald-700">อนุมัติระดับปฏิบัติการ</span></div>
            </div>
          </div>

          {/* Key Executive Highlights Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 block">单班定编 (Per Shift)</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {totalSingle.toLocaleString()} คน
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">双班定编 (Double Shift)</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {totalDouble.toLocaleString()} คน
              </span>
            </div>
            <div>
              <span className="text-[11px] text-rose-600 block font-semibold">Reduce Manpower (ลดคน)</span>
              <span className="text-xl font-bold text-rose-600 tabular-nums">
                -{totalReduce.toLocaleString()} คน (-{((totalReduce / totalDouble) * 100).toFixed(1)}%)
              </span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-700 block font-semibold">Remain MP (คงเหลือ)</span>
              <span className="text-xl font-bold text-emerald-700 tabular-nums">
                {totalRemain.toLocaleString()} คน
              </span>
            </div>
          </div>

          {/* Financial summary note */}
          <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-medium">
              ประมาณการประหยัดงบประมาณค่าจ้างแรงงาน (Est. Annual Cost Savings):
            </span>
            <span className="font-bold text-emerald-800 text-sm tabular-nums">
              {symbol}{new Intl.NumberFormat().format(Math.round(annualSavings))} / ปี ({symbol}{new Intl.NumberFormat().format(Math.round(monthlySavings))} / เดือน)
            </span>
          </div>

          {/* Clean Printable Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                  <th className="py-2 px-3 border-r border-slate-300 text-center w-16">序号</th>
                  <th className="py-2 px-3 border-r border-slate-300">部门 (Department)</th>
                  <th className="py-2 px-3 border-r border-slate-300">English / รายละเอียดงาน</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-right">单班 (Shift)</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-right">双班 (Day)</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-right text-rose-700">Reduce (คน)</th>
                  <th className="py-2 px-3 text-right text-emerald-800">Remain MP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((dept, index) => (
                  <tr key={dept.id} className={index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px] text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900">
                      {dept.deptCn}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-600">
                      <div className="font-medium text-slate-800">{dept.deptEn}</div>
                      <div className="text-[10px] text-slate-500">{dept.deptTh}</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right tabular-nums">
                      {dept.singleShiftQuota.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right tabular-nums font-semibold">
                      {dept.doubleShiftQuota.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right tabular-nums font-bold text-rose-600">
                      -{dept.reduceManpower.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-bold text-emerald-700">
                      {dept.remainManpower.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-900">
                  <td className="py-2.5 px-3 text-center border-r border-slate-800">/</td>
                  <td className="py-2.5 px-3 border-r border-slate-800" colSpan={2}>
                    总计 (Total Direct Labor Quota)
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-800 tabular-nums">
                    {totalSingle.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-800 tabular-nums">
                    {totalDouble.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-800 tabular-nums text-yellow-300">
                    -{totalReduce.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-yellow-300">
                    {totalRemain.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signoff Blocks */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs text-slate-500">
            <div>
              <div className="h-10 border-b border-slate-300 mb-1"></div>
              <span>ผู้จัดทำ (Industrial Engineer)</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-300 mb-1"></div>
              <span>ผู้ตรวจสอบ (Production Director)</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-300 mb-1"></div>
              <span>ผู้อนุมัติ (General Manager)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
