import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Reveal } from '../../../../shared/directives/reveal';

@Component({
  selector: 'app-hero',
  imports: [Reveal],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
