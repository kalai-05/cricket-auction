import { Routes } from '@angular/router';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: 'teams',
    loadComponent: () =>
      import('./pages/team-setup-page/team-setup-page').then((m) => m.TeamSetupPage),
  },
  {
    path: 'players',
    loadComponent: () =>
      import('./pages/player-pool-import-page/player-pool-import-page').then(
        (m) => m.PlayerPoolImportPage,
      ),
  },
];
