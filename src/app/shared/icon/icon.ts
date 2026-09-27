import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ICONS, IconName } from './icons';

/** Renders one of the site's inline SVG icons; it inherits `color` via `fill: currentColor`. */
@Component({
  selector: 'app-icon',
  template: `
    <svg [attr.viewBox]="icon().viewBox" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      @for (d of icon().paths; track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 1em;
      height: 1em;
      line-height: 1;
    }

    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();

  protected readonly icon = computed(() => ICONS[this.name()]);
}
