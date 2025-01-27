import { useEffect, useRef } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxStaggerCardsAnimationProps {
  className?: string;
  button?: boolean;
  triggerId?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonStagger: any;
    gsap: any;
    ScrollTrigger: any;
  }
}

export default function NxStaggerCardsAnimation({ 
  className = '',
  button = false,
  triggerId = 'stagger-cards',
  ...props 
}: NxStaggerCardsAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    const initAnimation = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-stagger-animation.js');

        if (window.moonMoonStagger && containerRef.current) {
          window.moonMoonStagger.initStaggerAnimation(containerRef.current as HTMLElement);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
  }, []);

  return (
    <div className="nx-relative nx-w-full nx-overflow-hidden">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation targetRef={containerRef} type="stagger" />
        </div>
        
        {button && (
          <div className="nx-p-4 nx-border-b nx-border-gray-700">
            <button
              data-stagger-trigger={triggerId}
              className="nx-px-4 nx-py-2 nx-bg-white nx-text-gray-900 nx-rounded-lg nx-font-medium hover:nx-bg-gray-100 nx-transition-colors"
            >
              Lancer l'animation
            </button>
          </div>
        )}
        
        <div 
          ref={containerRef}
          data-stagger-reveal="true"
          data-click-event={button ? "true" : undefined}
          id={button ? triggerId : undefined}
          className={`
            nx-w-full nx-space-y-4 nx-p-4
            ${className}
          `}
          style={{
            minWidth: 'fit-content',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}
          {...props}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              data-stagger-item
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                lineHeight: '100px',
              }}
              className="
                nx-bg-white nx-w-[100px] nx-h-[100px] nx-rounded-lg nx-text-gray-900 nx-flex nx-items-center nx-justify-center
              "
            />
          ))}
        </div>
      </div>
    </div>
  )
} 