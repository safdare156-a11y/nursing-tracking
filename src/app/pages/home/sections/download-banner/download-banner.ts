import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Reveal } from '../../../../shared/directives/reveal';

@Component({
  selector: 'app-download-banner',
  imports: [Reveal],
  templateUrl: './download-banner.html',
  styleUrl: './download-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadBanner {}
