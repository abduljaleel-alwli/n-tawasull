
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
  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  // Data State
  const [serviceOptions, setServiceOptions] = useState<string[]>(initialServiceOptions);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectType: '',
    selectedServices: [] as string[]
  });
  
  // File State
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Clear errors when step changes to prevent stale messages
  useEffect(() => {
    setErrorMessage(null);
  }, [currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const toggleService = (service: string) => {
    setErrorMessage(null);
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service]
    }));
  };

  const handleProjectTypeSelect = (id: string) => {
    setFormData(prev => ({ ...prev, projectType: id }));
    setErrorMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.');
        return;
      }
      setFileName(file.name);
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
        if (!formData.name.trim()) {
            setErrorMessage('الرجاء إدخال الاسم بالكامل.');
            return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrorMessage('الرجاء إدخال بريد إلكتروني صحيح.');
            return false;
        }
        if (!formData.projectType) {
            setErrorMessage('الرجاء اختيار نوع المشروع.');
            return false;
        }
        if (!formData.message.trim()) {
            setErrorMessage('الرجاء كتابة تفاصيل الرسالة.');
            return false;
        }
    }
    if (step === 2) {
        if (formData.selectedServices.length === 0) {
            setErrorMessage('الرجاء اختيار خدمة واحدة على الأقل.');
            return false;
        }
        // Phone and File are generally optional
    }
    return true;
  };

  const handleNext = (e?: React.MouseEvent) => {
    // Prevent default button behavior and propagation
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (validateStep(currentStep)) {
        setErrorMessage(null);
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    setErrorMessage(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user hits Enter on step 1, move to next step instead of submitting
    if (currentStep < totalSteps) {
        // Manually trigger next logic without event
        if (validateStep(currentStep)) {
            setErrorMessage(null);
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
        return;
    }
    
    // Only validate the final step (or current step) before submitting
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('message', formData.message);
      data.append('project_type', formData.projectType);
      
      formData.selectedServices.forEach(service => {
        data.append('services[]', service);
      });

      if (selectedFile) {
        data.append('attachment', selectedFile);
      }

      await sendContactMessage(data);
      
      setShowSuccess(true);
      
      // Reset Form
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
            projectType: '',
            selectedServices: []
        });
        setFileName('');
        setSelectedFile(null);
        setCurrentStep(1);
      }, 5000);

    } catch (error: any) {
      const msg = error.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  interface ContactCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    icon: any;
    label: string;
    value: string;
    delay: string;
    href: string;
    dots?: number;
  }

  const ContactCard: React.FC<ContactCardProps> = ({ 
    icon: Icon, 
    label, 
    value, 
    delay, 
    href, 
    dots = 1,
    ...props
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
      {...props}
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
                    data-analytics="true"
                    data-event="social_click"
                    data-entity="link"
                    data-id="email_contact"
                    data-source="contact_section"
                />
            </div>
            <ContactCard 
                icon={MessageSquare} 
                label="الواتساب" 
                value={contactWhatsapp} 
                delay="500ms" 
                href={`https://wa.me/${contactWhatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
                dots={2}
                data-analytics="true"
                data-event="whatsapp_click"
                data-entity="button"
                data-id="whatsapp_contact"
                data-source="contact_section"
            />
            <ContactCard 
                icon={Phone} 
                label="اتصال مباشر" 
                value={contactPhone} 
                delay="600ms" 
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                dots={3}
                data-analytics="true"
                data-event="social_click"
                data-entity="button"
                data-id="phone_contact"
                data-source="contact_section"
            />
          </div>
        </div>

        <div 
          className="reveal lg:col-span-7 bg-primary rounded-[32px] md:rounded-[48px] p-8 md:p-14 text-white shadow-2xl transition-all duration-700 opacity-0 translate-y-8 [.reveal-visible_&]:opacity-100 [.reveal-visible_&]:translate-y-0 relative overflow-hidden flex flex-col min-h-[600px]" 
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

          {/* Form Header / Progress */}
          <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6 relative z-10">
             <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-white">ابدأ مشروعك</h3>
                <span className="text-white/50 text-sm font-bold">الخطوة {currentStep} من {totalSteps}</span>
             </div>
             <div className="flex items-center gap-2">
                {[1, 2].map(step => (
                   <div key={step} className={`h-2 rounded-full transition-all duration-500 ${step <= currentStep ? 'w-8 bg-secondary' : 'w-2 bg-white/20'}`}></div>
                ))}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between relative overflow-hidden">
            {/* Steps Slider Container */}
            <div className="mb-8 relative w-full">
              <div 
                  className="flex w-[200%] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ transform: `translateX(${currentStep === 1 ? '0%' : '50%'})` }}
              >
                  {/* Step 1 Content */}
                  <div className={`w-1/2 px-1 transition-all duration-500 delay-100 ${currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95 pointer-events-none'}`}>
                      <div className="flex flex-col gap-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="flex flex-col gap-3">
                                  <p className="text-[14px] font-black text-white/40 tracking-widest">الاسم بالكامل*</p>
                                  <input 
                                      type="text" 
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      placeholder="اسمك الكريم" 
                                      className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all"
                                      data-cursor-text="الاسم"
                                  />
                              </div>
                              <div className="flex flex-col gap-3">
                                  <p className="text-[14px] font-black text-white/40 tracking-widest">البريد الإلكتروني*</p>
                                  <input 
                                      type="email" 
                                      name="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      placeholder="example@gmail.com" 
                                      className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all"
                                      data-cursor-text="البريد"
                                  />
                              </div>
                          </div>

                          <div className="flex flex-col gap-4">
                              <p className="text-[14px] font-black text-white/40 tracking-widest text-right">نوع المشروع*</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  {projectTypes.map((type) => (
                                  <button
                                      key={type.id}
                                      type="button"
                                      onClick={() => handleProjectTypeSelect(type.id)}
                                      className={`py-4 rounded-[16px] border transition-all duration-300 text-[11px] font-black uppercase tracking-widest ${formData.projectType === type.id ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                      data-cursor-text="اختر النوع"
                                  >
                                      {type.label}
                                  </button>
                                  ))}
                              </div>
                          </div>

                          <div className="flex flex-col gap-3">
                              <p className="text-[14px] font-black text-white/40 tracking-widest">الرسالة والتفاصيل*</p>
                              <textarea 
                                  name="message"
                                  value={formData.message}
                                  onChange={handleInputChange}
                                  rows={4} 
                                  placeholder="أخبرنا عن طموحاتك وتحديات مشروعك..." 
                                  className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all resize-none"
                                  data-cursor-text="التفاصيل"
                              ></textarea>
                          </div>
                      </div>
                  </div>

                  {/* Step 2 Content */}
                  <div className={`w-1/2 px-1 transition-all duration-500 delay-100 ${currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95 pointer-events-none'}`}>
                      <div className="flex flex-col gap-8">
                          <div className="flex flex-col gap-3">
                              <p className="text-[14px] font-black text-white/40 tracking-widest">رقم الجوال (اختياري)</p>
                              <input 
                                  type="tel" 
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="05xxxxxxxx" 
                                  className="w-full bg-white/5 border border-white/10 rounded-[16px] px-6 py-5 text-[1rem] font-medium text-white placeholder-white/20 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all text-right" 
                                  data-cursor-text="رقم الجوال"
                              />
                          </div>

                          <div className="flex flex-col gap-4">
                              <p className="text-[14px] font-black text-white/40 tracking-widest text-right">الخدمات المطلوبة*</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {serviceOptions.map((service) => (
                                  <button
                                      key={service}
                                      type="button"
                                      onClick={() => toggleService(service)}
                                      className={`flex items-center justify-between px-5 py-4 rounded-[16px] border transition-all duration-300 text-[13px] font-bold ${formData.selectedServices.includes(service) ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                      data-cursor-text="تحديد"
                                  >
                                      <span>{service}</span>
                                      {formData.selectedServices.includes(service) && <Check size={16} strokeWidth={3} />}
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
                      </div>
                  </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-300 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6 animate-entrance-up relative z-10">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-bold">{errorMessage}</span>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5 relative z-10">
                {currentStep > 1 && (
                    <button 
                        key="back-btn"
                        type="button" 
                        onClick={handleBack}
                        className="px-6 py-4 rounded-full border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                        data-cursor-text="رجوع"
                    >
                        رجوع
                    </button>
                )}

                {currentStep < totalSteps ? (
                    <button 
                        key="next-btn"
                        type="button"
                        onClick={handleNext}
                        className="flex-1 group relative inline-flex items-center justify-center rounded-full px-8 py-4 transition-all duration-300 bg-white text-primary hover:bg-secondary hover:text-white font-black overflow-hidden"
                        data-cursor-text="التالي"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                           التالي
                           <ArrowLeft size={18} className="rotate-0" />
                        </span>
                    </button>
                ) : (
                    <button 
                        key="submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 group relative inline-flex items-center rounded-full pr-8 pl-1.5 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl active:scale-[0.98] overflow-hidden bg-secondary text-white justify-between ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
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
                )}
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
