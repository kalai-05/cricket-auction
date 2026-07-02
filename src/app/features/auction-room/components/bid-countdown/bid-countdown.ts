import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuctionFacade } from '../../../../core/facades/auction.facade';

@Component({
  selector: 'app-bid-countdown',
  templateUrl: './bid-countdown.html',
  styleUrl: './bid-countdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidCountdown {
  readonly auctionFacade = inject(AuctionFacade);

  readonly visible = computed(
    () =>
      this.auctionFacade.timerEnabled() &&
      this.auctionFacade.isRunning() &&
      this.auctionFacade.currentPlayer() !== null,
  );

  readonly hammerText = computed(() => {
    switch (this.auctionFacade.hammerPhase()) {
      case 'going-once':
        return 'Going Once...';
      case 'going-twice':
        return 'Going Twice...';
      default:
        return '';
    }
  });
}
