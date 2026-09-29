import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { TrackedApplication } from '../../shared/applications/application.service';
import { ApplicationLookup, ApplicationLookupUnavailableError } from './application-lookup';

@Component({
  selector: 'app-track-application',
  imports: [RouterLink],
  templateUrl: './track-application.html',
  styleUrl: './track-application.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackApplication {
  private readonly lookup = inject(ApplicationLookup);

  protected readonly cnic = signal('');
  protected readonly reference = signal('');
  protected readonly error = signal('');
  protected readonly results = signal<TrackedApplication[] | null>(null);
  protected readonly selectedApplication = signal<TrackedApplication | null>(null);
  protected readonly searching = signal(false);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.error.set('');

    const identifier = this.cnic().trim() || this.reference().trim();
    if (!identifier) {
      this.error.set('Please enter your CNIC number or complete reference/token number.');
      return;
    }

    this.searching.set(true);
    this.lookup.track(identifier).subscribe({
      next: (applications) => {
        this.searching.set(false);
        this.results.set(applications);
      },
      error: (error: unknown) => {
        this.searching.set(false);
        this.error.set(
          error instanceof ApplicationLookupUnavailableError
            ? error.message
            : 'Application tracking is temporarily unavailable. Please try again shortly.',
        );
      },
    });
  }

  protected openDetails(application: TrackedApplication): void {
    this.selectedApplication.set(application);
  }

  protected closeDetails(): void {
    this.selectedApplication.set(null);
  }

  protected resetSearch(): void {
    this.results.set(null);
    this.selectedApplication.set(null);
    this.error.set('');
  }
}
