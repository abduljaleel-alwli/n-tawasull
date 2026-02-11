import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const initialFaqs = [
  {
    question: "كيف يعمل نموذج الاشتراك؟",
    answer: "أنت تدفع رسماً شهرياً ثابتاً وتحصل على إمكانية الوصول إلى فريق تصميم مخصص. يمكنك تقديم طلبات غير محدودة، وسنقوم بتسليمها واحداً تلو الآخر (أو اثنين في وقت واحد مع الباقة الاحترافية). لا توجد فواتير بالساعة، ولا عقود — يمكنك الإلغاء أو الإيقاف مؤقتاً في أي وقت."
  },
  {
    question: "ما هي أنواع مهام التصميم التي يمكنني طلبها؟",
    answer: "كل شيء بدءاً من تصميم الشعارات والهوية البصرية إلى واجهات المستخدم (UI/UX) لمواقع الويب وتطبيقات الجوال، ورسومات منصات التواصل الاجتماعي، وتطوير المواقع الكاملة باستخدام Framer."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { getSetting } = useSettings();
  
  const faqs = getSetting('faqs.items', initialFaqs);
  const badge = getSetting('faqs.badge', ' الأسئلة الشائعة');
  const title = getSetting('faqs.title', 'استفسارات.');
  const description = getSetting('faqs.description', 'كل ما تحتاج لمعرفته حول خدمة اشتراك التسويق الخاصة بنا.');

  const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto overflow-hidden" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        
        {/* Heading Section - Right Side in RTL */}
        <div className="lg:col-span-5 flex flex-col items-start text-right space-y-8">
          <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-[25px] shadow-lg" style={{ transitionDelay: '0ms' }}>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            <span className="text-white font-black text-[12px] tracking-tight uppercase">{badge}</span>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '200ms' }}>
              {title}
            </h1>
            <p className="reveal text-[19px] md:text-[21px] text-[#6B6B6B] font-medium leading-[1.4] max-w-sm" style={{ transitionDelay: '400ms' }}>
              {description}
            </p>
          </div>
        </div>

        {/* FAQ Container - Left Side in RTL */}
        <div className="reveal lg:col-span-7 bg-[#E5E5E5] rounded-[20px] p-[7px] flex flex-col gap-3 transition-none" style={{ transitionDelay: '500ms' }}>
          {Array.isArray(faqs) && faqs.map((faq: any, idx: number) => (
            <div 
              key={idx} 
              className={`bg-background rounded-[16px] overflow-hidden transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0`}
              style={{ 
                boxShadow: cardShadow,
                transitionDelay: `${600 + (idx * 150)}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-[20px] flex justify-between items-center text-right group transition-all outline-none"
                data-cursor-text={openIndex === idx ? "إغلاق" : "قراءة"}
              >
                <h3 className="text-[18px] font-black tracking-tight text-[#111111] group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </h3>
                
                {/* Custom Icon Circle */}
                <div className="relative w-11 h-11 bg-[#E5E5E5] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#dcdcdc] transition-colors duration-300">
                  {/* Horizontal Bar (The Minus) */}
                  <div className={`absolute w-5 h-[2.5px] rounded-full transition-all duration-500 ${openIndex === idx ? 'bg-secondary' : 'bg-primary'}`}></div>
                  
                  {/* Vertical Bar (Part of the Plus) */}
                  <div className={`absolute w-[2.5px] h-5 bg-primary rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${openIndex === idx ? 'scale-y-0 opacity-0 rotate-90' : 'scale-y-100 opacity-100 rotate-0'}`}></div>
                </div>
              </button>

              {/* 
                  Answer content with Fluid Height Transition using CSS Grid
              */}
              <div 
                className={`grid transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${openIndex === idx ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-8 pb-1">
                    <div className="w-full h-[1px] bg-[#D1D1D1] mb-6"></div>
                  </div>
                  <div className="px-8 pb-6">
                    <p className="text-[17px] md:text-[18px] text-[#555555] font-medium leading-[1.6]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;