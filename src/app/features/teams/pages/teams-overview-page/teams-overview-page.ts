import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { TeamBadge } from '../../../../shared/components/team-badge/team-badge';
import { BudgetGauge } from '../../components/budget-gauge/budget-gauge';

@Component({
  selector: 'app-teams-overview-page',
  imports: [RouterLink, GlassPanelDirective, TeamBadge, BudgetGauge],
  templateUrl: './teams-overview-page.html',
  styleUrl: './teams-overview-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsOverviewPage {
  readonly teamFacade = inject(TeamFacade);
}
