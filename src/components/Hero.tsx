
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Animation function that can be reused
  const animateTitle = (elements: any, isHover: boolean = false) => {
    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(elements);
    
    return gsap.to(elements, {
      y: isHover ? -3 : 0,
      scale: isHover ? 1.03 : 1,
      color: isHover ? '#ec4899' : '#ffffff',
      textShadow: isHover ? '0 0 15px rgba(236, 72, 153, 0.5)' : 'none',
      duration: isHover ? 0.6 : 0.4,
      ease: isHover ? 'power2.out' : 'power2.inOut',
      stagger: {
        amount: isHover ? 0.3 : 0.6,
        from: 'center',
        grid: 'auto',
        ease: 'power2.inOut'
      },
      overwrite: 'auto',
      force3D: true,
      willChange: 'transform, color, text-shadow'
    });
  };

  useEffect(() => {
    const splitTitle = new SplitText(titleRef.current, {
      type: 'chars,words',
      wordsClass: 'word',
      charsClass: 'char inline-block whitespace-pre cursor-pointer',
      position: 'absolute',
      visibility: 'visible'
    });

    // Initial setup
    gsap.set(splitTitle.chars, { 
      opacity: 0, 
      y: 80, 
      rotateX: -90,
      transformOrigin: '0% 50% -50%',
      display: 'inline-block'
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial animation
    tl.to(splitTitle.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: {
        amount: 0.8,
        from: 'random',
        ease: 'back.out(1.7)'
      },
      onComplete: () => {
        // Add hover effect after initial animation
        if (titleRef.current) {
          titleRef.current.addEventListener('mouseenter', () => {
            animateTitle(splitTitle.chars, true);
          });
          
          titleRef.current.addEventListener('mouseleave', () => {
            animateTitle(splitTitle.chars, false);
          });
        }
      }
    })
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .to(buttonRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.4');

    gsap.to(buttonRef.current, {
      y: '10px',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-white text-center px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/earth-poster.jpg" 
        >
          <source src="/earth.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10">
      <h1 
        ref={titleRef}
        className="text-5xl md:text-6xl font-extrabold mb-6 select-none will-change-transform"
      >
        <span className="relative inline-block">
          <span className="relative z-10">Welcome to Our Platform</span>
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ease-out pointer-events-none"></span>
        </span>
      </h1>
      <p 
        ref={subtitleRef}
        className="text-xl md:text-2xl mb-10 max-w-3xl opacity-0 translate-y-8"
      >
        Build amazing experiences with our cutting-edge technology stack and create something extraordinary.
      </p>
        <button 
          ref={buttonRef}
          className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full cursor-pointer opacity-0 scale-90 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;