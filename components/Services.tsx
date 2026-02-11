
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ArrowDown, Loader2, PlusCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { fetchServices, ServiceItem } from '../utils/api';

const defaultSliderImages = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1611162617263-4ec3060a058e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
];

const initialServiceData = [
  {
    title: "إدارة حسابات التواصل الاجتماعي",
    category: "تسويق",
    description: "إدارة متكاملة تشمل التخطيط، صناعة الهوية الرقمية، الجدولة، والتفاعل عبر مختلف المنصات لتعزيز الحضور وتحقيق النمو.",
    tags: ["لينكدإن", "سناب شات", "تيك توك", "إنستقرام"],
  },
  {
    title: "تحسين محركات البحث وخرائط قوقل",
    category: "تقنية",
    description: "استراتيجيات SEO احترافية لرفع ظهور نشاطك، وتطوير صفحة قوقل ماب لزيادة الثقة وتحويل الباحثين لعملاء.",
    tags: ["SEO", "قوقل ماب", "التقييمات", "تهيئة المحتوى"],
  },
  {
    title: "اشتراك واتساب للأعمال",
    category: "حلول",
    description: "حلول احترافية لإدارة المحادثات، تنظيم العملاء، والردود التلقائية لتحسين تجربة التواصل ورضا المستهلك.",
    tags: ["ردود تلقائية", "تنظيم العملاء", "خدمة عملاء", "أتمتة"],
  },
  {
    title: "تصميم الهوية البصرية",
    category: "تسويق",
    description: "بناء هوية بصرية قوية تعكس قيم مشروعك وتترك انطباعاً لا ينسى لدى جمهورك المستهدف من الشعار إلى الخطوط.",
    tags: ["شعار", "براندنج", "أدلة ألوان", "مطبوعات"],
  },
  {
    title: "تطوير المتاجر الإلكترونية",
    category: "تقنية",
    description: "تصميم وبرمجة متاجر متكاملة على منصات سلة وزد مع ربط بوابات الدفع وشركات الشحن باحترافية.",
    tags: ["سلة", "زد", "UI/UX", "تجارة إلكترونية"],
  },
  {
    title: "إنتاج وصناعة المحتوى الإبداعي",
    category: "تسويق",
    description: "صناعة محتوى مرئي وكتابي يخاطب الجمهور بعناية، من كتابة السيناريو إلى المونتاج والتصوير.",
    tags: ["فيديو", "موشن جرافيك", "كتابة محتوى", "مونتاج"],
  },
  {
    title: "حملات إعلانية ممولة",
    category: "تسويق",
    description: "إدارة حملاتك على سناب شات، تيك توك، وقوقل لضمان الوصول لأكبر شريحة مهتمة بأقل التكاليف.",
    tags: ["سناب شات", "تيك توك", "قوقل آدز", "ROAS"],
  },
  {
    title: "أتمتة العمليات الإدارية",
    category: "حلول",
    description: "تحويل المهام اليدوية المتكررة إلى عمليات تلقائية ذكية توفر الوقت والجهد وتزيد من دقة الإنجاز.",
    tags: ["أتمتة", "Zapier", "CRM", "تحول رقمي"],
  },
  {
    title: "تطوير تطبيقات الويب",
    category: "تقنية",
    description: "بناء أنظمة برمجية مخصصة ومواقع ويب تفاعلية باستخدام أحدث التقنيات لضمان السرعة والأمان.",
    tags: ["React", "Node.js", "تطبيقات سحابية", "SaaS"],
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
        <img src="https://images.unsplash.com/photo-15222071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 opacity-0 group-hover/folder:-translate-y-14 group-hover/folder:translate-x-4 group-hover/folder:rotate-12 group-hover/folder:opacity-100 transition-all duration-500 delay-100 z-0">
        <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white" />
      </div>

      <div className="relative z-10 w-full h-full">
         <div className="absolute bottom-0 w-full h-8 bg-primary rounded-lg"></div>
         <div className="absolute top-0 right-0 w-7 h-3 bg-primary rounded-t-md"></div>
         <div className="absolute bottom-0 w-full h-8 bg-[#2b4d8d] rounded-lg origin-bottom transition-transform duration-500 group-hover/folder:[transform:rotateX(-45deg)] border-t border-white/5 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]"></div>
      </div>
    </div>
  );
};

interface ImageSliderCardProps {
  cardIndex: number;
  images?: string[];
}

const ImageSliderCard: React.FC<ImageSliderCardProps> = ({ cardIndex, images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use provided images or fallback to defaults
  const slideImages = (images && images.length > 0) ? images : defaultSliderImages;
  
  // If we only have one image, verify if it's not a placeholder
  const activeImages = slideImages.length === 1 && slideImages[0] === '' 
    ? defaultSliderImages 
    : slideImages;

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const intervalTime = 4000 + (cardIndex * 1500); 
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeImages.length);
    }, intervalTime);
  };

  useEffect(() => {
    if (activeImages.length <= 1) return;
    
    const initialDelay = cardIndex * 1200;
    const timeout = setTimeout(() => {
      startInterval();
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cardIndex, activeImages.length]);

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
        {activeImages.map((img, idx) => (
          <div key={idx} className="min-w-full h-full overflow-hidden bg-white">
            <img 
              src={img} 
              alt="Service visual" 
              className={`w-full h-full object-cover rounded-[16px] transition-transform duration-[2000ms] ease-out`} 
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {activeImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full flex gap-1.5 shadow-md border border-white/20 z-20">
          {activeImages.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => goToSlide(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-700 cursor-pointer outline-none border-none p-0 ${currentSlide === idx ? 'bg-secondary w-4' : 'bg-black/10 hover:bg-black/20'}`}
              aria-label={`انتقل إلى الصورة رقم ${idx + 1}`}
              data-cursor-text="شاهد"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Data States
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([
    { id: 'all', name: 'الكل' },
    { id: 'تسويق', name: 'تسويق رقمي' },
    { id: 'تقنية', name: 'حلول تقنية' },
    { id: 'حلول', name: 'أتمتة وأعمال' },
  ]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { getSetting } = useSettings();

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    
    // First, try to load settings-based services (legacy fallback)
    const settingsServices = getSetting('services.items', initialServiceData);
    
    const loadApiServices = async () => {
      try {
        const apiData = await fetchServices();
        
        if (isMounted) {
          if (apiData && apiData.length > 0) {
            setServices(apiData);
            
            // Generate Dynamic Categories from API Data
            const uniqueCategories = Array.from(new Set(apiData.map(s => s.category)));
            const dynamicCategories = [
              { id: 'all', name: 'الكل' },
              ...uniqueCategories.map(cat => ({ id: cat, name: cat }))
            ];
            
            setCategories(dynamicCategories);
          } else {
            // Fallback to local/settings data if API returns empty
            setServices(settingsServices);
          }
          setIsDataLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          setServices(settingsServices);
          setIsDataLoaded(true);
        }
      }
    };

    loadApiServices();

    return () => { isMounted = false; };
  }, [getSetting]);

  useEffect(() => {
    setVisibleCount(3);
  }, [activeTab]);

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter((s: any) => s.category === activeTab);

  const displayedServices = filteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredServices.length;

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsLoadingMore(false);
    }, 1200);
  };

  // Determine which data to render (Skeleton-like if loading, or actual data)
  const renderData = isDataLoaded ? displayedServices : initialServiceData.slice(0, 3); // Show initial mock as skeleton/placeholder

  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto overflow-visible" dir="rtl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 lg:mb-20 gap-8 text-right">
        <div className="flex flex-col items-start gap-4 md:gap-6 w-full lg:w-auto">
          <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-full shadow-xl" style={{ transitionDelay: '0ms' }}>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            <span className="text-white text-[12px] font-black tracking-widest uppercase">خدماتنا</span>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
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

      {/* Modern Filter Tabs */}
      <div className="reveal flex flex-wrap gap-3 mb-12 md:mb-16" style={{ transitionDelay: '450ms' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            data-cursor-text="اختر"
            className={`px-8 py-3 rounded-full text-sm font-black transition-all duration-500 border ${activeTab === cat.id ? 'bg-secondary border-secondary text-white shadow-lg scale-105' : 'bg-white/50 border-gray-200 text-primary hover:bg-primary hover:text-white hover:border-primary'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 min-h-[400px]" style={{ transitionDelay: '500ms' }}>
        {renderData.map((service: any, idx: number) => (
          <div 
            key={`${service.id || idx}-${activeTab}`} 
            className={`bg-[#e5e5e5] rounded-[23px] p-[7px] flex flex-col md:flex-row lg:flex-col gap-[7px] animate-entrance-up`}
            style={{ 
              animationDelay: `${(idx % 3) * 150}ms`,
              boxShadow: 'none'
            }}
          >
            <div 
              className="bg-[#f2f2f2] rounded-[16px] p-8 flex flex-col items-start w-full md:w-1/2 lg:w-full h-auto lg:min-h-[320px] text-right" 
              style={{ boxShadow: cardShadow }}
            >
              <FolderIconWithPopUp />
              <h3 className="text-2xl font-black text-[#111111] mb-2 tracking-tight leading-tight">{service.title}</h3>
              <p className="text-[#666666] text-[14px] font-medium leading-relaxed mb-6 line-clamp-2 md:line-clamp-3 lg:line-clamp-2">{service.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {service.tags && Array.isArray(service.tags) && service.tags.map((tag: string) => (
                  <span key={tag} className="px-3.5 py-2 bg-[#e8e8e8] rounded-full text-[10px] font-black text-[#555555] uppercase tracking-wider flex items-center gap-1.5 transition-all hover:bg-white hover:text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-full">
              <ImageSliderCard cardIndex={idx} images={service.images || (service.main_image ? [service.main_image] : [])} />
            </div>
          </div>
        ))}
        {isDataLoaded && filteredServices.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-[#999999] font-bold text-lg italic">لا توجد خدمات متاحة في هذه الفئة حالياً...</p>
          </div>
        )}
      </div>

      {/* Modern Professional Load More Button */}
      {isDataLoaded && hasMore && (
        <div className="reveal mt-16 text-center" style={{ transitionDelay: '200ms' }}>
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            data-cursor-text={isLoadingMore ? "انتظر" : "استكشف المزيد"}
            className={`group relative inline-flex items-center gap-6 bg-primary text-white rounded-full pr-10 pl-2 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 shadow-2xl overflow-hidden ${isLoadingMore ? 'opacity-80 cursor-wait pr-12' : ''}`}
          >
            <span className="relative z-10 font-black text-lg flex items-center gap-3">
              {isLoadingMore ? (
                <>
                  <span className="animate-pulse">جاري تحميل المزيد...</span>
                </>
              ) : (
                'تحميل المزيد من الخدمات'
              )}
            </span>
            
            <div className={`w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-primary transition-all duration-500 shadow-inner ${isLoadingMore ? 'animate-spin bg-white/20 text-white' : 'group-hover:rotate-90'}`}>
              {isLoadingMore ? (
                <Loader2 size={28} strokeWidth={3} className="animate-spin" />
              ) : (
                <Plus size={32} strokeWidth={3.5} />
              )}
            </div>

            {/* Glass Background Highlight */}
            <div className={`absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out pointer-events-none ${isLoadingMore ? 'hidden' : ''}`}></div>
            
            {/* Loading Progress Background */}
            <div className={`absolute bottom-0 right-0 h-1 bg-secondary transition-all duration-[1200ms] ease-out ${isLoadingMore ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
          </button>
        </div>
      )}
    </section>
  );
};

export default Services;
