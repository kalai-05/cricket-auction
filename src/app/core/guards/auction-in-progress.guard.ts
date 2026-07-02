import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AuctionFacade } from '../facades/auction.facade';

export interface DeactivatableAuctionStage {
  readonly canLeaveStage?: () => boolean;
}

export const auctionInProgressGuard: CanDeactivateFn<DeactivatableAuctionStage> = (component) => {
  const auctionFacade = inject(AuctionFacade);

  if (component.canLeaveStage?.() === false) {
    return false;
  }

  if (auctionFacade.isRunning() && auctionFacade.currentPlayer()) {
    return window.confirm('The auction is live. Leave this screen anyway?');
  }

  return true;
};
