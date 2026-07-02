import { computed, inject, Injectable } from '@angular/core';
import { PlayerCategory } from '../models/enums/player-category.enum';
import { PlayerGender } from '../models/enums/player-gender.enum';
import { PlayerRole } from '../models/enums/player-role.enum';
import { PlayerStatus } from '../models/enums/player-status.enum';
import { Player, PlayerDraft } from '../models/player.model';
import { PlayerStore } from '../state/player.store';

@Injectable({ providedIn: 'root' })
export class PlayerFacade {
  private readonly playerStore = inject(PlayerStore);

  readonly players = this.playerStore.players;
  readonly filteredPlayers = this.playerStore.filteredPlayers;
  readonly availablePlayers = this.playerStore.availablePlayers;
  readonly unsoldPlayers = this.playerStore.unsoldPlayers;
  readonly soldPlayers = this.playerStore.soldPlayers;
  readonly searchQuery = this.playerStore.searchQuery;
  readonly roleFilter = this.playerStore.roleFilter;
  readonly genderFilter = this.playerStore.genderFilter;
  readonly statusFilter = this.playerStore.statusFilter;
  readonly categoryFilter = this.playerStore.categoryFilter;

  readonly hasPlayers = computed(() => this.playerStore.players().length > 0);

  getById(id: string): Player | undefined {
    return this.playerStore.getById(id);
  }

  /** Returns the number of players actually added (duplicates by name are skipped). */
  importPlayers(drafts: PlayerDraft[]): number {
    return this.playerStore.addPlayers(drafts);
  }

  hasPlayerNamed(name: string): boolean {
    return this.playerStore.hasPlayerNamed(name);
  }

  updatePlayer(id: string, partial: Partial<Player>): void {
    this.playerStore.updatePlayer(id, partial);
  }

  removePlayer(id: string): void {
    this.playerStore.removePlayer(id);
  }

  search(query: string): void {
    this.playerStore.setSearchQuery(query);
  }

  filterBy(filters: {
    role?: PlayerRole | null;
    gender?: PlayerGender | null;
    status?: PlayerStatus | null;
    category?: PlayerCategory | null;
  }): void {
    this.playerStore.setFilters(filters);
  }

  clearFilters(): void {
    this.playerStore.clearFilters();
  }
}
