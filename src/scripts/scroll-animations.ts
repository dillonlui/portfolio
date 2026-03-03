import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Kill all GSAP ScrollTriggers and tweens, and clear inline styles
 * GSAP leaves behind so they don't persist across breakpoints or pages.
 */
export function cleanupGSAP() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  gsap.killTweensOf('*');

  // Remove GSAP inline styles from animated elements
  const gsapProps = ['transform', 'translate', 'rotate', 'scale', 'opacity'];
  document.querySelectorAll<HTMLElement>('.fade-in, .hero-title, .hero-subtitle, .hero-blurb, .hero-cta, .floating-bubble, [style*="translate"]').forEach((el) => {
    gsapProps.forEach((prop) => el.style.removeProperty(prop));
  });

  // Restore letter-reveal title to plain text so it can re-wrap naturally
  const letterRevealTitle = document.querySelector<HTMLElement>('.hero-title-home');
  if (letterRevealTitle && letterRevealTitle.querySelector('span')) {
    const text = letterRevealTitle.textContent || '';
    letterRevealTitle.innerHTML = '';
    letterRevealTitle.textContent = text;
  }
}

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
  if (window.innerWidth < 768) return;

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
}

/**
 * Scrolling timeline for the about page experience section.
 * Draws an SVG line on scroll, activates node markers, and reveals cards.
 */
export function initTimeline() {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  const track = container.querySelector<HTMLElement>('.timeline-track');
  const fillLine = container.querySelector<HTMLElement>('.timeline-fill-line');
  const indicator = container.querySelector<HTMLElement>('.timeline-scroll-indicator');
  const nodes = gsap.utils.toArray<HTMLElement>('.timeline-node-dot');
  const cards = gsap.utils.toArray<HTMLElement>('.timeline-card');
  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];

  if (!track || !fillLine || !indicator || !firstNode || !lastNode) return;

  // Helper: measure node positions relative to container and update track
  function measureAndUpdate() {
    const containerTop = container!.getBoundingClientRect().top + window.scrollY;

    const nodeCentersPx = nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return r.top + window.scrollY + r.height / 2 - containerTop;
    });

    const firstPx = nodeCentersPx[0];
    const lastPx = nodeCentersPx[nodeCentersPx.length - 1];
    const height = lastPx - firstPx;

    track!.style.top = `${firstPx}px`;
    track!.style.height = `${height}px`;
    track!.style.bottom = 'auto';

    // Return node fractions within the trimmed track
    return nodeCentersPx.map((px) => (px - firstPx) / height);
  }

  let nodePositions = measureAndUpdate();

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    fillLine.style.transform = 'scaleY(1)';
    indicator.style.display = 'none';
    nodes.forEach((node) => node.classList.add('is-active'));
    cards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    return;
  }

  // Start fill hidden
  fillLine.style.transform = 'scaleY(0)';

  // Proxy value that GSAP tweens with scrub smoothing
  const proxy = { t: 0 };

  // Anchor scroll range directly to first/last node elements
  // so progress 0→1 = first node center → last node center at the viewport line
  gsap.to(proxy, {
    t: 1,
    ease: 'none',
    onUpdate: () => {
      const t = proxy.t;

      fillLine.style.transform = `scaleY(${t})`;
      indicator.style.top = `${t * 100}%`;
      indicator.style.opacity = t > 0 ? '1' : '0';

      nodes.forEach((node, i) => {
        if (t >= nodePositions[i] && !node.classList.contains('is-active')) {
          node.classList.add('is-active');
        }
      });
    },
    scrollTrigger: {
      trigger: firstNode,
      endTrigger: lastNode,
      start: 'center 70%',
      end: 'center 70%',
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        nodePositions = measureAndUpdate();
      },
    },
  });

  // Card reveal animations with responsive direction
  const isDesktop = window.innerWidth >= 768;
  cards.forEach((card) => {
    const entry = card.closest('.timeline-entry');
    const isLeft = isDesktop && entry?.classList.contains('entry-left');
    gsap.fromTo(
      card,
      { opacity: 0, x: isLeft ? -30 : isDesktop ? 30 : 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: isDesktop ? 'top 82%' : 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

