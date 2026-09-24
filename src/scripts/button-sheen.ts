/** Shared button sheen and small magnetic movement without the page animation bundle. */
export function initButtonSheen() {
  if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('.btn, .cta-btn').forEach((button) => {
    if (button.dataset.sheenInit) return;
    button.dataset.sheenInit = '1';

    const baseTransition = getComputedStyle(button).transition;
    let rect: DOMRect | null = null;

    button.addEventListener('mouseenter', () => {
      rect = button.getBoundingClientRect();
      button.style.transition = `${baseTransition}, translate 300ms ease`;
      button.classList.add('sheen-active');
    });

    button.addEventListener('mousemove', (event) => {
      rect ??= button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      button.style.setProperty('--mouse-x', `${x}px`);
      button.style.setProperty('--mouse-y', `${y}px`);

      const offsetX = ((x / rect.width) * 2 - 1) * 3;
      const offsetY = ((y / rect.height) * 2 - 1) * 3;
      button.style.setProperty('translate', `${offsetX}px ${offsetY}px`);
    });

    button.addEventListener('mouseleave', () => {
      rect = null;
      button.classList.remove('sheen-active');
      button.style.transition = `${baseTransition}, translate 600ms cubic-bezier(0.2, 1.4, 0.4, 1)`;
      button.style.setProperty('translate', '0 0');
    });
  });
}
