import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../shared/icon/icon';
import { MenuLink } from '../header/menu';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private static readonly publicSite = 'https://pnmc.org.pk/';

  protected readonly year = new Date().getFullYear();

  protected readonly extraLinks: MenuLink[] = [
    { label: 'About', href: 'https://pnmc.org.pk/about-pnmc/' },
    { label: 'Functions', href: 'https://pnmc.org.pk/functions-of-pnmc/' },
    { label: 'Management', href: 'https://pnmc.org.pk/management/' },
    { label: 'Statistics', href: 'https://online.pnmc.org.pk/nursing/statistics' },
    { label: 'Check Reg', href: 'https://online.pnmc.org.pk/track/nursing-professional' },
    { label: 'Contact', href: 'https://pnmc.org.pk/contact-us/' },
  ];

  protected readonly legalLinks = [
    { label: 'Terms of Service', href: 'https://pnmc.org.pk/terms-of-service' },
    { label: 'Privacy Policy', href: 'https://pnmc.org.pk/privacy-policy' },
  ];

  /** Public-content pages are intentionally displayed without outbound navigation. */
  protected isDisabledPublicPageLink(href: string | undefined): boolean {
    return href?.startsWith(Footer.publicSite) ?? false;
  }
}
