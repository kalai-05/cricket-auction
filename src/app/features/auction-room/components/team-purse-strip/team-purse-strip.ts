import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { TeamBadge } from '../../../../shared/components/team-badge/team-badge';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import {
  TeamDetailDialog,
  TeamDetailDialogData,
} from '../../../teams/components/team-detail-dialog/team-detail-dialog';

@Component({
  selector: 'app-team-purse-strip',
  imports: [GlassPanelDirective, TeamBadge, CreditPill],
  templateUrl: './team-purse-strip.html',
  styleUrl: './team-purse-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPurseStrip {
  readonly teamFacade = inject(TeamFacade);
  readonly auctionFacade = inject(AuctionFacade);
  private readonly dialog = inject(MatDialog);

  openTeamDetail(teamId: string): void {
    this.dialog.open<TeamDetailDialog, TeamDetailDialogData>(TeamDetailDialog, {
      data: { teamId },
    });
  }
}
