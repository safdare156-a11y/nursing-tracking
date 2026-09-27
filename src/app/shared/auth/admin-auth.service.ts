import { Injectable, computed, signal } from '@angular/core';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import { firebaseAuth } from '../../firebase';

export const ADMIN_EMAIL = 'admin@gmail.com';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly user = signal<User | null>(null);

  readonly isAdmin = computed(() => this.user()?.email?.toLowerCase() === ADMIN_EMAIL);

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => this.user.set(user));
  }

  async login(email: string, password: string): Promise<void> {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      throw new Error('Only the authorised administrator account can sign in.');
    }

    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    if (credential.user.email?.toLowerCase() !== ADMIN_EMAIL) {
      await signOut(firebaseAuth);
      throw new Error('Only the authorised administrator account can sign in.');
    }
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  }

  /** Resolves after Firebase has restored the existing sign-in session. */
  waitForAdmin(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        unsubscribe();
        resolve(user?.email?.toLowerCase() === ADMIN_EMAIL);
      });
    });
  }
}
