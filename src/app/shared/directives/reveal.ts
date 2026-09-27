import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

export type RevealAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn';
export type RevealSpeed = 'fast' | 'normal' | 'slow';

/**
 * Plays an entrance animation (keyframes live in styles.scss) the first time
 * the element scrolls into view, like Elementor's "Motion Effects".
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[class.is-revealed]': 'revealed()',
    '[class.reveal--fast]': 'revealSpeed() === "fast"',
    '[class.reveal--slow]': 'revealSpeed() === "slow"',
    '[style.animation-name]': 'revealed() ? appReveal() : null',
    '[style.animation-delay.ms]': 'revealDelay() || null',
  },
})
export class Reveal {
  /** Animation name; a bare `appReveal` attribute means `fadeInUp`. */
  readonly appReveal = input<RevealAnimation, RevealAnimation | ''>('fadeInUp', {
    transform: (value) => value || 'fadeInUp',
  });
  readonly revealSpeed = input<RevealSpeed>('normal');
  readonly revealDelay = input(0);

  protected readonly revealed = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.revealed.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.revealed.set(true);
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -5% 0px' },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
