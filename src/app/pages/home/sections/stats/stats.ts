import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CountUp } from '../../../../shared/directives/count-up';
import { Reveal } from '../../../../shared/directives/reveal';

@Component({
  selector: 'app-stats',
  imports: [CountUp, Reveal],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stats {
  protected readonly stats = [
    { label: 'Registered Nurses', value: 107643, suffix: '' },
    { label: 'Students', value: 35000, suffix: '+' },
    { label: 'Nursing Institutes', value: 369, suffix: '' },
  ];
}
