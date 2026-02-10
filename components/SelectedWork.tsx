import { Link as LinkIcon, Layers, Plus, Loader2 } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';

interface SelectedWorkProps {
  projects: any[];
  onProjectClick?: (project: any) => void;
}

const SelectedWork: React.FC<SelectedWorkProps> = ({ projects, onProjectClick }) => {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const cardShadow = "rgba(0, 0, 0, 0.1) 0px 4px 12px";

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(3);
  }, [activeFilter]);

  const categories = useMemo(() => {
    const cats = ['الكل'];
    projects.forEach(p => {
      if (!cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }, [projects]);

  const filteredProjects = activeFilter === 'الكل' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Simulate professional loading delay for aesthetic feel
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section id="work" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto" dir="rtl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">أعمالنا</span>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
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

      {/* Advanced Filter Bar */}
      <div className="reveal mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ transitionDelay: '450ms' }}>
        <div className="flex flex-wrap gap-2.5">
           {categories.map((cat) => (
             <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-[13px] font-black transition-all duration-500 border ${activeFilter === cat ? 'bg-primary border-primary text-white shadow-xl' : 'bg-white border-gray-100 text-[#888888] hover:border-secondary hover:text-secondary'}`}
              data-cursor-text="فلترة"
             >
               {cat}
             </button>
           ))}
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[#999999] text-xs font-black uppercase tracking-widest">
           <Layers size={14} />
           <span>عرض {filteredProjects.length} مشروع</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-500 min-h-[400px]">
        {displayedProjects.map((work, idx) => (
          <div 
            key={`${work.id}-${activeFilter}`} 
            onClick={() => onProjectClick && onProjectClick(work)}
            data-cursor-text="عرض المشروع"
            className={`group relative rounded-[20px] overflow-hidden bg-[#e5e5e5] cursor-pointer shadow-sm animate-entrance-up`}
            style={{ 
                animationDelay: `${(idx % 3) * 100}ms`
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
                className="bg-background rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-2xl border border-white/20"
                style={{ boxShadow: cardShadow }}
              >
                <div className="flex flex-col text-right pr-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#111111] leading-tight">{work.title}</h3>
                  <p className="text-[#888888] text-[11px] sm:text-xs md:text-sm font-bold tracking-tight uppercase mt-0.5">{work.category}</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-[16px] sm:rounded-[20px] flex items-center justify-center text-white transition-all duration-500 hover:bg-secondary hover:rotate-[-45deg] shrink-0 shadow-lg">
                  <LinkIcon size={20} className="sm:scale-110" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-[#999999] font-bold text-lg italic">لا توجد مشاريع في هذه الفئة حالياً...</p>
          </div>
        )}
      </div>
      
      {/* Modern Professional Load More Button */}
      {hasMore && (
        <div className="reveal mt-16 text-center" style={{ transitionDelay: '200ms' }}>
          <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            data-cursor-text={isLoading ? "انتظر" : "استكشف المزيد"}
            className={`group relative inline-flex items-center gap-6 bg-primary text-white rounded-full pr-10 pl-2 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 shadow-2xl overflow-hidden ${isLoading ? 'opacity-80 cursor-wait pr-12' : ''}`}
          >
            <span className="relative z-10 font-black text-lg flex items-center gap-3">
              {isLoading ? (
                <>
                  <span className="animate-pulse">جاري تحميل المشاريع...</span>
                </>
              ) : (
                'تحميل المزيد من الأعمال'
              )}
            </span>
            
            <div className={`w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-primary transition-all duration-500 shadow-inner ${isLoading ? 'animate-spin bg-white/20 text-white' : 'group-hover:rotate-90'}`}>
              {isLoading ? (
                <Loader2 size={28} strokeWidth={3} className="animate-spin" />
              ) : (
                <Plus size={32} strokeWidth={3.5} />
              )}
            </div>

            {/* Glass Background Highlight */}
            <div className={`absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out pointer-events-none ${isLoading ? 'hidden' : ''}`}></div>
            
            {/* Loading Progress Background */}
            <div className={`absolute bottom-0 right-0 h-1 bg-secondary transition-all duration-[1200ms] ease-out ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
          </button>
        </div>
      )}
    </section>
  );
};

export default SelectedWork;