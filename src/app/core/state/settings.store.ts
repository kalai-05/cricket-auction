import { effect, inject, Injectable, signal } from '@angular/core';
import { AuctionSettings, DEFAULT_AUCTION_SETTINGS } from '../models/auction-settings.model';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { STORAGE_KEYS } from '../services/storage/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly storage = inject(LocalStorageService);

  // Merge over defaults so settings saved by an older schema gain new fields.
  private readonly _settings = signal<AuctionSettings>({
    ...DEFAULT_AUCTION_SETTINGS,
    ...(this.storage.load<Partial<AuctionSettings>>(STORAGE_KEYS.settings) ?? {}),
    schemaVersion: DEFAULT_AUCTION_SETTINGS.schemaVersion,
  });

  readonly settings = this._settings.asReadonly();

  constructor() {
    effect(() => {
      this.storage.save(STORAGE_KEYS.settings, this._settings());
    });
  }

  update(partial: Partial<AuctionSettings>): void {
    this._settings.update((current) => ({ ...current, ...partial }));
  }

  reset(): void {
    this._settings.set(DEFAULT_AUCTION_SETTINGS);
  }
}
