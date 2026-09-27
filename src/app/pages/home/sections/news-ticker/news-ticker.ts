import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NEWS_POSTS } from '../../news';

/** Scrolling headline strip shown between the navigation and the hero. */
@Component({
  selector: 'app-news-ticker',
  templateUrl: './news-ticker.html',
  styleUrl: './news-ticker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsTicker {
  protected readonly latest = NEWS_POSTS[0];
}
