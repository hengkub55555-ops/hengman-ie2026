import React, { useState } from 'react';
import { DepartmentData, Language } from '../types';
import { Lightbulb, TrendingUp, AlertTriangle, Cpu, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface StrategicInsightsProps {
  data: DepartmentData[];
  language: Language;
}

export const StrategicInsights: React.FC<StrategicInsightsProps> = ({ data, language }) => {
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'lean' | 'financial' | 'risk'>('lean');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {language === 'th'
                ? 'บทวิเคราะห์เชิงกลยุทธ์และการบริหารประสิทธิภาพ (Strategic IE & Lean Insights)'
                : language === 'zh'
                ? '精益工业工程 (IE) 与组织减效策略分析'
                : 'Industrial Engineering (IE) & Lean Strategic Insights'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'th'
              ? 'ข้อเสนอแนะเชิงลึกในการบริหารจัดการกำลังคน เพื่อให้การลด 240 คนไม่กระทบยอดส่งมอบและคุณภาพ'
              : language === 'zh'
              ? '基于生产工段定编数据的深度工程分析，确保减员240人达成同时保障产能和品质'
              : 'Actionable industrial engineering recommendations to secure 240-headcount reduction with zero quality compromise'}
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 self-start sm:self-auto">
          <button
            onClick={() => setActiveAnalysisMode('lean')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeAnalysisMode === 'lean' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'th' ? 'ด้านการผลิต & Kaizen' : language === 'zh' ? '制造与精益' : 'Manufacturing & Kaizen'}
          </button>
          <button
            onClick={() => setActiveAnalysisMode('financial')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeAnalysisMode === 'financial' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'th' ? 'การเงิน & ROI' : language === 'zh' ? '成本与ROI' : 'Financial & ROI'}
          </button>
          <button
            onClick={() => setActiveAnalysisMode('risk')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeAnalysisMode === 'risk' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'th' ? 'การบริหารความเสี่ยง' : language === 'zh' ? '用工风险与应对' : 'Risk & Mitigation'}
          </button>
        </div>
      </div>

      {/* Content grid */}
      <div className="pt-6">
        {activeAnalysisMode === 'lean' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Line A & B Dominance */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>
                  {language === 'th' ? '1. ปรับสมดุลสายประกอบ A & B (Line Balancing)' : language === 'zh' ? '1. 总装A/B双线节拍平衡' : '1. Line A & B Takt Balancing'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'th'
                  ? 'สาย A (620 คน) และสาย B (702 คน) คิดเป็น 53.3% ของโรงงาน และต้องรับภาระลดคนถึง 128 คน การลดต้องใช้การปรับสมดุลสถานีงาน (Workstation Line Balancing) รวมงานย่อย (Task Combination) และใช้แขนกลขันสกรูอัตโนมัติ เพื่อป้องกันคอขวดที่ Takt Time หลัก'
                  : language === 'zh'
                  ? 'A线（620人）与B线（702人）占全厂53.3%，需承担128人减员指标。必须通过工位节拍平衡分析（Line Balancing）、工序合并与自动拧螺丝机导入，避免出现主线单点节拍阻塞。'
                  : 'Line A (620) and Line B (702) represent 53.3% of workforce and 128 headcount cuts. Priority must be on cycle time balancing, workstation consolidation, and automatic torque screwdrivers.'}
              </p>
            </div>

            {/* 2. Plastic & Door Automation */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {language === 'th' ? '2. ฉีดพลาสติก & โครงสร้างประตู (High ROI)' : language === 'zh' ? '2. 注塑与门体自动化技改' : '2. Injection & Door Fixture Upgrades'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'th'
                  ? 'แผนกฉีดพลาสติก (ลด 19 คน) และกลุ่มประตู A, B, C (ลดรวม 54 คน) เป็นจุดที่คุ้มค่าต่อการลงทุนหุ่นยนต์ที่สุด เช่น ติดตั้ง Servo Robot หยิบชิ้นงานพร้อมตัดเกทอัตโนมัติ และเครื่องตัดมุมใส่ยางขอบประตูอัตโนมัติ ช่วยลดคนได้ถาวรและแม่นยำ'
                  : language === 'zh'
                  ? '注塑车间（减19人）与门体系统工段（合计减54人）具备极高自动化投资回报率。通过注塑侧取伺服机械手结合自动剪水口、门封条全自动穿条焊角机，可彻底替代繁重重复手工作业。'
                  : 'Injection molding (-19 pax) and door sub-assemblies (-54 pax) offer rapid robot ROI. Automated servo takeout units, sprue nippers, and automatic gasket welders eliminate manual ergonomics fatigue.'}
              </p>
            </div>

            {/* 3. AGV & Quality AOI */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'th' ? '3. โลจิสติกส์ AGV และกล้องตรวจจับ AOI' : language === 'zh' ? '3. AGV无人物流与AI视觉质检' : '3. AGV Feeding & AI Optical QC'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'th'
                  ? 'งานขนส่งและจ่ายของ (ลด 12 คน) ควรแทนที่ด้วยรถลากจูง AGV/AMR แบบนำทางแม่เหล็กหรือ LiDAR ส่วนงานตรวจสอบคุณภาพ (ลด 17 คน) ต้องนำกล้อง AI Vision (AOI) มาตรวจจับรอยขีดข่วนและข้อต่อ เพื่อไม่ให้คุณภาพตกหลังลดคน'
                  : language === 'zh'
                  ? '物料配送工段（减12人）推荐采用AMR/AGV无人物流车配合重力滑轨货架；检验工段（减17人）必须配套上线AI外观视觉检测相机与自动化耐压绝缘安测仪，守住品质底线。'
                  : 'Material Delivery (-12 pax) should switch to AGV/AMR tuggers and gravity flow racks. Quality Inspection (-17 pax) requires AI AOI cameras to safeguard cosmetic standards.'}
              </p>
            </div>
          </div>
        )}

        {activeAnalysisMode === 'financial' && (
          <div className="p-5 rounded-xl border border-slate-200 bg-emerald-50/20 space-y-4">
            <h4 className="text-xs font-bold text-slate-900">
              {language === 'th' ? 'สรุปการวิเคราะห์ผลประโยชน์ทางการเงิน (Financial Benefit Summary)' : language === 'zh' ? '综合财务收益与投资回报测算' : 'Financial Impact & Payback Projection'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'th' ? 'ลดต้นทุนแรงงานรายเดือน' : language === 'zh' ? '月度固定人工节约' : 'Monthly Payroll Savings'}</span>
                <span className="text-lg font-bold text-emerald-700 tabular-nums">฿4,440,000 / เดือน</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">(คำนวณฐาน 18,500 ฿/คน)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'th' ? 'ลดต้นทุนแรงงานรายปี' : language === 'zh' ? '年度累计人工节约' : 'Annual Cumulative Savings'}</span>
                <span className="text-lg font-bold text-blue-700 tabular-nums">฿53,280,000 / ปี</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">(~1,055 หมื่นหยวน RMB)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'th' ? 'ระยะเวลาคืนทุนโดยเฉลี่ย' : language === 'zh' ? '预估自动化平均投资回收期' : 'Estimated Average Payback'}</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">10 - 14 เดือน</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">(ขึ้นกับงบ Capex หุ่นยนต์)</span>
              </div>
            </div>
          </div>
        )}

        {activeAnalysisMode === 'risk' && (
          <div className="p-5 rounded-xl border border-rose-100 bg-rose-50/20 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {language === 'th' ? 'ข้อควรระวังและมาตรการป้องกันความเสี่ยง (Key Operational Risks & Mitigations)' : language === 'zh' ? '实施过程风险管控与应对预案' : 'Operational Risks & Mitigations'}
              </span>
            </div>
            <ul className="space-y-2 text-slate-700 list-disc list-inside leading-relaxed">
              <li>
                <strong>{language === 'th' ? 'การลดพนักงานตรวจสอบคุณภาพ (Inspection -17 คน):' : 'Quality Inspection (-17 pax):'}</strong>{' '}
                {language === 'th'
                  ? 'ห้ามปลดคนก่อนที่ระบบกล้อง AI Vision หรือ Poka-Yoke ในไลน์จะทดสอบเสถียรภาพครบ 30 วันเด็ดขาด เพื่อไม่ให้หลุดสินค้าตำหนิไปยังลูกค้า'
                  : 'Do not remove inspectors until AI optical cameras and in-line Poka-Yoke jigs achieve 30-day stable validation.'}
              </li>
              <li>
                <strong>{language === 'th' ? 'การเสริมทักษะพนักงานที่เหลือ (Multi-Skill Training):' : 'Multi-skilling workforce:'}</strong>{' '}
                {language === 'th'
                  ? 'พนักงานที่คงเหลือ 2,240 คน ต้องได้รับการฝึกอบรม Cross-training 2-3 สถานี เพื่อรองรับการสลับกะหรือขาดงานโดยไม่กระทบไลน์เดิน'
                  : 'Cross-train the remaining 2,240 operators on 2-3 adjacent workstations to maintain resilience against absenteeism.'}
              </li>
              <li>
                <strong>{language === 'th' ? 'การบริหารแรงงานสัมพันธ์ (Labor Relations):' : 'Labor Relations:'}</strong>{' '}
                {language === 'th'
                  ? 'แนะนำให้ดำเนินนโยบายลดผ่าน Natural Attrition (ไม่รับเพิ่ม) ร่วมกับโครงการโอนย้ายไปยังสายผลิตภัณฑ์ใหม่ ก่อนมาตรการเกษียณก่อนกำหนด'
                  : 'Leverage natural turnover freeze and internal transfers to new product lines before offering voluntary early retirement.'}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
