import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CountUp } from '../../../../shared/directives/count-up';
import { Reveal } from '../../../../shared/directives/reveal';

@Component({
  selector: 'app-introduction',
  imports: [CountUp, Reveal],
  templateUrl: './introduction.html',
  styleUrl: './introduction.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Introduction {}
