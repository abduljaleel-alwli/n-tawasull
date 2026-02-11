
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, Link as LinkIcon, MessageCircle, ArrowLeft, Loader2, Play } from 'lucide-react';
import { fetchProjectById, ProjectItem } from '../utils/api';

interface ProjectDetailProps {
  project: ProjectItem;
  allProjects: ProjectItem[];
  onProjectSelect: (project: ProjectItem) => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project: initialProject, allProjects, onProjectSelect, onBack }) => {
  const cardShadow = "rgba(0, 0, 0, 0.1) 0px 4px 12px";
  
  const [displayProject, setDisplayProject] = useState<ProjectItem>(initialProject);
  const [detailedProject, setDetailedProject] = useState<ProjectItem | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [transitionState, setTransitionState] = useState<'visible' | 'exiting' | 'resetting' | 'entering'>('visible');
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch Full Details when Project ID changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingDetails(true);
    
    // Use initial info while loading to show something immediately
    setDetailedProject(null);

    fetchProjectById(displayProject.id).then(fullData => {
      if (isMounted) {
        if (fullData) {
          setDetailedProject(fullData);
        }
        setIsLoadingDetails(false);
      }
    });

    return () => { isMounted = false; };
  }, [displayProject.id]);

  // Combine initial list data with full details if available
  const activeProject = detailedProject || displayProject;

  // Scroll Progress Logic
  useEffect(() => {
    const scrollContainer = containerRef.current?.closest('.fixed.inset-0') as HTMLElement;
    
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const totalScrollable = scrollHeight - clientHeight;
      
      setIsScrolled(scrollTop > 50);

      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }
      
      const progress = (scrollTop / totalScrollable) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [displayProject.id, transitionState, detailedProject]); // Re-calc on detail load

  // Handle Project Changes with Internal Animation
  useEffect(() => {
    if (initialProject.id !== displayProject.id) {
        setTransitionState('exiting');
        const scrollContainer = containerRef.current?.closest('.fixed.inset-0');

        setTimeout(() => {
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }

            setTimeout(() => {
                const revealElements = containerRef.current?.querySelectorAll('.reveal');
                revealElements?.forEach(el => el.classList.remove('reveal-visible'));

                setDisplayProject(initialProject);
                setScrollProgress(0); 
                setIsScrolled(false);
                setLoadingProjectId(null); 
                setDetailedProject(null); // Reset detail
                
                if (scrollContainer) {
                    scrollContainer.scrollTop = 0;
                }
                setTransitionState('resetting');

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTransitionState('entering');
                        setTimeout(() => {
                            setTransitionState('visible');
                        }, 1100);
                    });
                });
            }, 700); 
        }, 1100); 
    }
  }, [initialProject.id, displayProject.id]);

  // Local Intersection Observer to handle reveals for new content
  useEffect(() => {
    if (transitionState === 'exiting') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0,
    });

    // Delay to allow DOM updates to complete after state change
    const timer = setTimeout(() => {
        const elements = containerRef.current?.querySelectorAll('.reveal');
        elements?.forEach(el => observer.observe(el));
    }, 200);

    return () => {
        clearTimeout(timer);
        observer.disconnect();
    };
  }, [displayProject.id, detailedProject, transitionState]);

  const nextProjects = useMemo(() => {
    return allProjects
      .filter(p => p.id !== displayProject.id)
      .slice(0, 3);
  }, [displayProject.id, allProjects]);

  const handleNextProjectClick = (work: ProjectItem) => {
    if (loadingProjectId) return; 
    setLoadingProjectId(work.id);
    setTimeout(() => {
        onProjectSelect(work);
    }, 450);
  };

  const getContainerStyles = () => {
    const baseTransition = "transition-all duration-[1100ms] cubic-bezier(0.16, 1, 0.3, 1) will-change-transform";
    switch(transitionState) {
        case 'exiting': return `translate-y-[-100vh] ${baseTransition}`;
        case 'resetting': return 'translate-y-[100vh] transition-none';
        case 'entering': return `translate-y-0 ${baseTransition}`;
        default: return 'translate-y-0';
    }
  };

  const getContentStyles = () => {
    const baseFade = "transition-opacity duration-[800ms] ease-in-out";
    switch(transitionState) {
        case 'exiting': return `opacity-0 ${baseFade}`;
        case 'resetting': return 'opacity-0 transition-none';
        case 'entering': return `opacity-100 ${baseFade}`;
        default: return 'opacity-100';
    }
  };

  const hasVideos = activeProject.videos && activeProject.videos.length > 0;
  const hasImages = activeProject.images && activeProject.images.length > 0;
  
  // Construct dynamic feature list from API data
  const featureList = useMemo(() => {
    const list = [
        { label: 'التصنيف', value: activeProject.category }
    ];
    if (activeProject.features && Array.isArray(activeProject.features)) {
        activeProject.features.forEach(f => {
             list.push({ label: f.title, value: f.description });
        });
    }
    return list;
  }, [activeProject]);

  return (
    <div 
      ref={containerRef}
      className={`bg-background min-h-screen pb-32 relative ${getContainerStyles()}`} 
      dir="rtl"
    >
      <div className={`sticky top-0 left-0 right-0 z-[210] transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="relative px-6 md:px-12 max-w-[1350px] mx-auto flex justify-between items-center z-10">
            <button 
              onClick={onBack}
              className="group relative z-50 inline-flex items-center rounded-full pr-1.5 sm:pr-8 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 shadow-xl overflow-hidden bg-white text-primary"
              data-cursor-text="عودة"
            >
              <div className="relative h-6 overflow-hidden ml-5 pointer-events-none hidden sm:inline-block">
                <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
                  <span className="h-6 text-[14px] font-black leading-6 whitespace-nowrap flex items-center">العودة للمشاريع</span>
                  <span className="h-6 text-[14px] font-black leading-6 whitespace-nowrap flex items-center">العودة للمشاريع</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full relative overflow-hidden bg-primary text-white shrink-0">
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full">
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0">
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
              </div>
            </button>

            <div className={`flex items-center gap-3 transition-all duration-500 ${isScrolled ? 'bg-white/50 border-white/40 border border-black/5 shadow-sm' : 'bg-transparent border-transparent'} backdrop-blur-sm px-3 py-1.5 rounded-full border`}>
               <span className={`text-[10px] font-black tracking-widest uppercase opacity-60 hidden sm:inline-block ${isScrolled ? 'text-secondary' : 'text-[#888888]'}`}>قيد القراءة</span>
               <div className="flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-[#D1D1D1] hidden sm:block"></div>
                  <span className="text-[12px] font-black text-primary tabular-nums min-w-[3ch] text-center" dir="ltr">{Math.round(scrollProgress)}%</span>
               </div>
            </div>
        </div>
      </div>

      <div className={`${getContentStyles()}`}>
        <div className="max-w-[1350px] mx-auto px-6 pt-4 md:pt-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 text-right">
            <div className="flex-1">
              <h1 className="reveal text-[42px] md:text-[68px] font-black text-primary tracking-tighter leading-[1.1] mb-6" style={{ transitionDelay: '200ms' }}>
                {activeProject.title}
              </h1>
              <div className="reveal text-lg md:text-xl text-[#6B6B6B] font-medium leading-relaxed max-w-2xl" style={{ transitionDelay: '400ms' }}>
                 {/* Using dangerouslySetInnerHTML if description contains HTML breaks, otherwise just text */}
                 {activeProject.description}
              </div>
            </div>
            
            <div className="reveal shrink-0 mb-2" style={{ transitionDelay: '600ms' }}>
              <a 
                href="https://wa.me/966555218270" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative inline-flex items-center rounded-full pr-8 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 shadow-xl overflow-hidden bg-primary text-white"
                data-cursor-text="تواصل"
              >
                <div className="relative h-7 overflow-hidden ml-5 pointer-events-none">
                  <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
                    <span className="h-7 text-xl font-black leading-7 whitespace-nowrap flex items-center">تواصل معنا</span>
                    <span className="h-7 text-xl font-black leading-7 whitespace-nowrap flex items-center">تواصل معنا</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full relative overflow-hidden bg-secondary text-primary shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full">
                    <MessageCircle size={22} strokeWidth={3} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0">
                    <MessageCircle size={22} strokeWidth={3} />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Details Grid - Dynamically populated from API features */}
          <div className="reveal bg-[#E5E5E5] p-[7px] rounded-[24px] grid grid-cols-1 md:grid-cols-3 gap-[7px] mb-24 shadow-sm" style={{ transitionDelay: '800ms' }}>
            {featureList.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[18px] p-8 md:p-10 flex flex-col items-start text-right">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-[11px] font-black text-secondary tracking-[0.1em] uppercase">//</span>
                  <span className="text-[11px] font-black text-[#888888] tracking-[0.1em] uppercase">{item.label}</span>
                </div>
                <p className="text-[20px] md:text-[24px] font-black text-primary leading-tight line-clamp-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <section className="mb-24 reveal" style={{ transitionDelay: '1000ms' }}>
            <div className="rounded-[20px] overflow-hidden aspect-[16/10] lg:aspect-[16/8] relative group bg-[#e5e5e5]">
              <img src={activeProject.main_image} alt="Project Overview" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" />
              <div className="absolute top-8 left-8 bg-primary/95 backdrop-blur px-4 py-2 rounded-lg text-[10px] font-black text-white shadow-lg border border-white/10 uppercase tracking-widest">
                 بواسطة نقطة تواصل
              </div>
            </div>
          </section>

          {/* Content / Result Section - Renders raw HTML from API */}
          <section className="mb-32 grid grid-cols-1 gap-16 text-right">
            {activeProject.content ? (
              <div className="space-y-8">
                 <div 
                    className="text-[18px] md:text-[20px] text-[#6B6B6B] font-semibold leading-[1.6]" 
                    dangerouslySetInnerHTML={{ __html: activeProject.content }}
                 />
              </div>
            ) : null}
          </section>

          {/* Image Grid from API */}
          {hasImages && (
             <section className="mb-32 space-y-2 reveal" style={{ transitionDelay: '200ms' }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                  {activeProject.images?.slice(0, 3).map((img, idx) => (
                    <div key={idx} className={`${idx === 0 ? 'lg:col-span-12 aspect-[16/7]' : 'lg:col-span-6 aspect-square'} rounded-[20px] overflow-hidden bg-[#e5e5e5]`}>
                       <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]" alt={`Detail ${idx+1}`} />
                    </div>
                  ))}
                </div>
             </section>
          )}

          {/* Video Showcase Section from API */}
          {hasVideos && (
             <section className="mb-32 reveal" style={{ transitionDelay: '300ms' }}>
                <div className="flex flex-col items-start gap-4 mb-12">
                  <div className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-full shadow-lg">
                    <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
                    <span className="text-white text-[12px] font-black tracking-widest uppercase">استعراض مرئي</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight">التجربة الحية.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeProject.videos?.map((vid, idx) => {
                     return (
                        <div key={idx} className="group space-y-5 reveal transition-all duration-700" style={{ transitionDelay: `${400 + (idx*150)}ms` }}>
                          <div className="relative rounded-[32px] overflow-hidden aspect-video bg-[#E5E5E5] shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 border-4 border-white/50">
                            {vid.iframe ? (
                                <div 
                                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                                    dangerouslySetInnerHTML={{ __html: vid.iframe }}
                                />
                            ) : (
                                <iframe 
                                  className="absolute inset-0 w-full h-full"
                                  src={vid.url || ''} 
                                  title={vid.title}
                                  frameBorder="0" 
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen
                                ></iframe>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-primary">{vid.title}</h4>
                        </div>
                     );
                  })}
                </div>
             </section>
          )}

          <section className="pb-20">
            <h2 className="reveal text-5xl md:text-7xl font-black text-primary tracking-tighter mb-16 text-right" style={{ transitionDelay: '200ms' }}>مشاريع تالية.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {nextProjects.map((work, idx) => (
                <div 
                  key={work.id} 
                  onClick={() => handleNextProjectClick(work)}
                  className={`reveal group relative rounded-[20px] overflow-hidden bg-[#e5e5e5] cursor-pointer shadow-sm transition-all duration-700 ${loadingProjectId === work.id ? 'scale-95 ring-4 ring-secondary/30' : ''}`}
                  style={{ transitionDelay: `${400 + (idx * 150)}ms` }}
                  data-cursor-text="عرض المشروع"
                >
                  <div className="overflow-hidden relative w-full aspect-[3.7/4]">
                    <img 
                      src={work.main_image} 
                      alt={work.title} 
                      className={`w-full h-full object-cover transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] scale-105 group-hover:scale-100 ${loadingProjectId === work.id ? 'blur-sm grayscale' : 'md:group-hover:blur-[4px]'}`} 
                    />
                    
                    <div className={`absolute inset-0 bg-black/40 z-30 flex items-center justify-center transition-opacity duration-300 ${loadingProjectId === work.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="text-white animate-spin" size={32} strokeWidth={3} />
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">جاري التحميل</span>
                        </div>
                    </div>

                    <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-700 ${loadingProjectId === work.id ? 'opacity-0' : 'opacity-60 md:opacity-0 md:group-hover:opacity-100'}`}></div>
                  </div>

                  <div className={`absolute inset-x-5 bottom-5 z-20 transition-all duration-700 transform ${loadingProjectId === work.id ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100 md:translate-y-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'}`}>
                    <div 
                      className="bg-background rounded-[24px] p-5 flex items-center justify-between shadow-2xl border border-white/20"
                      style={{ boxShadow: cardShadow }}
                    >
                      <div className="flex flex-col text-right pr-2">
                        <h3 className="text-lg font-black text-primary leading-tight">{work.title}</h3>
                        <p className="text-[#888888] text-[11px] font-bold tracking-tight uppercase mt-0.5">{work.category}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary rounded-[16px] flex items-center justify-center text-white transition-all duration-500 hover:bg-secondary hover:rotate-[-45deg] shrink-0 shadow-lg">
                        <LinkIcon size={20} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
