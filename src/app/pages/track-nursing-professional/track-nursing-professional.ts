import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

import {
  LookupUnavailableError,
  NursingProfessional,
  NursingProfessionalLookup,
} from './nursing-professional-lookup';

interface Notice {
  type: 'info' | 'danger';
  text: string;
}

/** "Track and Trace - Nursing Professional" page of the PNMC portal. */
@Component({
  selector: 'app-track-nursing-professional',
  imports: [DatePipe, RouterLink],
  templateUrl: './track-nursing-professional.html',
  styleUrl: './track-nursing-professional.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackNursingProfessional {
  private readonly lookup = inject(NursingProfessionalLookup);

  protected readonly identifier = signal('');
  protected readonly error = signal('');
  protected readonly notice = signal<Notice | null>(null);
  protected readonly searching = signal(false);
  /** Search result; while set, it replaces the form (same URL, like the original). */
  protected readonly professional = signal<NursingProfessional | null>(null);

  constructor() {
    // Following a link to this page again (breadcrumb, navbar) brings back the search form.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.reset());
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.notice.set(null);

    const identifier = this.identifier().trim();
    if (!identifier) {
      this.error.set('This value should not be blank.');
      return;
    }

    this.error.set('');
    this.searching.set(true);
    this.lookup.track(identifier).subscribe({
      next: (professional) => {
        this.searching.set(false);
        if (professional) {
          this.professional.set(professional);
        } else {
          this.notice.set({
            type: 'danger',
            text: 'No record found against this NIC or Passport number.',
          });
        }
      },
      error: (err: unknown) => {
        this.searching.set(false);
        this.notice.set({
          type: 'info',
          text:
            err instanceof LookupUnavailableError
              ? err.message
              : 'Something went wrong. Please try again.',
        });
      },
    });
  }

  private reset(): void {
    this.professional.set(null);
    this.notice.set(null);
    this.error.set('');
    this.identifier.set('');
  }
}
