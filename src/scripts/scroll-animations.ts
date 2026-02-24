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
 * Line-by-line text reveal using overflow-hidden mask + translateY.
 * Wraps each target element in a clip container and slides it up.
 */
export function initTextReveal(selector: string) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    // Wrap element content in a reveal container
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    el.parentNode?.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    gsap.set(el, { y: '100%', opacity: 0 });
    gsap.to(el, {
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: '0%',
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    });
  });
}

/**
 * Image reveal with clip-path wipe animation.
 * Wipes from left to right using inset clip-path.
 */
export function initImageReveal(selector: string) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.8,
      ease: 'power2.inOut',
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

/**
 * Diagonal stagger reveal for card grids.
 * Staggers items with increasing delay based on position.
 */
export function initGridReveal(container: string, items: string) {
  const containerEl = document.querySelector(container);
  if (!containerEl) return;

  const itemEls = containerEl.querySelectorAll(items);
  itemEls.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 50 });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power3.out',
    });
  });
}
