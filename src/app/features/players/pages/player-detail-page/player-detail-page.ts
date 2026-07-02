import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { PLAYER_GENDER_LABELS } from '../../../../core/models/enums/player-gender.enum';
import { PLAYER_ROLE_LABELS } from '../../../../core/models/enums/player-role.enum';
import { PlayerStatus } from '../../../../core/models/enums/player-status.enum';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { PlayerAvatar } from '../../../../shared/components/player-avatar/player-avatar';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { TeamBadge } from '../../../../shared/components/team-badge/team-badge';

@Component({
  selector: 'app-player-detail-page',
  imports: [RouterLink, MatIconModule, GlassPanelDirective, PlayerAvatar, CreditPill, TeamBadge],
  templateUrl: './player-detail-page.html',
  styleUrl: './player-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailPage {
  readonly playerId = input.required<string>();

  private readonly playerFacade = inject(PlayerFacade);
  private readonly teamFacade = inject(TeamFacade);
  private readonly auctionFacade = inject(AuctionFacade);

  readonly PlayerStatus = PlayerStatus;
  readonly roleLabels = PLAYER_ROLE_LABELS;
  readonly genderLabels = PLAYER_GENDER_LABELS;
  readonly stars = [1, 2, 3, 4, 5];

  readonly player = computed(() => this.playerFacade.getById(this.playerId()));

  readonly soldToTeam = computed(() => {
    const teamId = this.player()?.soldToTeamId;
    return teamId ? this.teamFacade.getById(teamId) : undefined;
  });

  readonly isCurrentlyOnBlock = computed(
    () => this.auctionFacade.currentPlayer()?.id === this.playerId(),
  );

  readonly liveBidTrail = computed(() =>
    this.isCurrentlyOnBlock() ? this.auctionFacade.currentBidTrail() : [],
  );

  teamName(teamId: string): string {
    return this.teamFacade.getById(teamId)?.name ?? 'Unknown';
  }
}
