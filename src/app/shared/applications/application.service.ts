import { Injectable } from '@angular/core';
import { collection, doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { Observable } from 'rxjs';

import { firestore } from '../../firebase';

export interface ApplicationWorkLog {
  stage: string;
  finishedAt: string;
}

/** Record returned by the public tracker. It deliberately omits the CNIC. */
export interface TrackedApplication {
  id: string;
  diaryCode: string;
  applicantName: string;
  type: string;
  status: string;
  priority: string;
  diaryDate: string;
  lastUpdatedDate: string;
  dispatchType: string;
  receiptNumber: string;
  description: string;
  receiverName: string;
  receiverFatherName: string;
  postalAddress: string;
  logs: ApplicationWorkLog[];
}

export interface ApplicationRecord extends TrackedApplication {
  cnicNumber: string;
}

export type ApplicationInput = Omit<ApplicationRecord, 'id'>;

const APPLICATIONS = 'applications';
const PUBLIC_LOOKUPS = 'applicationLookup';

/**
 * Admin records are stored privately in `applications`. Compact public lookup
 * documents are written per CNIC and diary/reference code, so tracking can use
 * direct document reads without exposing a browsable application directory.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  list(): Observable<ApplicationRecord[]> {
    return new Observable<ApplicationRecord[]>((subscriber) =>
      onSnapshot(
        collection(firestore, APPLICATIONS),
        (snapshot) => {
          const records = snapshot.docs.map(
            (record) => ({ id: record.id, ...record.data() }) as ApplicationRecord,
          );
          subscriber.next(
            records.sort((a, b) => b.lastUpdatedDate.localeCompare(a.lastUpdatedDate)),
          );
        },
        (error) => subscriber.error(error),
      ),
    );
  }

  async create(application: ApplicationInput): Promise<void> {
    const applicationRef = doc(collection(firestore, APPLICATIONS));
    await this.persist(applicationRef.id, null, application);
  }

  async update(id: string, application: ApplicationInput): Promise<void> {
    const previousSnapshot = await getDoc(doc(firestore, APPLICATIONS, id));
    if (!previousSnapshot.exists()) {
      throw new Error('The application record no longer exists. Refresh and try again.');
    }

    await this.persist(id, previousSnapshot.data() as ApplicationInput, application);
  }

  async delete(id: string): Promise<void> {
    const applicationRef = doc(firestore, APPLICATIONS, id);
    const previousSnapshot = await getDoc(applicationRef);
    if (!previousSnapshot.exists()) return;

    const previous = previousSnapshot.data() as ApplicationInput;
    const lookupEntries = await this.loadLookupEntries(lookupKeys(previous));
    const batch = writeBatch(firestore);
    batch.delete(applicationRef);

    for (const [key, records] of lookupEntries) {
      const remaining = records.filter((record) => record.id !== id);
      const lookupRef = doc(firestore, PUBLIC_LOOKUPS, key);
      if (remaining.length) {
        batch.set(lookupRef, { applications: remaining });
      } else {
        batch.delete(lookupRef);
      }
    }

    await batch.commit();
  }

  private async persist(
    id: string,
    previous: ApplicationInput | null,
    next: ApplicationInput,
  ): Promise<void> {
    const previousKeys = previous ? lookupKeys(previous) : [];
    const nextKeys = lookupKeys(next);
    const allKeys = [...new Set([...previousKeys, ...nextKeys])];
    const lookupEntries = await this.loadLookupEntries(allKeys);
    const batch = writeBatch(firestore);
    batch.set(doc(firestore, APPLICATIONS, id), next);

    for (const key of allKeys) {
      const existing = lookupEntries.get(key) ?? [];
      let records = existing.filter((record) => record.id !== id);
      if (nextKeys.includes(key)) {
        records = [...records, toTrackedApplication(id, next)];
      }

      const lookupRef = doc(firestore, PUBLIC_LOOKUPS, key);
      if (records.length) {
        batch.set(lookupRef, { applications: records });
      } else {
        batch.delete(lookupRef);
      }
    }

    await batch.commit();
  }

  private async loadLookupEntries(keys: string[]): Promise<Map<string, TrackedApplication[]>> {
    const snapshots = await Promise.all(
      keys.map(async (key) => ({
        key,
        snapshot: await getDoc(doc(firestore, PUBLIC_LOOKUPS, key)),
      })),
    );
    return new Map(
      snapshots.map(({ key, snapshot }) => [
        key,
        snapshot.exists() ? ((snapshot.data()['applications'] ?? []) as TrackedApplication[]) : [],
      ]),
    );
  }
}

function toTrackedApplication(id: string, application: ApplicationInput): TrackedApplication {
  const { cnicNumber: _cnicNumber, ...trackedApplication } = application;
  return { id, ...trackedApplication };
}

/** Both CNIC and diary/reference values work as private exact-lookups. */
function lookupKeys(application: ApplicationInput): string[] {
  return [
    ...new Set(
      [application.cnicNumber, application.diaryCode].map(normalizeIdentifier).filter(Boolean),
    ),
  ];
}

export function normalizeIdentifier(identifier: string): string {
  return identifier
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}
