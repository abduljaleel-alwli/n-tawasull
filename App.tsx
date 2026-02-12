import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Benefits from './components/Benefits';
import SelectedWork from './components/SelectedWork';
import Reviews from './components/Reviews';
import Logos from './components/Logos';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import Loader from './components/Loader';
import { useSettings } from './context/SettingsContext';
import { getFileUrl, fetchProjects, ProjectItem } from './utils/api';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [appState, setAppState] = useState<'home' | 'to-detail' | 'detail' | 'to-home'>('home');
  const [workItems, setWorkItems] = useState<ProjectItem[]>([]);
  const [isAppReady, setIsAppReady] = useState(false);
  const { getSetting, settings } = useSettings();
  const scriptsInjectedRef = useRef(false);

  // Global Settings Effect: Colors, SEO, Favicon, Scripts
  useEffect(() => {
    const primaryColor = getSetting('colors.secondary', '#203C71');
    const secondaryColor = getSetting('colors.accent', '#EF7F17');
    const backgroundColor = getSetting('colors.background', '#f0f0f0');

    const root = document.documentElement;
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--secondary', secondaryColor);
    root.style.setProperty('--background', backgroundColor);

    const siteTitle = getSetting('seo.meta_title', getSetting('site_name', 'نقطة تواصل | شريكك التسويقي الاستراتيجي'));
    const metaDesc = getSetting('seo.meta_description', getSetting('site_description', 'وكالة تسويق إبداعية'));
    const metaKeywords = getSetting('seo.keywords', '');

    if (document.title !== siteTitle) {
      document.title = siteTitle;
    }

    const setMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };

    if (metaDesc) setMetaTag('description', metaDesc);
    if (metaKeywords) setMetaTag('keywords', metaKeywords);

    const faviconPath = getSetting('branding.favicon', null) || getSetting('branding.logo', null);
    
    if (faviconPath) {
      const fullIconUrl = getFileUrl(faviconPath);
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/png';
      link.href = fullIconUrl;
    }

    if (!scriptsInjectedRef.current && Object.keys(settings).length > 0) {
        const headScripts = getSetting('scripts.head', '');
        const footerScripts = getSetting('scripts.footer', '');

        const inject = (html: string, target: HTMLElement) => {
            if (!html) return;
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                target.appendChild(newScript);
            });
        };

        if (headScripts) inject(headScripts, document.head);
        if (footerScripts) inject(footerScripts, document.body);
        
        scriptsInjectedRef.current = true;
    }

  }, [settings, getSetting]);

  // Fetch Projects from API
  useEffect(() => {
    let isMounted = true;
    fetchProjects().then(data => {
      if (isMounted && data.length > 0) {
        setWorkItems(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Particles.js Initialization
  useEffect(() => {
    // @ts-ignore
    if (typeof particlesJS !== 'undefined') {
      // @ts-ignore
      particlesJS("particles-js", {
        "particles": {
            "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#ff3131", "#00f3ff", "#ffffff"] }, 
            "shape": { "type": "circle" },
            "opacity": { "value": 0.6, "random": true },
            "size": { "value": 4, "random": true },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#00f3ff", 
                "opacity": 0.2,
                "width": 1
            },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "repulse": { "distance": 100, "duration": 0.4 } }
        },
        "retina_detect": true
      });
    }
  }, []);

  // Scroll Reveal Observer Logic
  useEffect(() => {
    if (!isAppReady) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [appState, selectedProject?.id, workItems, isAppReady]); 

  const handleProjectClick = (project: any) => {
    if (appState === 'detail') {
        setSelectedProject(project);
        return;
    }

    setSelectedProject(project);
    setAppState('to-detail');
    
    setTimeout(() => {
      setAppState('detail');
    }, 1100);
  };

  const handleBackToHome = () => {
    setAppState('to-home');
    setTimeout(() => {
        setAppState('home');
        setSelectedProject(null);
    }, 1100);
  };

  return (
    <div className="min-h-screen relative">
      <Loader onFinished={() => setIsAppReady(true)} />

      {/* Navbar Container with Slide Down Effect */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[200] dramatic-transition 
          ${appState !== 'home' || !isAppReady ? 'translate-y-[-100%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
        `}
        style={{ transitionDelay: isAppReady ? '400ms' : '0ms' }}
      >
        <Navbar />
      </div>

      <main className={`relative transition-opacity duration-1000 ${isAppReady ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className={`dramatic-transition 
            ${appState === 'home' ? 'home-visible' : ''} 
            ${appState === 'to-detail' || appState === 'detail' ? 'home-exit-up' : ''} 
            ${appState === 'to-home' ? 'home-visible' : ''}
          `}
          style={appState === 'to-home' ? { transform: 'translateY(100vh)', transition: 'none', opacity: 0 } : undefined}
          ref={(el) => {
              if (el && appState === 'to-home') {
                  requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                          el.style.transform = 'translateY(0)';
                          el.style.opacity = '1';
                          el.style.transition = 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
                      });
                  });
              }
          }}
        >
          <section id="home"><Hero isReady={isAppReady} /></section>
          <section id="services"><Services /></section>
          <section id="benefits"><Benefits /></section>
          <section id="work"><SelectedWork projects={workItems} onProjectClick={handleProjectClick} /></section>
          <section id="reviews"><Reviews /></section>
          <Logos />
          <section id="faqs"><FAQ /></section>
          <section id="contact"><Contact /></section>
          <Footer />
        </div>

        <div 
          className={`fixed inset-0 z-[250] bg-background dramatic-transition 
            ${appState === 'home' ? 'detail-hidden-bottom' : ''}
            ${appState === 'to-detail' ? 'detail-active' : ''}
            ${appState === 'detail' ? 'detail-active' : ''}
            ${appState === 'to-home' ? 'detail-exit-up' : ''}
          `}
          style={{ scrollbarWidth: 'none', overflowY: 'auto' }}
          dir="rtl"
        >
          {selectedProject && (
            <div className="min-h-screen">
              <ProjectDetail 
                project={selectedProject} 
                allProjects={workItems}
                onProjectSelect={handleProjectClick}
                onBack={handleBackToHome} 
              />
              <Footer />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;