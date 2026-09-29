import { Injectable } from '@angular/core';
import { doc, getDoc } from 'firebase/firestore';
import { catchError, from, map, Observable, throwError } from 'rxjs';

import { firestore } from '../../firebase';
import {
  normalizeIdentifier,
  type TrackedApplication,
} from '../../shared/applications/application.service';

export class ApplicationLookupUnavailableError extends Error {
  constructor() {
    super('Application tracking is temporarily unavailable. Please try again shortly.');
  }
}

@Injectable({ providedIn: 'root' })
export class ApplicationLookup {
  track(identifier: string): Observable<TrackedApplication[]> {
    const key = normalizeIdentifier(identifier);
    return from(getDoc(doc(firestore, 'applicationLookup', key))).pipe(
      map((snapshot) =>
        snapshot.exists() ? ((snapshot.data()['applications'] ?? []) as TrackedApplication[]) : [],
      ),
      catchError(() => throwError(() => new ApplicationLookupUnavailableError())),
    );
  }
}
