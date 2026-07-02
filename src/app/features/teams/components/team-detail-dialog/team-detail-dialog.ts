import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { TeamBadge } from '../../../../shared/components/team-badge/team-badge';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { RosterTable } from '../roster-table/roster-table';

export interface TeamDetailDialogData {
  teamId: string;
}

@Component({
  selector: 'app-team-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, TeamBadge, CreditPill, RosterTable],
  templateUrl: './team-detail-dialog.html',
  styleUrl: './team-detail-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailDialog {
  private readonly data = inject<TeamDetailDialogData>(MAT_DIALOG_DATA);
  private readonly teamFacade = inject(TeamFacade);
  private readonly playerFacade = inject(PlayerFacade);

  readonly team = computed(() => this.teamFacade.getById(this.data.teamId));
  readonly stats = computed(() => this.teamFacade.rosterStats()[this.data.teamId]);

  readonly roster = computed(() => {
    const team = this.team();
    if (!team) return [];
    return team.playerIds
      .map((id) => this.playerFacade.getById(id))
      .filter((p): p is NonNullable<typeof p> => !!p);
  });

  readonly averageCost = computed(() => {
    const team = this.team();
    if (!team || team.playerIds.length === 0) return 0;
    return Math.round((team.spentPurse / team.playerIds.length) * 100) / 100;
  });
}
