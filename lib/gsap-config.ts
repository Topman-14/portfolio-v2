import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);
  
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true,
    limitCallbacks: true,
    syncInterval: 150,
  });

  gsap.config({
    nullTargetWarn: false,
    force3D: true,
  });

  gsap.defaults({
    force3D: true,
    transformOrigin: 'center center',
    overwrite: 'auto',
  });
}

export { gsap, ScrollTrigger, Observer, ScrollToPlugin };

