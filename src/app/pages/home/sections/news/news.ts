import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Reveal } from '../../../../shared/directives/reveal';
import { Icon } from '../../../../shared/icon/icon';
import { NEWS_POSTS } from '../../news';

@Component({
  selector: 'app-news',
  imports: [Reveal, Icon],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class News {
  protected readonly featured = NEWS_POSTS[0];
  protected readonly recent = NEWS_POSTS.slice(1);
}
