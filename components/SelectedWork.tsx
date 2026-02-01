import { Link as LinkIcon } from 'lucide-react';
import React from 'react';

interface SelectedWorkProps {
  projects: any[];
  onProjectClick?: (project: any) => void;
}

const SelectedWork: React.FC<SelectedWorkProps> = ({ projects, onProjectClick }) => {
  const cardShadow = "rgba(0, 0, 0, 0.1) 0px 4px 12px";

  return (
    <section id="work" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto" dir="rtl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-[#203C71] px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">أعمالنا</span>
            <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
          </div>
          <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '200ms' }}>
            ماذا أضفنا لعملائنا؟
          </h2>
        </div>
        <div className="reveal w-full lg:w-1/3 xl:w-1/4" style={{ transitionDelay: '400ms' }}>
          <p className="text-[#6B6B6B] text-base md:text-lg leading-relaxed font-medium text-right">
            استطعنا تعزيز حضور عملائنا في السوق الرقمي وتطوير هوياتهم بلمسات إبداعية، وبنينا جسور تواصل حقيقية قائمة على الفهم والثقة.
          </p>
        </div>
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-2 transition-none" style={{ transitionDelay: '500ms' }}>
        {projects.map((work, idx) => (
          <div 
            key={work.id} 
            onClick={() => onProjectClick && onProjectClick(work)}
            data-cursor-text="عرض المشروع"
            className={`group relative rounded-[20px] overflow-hidden bg-[#e5e5e5] cursor-pointer shadow-sm transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0`}
            style={{ 
                transitionDelay: `${600 + (idx * 150)}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div className="overflow-hidden relative w-full aspect-[3.7/4]">
              <img 
                src={work.image} 
                alt={work.title} 
                className="w-full h-full object-cover transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] scale-105 group-hover:scale-100 md:group-hover:blur-[4px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            <div className="absolute inset-x-4 sm:inset-x-5 md:inset-x-6 bottom-4 sm:bottom-5 md:bottom-6 z-20 transition-all duration-700 transform translate-y-0 opacity-100 md:translate-y-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <div 
                className="bg-[#f0f0f0] rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-2xl border border-white/20"
                style={{ boxShadow: cardShadow }}
              >
                <div className="flex flex-col text-right pr-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#111111] leading-tight">{work.title}</h3>
                  <p className="text-[#888888] text-[11px] sm:text-xs md:text-sm font-bold tracking-tight uppercase mt-0.5">{work.category}</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#203C71] rounded-[16px] sm:rounded-[20px] flex items-center justify-center text-white transition-all duration-500 hover:bg-[#EF7F17] hover:rotate-[-45deg] shrink-0 shadow-lg">
                  <LinkIcon size={20} className="sm:scale-110" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="reveal mt-16 md:mt-24 lg:mt-32 text-center px-4" style={{ transitionDelay: '1000ms' }}>
        <button 
          data-cursor-text="تصفح الآن"
          className="group relative w-full sm:w-auto min-w-[280px] px-12 py-6 md:px-20 md:py-8 bg-[#203C71] text-white rounded-full font-black text-lg md:text-xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
        >
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white">تصفح كافة المشاريع</span>
          <div className="absolute inset-0 bg-[#EF7F17] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
        </button>
      </div>
    </section>
  );
};

export default SelectedWork;