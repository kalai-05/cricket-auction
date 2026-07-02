import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { PlayerCategory } from '../models/enums/player-category.enum';
import { PlayerGender } from '../models/enums/player-gender.enum';
import { PlayerRole } from '../models/enums/player-role.enum';
import { PlayerStatus } from '../models/enums/player-status.enum';
import { Player, PlayerDraft } from '../models/player.model';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { STORAGE_KEYS } from '../services/storage/storage-keys.const';
import { generateId } from '../../shared/utils/id.util';

@Injectable({ providedIn: 'root' })
export class PlayerStore {
  private readonly storage = inject(LocalStorageService);

  private readonly _players = signal<Player[]>(
    // Backfill `category` for players saved before the field existed.
    (this.storage.load<Player[]>(STORAGE_KEYS.players) ?? []).map((p) => ({
      ...p,
      category: p.category ?? PlayerCategory.B,
    })),
  );

  readonly searchQuery = signal('');
  readonly roleFilter = signal<PlayerRole | null>(null);
  readonly genderFilter = signal<PlayerGender | null>(null);
  readonly statusFilter = signal<PlayerStatus | null>(null);
  readonly categoryFilter = signal<PlayerCategory | null>(null);

  readonly players = this._players.asReadonly();

  readonly filteredPlayers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const role = this.roleFilter();
    const gender = this.genderFilter();
    const status = this.statusFilter();
    const category = this.categoryFilter();

    return this._players().filter((player) => {
      if (query && !player.name.toLowerCase().includes(query)) return false;
      if (role && player.role !== role) return false;
      if (gender && player.gender !== gender) return false;
      if (status && player.status !== status) return false;
      if (category && player.category !== category) return false;
      return true;
    });
  });

  readonly availablePlayers = computed(() =>
    this._players().filter((p) => p.status === PlayerStatus.Available),
  );

  readonly unsoldPlayers = computed(() =>
    this._players().filter((p) => p.status === PlayerStatus.Unsold),
  );

  readonly soldPlayers = computed(() =>
    this._players().filter((p) => p.status === PlayerStatus.Sold),
  );

  constructor() {
    effect(() => {
      this.storage.save(STORAGE_KEYS.players, this._players());
    });
  }

  getById(id: string): Player | undefined {
    return this._players().find((p) => p.id === id);
  }

  hasPlayerNamed(name: string): boolean {
    const normalized = name.trim().toLowerCase();
    return this._players().some((p) => p.name.trim().toLowerCase() === normalized);
  }

  /** Adds players, silently skipping duplicates by name. Returns how many were added. */
  addPlayers(drafts: PlayerDraft[]): number {
    const existingNames = new Set(this._players().map((p) => p.name.trim().toLowerCase()));
    const unique = drafts.filter((draft) => {
      const key = draft.name.trim().toLowerCase();
      if (existingNames.has(key)) return false;
      existingNames.add(key);
      return true;
    });

    const startingSerial = this._players().length + 1;
    const created: Player[] = unique.map((draft, index) => ({
      ...draft,
      id: generateId('player'),
      serialNo: startingSerial + index,
      status: PlayerStatus.Available,
      soldPrice: null,
      soldToTeamId: null,
    }));
    this._players.update((players) => [...players, ...created]);
    return created.length;
  }

  updatePlayer(id: string, partial: Partial<Player>): void {
    this._players.update((players) =>
      players.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    );
  }

  removePlayer(id: string): void {
    this._players.update((players) => players.filter((p) => p.id !== id));
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilters(filters: {
    role?: PlayerRole | null;
    gender?: PlayerGender | null;
    status?: PlayerStatus | null;
    category?: PlayerCategory | null;
  }): void {
    if ('role' in filters) this.roleFilter.set(filters.role ?? null);
    if ('gender' in filters) this.genderFilter.set(filters.gender ?? null);
    if ('status' in filters) this.statusFilter.set(filters.status ?? null);
    if ('category' in filters) this.categoryFilter.set(filters.category ?? null);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.roleFilter.set(null);
    this.genderFilter.set(null);
    this.statusFilter.set(null);
    this.categoryFilter.set(null);
  }

  resetAll(): void {
    this._players.set([]);
    this.clearFilters();
  }
}
