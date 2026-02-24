/**
 * Global light trail + custom cursor that works across the entire site.
 * Renders a canvas overlay with a warm trailing glow following the mouse,
 * plus a stylized custom cursor (accent green fill, white outline).
 */

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

class GlobalCursorTrail {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private points: TrailPoint[] = [];
  private maxPoints = 40;
  private fadeDuration = 800;
  private maxSize = 24;
  private minSize = 8;
  private dpr: number = 1;
  private rafId: number = 0;
  private mouseX: number = -100;
  private mouseY: number = -100;
  private isActive: boolean = false;

  // Custom cursor element
  private cursorEl: HTMLDivElement;

  constructor() {
    // Create the canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'global-trail-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;

    // Create custom cursor element
    this.cursorEl = document.createElement('div');
    this.cursorEl.id = 'custom-cursor';
    this.cursorEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.cursorEl);

    this.resize();
    this.bindEvents();
    this.isActive = true;
    this.tick(performance.now());
  }

  private resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.addPoint(e.clientX, e.clientY);

      // Update custom cursor position
      this.cursorEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      if (!this.cursorEl.classList.contains('is-visible')) {
        this.cursorEl.classList.add('is-visible');
        // Add class to body for cursor:none (works cross-browser, no :has() needed)
        document.body.classList.add('custom-cursor-active');
      }
    });

    document.addEventListener('mouseleave', () => {
      this.cursorEl.classList.remove('is-visible');
      document.body.classList.remove('custom-cursor-active');
    });

    document.addEventListener('mouseenter', () => {
      this.cursorEl.classList.add('is-visible');
      document.body.classList.add('custom-cursor-active');
    });

    // Detect hovering over interactive elements for cursor state
    // Includes: links, buttons, inputs, lightbox images, figures with clickable images
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'a, button, [role="button"], input, textarea, select, ' +
        '.floating-bubble, .lb-clickable, ' +
        'img[style*="cursor"], figure img, [data-lightbox]'
      );
      // Also check if the element itself or parent has cursor:pointer via computed style
      const hasPointerCursor = !isInteractive && (
        target.tagName === 'IMG' && getComputedStyle(target).cursor === 'pointer'
      );
      if (isInteractive || hasPointerCursor) {
        this.cursorEl.classList.add('is-hovering');
      } else {
        this.cursorEl.classList.remove('is-hovering');
      }
    });

    window.addEventListener('resize', () => this.resize());
  }

  private addPoint(x: number, y: number) {
    const now = performance.now();
    const last = this.points[this.points.length - 1];

    // Interpolate midpoints for smooth trail
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) {
        const steps = Math.min(Math.floor(dist / 8), 4);
        for (let i = 1; i <= steps; i++) {
          const t = i / (steps + 1);
          this.pushPoint(last.x + dx * t, last.y + dy * t, now);
        }
      }
    }

    this.pushPoint(x, y, now);
  }

  private pushPoint(x: number, y: number, time: number) {
    this.points.push({ x, y, time });
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  private tick(timestamp: number) {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);

    // Remove expired points
    this.points = this.points.filter((p) => timestamp - p.time < this.fadeDuration);

    for (const point of this.points) {
      const age = timestamp - point.time;
      const life = 1 - age / this.fadeDuration;
      if (life <= 0) continue;

      const size = this.minSize + (this.maxSize - this.minSize) * life;
      const alpha = life;

      // Warm cream radial gradient with faint green halo
      const gradient = this.ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        size
      );
      gradient.addColorStop(0, `rgba(255, 248, 230, ${0.15 * alpha})`);
      gradient.addColorStop(0.6, `rgba(32, 93, 23, ${0.06 * alpha})`);
      gradient.addColorStop(1, `rgba(32, 93, 23, 0)`);

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }

    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  destroy() {
    this.isActive = false;
    cancelAnimationFrame(this.rafId);
    this.canvas.remove();
    this.cursorEl.remove();
  }
}

// Initialize once, gate on desktop + no reduced motion
export function initGlobalCursor() {
  const isDesktop = window.innerWidth >= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Also check for touch-primary devices
  const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;

  if (!isDesktop || prefersReducedMotion || isTouchPrimary) return;

  // Prevent double-init
  if (document.getElementById('global-trail-canvas')) return;

  new GlobalCursorTrail();
}
