import React, { useState, useEffect } from 'react';
import { DepartmentData, Language } from '../types';
import { X, Save, RotateCcw } from 'lucide-react';

interface DepartmentEditModalProps {
  dept: DepartmentData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDept: DepartmentData) => void;
  language: Language;
}

export const DepartmentEditModal: React.FC<DepartmentEditModalProps> = ({
  dept,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  if (!isOpen || !dept) return null;

  const [singleShift, setSingleShift] = useState(dept.singleShiftQuota);
  const [doubleShift, setDoubleShift] = useState(dept.doubleShiftQuota);
  const [reduceCount, setReduceCount] = useState(dept.reduceManpower);
  const [notes, setNotes] = useState(dept.automationFocusTh);

  useEffect(() => {
    if (dept) {
      setSingleShift(dept.singleShiftQuota);
      setDoubleShift(dept.doubleShiftQuota);
      setReduceCount(dept.reduceManpower);
      setNotes(dept.automationFocusTh);
    }
  }, [dept]);

  const remainCount = Math.max(0, doubleShift - reduceCount);
  const reductionPercent = doubleShift > 0 ? ((reduceCount / doubleShift) * 100).toFixed(1) : '0';

  const handleSave = () => {
    onSave({
      ...dept,
      singleShiftQuota: singleShift,
      doubleShiftQuota: doubleShift,
      reduceManpower: reduceCount,
      remainManpower: remainCount,
      automationFocusTh: notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'th' ? 'ปรับเปลี่ยนยอดกำลังคนแผนก' : language === 'zh' ? '调整工段定编参数' : 'Adjust Department Quota'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {dept.deptCn} · {dept.deptEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Thai name preview */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <span className="font-semibold block text-[11px] text-slate-400 uppercase">
              {language === 'th' ? 'สายการผลิต / รายละเอียด' : 'Process Workstation'}
            </span>
            <span className="font-medium mt-0.5 block">{dept.deptTh}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Single Shift Quota */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                单班定编 (Per Shift)
              </label>
              <input
                type="number"
                value={singleShift}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setSingleShift(val);
                  setDoubleShift(val * 2);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {language === 'th' ? 'ปรับเปลี่ยนจะมีผลคูณ 2 ใน 2 กะ' : 'Single shift baseline'}
              </span>
            </div>

            {/* Double Shift Quota */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                双班定编 (Double Shift)
              </label>
              <input
                type="number"
                value={doubleShift}
                onChange={(e) => setDoubleShift(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {language === 'th' ? 'ฐานคำนวณเดิม 2 กะ' : '2-shift baseline'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Reduce Manpower */}
            <div>
              <label className="font-semibold text-rose-700 block mb-1">
                Reduce Manpower (ลดคน)
              </label>
              <input
                type="number"
                value={reduceCount}
                onChange={(e) => setReduceCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-rose-300 rounded-lg text-sm font-bold text-rose-600 tabular-nums focus:outline-none focus:ring-2 focus:ring-rose-600 bg-rose-50/20"
              />
              <span className="text-[10px] text-rose-600 mt-0.5 block">
                อัตราลด: {reductionPercent}%
              </span>
            </div>

            {/* Remain MP */}
            <div>
              <label className="font-semibold text-emerald-700 block mb-1">
                Remain MP (คงเหลือ)
              </label>
              <div className="px-3 py-2 border border-emerald-300 bg-emerald-50/20 rounded-lg text-sm font-bold text-emerald-700 tabular-nums">
                {remainCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 mt-0.5 block">
                คำนวณอัตโนมัติ (ฐาน - ลด)
              </span>
            </div>
          </div>

          {/* Kaizen notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'th' ? 'แนวทางปรับปรุง / โครงการ Kaizen ที่เกี่ยวข้อง' : 'Kaizen / Automation Focus'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
