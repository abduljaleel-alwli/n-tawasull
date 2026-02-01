
import React, { useState, useEffect, useRef } from 'react';

const sliderImages = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1611162617263-4ec3060a058e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
];

const serviceData = [
  {
    title: "إدارة حسابات التواصل الاجتماعي",
    description: "إدارة متكاملة تشمل التخطيط، صناعة الهوية الرقمية، الجدولة، والتفاعل عبر مختلف المنصات لتعزيز الحضور وتحقيق النمو.",
    tags: ["لينكدإن", "سناب شات", "تيك توك", "إنستقرام"],
  },
  {
    title: "تحسين محركات البحث وخرائط قوقل",
    description: "استراتيجيات SEO احترافية لرفع ظهور نشاطك، وتطوير صفحة قوقل ماب لزيادة الثقة وتحويل الباحثين لعملاء.",
    tags: ["SEO", "قوقل ماب", "التقييمات", "تهيئة المحتوى"],
  },
  {
    title: "اشتراك واتساب للأعمال",
    description: "حلول احترافية لإدارة المحادثات، تنظيم العملاء، والردود التلقائية لتحسين تجربة التواصل ورضا المستهلك.",
    tags: ["ردود تلقائية", "تنظيم العملاء", "خدمة عملاء", "أتمتة"],
  }
];

const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";

const FolderIconWithPopUp = () => {
  return (
    <div className="relative group/folder w-14 h-10 mb-5 cursor-pointer">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 opacity-0 group-hover/folder:-translate-y-14 group-hover/folder:-translate-x-12 group-hover/folder:-rotate-12 group-hover/folder:opacity-100 transition-all duration-500 delay-75 z-0">
        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 opacity-0 group-hover/folder:-translate-y-20 group-hover/folder:opacity-100 transition-all duration-500 z-0">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 opacity-0 group-hover/folder:-translate-y-14 group-hover/folder:translate-x-4 group-hover/folder:rotate-12 group-hover/folder:opacity-100 transition-all duration-500 delay-100 z-0">
        <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white" />
      </div>

      <div className="relative z-10 w-full h-full">
         <div className="absolute bottom-0 w-full h-8 bg-[#203C71] rounded-lg"></div>
         <div className="absolute top-0 right-0 w-7 h-3 bg-[#203C71] rounded-t-md"></div>
         <div className="absolute bottom-0 w-full h-8 bg-[#2b4d8d] rounded-lg origin-bottom transition-transform duration-500 group-hover/folder:[transform:rotateX(-45deg)] border-t border-white/5 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]"></div>
      </div>
    </div>
  );
};

const ImageSliderCard = ({ cardIndex }: { cardIndex: number }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const intervalTime = 4000 + (cardIndex * 1500); 
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, intervalTime);
  };

  useEffect(() => {
    const initialDelay = cardIndex * 1200;
    const timeout = setTimeout(() => {
      startInterval();
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cardIndex]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    startInterval();
  };

  return (
    <div className="rounded-[16px] overflow-hidden p-0 relative h-full aspect-[4/5] md:aspect-[5/4]" style={{ boxShadow: cardShadow, width: '100%'}}>
      <div 
        className="flex h-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{ transform: `translateX(-${currentSlide * 100}%)`, direction: 'ltr' }}
      >
        {sliderImages.map((img, idx) => (
          <div key={idx} className="min-w-full h-full overflow-hidden">
            <img 
              src={img} 
              alt="Service visual" 
              className={`w-full h-full object-cover rounded-[16px] transition-transform duration-[2000ms] ease-out`} 
            />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full flex gap-1.5 shadow-md border border-white/20 z-20">
        {sliderImages.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => goToSlide(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-700 cursor-pointer outline-none border-none p-0 ${currentSlide === idx ? 'bg-[#EF7F17] w-4' : 'bg-black/10 hover:bg-black/20'}`}
            aria-label={`انتقل إلى الصورة رقم ${idx + 1}`}
            data-cursor-text="شاهد"
          />
        ))}
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto overflow-visible" dir="rtl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-[#203C71] px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">خدماتنا</span>
            <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
          </div>
          <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '200ms' }}>
            ما يتجاوز التوقعات.
          </h2>
        </div>
        <div className="reveal w-full lg:w-1/3 xl:w-1/4" style={{ transitionDelay: '400ms' }}>
          <p className="text-[#6B6B6B] text-base md:text-lg leading-relaxed font-medium text-right">
            نقدم خدماتنا الأساسية لتواكب تطلعات كافة عملائنا ونسعى دائماً لتنفيذها بالصورة المطلوبة.
          </p>
        </div>
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 transition-none" style={{ transitionDelay: '500ms' }}>
        {serviceData.map((service, idx) => (
          <div 
            key={idx} 
            className={`bg-[#e5e5e5] rounded-[23px] p-[7px] flex flex-col md:flex-row lg:flex-col gap-[7px] opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0 transition-all duration-700`}
            style={{ 
              transitionDelay: `${600 + (idx * 150)}ms`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div 
              className="bg-[#f2f2f2] rounded-[16px] p-8 flex flex-col items-start w-full md:w-1/2 lg:w-full h-auto lg:h-[320px] text-right" 
              style={{ boxShadow: cardShadow }}
            >
              <FolderIconWithPopUp />
              <h3 className="text-2xl font-black text-[#111111] mb-2 tracking-tight leading-tight">{service.title}</h3>
              <p className="text-[#666666] text-[14px] font-medium leading-relaxed mb-6 line-clamp-2 md:line-clamp-3 lg:line-clamp-2">{service.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {service.tags.map((tag) => (
                  <span key={tag} className="px-3.5 py-2 bg-[#e8e8e8] rounded-full text-[10px] font-black text-[#555555] uppercase tracking-wider flex items-center gap-1.5 transition-all hover:bg-white hover:text-[#EF7F17]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF7F17]"></span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-full">
              <ImageSliderCard cardIndex={idx} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
