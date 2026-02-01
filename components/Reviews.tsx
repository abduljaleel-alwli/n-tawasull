
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    rating: "4.9",
    text: "\"مبادرون، دقيقون، ومن السهل العمل معهم — لا يحتاجون لتوجيه مستمر، مجرد تعاون سلس من البداية للنهاية.\"",
    author: "خالد سعيد",
    role: "مدير التسويق",
    avatar: "https://i.pravatar.cc/150?u=a1"
  },
  {
    rating: "5.0",
    text: "\"شعرنا وكأنهم جزء من فريقنا؛ كان التواصل واضحاً، والتعديلات تم تنفيذها بشكل مثالي من المرة الأولى.\"",
    author: "ليلى حسن",
    role: "رئيسة المنتج",
    avatar: "https://i.pravatar.cc/150?u=a2"
  },
  {
    rating: "4.9",
    text: "\"الجودة لا مثيل لها. أرسلنا طلبنا يوم الاثنين وحصلنا على تصاميم مصقولة واحترافية بحلول يوم الأربعاء.\"",
    author: "ياسين علي",
    role: "المؤسس التنفيذي",
    avatar: "https://i.pravatar.cc/150?u=a3"
  },
  {
    rating: "4.9",
    text: "\"لقد جربنا اشتراكات تصميم أخرى — لكن لا شيء يضاهي فورميكس. احترافية، موثوقية، وإبداع حقيقي.\"",
    author: "مريم صقر",
    role: "رئيسة العمليات",
    avatar: "https://i.pravatar.cc/150?u=a4"
  }
];

const Reviews: React.FC = () => {
  const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto overflow-hidden" dir="rtl">
      {/* Updated Header Structure */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-[#203C71] px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">التقييمات</span>
            <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
          </div>
          <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '200ms' }}>
            قصص نجاح.
          </h2>
        </div>
        <div className="reveal w-full lg:w-1/3 xl:w-1/4" style={{ transitionDelay: '400ms' }}>
          <p className="text-[#6B6B6B] text-base md:text-lg leading-relaxed font-medium text-right">
            اكتشف كيف يساعد اشتراك التسويق الخاص بنا العلامات التجارية المبتكرة على النمو بشكل أذكى وأسرع.
          </p>
        </div>
      </div>

      <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-6 transition-none" style={{ transitionDelay: '500ms' }}>
        
        {/* Left Side: Summary Dark Card (#203C71) */}
        <div 
          className="lg:col-span-5 bg-[#203C71] rounded-[32px] p-10 flex flex-col justify-between min-h-[500px] text-white shadow-2xl transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0"
          style={{ 
            transitionDelay: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="flex justify-between items-start">
            <div className="text-7xl font-black tracking-tighter">4.9/5</div>
            <div className="max-w-[150px] text-right">
              <p className="text-sm font-bold leading-tight text-white/70">لقد سلمنا +100 مشروع حققت نتائج حقيقية لعملائنا.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-start gap-4">
              <div className="flex -space-x-3 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#203C71] overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=rev${i}`} className="w-full h-full object-cover" alt="User avatar" />
                  </div>
                ))}
              </div>
              
              <div className="space-y-1 text-right">
                <div className="flex gap-1 text-[#EF7F17]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <h4 className="text-lg font-black mt-2 text-white">موثوق به من +100 شركة</h4>
                <p className="text-[10px] font-black text-white/50 tracking-wider uppercase">لقد حققوا أهدافهم — أنت التالي.</p>
              </div>
            </div>

            <button className="group relative w-full bg-[#f0f0f0] text-[#203C71] py-5 rounded-full font-black text-lg overflow-hidden transition-all duration-500 hover:bg-white active:scale-95 shadow-xl" data-cursor-text="شارك رأيك">
              <div className="relative h-7 overflow-hidden pointer-events-none">
                <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
                  <span className="h-7 text-lg font-black leading-7 whitespace-nowrap flex items-center justify-center">اترك تقييماً</span>
                  <span className="h-7 text-lg font-black leading-7 whitespace-nowrap flex items-center justify-center">اترك تقييماً</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Testimonials Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 transition-none">
          {testimonials.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#e5e5e5] rounded-[20px] p-1.5 flex flex-col gap-1.5 transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0"
              style={{ 
                transitionDelay: `${750 + (idx * 150)}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div 
                className="bg-[#f0f0f0] rounded-[16px] p-8 flex flex-col gap-6 text-right h-full"
                style={{ boxShadow: cardShadow }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#111111]">{item.rating}</span>
                  <Star size={12} fill="#EF7F17" className="text-[#EF7F17]" />
                  <span className="text-[9px] font-black text-[#999999] tracking-widest uppercase">تقييم</span>
                </div>
                <h3 className="font-bold leading-relaxed text-[#111111] text-[15px] sm:text-[16px]">
                  {item.text}
                </h3>
              </div>

              <div className="px-6 py-4 flex items-center gap-4 text-right mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/50">
                  <img src={item.avatar} className="w-full h-full object-cover" alt={item.author} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-[#111111]">{item.author}</span>
                  <span className="text-[9px] font-black text-[#999999] tracking-widest uppercase">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
