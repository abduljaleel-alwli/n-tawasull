import React from 'react';

const logos = [
  "https://framerusercontent.com/images/99CutKVhaCpfKyyx4QDQTOjqoFw.png",
  "https://framerusercontent.com/images/SntGnaXbfmd4SDpZt5NbUpqoMY.png",
  "https://framerusercontent.com/images/aq47127VvLe0RHaHMHA2SPfBywU.png",
  "https://framerusercontent.com/images/jeVqVvAipE1VxRWt03nKgkbaXVo.png",
  "https://framerusercontent.com/images/GMLQ7mKo1bzfW8UARIqyYlMM.png",
  "https://framerusercontent.com/images/CcGb0lxrD0L3pt85JVy0kd8L7c.png",
  "https://framerusercontent.com/images/LzC7qK2uDFUBXPVa1VHFfU7mb8.png"
];

const Logos: React.FC = () => {
  return (
    <section className="py-20 border-y border-black/6 overflow-hidden relative" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-row items-center gap-10">
        
        {/* ملصق العنوان الجانبي - ثابت في اليمين */}
          <div className="reveal inline-flex items-center gap-2 bg-primary px-4 py-2.5 rounded-[25px] shadow-lg" style={{ transitionDelay: '0ms' }}>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
            <span className="text-white font-black text-[12px] tracking-tight uppercase">عملأنا</span>
            <span className="text-secondary font-black text-[12px] tracking-tight">//</span>
          </div>
        
        {/* 
          Marquee Container
          Follows the "CSS Only Infinite Marquee" pattern
        */}
        <div className="reveal flex-1 w-full overflow-hidden" style={{ transitionDelay: '200ms' }}>
          <div className="marquee-wrapper">
            {/* Group 1 */}
            <div className="marquee-group">
              {logos.map((logo, idx) => (
                <div key={`g1-${idx}`} className="logo-item">
                  <img 
                    src={logo} 
                    alt="Partner" 
                    className="h-7 md:h-9 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer object-contain"
                  />
                </div>
              ))}
            </div>
            
            {/* Group 2 (Duplicate for loop) */}
            <div className="marquee-group" aria-hidden="true">
              {logos.map((logo, idx) => (
                <div key={`g2-${idx}`} className="logo-item">
                  <img 
                    src={logo} 
                    alt="Partner" 
                    className="h-7 md:h-9 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .marquee-wrapper {
          --gap: 2rem;
          display: flex;
          overflow: hidden;
          user-select: none;
          gap: var(--gap);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          direction: ltr; /* Ensures correct left-direction scrolling */
        }

        .marquee-group {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: var(--gap);
          min-width: 100%;
          animation: scroll 30s linear infinite;
        }

        .marquee-wrapper:hover .marquee-group {
          animation-play-state: paused;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% - var(--gap)));
          }
        }

        @media (min-width: 768px) {
          .marquee-wrapper {
            --gap: 4rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Logos;