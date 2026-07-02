import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { FullscreenService } from '../../../../core/services/fullscreen/fullscreen.service';
import { CurrentPlayerCard } from '../../components/current-player-card/current-player-card';
import { BiddingConsole } from '../../components/bidding-console/bidding-console';
import { TeamPurseStrip } from '../../components/team-purse-strip/team-purse-strip';
import { SoldUnsoldOverlay } from '../../components/sold-unsold-overlay/sold-unsold-overlay';
import { AuctionSidebar } from '../../components/auction-sidebar/auction-sidebar';

@Component({
  selector: 'app-auction-stage-page',
  imports: [CurrentPlayerCard, BiddingConsole, TeamPurseStrip, SoldUnsoldOverlay, AuctionSidebar],
  templateUrl: './auction-stage-page.html',
  styleUrl: './auction-stage-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class AuctionStagePage {
  readonly auctionFacade = inject(AuctionFacade);
  private readonly fullscreenService = inject(FullscreenService);

  /**
   * Auctioneer keyboard shortcuts:
   * Space = Skip / Next · Enter = Sold · Esc = Unsold ·
   * ArrowUp/Down = raise/lower asking price · F = fullscreen
   */
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase() ?? '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
      return;
    }

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.auctionFacade.skipPlayer();
        break;
      case 'Enter':
        event.preventDefault();
        this.auctionFacade.markSold();
        break;
      case 'Escape':
        event.preventDefault();
        this.auctionFacade.markUnsold();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.auctionFacade.increaseBid();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.auctionFacade.decreaseBid();
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        void this.fullscreenService.toggle();
        break;
    }
  }
}
