// import gsap and useGSAP hook
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function DomAnimate({
  children,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (ref.current) {
      gsap.set(ref.current, { willChange: 'opacity, transform', force3D: true });
      
      if (show) {
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y: -20 },
          { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.25, 
            ease: 'power2.out',
            clearProps: 'willChange',
          }
        );
      } else {
        gsap.to(ref.current, {
          autoAlpha: 0,
          y: -20,
          duration: 0.25,
          ease: 'power2.in',
          clearProps: 'willChange',
        });
      }
    }
  }, [show]);

  return show ? <div ref={ref}>{children}</div> : null;
}
