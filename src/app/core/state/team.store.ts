import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { PlayerGender } from '../models/enums/player-gender.enum';
import { Team, TeamDraft } from '../models/team.model';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { STORAGE_KEYS } from '../services/storage/storage-keys.const';
import { generateId } from '../../shared/utils/id.util';
import { PlayerStore } from './player.store';
import { SettingsStore } from './settings.store';

export interface TeamRosterStats {
  boysCount: number;
  girlsCount: number;
  remainingPurse: number;
  isSquadFull: boolean;
}

@Injectable({ providedIn: 'root' })
export class TeamStore {
  private readonly storage = inject(LocalStorageService);
  private readonly playerStore = inject(PlayerStore);
  private readonly settingsStore = inject(SettingsStore);

  private readonly _teams = signal<Team[]>(this.storage.load<Team[]>(STORAGE_KEYS.teams) ?? []);

  readonly teams = this._teams.asReadonly();

  readonly rosterStats = computed<Record<string, TeamRosterStats>>(() => {
    const players = this.playerStore.players();
    const stats: Record<string, TeamRosterStats> = {};

    for (const team of this._teams()) {
      const ids = new Set(team.playerIds);
      const roster = players.filter((p) => ids.has(p.id));
      const boysCount = roster.filter((p) => p.gender === PlayerGender.Boy).length;
      const girlsCount = roster.filter((p) => p.gender === PlayerGender.Girl).length;
      const remainingPurse = Math.round((team.totalPurse - team.spentPurse) * 100) / 100;

      stats[team.id] = {
        boysCount,
        girlsCount,
        remainingPurse,
        isSquadFull: boysCount >= team.maxBoys && girlsCount >= team.maxGirls,
      };
    }

    return stats;
  });

  readonly teamsSortedBySpend = computed(() =>
    [...this._teams()].sort((a, b) => b.spentPurse - a.spentPurse),
  );

  constructor() {
    effect(() => {
      this.storage.save(STORAGE_KEYS.teams, this._teams());
    });
  }

  getById(id: string): Team | undefined {
    return this._teams().find((t) => t.id === id);
  }

  createTeams(drafts: TeamDraft[]): void {
    const settings = this.settingsStore.settings();
    const teams: Team[] = drafts.map((draft) => ({
      ...draft,
      id: generateId('team'),
      totalPurse: settings.totalCreditsPerTeam,
      spentPurse: 0,
      maxBoys: settings.maxBoys,
      maxGirls: settings.maxGirls,
      playerIds: [],
    }));
    this._teams.set(teams);
  }

  updateTeam(id: string, partial: Partial<Pick<Team, 'name' | 'shortCode' | 'colorHex' | 'logoUrl'>>): void {
    this._teams.update((teams) => teams.map((t) => (t.id === id ? { ...t, ...partial } : t)));
  }

  assignPlayer(teamId: string, playerId: string, price: number): void {
    this._teams.update((teams) =>
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              playerIds: [...t.playerIds, playerId],
              spentPurse: Math.round((t.spentPurse + price) * 100) / 100,
            }
          : t,
      ),
    );
  }

  unassignPlayer(teamId: string, playerId: string, price: number): void {
    this._teams.update((teams) =>
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              playerIds: t.playerIds.filter((id) => id !== playerId),
              spentPurse: Math.round((t.spentPurse - price) * 100) / 100,
            }
          : t,
      ),
    );
  }

  /** Clears every team's roster and spend, keeping identity (name/color/logo). */
  resetRosters(): void {
    this._teams.update((teams) => teams.map((t) => ({ ...t, playerIds: [], spentPurse: 0 })));
  }

  resetAll(): void {
    this._teams.set([]);
  }
}
