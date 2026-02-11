import React from 'react';
import { Rocket, Target, Users, Shield, Zap, TrendingUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const initialBenefitData = [
  {
    title: "الريادة والابتكار",
    description: "لا نتبع المسارات الممهدة، بل نصنع مساراتنا عبر تقديم أفكار خارج الصندوق تضمن لعملائنا الانفراد والتميز.",
    icon_type: "class",
    icon_value: "fa-solid fa-rocket"
  },
  {
    title: "الاحترافية المطلقة",
    description: "نؤمن بأن التفاصيل الصغيرة تصنع الفارق الكبير؛ نلتزم بالدقة المتناهية وبراعة التنفيذ وأعلى المعايير المهنية.",
    icon_type: "class",
    icon_value: "fa-solid fa-bolt"
  },
  {
    title: "الشراكة والارتباط",
    description: "لا نرى عملاءنا كمجرد مستفيدين، بل كشركاء نجاح. نتبنى أهدافهم كأنها أهدافنا الخاصة للوصول للقمة.",
    icon_type: "class",
    icon_value: "fa-solid fa-users"
  }
];

const RenderIcon = ({ type, value }: { type: string, value: string }) => {
    if (type === 'class') {
        return <i className={`${value} text-2xl md:text-3xl`}></i>;
    } else if (type === 'svg') {
        return <div dangerouslySetInnerHTML={{ __html: value }} className="w-8 h-8 md:w-10 md:h-10 [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-current [&>svg]:fill-current" />;
    }
    return <Zap size={24} strokeWidth={2.5} />;
};

const Benefits: React.FC = () => {
  const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";
  const { getSetting } = useSettings();
  
  const badge = getSetting('feature.badge', ' قيمنا الجوهرية');
  const title = getSetting('feature.title', 'ما نؤمن به.');
  const description = getSetting('feature.description', 'في نقطة تواصل، نؤمن بأن الالتزام بالقيم هو ما يصنع التميز الحقيقي ويخلق أثراً مستداماً لشركائنا.');
  const benefitData = getSetting('feature.items', initialBenefitData);
  const totalDots = Array.isArray(benefitData) ? benefitData.length : 0;

  return (
    <section id="benefits" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto overflow-hidden" dir="rtl">
      {/* Updated Header Structure */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">{badge}</span>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
          </div>
          <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '200ms' }}>
            {title}
          </h2>
        </div>
        <div className="reveal w-full lg:w-1/3 xl:w-1/4" style={{ transitionDelay: '400ms' }}>
          <p className="text-[#6B6B6B] text-base md:text-lg leading-relaxed font-medium text-right">
            {description}
          </p>
        </div>
      </div>

      <div className="reveal bg-[#e5e5e5] p-[7px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[7px] rounded-[20px] overflow-visible border border-[#e5e5e5] transition-none" style={{ transitionDelay: '300ms' }}>
        {Array.isArray(benefitData) && benefitData.map((benefit: any, idx: number) => (
          <div 
            key={idx} 
            className="group bg-[#F2F2F2] rounded-[16px] p-10 min-h-[280px] flex flex-col justify-between hover:bg-white transition-all duration-700 cursor-default opacity-0 translate-y-10 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0"
            style={{ 
                boxShadow: cardShadow,
                transitionDelay: `${350 + (idx * 70)}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div className="flex justify-between items-start">
              <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                <RenderIcon type={benefit.icon_type} value={benefit.icon_value} />
              </div>
              <div className="flex gap-1.5" dir="ltr">
                {[...Array(totalDots)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= idx ? 'bg-secondary' : 'bg-[#D9D9D9]'}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-3 text-right">
              <h3 className="text-2xl font-black text-[#111111] tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-[#6B6B6B] text-base font-medium leading-snug">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;