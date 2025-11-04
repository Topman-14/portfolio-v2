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
      if (show) {
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y: -20 },
          { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      } else {
        gsap.to(ref.current, {
          autoAlpha: 0,
          y: -20,
          duration: 0.25,
          ease: 'power2.in',
        });
      }
    }
  }, [show]);

  return show ? <div ref={ref}>{children}</div> : null;
}
