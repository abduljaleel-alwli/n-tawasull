import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getFileUrl } from '../utils/api';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  const { getSetting } = useSettings();
  const logoPath = getSetting('branding.logo', null);
  const logoUrl = getFileUrl(logoPath, 'logo.png');

  const menuImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    let interval: any;
    if (isMenuOpen) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % menuImages.length);
      }, 3500);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'خدماتنا', href: '#services' },
    { name: 'قيمنا', href: '#benefits' },
    { name: 'أعمالنا', href: '#work' },
    { name: 'التقييمات', href: '#reviews' },
    { name: 'الأسئلة', href: '#faqs' },
    { name: 'اتصل بنا', href: '#contact' },
  ];

  const handleMenuToggle = () => {
    if (!isMenuOpen) setHasOpenedBefore(true);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] animate-entrance-down ${scrolled ? 'py-4 md:py-6' : 'py-6 md:py-8'}`}>
        <div className="px-6 md:px-12 max-w-[1350px] mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <a href="#home">
              <img src={logoUrl} alt="نقطة تواصل" className="h-10 md:h-14 w-auto object-contain transition-transform hover:scale-105 duration-300" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#contact" 
              className="px-5 py-2.5 bg-white text-primary border border-gray-100 rounded-full text-sm font-black hover:bg-gray-50 transition-all duration-300 hidden sm:block"
            >
              ابدأ مشروعك
            </a>
            <button 
              onClick={handleMenuToggle}
              className="group flex items-center gap-4 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-black transition-all duration-500 active:scale-95 shadow-lg hover:shadow-xl min-w-[115px] justify-center"
            >
              <span className="relative h-5 overflow-hidden flex items-center">
                <span className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                  القائمة
                </span>
                <span className={`absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  إغلاق
                </span>
              </span>
              
              <div className="relative w-5 h-4 flex flex-col justify-center items-end">
                <span 
                  className={`absolute h-[2.5px] bg-white rounded-full transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                  ${isMenuOpen ? 'w-5 top-1/2 -translate-y-1/2 rotate-[135deg]' : 'w-5 top-0'}`}
                />
                
                <span 
                  className={`absolute h-[2.5px] bg-secondary rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                  ${isMenuOpen ? 'w-0 opacity-0 scale-0' : 'w-2 top-1/2 -translate-y-1/2 right-0'}`}
                />
                
                <span 
                  className={`absolute h-[2.5px] bg-white rounded-full transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                  ${isMenuOpen ? 'w-5 top-1/2 -translate-y-1/2 rotate-[45deg]' : 'w-3.5 bottom-0'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[90] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[4px]" onClick={() => setIsMenuOpen(false)}></div>
        
        <div 
          className={`absolute top-[75px] md:top-[95px] left-6 md:left-12 w-[calc(100%-48px)] md:w-[520px] bg-[#e5e5e5] p-1 rounded-[15px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
        >
          <div className="flex flex-col md:flex-row gap-1 rounded-[15px] md:overflow-hidden overflow-visible" dir="rtl">

            <div className="w-full md:w-[44%] bg-primary rounded-[10px] p-2 md:p-7 flex flex-col justify-center order-1 shrink-0 overflow-hidden">
              <div className="space-y-0 text-right">
                {navLinks.map((link, idx) => (
                  <div key={link.name} className={`${idx !== navLinks.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <a
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center justify-between px-4 py-2.5 md:py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 transform hover:pr-6"
                      data-cursor-text="انتقل"
                    >
                      <span className="text-[14px] md:text-[1rem] font-bold transition-transform duration-300 group-hover:scale-105">{link.name}</span>
                      <ChevronLeft size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-[56%] relative bg-gray-200 rounded-[10px] overflow-hidden min-h-[160px] md:min-h-0 order-2 shrink-0">
              {menuImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-[1200ms] ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full flex gap-1 shadow-lg border border-gray-100">
                {menuImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'bg-secondary w-2.5 md:w-3.5' : 'bg-gray-300'}`}
                    
                  ></button>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;