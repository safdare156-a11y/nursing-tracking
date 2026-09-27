import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Reveal } from '../../../../shared/directives/reveal';

@Component({
  selector: 'app-contact-cta',
  imports: [Reveal],
  templateUrl: './contact-cta.html',
  styleUrl: './contact-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCta {}
