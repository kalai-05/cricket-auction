import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { PlayerAvatar } from '../../../../shared/components/player-avatar/player-avatar';
import { CreditsPipe } from '../../../../shared/pipes/credits.pipe';

interface RecentEntry {
  id: string;
  playerName: string;
  teamName: string | null;
  price: number | null;
  wasUnsold: boolean;
}

@Component({
  selector: 'app-auction-sidebar',
  imports: [MatIconModule, GlassPanelDirective, PlayerAvatar, CreditsPipe],
  templateUrl: './auction-sidebar.html',
  styleUrl: './auction-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionSidebar {
  readonly auctionFacade = inject(AuctionFacade);
  private readonly playerFacade = inject(PlayerFacade);
  private readonly teamFacade = inject(TeamFacade);

  readonly recentResults = computed<RecentEntry[]>(() =>
    [...this.auctionFacade.soldLog()]
      .slice(-6)
      .reverse()
      .map((record) => ({
        id: record.id,
        playerName: this.playerFacade.getById(record.playerId)?.name ?? 'Unknown',
        teamName: record.teamId ? (this.teamFacade.getById(record.teamId)?.name ?? null) : null,
        price: record.finalPrice,
        wasUnsold: record.wasUnsold,
      })),
  );

  readonly upcoming = computed(() => this.auctionFacade.nextUpPlayers().slice(0, 6));
}
