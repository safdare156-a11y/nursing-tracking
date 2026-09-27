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
  protected readonly downloadingPdf = signal(false);
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

  protected printResult(): void {
    window.print();
  }

  protected async downloadPdf(): Promise<void> {
    const professional = this.professional();
    if (!professional) return;

    this.downloadingPdf.set(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
      const rows: Array<[string, string]> = [
        ['Full Name', professional.fullName],
        ['NIC Number', professional.nicNumber],
        ['Qualification', professional.qualifications.join(', ')],
        ['Speciality', professional.speciality],
        ['Registration Category', professional.registrationCategory],
        ['Registration Number', professional.registrationNumber],
        ['Initial Registration Date', professional.initialRegistrationDate],
        ['License Expiration Date', professional.licenseExpirationDate],
      ];

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('Nursing Professional Verification', 20, 22);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Pakistan Nursing & Midwifery Council', 20, 29);
      pdf.setDrawColor(39, 174, 96);
      pdf.line(20, 33, 190, 33);

      let y = 43;
      for (const [label, value] of rows) {
        const valueLines = pdf.splitTextToSize(value || 'N/A', 98);
        const rowHeight = Math.max(10, valueLines.length * 5 + 4);
        pdf.setDrawColor(220, 220, 220);
        pdf.rect(20, y, 170, rowHeight);
        pdf.line(82, y, 82, y + rowHeight);
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, 23, y + 6);
        pdf.setFont('helvetica', 'normal');
        pdf.text(valueLines, 85, y + 6);
        y += rowHeight;
      }

      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 282);
      pdf.save(`nursing-professional-${safeFilePart(professional.nicNumber)}.pdf`);
    } catch {
      this.notice.set({ type: 'info', text: 'PDF could not be generated. Please try again.' });
    } finally {
      this.downloadingPdf.set(false);
    }
  }

  private reset(): void {
    this.professional.set(null);
    this.notice.set(null);
    this.error.set('');
    this.identifier.set('');
  }
}

function safeFilePart(value: string): string {
  return value.replace(/[^a-z0-9]+/gi, '-') || 'record';
}
