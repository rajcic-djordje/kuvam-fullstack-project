import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDraftService {
  private readonly prefix = 'kuvam:form-draft:';

  save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(
        this.getStorageKey(key),
        JSON.stringify(value)
      );
    } catch {
      return;
    }
  }

  load<T>(key: string): T | null {
    try {
      const storedValue = localStorage.getItem(
        this.getStorageKey(key)
      );

      if (!storedValue) {
        return null;
      }

      return JSON.parse(storedValue) as T;
    } catch {
      this.clear(key);

      return null;
    }
  }

  clear(key: string): void {
    try {
      localStorage.removeItem(
        this.getStorageKey(key)
      );
    } catch {
      return;
    }
  }

  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}