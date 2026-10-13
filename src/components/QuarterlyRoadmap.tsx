import React from 'react';
import { Language } from '../types';
import { Calendar, CheckCircle2, Bot, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

interface QuarterlyRoadmapProps {
  language: Language;
}

export const QuarterlyRoadmap: React.FC<QuarterlyRoadmapProps> = ({ language }) => {
  const quarters = [
    {
      quarter: '2026 Q1',
      titleTh: 'เฟส 1: เริ่มต้นปรับสมดุลสายงาน & ลดผ่านการลาออกธรรมชาติ',
      titleEn: 'Phase 1: Line Balancing & Natural Attrition',
      titleZh: '第一阶段：节拍平衡改善与自然减员吸收',
      reductionTarget: 50,
      cumulative: 50,
      statusTh: 'กำลังดำเนินการ (In Progress)',
      statusZh: '进行中',
      statusEn: 'In Progress',
      color: 'blue',
      itemsTh: [
        'ทบทวน Takt Time ในสาย A Line และ B Line ปรับเกลี่ยงานขจัดคอขวด (-25 คน)',
        'หยุดรับคนทดแทนตำแหน่งที่ลาออกตามธรรมชาติ (Natural Attrition Control) (-15 คน)',
        'ทดสอบติดตั้งระบบป้อนแผ่นโลหะอัตโนมัติในสถานี Door A / Back Plate (-10 คน)',
      ],
      itemsEn: [
        'Review takt time on Line A & B, eliminate bottleneck workstations (-25 pax)',
        'Freeze replacement hiring for natural operator turnover (-15 pax)',
        'Pilot automated destacker feed on Door A & Back Plate station (-10 pax)',
      ],
      itemsZh: [
        'A线、B线开展工位动作平衡分析，消除瓶颈工位浪费（-25人）',
        '冻结自然离职人员补录补充（-15人）',
        '门体A及后背板自动拆垛上料机试运行（-10人）',
      ],
    },
    {
      quarter: '2026 Q2',
      titleTh: 'เฟส 2: ขยายผลหุ่นยนต์หยิบจับชิ้นงาน & ระบบฉีดขึ้นรูปอัตโนมัติ',
      titleEn: 'Phase 2: Robotic Handlers & Injection Automation',
      titleZh: '第二阶段：注塑伺服机械手与发泡夹具联线',
      reductionTarget: 70,
      cumulative: 120,
      statusTh: 'ตามแผนงาน (Scheduled)',
      statusZh: '按计划推进',
      statusEn: 'Scheduled',
      color: 'sky',
      itemsTh: [
        'ติดตั้ง Servo Robot หยิบชิ้นงานฉีดพลาสติก + ตัดเกทอัตโนมัติ (-19 คน)',
        'ปรับปรุงแม่พิมพ์โฟมและระบบอัดประกบ Door C + Pressing + Door D (-19 คน)',
        'ขยายผลระบบสกรูอัตโนมัติในไลน์ A และ B เพิ่มเติม (-32 คน)',
      ],
      itemsEn: [
        'Commission servo robots for injection molding + auto sprue trimming (-19 pax)',
        'Upgrade door foaming fixtures & auto pressing for Door C/D (-19 pax)',
        'Roll out automated screwdriving units in Line A & B (-32 pax)',
      ],
      itemsZh: [
        '注塑车间伺服机械手全线连机投产及自动剪水口（-19人）',
        '门体C、压合、门D工位多工位发泡机改造（-19人）',
        'A/B两线扩展部署自动打螺丝机器人与助力臂（-32人）',
      ],
    },
    {
      quarter: '2026 Q3',
      titleTh: 'เฟส 3: ปรับเปลี่ยนระบบโลจิสติกส์ AGV และงานตัดขอบสุญญากาศ',
      titleEn: 'Phase 3: Autonomous AGV Logistics & CNC Trimming',
      titleZh: '第三阶段：AGV/AMR无人物流与五轴数控修边',
      reductionTarget: 60,
      cumulative: 180,
      statusTh: 'ตามแผนงาน (Scheduled)',
      statusZh: '按计划推进',
      statusEn: 'Scheduled',
      color: 'amber',
      itemsTh: [
        'เริ่มเดินรถขนส่งชิ้นส่วนอัตโนมัติ AGV/AMR แทนการลากจูงด้วยคน (-12 คน)',
        'ติดตั้งเครื่องตัดขอบพลาสติก 5 แกนอัตโนมัติในงาน Vacuum Forming (-10 คน)',
        'ติดตั้งเครื่องใส่ยางขอบประตูและเชื่อมมุมอัตโนมัติ (Door B Gasket) (-9 คน)',
        'ปรับปรุงประสิทธิภาพสายประกอบหลักเฟส 2 (-29 คน)',
      ],
      itemsEn: [
        'Deploy autonomous mobile robots (AMR/AGV) replacing manual tuggers (-12 pax)',
        'Install 5-axis CNC trimming for vacuum forming inner liners (-10 pax)',
        'Automatic gasket corner welding and roll-in insertion on Door B (-9 pax)',
        'Phase 2 assembly line rationalization (-29 pax)',
      ],
      itemsZh: [
        '总装车间导入AGV/AMR自动物流配送小车替代人工配送（-12人）',
        '吸附内胆导入五轴数控自动修边机（-10人）',
        '门体B自动门封条穿条焊角机投入生产（-9人）',
        '总装两线第二阶段定编优化落实（-29人）',
      ],
    },
    {
      quarter: '2026 Q4',
      titleTh: 'เฟส 4: กล้อง AI ตรวจสอบคุณภาพ (AOI) & ปิดจ๊อบเป้าหมาย 240 คน',
      titleEn: 'Phase 4: AI Visual Inspection (AOI) & Target Attainment',
      titleZh: '第四阶段：AI机器视觉检测上线与全面达标验收',
      reductionTarget: 60,
      cumulative: 240,
      statusTh: 'รอบประเมินผล (Review)',
      statusZh: '考核验收',
      statusEn: 'Final Review',
      color: 'emerald',
      itemsTh: [
        'ติดตั้งกล้อง AI Vision ตรวจจับรอยตำหนิผิวและระบบทดสอบไฟฟ้าอัตโนมัติ (-17 คน)',
        'ทดสอบความเสถียรของทุกสายงานตลอด 24 ชม. ไม่ให้กระทบ OEE และของเสีย',
        'สรุปผลสัมฤทธิ์ลดคนครบ 240 คน เหลือ 2,240 คน พร้อมคำนวณเงินประหยัดจริง',
      ],
      itemsEn: [
        'Implement AI visual inspection (AOI) cameras & auto electrical safety testing (-17 pax)',
        'Validate process stability across 24h shifts without hurting OEE or scrap rate',
        'Attain full 240 headcount reduction target to 2,240 active workforce',
      ],
      itemsZh: [
        '上线AI机器视觉外观质检及电气自动化安全测试台（-17人）',
        '验证生产线24小时双班稳定运行，保障OEE稼动率与良品率',
        '全面完成全厂减员240人目标，留存2,240人定编，完成ROI核算',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 lg:p-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {language === 'th'
              ? 'แผนไทม์ไลน์การลดกำลังคนรายไตรมาสปี 2026 (Phased Rollout Roadmap)'
              : language === 'zh'
              ? '2026年季度减员推进与技术改造实施路线图'
              : '2026 Quarterly Headcount Rationalization & Kaizen Roadmap'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'th'
            ? 'แบ่งสัดส่วนการลด 240 คนออกเป็น 4 เฟส เพื่อรักษาเสถียรภาพการผลิตและค่า OEE'
            : language === 'zh'
            ? '将240名减员目标分阶段平稳释放，依托技改项目落地避免影响生产节拍与品质'
            : 'Phased rollout schedule ensuring production stability, zero disruption to OEE, and smooth labor transition'}
        </p>
      </div>

      {/* Quarters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        {quarters.map((q, idx) => {
          const title = language === 'th' ? q.titleTh : language === 'zh' ? q.titleZh : q.titleEn;
          const status = language === 'th' ? q.statusTh : language === 'zh' ? q.statusZh : q.statusEn;
          const items = language === 'th' ? q.itemsTh : language === 'zh' ? q.itemsZh : q.itemsEn;

          return (
            <div
              key={q.quarter}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-blue-300 hover:bg-white transition-all shadow-xs"
            >
              <div>
                {/* Quarter Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                    {q.quarter}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    -{q.reductionTarget} {language === 'th' ? 'คน' : language === 'zh' ? '人' : 'pax'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-snug mb-3">
                  {title}
                </h4>

                {/* Milestones */}
                <ul className="space-y-2 text-xs text-slate-600 mb-4">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer: Cumulative tracker */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {language === 'th' ? 'สะสมสิ้นไตรมาส:' : language === 'zh' ? '累计达成:' : 'Cumulative:'}
                </span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  -{q.cumulative} / 240 คน
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
