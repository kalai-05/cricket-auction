import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuctionPhase } from '../../../../core/models/enums/auction-phase.enum';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { TeamBadge } from '../../../../shared/components/team-badge/team-badge';
import { BidCountdown } from '../bid-countdown/bid-countdown';

@Component({
  selector: 'app-bidding-console',
  imports: [MatButtonModule, MatIconModule, GlassPanelDirective, CreditPill, TeamBadge, BidCountdown],
  templateUrl: './bidding-console.html',
  styleUrl: './bidding-console.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiddingConsole {
  readonly auctionFacade = inject(AuctionFacade);
  readonly teamFacade = inject(TeamFacade);

  readonly AuctionPhase = AuctionPhase;

  placeBid(teamId: string): void {
    this.auctionFacade.placeBid(teamId);
  }

  setIncrement(step: number): void {
    this.auctionFacade.setIncrement(step);
  }

  markSold(): void {
    this.auctionFacade.markSold();
  }

  markUnsold(): void {
    this.auctionFacade.markUnsold();
  }

  skip(): void {
    this.auctionFacade.skipPlayer();
  }

  resetBid(): void {
    this.auctionFacade.resetBid();
  }

  undo(): void {
    this.auctionFacade.undoLastAction();
  }

  start(): void {
    this.auctionFacade.startAuction();
  }

  pauseOrResume(): void {
    if (this.auctionFacade.phase() === AuctionPhase.Paused) {
      this.auctionFacade.resume();
    } else {
      this.auctionFacade.pause();
    }
  }
}
