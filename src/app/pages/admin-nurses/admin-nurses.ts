import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AdminAuthService } from '../../shared/auth/admin-auth.service';
import { NurseService, type NurseInput, type NurseRecord } from '../../shared/nurses/nurse.service';

const PAGE_SIZE = 8;
const EMPTY_PHOTO = 'images/portal/dummy-photo.svg';

@Component({
  selector: 'app-admin-nurses',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-nurses.html',
  styleUrl: './admin-nurses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNurses {
  private readonly nurseService = inject(NurseService);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly loadError = signal('');
  protected readonly nurses = toSignal(
    this.nurseService.list().pipe(
      catchError(() => {
        this.loadError.set('Records could not be loaded. Check your Firebase Firestore rules.');
        return of([] as NurseRecord[]);
      }),
    ),
    { initialValue: [] as NurseRecord[] },
  );
  protected readonly page = signal(1);
  protected readonly editingId = signal<string | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly syncing = signal(false);
  protected readonly error = signal('');
  protected readonly notice = signal('');

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.nurses().length / PAGE_SIZE)),
  );
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index + 1),
  );
  protected readonly paginatedNurses = computed(() => {
    const page = Math.min(this.page(), this.pageCount());
    return this.nurses().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  });

  protected readonly form = this.formBuilder.group({
    fullName: ['', Validators.required],
    nicNumber: ['', Validators.required],
    qualifications: ['', Validators.required],
    speciality: ['NA', Validators.required],
    registrationCategory: ['', Validators.required],
    registrationNumber: ['', Validators.required],
    initialRegistrationDate: ['', Validators.required],
    licenseExpirationDate: ['', Validators.required],
    photoUrl: [''],
  });

  protected startCreate(): void {
    this.editingId.set(null);
    this.form.reset({
      fullName: '',
      nicNumber: '',
      qualifications: '',
      speciality: 'NA',
      registrationCategory: '',
      registrationNumber: '',
      initialRegistrationDate: '',
      licenseExpirationDate: '',
      photoUrl: '',
    });
    this.error.set('');
    this.formOpen.set(true);
  }

  protected startEdit(nurse: NurseRecord): void {
    this.editingId.set(nurse.id);
    this.form.reset({
      fullName: nurse.fullName,
      nicNumber: nurse.nicNumber,
      qualifications: nurse.qualifications.join(', '),
      speciality: nurse.speciality,
      registrationCategory: nurse.registrationCategory,
      registrationNumber: nurse.registrationNumber,
      initialRegistrationDate: nurse.initialRegistrationDate,
      licenseExpirationDate: nurse.licenseExpirationDate,
      photoUrl: nurse.photoUrl === EMPTY_PHOTO ? '' : nurse.photoUrl,
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
      this.error.set('Please complete every required field.');
      return;
    }

    const values = this.form.getRawValue();
    const nurse: NurseInput = {
      ...values,
      qualifications: values.qualifications
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      photoUrl: values.photoUrl.trim() || EMPTY_PHOTO,
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        await this.nurseService.update(id, nurse);
        this.notice.set('Nurse record updated successfully.');
      } else {
        await this.nurseService.create(nurse);
        this.notice.set('Nurse record created successfully.');
      }
      this.formOpen.set(false);
    } catch {
      this.error.set(
        'Record could not be saved. Check your Firebase Firestore rules and try again.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  protected async remove(nurse: NurseRecord): Promise<void> {
    if (!confirm(`Delete ${nurse.fullName}'s record?`)) return;

    this.error.set('');
    try {
      await this.nurseService.delete(nurse.id);
      this.notice.set('Nurse record deleted.');
      if (this.page() > this.pageCount()) this.page.set(this.pageCount());
    } catch {
      this.error.set(
        'Record could not be deleted. Check your Firebase Firestore rules and try again.',
      );
    }
  }

  protected goToPage(page: number): void {
    this.page.set(Math.max(1, Math.min(page, this.pageCount())));
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/admin/login']);
  }

  protected async syncTrackingData(): Promise<void> {
    this.error.set('');
    this.notice.set('');
    this.syncing.set(true);
    try {
      await this.nurseService.syncPublicLookups(this.nurses());
      this.notice.set('Tracking data has been synced. NIC and passport lookups are now available.');
    } catch {
      this.error.set(
        'Tracking data could not be synced. Check your Firebase Firestore rules and try again.',
      );
    } finally {
      this.syncing.set(false);
    }
  }
}
