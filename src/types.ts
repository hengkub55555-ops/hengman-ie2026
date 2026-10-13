export interface DepartmentData {
  id: string;
  deptCn: string;
  deptEn: string;
  deptTh: string;
  category: string;
  singleShiftQuota: number;
  doubleShiftQuota: number;
  reduceManpower: number;
  remainManpower: number;
  processType: 'Assembly' | 'Press & Door' | 'Thermoforming' | 'Molding' | 'Quality QC' | 'Internal Logistics';
  automationFocusTh: string;
  automationFocusEn: string;
  automationFocusZh: string;
}

export type Language = 'th' | 'en' | 'zh';
export type Currency = 'THB' | 'CNY' | 'USD';

export interface SimulationState {
  shiftCount: number; // 1, 2, or 3
  globalReductionPercent: number; // e.g. 9.68%
  monthlySalaryPerPerson: number; // e.g. 18,500 THB
  productionVolumeFactor: number; // 1.0 = 100%
  overtimeHoursPerMonth: number;
  currency: Currency;
  activeScenarioName: string;
}

export interface ScenarioPreset {
  id: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  descriptionTh: string;
  shiftCount: number;
  globalReductionPercent: number;
  volumeFactor: number;
}

export interface MonthlyMpUphData {
  month: string; // e.g. 'Jan 26', 'ม.ค. 26'
  monthIndex: number; // 1 - 12
  monthNameTh: string;
  monthNameEn: string;
  monthNameZh: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  
  // Manpower figures
  plannedMpDoubleShift: number; // e.g. 2,480 -> 2,240
  plannedMpSingleShift: number; // e.g. 1,240 -> 1,120
  cumulativeReduction: number; // 0 -> 240
  
  // Production UPH figures
  targetUph: number; // Units Per Hour (e.g. 240 -> 275)
  baselineUph: number; // e.g. 240
  
  // Derived productivity
  upph: number; // Units Per Person Hour (UPH / Single Shift MP)
  productionVolumeTarget: number; // Monthly units target
  
  milestoneTh: string;
  milestoneEn: string;
  milestoneZh: string;
}

