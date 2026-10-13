import React, { useState, useEffect } from 'react';
import { MonthlyMpUphData, Language } from '../types';
import { X, Save, RotateCcw, Target, Users, Calendar } from 'lucide-react';

interface MonthlyEditModalProps {
  monthItem: MonthlyMpUphData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: MonthlyMpUphData) => void;
  language: Language;
  baselineMp: number; // 2480
}

export const MonthlyEditModal: React.FC<MonthlyEditModalProps> = ({
  monthItem,
  isOpen,
  onClose,
  onSave,
  language,
  baselineMp,
}) => {
  if (!isOpen || !monthItem) return null;

  const [doubleShiftMp, setDoubleShiftMp] = useState(monthItem.plannedMpDoubleShift);
  const [targetUph, setTargetUph] = useState(monthItem.targetUph);
  const [volume, setVolume] = useState(monthItem.productionVolumeTarget);
  const [milestoneTh, setMilestoneTh] = useState(monthItem.milestoneTh);
  const [milestoneEn, setMilestoneEn] = useState(monthItem.milestoneEn);

  useEffect(() => {
    if (monthItem) {
      setDoubleShiftMp(monthItem.plannedMpDoubleShift);
      setTargetUph(monthItem.targetUph);
      setVolume(monthItem.productionVolumeTarget);
      setMilestoneTh(monthItem.milestoneTh);
      setMilestoneEn(monthItem.milestoneEn);
    }
  }, [monthItem]);

  const singleShiftMp = Math.round(doubleShiftMp / 2);
  const cumulativeReduction = Math.max(0, baselineMp - doubleShiftMp);
  const computedUpph = singleShiftMp > 0 ? Number((targetUph / singleShiftMp).toFixed(3)) : 0;

  const handleSave = () => {
    onSave({
      ...monthItem,
      plannedMpDoubleShift: doubleShiftMp,
      plannedMpSingleShift: singleShiftMp,
      cumulativeReduction,
      targetUph,
      upph: computedUpph,
      productionVolumeTarget: volume,
      milestoneTh,
      milestoneEn,
      milestoneZh: milestoneTh,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'th'
                  ? `แก้ไขเป้าหมายเดือน ${monthItem.monthNameTh}`
                  : `Edit Target for ${monthItem.month}`}
              </h3>
              <p className="text-xs text-slate-500">
                {monthItem.quarter} · ปี 2026 (Monthly MP & UPH Target)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Manpower inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                กำลังคน MP 2 กะ (คน)
              </label>
              <input
                type="number"
                value={doubleShiftMp}
                onChange={(e) => setDoubleShiftMp(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                โหมด 1 กะ: {singleShiftMp} คน
              </span>
            </div>

            <div>
              <label className="font-semibold text-rose-700 block mb-1">
                ลดสะสมจากฐานเดิม (คน)
              </label>
              <div className="px-3 py-2 border border-rose-200 bg-rose-50/40 rounded-lg text-sm font-bold tabular-nums text-rose-600">
                -{cumulativeReduction} คน
              </div>
              <span className="text-[10px] text-rose-600/80 mt-0.5 block">
                คำนวณจากฐาน 2,480 คน
              </span>
            </div>
          </div>

          {/* UPH & Volume */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-emerald-800 block mb-1">
                เป้าหมาย UPH (ชิ้น/ชม.)
              </label>
              <input
                type="number"
                value={targetUph}
                onChange={(e) => setTargetUph(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm font-bold tabular-nums text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-emerald-50/20"
              />
              <span className="text-[10px] text-emerald-700/80 mt-0.5 block">
                ผลิตภาพ UPPH: {computedUpph} ชิ้น/คน-ชม.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                เป้ายอดผลิตต่อเดือน (ชิ้น)
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Monthly production units
              </span>
            </div>
          </div>

          {/* Kaizen Project Milestone */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'th' ? 'แผนงานสำคัญ / โครงการ Kaizen & หุ่นยนต์' : 'Milestone & Kaizen Project'}
            </label>
            <input
              type="text"
              value={milestoneTh}
              onChange={(e) => setMilestoneTh(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 mb-2"
              placeholder="รายละเอียดโครงการในเดือนนี้..."
            />
            <input
              type="text"
              value={milestoneEn}
              onChange={(e) => setMilestoneEn(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-600"
              placeholder="English milestone description..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
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
