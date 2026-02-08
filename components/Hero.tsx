
import React from 'react';
import { ArrowLeft, ChevronDown, Star } from 'lucide-react';

const Hero: React.FC = () => {
  const column1 = [
    { id: 'design1', height: 'h-[220px]', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
    { id: 'design2', height: 'h-[300px]', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 'design3', height: 'h-[240px]', src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800' },
  ];

  const column2 = [
    { id: 'design4', height: 'h-[300px]', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
    { id: 'design5', height: 'h-[220px]', src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800' },
    { id: 'design6', height: 'h-[300px]', src: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800' },
  ];

  const AnimatedButton = ({ 
    text, 
    href, 
    variant = 'orange' 
  }: { 
    text: string, 
    href: string, 
    variant?: 'orange' | 'black' 
  }) => {
    const isOrange = variant === 'orange';
    
    return (
      <a 
        href={href} 
        data-cursor-text="اضغط هنا"
        className={`group relative inline-flex items-center rounded-full pr-8 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 shadow-xl overflow-hidden
          ${isOrange ? 'bg-[#EF7F17] text-white' : 'bg-[#203C71] text-white'}
        `}
      >
        <div className="relative h-7 overflow-hidden ml-5 pointer-events-none">
          <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
            <span className="h-7 font-black leading-7 whitespace-nowrap flex items-center">{text}</span>
            <span className="h-7 font-black leading-7 whitespace-nowrap flex items-center">{text}</span>
          </div>
        </div>

        <div className={`w-12 h-12 rounded-full relative overflow-hidden transition-colors duration-500 shrink-0
          ${isOrange ? 'bg-[#203C71] text-[#EF7F17]' : 'bg-[#EF7F17] text-[#203C71]'}
        `}>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full">
            <ArrowLeft size={24} strokeWidth={3} className="rotate-0" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0">
            <ArrowLeft size={24} strokeWidth={3} className="rotate-0" />
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="relative pb-16 px-6 md:px-12 max-w-[1350px] mx-auto min-h-screen flex flex-col justify-center" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative pb-20">
        
        <div className="lg:col-span-7 flex flex-col items-start text-right pt-[150px] md:pt-32 z-10">
          <div className="inline-flex items-center gap-2 bg-[#203C71] px-5 py-2.5 rounded-full mb-8 shadow-xl animate-entrance-up delay-1000 hover:scale-105 transition-transform duration-300">
            <span className="text-[#EF7F17] font-black text-[11px]">//</span>
            <span className="text-white text-[11px] font-black tracking-widest uppercase">نقطة تواصل - مكة المكرمة</span>
            <span className="text-[#EF7F17] font-black text-[11px]">//</span>
          </div>

          <h1 className="text-[32px] md:text-[44px] lg:text-[56px] font-black leading-[1.3] tracking-[-0.01em] mb-8 text-balance animate-entrance-up delay-1200">
            الحل التسويقي
             الاستراتيجي الأول
            <span className="text-[#999999] px-4">في المملكة </span>
          </h1>

          <p className="text-base md:text-lg text-[#6B6B6B] font-medium mb-10 max-w-xl leading-relaxed animate-entrance-up delay-1400">
            انطلقـنا مـن جـوار بيت الله الحرام، مـن قلب مكة المكرمة، لنكون المحرك الفاعل لنمو أعمالكم عبر حلول تسويقية تجمع بين الجـودة والابتكار الرقمي.
          </p>

          <div className="flex flex-row sm:flex-wrap items-center gap-4 mb-12 sm:mb-16 animate-entrance-up delay-1600 w-full sm:w-auto">
            <AnimatedButton text="خدماتنا" href="#services" variant="orange" />
            <AnimatedButton text="تواصل معنا" href="#contact" variant="black" />
          </div>

          <div className="flex flex-row items-center gap-5 animate-entrance-up delay-1800">
            <div className="flex -space-x-4 space-x-reverse shrink-0">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-[#f0f0f0] overflow-hidden shadow-lg bg-gray-200 relative z-0 hover:z-10 transition-transform hover:scale-110 cursor-pointer" data-cursor-text="عملاءنا">
                        <img 
                            src={`https://i.pravatar.cc/150?u=tawasull_v${i}`} 
                            alt="User" 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-start gap-1.5">
                <div className="flex gap-1 text-[#EF7F17]">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                    ))}
                </div>
                <div className="text-right">
                    <p className="text-[14px] font-black text-[#111111] leading-none">موثوق به من +100 شركة</p>
                    <p className="text-[10px] font-bold text-[#999999] tracking-wider uppercase mt-1">
                        نتائج استثنائية
                    </p>
                </div>
            </div>
          </div>
        </div>

        <div
          data-cursor-text="رؤيتنا"
          className="hero-image-grid-container lg:col-span-5 grid grid-cols-2 gap-3 h-[500px] sm:h-[600px] md:h-[780px] overflow-hidden relative animate-entrance-scale delay-2200 pt-0 mt-8 lg:mt-0"
        >
          <div className="space-y-2 animate-scroll-up">
            {[...column1, ...column1, ...column1].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className={`group rounded-[20px] overflow-hidden ${item.height} relative`}>
                <img src={item.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="tawasull design" />
              </div>
            ))}
          </div>
          <div className="space-y-2 animate-scroll-down">
            {[...column2, ...column2, ...column2].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className={`group rounded-[20px] overflow-hidden ${item.height} relative`}>
                <img src={item.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="tawasull design" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-3 animate-entrance-up delay-2800 pointer-events-none">
          <span className="text-[10px] font-black text-[#999999] tracking-[0.2em] uppercase">اسحب للأسفل</span>
          <div className="relative w-6 h-10 rounded-full border-2 border-[#D1D1D1] flex justify-center p-1 overflow-hidden">
             <div className="w-1 h-2 bg-[#EF7F17] rounded-full animate-scroll-indicator"></div>
          </div>
      </div>
      
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-33.33%); }
          100% { transform: translateY(0); }
        }
        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(18px); opacity: 0; }
        }
        .animate-scroll-up {
          animation: scroll-up 55s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 55s linear infinite;
        }
        .animate-scroll-indicator {
          animation: scroll-indicator 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .hero-image-grid-container {
          scale: 1; 
        }
        
        @media (min-width: 1024px) {
          .hero-image-grid-container {
            scale: 1.1;
            right: -26px;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
