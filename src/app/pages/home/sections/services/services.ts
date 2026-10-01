import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Reveal } from '../../../../shared/directives/reveal';
import { Icon } from '../../../../shared/icon/icon';

@Component({
  selector: 'app-services',
  imports: [Reveal, Icon],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {}
