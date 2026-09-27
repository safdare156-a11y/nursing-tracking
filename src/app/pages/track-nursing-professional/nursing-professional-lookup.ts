import { Injectable } from '@angular/core';
import { doc, getDoc } from 'firebase/firestore';
import { catchError, from, map, Observable, throwError } from 'rxjs';

import { firestore } from '../../firebase';

export interface NursingProfessional {
  fullName: string;
  nicNumber: string;
  qualifications: string[];
  speciality: string;
  registrationCategory: string;
  registrationNumber: string;
  /** ISO date, e.g. 2025-04-30 */
  initialRegistrationDate: string;
  /** ISO date, e.g. 2030-04-30 */
  licenseExpirationDate: string;
  photoUrl: string;
}

/** Raised when no verification backend is available. */
export class LookupUnavailableError extends Error {
  constructor() {
    super('Verification service is not connected yet.');
  }
}

/**
 * Looks up registered nursing professionals by NIC or passport number.
 *
 * Public verification documents are keyed by normalized NIC/passport number.
 * This permits an exact lookup without exposing a browsable nurse directory.
 */
@Injectable({ providedIn: 'root' })
export class NursingProfessionalLookup {
  /** Emits the matching professional, or `null` when there is no record. */
  track(identifier: string): Observable<NursingProfessional | null> {
    const key = normalize(identifier);
    return from(getDoc(doc(firestore, 'nurseLookup', key))).pipe(
      map((snapshot) => (snapshot.exists() ? (snapshot.data() as NursingProfessional) : null)),
      catchError(() => throwError(() => new LookupUnavailableError())),
    );
  }
}

/** NIC numbers may be typed with or without dashes. */
function normalize(identifier: string): string {
  return identifier.replace(/[\s-]/g, '').toUpperCase();
}
