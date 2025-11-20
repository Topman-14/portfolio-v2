import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true,
  });

  gsap.config({
    nullTargetWarn: false,
  });

  gsap.defaults({
    force3D: true,
    transformOrigin: 'center center',
  });
}

export { gsap, ScrollTrigger };

