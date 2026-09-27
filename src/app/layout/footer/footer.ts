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
  protected readonly year = new Date().getFullYear();

  protected readonly extraLinks: MenuLink[] = [
    { label: 'About', href: 'https://pnmc.gov.pk/about-pnmc/' },
    { label: 'Functions', href: 'https://pnmc.gov.pk/functions-of-pnmc/' },
    { label: 'Management', href: 'https://pnmc.gov.pk/management/' },
    { label: 'Statistics', href: 'https://online.pnmc.gov.pk/nursing/statistics' },
    { label: 'Check Reg', route: '/track/nursing-professional' },
    { label: 'Contact', href: 'https://pnmc.gov.pk/contact-us/' },
  ];

  protected readonly legalLinks = [
    { label: 'Terms of Service', href: 'https://pnmc.gov.pk/terms-of-service' },
    { label: 'Privacy Policy', href: 'https://pnmc.gov.pk/privacy-policy' },
  ];
}
