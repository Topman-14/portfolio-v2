'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from 'gsap-trial/SplitText';
import SplinePlayer from "@/components/custom/spline";

gsap.registerPlugin(SplitText);

export const Hero = () => {
  const introRef = useRef<HTMLParagraphElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const intro = introRef.current;
    const bigText = bigTextRef.current;
    const description = descriptionRef.current;

    if (!intro || !bigText || !description) return;

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      const introSplit = new SplitText(intro, { type: 'lines' });
      gsap.set(introSplit.chars, { opacity: 0, y: 20 });
      
      const bigTextSplit = new SplitText(bigText, { type: 'words,chars' });
      gsap.set(bigTextSplit.chars, { opacity: 0, y: 40, rotationX: -90 });
      
      const descriptionSplit = new SplitText(description, { type: 'lines' });
      gsap.set(descriptionSplit.words, { opacity: 0, y: 20 });

      tl.fromTo(introSplit.lines, {
        opacity: 0,
        y: 20,
      }, {
        duration: 0.6,
        delay: 0.8,
        opacity: 1,
        y: 0,
        ease: 'ease.inOut',
      }, 0)
      .to(bigTextSplit.chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: { amount: 0.6, from: 'start' },
      }, 0.4)
      .fromTo(descriptionSplit.lines, {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        delay: 0.8,
        duration: 0.4,
        ease: 'ease.inOut',
      }, 1.2);

      return () => {
        tl.kill();
        introSplit.revert();
        bigTextSplit.revert();
        descriptionSplit.revert();
      };
    });
  }, { scope: bigTextRef });

  return (
    <section className="relative min-h-screen bg1 overflow-hidden">
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl w-full pt-32 pb-40 xl:max-w-6xl">
          <p 
            ref={introRef}
            className="text-xl md:text-4xl text-white/80 mb-4 font-sans font-semibold"
          >
            Tope Akinkuade
          </p>
          
          <h1 
            ref={bigTextRef}
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white leading-[1.1] mb-8 text-left max-w-4xl"
          >
            Recovering Perfectionist, <br/>
            <span className="text-malachite">Current Pragmatist.</span>
          </h1>
          
          <p 
            ref={descriptionRef}
            className="text-sm md:text-base text-white/80 font-semibold max-w-xl leading-relaxed font-sans"
          >
           I&apos;m a Product engineer that works across the stack to create systems that balance precision and practicality. <br/>
           From architecture to deployment, I build infrastructure nobody notices; until it&apos;s missing.
          </p>
        </div>
      </div>

      <div className="absolute bottom-32 right-12 size-[600px] z-[15] pointer-events-none">
        <SplinePlayer 
          scene="/3d/hero.splinecode" 
          draggable={true} 
          className="w-full h-full" 
          cameraPosition={{ x: 50, y: -90, z: 380 }}
          cameraRotation={{ x: -0.05, y: -0.15, z: 0 }}
          disableZoom={true}
          interactive={true}
          zoom={1.5}
        />
      </div>
    </section>
  )
}
