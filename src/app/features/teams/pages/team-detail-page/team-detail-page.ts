import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { TeamRosterStats } from '../../../../core/state/team.store';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { TeamBadge } from '../../../../shared/components/team-badge/team-badge';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { BudgetGauge } from '../../components/budget-gauge/budget-gauge';
import { RosterTable } from '../../components/roster-table/roster-table';

@Component({
  selector: 'app-team-detail-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    GlassPanelDirective,
    TeamBadge,
    CreditPill,
    BudgetGauge,
    RosterTable,
  ],
  templateUrl: './team-detail-page.html',
  styleUrl: './team-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailPage {
  readonly teamId = input.required<string>();

  private readonly teamFacade = inject(TeamFacade);
  private readonly playerFacade = inject(PlayerFacade);

  private readonly emptyStats: TeamRosterStats = {
    boysCount: 0,
    girlsCount: 0,
    remainingPurse: 0,
    isSquadFull: false,
  };

  readonly team = computed(() => this.teamFacade.getById(this.teamId()));
  readonly stats = computed(
    () => this.teamFacade.rosterStats()[this.teamId()] ?? this.emptyStats,
  );
  readonly roster = computed(() => {
    const team = this.team();
    if (!team) return [];
    return team.playerIds
      .map((id) => this.playerFacade.getById(id))
      .filter((p): p is NonNullable<typeof p> => !!p);
  });
}
