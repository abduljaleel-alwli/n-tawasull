
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, Loader2, ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { fetchServices, sendContactMessage } from '../utils/api';

const initialServiceOptions = [
  "إدارة حسابات التواصل الاجتماعي",
  "تحسين محركات البحث وخرائط قوقل",
  "اشتراك واتساب للأعمال",
  "هوية بصرية وتصميم",
  "تطوير متاجر إلكترونية",
  "إنتاج وصناعة محتوى"
];

const projectTypes = [
  { id: 'company', label: 'شركة' },
  { id: 'foundation', label: 'مؤسسة' },
  { id: 'private', label: 'مشروع خاص' },
  { id: 'temporary', label: 'مشروع مؤقت' }
];

const Contact: React.FC = () => {
  const [serviceOptions, setServiceOptions] = useState<string[]>(initialServiceOptions);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const { getSetting } = useSettings();
  
  const contactEmail = getSetting('contact.email_to', 'info@n-tawasull.sa');
  const contactPhone = getSetting('contact.phone', '+966555218270');
  const contactWhatsapp = getSetting('contact.whatsapp', '0555218270');
  
  const badge = getSetting('contact.badge', 'تواصل معنا');
  const title = getSetting('contact.title', 'حياك الله.');
  const description = getSetting('contact.description', 'نحن هنا لأعمال مشتركة وتحويل طموحاتك لنتائج ملموسة. دعنا نبدأ الرحلة الآن.');

  const cardShadow = "rgba(0, 0, 0, 0.08) 0px 0.602187px 0.602187px -0.916667px, rgba(0, 0, 0, 0.08) 0px 2.28853px 2.28853px -1.83333px, rgba(0, 0, 0, 0.07) 0px 10px 10px -2.75px";

  // Fetch Dynamic Services
  useEffect(() => {
    let isMounted = true;
    const loadServices = async () => {
      try {
        const services = await fetchServices();
        if (isMounted && services.length > 0) {
          // Extract unique titles or use as provided
          const titles = Array.from(new Set(services.map(s => s.title)));
          if (titles.length > 0) {
            setServiceOptions(titles);
          }
        }
      } catch (err) {
        // Silently fail to default
      }
    };
    loadServices();
    return () => { isMounted = false; };
  }, []);

  const toggleService = (service: string) => {
    setErrorMessage(null); // Clear error on interaction
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service) 
        : [...prev, service]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (example: size < 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.');
        return;
      }
      setFileName(file.name);
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Manual Validation
    if (selectedServices.length === 0) {
      setErrorMessage('الرجاء اختيار خدمة واحدة على الأقل.');
      return;
    }
    if (!projectType) {
      setErrorMessage('الرجاء اختيار نوع المشروع.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      const form = e.target as HTMLFormElement;
      
      // Basic Fields
      formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
      formData.append('email', (form.elements.namedItem('email') as HTMLInputElement).value);
      formData.append('phone', (form.elements.namedItem('phone') as HTMLInputElement).value || '');
      formData.append('message', (form.elements.namedItem('message') as HTMLTextAreaElement).value);
      
      // Selectors
      formData.append('project_type', projectType);
      
      // Array Fields (Services)
      selectedServices.forEach(service => {
        formData.append('services[]', service);
      });

      // File
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      await sendContactMessage(formData);
      
      setShowSuccess(true);
      
      // Reset Form
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedServices([]);
        setProjectType('');
        setFileName('');
        setSelectedFile(null);
        if (formRef.current) formRef.current.reset();
      }, 5000);

    } catch (error: any) {
      // Handle API Errors
      const msg = error.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
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
      className="bg-background rounded-[24px] p-[24px] flex flex-col justify-between h-[200px] sm:h-[240px] relative group cursor-pointer transition-all duration-700 hover:bg-white opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0" 
      style={{ 
        boxShadow: cardShadow,
        transitionDelay: delay,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      data-cursor-text="تواصل"
    >
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-xl">
           <Icon size={34} strokeWidth={2.2} />
        </div>
        <div className="flex gap-1.5 pt-2" dir="ltr">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-[6px] h-[6px] rounded-full ${i < dots ? 'bg-secondary' : 'bg-[#D1D1D1]'}`}></div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-black text-[#A1A1A1] tracking-[0.15em] uppercase">/ {label}</span>
        <h4 className="text-[17px] md:text-[19px] font-black text-primary tracking-tight text-right group-hover:text-secondary transition-colors duration-300" dir={label === 'البريد الإلكتروني' ? 'ltr' : 'rtl'}>
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
            <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-[25px] shadow-lg" style={{ transitionDelay: '0ms' }}>
              <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
              <span className="text-white font-black text-[12px] tracking-tight uppercase">{badge}</span>
              <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="reveal text-3xl sm:text-4xl md:text-6xl font-black text-[#111111] leading-[1.25] md:leading-[1.2] tracking-normal" style={{ transitionDelay: '100ms' }}>
                {title}
              </h2>
              <p className="reveal text-[18px] md:text-[19px] text-[#6B6B6B] font-medium leading-[1.4] max-w-sm" style={{ transitionDelay: '200ms' }}>
                {description}
              </p>
            </div>
          </div>

          <div className="reveal mt-auto grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[28px] p-[8px] bg-[#E5E5E5] transition-none" style={{ transitionDelay: '300ms' }}>
            <div className="md:col-span-2">
                <ContactCard 
                    icon={Mail} 
                    label="البريد الإلكتروني" 
                    value={contactEmail} 
                    delay="400ms" 
                    href={`mailto:${contactEmail}`}
                    dots={1}
                />
            </div>
            <ContactCard 
                icon={MessageSquare} 
                label="الواتساب" 
                value={contactWhatsapp} 
                delay="500ms" 
                href={`https://wa.me/${contactWhatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
                dots={2}
            />
            <ContactCard 
                icon={Phone} 
                label="اتصال مباشر" 
                value={contactPhone} 
                delay="600ms" 
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                dots={3}
            />
          </div>
        </div>

        <div 
          className="reveal lg:col-span-7 bg-primary rounded-[32px] md:rounded-[48px] p-8 md:p-14 text-white shadow-2xl transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0 relative overflow-hidden" 
          style={{ 
            transitionDelay: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Success Overlay */}
          <div className={`absolute inset-0 bg-primary z-50 flex flex-col items-center justify-center p-12 text-center transition-all duration-500 ${showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
              <CheckCircle size={48} className="text-white" strokeWidth={3} />
            </div>
            <h3 className="text-4xl font-black mb-4">تم الإرسال بنجاح!</h3>
            <p className="text-xl text-white/70 font-medium max-w-sm">
              شكراً لتواصلك مع نقطة تواصل. سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت ممكن.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="mt-12 px-8 py-4 bg-white text-primary rounded-full font-black hover:bg-secondary hover:text-white transition-all duration-300"
              data-cursor-text="إرسال جديد"
            >
              إرسال طلب آخر
            </button>
          </div>

          <form ref={formRef} className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-[14px] font-black text-white/40 tracking-widest">الاسم بالكامل*</p>
                <input 
                  type="text" 
                  required
                  name="name"
                  placeholder="اسمك الكريم" 
                  className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all"
                  data-cursor-text="اكتب الاسم" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[14px] font-black text-white/40 tracking-widest">رقم الجوال (اختياري)</p>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="05xxxxxxxx" 
                  className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all text-right" 
                  data-cursor-text="اكتب الرقم"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-black text-white/40 tracking-widest">البريد الإلكتروني*</p>
              <input 
                type="email" 
                required
                name="email"
                placeholder="بريدك الإلكتروني" 
                className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all" 
                data-cursor-text="اكتب البريد"
              />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] font-black text-white/40 tracking-widest text-right">الخدمات المطلوبة (يمكنك اختيار أكثر من خدمة)*</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`flex items-center justify-between px-5 py-4 rounded-[16px] border transition-all duration-300 text-[13px] font-bold ${selectedServices.includes(service) ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    data-cursor-text={selectedServices.includes(service) ? "إزالة" : "إضافة"}
                  >
                    <span>{service}</span>
                    {selectedServices.includes(service) && <Check size={16} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] font-black text-white/40 tracking-widest text-right">نوع المشروع*</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                        setProjectType(type.id);
                        setErrorMessage(null);
                    }}
                    className={`py-4 rounded-[16px] border transition-all duration-300 text-[11px] font-black uppercase tracking-widest ${projectType === type.id ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    data-cursor-text="اختيار"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-black text-white/40 tracking-widest">إرفاق ملف (اختياري)</p>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-[16px] px-6 py-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 hover:border-secondary/50 transition-all group"
                data-cursor-text="رفع ملف"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-secondary group-hover:text-white transition-all">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white/80">{fileName || 'اضغط هنا لرفع الملفات المساعدة'}</p>
                  <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">PDF, JPG, PNG, DOC (MAX 10MB)</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-black text-white/40 tracking-widest">الرسالة</p>
              <textarea 
                required
                name="message"
                rows={4} 
                placeholder="أخبرنا عن طموحاتك وتحديات مشروعك..." 
                className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all resize-none"
                data-cursor-text="اكتب الرسالة"
              ></textarea>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-bold">{errorMessage}</span>
              </div>
            )}

            <div className="mt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`group relative inline-flex items-center rounded-full pr-8 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl active:scale-[0.98] overflow-hidden bg-secondary text-white w-full justify-between ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
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

                <div className={`w-14 h-14 rounded-full relative overflow-hidden transition-colors duration-500 shrink-0 bg-primary text-secondary`}>
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
