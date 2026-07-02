import { Injectable } from '@angular/core';

const NAMESPACE = 'ipl-auction';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private key(name: string): string {
    return `${NAMESPACE}:${name}`;
  }

  load<T>(name: string): T | null {
    try {
      const raw = localStorage.getItem(this.key(name));
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  save<T>(name: string, value: T): void {
    try {
      localStorage.setItem(this.key(name), JSON.stringify(value));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently,
      // the in-memory signal state remains authoritative for this session.
    }
  }

  remove(name: string): void {
    localStorage.removeItem(this.key(name));
  }

  resetAll(names: string[]): void {
    names.forEach((name) => this.remove(name));
  }

  dumpAll(names: string[]): Record<string, unknown> {
    const dump: Record<string, unknown> = {};
    for (const name of names) {
      const value = this.load(name);
      if (value !== null) {
        dump[name] = value;
      }
    }
    return dump;
  }

  restoreAll(dump: Record<string, unknown>): void {
    for (const [name, value] of Object.entries(dump)) {
      this.save(name, value);
    }
  }
}
