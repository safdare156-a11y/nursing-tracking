import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { AdminAuthService } from '../../shared/auth/admin-auth.service';
import {
  ApplicationService,
  type ApplicationInput,
  type ApplicationRecord,
  type ApplicationWorkLog,
} from '../../shared/applications/application.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-applications',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-applications.html',
  styleUrl: './admin-applications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminApplications {
  private static readonly portalUrl = 'https://online.pnmc.org.pk';

  private readonly applicationService = inject(ApplicationService);
  private readonly auth = inject(AdminAuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly loadError = signal('');
  protected readonly applications = toSignal(
    this.applicationService.list().pipe(
      catchError(() => {
        this.loadError.set(
          'Applications could not be loaded. Check your Firebase Firestore rules.',
        );
        return of([] as ApplicationRecord[]);
      }),
    ),
    { initialValue: [] as ApplicationRecord[] },
  );
  protected readonly page = signal(1);
  protected readonly editingId = signal<string | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly notice = signal('');

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.applications().length / PAGE_SIZE)),
  );
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index + 1),
  );
  protected readonly paginatedApplications = computed(() => {
    const page = Math.min(this.page(), this.pageCount());
    return this.applications().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  });

  protected readonly form = this.formBuilder.group({
    cnicNumber: ['', Validators.required],
    diaryCode: ['', Validators.required],
    applicantName: ['', Validators.required],
    type: ['', Validators.required],
    status: ['Pending', Validators.required],
    priority: [''],
    diaryDate: [''],
    lastUpdatedDate: [''],
    dispatchType: [''],
    receiptNumber: [''],
    description: [''],
    receiverName: [''],
    receiverFatherName: [''],
    postalAddress: [''],
    workLogs: [''],
  });

  protected startCreate(): void {
    this.editingId.set(null);
    this.form.reset(emptyForm());
    this.error.set('');
    this.formOpen.set(true);
  }

  protected startEdit(application: ApplicationRecord): void {
    this.editingId.set(application.id);
    this.form.reset({
      cnicNumber: application.cnicNumber,
      diaryCode: application.diaryCode,
      applicantName: application.applicantName,
      type: application.type,
      status: application.status,
      priority: application.priority,
      diaryDate: toDateTimeInput(application.diaryDate),
      lastUpdatedDate: toDateTimeInput(application.lastUpdatedDate),
      dispatchType: application.dispatchType,
      receiptNumber: application.receiptNumber,
      description: application.description,
      receiverName: application.receiverName,
      receiverFatherName: application.receiverFatherName,
      postalAddress: application.postalAddress,
      workLogs: application.logs.map((log) => `${log.stage} | ${log.finishedAt}`).join('\n'),
    });
    this.error.set('');
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    if (!this.saving()) this.formOpen.set(false);
  }

  protected async save(): Promise<void> {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(
        'CNIC, diary/reference code, applicant name, application type and status are required.',
      );
      return;
    }

    const values = this.form.getRawValue();
    const application: ApplicationInput = {
      cnicNumber: values.cnicNumber.trim(),
      diaryCode: values.diaryCode.trim(),
      applicantName: values.applicantName.trim(),
      type: values.type.trim(),
      status: values.status.trim(),
      priority: values.priority.trim(),
      diaryDate: formatDateTime(values.diaryDate),
      lastUpdatedDate: formatDateTime(values.lastUpdatedDate),
      dispatchType: values.dispatchType.trim(),
      receiptNumber: values.receiptNumber.trim(),
      description: values.description.trim(),
      receiverName: values.receiverName.trim(),
      receiverFatherName: values.receiverFatherName.trim(),
      postalAddress: values.postalAddress.trim(),
      logs: parseWorkLogs(values.workLogs),
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        await this.applicationService.update(id, application);
        this.notice.set('Application updated. The public tracking result is now up to date.');
      } else {
        await this.applicationService.create(application);
        this.notice.set(
          'Application created. It can now be tracked by CNIC or diary/reference code.',
        );
      }
      this.formOpen.set(false);
    } catch (error: unknown) {
      this.error.set(
        error instanceof Error
          ? error.message
          : 'Application could not be saved. Check your Firebase Firestore rules and try again.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected async remove(application: ApplicationRecord): Promise<void> {
    if (!confirm(`Delete application ${application.diaryCode}?`)) return;

    this.error.set('');
    try {
      await this.applicationService.delete(application.id);
      this.notice.set('Application deleted. It is no longer visible in public tracking.');
      if (this.page() > this.pageCount()) this.page.set(this.pageCount());
    } catch {
      this.error.set(
        'Application could not be deleted. Check your Firebase Firestore rules and try again.',
      );
    }
  }

  protected goToPage(page: number): void {
    this.page.set(Math.max(1, Math.min(page, this.pageCount())));
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    window.location.href = `${AdminApplications.portalUrl}/admin/login`;
  }
}

function emptyForm() {
  return {
    cnicNumber: '',
    diaryCode: '',
    applicantName: '',
    type: '',
    status: 'Pending',
    priority: '',
    diaryDate: '',
    lastUpdatedDate: '',
    dispatchType: '',
    receiptNumber: '',
    description: '',
    receiverName: '',
    receiverFatherName: '',
    postalAddress: '',
    workLogs: '',
  };
}

function parseWorkLogs(value: string): ApplicationWorkLog[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf('|');
      return separator === -1
        ? { stage: line, finishedAt: '' }
        : { stage: line.slice(0, separator).trim(), finishedAt: line.slice(separator + 1).trim() };
    })
    .filter((log) => log.stage);
}

/** Converts a native datetime-local value into the format used in tracking details. */
function formatDateTime(value: string): string {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const hours = date.getHours();
  const hour = hours % 12 || 12;
  const suffix = hours < 12 ? 'AM' : 'PM';
  const twoDigits = (number: number) => String(number).padStart(2, '0');

  return `${twoDigits(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} ${twoDigits(hour)}:${twoDigits(date.getMinutes())}:${twoDigits(date.getSeconds())} ${suffix}`;
}

/** Accepts both newly stored values and pre-existing text dates when editing. */
function toDateTimeInput(value: string): string {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const twoDigits = (number: number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}T${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}:${twoDigits(date.getSeconds())}`;
}
