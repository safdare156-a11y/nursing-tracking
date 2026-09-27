import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { firestore } from '../../firebase';

export interface NurseRecord {
  id: string;
  fullName: string;
  nicNumber: string;
  qualifications: string[];
  speciality: string;
  registrationCategory: string;
  registrationNumber: string;
  initialRegistrationDate: string;
  licenseExpirationDate: string;
  photoUrl: string;
}

export type NurseInput = Omit<NurseRecord, 'id'>;

const NURSES_COLLECTION = 'nurses';
const PUBLIC_LOOKUP_COLLECTION = 'nurseLookup';

@Injectable({ providedIn: 'root' })
export class NurseService {
  list(): Observable<NurseRecord[]> {
    const nursesQuery = query(collection(firestore, NURSES_COLLECTION), orderBy('fullName'));
    return new Observable<NurseRecord[]>((subscriber) =>
      onSnapshot(
        nursesQuery,
        (snapshot) => subscriber.next(snapshot.docs.map((record) => ({ id: record.id, ...record.data() }) as NurseRecord)),
        (error) => subscriber.error(error),
      ),
    );
  }

  async create(nurse: NurseInput): Promise<void> {
    const id = normalizeIdentifier(nurse.nicNumber);
    const nurseRef = doc(firestore, NURSES_COLLECTION, id);
    if ((await getDoc(nurseRef)).exists()) {
      throw new Error('A nurse record already exists for this NIC or passport number.');
    }

    const batch = writeBatch(firestore);
    batch.set(nurseRef, nurse);
    batch.set(doc(firestore, PUBLIC_LOOKUP_COLLECTION, id), nurse);
    await batch.commit();
  }

  async update(id: string, nurse: NurseInput): Promise<void> {
    const newId = normalizeIdentifier(nurse.nicNumber);
    const oldNurseRef = doc(firestore, NURSES_COLLECTION, id);
    const newNurseRef = doc(firestore, NURSES_COLLECTION, newId);
    if (newId !== id && (await getDoc(newNurseRef)).exists()) {
      throw new Error('A nurse record already exists for this NIC or passport number.');
    }

    const batch = writeBatch(firestore);
    if (newId !== id) {
      batch.delete(oldNurseRef);
      batch.delete(doc(firestore, PUBLIC_LOOKUP_COLLECTION, id));
    }
    batch.set(newNurseRef, nurse);
    batch.set(doc(firestore, PUBLIC_LOOKUP_COLLECTION, newId), nurse);
    await batch.commit();
  }

  async delete(id: string): Promise<void> {
    const batch = writeBatch(firestore);
    batch.delete(doc(firestore, NURSES_COLLECTION, id));
    batch.delete(doc(firestore, PUBLIC_LOOKUP_COLLECTION, id));
    await batch.commit();
  }

  /** Creates public exact-lookup documents for nurse records added before the lookup was introduced. */
  async syncPublicLookups(nurses: NurseRecord[]): Promise<void> {
    // A Firestore batch may contain at most 500 writes; keep a small margin.
    for (let start = 0; start < nurses.length; start += 400) {
      const batch = writeBatch(firestore);
      for (const record of nurses.slice(start, start + 400)) {
        const { id: _id, ...nurse } = record;
        batch.set(doc(firestore, PUBLIC_LOOKUP_COLLECTION, normalizeIdentifier(nurse.nicNumber)), nurse);
      }
      await batch.commit();
    }
  }
}

/** NIC numbers are stored without dashes; passports may contain letters. */
function normalizeIdentifier(identifier: string): string {
  return identifier.trim().replace(/[\s-]/g, '').toUpperCase();
}
