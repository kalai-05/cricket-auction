import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/onboarding/pages/welcome-page/welcome-page').then((m) => m.WelcomePage),
  },
  {
    path: 'setup',
    loadChildren: () =>
      import('./features/onboarding/onboarding.routes').then((m) => m.ONBOARDING_ROUTES),
  },
  {
    path: 'auction',
    loadChildren: () =>
      import('./features/auction-room/auction-room.routes').then((m) => m.AUCTION_ROOM_ROUTES),
  },
  {
    path: 'teams',
    loadChildren: () => import('./features/teams/teams.routes').then((m) => m.TEAMS_ROUTES),
  },
  {
    path: 'players',
    loadChildren: () => import('./features/players/players.routes').then((m) => m.PLAYERS_ROUTES),
  },
  {
    path: 'history',
    loadChildren: () => import('./features/history/history.routes').then((m) => m.HISTORY_ROUTES),
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./features/statistics/statistics.routes').then((m) => m.STATISTICS_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
  },
  // Friendly aliases
  { path: 'dashboard', redirectTo: 'auction' },
  { path: 'results', redirectTo: 'statistics' },
  { path: '**', redirectTo: '' },
];
