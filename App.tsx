
import React, { useState, useEffect } from 'react';
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
import { useSettings } from './context/SettingsContext';
import { getFileUrl, fetchProjects, ProjectItem } from './utils/api';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [appState, setAppState] = useState<'home' | 'to-detail' | 'detail' | 'to-home'>('home');
  const [workItems, setWorkItems] = useState<ProjectItem[]>([]);
  const { getSetting } = useSettings();

  // Dynamic Head Updates (Title & Favicon)
  useEffect(() => {
    // Update Title
    const siteTitle = getSetting('site_name', 'نقطة تواصل | شريكك التسويقي الاستراتيجي');
    if (document.title !== siteTitle) {
      document.title = siteTitle;
    }

    // Update Favicon from Logo (using branding.logo as per API)
    const logoPath = getSetting('branding.logo', null);
    
    if (logoPath) {
      const fullIconUrl = getFileUrl(logoPath);
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/png';
      link.href = fullIconUrl;
    }
  }, [getSetting]);

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

  // Particles.js Initialization with refined brand integration
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
  }, [appState, selectedProject?.id, workItems]); // Add workItems dependency

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
      <div className={`fixed top-0 left-0 right-0 z-[200] dramatic-transition ${appState !== 'home' ? 'translate-y-[-100%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <Navbar />
      </div>

      <main className="relative">
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
          <section id="home"><Hero /></section>
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
