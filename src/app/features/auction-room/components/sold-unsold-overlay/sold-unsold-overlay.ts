import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';

interface OverlayState {
  visible: boolean;
  wasUnsold: boolean;
  playerName: string;
  teamName: string | null;
  price: number | null;
}

@Component({
  selector: 'app-sold-unsold-overlay',
  imports: [CreditPill],
  templateUrl: './sold-unsold-overlay.html',
  styleUrl: './sold-unsold-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoldUnsoldOverlay {
  private readonly auctionFacade = inject(AuctionFacade);
  private readonly teamFacade = inject(TeamFacade);
  private readonly playerFacade = inject(PlayerFacade);

  readonly state = signal<OverlayState>({
    visible: false,
    wasUnsold: false,
    playerName: '',
    teamName: null,
    price: null,
  });

  private previousLogLength = this.auctionFacade.soldLog().length;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const log = this.auctionFacade.soldLog();
      if (log.length > this.previousLogLength) {
        const record = log[log.length - 1];
        const player = this.playerFacade.getById(record.playerId);
        const team = record.teamId ? this.teamFacade.getById(record.teamId) : null;

        this.state.set({
          visible: true,
          wasUnsold: record.wasUnsold,
          playerName: player?.name ?? 'Player',
          teamName: team?.name ?? null,
          price: record.finalPrice,
        });

        if (this.hideTimer) clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(() => {
          this.state.update((s) => ({ ...s, visible: false }));
        }, 2200);
      }
      this.previousLogLength = log.length;
    });
  }
}
