import { Routes } from '@angular/router';

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/teams-overview-page/teams-overview-page').then(
        (m) => m.TeamsOverviewPage,
      ),
  },
  {
    path: ':teamId',
    loadComponent: () =>
      import('./pages/team-detail-page/team-detail-page').then((m) => m.TeamDetailPage),
  },
];
