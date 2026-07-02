import { Routes } from '@angular/router';
import { auctionInProgressGuard } from '../../core/guards/auction-in-progress.guard';
import { setupCompleteGuard } from '../../core/guards/setup-complete.guard';

export const AUCTION_ROOM_ROUTES: Routes = [
  {
    path: '',
    canActivate: [setupCompleteGuard],
    canDeactivate: [auctionInProgressGuard],
    loadComponent: () =>
      import('./pages/auction-stage-page/auction-stage-page').then((m) => m.AuctionStagePage),
  },
];
