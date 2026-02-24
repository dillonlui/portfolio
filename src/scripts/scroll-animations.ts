import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate elements with the .fade-in class on scroll.
 * Used on pages with general scroll-reveal content.
 */
export function initFadeIn() {
  gsap.utils.toArray<Element>('.fade-in').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out',
    });
  });
}

/**
 * Animate case study section elements on scroll.
 * Accepts a CSS selector string to target specific elements.
 */
export function initCaseStudyAnimations(selector: string) {
  gsap.utils.toArray<Element>(selector).forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: 'power3.out',
    });
  });
}

/**
 * Staggered hero entrance animation.
 * Animates elements in sequence without scroll trigger.
 */
export function initHeroAnimation(selectors: string[]) {
  selectors.forEach((selector, i) => {
    gsap.set(selector, { opacity: 0, y: 30 });
    gsap.to(selector, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
    });
  });
}

/**
 * Staggered scroll-triggered animation for repeated elements (e.g. project cards).
 */
export function initStaggerAnimation(selector: string) {
  gsap.utils.toArray<Element>(selector).forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });
}

/**
 * Scroll-linked parallax movement.
 * Moves elements vertically as user scrolls. Disabled on mobile.
 */
export function initParallax(selector: string, speed: number = -50) {
  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          y: speed,
          ease: 'none',
        });
      });
    },
  });
}

