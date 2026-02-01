
import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

const Contact: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'retainer' | 'project' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const ContactCard = ({ 
    icon: Icon, 
    label, 
    value, 
    delay, 
    href, 
    dots = 1 
  }: { 
    icon: any, 
    label: string, 
    value: string, 
    delay: string, 
    href: string,
    dots?: number
  }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#F0F0F0] rounded-[24px] p-[24px] flex flex-col justify-between h-[200px] sm:h-[240px] relative group cursor-pointer transition-all duration-700 hover:bg-white opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0" 
      style={{ 
        boxShadow: cardShadow,
        transitionDelay: delay,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      data-cursor-text="تواصل"
    >
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#203C71] group-hover:bg-[#203C71] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-xl">
           <Icon size={34} strokeWidth={2.2} />
        </div>
        <div className="flex gap-1.5 pt-2" dir="ltr">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-[6px] h-[6px] rounded-full ${i < dots ? 'bg-[#EF7F17]' : 'bg-[#D1D1D1]'}`}></div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-black text-[#A1A1A1] tracking-[0.15em] uppercase">/ {label}</span>
        <h4 className="text-[17px] md:text-[19px] font-black text-[#203C71] tracking-tight text-right group-hover:text-[#EF7F17] transition-colors duration-300" dir={label === 'البريد الإلكتروني' ? 'ltr' : 'rtl'}>
            {value}
        </h4>
      </div>
    </a>
  );

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-[1350px] mx-auto overflow-hidden" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
        
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          
          <div className="space-y-8 text-right mb-12">
            <div className="reveal inline-flex items-center gap-2 bg-[#203C71] px-4 py-2.5 rounded-[25px] shadow-lg" style={{ transitionDelay: '0ms' }}>
              <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
              <span className="text-white font-black text-[12px] tracking-tight uppercase">تواصل معنا</span>
              <span className="text-[#EF7F17] font-black text-[12px] tracking-tight">//</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '100ms' }}>
                حياك الله.
              </h2>
              <p className="reveal text-[18px] md:text-[19px] text-[#6B6B6B] font-medium leading-[1.4] max-w-sm" style={{ transitionDelay: '200ms' }}>
                نحن هنا لأعمال مشتركة وتحويل طموحاتك لنتائج ملموسة. دعنا نبدأ الرحلة الآن.
              </p>
            </div>
          </div>

          <div className="reveal mt-auto grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[28px] p-[8px] bg-[#E5E5E5] transition-none" style={{ transitionDelay: '300ms' }}>
            <div className="md:col-span-2">
                <ContactCard 
                    icon={Mail} 
                    label="البريد الإلكتروني" 
                    value="tawasull.sa@gmail.com" 
                    delay="400ms" 
                    href="mailto:tawasull.sa@gmail.com"
                    dots={1}
                />
            </div>
            <ContactCard 
                icon={MessageSquare} 
                label="الواتساب" 
                value="0555218270" 
                delay="500ms" 
                href="https://wa.me/966555218270"
                dots={2}
            />
            <ContactCard 
                icon={Phone} 
                label="اتصال مباشر" 
                value="0555218270" 
                delay="600ms" 
                href="tel:+966555218270"
                dots={3}
            />
          </div>
        </div>

        <div 
          className="reveal lg:col-span-7 bg-[#203C71] rounded-[32px] md:rounded-[48px] p-8 md:p-14 text-white shadow-2xl transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0 relative overflow-hidden" 
          style={{ 
            transitionDelay: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Success Overlay */}
          <div className={`absolute inset-0 bg-[#203C71] z-50 flex flex-col items-center justify-center p-12 text-center transition-all duration-500 ${showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-24 h-24 bg-[#EF7F17] rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
              <CheckCircle size={48} className="text-white" strokeWidth={3} />
            </div>
            <h3 className="text-4xl font-black mb-4">تم الإرسال بنجاح!</h3>
            <p className="text-xl text-white/70 font-medium max-w-sm">
              شكراً لتواصلك مع نقطة تواصل. سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت ممكن.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="mt-12 px-8 py-4 bg-white text-[#203C71] rounded-full font-black hover:bg-[#EF7F17] hover:text-white transition-all duration-300"
              data-cursor-text="إرسال جديد"
            >
              إرسال طلب آخر
            </button>
          </div>

          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-black text-white/40 tracking-widest">الاسم بالكامل*</p>
              <input 
                type="text" 
                required
                name="Name"
                placeholder="اسمك الكريم" 
                className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#EF7F17] focus:bg-white/10 transition-all"
                data-cursor-text="اكتب الاسم" 
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-black text-white/40 tracking-widest">البريد الإلكتروني*</p>
              <input 
                type="email" 
                required
                name="Email"
                placeholder="بريدك الإلكتروني" 
                className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#EF7F17] focus:bg-white/10 transition-all" 
                data-cursor-text="اكتب البريد"
              />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] font-black text-white/40 tracking-widest text-right">نوع الخدمة المطلوبة</p>
              <div className="grid grid-cols-2 gap-4" dir="ltr">
                <button 
                  type="button"
                  onClick={() => setSelectedPlan('retainer')}
                  className={`py-5 rounded-[16px] border transition-all duration-300 text-[12px] font-black uppercase tracking-widest ${selectedPlan === 'retainer' ? 'bg-[#EF7F17] border-[#EF7F17] text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                  data-cursor-text="تحديد"
                >
                  اشتراك شهري
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedPlan('project')}
                  className={`py-5 rounded-[16px] border transition-all duration-300 text-[12px] font-black uppercase tracking-widest ${selectedPlan === 'project' ? 'bg-[#EF7F17] border-[#EF7F17] text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                  data-cursor-text="تحديد"
                >
                  مشروع واحد
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-black text-white/40 tracking-widest">الرسالة</p>
              <textarea 
                name="Message"
                rows={4} 
                placeholder="أخبرنا عن طموحاتك وتحديات مشروعك..." 
                className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#EF7F17] focus:bg-white/10 transition-all resize-none"
                data-cursor-text="اكتب الرسالة"
              ></textarea>
            </div>

            <div className="mt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`group relative inline-flex items-center rounded-full pr-8 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl active:scale-[0.98] overflow-hidden bg-[#EF7F17] text-white w-full justify-between ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
                data-cursor-text="إرسال"
              >
                <div className="relative h-7 overflow-hidden ml-5 pointer-events-none flex-1">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3 h-7">
                       <Loader2 className="animate-spin" size={20} />
                       <span className="text-lg font-black leading-7">جاري الإرسال...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2">
                      <span className="h-7 text-xl font-black leading-7 whitespace-nowrap flex items-center justify-center">أرسل الطلب الآن</span>
                      <span className="h-7 text-xl font-black leading-7 whitespace-nowrap flex items-center justify-center">أرسل الطلب الآن</span>
                    </div>
                  )}
                </div>

                <div className={`w-14 h-14 rounded-full relative overflow-hidden transition-colors duration-500 shrink-0 bg-[#203C71] text-[#EF7F17]`}>
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full">
                    <ArrowLeft size={28} strokeWidth={3} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0">
                    <ArrowLeft size={28} strokeWidth={3} />
                  </div>
                </div>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
