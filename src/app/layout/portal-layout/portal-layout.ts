import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

interface PortalLink {
  label: string;
  href?: string;
  route?: string;
}

const PORTAL = 'https://online.pnmc.gov.pk';

/** Shell for pages of the online.pnmc.gov.pk portal (own header, gradient navbar and footer). */
@Component({
  selector: 'app-portal-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './portal-layout.html',
  styleUrl: './portal-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeServicesOnOutsideClick($event)',
    '(document:keydown.escape)': 'servicesOpen.set(false)',
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class PortalLayout {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly year = new Date().getFullYear();

  /** Past 40px of scroll the small logo fades into the navbar. */
  protected readonly scrolled = signal(false);
  /** Navbar is pinned to the top once the logo bar has scrolled away. */
  protected readonly affixed = signal(false);

  constructor() {
    afterNextRender(() => this.onWindowScroll());
  }

  /** Collapsed navbar on phones. */
  protected readonly menuOpen = signal(false);
  /** "PNMC's Online Services" dropdown (it also opens on hover on desktop). */
  protected readonly servicesOpen = signal(false);

  /** Dropdown entries; a divider is drawn between groups. */
  protected readonly serviceGroups: PortalLink[][] = [
    [
      { label: 'Apply For a Licence Online', href: `${PORTAL}/nuser/applicant/apply-online` },
      { label: 'Renew a license Online', href: `${PORTAL}/nuser/applicant/apply-online` },
      { label: 'Apply For a Duplicate License', href: `${PORTAL}/nuser/applicant/apply-online` },
      { label: 'Online License Verification', href: `${PORTAL}/nuser/applicant/apply-online` },
      {
        label: 'Institute Pre Registration',
        href: `${PORTAL}/institute/institute/pre-registration`,
      },
    ],
    [
      { label: 'Check Application Status', route: '/track-your-application' },
      { label: 'Track Nursing Professionals', route: '/track/nursing-professional' },
      { label: 'Nursing Council Licensing Examination' },
    ],
    [
      { label: 'Requirements and Procedure', href: `${PORTAL}/requirement-procedures` },
      { label: 'Guides', href: `${PORTAL}/guide` },
    ],
  ];

  protected closeServicesOnOutsideClick(event: MouseEvent): void {
    const dropdown = this.host.nativeElement.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.servicesOpen.set(false);
    }
  }

  /** Same thresholds as the original portal's custom.js. */
  protected onWindowScroll(): void {
    const scrollTop = window.scrollY;
    this.scrolled.set(scrollTop > 40);

    // Bootstrap affix offset: $('header').height() - $('#nav').height()
    const header = this.host.nativeElement.querySelector<HTMLElement>('.portal-header');
    const nav = this.host.nativeElement.querySelector<HTMLElement>('.portal-nav');
    if (header && nav) {
      this.affixed.set(scrollTop > contentHeight(header) - contentHeight(nav));
    }
  }

  protected closeMenus(): void {
    this.menuOpen.set(false);
    this.servicesOpen.set(false);
  }
}

/** Height without padding, like jQuery's `.height()`. */
function contentHeight(element: HTMLElement): number {
  const style = getComputedStyle(element);
  return element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
}
