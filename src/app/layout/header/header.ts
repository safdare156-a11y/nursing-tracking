import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Icon } from '../../shared/icon/icon';
import { MAIN_MENU, SOCIAL_LINKS } from './menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class Header {
  private static readonly publicSite = 'https://pnmc.org.pk/';

  protected readonly menu = MAIN_MENU;
  protected readonly socialLinks = SOCIAL_LINKS;

  /** Off-canvas menu state (tablet and mobile only). */
  protected readonly menuOpen = signal(false);
  /** Label of the submenu expanded inside the off-canvas menu. */
  protected readonly openSubmenu = signal<string | null>(null);

  protected toggleSubmenu(label: string): void {
    this.openSubmenu.update((current) => (current === label ? null : label));
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.openSubmenu.set(null);
  }

  /** Public-content pages are intentionally displayed without outbound navigation. */
  protected isDisabledPublicPageLink(href: string | undefined): boolean {
    return href?.startsWith(Header.publicSite) ?? false;
  }
}
