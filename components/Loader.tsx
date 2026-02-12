
import React, { useState, useEffect, useMemo } from 'react';
import { Rocket, Zap, Camera, Code, Share2, Palette, Globe, Target, Cpu, Smartphone, Video, PenTool, Layers, MousePointer2, Megaphone, BarChart3, Briefcase, Heart, MessageSquare, ShieldCheck, Star, Users, Layout, Database } from 'lucide-react';

const Loader: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [currentService, setCurrentService] = useState(0);
  const [isExiting, setIsExiting] = useState(false); // حالة لبدء انيميشن الخروج
  const [shouldRender, setShouldRender] = useState(true); // حالة لبقاء العنصر في DOM
  const [isEntryComplete, setIsEntryComplete] = useState(false);

  const services = [
    { name: "هوية بصرية متكاملة", icon: <Palette className="w-5 h-5" /> },
    { name: "تواصل اجتماعي استراتيجي", icon: <Share2 className="w-5 h-5" /> },
    { name: "حلول تقنية متطورة", icon: <Code className="w-5 h-5" /> },
    { name: "تصوير احترافي", icon: <Camera className="w-5 h-5" /> },
    { name: "أتمتة ذكية للأعمال", icon: <Zap className="w-5 h-5" /> },
    { name: "تحول رقمي شامل", icon: <Cpu className="w-5 h-5" /> }
  ];

  const backgroundIcons = useMemo(() => [
    { Icon: Camera, top: '8%', left: '4%', size: 44, blur: 'blur-[1px]', opacity: 'opacity-[0.15]', speed: 'animate-float-slow' },
    { Icon: Share2, top: '12%', left: '88%', size: 34, blur: 'blur-none', opacity: 'opacity-[0.18]', speed: 'animate-float' },
    { Icon: Code, top: '75%', left: '8%', size: 52, blur: 'blur-[2px]', opacity: 'opacity-[0.2]', speed: 'animate-float-slower' },
    { Icon: Palette, top: '65%', left: '92%', size: 40, blur: 'blur-[1px]', opacity: 'opacity-[0.16]', speed: 'animate-float-slow' },
    { Icon: Globe, top: '5%', left: '60%', size: 30, blur: 'blur-[2px]', opacity: 'opacity-[0.12]', speed: 'animate-float-slower' },
    { Icon: Target, top: '82%', left: '55%', size: 42, blur: 'blur-none', opacity: 'opacity-[0.15]', speed: 'animate-float' },
    { Icon: Smartphone, top: '40%', left: '2%', size: 36, blur: 'blur-[3px]', opacity: 'opacity-[0.1]', speed: 'animate-float-slower' },
    { Icon: PenTool, top: '50%', left: '96%', size: 28, blur: 'blur-none', opacity: 'opacity-[0.14]', speed: 'animate-float-fast' },
    { Icon: Layers, top: '18%', left: '42%', size: 26, blur: 'blur-[3px]', opacity: 'opacity-[0.08]', speed: 'animate-float-slower' },
    { Icon: Megaphone, top: '88%', left: '25%', size: 38, blur: 'blur-[1px]', opacity: 'opacity-[0.14]', speed: 'animate-float-slow' },
    { Icon: BarChart3, top: '32%', left: '76%', size: 32, blur: 'blur-[2px]', opacity: 'opacity-[0.11]', speed: 'animate-float' },
    { Icon: MousePointer2, top: '58%', left: '12%', size: 24, blur: 'blur-none', opacity: 'opacity-[0.16]', speed: 'animate-float-fast' },
    { Icon: Video, top: '25%', left: '15%', size: 34, blur: 'blur-[1px]', opacity: 'opacity-[0.13]', speed: 'animate-float-slow' },
    { Icon: Heart, top: '92%', left: '80%', size: 28, blur: 'blur-none', opacity: 'opacity-[0.12]', speed: 'animate-float-fast' },
    { Icon: ShieldCheck, top: '45%', left: '85%', size: 36, blur: 'blur-[2px]', opacity: 'opacity-[0.14]', speed: 'animate-float-slower' },
    { Icon: Users, top: '70%', left: '35%', size: 32, blur: 'blur-[1px]', opacity: 'opacity-[0.11]', speed: 'animate-float' },
    { Icon: Briefcase, top: '15%', left: '30%', size: 30, blur: 'blur-[2px]', opacity: 'opacity-[0.1]', speed: 'animate-float-slow' },
    { Icon: MessageSquare, top: '50%', left: '25%', size: 26, blur: 'blur-none', opacity: 'opacity-[0.15]', speed: 'animate-float-fast' },
    { Icon: Layout, top: '30%', left: '50%', size: 22, blur: 'blur-[3px]', opacity: 'opacity-[0.08]', speed: 'animate-float-slower' },
    { Icon: Database, top: '80%', left: '45%', size: 28, blur: 'blur-[1px]', opacity: 'opacity-[0.12]', speed: 'animate-float-slow' },
    { Icon: Star, top: '10%', left: '75%', size: 24, blur: 'blur-none', opacity: 'opacity-[0.18]', speed: 'animate-float-fast' },
  ], []);

  useEffect(() => {
    // تفعيل مرحلة الدخول
    const entryTimer = setTimeout(() => setIsEntryComplete(true), 50);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // عند اكتمال التحميل
          setTimeout(() => {
            // 1. إبلاغ التطبيق الرئيسي أن التحميل انتهى (ليبدأ ظهور المحتوى في الخلفية)
            onFinished();
            
            // 2. تفعيل حالة الخروج (الأنيميشن)
            setIsExiting(true);
            
            // 3. إزالة المكون نهائياً بعد انتهاء الأنيميشن
            setTimeout(() => {
              setShouldRender(false);
            }, 1000); // نفس مدة الـ duration في الـ CSS
          }, 600);
          
          return 100;
        }
        const increment = Math.random() > 0.8 ? 3 : 1;
        return Math.min(100, prev + increment);
      });
    }, 45);

    const textInterval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % services.length);
    }, 1800);

    return () => {
      clearTimeout(entryTimer);
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onFinished, services.length]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fcfcfc] overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.87,0,0.13,1)]
        ${isExiting ? '-translate-y-full rounded-b-[30%] opacity-100 pointer-events-none' : 'translate-y-0 opacity-100'}
      `}
      dir="rtl"
    >
      {/* 
         تم إزالة transition-opacity من الحاوية الرئيسية للحفاظ على الخلفية صلبة أثناء الصعود
         وتم استبدالها بـ translate-y للصعود للأعلى
      */}

      {/* المحتوى الداخلي يختفي بشكل أسرع قليلاً من حركة الصعود ليعطي مظهراً نظيفاً */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
        {/* خلفية تفاعلية ناعمة مع تدرجات لونية هادئة */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className={`absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.02] blur-[140px] rounded-full animate-drift transition-opacity duration-1000 ${isEntryComplete ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-secondary/[0.03] blur-[140px] rounded-full animate-drift-reverse transition-opacity duration-1000 ${isEntryComplete ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* توزيع الأيقونات في الخلفية */}
          {backgroundIcons.map((item, idx) => (
            <div 
              key={idx}
              className={`absolute text-primary ${item.opacity} ${item.blur} ${item.speed} hidden sm:block transition-all duration-[1500ms] ease-out`}
              style={{ 
                top: item.top, 
                left: item.left, 
                transform: isEntryComplete ? 'translateZ(0) scale(1)' : 'translateZ(0) scale(0.5)',
                opacity: isEntryComplete ? undefined : 0,
                transitionDelay: `${idx * 60}ms`
              }}
            >
              <item.Icon size={item.size} strokeWidth={1.3} />
            </div>
          ))}
        </div>

        <div className={`relative z-10 flex flex-col items-center justify-center w-full h-full pb-10 transition-all duration-[1000ms] delay-300 ${isEntryComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* العنصر المركزي */}
          <div className="relative mb-20 group">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/[0.04] rounded-full animate-spin-slower transition-transform duration-[2000ms] delay-200 ${isEntryComplete ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-secondary/[0.06] rounded-full animate-spin-slow-reverse transition-transform duration-[2000ms] delay-400 ${isEntryComplete ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
            
            <div className={`relative w-24 h-24 bg-white border border-gray-100 rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(32,60,113,0.06)] animate-hover-calm transition-all duration-[1200ms] delay-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isEntryComplete ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-12 opacity-0'}`}>
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary/[0.03] to-secondary/[0.03] rounded-[36px] blur-sm -z-10" />
              <div className="w-16 h-16 bg-gradient-to-br from-primary/[0.03] to-white border border-primary/[0.05] rounded-2xl flex items-center justify-center text-primary relative overflow-hidden">
                  <Rocket className="w-8 h-8 animate-rocket-subtle" strokeWidth={1.5} />
                  <div className="absolute bottom-1 w-4 h-1 bg-secondary/20 blur-sm rounded-full animate-pulse" />
              </div>
              
              <div className={`absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-md animate-orbit-subtle transition-opacity duration-1000 delay-1000 ${isEntryComplete ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>

          {/* حلقة الخدمات */}
          <div className={`h-10 mb-2 overflow-hidden flex flex-col items-center transition-all duration-1000 delay-[800ms] ${isEntryComplete ? 'opacity-100' : 'opacity-0'}`}>
            <div 
              className="transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center gap-2"
              style={{ transform: `translateY(-${currentService * 40}px)` }}
            >
              {services.map((service, idx) => (
                <div key={idx} className="flex items-center justify-center gap-4 h-8 px-6">
                  <span className="text-secondary opacity-90">{service.icon}</span>
                  <span className="text-xl font-bold text-primary/80 tracking-tight">{service.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className={`text-gray-300 text-[10px] font-black tracking-[0.5em] uppercase mb-14 transition-all duration-1000 delay-[900ms] ${isEntryComplete ? 'opacity-100 tracking-[0.5em]' : 'opacity-0 tracking-[1em]'}`}>
            نبتكر لمستقبل أعمالك
          </p>

          {/* شريط التقدم */}
          <div className={`w-full max-w-[260px] transition-all duration-1000 delay-[1000ms] ${isEntryComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-end mb-4 px-1">
              <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">جاري التحميل</span>
              </div>
              <span className="text-sm font-black text-primary/20 tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-[2px] bg-gray-50 rounded-full overflow-hidden relative shadow-inner">
              <div 
                className="absolute top-0 right-0 h-full bg-gradient-to-l from-secondary to-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* هوية الوكالة */}
          <div className={`absolute bottom-12 flex flex-col items-center gap-2 transition-all duration-1000 delay-[1200ms] ${isEntryComplete ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-gray-200 text-[9px] font-black tracking-[0.3em] uppercase">
              وكالة تواصل &copy; ٢٠٢٥
            </span>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 25px) scale(1.02); }
        }
        @keyframes drift-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -25px) scale(1.05); }
        }
        @keyframes hover-calm {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes rocket-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes orbit-subtle {
          from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-spin-slower { animation: spin 30s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 45s linear infinite reverse; }
        .animate-hover-calm { animation: hover-calm 6s ease-in-out infinite; }
        .animate-rocket-subtle { animation: rocket-subtle 3s ease-in-out infinite; }
        .animate-orbit-subtle { animation: orbit-subtle 10s linear infinite; }
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 18s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 25s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
