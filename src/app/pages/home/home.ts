import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactCta } from './sections/contact-cta/contact-cta';
import { DownloadBanner } from './sections/download-banner/download-banner';
import { Features } from './sections/features/features';
import { Hero } from './sections/hero/hero';
import { Introduction } from './sections/introduction/introduction';
import { News } from './sections/news/news';
import { NewsTicker } from './sections/news-ticker/news-ticker';
import { Services } from './sections/services/services';
import { Stats } from './sections/stats/stats';

@Component({
  selector: 'app-home',
  imports: [
    NewsTicker,
    Hero,
    Features,
    News,
    DownloadBanner,
    Services,
    Stats,
    Introduction,
    ContactCta,
  ],
  template: `
    <app-news-ticker />
    <app-hero />
    <app-features />
    <app-news />
    <app-download-banner />
    <app-services />
    <app-stats />
    <app-introduction />
    <app-contact-cta />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
