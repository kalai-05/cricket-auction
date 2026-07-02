import { computed, inject, Injectable } from '@angular/core';
import { Team, TeamDraft } from '../models/team.model';
import { SettingsStore } from '../state/settings.store';
import { TeamStore } from '../state/team.store';

@Injectable({ providedIn: 'root' })
export class TeamFacade {
  private readonly teamStore = inject(TeamStore);
  private readonly settingsStore = inject(SettingsStore);

  readonly teams = this.teamStore.teams;
  readonly rosterStats = this.teamStore.rosterStats;
  readonly teamsSortedBySpend = this.teamStore.teamsSortedBySpend;

  readonly isSetupComplete = computed(
    () => this.teamStore.teams().length === this.settingsStore.settings().teamCount,
  );

  getById(id: string): Team | undefined {
    return this.teamStore.getById(id);
  }

  createTeams(drafts: TeamDraft[]): void {
    this.teamStore.createTeams(drafts);
  }

  updateTeam(id: string, partial: Partial<Pick<Team, 'name' | 'shortCode' | 'colorHex' | 'logoUrl'>>): void {
    this.teamStore.updateTeam(id, partial);
  }
}
