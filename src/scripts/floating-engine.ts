import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Bubble {
  el: HTMLAnchorElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  rotation: number;
  rotFreq: number;
  rotPhase: number;
  rotAmplitude: number;
  width: number;
  height: number;
  depth: number;
  isPaused: boolean;
  pauseDecay: number;
  lastVx: number;
  lastVy: number;
  magneticOffsetX: number;
  magneticOffsetY: number;
  isFeatured: boolean;
  index: number;
}

export class FloatingEngine {
  private container: HTMLElement;
  private hoverCard: HTMLElement;
  private bubbles: Bubble[] = [];
  private rafId: number = 0;
  private lastTime: number = 0;
  private mouseX: number = -9999;
  private mouseY: number = -9999;
  private mouseInContainer: boolean = false;
  private scrollVelocity: number = 0;
  private containerRect: DOMRect;
  private hoveredBubble: Bubble | null = null;
  private leaveTimeout: number = 0;
  private entranceDone: boolean = false;
  private destroyed: boolean = false;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    container: HTMLElement,
    bubbleEls: NodeListOf<HTMLAnchorElement>,
    hoverCard: HTMLElement
  ) {
    this.container = container;
    this.hoverCard = hoverCard;
    this.containerRect = container.getBoundingClientRect();

    this.initBubbles(bubbleEls);
    this.bindEvents();
  }

  private initBubbles(els: NodeListOf<HTMLAnchorElement>) {
    const rect = this.containerRect;
    const cw = rect.width;
    const ch = rect.height;

    // Well-spread positions for large bubbles - avoid clustering
    const positions = [
      { xPct: 0.28, yPct: 0.38 }, // featured - left of center
      { xPct: 0.72, yPct: 0.15 }, // top right
      { xPct: 0.10, yPct: 0.75 }, // bottom left
      { xPct: 0.70, yPct: 0.70 }, // bottom right
      { xPct: 0.45, yPct: 0.08 }, // top center-left
    ];

    els.forEach((el, i) => {
      const w = parseInt(el.dataset.bubbleWidth || '240');
      const h = parseInt(el.dataset.bubbleHeight || '150');
      const depth = parseFloat(el.dataset.depth || '1');
      const isFeatured = el.dataset.featured === 'true';
      const pos = positions[i] || positions[0];

      const targetX = pos.xPct * cw - w / 2;
      const targetY = pos.yPct * ch - h / 2;

      // Random velocity: featured slower
      const speedRange = isFeatured ? [8, 18] : [12, 30];
      const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
      const angle = Math.random() * Math.PI * 2;

      const bubble: Bubble = {
        el,
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        targetX,
        targetY,
        rotation: 0,
        rotFreq: 0.3 + Math.random() * 0.5,
        rotPhase: Math.random() * Math.PI * 2,
        rotAmplitude: 3 + Math.random() * 5,
        width: w,
        height: h,
        depth,
        isPaused: false,
        pauseDecay: 1,
        lastVx: 0,
        lastVy: 0,
        magneticOffsetX: 0,
        magneticOffsetY: 0,
        isFeatured,
        index: i,
      };

      this.bubbles.push(bubble);
    });
  }

  private bindEvents() {
    // Mouse tracking (use cached containerRect)
    this.container.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX - this.containerRect.left;
      this.mouseY = e.clientY - this.containerRect.top;
      this.mouseInContainer = true;
    });

    this.container.addEventListener('mouseleave', () => {
      this.mouseInContainer = false;
    });

    // Bubble hover/focus
    this.bubbles.forEach((bubble) => {
      bubble.el.addEventListener('mouseenter', () => this.onBubbleEnter(bubble));
      bubble.el.addEventListener('mouseleave', () => this.onBubbleLeave());
      bubble.el.addEventListener('focus', () => this.onBubbleEnter(bubble));
      bubble.el.addEventListener('blur', () => this.onBubbleLeave());
    });

    // Hover card itself is hoverable - keeps card alive when user moves from bubble to card
    this.hoverCard.addEventListener('mouseenter', () => this.onCardEnter());
    this.hoverCard.addEventListener('mouseleave', () => this.onCardLeave());

    // Escape to dismiss card
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.hoveredBubble) {
        this.dismissCard();
      }
    };
    document.addEventListener('keydown', this.keydownHandler);

    // Scroll velocity
    ScrollTrigger.create({
      trigger: this.container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        this.scrollVelocity = self.getVelocity() * -0.05;
      },
    });

    // Resize - update container rect
    this.resizeObserver = new ResizeObserver(() => {
      this.containerRect = this.container.getBoundingClientRect();
    });
    this.resizeObserver.observe(this.container);
  }

  private onBubbleEnter(bubble: Bubble) {
    clearTimeout(this.leaveTimeout);
    bubble.lastVx = bubble.vx;
    bubble.lastVy = bubble.vy;
    bubble.isPaused = true;
    this.hoveredBubble = bubble;
    this.showCard(bubble);
  }

  private onBubbleLeave() {
    // Short delay so user can move to hover card without it disappearing
    this.leaveTimeout = window.setTimeout(() => {
      this.dismissCard();
    }, 120);
  }

  private onCardEnter() {
    // User moved onto the hover card - keep it alive
    clearTimeout(this.leaveTimeout);
  }

  private onCardLeave() {
    // User left the hover card - dismiss
    this.leaveTimeout = window.setTimeout(() => {
      this.dismissCard();
    }, 50);
  }

  private dismissCard() {
    if (this.hoveredBubble) {
      this.hoveredBubble.isPaused = false;
      this.hoveredBubble = null;
    }
    this.hideCard();
  }

  private showCard(bubble: Bubble) {
    const card = this.hoverCard;
    const rect = this.containerRect;
    const bx = bubble.x + bubble.magneticOffsetX;
    const by = bubble.y + bubble.magneticOffsetY;
    const bCenterX = bx + bubble.width / 2;

    // Populate content
    const titleEl = card.querySelector('.hover-card-title') as HTMLElement;
    const descEl = card.querySelector('.hover-card-description') as HTMLElement;
    const tagsEl = card.querySelector('.hover-card-tags') as HTMLElement;
    const accentEl = card.querySelector('.hover-card-accent') as HTMLElement;
    const ctaEl = card.querySelector('.hover-card-cta') as HTMLAnchorElement;

    if (titleEl) titleEl.textContent = bubble.el.dataset.title || '';
    if (descEl) descEl.textContent = bubble.el.dataset.description || '';
    if (ctaEl) ctaEl.href = bubble.el.href;
    if (accentEl) {
      accentEl.style.background = bubble.el.dataset.accentColor || 'var(--color-accent)';
    }

    if (tagsEl) {
      const tags = (bubble.el.dataset.tags || '').split(',').filter(Boolean);
      tagsEl.innerHTML = tags.map((t) => `<span class="tag">${t.trim()}</span>`).join('');
    }

    // Determine card placement: side with more space
    const spaceRight = rect.width - (bx + bubble.width);
    const spaceLeft = bx;
    const cardWidth = 260;
    const gap = 16;

    let cardX: number;
    if (spaceRight > cardWidth + gap) {
      cardX = bx + bubble.width + gap;
    } else if (spaceLeft > cardWidth + gap) {
      cardX = bx - cardWidth - gap;
    } else {
      cardX = Math.max(8, Math.min(bCenterX - cardWidth / 2, rect.width - cardWidth - 8));
    }

    let cardY = by;
    cardY = Math.max(8, Math.min(cardY, rect.height - 300));

    card.style.left = `${cardX}px`;
    card.style.top = `${cardY}px`;

    // Wipe direction based on bubble velocity at hover
    const vx = bubble.lastVx;
    const vy = bubble.lastVy;
    let wipe = 'right';
    if (Math.abs(vx) > Math.abs(vy)) {
      wipe = vx > 0 ? 'right' : 'left';
    } else {
      wipe = vy > 0 ? 'down' : 'up';
    }
    card.dataset.wipe = wipe;

    // Connector line
    const connector = card.querySelector('.hover-card-connector') as HTMLElement;
    if (connector) {
      const bubbleEdgeX = cardX > bx ? bx + bubble.width : bx;
      const bubbleEdgeY = by + bubble.height / 2;
      const cardEdgeX = cardX > bx ? cardX : cardX + cardWidth;
      const cardEdgeY = cardY + 30;

      const lineLength = Math.sqrt(
        Math.pow(cardEdgeX - bubbleEdgeX, 2) + Math.pow(cardEdgeY - bubbleEdgeY, 2)
      );
      const lineAngle = Math.atan2(cardEdgeY - bubbleEdgeY, cardEdgeX - bubbleEdgeX);

      connector.style.width = `${lineLength}px`;
      connector.style.height = '1px';
      connector.style.left = `${bubbleEdgeX - cardX}px`;
      connector.style.top = `${bubbleEdgeY - cardY}px`;
      connector.style.transformOrigin = '0 0';
      connector.style.transform = `rotate(${lineAngle}rad)`;
    }

    card.classList.remove('is-visible');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.add('is-visible');
      });
    });
    card.setAttribute('aria-hidden', 'false');
    card.removeAttribute('inert');
  }

  private hideCard() {
    this.hoverCard.classList.remove('is-visible');
    this.hoverCard.setAttribute('aria-hidden', 'true');
    this.hoverCard.setAttribute('inert', '');
  }

  start() {
    this.playEntrance();
  }

  private playEntrance() {
    const cw = this.containerRect.width;
    const ch = this.containerRect.height;
    const startTime = performance.now() / 1000;

    // Hide bubbles and position off-screen, already tilted
    this.bubbles.forEach((b, i) => {
      b.rotation = Math.sin(startTime * b.rotFreq + b.rotPhase) * b.rotAmplitude;
      b.el.style.opacity = '0';

      if (b.isFeatured) {
        b.x = b.targetX;
        b.y = ch + 80;
      } else if (i % 2 === 0) {
        b.x = -b.width - 80;
        b.y = b.targetY;
      } else {
        b.x = cw + 80;
        b.y = b.targetY;
      }

      this.applyTransform(b);
    });

    const tl = gsap.timeline({
      onComplete: () => {
        this.entranceDone = true;
        this.lastTime = performance.now();
        this.tick(this.lastTime);
      },
    });

    const featured = this.bubbles.find((b) => b.isFeatured);
    if (featured) {
      tl.to(
        featured,
        {
          x: featured.targetX,
          y: featured.targetY,
          duration: 0.8,
          ease: 'power2.out',
          onStart: () => { featured.el.style.opacity = '1'; },
          onUpdate: () => {
            const t = performance.now() / 1000;
            featured.rotation = Math.sin(t * featured.rotFreq + featured.rotPhase) * featured.rotAmplitude;
            this.applyTransform(featured);
          },
        },
        0
      );
    }

    const others = this.bubbles.filter((b) => !b.isFeatured);
    others.forEach((b, i) => {
      tl.to(
        b,
        {
          x: b.targetX,
          y: b.targetY,
          duration: 0.8,
          ease: 'power2.out',
          onStart: () => { b.el.style.opacity = '1'; },
          onUpdate: () => {
            const t = performance.now() / 1000;
            b.rotation = Math.sin(t * b.rotFreq + b.rotPhase) * b.rotAmplitude;
            this.applyTransform(b);
          },
        },
        0.08 + i * 0.08
      );
    });
  }

  private tick(timestamp: number) {
    if (!this.entranceDone || this.destroyed) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    const cw = this.containerRect.width;
    const ch = this.containerRect.height;
    const time = timestamp / 1000;

    for (const b of this.bubbles) {
      // Pause deceleration curve
      if (b.isPaused) {
        b.pauseDecay = Math.max(0, b.pauseDecay - dt * 3);
      } else {
        b.pauseDecay = Math.min(1, b.pauseDecay + dt * 2);
      }

      const moveScale = b.pauseDecay;
      const depthSpeed = b.depth < 0.5 ? 0.3 : b.depth < 0.8 ? 0.65 : 1;

      // Drift noise
      const noiseX = Math.sin(time * 0.7 + b.index * 1.3) * 8 + Math.sin(time * 1.1 + b.index * 2.7) * 5;
      const noiseY = Math.cos(time * 0.5 + b.index * 1.7) * 6 + Math.cos(time * 0.9 + b.index * 3.1) * 4;

      b.x += (b.vx * depthSpeed + noiseX * 0.3) * dt * moveScale;
      b.y += (b.vy * depthSpeed + noiseY * 0.3) * dt * moveScale;

      // Scroll influence
      b.y += this.scrollVelocity * b.depth * 0.3 * dt;

      // Boundary spring forces
      const edgePadding = 40;
      const springK = 200;

      if (b.x < edgePadding) {
        const force = (edgePadding - b.x) * springK * dt;
        b.vx += force * dt;
        b.x += force * dt * 0.5;
      }
      if (b.x + b.width > cw - edgePadding) {
        const force = (cw - edgePadding - b.x - b.width) * springK * dt;
        b.vx += force * dt;
        b.x += force * dt * 0.5;
      }
      if (b.y < edgePadding) {
        const force = (edgePadding - b.y) * springK * dt;
        b.vy += force * dt;
        b.y += force * dt * 0.5;
      }
      if (b.y + b.height > ch - edgePadding) {
        const force = (ch - edgePadding - b.y - b.height) * springK * dt;
        b.vy += force * dt;
        b.y += force * dt * 0.5;
      }

      // Velocity damping
      b.vx *= 0.998;
      b.vy *= 0.998;

      // Clamp velocity
      const maxSpeed = 50;
      const currentSpeed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (currentSpeed > maxSpeed) {
        b.vx = (b.vx / currentSpeed) * maxSpeed;
        b.vy = (b.vy / currentSpeed) * maxSpeed;
      }

      // Magnetic cursor pull
      b.magneticOffsetX *= 0.92;
      b.magneticOffsetY *= 0.92;

      if (this.mouseInContainer) {
        const bCenterX = b.x + b.width / 2;
        const bCenterY = b.y + b.height / 2;
        const dx = this.mouseX - bCenterX;
        const dy = this.mouseY - bCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const strength = 2 * (1 - dist / 200);
          const pullStrength = dist < 80 ? strength * 1.5 : strength;
          b.magneticOffsetX += (dx / dist) * pullStrength * dt * 60;
          b.magneticOffsetY += (dy / dist) * pullStrength * dt * 60;
        }
      }

      // Rotation oscillation
      b.rotation = Math.sin(time * b.rotFreq + b.rotPhase) * b.rotAmplitude;

      this.applyTransform(b);
    }

    // Bubble-to-bubble collision: push overlapping bubbles apart
    this.resolveBubbleCollisions(dt);

    // Decay scroll velocity
    this.scrollVelocity *= 0.95;

    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  /**
   * Soft collision between bubbles - treats each as an ellipse and pushes apart
   * when they overlap. Uses a spring-like repulsion force.
   */
  private resolveBubbleCollisions(dt: number) {
    const padding = 20; // minimum gap between bubbles
    const repulsionStrength = 300;

    for (let i = 0; i < this.bubbles.length; i++) {
      for (let j = i + 1; j < this.bubbles.length; j++) {
        const a = this.bubbles[i];
        const b = this.bubbles[j];

        // Center points (including magnetic offset for accurate visual position)
        const ax = a.x + a.magneticOffsetX + a.width / 2;
        const ay = a.y + a.magneticOffsetY + a.height / 2;
        const bx = b.x + b.magneticOffsetX + b.width / 2;
        const by = b.y + b.magneticOffsetY + b.height / 2;

        const dx = bx - ax;
        const dy = by - ay;

        // Combined half-widths/heights + padding as the collision threshold
        const minDistX = (a.width + b.width) / 2 + padding;
        const minDistY = (a.height + b.height) / 2 + padding;

        // Normalize distance to elliptical overlap
        const overlapX = Math.abs(dx) < minDistX ? 1 - Math.abs(dx) / minDistX : 0;
        const overlapY = Math.abs(dy) < minDistY ? 1 - Math.abs(dy) / minDistY : 0;

        if (overlapX > 0 && overlapY > 0) {
          // Overlap amount (0-1 range, higher = more overlap)
          const overlap = overlapX * overlapY;
          const force = overlap * repulsionStrength * dt;

          // Direction to push apart
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;

          // Apply force to velocities (lighter bubbles move more)
          const aWeight = a.isFeatured ? 0.3 : 0.5;
          const bWeight = b.isFeatured ? 0.3 : 0.5;

          if (!a.isPaused) {
            a.vx -= nx * force * aWeight;
            a.vy -= ny * force * aWeight;
          }
          if (!b.isPaused) {
            b.vx += nx * force * bWeight;
            b.vy += ny * force * bWeight;
          }
        }
      }
    }
  }

  private applyTransform(b: Bubble) {
    const tx = b.x + b.magneticOffsetX;
    const ty = b.y + b.magneticOffsetY;
    b.el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${b.rotation}deg)`;
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.rafId);
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
