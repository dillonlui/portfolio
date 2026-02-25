import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Shared gating: skip all effects on mobile, coarse pointer, or reduced motion */
function shouldSkip(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.innerWidth < 768) return true;
  if (window.matchMedia('(pointer: coarse)').matches) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return false;
}

/**
 * Feature 1 & 2: Button hover sheen + magnetic snap
 * Targets .btn and .cta-btn elements
 */
export function initButtonSheen() {
  if (shouldSkip()) return;

  const buttons = document.querySelectorAll<HTMLElement>('.btn, .cta-btn');

  buttons.forEach((btn) => {
    // Skip if already initialized (ViewTransitions re-init safety)
    if (btn.dataset.sheenInit) return;
    btn.dataset.sheenInit = '1';

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Sheen position
      btn.style.setProperty('--mouse-x', `${x}px`);
      btn.style.setProperty('--mouse-y', `${y}px`);
      btn.classList.add('sheen-active');

      // Magnetic snap: translate toward cursor, capped at 3px
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX; // -1 to 1
      const deltaY = (y - centerY) / centerY;
      const maxShift = 3;

      gsap.to(btn, {
        x: deltaX * maxShift,
        y: deltaY * maxShift,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    btn.addEventListener('mouseenter', () => {
      btn.classList.add('sheen-active');
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('sheen-active');

      // Spring back to origin
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto',
      });
    });
  });
}

/**
 * Feature 3: Avatar 3D tilt on about page
 */
export function initAvatarTilt() {
  if (shouldSkip()) return;

  const wrapper = document.querySelector<HTMLElement>('.about-image-wrapper');
  const img = wrapper?.querySelector<HTMLElement>('.profile-image');
  if (!wrapper || !img) return;
  if (wrapper.dataset.tiltInit) return;
  wrapper.dataset.tiltInit = '1';

  const maxRotate = 8;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * maxRotate;  // -8 to 8
    const rotateX = (0.5 - y) * 2 * maxRotate;   // inverted for natural tilt

    // Shadow shifts opposite to tilt for depth
    const shadowX = -rotateY * 0.8;
    const shadowY = rotateX * 0.8;

    gsap.to(img, {
      rotateX,
      rotateY,
      boxShadow: `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.15)`,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  wrapper.addEventListener('mouseleave', () => {
    gsap.to(img, {
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.08)',
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  });
}

/**
 * Feature 4: Staggered letter reveal for homepage hero title
 */
export function initHeroLetterReveal() {
  if (shouldSkip()) {
    // On mobile/reduced-motion, just make sure it's visible
    const title = document.querySelector<HTMLElement>('.hero-title-home');
    if (title) {
      title.style.opacity = '1';
    }
    return;
  }

  const title = document.querySelector<HTMLElement>('.hero-title-home');
  if (!title) return;

  const text = title.textContent || '';
  title.innerHTML = '';
  (title as HTMLElement).style.opacity = '1';

  // Split into characters, preserving spaces
  const chars: HTMLSpanElement[] = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    if (char === ' ') {
      span.style.width = '0.3em';
    }
    title.appendChild(span);
    chars.push(span);
  }

  gsap.set(chars, { opacity: 0, y: 20, rotateX: -40 });

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.6,
    stagger: 0.03,
    ease: 'power3.out',
  });
}

/**
 * Feature 5: Scroll-velocity parallax for case study hero images
 */
export function initScrollVelocityParallax() {
  if (shouldSkip()) return;

  const heroWrapper = document.querySelector<HTMLElement>('.hero-image-wrapper');
  if (!heroWrapper || heroWrapper.dataset.velocityInit) return;
  heroWrapper.dataset.velocityInit = '1';

  const quickY = gsap.quickTo(heroWrapper, 'y', {
    duration: 0.4,
    ease: 'power2.out',
  });

  const quickScaleY = gsap.quickTo(heroWrapper, 'scaleY', {
    duration: 0.4,
    ease: 'power2.out',
  });

  ScrollTrigger.create({
    trigger: heroWrapper,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const velocity = self.getVelocity(); // px/s
      const normalizedV = Math.min(Math.abs(velocity) / 3000, 1); // 0-1

      // Subtle Y shift based on velocity direction
      const yShift = (velocity / 3000) * 8; // max ±8px
      quickY(yShift);

      // Subtle compression on fast scroll
      const scale = 1 - normalizedV * 0.02; // min 0.98
      quickScaleY(scale);
    },
  });
}
