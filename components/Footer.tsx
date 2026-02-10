import React, { useState } from 'react';
import { ArrowLeft, Twitter, Linkedin, Instagram, Globe, Shield, FileText, Mail, CheckCircle2 } from 'lucide-react';

const RollingLink: React.FC<{ text: string; href: string; icon?: React.ReactNode }> = ({ text, href, icon }) => {
  return (
    <a href={href} className="group relative block overflow-hidden py-1 w-full sm:w-fit" data-cursor-text="فتح">
      <div className="relative h-8 overflow-hidden pointer-events-none">
        <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
          <span className="h-8 text-[16px] sm:text-[18px] font-black text-[#A1A1A1] group-hover:text-white leading-8 whitespace-nowrap flex items-center gap-3 transition-colors duration-300 justify-start">
            {icon && <span className="opacity-70 group-hover:opacity-100 group-hover:text-secondary transition-all shrink-0">{icon}</span>}
            {text}
          </span>
          <span className="h-8 text-[16px] sm:text-[18px] font-black text-secondary leading-8 whitespace-nowrap flex items-center gap-3 justify-start">
            {icon && <span className="shrink-0">{icon}</span>}
            {text}
          </span>
        </div>
      </div>
    </a>
  );
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset after some time
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1200);
  };

  return (
    <footer className="bg-[#0f172a] pt-20 pb-10 border-t border-white/5" dir="rtl">
      <div className="max-w-[1350px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20 lg:mb-32 items-start">
          
          {/* Newsletter & Identity Section */}
          <div className="lg:col-span-5 space-y-10 text-right">
            <div className="space-y-6">
              <h4 className="text-[22px] md:text-[26px] font-black text-white tracking-tight">النشرة البريدية</h4>
              <p className="text-[15px] md:text-[16px] text-[#A1A1A1] font-medium leading-[1.7] max-w-md">
                كن أول من يعرف. اشترك للحصول على آخر التحديثات، دراسات الحالة، والنصائح التسويقية مباشرة في بريدك.
              </p>
              
              <div className="relative max-w-md pt-2">
                {isSubscribed ? (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-2xl animate-entrance-scale">
                    <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                    <span className="text-white font-bold text-sm">شكراً لاشتراكك! سنتواصل معك قريباً.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="relative group">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl sm:rounded-full p-1.5 focus-within:border-secondary focus-within:bg-white/10 transition-all duration-500 flex-col sm:flex-row gap-2 sm:gap-0">
                      <input 
                        type="email" 
                        required
                        placeholder="بريدك الإلكتروني" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full py-3 px-4 font-medium placeholder-white/20 text-right sm:text-right"
                        data-cursor-text="اكتب بريدك"
                      />
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex items-center justify-between sm:justify-center bg-secondary text-primary rounded-xl sm:rounded-full pr-5 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 disabled:opacity-50 shrink-0 overflow-hidden w-full sm:w-auto"
                        data-cursor-text="اشترك"
                      >
                        <div className="relative h-5 overflow-hidden ml-3 pointer-events-none">
                          <div className={`flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${!isSubmitting ? 'group-hover:-translate-y-1/2' : ''}`}>
                            <span className="h-5 text-sm font-black leading-5 whitespace-nowrap flex items-center">اشترك الآن</span>
                            <span className="h-5 text-sm font-black leading-5 whitespace-nowrap flex items-center">اشترك الآن</span>
                          </div>
                        </div>

                        <div className="w-9 h-9 rounded-lg sm:w-9 sm:h-9 sm:rounded-full relative overflow-hidden bg-primary text-secondary shrink-0 flex items-center justify-center">
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full">
                                <ArrowLeft size={18} strokeWidth={3} />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0">
                                <ArrowLeft size={18} strokeWidth={3} />
                              </div>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <div className="flex items-center gap-4 group cursor-default">
                 <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center p-2 group-hover:bg-white/10 transition-colors">
                    <img src="logo.png" alt="نقطة تواصل" className="w-full h-auto object-contain filter brightness-0 invert" />
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-white font-black text-xl">نقطة تواصل</span>
                    <span className="text-[#A1A1A1] text-xs font-bold uppercase tracking-widest">وكالة تسويق إبداعية</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <a href="mailto:tawasull.sa@gmail.com" className="flex items-center gap-3 text-white group cursor-pointer bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all duration-500" data-cursor-text="راسلنا">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-all duration-500 shrink-0">
                      <Mail size={16} className="text-secondary group-hover:text-primary" />
                    </div>
                    <div className="flex flex-col items-start overflow-hidden">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">البريد الإلكتروني</span>
                       <span className="font-bold text-[14px] text-[#A1A1A1] group-hover:text-white transition-colors truncate w-full" dir="ltr">tawasull.sa@gmail.com</span>
                    </div>
                 </a>
                 <div className="flex items-center gap-3 text-white group cursor-default bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all duration-500">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-all duration-500 shrink-0">
                      <Globe size={16} className="text-secondary group-hover:text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">الموقع</span>
                       <span className="font-bold text-[14px] text-[#A1A1A1] group-hover:text-white transition-colors">مكة المكرمة، المملكة</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12 text-right">
            <div className="space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary border-b border-white/5 pb-4">/ التنقل</h5>
              <ul className="space-y-3 flex flex-col items-start">
                {[
                  { name: 'الخدمات', id: 'services' },
                  { name: 'قيمنا', id: 'benefits' },
                  { name: 'أعمالنا', id: 'work' },
                  { name: 'اتصل بنا', id: 'contact' }
                ].map((item) => (
                  <li key={item.id} className="w-full">
                    <RollingLink text={item.name} href={`#${item.id}`} icon={<ArrowLeft size={16} className="rotate-180" />} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary border-b border-white/5 pb-4">/ المصادر</h5>
              <ul className="space-y-3 flex flex-col items-start">
                {[
                  { name: 'سياسة الخصوصية', id: 'privacy', icon: <Shield size={16} /> },
                  { name: 'شروط الخدمة', id: 'terms', icon: <FileText size={16} /> },
                  { name: 'المدونة', id: 'blog', icon: <Globe size={16} /> }
                ].map((item) => (
                  <li key={item.id} className="w-full">
                    <RollingLink text={item.name} href="#" icon={item.icon} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 col-span-2 sm:col-span-1">
              <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary border-b border-white/5 pb-4">/ التواصل</h5>
              <ul className="space-y-3 flex flex-col items-start">
                {[
                  { name: 'إكس / تويتر', id: 'x', icon: <Twitter size={16} /> },
                  { name: 'لينكد إن', id: 'linkedin', icon: <Linkedin size={16} /> },
                  { name: 'إنستقرام', id: 'instagram', icon: <Instagram size={16} /> }
                ].map((item) => (
                  <li key={item.id} className="w-full">
                    <RollingLink text={item.name} href="#" icon={item.icon} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-right">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 text-[#A1A1A1] text-[14px] font-bold">
               <span className="opacity-50">© 2025 نقطة تواصل.</span>
               <div className="w-[1px] h-4 bg-white/10 hidden md:block"></div>
               <span className="text-secondary/80">صنع بشغف بواسطة Shamll tech</span>
            </div>
            <div className="text-[#64748b] text-[12px] font-bold uppercase tracking-widest hidden lg:block">
               المملكة العربية السعودية - مكة المكرمة
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[12px] font-black text-[#A1A1A1] uppercase tracking-wider">الأنظمة تعمل بكفاءة</span>
             </div>
             
             {/* Simple Social Icons for mobile quick access */}
             <div className="flex gap-4 md:hidden">
                <Twitter size={18} className="text-[#A1A1A1]" />
                <Linkedin size={18} className="text-[#A1A1A1]" />
                <Instagram size={18} className="text-[#A1A1A1]" />
             </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;