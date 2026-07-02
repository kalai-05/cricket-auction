import { Routes } from '@angular/router';

export const PLAYERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/player-list-page/player-list-page').then((m) => m.PlayerListPage),
  },
  {
    path: ':playerId',
    loadComponent: () =>
      import('./pages/player-detail-page/player-detail-page').then((m) => m.PlayerDetailPage),
  },
];
