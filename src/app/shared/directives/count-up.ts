import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

/** Counts a number up from `countFrom` to the target once the element is visible. */
@Directive({
  selector: '[appCountUp]',
})
export class CountUp {
  readonly appCountUp = input.required<number>();
  readonly countFrom = input(0);
  readonly countDuration = input(2000);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    let frame = 0;

    afterNextRender(() => {
      const from = this.countFrom();
      const to = this.appCountUp();
      host.textContent = String(from);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion || typeof IntersectionObserver === 'undefined') {
        host.textContent = String(to);
        return;
      }

      const animate = () => {
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / this.countDuration(), 1);
          // jQuery "swing" easing, which Elementor's counter widget uses.
          const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
          host.textContent = String(Math.round(from + (to - from) * eased));
          if (progress < 1) {
            frame = requestAnimationFrame(step);
          }
        };
        frame = requestAnimationFrame(step);
      };

      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          animate();
        }
      });
      observer.observe(host);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }
}
