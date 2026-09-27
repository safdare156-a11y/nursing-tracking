import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Reveal } from '../../../../shared/directives/reveal';
import { Icon } from '../../../../shared/icon/icon';

@Component({
  selector: 'app-services',
  imports: [RouterLink, Reveal, Icon],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {}
