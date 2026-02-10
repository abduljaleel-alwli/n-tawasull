import React, { useState } from 'react';
import { Check, Plus, Info, Zap } from 'lucide-react';

const Pricing: React.FC = () => {
  const [hasDevRetainer, setHasDevRetainer] = useState(false);
  const [hasDevProject, setHasDevProject] = useState(false);

  const basePriceRetainer = 5000;
  const devAddonRetainer = 1000;
  const basePriceProject = 10000;
  const devAddonProject = 5000;

  const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";

  return (
    <section id="pricing" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto" dir="rtl">
      {/* Updated Header Structure */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">الأسعار</span>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
          </div>
          <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '200ms' }}>
            باقات مرنة.
          </h2>
        </div>
        <div className="reveal w-full lg:w-1/3 xl:w-1/4" style={{ transitionDelay: '400ms' }}>
          <p className="text-[#6B6B6B] text-base md:text-lg leading-relaxed font-medium text-right">
            اختر الباقة التي تناسب احتياجاتك وابدأ اليوم. رسوم ثابتة. تصميم غير محدود. بدون ضغوط.
          </p>
        </div>
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-none" style={{ transitionDelay: '500ms' }}>
        
        {/* Column 1: Step Cards */}
        <div 
          className="flex flex-col gap-4 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0 transition-all duration-700"
          style={{ 
            transitionDelay: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {[
            { label: 'اشترك', desc: 'اختر الخطة التي تناسب تدفق عملك', icon: <Plus size={20} /> },
            { label: 'اطلب', desc: 'أرسل مهامك عبر بوابة التصميم الخاصة بك', icon: <Info size={20} /> },
            { label: 'اعتمد أو عدّل', desc: 'استلم تصاميمك في غضون 2-3 أيام عمل', icon: <Check size={20} /> },
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-white rounded-[32px] p-8 flex flex-col gap-10 transition-transform hover:scale-[1.02] duration-300"
              style={{ 
                boxShadow: cardShadow
              }}
            >
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div className="flex gap-1.5" dir="ltr">
                  {[...Array(3)].map((_, dot) => (
                    <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === i ? 'bg-secondary' : 'bg-gray-200'}`}></div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-black text-2xl text-[#111111] mb-1">{item.label}</h4>
                <p className="text-sm font-bold text-[#999999] leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: Subscription Plan Card */}
        <div 
          className="bg-white rounded-[40px] p-10 flex flex-col relative overflow-hidden transition-all duration-700 hover:scale-[1.02] opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0"
          style={{ 
            boxShadow: cardShadow,
            transitionDelay: '750ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="flex justify-between items-start mb-10">
            <div className="p-4 bg-[#f8f8f8] rounded-2xl">
                <Zap size={28} className="text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-right flex items-baseline gap-1" dir="ltr">
                <span className="text-5xl font-black text-primary tracking-tighter">${(basePriceRetainer + (hasDevRetainer ? devAddonRetainer : 0)) / 1000}K</span>
                <span className="text-xl font-bold text-[#999999]">/ش</span>
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-[#111111] mb-4">اشتراك التصميم</h3>
          <p className="text-[#6B6B6B] text-base font-bold leading-relaxed mb-10">
            مثالي للمؤسسين الذين يحتاجون إلى تعاون مستمر وسلس من البداية إلى النهاية.
          </p>
          
          <div className="bg-[#f8f8f8] rounded-2xl p-4 flex justify-between items-center border border-gray-100 mb-10">
            <div className="flex items-center gap-2">
                <Plus size={16} className="text-primary" />
                <span className="text-xs font-black uppercase tracking-wider text-primary">تطوير + $1000</span>
            </div>
            <button 
                onClick={() => setHasDevRetainer(!hasDevRetainer)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${hasDevRetainer ? 'bg-secondary' : 'bg-[#D1D1D1]'}`}
                data-cursor-text="تغيير"
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${hasDevRetainer ? '-translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <ul className="space-y-4 mb-12">
            {['طلبات غير محدودة', 'طلب واحد في كل مرة', 'رسوم شهرية ثابتة', 'تواصل غير متزامن', 'نطاق عمل مرن', 'إيقاف الاشتراك مؤقتاً'].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-[15px] font-black text-[#444444]">
                    <div className="bg-secondary/10 p-1 rounded-full"><Check size={14} className="text-secondary" strokeWidth={4} /></div>
                    {feature}
                </li>
            ))}
          </ul>

          <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-lg hover:bg-secondary hover:text-primary transition-all duration-500 mt-auto" data-cursor-text="اشترك">
            اشترك الآن
          </button>
        </div>

        {/* Column 3: Project Plan Card */}
        <div 
          className="bg-primary rounded-[40px] p-10 flex flex-col relative overflow-hidden transition-all duration-700 hover:scale-[1.02] shadow-2xl md:col-span-2 lg:col-span-1 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0"
          style={{ 
            transitionDelay: '900ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="absolute top-8 left-8">
             <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="text-white text-[10px] font-black tracking-widest uppercase">مشروع</span>
             </div>
          </div>

          <div className="flex justify-between items-start mb-10 mt-6">
            <div className="p-4 bg-white/10 rounded-2xl">
                <Check size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-right" dir="ltr">
                <span className="text-5xl font-black text-white tracking-tighter">${(basePriceProject + (hasDevProject ? devAddonProject : 0)) / 1000}K</span>
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4">مشروع واحد</h3>
          <p className="text-gray-300 text-base font-bold leading-relaxed mb-10">
            اجعل موقع أحلامك حقيقة في أيام معدودة. مثالي للشركات الناشئة في مراحل الانطلاق.
          </p>
          
          <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center border border-white/10 mb-10">
            <div className="flex items-center gap-2">
                <Plus size={16} className="text-white" />
                <span className="text-xs font-black uppercase tracking-wider text-white">تطوير + $5000</span>
            </div>
            <button 
                onClick={() => setHasDevProject(!hasDevProject)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${hasDevProject ? 'bg-white' : 'bg-white/20'}`}
                data-cursor-text="تغيير"
            >
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${hasDevProject ? '-translate-x-6 bg-primary' : 'translate-x-0 bg-white'}`}></div>
            </button>
          </div>

          <ul className="space-y-4 mb-12">
            {['فريق متخصص من الخبراء', 'تطوير ويب شامل', 'جدول زمني مخصص', 'تواصل مباشر', 'تحسين محركات البحث SEO', 'تحديثات كل 48 ساعة'].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-[15px] font-black text-gray-200">
                    <div className="bg-white/10 p-1 rounded-full"><Check size={14} className="text-white/40" strokeWidth={4} /></div>
                    {feature}
                </li>
            ))}
          </ul>

          <button className="w-full bg-white text-primary py-6 rounded-3xl font-black text-lg hover:bg-secondary transition-all duration-500 mt-auto" data-cursor-text="ابدأ">
            ابدأ مشروعك
          </button>
        </div>

      </div>
    </section>
  );
};

export default Pricing;